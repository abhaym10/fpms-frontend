import { Link } from "react-router-dom";
import pageStyle from "../styles/pageStyle";

function Home() {
    const token = localStorage.getItem("token");
    return (
        <div style={{...pageStyle, animation: "fadeIn 0.5s ease", background: "radial-gradient(circle at 20% 20%, rgba(46, 204, 113, 0.15), transparent 40%), #0f0f0f",}}>
            <section style={styles.hero}>
                <h1 style={styles.title}>
                    🎬 Film Production Management System
                </h1>
                <p style={styles.subtitle}>
                    Plan. Shoot. Track. Deliver your film production efficiently.
                </p>
                {!token ? (
                    <div style={styles.buttonGroup}>
                        <Link to="/login">
                            <button style={styles.primaryBtn}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.boxShadow = "0 0 20px #2ecc71";
                                    e.currentTarget.style.transform = "scale(1.05)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.boxShadow = "none";
                                    e.currentTarget.style.transform = "scale(1)";
                                }}
                            >Login</button>
                        </Link>
                        <Link to="/register">
                            <button style={styles.secondaryBtn}>Register</button>
                        </Link>
                    </div>
                ) : (
                    <Link to="/projects">
                        <button style={styles.primaryBtn}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.boxShadow = "0 0 20px #2ecc71";
                                e.currentTarget.style.transform = "scale(1.05)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.boxShadow = "none";
                                e.currentTarget.style.transform = "scale(1)";
                            }}
                        >Go to Projects</button>
                    </Link>
                )}
            </section>

            <section style={styles.features}>
                <div style={styles.card}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
                        e.currentTarget.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.6)";
                        e.currentTarget.style.border = "1px solid #2ecc71";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0) scale(1)";
                        e.currentTarget.style.boxShadow = "none";
                        e.currentTarget.style.border = "1px solid #2a2a2a";
                    }}
                >
                    <h3>🎬 Scene Management</h3>
                    <p>Organize and track every scene efficiently</p>
                </div>

                <div style={styles.card}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
                        e.currentTarget.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.6)";
                        e.currentTarget.style.border = "1px solid #2ecc71";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0) scale(1)";
                        e.currentTarget.style.boxShadow = "none";
                        e.currentTarget.style.border = "1px solid #2a2a2a";
                    }}
                >
                    <h3>💰 Budget Tracking</h3>
                    <p>Monitor expenses and stay within budget</p>
                </div>

                <div style={styles.card}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
                        e.currentTarget.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.6)";
                        e.currentTarget.style.border = "1px solid #2ecc71";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0) scale(1)";
                        e.currentTarget.style.boxShadow = "none";
                        e.currentTarget.style.border = "1px solid #2a2a2a";
                    }}
                >
                    <h3>📅 Scheduling</h3>
                    <p>Plan and manage your shoot schedule easily</p>
                </div>
            </section>

            <section style={styles.cta}>
                <h2 style={{ marginBottom: "20px" }}>
                    Start your film production today 🚀
                </h2>

                <Link to={token ? "/projects" : "/register"}>
                    <button style={styles.primaryBtn}>
                        Get Started
                    </button>
                </Link>
            </section>
        </div>
    );
}

const styles = {
    page: {
        background: "#0f0f0f",
        color: "white",
        minHeight: "100vh",
        padding: "40px 20px",
    },
    hero: {
        width: "100%",

        textAlign: "left",
    },
    title: {
        fontSize: "48px",
        marginBottom: "16px",
    },
    subtitle: {
        color: "#aaa",
        marginBottom: "30px",
        gap: "18px",
    },
    buttonGroup: {
        display: "flex",
        justifyContent: "flex-start",
        gap: "16px",
    },
    primaryBtn: {
        padding: "12px 24px",
        background: "#2ecc71",
        border: "none",
        borderRadius: "10px",
        color: "black",
        fontWeight: "bold",
        cursor: "pointer",
        transition: "all 0.3s ease",
    },
    secondaryBtn: {
        padding: "12px 24px",
        background: "transparent",
        border: "1px solid #2ecc71",
        borderRadius: "8px",
        color: "#2ecc71",
        cursor: "pointer",
    },
    features: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "20px",
        marginBottom: "80px",
        width: "100%",
        marginInline: "auto",
    },
    card: {
        background: "linear-gradient(145deg, #1a1a1a, #111",
        padding: "20px",
        borderRadius: "12px",
        border: "1px solid #2a2a2a",
        transition: "all 0.3s ease",
        cursor: "pointer",
    },
    cta: {
        textAlign: "center",
    },
};

export default Home;