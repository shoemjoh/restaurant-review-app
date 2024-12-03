import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";
import UserDashboard from "./UserDashboard";
import RestaurantList from "./RestaurantList";
import HotelList from "./HotelList";
import ExperienceList from "./ExperienceList";
import CityReviews from "./CityReviews";
import { useTheme } from "./ThemeContext";
import NavBar from "./NavBar";
import "./App.css";

function App() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const { theme, toggleTheme } = useTheme();

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
    setUserId(user.id);
    navigate("/dashboard");
  };

  const handleLogout = () => {
    fetch("/logout", {
      method: "POST",
    })
      .then((response) => {
        if (response.ok) {
          setUserId(null);
          navigate("/login");
        }
      })
      .catch((error) => console.error("Error logging out:", error));
  };

  if (loadingUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`app ${theme}`}>
      {/* App Header */}
      <header className="app-header">
        <div className="app-title">930reservation</div>
        {userId && <NavBar userId={userId} onLogout={handleLogout} />}
      </header>

      {/* Theme Toggle Button */}
      <div className="theme-toggle-container">
        <button onClick={toggleTheme} className="theme-toggle-button">
          {theme === "light" ? "Dark Theme" : "Light Theme"}
        </button>
      </div>

      {/* Main Routes */}
      <main>
        <Routes>
          <Route
            path="/login"
            element={
              userId ? (
                <Navigate to="/dashboard" />
              ) : (
                <>
                  <LoginForm onLogin={handleLogin} />
                  <div className="auth-links">
                    <p>
                      Don't have an account? <a href="/signup">Sign Up</a>
                    </p>
                  </div>
                </>
              )
            }
          />
          <Route
            path="/signup"
            element={
              userId ? (
                <Navigate to="/dashboard" />
              ) : (
                <>
                  <SignupForm onSignup={setUserId} />
                  <div className="auth-links">
                    <p>
                      Already have an account? <a href="/login">Log In</a>
                    </p>
                  </div>
                </>
              )
            }
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
          <Route
            path="/experiences"
            element={userId ? <ExperienceList userId={userId} /> : <Navigate to="/login" />}
          />
          <Route
            path="/user/cities/:cityId/reviews"
            element={userId ? <CityReviews /> : <Navigate to="/login" />}
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
