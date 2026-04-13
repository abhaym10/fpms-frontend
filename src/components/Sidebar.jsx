import { Link, useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useState } from "react";

function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const { pathname } = useLocation();
    const { projectId } = useParams();

    if (!projectId) return null;

    const menu = [{ name: "Dashboard", path: `/dashboard/${projectId}` },
    { name: "Scenes", path: `/projects/${projectId}/scenes` },
    { name: "Budget", path: `/projects/${projectId}/budget` },
    { name: "Schedule", path: `/projects/${projectId}/schedule` },
    { name: "Crew", path: `/projects/${projectId}/crew` },
    { name: "Analytics", path: `/projects/${projectId}/analytics` },
    ];

    return (
        <div style={{ ...styles.sidebar, width: collapsed ? "80px" : "220px" }}>
            <h2 style={{ marginBottom: "30px", fontWeight: "700", letterSpacing: "1px" }}>🎬 FPMS</h2>
            <button onClick={() => setCollapsed(!collapsed)}
                style={{
                    marginTop: "20px",
                    background: "#1a1a1a",
                    border: "none",
                    color: "white",
                    padding: "10px",
                    borderRadius: "8px",
                    cursor: "pointer"
                }}>&#9776;</button>
            {menu.map((item) => (
                <Link
                    key={item.path}
                    to={item.path}
                    style={{
                        ...styles.link,
                        background: pathname.includes(item.path)
                            ? "#1f1f1f"
                            : "transparent",
                        color: pathname.includes(item.path)
                            ? "#2ecc71"
                            : "#aaa",
                    }}
                >
                    {!collapsed && item.name}
                </Link>
            ))}


        </div>
    );
}

const styles = {
    sidebar: {
        width: "220px",
        transition: "all 0.3s ease",
        height: "100vh",
        background: "#0d0d0d",
        padding: "20px",
        position: "fixed",
        left: 0,
        top: 0,
        borderRight: "1px solid #222",
    },
    link: {
        display: "block",
        padding: "12px",
        borderRadius: "8px",
        color: "#aaa",
        textDecoration: "none",
        marginBottom: "10px",
    },
};

export default Sidebar;