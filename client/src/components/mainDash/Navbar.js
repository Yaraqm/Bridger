// Navbar Component (Updated to include sidebar and friend finder functionality)
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FriendFinder from "./FriendFinder";
import axios from "axios";

const NavLink = ({ href, children }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={href}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={isHovered ? "nav-link-hover" : "nav-link"}
    >
      {children}
    </a>
  );
};

const Navbar = ({ onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar state
  const [isFriendFinderOpen, setIsFriendFinderOpen] = useState(false); // Friend Finder state
  const [friendRequests, setFriendRequests] = useState([]); // Friend requests state
  const [showRequestsDropdown, setShowRequestsDropdown] = useState(false); // Toggle dropdown
  const [isHovered, setIsHovered] = useState(null); // Hover state
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const fetchFriendRequests = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.get("http://localhost:5000/api/friends/requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFriendRequests(response.data.requests || []);
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  return (
    <header style={styles.header}>
      <button style={styles.hamburgerButton} onClick={toggleSidebar}>
        ☰
      </button>
      <nav style={styles.nav}>
        <ul style={styles.navList}>
          <li>
            <NavLink href="/dashboard">Home</NavLink>
          </li>
          <li>
            <NavLink href="/Rewards">Rewards</NavLink>
          </li>
          <li>
            <NavLink href="/volunteer">Volunteer</NavLink>
          </li>
          <li>
            <NavLink href="/pages/Resources">Resources</NavLink>
          </li>
          <li>
            <NavLink href="/venueForm">Submit a Venue</NavLink>
          </li>
          <li>
            <NavLink href="/map">Find a Venue</NavLink>
          </li>
        </ul>
      </nav>
      <a href="/" className="login-button" onClick={onLogout}>
        Logout
      </a>

      {/* Sidebar */}
      <aside
        style={{
          ...styles.sidebar,
          transform: isSidebarOpen ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        <button style={styles.crossButton} onClick={toggleSidebar}>
          ✖
        </button>
        {!isFriendFinderOpen ? (
          <ul style={styles.sidebarList}>
            <li>
              <a href="/Profile" className="nav-link">Profile</a>
            </li>
            <li
              className="nav-link"
              onClick={() => setIsFriendFinderOpen(true)}
              style={{ cursor: "pointer" }}
            >
              Find New Friends
            </li>
            <li
              className="nav-link"
              onClick={() => setShowRequestsDropdown(!showRequestsDropdown)}
              style={{ cursor: "pointer", position: "relative" }}
            >
              Friend Requests
              {friendRequests.length > 0 && (
                <span style={styles.notificationBadge}>
                  {friendRequests.length}
                </span>
              )}
              {showRequestsDropdown && (
                <div style={styles.requestsDropdown}>
                  {friendRequests.length === 0 ? (
                    <p style={styles.dropdownMessage}>No new requests</p>
                  ) : (
                    friendRequests.map((request) => (
                      <div
                        key={request.user_id}
                        style={{
                          ...styles.requestBubble,
                          ...(isHovered === request.user_id
                            ? styles.requestBubbleHover
                            : {}),
                        }}
                        onMouseEnter={() => setIsHovered(request.user_id)}
                        onMouseLeave={() => setIsHovered(null)}
                      >
                        <p style={styles.requestText}>
                          <strong>{request.name}</strong> wants to connect.
                        </p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </li>
          </ul>
        ) : (
          <div>
            <button
              className="login-button"
              onClick={() => setIsFriendFinderOpen(false)}
            >
              Back
            </button>
            <FriendFinder />
          </div>
        )}
      </aside>
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: "#00004A",
    color: "#fff",
    padding: "0 20px",
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    height: "73.5px",
  },
  hamburgerButton: {
    backgroundColor: "transparent",
    color: "#fff",
    fontSize: "24px",
    border: "none",
    cursor: "pointer",
    marginLeft: "10px",
  },
  nav: {
    flex: 1,
  },
  navList: {
    listStyleType: "none",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 0,
    gap: "30px",
    marginRight: "20px",
  },
  sidebar: {
    position: "fixed",
    width: "330px",
    backgroundColor: "#2C3E50",
    color: "#fff",
    height: "100vh",
    padding: "20px",
    left: 0,
    top: 0,
    transform: "translateX(-100%)",
    transition: "transform 0.3s ease-in-out",
    zIndex: 1000,
  },
  crossButton: {
    position: "absolute",
    top: "15px",
    right: "20px",
    backgroundColor: "transparent",
    border: "none",
    color: "#fff",
    fontSize: "20px",
    cursor: "pointer",
  },
  sidebarList: {
    listStyleType: "none",
    padding: 0,
    margin: 0,
    gap: "20px",
    display: "flex",
    flexDirection: "column",
  },
  notificationBadge: {
    backgroundColor: "red",
    color: "white",
    borderRadius: "60%",
    padding: "1px 9px",
    fontSize: "14px",
    position: "absolute",
    right: "1px",
  },
  requestsDropdown: {
    position: "absolute",
    backgroundColor: "#fff",
    color: "#000",
    padding: "15px 20px",
    width: "286px",
    borderRadius: "5px",
    marginTop: "10px",
    marginRight: "1px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
  },
  requestBubble: {
    backgroundColor: "rgba(245, 144, 110, 0.8)",
    padding: "5px 20px",
    width: "255px",
    borderRadius: "5px",
    marginBottom: "10px",
    marginLeft: "-4px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    fontSize: "14px",
  },
  requestBubbleHover: {
    transform: "translateY(-1px)",
    boxShadow: "0px 8px 12px rgba(0, 0, 0, 0.2)",
  },
  requestText: {
    fontSize: "14px",
    marginBottom: "10px",
  },
};

export default Navbar;
