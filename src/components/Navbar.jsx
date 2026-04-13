import { Link } from "react-router-dom";
import theme from "../styles/theme";

function Navbar() {
    const token = localStorage.getItem("token");
    function handleLogout() {
        localStorage.removeItem("token");
        window.location.href = "/login";
    }

    return (
        <div style={styles.nav}>
            <h3 style={styles.logo}>🎬 FPMS</h3>
            <div style={styles.links}>
                {token ? (
                    <>
                        <Link to="/projects" style={styles.link}>Projects</Link>
                        <Link to="/create" style={styles.link}>Create Project</Link>
                        <button onClick={handleLogout}
                                style={styles.logoutBtn}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={styles.link}>Login</Link>
                        <Link to="/register" style={styles.link}>Register</Link>
                    </>
                )}
            </div>
        </div>
    );
}

export default Navbar;

const styles = {
    nav: {
        height: "60px",
        background: "rgba(13, 13, 13, 0.8)",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0px 32px",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid #222",
    },
    logo: {
        margin: 0,
    },
    links: {
        display: "flex",
        alignItems: "center",
        gap: "20px",
    },
    link: {
        color: "#aaa",
        textDecoration: "none",
        fontWeight: "500",
    },
    logoutBtn: {
        padding: "6px 12px",
        background: "#e74c3c",
        border: "none",
        borderRadius: "6px",
        color: "white",
        cursor: "pointer",
    },
};