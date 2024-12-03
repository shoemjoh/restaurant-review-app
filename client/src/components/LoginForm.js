import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./LoginForm.css"; // Add custom styles if needed


function LoginForm({ onLogin }) {
    const [error, setError] = useState(null);

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
            // Submit the login form
            fetch("/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            })
                .then((response) => {
                    if (!response.ok) {
                        return response.json().then((data) => {
                            throw new Error(data.error || "Login failed");
                        });
                    }
                    return response.json();
                })
                .then((data) => {
                    console.log("Login successful:", data);
                    if (onLogin) {
                        onLogin(data); // Pass the user data to the parent component
                    }
                })
                .catch((error) => {
                    console.error("Error logging in:", error);
                    setError(error.message);
                });
        },
    });

    return (
        <div className="login-form-container">
            <h2>Log In</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={formik.handleSubmit}>
                <input
                    name="username"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    placeholder="Username"
                />
                {formik.touched.username && formik.errors.username && (
                    <p style={{ color: "red" }}>{formik.errors.username}</p>
                )}

                <input
                    type="password"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    placeholder="Password"
                />
                {formik.touched.password && formik.errors.password && (
                    <p style={{ color: "red" }}>{formik.errors.password}</p>
                )}

                <button type="submit">Log In</button>
            </form>
        </div>
    );
}

export default LoginForm;
