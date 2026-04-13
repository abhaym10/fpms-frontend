import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import pageStyle from "../styles/pageStyle";
import { cardStyle } from "../styles/components";
import theme from "../styles/theme";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { authFetch } from "../utils/authFetch";
import Layout from "../components/Layout";

function Analytics() {
    const { projectId } = useParams();

    const [scenes, setScenes] = useState([]);
    const [budget, setBudget] = useState({ planned: 0, actual: 0, remaining: 0, expenses: [] });
    const [schedule, setSchedule] = useState([]);

    useEffect(() => {
        loadScenes();
        loadBudget();
        loadSchedule();
        if (!projectId) return;
    }, [projectId]);

    function loadScenes() {
        authFetch(`http://localhost:5000/api/projects/${projectId}/scenes`)
            .then((res) => res.json())
            .then(data => setScenes(Array.isArray(data) ? data : []))
            .catch(console.error);
    }

    function loadBudget() {
        authFetch(`http://localhost:5000/api/projects/${projectId}/budget`)
            .then((res) => res.json())
            .then(data =>
                setBudget({
                    planned: data.planned || 0,
                    actual: data.actual || 0,
                    remaining: data.remaining || 0,
                    expenses: Array.isArray(data.expenses) ? data.expenses : [],
                })
            )
            .catch(console.error);
    }

    function loadSchedule() {
        authFetch(`http://localhost:5000/api/projects/${projectId}/schedule`)
            .then((res) => res.json())
            .then(data => setSchedule(Array.isArray(data) ? data : []))
            .catch(() => setSchedule([]));
    }

    function getDayType(date) {
        const today = new Date();
        const d = new Date(date);

        today.setHours(0, 0, 0, 0);
        d.setHours(0, 0, 0, 0);

        if (d.getTime() === today.getTime()) return "today";
        if (d > today) return "upcoming";
        return "past";
    }

    const totalScenes = scenes.length;
    const shotScenes = scenes.filter(s => s.status === "Shot").length;
    const reshootScenes = scenes.filter(s => s.status === "Re-Shoot").length;
    const noShotScenes = totalScenes - shotScenes - reshootScenes;

    const burnDownData = scenes.map((scene, index) => {
        const shotTillNow = scenes
            .slice(0, index + 1)
            .filter(s => s.status === "Shot").length;

        return {
            scene: `Scene ${scene.sceneNumber || index + 1}`,
            remaining: totalScenes - shotTillNow,
        };
    });

    const idealBurnDownData = scenes.map((scene, index) => {
        return {
            scene: `Scene ${scene.sceneNumber || index + 1}`,
            idealRemaining: totalScenes - index - 1,
        };
    });

    const combinedBurnDownData = burnDownData.map((item, index) => ({
        ...item,
        idealRemaining: idealBurnDownData[index]?.idealRemaining ?? 0,
    }));

    const remainingScenes = totalScenes - shotScenes;
    const sceneProgress =
        totalScenes === 0 ? 0 : Math.round((shotScenes / totalScenes) * 100);

    const today = new Date().toISOString().split("T")[0];

    const delayedItems = schedule.filter(
        item => item.date < today && item.status !== "Shot"
    );

    return (
        <Layout>
            <div style={pageStyle}>
                <h2 style={{ marginBottom: "24px" }}>📊 Production Analytics</h2>

                <div style={{ ...cardStyle, marginBottom: "24px" }}>
                    <h3>🎬 Scene Progress</h3>

                    <p style={{ fontSize: "24px", fontWeight: "700" }}>
                        {sceneProgress}% Complete
                    </p>

                    <p style={{ color: "#aaa", fontSize: "14px" }}>
                        {sceneProgress >= 80
                            ? "🟢 On Track"
                            : sceneProgress >= 50
                                ? "🟡 At Risk"
                                : "🔴 Behind Schedule"}
                    </p>

                    <div
                        style={{
                            height: "10px",
                            background: "#2a2a2a",
                            borderRadius: "999px",
                            overflow: "hidden",
                            marginBottom: "12px",
                        }}
                    >
                        <div
                            style={{
                                width: `${sceneProgress}%`,
                                height: "100%",
                                background: theme.colors.success,
                                transition: "width 0.3s ease",
                            }}
                        />
                    </div>

                    <div style={{ fontSize: "14px", color: "#ccc", display: "flex", gap: "16px" }}>
                        <span>🟢 Shot: {shotScenes}</span>
                        <span>🟡 Re-Shoot: {reshootScenes}</span>
                        <span>⚪ Not Shot: {remainingScenes}</span>
                    </div>

                </div>

                <div style={{ ...cardStyle, marginBottom: "24px" }}>
                    <h3>📉 Scene Burn-Down Chart</h3>

                    {burnDownData.length === 0 ? (
                        <p style={{ color: "#aaa" }}>No scene data available</p>
                    ) : (
                        <div style={{ width: "100%", height: 250 }}>
                            <ResponsiveContainer>
                                <LineChart data={combinedBurnDownData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                    <XAxis dataKey="scene" stroke="#aaa" />
                                    <YAxis stroke="#aaa" allowDecimals={false} />
                                    <Tooltip />
                                    <Line
                                        type="monotone"
                                        dataKey="remaining"
                                        name="Actual Remaining"
                                        stroke="#2ecc71"
                                        strokeWidth={3}
                                        dot={{ r: 4 }}
                                    />

                                    <Line
                                        type="monotone"
                                        dataKey="idealRemaining"
                                        name="Ideal Remaining"
                                        stroke="#8884d8"
                                        strokeDasharray="5 5"
                                        strokeWidth={2}
                                        dot={false}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>

                <div style={{ ...cardStyle, marginBottom: "24px" }}>
                    <h3>💰 Budget Health</h3>

                    <p>Planned: ₹{budget.planned}</p>
                    <p>Spent: ₹{budget.actual}</p>

                    <p
                        style={{
                            color:
                                budget.remaining < 0
                                    ? theme.colors.danger
                                    : theme.colors.success,
                            fontWeight: "600",
                        }}
                    >
                        {budget.remaining < 0
                            ? `Over Budget by ₹${Math.abs(budget.remaining)}`
                            : `Remaining ₹${budget.remaining}`}
                    </p>
                </div>

                <div style={cardStyle}>
                    <h3>📅 Schedule Health</h3>

                    {delayedItems.length === 0 ? (
                        <p style={{ color: theme.colors.success }}>
                            ✅ No delays detected
                        </p>
                    ) : (
                        <>
                            <p style={{ color: theme.colors.danger }}>
                                🚨Delayed Items ({delayedItems.length})
                            </p>

                            {delayedItems.map(item => (
                                <div
                                    key={item._id}
                                    style={{
                                        marginTop: "8px",
                                        fontSize: "14px",
                                    }}
                                >
                                    🎬 Scene {item.scene} - {item.date}
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>
        </Layout>
    );
}

export default Analytics;
