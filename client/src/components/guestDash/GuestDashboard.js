import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const NavLink = ({ href, children }) => {
  const [isHovered, setIsHovered] = React.useState(false);

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

const GuestDashboard = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.dashboard}>
      {/* Header */}
      <header style={styles.header}>
        <nav style={styles.nav}>
          <ul style={styles.navList}>
            <NavLink href="/guest-dashboard">Home</NavLink>
            <NavLink href="/guest-volunteer">Volunteer</NavLink>
            <NavLink href="/guest-resources">Resources</NavLink>
            <NavLink href="/guest-rewards">Rewards</NavLink>
            <NavLink href="/guest-map">Find a Venue</NavLink>
          </ul>
        </nav>
        <ul>
            <a href="/" className="login-button">Login</a>
        </ul>
      </header>

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
    fontSize: "0px",
    margin: "10px 0",
  },
  heroButton: {
    padding: "10px 20px",
    backgroundColor: "#00004A",
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
  
  buttonContainer: {
    display: "flex",
    gap: "10px",
    width: "100%",
    marginBottom: "10px",
  },
};

export default GuestDashboard;
