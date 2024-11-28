import React from "react";
import "./CityTile.css"; // Add custom styles if needed

function CityTile({ name }) {
    return (
        <div className="destination-tile">
            <h3>{name}</h3>
        </div>
    );
}

export default CityTile;