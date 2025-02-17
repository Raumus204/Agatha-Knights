import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";


export default function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { setAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, { 
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                // Log in the user after successful registration
                const loginResponse = await fetch(`${import.meta.env.VITE_API_URL}/users/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password }),
                });

                const loginData = await loginResponse.json();
                if (loginResponse.ok) {
                    localStorage.setItem('token', loginData.token);
                    localStorage.setItem('username', loginData.user.username);
                    localStorage.setItem('userId', loginData.user._id);
                    setAuth({ isAuthenticated: true, user: loginData.user });
                    navigate("/"); // Redirect to home page
                } else {
                    alert(loginData.message);
                }
            } else if (response.status === 409) {
                console.error("Username already exists:", data.message);
                alert("Username already exists.");
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Error creating user:", error);
            alert("Failed to create user.");
        }
    };
    
    return (
        <div className="login-container">
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Username:
                    <input
                        type="text"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </label>
                <br />
                <label>
                    Password:
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>
                <br />
                <button type="submit">Register</button>
            </form>
            <p>Already have an account?</p>
            <Link to="/Login">Login</Link>
        </div>
    );
}