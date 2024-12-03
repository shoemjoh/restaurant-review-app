import React, { useEffect, useState } from "react";

function RestaurantList({ userId }) {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true); // Add loading state
    const [error, setError] = useState(null); // Add error state

    // Fetch the user's reviewed restaurants
    useEffect(() => {
        if (!userId) return;

        setLoading(true);
        fetch("/restaurants")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch restaurants");
                }
                return response.json();
            })
            .then((data) => {
                setRestaurants(data);
                if (data.length === 0) {
                    setError("No restaurants found for this user.");
                } else {
                    setError(null); // Clear any previous error
                }
            })
            .catch((error) => {
                console.error("Error fetching restaurants:", error);
                setError("Failed to load restaurants.");
            })
            .finally(() => {
                setLoading(false); // Stop loading after fetch completes
            });
    }, [userId]);

    // Handle deleting a review
    const handleDeleteReview = (reviewId) => {
        fetch(`/reviews/${reviewId}`, {
            method: "DELETE",
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to delete review");
                }
                setRestaurants((prevRestaurants) =>
                    prevRestaurants.map((restaurant) => ({
                        ...restaurant,
                        reviews: restaurant.reviews.filter((review) => review.id !== reviewId),
                    }))
                );
            })
            .catch((error) => {
                console.error("Error deleting review:", error);
                setError("Failed to delete review.");
            });
    };

    if (loading) {
        return <p>Loading restaurants...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (restaurants.length === 0) {
        return <p>No restaurants found. Start reviewing your favorite places!</p>;
    }

    return (
        <div>
            <h2>My Reviewed Restaurants</h2>
            {restaurants.map((restaurant) => (
                <div key={restaurant.id}>
                    <h3>{restaurant.name}</h3>
                    <p>City: {restaurant.city?.name || "Unknown City"}</p> {/* Access city name */}
                    <h4>Reviews:</h4>
                    {restaurant.reviews && restaurant.reviews.length > 0 ? (
                        restaurant.reviews.map((review) => (
                            <div key={review.id}>
                                <p>Content: {review.content}</p>
                                <p>Must-Do: {review.must_do}</p>
                                <button
                                    onClick={() => handleDeleteReview(review.id)}
                                    style={{
                                        color: "white",
                                        backgroundColor: "red",
                                        border: "none",
                                        padding: "5px 10px",
                                        cursor: "pointer",
                                    }}
                                >
                                    Delete Review
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>No reviews available.</p>
                    )}
                </div>
            ))}
        </div>
    );
}

export default RestaurantList;


