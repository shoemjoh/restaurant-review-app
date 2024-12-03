/* global google */
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";
import { GOOGLE_MAPS_API_KEY, GOOGLE_MAPS_LIBRARIES } from "../googleMapsConfig";
import "./CityReviews.css";

function CityReviews() {
    const { cityId } = useParams();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Map state
    const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });
    const [markers, setMarkers] = useState([]);
    const [selectedMarker, setSelectedMarker] = useState(null);

    // Load Google Maps API
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        libraries: GOOGLE_MAPS_LIBRARIES,
    });

    useEffect(() => {
        setLoading(true);
        fetch(`/user/cities/${cityId}/reviews`)
            .then((response) => {
                if (!response.ok) throw new Error("Failed to fetch reviews");
                return response.json();
            })
            .then((data) => {
                setReviews(data);
                setError(null);

                // Extract markers and set map center
                const locations = data
                    .filter((review) => review.latitude && review.longitude)
                    .map((review) => ({
                        id: review.id,
                        lat: review.latitude,
                        lng: review.longitude,
                        name: review.place_name || "Unknown",
                        content: review.content,
                        type: review.place_type,
                    }));

                if (locations.length > 0) {
                    setMarkers(locations);
                    setMapCenter({
                        lat: locations[0].lat,
                        lng: locations[0].lng,
                    });
                } else {
                    setMapCenter({ lat: 0, lng: 0 });
                }
            })
            .catch((err) => {
                console.error("Error fetching reviews:", err);
                setError("Failed to load reviews.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [cityId]);

    const handlePlaceClick = (marker) => {
        setSelectedMarker(marker);
        setMapCenter({ lat: marker.lat, lng: marker.lng });
    };

    if (loading) {
        return <div>Loading reviews...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    // Filter reviews by type
    const restaurantReviews = reviews.filter((review) => review.place_type === "restaurant");
    const hotelReviews = reviews.filter((review) => review.place_type === "hotel");
    const experienceReviews = reviews.filter((review) => review.place_type === "experience");

    return (
        <div className="city-reviews-container">
            {/* Reviews Section */}
            <div className="reviews-section">
                <h2>Restaurant Reviews</h2>
                {restaurantReviews.length > 0 ? (
                    <ul className="review-list">
                        {restaurantReviews.map((review) => {
                            const marker = markers.find((m) => m.id === review.id);
                            return (
                                <li
                                    key={review.id}
                                    className="review-item"
                                    onClick={() => handlePlaceClick(marker)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <p>
                                        <strong>{review.place_name || "Unknown"}:</strong>{" "}{review.content}
                                    </p>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <p>No restaurant reviews found.</p>
                )}

                <h2>Hotel Reviews</h2>
                {hotelReviews.length > 0 ? (
                    <ul className="review-list">
                        {hotelReviews.map((review) => {
                            const marker = markers.find((m) => m.id === review.id);
                            return (
                                <li
                                    key={review.id}
                                    className="review-item"
                                    onClick={() => handlePlaceClick(marker)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <p>
                                        <strong>{review.place_name || "Unknown"}:</strong>{" "}{review.content}
                                    </p>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <p>No hotel reviews found.</p>
                )}

                <h2>Experience Reviews</h2>
                {experienceReviews.length > 0 ? (
                    <ul className="review-list">
                        {experienceReviews.map((review) => {
                            const marker = markers.find((m) => m.id === review.id);
                            return (
                                <li
                                    key={review.id}
                                    className="review-item"
                                    onClick={() => handlePlaceClick(marker)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <p>
                                        <strong>{review.place_name || "Unknown"}:</strong>{" "}{review.content}
                                    </p>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <p>No experience reviews found.</p>
                )}
            </div>

            {/* Map Section */}
            <div className="map-section">
                {isLoaded ? (
                    <GoogleMap
                        mapContainerClassName="map-container"
                        center={mapCenter}
                        zoom={markers.length > 0 ? 12 : 2}
                    >
                        {markers.map((marker) => (
                            <Marker
                                key={marker.id}
                                position={{ lat: marker.lat, lng: marker.lng }}
                                title={marker.name}
                                onClick={() => setSelectedMarker(marker)}
                            />
                        ))}

                        {selectedMarker && (
                            <InfoWindow
                                position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
                                onCloseClick={() => setSelectedMarker(null)}
                            >
                                <div>
                                    <h4>{selectedMarker.name}</h4>
                                    <p>{selectedMarker.content}</p>
                                </div>
                            </InfoWindow>
                        )}
                    </GoogleMap>
                ) : (
                    <p>Loading map...</p>
                )}
            </div>
        </div>
    );
}

export default CityReviews;
