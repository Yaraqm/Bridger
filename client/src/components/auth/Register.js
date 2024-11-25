import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  // Get userType (default to 'member' if not specified)
  const userType = location.state?.userType || "member";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form data:", formData); // Log form data for verification

    // Combine firstName and lastName into name
    const payload = {
      name: `${formData.firstName} ${formData.lastName}`, // Combine names
      email: formData.email,
      password: formData.password,
    };

    try {
      await axios.post("http://localhost:5000/api/auth/register", payload);
      alert("Registration successful! You can now log in.");

      // Redirect based on userType
      if (userType === "admin") {
        navigate("/admin-login?bypassKey=true"); // Redirect to AdminLogin with bypassKey
      } else {
        navigate("/member-login"); // Redirect to MemberLogin
      }
    } catch (err) {
      console.error(
        "Registration Error:",
        err.response ? err.response.data : err.message
      );
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.left}>
        <div style={styles.formBox}>
          <h1 style={styles.header}>Sign Up</h1>
          <p style={styles.subtitle}>Create an account to get started</p>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inlineGroup}>
              <div style={styles.inlineInput}>
                <label style={styles.label}>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>
              <div style={styles.inlineInput}>
                <label style={styles.label}>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
            <button type="submit" style={styles.button}>
              Sign Up
            </button>
          </form>
          {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
        </div>
      </div>
      <div style={styles.right}>
        <div style={styles.imageContainer}>
          {/* Add an image or illustration here */}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    height: "100vh",
  },
  left: {
    flex: 1,
    backgroundColor: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "0 10px", // Adjust padding to ensure balance
  },
  right: {
    flex: 1,
    backgroundColor: "#DDBDF2",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  formBox: {
    width: "100%", // Take full width
    maxWidth: "400px", // Constrain the maximum width
    padding: "20px", // Add padding for consistent spacing
    textAlign: "left",
  },
  header: {
    fontSize: "40px",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#000",
  },
  subtitle: {
    fontSize: "17px",
    color: "#666",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  inlineGroup: {
    display: "flex",
    gap: "35px",
    marginBottom: "15px",
  },
  inlineInput: {
    flex: 1,
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
    transition: 'all 0.3s ease',
  },
};

export default Register;
