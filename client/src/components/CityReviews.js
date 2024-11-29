import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function CityReviews() {
    const { cityId } = useParams();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        fetch(`/user/cities/${cityId}/reviews`)
            .then((response) => {
                if (!response.ok) throw new Error("Failed to fetch reviews");
                return response.json();
            })
            .then((data) => {
                setReviews(data);
                setError(null);
            })
            .catch((err) => {
                console.error("Error fetching reviews:", err);
                setError("Failed to load reviews.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [cityId]);

    if (loading) {
        return <div>Loading reviews...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="city-reviews">
            <h2>Reviews in this City</h2>
            {reviews.length > 0 ? (
                <ul>
                    {reviews.map((review) => (
                        <li key={review.id}>
                            <h4>{review.restaurant || review.hotel || review.experience}</h4>
                            <p>Rating: {review.rating}</p>
                            <p>{review.content}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No reviews found for this city.</p>
            )}
        </div>
    );
}

export default CityReviews;
