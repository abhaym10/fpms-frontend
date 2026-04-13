import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import pageStyle from "../styles/pageStyle";
import theme from "../styles/theme";
import { cardStyle } from "../styles/components";
import { authFetch } from "../utils/authFetch";
import Layout from "../components/Layout";

function Scenes() {
    const { projectId } = useParams();
    const [scenes, setScenes] = useState([]);

    useEffect(() => {
        loadScenes();
    }, [projectId]);

    const [sceneNumber, setSceneNumber] = useState("");
    const [location, setLocation] = useState("");
    const [timeOfDay, setTimeOfDay] = useState("Day");
    const [status, setStatus] = useState("Not Shot");
    const [editingSceneId, setEditingSceneId] = useState(null);

    const [crew, setCrew] = useState([]);

    useEffect(() => {
        if (!projectId) return;
        authFetch(`http://localhost:5000/api/projects/${projectId}/crew`)
            .then(res => res.json())
            .then(data => setCrew(Array.isArray(data) ? data : []))
            .catch(console.error);
    }, [projectId]);

    function loadCrew() {
        authFetch(`http://localhost:5000/api/projects/${projectId}/crew`)
            .then(res => res.json())
            .then(setCrew)
            .catch(console.error);
    }

    function addScene(e) {
        e.preventDefault();

        if (!sceneNumber.trim() || !location.trim()) {
            alert("Scene number and location are required");
            return;
        }

        const payload = {
            sceneNumber,
            location,
            timeOfDay,
            status,
        };

        if (editingSceneId) {
            authFetch(`http://localhost:5000/api/projects/${projectId}/scenes/${editingSceneId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })
                .then((res) => res.json())
                .then((updatedScene) => {
                    setScenes((prev) =>
                        prev.map((s) => (s._id === editingSceneId ? updatedScene : s))
                    );
                    setEditingSceneId(null);
                    setSceneNumber("");
                    setLocation("");
                    setTimeOfDay("Day");
                    setStatus("Not Shot");
                })
                .catch(console.error);
        } else {
            authFetch(`http://localhost:5000/api/projects/${projectId}/scenes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })
                .then((res) => res.json())
                .then(() => {
                    loadScenes();

                    setSceneNumber("");
                    setLocation("");
                    setTimeOfDay("Day");
                    setStatus("Not Shot");
                })
                .catch(console.error);
        }
    }

    function deleteScene(sceneId) {
        authFetch(`http://localhost:5000/api/projects/${projectId}/scenes/${sceneId}`,
            { method: "DELETE" }
        ).then(() => {
            loadScenes();
        });
    }

    function updateScene(sceneId, updatedData) {
        authFetch(
            `http://localhost:5000/api/projects/${projectId}/scenes/${sceneId}`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedData),
            }
        )
            .then((res) => res.json())
            .then((updatedScene) => {
                setScenes((prev) =>
                    prev.map((s) => (s._id === sceneId ? updatedScene : s))
                );

                loadScenes();
                setEditingSceneId(null);
                setSceneNumber("");
                setLocation("");
                setTimeOfDay("Day");
                setStatus("Not Shot");
            })
            .catch(console.error);
    }

    function getStatusBorder(status) {
        if (status === "Shot") return "6px solid #2ecc71";
        if (status === "Re-Shoot") return "6px solid #e67e22";
        return "6px solid #555";
    }


    function getStatusColor(status) {
        if (status === "Shot") return theme.colors.success;
        if (status === "Re-Shoot") return theme.colors.warning;
        return theme.colors.textSecondary;
    }

    function loadScenes() {
        authFetch(`http://localhost:5000/api/projects/${projectId}/scenes`)
            .then((res) => res.json())
            .then((data) => setScenes(data))
            .catch(console.error);
    }

    const totalScenes = scenes.length;

    const shotScenes = scenes.filter(
        (scene) => scene.status === "Shot"
    ).length;

    const reshootScenes = scenes.filter(
        (scene) => scene.status === "Re-Shoot"
    ).length;

    const notShotScenes = totalScenes - shotScenes - reshootScenes;

    const progressPercent =
        totalScenes === 0
            ? 0
            : Math.round((shotScenes / totalScenes) * 100);

    function getStatusChip(status) {
        const base = {
            padding: "4px 10px",
            borderRadius: "99px",
            fontSize: "12px",
            fontWeight: "600",
        };

        if (status === "Shot") {
            return { ...base, background: "#143d2a", color: "#2ecc71" };
        }

        if (status === "Re-Shoot") {
            return { ...base, background: "#3d1f1f", color: "#e67e22" };
        }

        return { ...base, background: "#2a2a2a", color: "#aaa" };
    }

    return (
        <Layout>
            <div style={pageStyle}>
                <h2 style={{ marginBottom: "6px" }}>🎬 Scene Management</h2>
                <div style={{ margin: "20px 0" }}>
                    <p style={{ marginBottom: "6px" }}>
                        🎬 Progress: <strong>{progressPercent}%</strong>
                    </p>

                    <div
                        style={{
                            height: "10px",
                            background: "#333",
                            borderRadius: "6px",
                            overflow: "hidden",
                        }}
                    >
                        <div style={{
                            width: `${progressPercent}%`,
                            height: "100%",
                            background: "#2ecc71",
                            translation: "width 0.3s ease",
                        }}
                        />
                    </div>

                    <div style={{ marginTop: "10px", fontSize: "14px", color: "#ccc" }}>
                        🟢 Shot: {shotScenes} &nbsp; | &nbsp;
                        🟡 Re-Shoot: {reshootScenes} &nbsp; | &nbsp;
                        ⚪ Not Shoot: {notShotScenes}
                    </div>
                </div>

                <p style={{ color: "#aaa", margin: 0 }}>
                    Add , edit and track shooting progress for this project
                </p>

                {/*Add Scene Form*/}
                <div style={cardStyle}>
                    <form style={styles.form}>
                        <input
                            type="number"
                            placeholder="Scene Number"
                            value={sceneNumber}
                            onChange={(e) => setSceneNumber(e.target.value)}
                            required
                            style={styles.input}
                            onFocus={(e) =>
                                (e.currentTarget.style.boxShadow = `0 0 0 2px ${theme.colors.accent}`)
                            }
                            onBlur={(e) =>
                                (e.currentTarget.style.boxShadow = "none")
                            }
                        />

                        <input
                            placeholder="Location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            required
                            style={styles.input}
                            onFocus={(e) =>
                                (e.currentTarget.style.boxShadow = `0 0 0 2px ${theme.colors.accent}`)
                            }
                            onBlur={(e) =>
                                (e.currentTarget.style.boxShadow = "none")
                            }
                        />

                        <select
                            value={timeOfDay}
                            onChange={(e) => setTimeOfDay(e.target.value)}
                            style={styles.input}
                            onFocus={(e) =>
                                (e.currentTarget.style.boxShadow = `0 0 0 2px ${theme.colors.accent}`)
                            }
                            onBlur={(e) =>
                                (e.currentTarget.style.boxShadow = "none")
                            }
                        >
                            <option>Day</option>
                            <option>Night</option>
                        </select>

                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            style={styles.input}
                            onFocus={(e) =>
                                (e.currentTarget.style.boxShadow = `0 0 0 2px ${theme.colors.accent}`)
                            }
                            onBlur={(e) =>
                                (e.currentTarget.style.boxShadow = "none")
                            }
                        >
                            <option>Not Shot</option>
                            <option>Shot</option>
                            <option>Re-Shoot</option>
                        </select>

                        <input
                            className="full"
                            style={styles.input}
                            onFocus={(e) =>
                                (e.currentTarget.style.boxShadow = `0 0 0 2px ${theme.colors.accent}`)
                            }
                            onBlur={(e) =>
                                (e.currentTarget.style.boxShadow = "none")
                            }
                        />

                        {editingSceneId ? (
                            <button
                                type="button"
                                onClick={() =>
                                    updateScene(editingSceneId, {
                                        sceneNumber,
                                        location,
                                        timeOfDay,
                                        status,
                                    })
                                }
                            >
                                ✅ Update Scene
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={addScene}
                            >
                                ➕ Add Scene
                            </button>
                        )}

                    </form>
                </div>

                {/* Scene List */}
                <div style={{ marginTop: "30px" }}>
                    {scenes.length === 0 && <p>No Scenes added yet</p>}

                    {scenes.map((scene, index) => (
                        <div
                            key={scene._id}
                            style={{
                                ...cardStyle,
                                borderLeft: getStatusBorder(scene.status),

                                background:
                                    editingSceneId === scene._id
                                        ? "#16202a"
                                        : "#1c1c1c",
                            }}


                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-3px)";
                                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.4)"
                            }}

                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "none";
                            }}

                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: "6px",
                                }}
                            >

                                <h4 style={{ margin: 0 }}>
                                    Scene {scene.sceneNumber || index + 1}
                                </h4>

                                <span style={getStatusChip(scene.status)}>
                                    {scene.status}
                                </span>
                            </div>

                            <p style={{ color: "#ccc", margin: 0 }}>
                                📍 {scene.location}
                            </p>

                            <p style={{ color: "#888", margin: 0 }}>
                                🌓 {scene.timeOfDay}
                            </p>

                            <p style={{ color: "#aaa", marginTop: "6px" }}>
                                👥 Crew:{" "}
                                {crew.filter(member =>
                                    Array.isArray(member.scenes) &&
                                    member.scenes.includes(String(scene.sceneNumber))
                                ).length > 0
                                    ? crew
                                        .filter(member =>
                                            Array.isArray(member.scenes) &&
                                            member.scenes.includes(String(scene.sceneNumber))
                                        )
                                        .map(member => member.name)
                                        .join(", ")
                                    : "Not assigned"}
                            </p>

                            <button
                                style={styles.editBtn}
                                onClick={() => {
                                    setEditingSceneId(scene._id);
                                    setSceneNumber(scene.sceneNumber || "");
                                    setLocation(scene.location || "");
                                    setTimeOfDay(scene.timeOfDay || "Day");
                                    setStatus(scene.status || "Not Shot");
                                }}
                                onMouseEnter={(e) =>
                                    (e.target.style.transform = "scale(1.05)")
                                }
                                onMouseLeave={(e) =>
                                    (e.target.style.transform = "scale(1)")
                                }
                            >
                                ✏️ Edit
                            </button>

                            <button
                                style={styles.deleteBtn}
                                onClick={() => deleteScene(scene._id)}
                                onMouseEnter={(e) =>
                                    (e.target.style.transform = "scale(1.05)")
                                }
                                onMouseLeave={(e) =>
                                    (e.target.style.transform = "scale(1)")
                                }
                            >
                                🗑️ Delete
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
}
export default Scenes;

const styles = {
    page: {
        minHeight: "100vh",
        background: theme.colors.bg,
        color: theme.colors.textPrimary,
        padding: "40px",
    },
    form: {
        maxWidth: "500px",
        flexDirection: "column",
        display: "grid",
        gridTemplateColumn: "1fr 1fr",
        gap: "12px",
    },
    input: {
        padding: "12px",
        background: theme.colors.panel,
        border: `1px solid ${theme.colors.border}`,
        color: theme.colors.textPrimary,
        borderRadius: theme.radius.sm,
        cursor: "pointer",
        fontWeight: "bold",
        transition: "border 0.15s ease , box-shadow 0.15s ease",
    },
    sceneCard: {
        background: theme.colors.card,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.radius.md,
        padding: "15px",
        marginBotton: "10px",
        transition: "transform 0.2s ease , box-shadow 0.2s ease",
    },
    editButton: {
        marginTop: "8px",
        padding: "6px 10px",
        background: "#444",
        border: "none",
        color: "white",
        cursor: "pointer",
    },
    deleteButton: {
        marginTop: "8px",
        marginLeft: "8px",
        padding: "6px 10px",
        background: theme.colors.danger,
        border: "none",
        color: theme.colors.textPrimary,
        cursor: "pointer",
        borderRadius: theme.radius.sm,
    },
    panel: {
        background: theme.colors.panel,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.radius.md,
        padding: "20px",
        maxWidth: "600px",
    },
    full: {
        gridColumn: "1 / -1",
    },
    actions: {
        display: "flex",
        gap: "10px",
        marginTop: "10px",
    },
    editBtn: {
        background: theme.colors.border,
        color: theme.colors.textPrimary,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.radius.sm,
        padding: "6px 12px",
        cursor: "pointer",
        transition: "all 0.15s ease",
    },
    deleteBtn: {
        background: theme.colors.danger,
        color: theme.colors.textPrimary,
        border: "none",
        borderRadius: theme.radius.sm,
        padding: "6px 12px",
        cursor: "pointer",
        transition: "all 0.15s ease",
    },
};