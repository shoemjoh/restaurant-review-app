import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";
import ReviewForm from "./ReviewForm";
import RestaurantList from "./RestaurantList";

function App() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);

  // Check if user is already logged in by fetching from `/me` on mount
  useEffect(() => {
    fetch("/me")
      .then((response) => {
        if (!response.ok) throw new Error("Not authenticated");
        return response.json();
      })
      .then((data) => {
        if (data && data.id) setUserId(data.id);
      })
      .catch((error) => console.error("Error fetching user:", error));
  }, []);

  // Logout function
  const handleLogout = () => {
    fetch("/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          setUserId(null);
          console.log("Logged out successfully");
          navigate("/login"); // Redirect to login page after logout
        } else {
          throw new Error("Logout failed");
        }
      })
      .catch((error) => console.error("Error logging out:", error));
  };

  // Function to handle review submission
  const handleReviewSubmit = (reviewData) => {
    if (!userId) {
      console.error("User is not logged in");
      return;
    }

    const fullReviewData = { ...reviewData, user_id: userId };

    return fetch("/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fullReviewData),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to submit review");
        return response.json();
      })
      .then((data) => {
        console.log("Review submitted successfully:", data);
        navigate("/restaurants"); // Redirect to restaurant list after successful review submission
      })
      .catch((error) => console.error("Error submitting review:", error));
  };

  return (
    <div>
      <header>
        <h1>Restaurant Review App</h1>
        <nav>
          <Link to="/signup">Sign Up</Link> |{" "}
          <Link to="/login">Log In</Link> |{" "}
          <Link to="/submit-review">Submit Review</Link> |{" "}
          <Link to="/restaurants">View Restaurants</Link> |{" "}
          <button onClick={handleLogout} style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'blue', textDecoration: 'underline' }}>
            Log Out
          </button>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/signup" element={<SignupForm onSignup={setUserId} />} />
          <Route path="/login" element={<LoginForm onLogin={setUserId} />} />
          <Route path="/submit-review" element={userId ? <ReviewForm onSubmitReview={handleReviewSubmit} /> : <Navigate to="/login" />} />
          <Route path="/restaurants" element={userId ? <RestaurantList userId={userId} /> : <Navigate to="/login" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
