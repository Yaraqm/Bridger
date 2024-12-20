import React, { useEffect, useState } from "react";
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

const Dashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFriendFinderOpen, setIsFriendFinderOpen] = useState(false); // Manage FriendFinder
  const [friendRequests, setFriendRequests] = useState([]); // Friend requests
  const [showRequestsDropdown, setShowRequestsDropdown] = useState(false); // Toggle dropdown
  const [isHovered, setIsHovered] = useState(null); // Track which bubble is hovered
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId"); // Fetch user ID from localStorage
    console.log("Retrieved userId from localStorage:", userId); // Debug userId
    if (token && userId) {
      setIsAuthenticated(true);
      fetchFriendRequests(); // Fetch friend requests when authenticated
    } else {
      navigate("/");
    }
  }, [navigate]);

  const fetchFriendRequests = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        "http://localhost:5000/api/friends/requests",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFriendRequests(response.data.requests || []); // Use `requests` field from backend response
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    navigate("/");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev); // Toggle sidebar state
  };

  const handleAcceptRequest = async (requesterId) => {
    // Use `requesterId` from the request
    try {
      const token = localStorage.getItem("authToken");
      await axios.post(
        "http://localhost:5000/api/friends/accept",
        { requesterId }, // Send `requesterId` instead of `friendId`
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Friend request accepted!");
      fetchFriendRequests(); // Refresh requests after accepting
    } catch (error) {
      console.error("Error accepting friend request:", error);
      alert("Failed to accept friend request.");
    }
  };

  const handleDeclineRequest = async (requesterId) => {
    // Use `requesterId`
    try {
      const token = localStorage.getItem("authToken");
      await axios.post(
        "http://localhost:5000/api/friends/decline",
        { requesterId }, // Send `requesterId` instead of `friendId`
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Friend request declined!");
      fetchFriendRequests(); // Refresh requests after declining
    } catch (error) {
      console.error("Error declining friend request:", error);
      alert("Failed to decline friend request.");
    }
  };

  if (!isAuthenticated) {
    return <p>Redirecting to login...</p>;
  }

  return (
    <div className="moving-gradient" style={styles.dashboard}>
      {/* Header */}
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
        <a href="/" className="login-button" onClick={handleLogout}>
          Logout
        </a>
      </header>

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
              <a href="/Profile" className="nav-link">
                Profile
              </a>
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
                        <div style={styles.buttonContainer}>
                          <button
                            onClick={() => handleAcceptRequest(request.user_id)}
                            style={styles.acceptButton}
                          >
                            Accept
                          </button>
                          <button
                            onClick={() =>
                              handleDeclineRequest(request.user_id)
                            }
                            style={styles.declineButton}
                          >
                            Decline
                          </button>
                        </div>
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

      {/* Main Content */}
      <main style={styles.mainContent}>
        {/* Hero Section */}
        <section style={styles.heroSection}>
          <img src="/bridgerLogo1.png" alt="Logo" style={styles.logoImage} />
          <h1 style={styles.heroTitle}>
            Welcome to Bridger!
          </h1>
          <h2 style={styles.heroButton}>At Bridger, we "bridge" the gap towards accessibility.</h2>
        </section>

        {/* About Us Section */}
        <section style={styles.aboutSection}>
          <h2 style={styles.sectionTitle}>About Us</h2>
          <p style={styles.sectionText}>
          We are a group of 6 software developers on a mission to enlist more accessibility-related applications in the landscape of Canadian software.
          At Bridger, we want more than just a map with places to visit; we want to foster connections between the minorities of our community. 
          We believe that Bridger can guide individuals with disabilities to be their most outgoing and friendliest selves.
          </p>
        </section>

        {/* Our Mission Section */}
        <section style={styles.missionSection}>
          <h2 style={styles.sectionTitle}>Our Mission</h2>
          <div style={styles.imageGrid}>
            <div style={styles.gridItem}>
              <img
                src="/main-content-image1.jpg"
                alt="Mission 1"
                style={styles.gridImage}
              />
              <p style={styles.imageCaption}>
              We strive to locate accessible venues in the Durham region for Durham citizens with disabilities.
              </p>
            </div>
            <div style={styles.gridItem}>
              <img
                src="/main-content-image2.jpg"
                alt="Mission 2"
                style={styles.gridImage}
              />
              <p style={styles.imageCaption}>
              Taking into account the settings and configuration of our site, our mission is to provide a navigable and easy to use guide on how to get to the safest spaces in Durham for all individuals.
              </p>
            </div>
            <div style={styles.gridItem}>
              <img
                src="/main-content-image3.jpg"
                alt="Mission 3"
                style={styles.gridImage}
              />
              <p style={styles.imageCaption}>
              We urge all individuals, reguardless of their abilities, to build connections and grow with various incentives on our site, motivating them to go outside and find themselves in the greater community.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>
          © Bridger {new Date().getFullYear()} |{" "}
          <a href="mailto:contact@bridger.com" style={styles.footerLink}>
            Contact Us
          </a>{" "}
          | 1-888-BRIDGER
        </p>
      </footer>
    </div>
  );
};
const styles = {
  dashboard: {
    display: "flex",
    flexDirection: "column",
    fontFamily: "Raleway, sans-serif",
    lineHeight: 1.6,
    color: "#333",
    margin: 0,
    padding: 0,
    backgroundColor: "#f9fafc",
    minHeight: "100vh",
  },
  header: {
    backgroundColor: "#00004A",
    color: "#fff",
    padding: "0 20px",
    display: "flex",
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
    gap: "20px",
    marginRight: "48px",
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
  sidebarLink: {
    fontWeight: "bold", // Make all links bold
    color: "#fff",
    textDecoration: "none",
    display: "block",
    padding: "10px 0px",
    transition: "color 0.3s ease",
  },
  sidebarLinkHover: {
    color: "#ddbdf2", // Glowing purple on hover
  },
  sidebarList: {
    listStyleType: "none",
    padding: 0,
    margin: 0,
    marginLeft: "4px", // Remove default padding from the list
    marginTop: "30px", // Add space between the top of the sidebar and the first link
    gap: "20px", // Add consistent space between the links
    display: "flex",
    flexDirection: "column", // Ensure links stack verticall
  },

  sidebarItem: {
    padding: "10px 0",
    cursor: "pointer",
    transition: "color 0.3s ease",
  },

  mainContent: {
    margin: "0 auto",
    maxWidth: "800px",
    padding: "10px",
    marginTop: "10px",
  },
  heroSection: {
    textAlign: "center",
    padding: "40px",
    backgroundColor: "#f5f5f5",
    marginBottom: "20px",
  },
  logoImage: {
    maxWidth: "400px",
    marginBottom: "10px",
    marginTop: "10px",
  },
  heroTitle: {
    fontSize: "24px !important",
    margin: "10px 0",
  },
  heroButton: {
    padding: "10px 20px",
    backgroundColor: "#00004A",
    fontSize: "20px !important",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  welcomeSection: {
    textAlign: "center",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  banner: {
    textAlign: "center",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "30px",
  },
  bannerTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#2C3E50",
  },
  bannerImageStyle: {
    width: "100%",
    maxWidth: "800px",
  },
  aboutUs: {
    padding: "20px",
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  mission: {
    padding: "20px",
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  sectionText: {
    fontSize: "16px",
    lineHeight: "1.8",
    color: "#7f8c8d",
  },
  aboutSection: {
    padding: "20px",
    backgroundColor: "#fff",
    marginBottom: "20px",
  },
  imageGrid: {
    display: "flex",
    gap: "20px",
  },
  gridItem: {
    flex: 1,
    textAlign: "center",
  },
  gridImage: {
    width: "100%",
    borderRadius: "10px",
  },
  footer: {
    backgroundColor: "#333",
    color: "#fff",
    textAlign: "center",
    padding: "10px 0",
    width: "100%",
  },
  footerLink: {
    color: "#f1c40f",
    textDecoration: "none",
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
    zIndex: 1000,
    maxHeight: "200px",
    fontSize: "14px",
    top: "40px",
    right: "0",
  },
  requestItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
    fontSize: "14px",
  },

  requestBubble: {
    backgroundColor: "rgba(245, 144, 110, 0.8)", // Sheer orange color
    padding: "5px 20px 0px 20px",
    width: "255px",
    borderRadius: "5px",
    marginBottom: "10px",
    marginLeft: "-4px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Subtle shadow
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    fontSize: "14px",
    transition: "transform 0.3s ease, box-shadow 0.3s ease", // Add transition for smooth hover effect
  },
  requestBubbleHover: {
    transform: "translateY(-1px)", // Slight lift on hover
    boxShadow: "0px 8px 12px rgba(0, 0, 0, 0.2)", // Enhanced shadow on hover
  },
  requestText: {
    fontSize: "14px",
    marginBottom: "10px",
    fontFamily: "Raleway, sans-serif",
  },

  buttonContainer: {
    display: "flex",
    gap: "10px",
    width: "100%",
    marginBottom: "10px",
  },

  acceptButton: {
    backgroundColor: "green",
    color: "white",
    padding: "8px 15px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontFamily: "Raleway, sans-serif",
    fontSize: "14px",
    fontWeight: "bold",
  },

  declineButton: {
    backgroundColor: "red",
    color: "white",
    padding: "8px 15px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontFamily: "Raleway, sans-serif",
    fontSize: "14px",
    fontWeight: "bold",
  },
};

export default Dashboard;
