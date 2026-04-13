import {useState} from "react";
import {useNavigate} from "react-router-dom";
import pageStyle from "../styles/pageStyle";
import {cardStyle} from "../styles/components";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    
    async function handleLogin(e) {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email , password}),
            });

            const data = await res.json();

            if(!res.ok) {
                setError(data.error || "Login failed");
                return;
            }

            localStorage.setItem("token" , data.token);

            window.location.href = "/projects";
        } catch (err) {
            setError("Server error");
        }
    }

    return (
        <div style={pageStyle}>
            <div style={{...cardStyle, maxWidth: "400px", margin: "80px auto"}}>
                <h2>🔐 Login</h2>

                {error && <p style={{color: "red"}}>{error}</p>}

                <form onSubmit={handleLogin}>
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

                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
};

const styles={
    input: {
        width: "100%",
        padding: "10px",
        marginBottom: "12px",
    },
};

export default Login;