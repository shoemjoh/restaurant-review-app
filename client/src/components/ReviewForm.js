import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./ReviewForm.css";

function ReviewForm({ onSubmitReview }) {
    const validationSchema = Yup.object({
        type: Yup.string().required("Review type is required"),
        name: Yup.string().required("Name is required"),
        city: Yup.string().required("City is required"),
        content: Yup.string().required("Review content is required"),
        rating: Yup.number()
            .min(1, "Rating must be at least 1")
            .max(5, "Rating can be at most 5")
            .required("Rating is required"),
    });

    const formik = useFormik({
        initialValues: {
            type: "restaurant", // Default to restaurant
            name: "",
            city: "",
            content: "",
            rating: 5,
        },
        validationSchema,
        onSubmit: (values, { resetForm }) => {
            if (onSubmitReview) {
                console.log("Submitting review with data:", values); // Debugging
                onSubmitReview(values)
                    .then((response) => {
                        console.log("Review submitted successfully:", response);
                        resetForm(); // Clear form fields
                    })
                    .catch((error) => {
                        console.error("Error submitting review:", error);
                    });
            } else {
                console.error("onSubmitReview function is not defined");
            }
        },
    });

    return (
        <div className="review-form-container">
            <h2 className="review-form-title">Submit a Review</h2>
            <form onSubmit={formik.handleSubmit}>
                <label className="review-form-label">
                    Review Type:
                    <select
                        className="review-form-select"
                        name="type"
                        value={formik.values.type}
                        onChange={formik.handleChange}
                    >
                        <option value="restaurant">Restaurant</option>
                        <option value="hotel">Hotel</option>
                        <option value="experience">Experience</option>
                    </select>
                </label>
                {formik.touched.type && formik.errors.type && (
                    <div className="review-form-error">{formik.errors.type}</div>
                )}

                <input
                    className="review-form-input"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    placeholder="Name"
                    required
                />
                {formik.touched.name && formik.errors.name && (
                    <div className="review-form-error">{formik.errors.name}</div>
                )}

                <input
                    className="review-form-input"
                    name="city"
                    value={formik.values.city}
                    onChange={formik.handleChange}
                    placeholder="City"
                    required
                />
                {formik.touched.city && formik.errors.city && (
                    <div className="review-form-error">{formik.errors.city}</div>
                )}

                <textarea
                    className="review-form-textarea"
                    name="content"
                    value={formik.values.content}
                    onChange={formik.handleChange}
                    placeholder="Write your review here"
                    required
                />
                {formik.touched.content && formik.errors.content && (
                    <div className="review-form-error">{formik.errors.content}</div>
                )}

                <label className="review-form-label">
                    Rating:
                    <input
                        type="number"
                        className="review-form-rating"
                        name="rating"
                        value={formik.values.rating}
                        onChange={formik.handleChange}
                        min="1"
                        max="5"
                        required
                    />
                </label>
                {formik.touched.rating && formik.errors.rating && (
                    <div className="review-form-error">{formik.errors.rating}</div>
                )}

                <button type="submit" className="review-form-button">
                    Submit Review
                </button>
            </form>
        </div>
    );
}

export default ReviewForm;
