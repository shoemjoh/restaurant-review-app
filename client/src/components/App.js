import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate, Link } from "react-router-dom";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";
import UserDashboard from "./UserDashboard";
import RestaurantList from "./RestaurantList";
import HotelList from "./HotelList";

function App() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Fetch current user session on mount
  useEffect(() => {
    fetch("/me")
      .then((response) => {
        if (!response.ok) throw new Error("Not authenticated");
        return response.json();
      })
      .then((data) => {
        setUserId(data.id);
      })
      .catch(() => {
        setUserId(null);
      })
      .finally(() => {
        setLoadingUser(false);
      });
  }, []);

  const handleLogin = (user) => {
    setUserId(user.id); // Set user ID after successful login
    navigate("/dashboard"); // Navigate to the dashboard immediately
  };

  const handleLogout = () => {
    fetch("/logout", {
      method: "POST",
    })
      .then((response) => {
        if (response.ok) {
          setUserId(null); // Clear user state
          navigate("/login"); // Navigate to login page
        }
      })
      .catch((error) => console.error("Error logging out:", error));
  };

  if (loadingUser) {
    return <div>Loading...</div>; // Show loading screen while user session is being fetched
  }

  return (
    <div>
      {/* Always display the navbar */}
      <header>
        <h1>Review App</h1>
        <nav>
          {userId ? (
            <>
              <Link to="/dashboard">Dashboard</Link> |{" "}
              <Link to="/restaurants">Restaurants</Link> |{" "}
              <Link to="/hotels">Hotels</Link> |{" "}
              <button
                onClick={handleLogout}
                style={{
                  background: "none",
                  border: "none",
                  color: "blue",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link to="/signup">Sign Up</Link> | <Link to="/login">Log In</Link>
            </>
          )}
        </nav>
      </header>

      {/* Define routes */}
      <main>
        <Routes>
          <Route
            path="/login"
            element={userId ? <Navigate to="/dashboard" /> : <LoginForm onLogin={handleLogin} />}
          />
          <Route
            path="/signup"
            element={userId ? <Navigate to="/dashboard" /> : <SignupForm onSignup={setUserId} />}
          />
          <Route
            path="/dashboard"
            element={userId ? <UserDashboard userId={userId} /> : <Navigate to="/login" />}
          />
          <Route
            path="/restaurants"
            element={userId ? <RestaurantList userId={userId} /> : <Navigate to="/login" />}
          />
          <Route
            path="/hotels"
            element={userId ? <HotelList userId={userId} /> : <Navigate to="/login" />}
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
