// components/RestaurantList.js
import React, { useState, useEffect } from "react";

function RestaurantList() {
    const [restaurants, setRestaurants] = useState([]);
    const [city, setCity] = useState("");

    useEffect(() => {
        fetch(`/reviews/list?city=${city}`)
            .then((r) => r.json())
            .then((data) => setRestaurants(data));
    }, [city]);

    return (
        <div>
            <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Filter by City" />
            <ul>
                {restaurants.map((review) => (
                    <li key={review.id}>
                        <h2>{review.restaurant.name}</h2>
                        <p>{review.content}</p>
                        <p>Rating: {review.rating}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default RestaurantList;