// RestaurantList.js
import React, { useEffect, useState } from "react";

function RestaurantList({ userId }) {
    const [restaurants, setRestaurants] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (userId) {
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
                    }
                })
                .catch((error) => {
                    console.error("Error fetching restaurants:", error);
                    setError("Failed to load restaurants.");
                });
        } else {
            // Clear restaurants if userId is null (user is logged out)
            setRestaurants([]);
        }
    }, [userId]);

    // Function to handle deleting a review
    const handleDeleteReview = (reviewId) => {
        fetch(`/reviews/${reviewId}`, {
            method: "DELETE",
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to delete review");
                }
                // Remove the deleted review from the restaurants state
                setRestaurants((prevRestaurants) =>
                    prevRestaurants.map((restaurant) => ({
                        ...restaurant,
                        reviews: restaurant.reviews.filter((review) => review.id !== reviewId),
                    }))
                );
            })
            .catch((error) => console.error("Error deleting review:", error));
    };

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h2>My Reviewed Restaurants</h2>
            {restaurants.length > 0 ? (
                restaurants.map((restaurant) => (
                    <div key={restaurant.id}>
                        <h3>{restaurant.name}</h3>
                        <p>City: {restaurant.city}</p>
                        <h4>Reviews:</h4>
                        {restaurant.reviews && restaurant.reviews.length > 0 ? (
                            restaurant.reviews.map((review) => (
                                <div key={review.id}>
                                    <p>Content: {review.content}</p>
                                    <p>Rating: {review.rating}</p>
                                    <button
                                        onClick={() => handleDeleteReview(review.id)}
                                        style={{
                                            color: 'white',
                                            backgroundColor: 'red',
                                            border: 'none',
                                            padding: '5px 10px',
                                            cursor: 'pointer',
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
                ))
            ) : (
                <p>Loading restaurants...</p>
            )}
        </div>
    );
}

export default RestaurantList;

