import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link, Redirect, useHistory } from "react-router-dom";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";
import ReviewForm from "./ReviewForm";
import RestaurantList from "./RestaurantList";

function App() {
  const history = useHistory();
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
          history.push("/login"); // Redirect to login page after logout
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
        history.push("/restaurants"); // Redirect to restaurant list after successful review submission
      })
      .catch((error) => console.error("Error submitting review:", error));
  };

  return (
    <Router>
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
          <Switch>
            <Route path="/signup">
              <SignupForm onSignup={setUserId} />
            </Route>
            <Route path="/login">
              <LoginForm onLogin={setUserId} />
            </Route>
            <Route path="/submit-review">
              {userId ? (
                <ReviewForm onSubmitReview={handleReviewSubmit} />
              ) : (
                <Redirect to="/login" />
              )}
            </Route>
            <Route path="/restaurants">
              {userId ? (
                <RestaurantList userId={userId} />
              ) : (
                <Redirect to="/login" />
              )}
            </Route>
          </Switch>
        </main>
      </div>
    </Router>
  );
}

export default App;






