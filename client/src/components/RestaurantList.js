import React, { useEffect, useState } from "react";

function RestaurantList() {
    const [restaurants, setRestaurants] = useState([]);

    useEffect(() => {
        fetch("/restaurants")
            .then((response) => response.json())
            .then((data) => setRestaurants(data));
    }, []);

    return (
        <div>
            <h2>Restaurants</h2>
            <ul>
                {restaurants.map((restaurant) => (
                    <li key={restaurant.id}>{restaurant.name} - {restaurant.city}</li>
                ))}
            </ul>
        </div>
    );
}

export default RestaurantList;