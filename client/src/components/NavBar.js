import React from "react";
import { Link } from "react-router-dom";
import "./NavBar.css"; // Add custom styles if needed


function NavBar({ userId, onLogout }) {
    return (
        <nav className="navbar">
            <Link to="/dashboard" className="navbar-link">DASHBOARD</Link>
            <Link to="/restaurants" className="navbar-link">RESTAURANTS</Link>
            <Link to="/hotels" className="navbar-link">HOTELS</Link>
            <Link to="/experiences" className="navbar-link">EXPERIENCES</Link>
            {userId && (
                <button
                    onClick={onLogout}
                    className="navbar-button"
                >
                    Log Out
                </button>
            )}
        </nav>
    );
}

export default NavBar;
