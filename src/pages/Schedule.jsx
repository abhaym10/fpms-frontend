import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import pageStyle from "../styles/pageStyle";
import theme from "../styles/theme";
import { authFetch } from "../utils/authFetch";
import Layout from "../components/Layout";

function Schedule() {
    const { projectId } = useParams();

    const [items, setItems] = useState([]);
    const [date, setDate] = useState("");
    const [scene, setScene] = useState("");
    const [location, setLocation] = useState("");
    const [status, setStatus] = useState("Planned");
    const [notes, setNotes] = useState("");

    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        loadSchedule();
        if (!projectId) return;
    }, [projectId]);

    function loadSchedule() {
        authFetch(`http://localhost:5000/api/projects/${projectId}/schedule`)
            .then((res) => res.json())
            .then((data) => {
                const sorted = data.sort(
                    (a, b) => new Date(a.date) - new Date(b.date)
                );
                setItems(sorted);
            })
            .catch(console.error);
    }

    function addSchedule(e) {
        e.preventDefault();

        if (!date || !scene) {
            alert("Date and scene are required");
            return;
        }

        const payload = { date, scene, location, status, notes };

        if (editingId) {
            authFetch(`http://localhost:5000/api/projects/${projectId}/schedule/${editingId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })
                .then((res) => res.json())
                .then(() => {
                    setEditingId(null);
                    loadSchedule();
                    resetForm();
                })
                .catch(console.error);
        } else {
            authFetch(`http://localhost:5000/api/projects/${projectId}/schedule`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })
                .then((res) => res.json())
                .then(() => {
                    loadSchedule();
                    resetForm();
                })
                .catch(console.error);
        }

        console.log("Sending payload:", {
            date,
            scene,
            location,
            status,
            notes,
        });
    }

    function deleteItem(id) {
        authFetch(
            `http://localhost:5000/api/projects/${projectId}/schedule/${id}`,
            { method: "DELETE" }
        ).then(loadSchedule);
    }

    function resetForm() {
        setDate("");
        setScene("");
        setLocation("");
        setStatus("Planned");
        setNotes("");
    }

    function getStatusStyle(status) {
        if (status === "Completed")
            return { background: "#143d2a", color: "#2ecc71" };

        if (status === "Cancelled")
            return { background: "#3d1f1f", color: "#e74c3c" };

        return { background: "#2a2a2a", color: "#aaa" };
    }

    function groupByDate(items) {
        return items.reduce((acc, item) => {
            const dateKey = new Date(item.date).toDateString();
            if (!acc[dateKey]) acc[dateKey] = [];
            acc[dateKey].push(item);
            return acc;
        }, {});
    }

    function getDateBadge(dateStr) {
        const today = new Date();
        const d = new Date(dateStr);

        today.setHours(0, 0, 0, 0);
        d.setHours(0, 0, 0, 0);

        if (d.getTime() === today.getTime()) return "Today";
        if (d > today) return "Upcoming";
        return "Past";
    }

    function getTimelineBorder(status) {
        if (status === "Completed") return "#2ecc71";
        if (status === "Cancelled") return "#e74c3c";
        return "#f1c40f";
    }

    function startEdit(item) {
        setEditingId(item._id);
        setDate(item.date?.slice(0, 10) || "");
        setScene(item.scene || "");
        setLocation(item.location || "");
        setStatus(item.status || "Planned");
        setNotes(item.notes || "");
    }

    return (
        <Layout>
            <div style={pageStyle}>
                <h2 style={{ marginBottom: "20px" }}>📅 Shooting Schedule</h2>

                <div style={styles.panel}>
                    <form onSubmit={addSchedule} style={styles.form}>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                            style={styles.input}
                        />

                        <input
                            placeholder="Scene"
                            value={scene}
                            onChange={(e) => setScene(e.target.value)}
                            required
                            style={styles.input}
                        />

                        <input
                            placeholder="Location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            style={styles.input}
                        />

                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            style={styles.input}
                        >
                            <option>Planned</option>
                            <option>Completed</option>
                            <option>Cancelled</option>
                        </select>

                        <input
                            placeholder="Notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            style={{ ...styles.input, gridColoumn: "1/ -1" }}
                        />

                        <button type="submit" styles={styles.button}>
                            {editingId ? "✅ Update Schedule" : "➕ Add Schedule"}
                        </button>
                    </form>
                </div>

                <div style={{ marginTop: "30px" }}>
                    {items.length === 0 && <p>No schedule added yet</p>}

                    {Object.entries(groupByDate(items)).map(([date, dayItems]) => (
                        <div key={date} style={{ marginBottom: "24px" }}>
                            <h3 style={{ marginBottom: "10px", color: "#ddd" }}>
                                📅 {date}
                            </h3>

                            {dayItems.map((item) => (
                                <div
                                    key={item._id}
                                    style={{
                                        ...styles.card,
                                        borderLeft: `4px solid ${getTimelineBorder(item.status)}`
                                    }}>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <strong>
                                            🎬 {item.scene}
                                            <span style={styles.badge}>
                                                {getDateBadge(item.date)}
                                            </span>
                                        </strong>
                                        <span style={getStatusStyle(item.status)}>
                                            {item.status}
                                        </span>
                                    </div>

                                    <p>📍 {item.location}</p>
                                    {item.notes && <p>📝 {item.notes}</p>}

                                    <div style={{ marginTop: "8px" }}>
                                        <button onClick={() => startEdit(item)}>✏️ Edit</button>
                                        <button onClick={() => deleteItem(item._id)}>🗑️ Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
}

export default Schedule;

const styles = {
    panel: {
        background: theme.colors.panel,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.radius.md,
        padding: "20px",
        maxWidth: "700px",
    },
    form: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "12px",
        maxWidth: "700px",
    },
    input: {
        padding: "10px",
        background: theme.colors.panel,
        border: `1px solid ${theme.colors.border}`,
        color: theme.colors.textPrimary,
        borderRadius: "6px",
    },
    button: {
        gridColumn: "1/ -1",
        padding: "10px",
        background: theme.colors.accent,
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "600",
    },
    card: {
        background: theme.colors.card,
        border: `1px solid ${theme.colors.border}`,
        padding: "15px",
        borderRadius: "8px",
        marginBottom: "12px",
        borderLeft: "4px solid #444",
    },
    deleteBtn: {
        marginTop: "8px",
        padding: "6px 12px",
        background: theme.colors.danger,
        border: "none",
        color: "white",
        borderRadius: "6px",
        cursor: "pointer",
    },
    badge: {
        marginLeft: "10px",
        fontSize: "11px",
        padding: "2px 8px",
        borderRadius: "999px",
        background: "#2a2a2a",
        color: "#aaa",
    },
};