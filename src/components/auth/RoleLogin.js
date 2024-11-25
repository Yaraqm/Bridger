import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const RoleLogin = ({ isAdmin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  // Check if the URL contains bypassKey=true
  const searchParams = new URLSearchParams(location.search);
  const bypassKey = searchParams.get("bypassKey") === "true";

  // If bypassKey is true, skip the admin key step
  const [showAdminKeyInput, setShowAdminKeyInput] = useState(
    isAdmin && !bypassKey
  );
  const [error, setError] = useState("");

  // Predefined admin keys
  const validAdminKeys = ["ADMIN123", "SUPERADMIN456", "MASTER789"];

  const handleAdminKeySubmit = (e) => {
    e.preventDefault();
    if (validAdminKeys.includes(adminKey)) {
      setShowAdminKeyInput(false); // Proceed to the login form
    } else {
      setError("Invalid admin key. Please try again.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const payload = { email, password, ...(isAdmin && { adminKey }) };
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        payload
      );

      const token = response.data.token; // Assuming the token comes in response
      localStorage.setItem("authToken", token);
      setError("");
      alert("Login successful!");
      // After successful login
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("userId", response.data.userId); // Save userId as well
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid credentials or admin key.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.left}>
        <div style={styles.formBox}>
          {showAdminKeyInput ? (
            <>
              <h2 style={styles.header}>Admin Key Required</h2>
              <p style={styles.subtitle}>
                Please enter your admin key to continue.
              </p>
              <form onSubmit={handleAdminKeySubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Admin Key</label>
                  <input
                    type="text"
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                    required
                    style={styles.input}
                  />
                </div>
                <button type="submit" style={styles.button}>
                  Submit
                </button>
              </form>
              {error && (
                <p style={{ color: "red", marginTop: "10px" }}>{error}</p>
              )}
            </>
          ) : (
            <>
              <h2 style={styles.header}>Welcome Back</h2>
              <p style={styles.subtitle}>
                Sign in to access your {isAdmin ? "admin account" : "account"}.
              </p>
              <form onSubmit={handleLogin} style={styles.form}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Email</label>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={styles.input}
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={styles.input}
                  />
                </div>
                <button type="submit" style={styles.button}>
                  Login
                </button>
              </form>
              {error && (
                <p style={{ color: "red", marginTop: "10px" }}>{error}</p>
              )}
              <p style={styles.signupText}>
                New to Bridger?{" "}
                <span
                  style={styles.signupLink}
                  onClick={() =>
                    navigate("/signup", { state: { userType: "admin" } })
                  }
                >
                  Sign up
                </span>
              </p>
            </>
          )}
        </div>
      </div>
      <div style={styles.right}>
        <div style={styles.imageContainer}>
          {/* Add an illustration or image */}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    fontFamily: "Raleway, sans-serif",
  },
  left: {
    flex: 1,
    backgroundColor: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "0 10px", // Reduce padding to balance spacing
  },
  right: {
    flex: 1,
    backgroundColor: "#ddbdf2",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  formBox: {
    width: "100%", // Take full width of the container
    maxWidth: "400px", // Limit max width
    padding: "20px", // Add padding for a consistent feel
    textAlign: "left",
  },
  header: {
    fontSize: "40px",
    marginBottom: "10px",
    fontWeight: "bold",
    textAlign: "left",
    color: "#333",
  },
  subtitle: {
    fontSize: "17px",
    marginBottom: "20px",
    color: "#666",
    textAlign: "left",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  inputGroup: {
    marginBottom: "15px",
    textAlign: "left",
  },
  label: {
    fontSize: "16px",
    color: "#333",
    marginBottom: "5px",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ddd",
    fontSize: "14px",
  },
  button: {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#00004A",
    color: "#fff",
    fontSize: "17px",
    cursor: "pointer",
    fontFamily: "Raleway, sans-serif",
    transition: "all 0.3s ease",
  },
  signupText: {
    marginTop: "20px",
    fontSize: "15.5px",
    color: "#666",
    textAlign: "left",
  },
  signupLink: {
    color: "#6c63ff",
    cursor: "pointer",
  },
};

export default RoleLogin;
