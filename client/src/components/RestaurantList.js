// RestaurantList.js
import React, { useEffect, useState } from "react";

function RestaurantList() {
    const [restaurants, setRestaurants] = useState([]);

    useEffect(() => {
        // Fetch the list of restaurants
        fetch("/restaurants")
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("Failed to fetch restaurants");
            })
            .then((data) => {
                setRestaurants(data);
            })
            .catch((error) => {
                console.error("Error fetching restaurants:", error);
            });
    }, []);

    if (!restaurants || restaurants.length === 0) {
        return <p>No restaurants available.</p>; // Display a message if there are no restaurants
    }

    return (
        <div>
            <h2>Restaurants</h2>
            <ul>
                {restaurants.map((restaurant, index) => (
                    // Add an additional check to ensure 'restaurant' is defined
                    restaurant && (
                        <li key={index}>
                            <h3>{restaurant.name}</h3>
                            <p>City: {restaurant.city}</p>
                            {/* Add more details here if needed */}
                        </li>
                    )
                ))}
            </ul>
        </div>
    );
}

export default RestaurantList;
