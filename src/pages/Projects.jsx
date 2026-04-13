import ProjectCard from "../components/ProjectCard";
import pageStyle from "../styles/pageStyle";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";

function Projects({ projects = [] }) {

    return (
        <Layout>
            <div style={pageStyle}>
                <h2>My Projects</h2>
                {projects.length == 0 &&
                    <div style={{ textAlign: "center", marginTop: "60px" }}>
                        <h3>No projects yet 🎬</h3>
                        <p style={{ color: "#aaa" }}>
                            Start your first film production project
                        </p>

                        <Link to="/create">
                            <button style={styles.button}>
                                + Create Project
                            </button>
                        </Link>
                    </div>
                }
                {projects.map((project) => (
                    <ProjectCard key={project._id} project={project} />
                ))}
            </div>
        </Layout>
    );
}

const styles = {
    button: {
        marginTop: "16px",
        padding: "10px 16px",
        background: "#2ecc71",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600",
    }
}

export default Projects;

