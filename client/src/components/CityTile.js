import React from "react";
import { Link } from "react-router-dom";
import "./CityTile.css"; // Add custom styles if needed


function CityTile({ id, name }) {
    return (
        <div className="city-tile">
            <Link to={`/user/cities/${id}/reviews`}>
                <h3>{name}</h3>
            </Link>
        </div>
    );
}

export default CityTile;
