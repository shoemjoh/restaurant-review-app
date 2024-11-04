// ReviewForm.js
import React, { useState } from "react";
import "./ReviewForm.css"; // Import the CSS file for styling

function ReviewForm({ onSubmitReview }) {
    const [name, setName] = useState("");
    const [city, setCity] = useState("");
    const [content, setContent] = useState("");
    const [rating, setRating] = useState(5);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Call the onSubmitReview function with the form data
        if (onSubmitReview) {
            onSubmitReview({ name, city, content, rating })
                .then(() => {
                    // Clear form fields after successful submission
                    setName("");
                    setCity("");
                    setContent("");
                    setRating(5);
                })
                .catch((error) => {
                    console.error("Error submitting review:", error);
                });
        }
    };

    return (
        <div className="review-form-container">
            <h2 className="review-form-title">Submit a Review</h2>
            <form onSubmit={handleSubmit}>
                <input
                    className="review-form-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Restaurant Name"
                    required
                />
                <input
                    className="review-form-input"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    required
                />
                <textarea
                    className="review-form-textarea"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your review here"
                    required
                />
                <label className="review-form-label">
                    Rating:
                    <input
                        type="number"
                        className="review-form-rating"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        min="1"
                        max="5"
                        required
                    />
                </label>
                <button type="submit" className="review-form-button">
                    Submit Review
                </button>
            </form>
        </div>
    );
}

export default ReviewForm;
