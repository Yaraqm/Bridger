import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const NavLink = ({ href, children }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      to={href}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={isHovered ? "nav-link-hover" : "nav-link"}
    >
      {children}
    </Link>
  );
};

const Navbar = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  return (
    <header style={styles.header}>
      <nav style={styles.nav}>
        <ul style={styles.navList}>
          <li>
            <NavLink href="/guest-dashboard">Home</NavLink>
          </li>
          <li>
            <NavLink href="/guest-rewards">Rewards</NavLink>
          </li>
          <li>
            <NavLink href="/guest-volunteer">Volunteer</NavLink>
          </li>
          <li>
            <NavLink href="/guest-resources">Resources</NavLink>
          </li>
          <li>
            <NavLink href="/guest-map">Find a Venue</NavLink>
          </li>
        </ul>
      </nav>
      <button onClick={handleLogout} className="login-button">
        Login
      </button>
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: "#00004A",
    color: "#fff",
    padding: "0px 20px",
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    height: "73.5px",
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
};

export default Navbar;
