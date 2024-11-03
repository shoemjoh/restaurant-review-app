import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import SignupForm from "./SignupForm";
import ReviewForm from "./ReviewForm";
import RestaurantList from "./RestaurantList";

function App() {
  return (
    <Router>
      <div>
        <header>
          <h1>Restaurant Review App</h1>
          <nav>
            <Link to="/signup">Signup</Link> |{" "}
            <Link to="/submit-review">Submit Review</Link> |{" "}
            <Link to="/restaurants">View Restaurants</Link>
          </nav>
        </header>
        <main>
          <Switch>
            {/* Route for the SignupForm component */}
            <Route path="/signup" component={SignupForm} />
            {/* Route for the ReviewForm component */}
            <Route path="/submit-review" component={ReviewForm} />
            {/* Route for viewing the list of restaurants with reviews */}
            <Route path="/restaurants" component={RestaurantList} />
          </Switch>
        </main>
      </div>
    </Router>
  );
}

export default App;