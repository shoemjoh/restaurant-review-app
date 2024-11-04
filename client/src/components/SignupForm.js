// SignupForm.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./SignupForm.css";

// Validation schema for form fields using Yup

function SignupForm({ onSignup }) {
    const [redirectToReview, setRedirectToReview] = useState(false);
    const navigate = useNavigate();
    const SignupSchema = Yup.object().shape({
        username: Yup.string().required("Username is required"),
        email: Yup.string().email("Invalid email").required("Email is required"),
        password: Yup.string()
            .required("Password is required"),
    });

    // Initializing Formik with initial values, validation schema, and submission handler
    const formik = useFormik({
        initialValues: {
            username: "",
            email: "",
            password: "",
        },
        validationSchema: SignupSchema,
        onSubmit: (values) => {
            console.log("Form submitted with values:", values); // Debugging log
            fetch("/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
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
                    navigate('/submit-review')
                })
                .catch((error) => console.error("Error:", error));
        },
    });



    return (
        <div className="signup-form-container">
            <h2 className="signup-form-title">Sign Up</h2>
            <form onSubmit={formik.handleSubmit}>
                <div>
                    <input
                        name="username"
                        type="text"
                        className="signup-form-input"
                        placeholder="Username"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.username}
                    />
                    {formik.touched.username && formik.errors.username ? (
                        <p className="signup-form-error"> {formik.errors.username}</p>
                    ) : null}
                </div>

                <div>
                    <input
                        name="email"
                        type="email"
                        className="signup-form-input"
                        placeholder="Email"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                    />
                    {formik.touched.email && formik.errors.email ? (
                        <p className="signup-form-error">{formik.errors.email}</p>
                    ) : null}
                </div>

                <div>
                    <input
                        name="password"
                        type="password"
                        className="signup-form-input"
                        placeholder="Password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                    />
                    {formik.touched.password && formik.errors.password ? (
                        <p className="signup-form-error">{formik.errors.password}</p>
                    ) : null}
                </div>

                <button
                    type="submit"
                    className="signup-form-button"
                    disabled={formik.isSubmitting}
                >
                    {formik.isSubmitting ? "Signing Up..." : "Sign Up"}
                </button>
            </form>
            <p className="signup-form-text">
                Already have an account? <a href="/login">Log in</a>
            </p>
        </div>
    );
}

export default SignupForm;
