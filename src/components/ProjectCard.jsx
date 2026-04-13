import {Link} from "react-router-dom";

function ProjectCard({project}) {
    console.log("Rendering ProjectCard:" , project)
    return (
        <div style={styles.card}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
            }}
        >
            <h3 style={{marginBottom: "8px"}}>{project.title}</h3>
            <p style={styles.meta}>🎭 {project.genre}</p>
            <p style={styles.meta}>📌 {project.status}</p>
            <p style={styles.date}>🕒 {new Date(project.createdAt).toLocaleDateString()}</p>

            <Link to = {`/dashboard/${project._id}`} style={styles.link}>Open Dashboard</Link>
            
        </div>
    );
}

export default ProjectCard;

const styles={
    card: {
        background: "#1c1c1c",
        border: "1px solid #2a2a2a",
        borderRadius: "10px",
        padding: "20px",
        marginBottom: "16px",
    },
    meta: {
        color: "#aaa",
        fontSize: "14px",
    },
    date: {
        color: "#666",
        fontSize: "12px",
        marginTop: "8px",
    },
    link: {
        display: "inline-block",
        marginTop: "12px",
        color: "#4dabf7",
        textDecoration: "none",
    },
};