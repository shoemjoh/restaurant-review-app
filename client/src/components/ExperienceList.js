import React, { useEffect, useState } from "react";

function ExperienceList({ userId }) {
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch the user's reviewed experiences
    useEffect(() => {
        if (!userId) return;

        setLoading(true);
        fetch("/experiences")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch experiences");
                }
                return response.json();
            })
            .then((data) => {
                setExperiences(data);
                if (data.length === 0) {
                    setError("No experiences found for this user.");
                } else {
                    setError(null);
                }
            })
            .catch((error) => {
                console.error("Error fetching experiences:", error);
                setError("Failed to load experiences.");
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
                setExperiences((prevExperiences) =>
                    prevExperiences.map((experience) => ({
                        ...experience,
                        reviews: experience.reviews.filter((review) => review.id !== reviewId),
                    }))
                );
            })
            .catch((error) => {
                console.error("Error deleting review:", error);
                setError("Failed to delete review.");
            });
    };

    if (loading) {
        return <p>Loading experiences...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (experiences.length === 0) {
        return <p>No experiences found. Start reviewing your favorite places!</p>;
    }

    return (
        <div>
            <h2>My Reviewed Experiences</h2>
            {experiences.map((experience) => (
                <div key={experience.id}>
                    <h3>{experience.name}</h3>
                    <p>City: {experience.city?.name || "Unknown City"}</p>
                    <h4>Reviews:</h4>
                    {experience.reviews && experience.reviews.length > 0 ? (
                        experience.reviews.map((review) => (
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

export default ExperienceList;
