import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import { GOOGLE_MAPS_API_KEY, GOOGLE_MAPS_LIBRARIES } from "../googleMapsConfig"; // Use shared config
import "./ReviewForm.css";

function ReviewForm({ onSubmitReview }) {
    const [address, setAddress] = useState("");
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [error, setError] = useState(null);

    // Load Google Places API using shared configuration
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        libraries: GOOGLE_MAPS_LIBRARIES,
    });

    const validationSchema = Yup.object({
        type: Yup.string().required("Review type is required"),
        name: Yup.string().required("Name is required"),
        city: Yup.string().required("City is required"),
        content: Yup.string().required("Review content is required"),
    });

    const formik = useFormik({
        initialValues: {
            type: "restaurant", // Default to restaurant
            name: "",
            city: "",
            content: "",
            must_do: false, // New field for must-do checkbox
        },
        validationSchema,
        onSubmit: (values, { resetForm }) => {
            if (onSubmitReview) {
                const reviewData = {
                    ...values,
                    address,
                    latitude,
                    longitude,
                };

                console.log("Submitting review with data:", reviewData); // Debugging
                onSubmitReview(reviewData)
                    .then((response) => {
                        console.log("Review submitted successfully:", response);
                        resetForm(); // Clear form fields
                        setAddress("");
                        setLatitude(null);
                        setLongitude(null);
                        setError(null);
                    })
                    .catch((error) => {
                        console.error("Error submitting review:", error);
                    });
            } else {
                console.error("onSubmitReview function is not defined");
            }
        },
    });

    const handlePlaceSelect = (autocomplete) => {
        const place = autocomplete.getPlace();
        if (place && place.geometry) {
            formik.setFieldValue("name", place.name); // Update name field
            setAddress(place.formatted_address || "");
            setLatitude(place.geometry.location.lat());
            setLongitude(place.geometry.location.lng());
        } else {
            setError("Invalid place selected.");
        }
    };

    if (!isLoaded) return <p>Loading Google Maps...</p>;

    return (
        <div className="review-form-container">
            <form onSubmit={formik.handleSubmit}>
                <label className="review-form-label">
                    Review Type:
                    <select
                        className="review-form-select"
                        name="type"
                        value={formik.values.type}
                        onChange={formik.handleChange}
                    >
                        <option value="restaurant">Restaurant</option>
                        <option value="hotel">Hotel</option>
                        <option value="experience">Experience</option>
                    </select>
                </label>
                {formik.touched.type && formik.errors.type && (
                    <div className="review-form-error">{formik.errors.type}</div>
                )}

                <label className="review-form-label">
                    <Autocomplete
                        onLoad={(autocomplete) => (window.autocomplete = autocomplete)}
                        onPlaceChanged={() => handlePlaceSelect(window.autocomplete)}
                    >
                        <input
                            type="text"
                            className="review-form-input"
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            placeholder="Name"
                            required
                        />
                    </Autocomplete>
                </label>
                {formik.touched.name && formik.errors.name && (
                    <div className="review-form-error">{formik.errors.name}</div>
                )}
                {error && <div className="review-form-error">{error}</div>}

                <input
                    className="review-form-input"
                    name="city"
                    value={formik.values.city}
                    onChange={formik.handleChange}
                    placeholder="City"
                    required
                />
                {formik.touched.city && formik.errors.city && (
                    <div className="review-form-error">{formik.errors.city}</div>
                )}

                <textarea
                    className="review-form-textarea"
                    name="content"
                    value={formik.values.content}
                    onChange={formik.handleChange}
                    placeholder="Write your review here"
                    required
                />
                {formik.touched.content && formik.errors.content && (
                    <div className="review-form-error">{formik.errors.content}</div>
                )}

                <label className="review-form-label">
                    Must-Do:
                    <input
                        type="checkbox"
                        className="review-form-checkbox"
                        name="must_do"
                        checked={formik.values.must_do}
                        onChange={formik.handleChange}
                    />
                </label>

                <button type="submit" className="review-form-button">
                    Submit Review
                </button>

                {address && (
                    <p className="review-form-location">
                        Location: {address} (Lat: {latitude}, Lng: {longitude})
                    </p>
                )}
            </form>
        </div>
    );
}

export default ReviewForm;
