import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const NavLink = ({ href, children }) => {
  const [isHovered, setIsHovered] = React.useState(false);

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

const GuestDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div style={styles.dashboard}>
      {/* Header */}
      <header style={styles.header}>
        <nav style={styles.nav}>
          <ul style={styles.navList}>
            <NavLink href="/Rewards">Rewards</NavLink>
            <NavLink href="/volunteer">Volunteer</NavLink>
            <NavLink href="/resources">Resources</NavLink>
            <NavLink href="/venueForm">Venue Form</NavLink>
            <NavLink href="/map">View Venues on Map</NavLink>
            <NavLink href="/stats">Stats</NavLink>
          </ul>
        </nav>
        <ul>
            <a href="/" className="login-button">Login</a>
        </ul>
      </header>

      {/* Main Content */}
      <main style={styles.mainContent}>
        <section style={styles.welcomeSection}>
          <h1>Welcome to Bridger</h1>
        </section>
        <section style={styles.banner}>
          <h2 style={styles.bannerTitle}>
            "Bridging the Gap: Accessibility for All"
          </h2>
          <div style={styles.bannerImage}>
            <img
              src="/dashboardImage.jpg"
              alt="Bridger Banner"
              style={styles.bannerImageStyle}
            />
          </div>
        </section>
        <section style={styles.aboutUs}>
          <h2 style={styles.sectionTitle}>About Us</h2>
          <p style={styles.aboutText}>
            Bridger is a digital platform designed to empower individuals with
            disabilities by providing accessible information and fostering a
            supportive community. Our mission is to make the world more
            inclusive by breaking down barriers and creating a seamless
            experience for everyone.
          </p>
        </section>
        <section style={styles.mission}>
          <h2 style={styles.sectionTitle}>Our Mission</h2>
          <p style={styles.sectionText}>
            To create an inclusive world by connecting people through shared
            experiences and accessible information. Bridger is committed to
            fostering community, enhancing awareness, and enabling everyone to
            navigate the world with ease.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>
          © Bridger {new Date().getFullYear()} |{" "}
          <a href="/contact" style={styles.footerLink}>
            Contact Us
          </a>{" "}
          | 1-888-BRIDGER (1-888-274-3437)
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
    padding: "0px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerTitle: {
    margin: 0,
    fontSize: "32px",
    fontWeight: "bold",
  },

  nav: {
    flex: 1,
  },
  navList: {
    listStyleType: "none",
    display: "flex",
    justifyContent: "flex-end" /* Align items to the right */,
    alignItems: "center" /* Align vertically to the center */,
    padding: 0,
    gap: "20px",
    marginRight: "20px" /* Add spacing between links and the login button */,
  },

  navLink: {
    color: "#fff",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "16px",
    transition: "color 0.3s ease",
    marginRight: "15px",
  },
  navLinkHover: {
    color: "#CDD5E8",
  },
  logIn: {
    padding: "0px 20px",
    marginRight: "20px",
    backgroundColor: "#ACD2ED",
    color: "#00004A",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "14px",
    display: "inline-block",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  mainContent: {
    marginLeft: "20px",
    marginRight: "20px",
    padding: "20px",
    marginTop: "70px",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "20px",
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
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
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
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  mission: {
    padding: "20px",
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "10px",
    textAlign: "center",
    color: "#2C3E50",
  },
  sectionText: {
    fontSize: "16px",
    textAlign: "center",
    lineHeight: "1.8",
    color: "#7f8c8d",
    maxWidth: "600px",
  },
  footer: {
    backgroundColor: "#333",
    color: "#fff",
    textAlign: "center",
    padding: "4px 0",
    bottom: 0,
    width: "100%",
    fontSize: "14px",
  },
  footerLink: {
    color: "#f1c40f",
    textDecoration: "none",
    marginLeft: "5px",
  },
};

export default GuestDashboard;
