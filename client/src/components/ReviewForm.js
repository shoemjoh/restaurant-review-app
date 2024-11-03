// components/ReviewForm.js
import React, { useState } from "react";

function ReviewForm() {
    const [restaurantName, setRestaurantName] = useState("");
    const [city, setCity] = useState("");
    const [content, setContent] = useState("");
    const [rating, setRating] = useState(5);

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch("/reviews", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: restaurantName, city, content, rating, user_id: 1 }),  // Assuming user_id is available
        })
            .then((r) => r.json())
            .then((data) => console.log(data)); // For testing
    };

    return (
        <form onSubmit={handleSubmit}>
            <input value={restaurantName} onChange={(e) => setRestaurantName(e.target.value)} placeholder="Restaurant Name" required />
            <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" required />
            <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Review Content" required />
            <input type="number" value={rating} onChange={(e) => setRating(e.target.value)} min="1" max="5" />
            <button type="submit">Submit Review</button>
        </form>
    );
}

export default ReviewForm;