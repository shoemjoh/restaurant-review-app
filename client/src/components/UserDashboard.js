import React, { useState, useEffect } from "react";
import ReviewForm from "./ReviewForm";
import CityTile from "./CityTile";

function UserDashboard({ userId }) {
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) return;

        setLoading(true);
        fetch("/user/cities")
            .then((response) => {
                if (!response.ok) throw new Error("Failed to fetch cities");
                return response.json();
            })
            .then((data) => {
                setCities(data);
                setError(null);
            })
            .catch((err) => {
                console.error("Error fetching cities:", err);
                setError("Failed to load cities.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [userId]);

    const handleReviewSubmit = (reviewData) => {
        return fetch("/reviews", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...reviewData, user_id: userId }),
        })
            .then((response) => {
                if (!response.ok) throw new Error("Failed to submit review");
                return response.json();
            })
            .then(() => fetch("/user/cities").then((res) => res.json()).then(setCities))
            .catch((error) => console.error("Error submitting review:", error));
    };

    if (loading) {
        return <div>Loading your reviewed cities...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="user-dashboard">
            <ReviewForm onSubmitReview={handleReviewSubmit} />
            <h2>My Destinations</h2>
            <div className="city-tiles">
                {cities.length > 0 ? (
                    cities.map((city) => <CityTile key={city.id} name={city.name} />)
                ) : (
                    <p>You haven't reviewed any cities yet!</p>
                )}
            </div>
        </div>
    );
}

export default UserDashboard;
