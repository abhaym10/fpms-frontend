import {useState} from "react";
import {useNavigate} from "react-router-dom";
import pageStyle from "../styles/pageStyle";
import {cardStyle} from "../styles/components";

function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email,setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleRegister(e) {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("https://fpms-backend-19w5.onrender.com/api/auth/register", {
                method: "POST",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify({name, email, password}),
            });

            const data = await res.json();

            if (!res.ok) {
                setError (data.error || "Registration failed");
                return;
            }

            localStorage.setItem("token", data.token);
            navigate("/projects");
        } catch (err) {
            setError("Server error");
        }
    }

    return (
        <div style = {pageStyle}>
            <div style={{...cardStyle, maxWidth: "400px", margin: "80px auto"}}>
                <h2> 📝 Register</h2>

                {error && <p style={{color: "red"}}>{error}</p>}

                <form onSubmit = {handleRegister}>
                    <input
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={styles.input}
                    />

                    <input 
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.input}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                    />

                    <button type="submit">Create Account</button>
                </form>
            </div>
        </div>
    );
}

const styles = {
    input: {
        width: "100%",
        padding: "10px",
        marginBottom: "12px",
    },
};

export default Register;
