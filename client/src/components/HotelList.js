import React, { useEffect, useState } from "react";

function HotelList({ userId }) {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch the user's reviewed hotels
    useEffect(() => {
        if (!userId) return;

        setLoading(true);
        fetch("/hotels")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch hotels");
                }
                return response.json();
            })
            .then((data) => {
                setHotels(data);
                if (data.length === 0) {
                    setError("No hotels found for this user.");
                } else {
                    setError(null);
                }
            })
            .catch((error) => {
                console.error("Error fetching hotels:", error);
                setError("Failed to load hotels.");
            })
            .finally(() => {
                setLoading(false);
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
                setHotels((prevHotels) =>
                    prevHotels.map((hotel) => ({
                        ...hotel,
                        reviews: hotel.reviews.filter((review) => review.id !== reviewId),
                    }))
                );
            })
            .catch((error) => {
                console.error("Error deleting review:", error);
                setError("Failed to delete review.");
            });
    };

    if (loading) {
        return <p>Loading hotels...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (hotels.length === 0) {
        return <p>No hotels found. Start reviewing your favorite places!</p>;
    }

    return (
        <div>
            <h2>My Reviewed Hotels</h2>
            {hotels.map((hotel) => (
                <div key={hotel.id}>
                    <h3>{hotel.name}</h3>
                    <p>City: {hotel.city?.name || "Unknown City"}</p>
                    <h4>Reviews:</h4>
                    {hotel.reviews && hotel.reviews.length > 0 ? (
                        hotel.reviews.map((review) => (
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

export default HotelList;
