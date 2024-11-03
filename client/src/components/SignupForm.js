
import React, { useState } from "react";
import "./SignupForm.css"; // Import the CSS file

function SignupForm() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function handleSubmit(event) {
        event.preventDefault();
        // Logic to handle form submission
        console.log("Form submitted", { username, email, password });
    }

    return (
        <div className="signup-form-container">
            <h2 className="signup-form-title">Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="signup-form-input"
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="signup-form-input"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="signup-form-input"
                />
                <button type="submit" className="signup-form-button">
                    Create Account
                </button>
            </form>
            <p className="signup-form-text">Already have an account? Log in.</p>
        </div>
    );
}

export default SignupForm;
