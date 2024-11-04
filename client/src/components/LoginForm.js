import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./LoginForm.css"; // Optional CSS file for styling

function LoginForm({ onLogin }) {
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Define validation schema with Yup
    const validationSchema = Yup.object({
        username: Yup.string().required("Username is required"),
        password: Yup.string().required("Password is required"),
    });

    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
        },
        validationSchema,
        onSubmit: (values) => {
            fetch("/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
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
                    navigate('/restaurants');
                })
                .catch((error) => {
                    console.error("Error logging in:", error);
                    setError(error.message); // Display error to user
                });
        },
    });

    return (
        <div className="login-form-container">
            <h2 className="login-form-title">Log In</h2>
            {error && <p className="login-form-error">{error}</p>}
            <form onSubmit={formik.handleSubmit}>
                <input
                    className="login-form-input"
                    name="username"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    placeholder="Username"
                    required
                />
                {formik.touched.username && formik.errors.username ? (
                    <div className="login-form-error">{formik.errors.username}</div>
                ) : null}
                <input
                    type="password"
                    className="login-form-input"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    placeholder="Password"
                    required
                />
                {formik.touched.password && formik.errors.password ? (
                    <div className="login-form-error">{formik.errors.password}</div>
                ) : null}
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


