// ReviewForm.js
import React, { useState } from "react";

function ReviewForm({ onReviewSubmit }) {
    const [restaurantName, setRestaurantName] = useState("");
    const [city, setCity] = useState("");
    const [content, setContent] = useState("");
    const [rating, setRating] = useState(5);

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch("/restaurants", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: restaurantName, city: city }),
        })
            .then((res) => res.json())
            .then((restaurant) => {
                fetch("/reviews", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        content,
                        rating,
                        restaurant_name: restaurantName,
                        city: city,
                        user_id: 1, // Assuming a logged-in user ID
                    }),
                })
                    .then((res) => res.json())
                    .then((review) => {
                        onReviewSubmit();
                        console.log("Review added:", review);
                    });
            });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                placeholder="Restaurant Name"
                required
            />
            <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                required
            />
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write a review"
                required
            />
            <input
                type="number"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                min="1"
                max="5"
            />
            <button type="submit">Submit Review</button>
        </form>
    );
}

export default ReviewForm;


