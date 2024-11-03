// App.js
import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import SignupForm from "./components/SignupForm";
import ReviewForm from "./components/ReviewForm";
import RestaurantList from "./components/RestaurantList";

function App() {
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
            <Route path="/submit-review" component={ReviewForm} />
            <Route path="/restaurants" component={RestaurantList} />
          </Switch>
        </main>
      </div>
    </Router>
  );
}

export default App;