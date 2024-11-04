import React from "react";
import { BrowserRouter as Router, Switch, Route, Link, useHistory } from "react-router-dom";
import SignupForm from "./SignupForm";
import ReviewForm from "./ReviewForm";
import RestaurantList from "./RestaurantList";

function App() {
  const history = useHistory();

  // Hardcode a user ID for testing; replace with actual user ID when implementing authentication
  const userId = 1; // Replace with a dynamic user ID from context or state

  const handleReviewSubmit = (reviewData) => {
    // Include user_id in the reviewData object
    const fullReviewData = { ...reviewData, user_id: userId };

    console.log("Submitting review:", fullReviewData); // Debugging

    // Return the fetch call so ReviewForm can handle form clearing on success
    return fetch("/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fullReviewData),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Failed to submit review");
      })
      .then((data) => {
        console.log("Review submitted successfully:", data);
        history.push("/restaurants"); // Redirect to the restaurant list page after submission
      })
      .catch((error) => {
        console.error("Error submitting review:", error);
      });
  };

  return (
    <Router>
      <div>
        <header>
          <h1>Restaurant Review App</h1>
          <nav>
            <Link to="/signup">Sign Up</Link> |{" "}
            <Link to="/submit-review">Submit Review</Link> |{" "}
            <Link to="/restaurants">View Restaurants</Link>
          </nav>
        </header>
        <main>
          <Switch>
            <Route path="/signup" component={SignupForm} />
            <Route path="/submit-review">
              <ReviewForm onSubmitReview={handleReviewSubmit} />
            </Route>
            <Route path="/restaurants" component={RestaurantList} />
          </Switch>
        </main>
      </div>
    </Router>
  );
}

export default App;
