import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css"; // Optional CSS file for styling

function LoginForm({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [redirectToRestaurants, setRedirectToRestaurants] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        })
            .then((response) => {
                console.log("Response status:", response.status);
                if (!response.ok) {
                    return response.json().then((data) => {
                        console.log("Error response from backend:", data);
                        throw new Error(data.error || "Login failed");
                    });
                }
                return response.json();
            })
            .then((data) => {
                console.log("Login successful:", data);
                onLogin(data.id); // Set user ID in App after login
                navigate('/restaurants')

            })
            .catch((error) => {
                console.error("Error logging in:", error);
                setError(error.message); // Display error to user
            });
    };

    return (
        <div className="login-form-container">
            <h2 className="login-form-title">Log In</h2>
            {error && <p className="login-form-error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    className="login-form-input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    required
                />
                <input
                    type="password"
                    className="login-form-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <button type="submit" className="login-form-button">
                    Log In
                </button>
            </form>
            <p className="login-form-text">
                Don't have an account? <a href="/signup">Sign up</a>
            </p>
        </div>
    );
}

export default LoginForm;

