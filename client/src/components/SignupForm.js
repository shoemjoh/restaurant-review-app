// SignupForm.js
import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import "./SignupForm.css";

function SignupForm({ onSignup }) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [redirectToReview, setRedirectToReview] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch("/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password }),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Signup failed");
                }
            })
            .then((data) => {
                onSignup(data.id); // Set user ID in App after signup
                setRedirectToReview(true);
            })
            .catch((error) => console.error("Error:", error));
    };

    if (redirectToReview) {
        return <Redirect to="/submit-review" />;
    }

    return (
        <div className="signup-form-container">
            <h2 className="signup-form-title">Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <input
                    className="signup-form-input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    required
                />
                <input
                    type="email"
                    className="signup-form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    className="signup-form-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <button type="submit" className="signup-form-button">
                    Sign Up
                </button>
            </form>
            <p className="signup-form-text">
                Already have an account? <a href="/login">Log in</a>
            </p>
        </div>
    );
}

export default SignupForm;
