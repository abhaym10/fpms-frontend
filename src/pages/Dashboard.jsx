import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import pageStyle from "../styles/pageStyle";
import { authFetch } from "../utils/authFetch";
import Layout from "../components/Layout";

const theme = {
    bgCard: "#1c1c1c",
    bgCardHover: "#222",
    border: "#2a2a2a",
    textMuted: "#aaa",
    accent: "#2ecc71",
};

function Dashboard() {
    const { projectId } = useParams();
    const [scenes, setScenes] = useState([]);
    const [budget, setBudget] = useState({
        planned: 0,
        actual: 0,
        remaining: 0,
        expenses: [],
    });

    useEffect(() => {
        if (!projectId) return;

        authFetch(`
https://fpms-backend-19w5.onrender.com

/api/projects/${projectId}/scenes`)
            .then((res) => res.json())
            .then((data) => {
                setScenes(Array.isArray(data) ? data : []);
            })
            .catch(() => setScenes([]));

        authFetch(`
https://fpms-backend-19w5.onrender.com

/api/projects/${projectId}/budget`)
            .then(res => res.json())
            .then(data => setBudget(data))
            .catch(() => setBudget({
                planned: 0,
                actual: 0,
                remaining: 0,
                expenses: [],
            }));
    }, [projectId]);

    const totalScenes = scenes.length;
    const shotScenes = scenes.filter(
        (s) => s.status === "Shot"
    ).length;
    const reshootScenes = scenes.filter(
        (s) => s.status === "Re-Shoot"
    ).length;

    const progress =
        totalScenes === 0
            ? 0
            : Math.round((shotScenes / totalScenes) * 100);



    return (
        <Layout>
            <div style={pageStyle}>
                <h2 style={{ marginBottom: "24px" }}>Project Dashboard</h2>
                <div style={{
                    marginBottom: "32px",
                    padding: "20px",
                    background: "#151515",
                    borderRadius: "12px",
                    border: `1px solid ${theme.border}`,
                }}
                >
                    <p style={{ marginBottom: "8px", fontSize: "14px", color: theme.textMuted }}>
                        🎬 Scene Completion
                    </p>

                    <p style={{ fontSize: "24px", fontWeight: "700", marginBottom: "12px" }}>
                        {progress}% Complete
                    </p>

                    <div
                        style={{
                            height: "10px",
                            background: "#2a2a2a",
                            borderRadius: "999px",
                            overflow: "hidden",
                        }}
                    >
                        <div
                            style={{
                                width: `${progress}%`,
                                height: "100%",
                                background: theme.accent,
                                transition: "width 0.3s ease",
                            }}
                        />
                    </div>

                    <div
                        style={{
                            display: "flex",
                            gap: "16px",
                            marginTop: "12px",
                            fontSize: "13px",
                            color: theme.textMuted,
                        }}
                    >
                        <span>🟢 Shot: {shotScenes}</span>
                        <span>🟡 Re-Shoot: {reshootScenes}</span>
                        <span>⚪ Not Shot: {totalScenes - shotScenes - reshootScenes}</span>
                    </div>
                </div>



                <div style={styles.grid}>
                    <Link
                        to={`/projects/${projectId}/scenes`}
                        style={styles.card}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-4px)";
                            e.currentTarget.style.background = theme.bgCardHover;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.background = theme.bgCard;
                        }}
                    >
                        <h3 style={{ marginBottom: "8px" }}>🎬 Scenes</h3>
                        <p style={{ color: theme.textMuted }}>{totalScenes} scenes</p>
                    </Link>

                    <Link to={`/projects/${projectId}/budget`}
                        style={styles.card}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-4px)";
                            e.currentTarget.style.background = theme.bgCardHover;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.background = theme.bgCard;
                        }}
                    >
                        <h3 style={{ marginBottom: "8px" }}>💰 Budget</h3>
                        <p style={{ color: theme.textMuted }}>Track expenses & spending</p>
                    </Link>

                    <Link
                        to={`/projects/${projectId}/schedule`}
                        style={styles.card}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-4px)";
                            e.currentTarget.style.background = theme.bgCardHover;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.background = theme.bgCard;
                        }}
                    >
                        <h3 style={{ marginBottom: "8px" }}>📅 Schedule</h3>
                        <p style={{ color: theme.textMuted }}>Plan shoot dates</p>
                    </Link>

                    <Link
                        to={`/projects/${projectId}/crew`}
                        style={styles.card}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-4px)";
                            e.currentTarget.style.background = theme.bgCardHover;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.background = theme.bgCard;
                        }}
                    >
                        <h3 style={{ marginBottom: "8px" }}>👥 Crew</h3>
                        <p style={{ color: theme.textMuted }}>Cast & crew management</p>
                    </Link>

                    <Link
                        to={`/projects/${projectId}/analytics`}
                        style={styles.card}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-4px)";
                            e.currentTarget.style.background = theme.bgCardHover;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.background = theme.bgCard;
                        }}
                    >
                        <h3 style={{ marginBottom: "8px" }}>📊 Analytics</h3>
                        <p style={{ color: theme.textMuted }}>Production insights & risks</p>
                    </Link>
                </div>
            </div>
        </Layout>
    );
}

export default Dashboard;

const styles = {
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
        gap: "20px",
    },
    card: {
        background: theme.bgCard,
        border: `1px solid ${theme.border}`,
        borderRadius: "14px",
        padding: "28px",
        textDecoration: "none",
        color: "white",
        transition: "all 0.25s ease",
    },
    cardDisabled: {
        background: "#121212",
        border: "1px dashed #2a2a2a",
        borderRadius: "14px",
        padding: "28px",
        color: "#666",
        opacity: 0.7,
    },
};