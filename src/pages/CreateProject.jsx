import {useState} from "react";
import {useNavigate} from "react-router-dom";
import pageStyle from "../styles/pageStyle";


function CreateProject({addProject}) {
    const[title , setTitle] = useState("");
    const[genre , setGenre] = useState("");
    const[status , setStatus] = useState("Pre-production");
    const[description , setDescription] = useState("");

    const navigate = useNavigate();


    function handleSubmit(e){
        e.preventDefault();        //to prevent page relaoding


        addProject({
            title,
            genre,
            status,
            description,
        });
        navigate("/projects")

        alert("Project created successfully 🎬")

        //reset form
        setTitle("");
        setGenre("");
        setStatus("Pre-Production");
        setDescription("");
        }

    return(
        <div style = {pageStyle}>
            <h2>Create New Film Project</h2>
            <form onSubmit = {handleSubmit} style = {styles.form}>
                <input
                type = "text"
                placeholder = "Project Title"
                value = {title}
                onChange = {(e) => setTitle(e.target.value)}
                required
                style = {styles.input}
                />
                <input 
                type = "text"
                placeholder = "Genre (Drama , Thriller , etc..)"
                value = {genre}
                onChange = {(e) => setGenre(e.target.value)}
                style = {styles.input}
                />
                <select
                value = {status}
                onChange = {(e) => setStatus(e.target.value)}
                style = {styles.input}
                >
                    <option>Pre-Production</option>
                    <option>Shooting</option>
                    <option>Post-Production</option>
                </select>
                <textarea
                placeholder = "Project Description"
                value = {description}
                onChange = {(e) => setDescription(e.target.value)}
                style = {styles.textarea}
                />
                <button type = "Submit" style = {styles.button}>
                    🎬 Create Project 
                </button>
            </form>
        </div>
    );
}

export default CreateProject;

const styles = {
    page: {
        minheight: "100vh",
        background: "#111",
        color: "white",
        padding: "40px",
    },
    form: {
        maxWidth: "400px",
        marginTop: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
    },
    input: {
        padding: "10px",
        background: "#1c1c1c",
        border: "1px solid #333",
        color: "white",
    },
    textarea: {
        padding: "10px",
        background: "1c1c1c",
        border: "1px solid #333",
        color: "white",
        height: "80px",
    },
    button: {
        padding: "12px",
        background: "#ff3d3d",
        border: "none",
        cursor: "pointer",
        fontWeight: "bold",
    },
};
