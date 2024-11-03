import React from "react";
import { Switch, Route } from "react-router-dom";
import SignupForm from "./SignupForm";

function App() {
  return (
    <div>
      <header>
        <h1>Project Client</h1>
      </header>
      <main>
        <Switch>
          {/* Add the route for the SignupForm component */}
          <Route path="/signup" component={SignupForm} />
          {/* You can add other routes here for other components */}
        </Switch>
      </main>
    </div>
  );
}

export default App;
