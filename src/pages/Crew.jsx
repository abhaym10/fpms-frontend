import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import pageStyle from "../styles/pageStyle";
import { cardStyle } from "../styles/components";
import theme from "../styles/theme";
import { authFetch } from "../utils/authFetch";
import Layout from "../components/Layout";

function Crew() {
    const { projectId } = useParams();

    const [crew, setCrew] = useState([]);
    const [name, setName] = useState("");
    const [role, setRole] = useState("Actor");
    const [contact, setContact] = useState("");
    const [notes, setNotes] = useState("");
    const [assignedScenes, setAssignedScenes] = useState([]);

    const [scenes, setScenes] = useState([]);
    useEffect(() => {
        if (!projectId) return;
        authFetch(`http://localhost:5000/api/projects/${projectId}/scenes`)
            .then(res => res.json())
            .then(data => setScenes(Array.isArray(data) ? data : []))
            .catch(console.error);
    }, [projectId]);

    useEffect(() => {
        loadCrew();
    }, [projectId]);

    function loadCrew() {
        authFetch(`http://localhost:5000/api/projects/${projectId}/crew`)
            .then((res) => res.json())
            .then((data) => setCrew(Array.isArray(data) ? data : []))
            .catch(console.error);
    }

    function addCrew(e) {
        e.preventDefault();

        if (!name.trim() || !role) {
            alert("Name and role are required");
            return;
        }

        const payload = {
            name,
            role,
            contact,
            notes,
            scenes: assignedScenes,
        };

        authFetch(`http://localhost:5000/api/projects/${projectId}/crew`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        })
            .then((res) => res.json())
            .then(() => {
                loadCrew();
                setName("");
                setRole("Actor");
                setContact("");
                setNotes("");
                setAssignedScenes([]);
            })
            .catch(console.error);
    }

    function deleteCrew(id) {
        authFetch(`http://localhost:5000/api/projects/${projectId}/crew/${id}`, {
            method: "DELETE",
        })
            .then(() => loadCrew())
            .catch(console.error);
    }

    return (
        <Layout>
            <div style={pageStyle}>
                <h2 style={{ marginBottom: "20px" }}>👥 Crew Management</h2>

                <div style={{ ...cardStyle, marginBottom: "24px" }}>
                    <h3 style={{ marginBottom: "12px" }}>➕ Add Crew Member</h3>

                    <form onSubmit={addCrew} style={{ display: "grid", gap: "10px" }}>
                        <input
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={styles.input}
                        />

                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            style={styles.input}
                        >
                            <option>Actor</option>
                            <option>Director</option>
                            <option>DOP</option>
                            <option>AD</option>
                            <option>Editor</option>
                            <option>Sound</option>
                            <option>Art</option>
                            <option>Producer</option>
                            <option>Other</option>
                        </select>

                        <h4 style={{ marginTop: "16px" }}>🎬 Assign Scenes</h4>

                        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                            {scenes.map(scene => {
                                const sceneId = String(scene.sceneNumber);
                                return (
                                    <label key={scene._id} style={{ fontsize: "13px" }}>
                                        <input
                                            type="checkbox"
                                            value={sceneId}
                                            checked={assignedScenes.includes(sceneId)}
                                            onChange={() => {
                                                setAssignedScenes((prev) =>
                                                    prev.includes(sceneId)
                                                        ? prev.filter(s => s !== sceneId)
                                                        : [...prev, sceneId]
                                                );
                                            }}
                                        />
                                        {" "}Scene {scene.sceneNumber}
                                    </label>
                                )
                            })}
                        </div>

                        <input
                            placeholder="Contact"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            style={styles.input}
                        />

                        <textarea
                            placeholder="Notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            style={styles.input}
                        />

                        <button type="submit">Add Crew</button>
                    </form>
                </div>

                {crew.length === 0 && <p>No crew added yet</p>}

                {crew.map((member) => (
                    <div key={member._id} style={{ ...cardStyle, marginBottom: "12px" }}>
                        <strong>
                            👥 {member.name} - {member.role}
                        </strong>

                        {member.contact && <p>📞 {member.contact}</p>}
                        {member.notes && <p>📝 {member.notes}</p>}

                        <p>
                            🎬 Scenes:{" "}
                            {member.scenes && member.scenes.length > 0
                                ? member.scenes.join(", ")
                                : "Not Assigned"}
                        </p>
                        <button
                            onClick={() => deleteCrew(member._id)}
                            style={styles.deleteBtn}
                        >
                            🗑️ Remove
                        </button>
                    </div>
                ))}
            </div>
        </Layout>
    );
}

export default Crew;

const styles = {
    input: {
        padding: "10px",
        borderRadius: "8px",
        border: `1px solid ${theme.border}`,
        background: theme.bgCard,
        color: theme.textPrimary,
    },
    deleteBtn: {
        marginTop: "8px",
        background: theme.colors.danger,
        border: "none",
        padding: "6px 10px",
        borderRadius: "6px",
        cursor: "pointer",
        color: "white",
    },
};