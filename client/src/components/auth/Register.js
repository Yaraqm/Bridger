import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const Register = () => {
  const [step, setStep] = useState(1); // Step control
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    accessibilityPreferences: {
      mobility: false,
      sensory: false,
      navigation: false,
      health: false,
    },
  });
  const [suggestedPassword, setSuggestedPassword] = useState(""); // Autofill password
  const [showTooltip, setShowTooltip] = useState(false); // Tooltip visibility
  const [error, setError] = useState("");
  const [isNextEnabled, setIsNextEnabled] = useState(false); // Track if "Next" button should be enabled
  const location = useLocation();
  const navigate = useNavigate();

  // Get userType (default to 'member' if not specified)
  const userType = location.state?.userType || "member";

  // Generate a random password based on the email
  const generateRandomPassword = (email) => {
    const randomPart = Math.random().toString(36).slice(-8); // Generate random 8-character string
    const emailPrefix = email.split("@")[0].slice(0, 4); // Take first 4 characters of the email prefix
    return `${emailPrefix}${randomPart}`;
  };

  // Update the suggested password when the email changes
  useEffect(() => {
    if (formData.email) {
      const newPassword = generateRandomPassword(formData.email);
      setSuggestedPassword(newPassword);
    } else {
      setSuggestedPassword("");
    }
  }, [formData.email]);

  // Enable the "Next" button only when all required fields are filled
  useEffect(() => {
    const { firstName, lastName, email, password } = formData;
    const isFormComplete =
      firstName.trim() && lastName.trim() && email.trim() && password.trim();
    setIsNextEnabled(isFormComplete);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        accessibilityPreferences: {
          ...prev.accessibilityPreferences,
          [name]: checked,
        },
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const autofillPassword = () => {
    setFormData((prev) => ({
      ...prev,
      password: suggestedPassword,
    }));
  };

  const handleNextStep = () => {
    setStep(2); // Move to the next step
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form data:", formData);

    const payload = {
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      password: formData.password,
      accessibility_preferences: formData.accessibilityPreferences,
    };

    try {
      await axios.post("http://localhost:5000/api/auth/register", payload);
      alert("Registration successful! You can now log in.");

      if (userType === "admin") {
        navigate("/admin-login?bypassKey=true");
      } else {
        navigate("/member-login");
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
          {step === 1 ? (
            <>
              <h2 style={styles.header}>Sign Up</h2>
              <p style={styles.subtitle}>Create an account to get started.</p>
              <form onSubmit={(e) => e.preventDefault()} style={styles.form}>
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
                  <div
                    style={styles.passwordWrapper}
                    onFocus={() => setShowTooltip(true)}
                    onBlur={() => setShowTooltip(false)}
                  >
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      style={styles.input}
                    />
                    <button
                      type="button"
                      onClick={autofillPassword}
                      style={styles.autofillButton}
                    >
                      Autofill
                    </button>
                    {showTooltip && suggestedPassword && (
                      <div style={styles.tooltip}>
                        Suggested Password: {suggestedPassword}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleNextStep}
                  style={{
                    ...styles.button,
                    opacity: isNextEnabled ? 1 : 0.5, // Dim button when disabled
                    cursor: isNextEnabled ? "pointer" : "not-allowed",
                  }}
                  disabled={!isNextEnabled} // Disable the button if form is incomplete
                >
                  Next
                </button>
              </form>
            </>
          ) : (
            <>
              <h2 style={styles.header}>Accessibility Preferences</h2>
              <p style={styles.subtitle}>
                Select your accessibility needs for better support.
              </p>
              <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.checkboxGroup}>
                  <div style={styles.checkboxItem}>
                    <label style={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        name="mobility"
                        checked={formData.accessibilityPreferences.mobility}
                        onChange={handleChange}
                        style={styles.checkboxInput}
                      />
                      <div style={styles.checkboxContent}>
                        <strong style={styles.checkboxTitle}>
                          Mobility Needs
                        </strong>
                        <p style={styles.checkboxDescription}>
                          Wheelchair access, elevators, step-free access.
                        </p>
                      </div>
                    </label>
                  </div>
                  <div style={styles.checkboxItem}>
                    <label style={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        name="sensory"
                        checked={formData.accessibilityPreferences.sensory}
                        onChange={handleChange}
                        style={styles.checkboxInput}
                      />
                      <div style={styles.checkboxContent}>
                        <strong style={styles.checkboxTitle}>
                          Sensory Needs
                        </strong>
                        <p style={styles.checkboxDescription}>
                          Braille/tactile signage, quiet environments,
                          captioning/sign language.
                        </p>
                      </div>
                    </label>
                  </div>
                  <div style={styles.checkboxItem}>
                    <label style={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        name="navigation"
                        checked={formData.accessibilityPreferences.navigation}
                        onChange={handleChange}
                        style={styles.checkboxInput}
                      />
                      <div style={styles.checkboxContent}>
                        <strong style={styles.checkboxTitle}>
                          Navigation Needs
                        </strong>
                        <p style={styles.checkboxDescription}>
                          Clear signage, audio descriptions, guided assistance.
                        </p>
                      </div>
                    </label>
                  </div>
                  <div style={styles.checkboxItem}>
                    <label style={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        name="health"
                        checked={formData.accessibilityPreferences.health}
                        onChange={handleChange}
                        style={styles.checkboxInput}
                      />
                      <div style={styles.checkboxContent}>
                        <strong style={styles.checkboxTitle}>
                          Health Accommodations
                        </strong>
                        <p style={styles.checkboxDescription}>
                          Nearby seating, low-sensory environments, medical aid
                          accessibility.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
                <button type="submit" style={styles.button}>
                  Submit
                </button>
              </form>
            </>
          )}
          {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
        </div>
      </div>
      <div style={styles.right}>
        <div style={styles.imageContainer}>{/* Add an illustration */}</div>
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
  },
  right: {
    flex: 1,
    backgroundColor: "#ddbdf2",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  formBox: {
    width: "100%",
    maxWidth: "400px",
    padding: "20px",
    textAlign: "left",
  },
  header: {
    fontSize: "40px",
    marginBottom: "10px",
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: "17px",
    marginBottom: "20px",
    color: "#666",
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
  passwordWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  autofillButton: {
    backgroundColor: "#ddbdf2",
    fontWeight: "bold",
    fontSize: "14px",
    border: "none",
    padding: "12px",
    borderRadius: "5px",
    cursor: "pointer",
    fontFamily: "Raleway, sans-serif",
  },
  tooltip: {
    position: "absolute",
    top: "25px",
    left: "15px",
    backgroundColor: "#2C3E50",
    color: "#fff",
    padding: "5px 10px",
    borderRadius: "5px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
    fontSize: "14px",
    zIndex: 10,
  },
  checkboxGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    marginBottom: "20px",
  },
  checkboxItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "15px",
    marginBottom: "10px",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "flex-start",
    gap: "15px",
    cursor: "pointer",
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
  },

  checkboxContent: {
    display: "flex",
    flexDirection: "column",
  },
  checkboxTitle: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "5px",
  },
  checkboxDescription: {
    fontSize: "14px",
    color: "#555",
    margin: 0,
  },
};

export default Register;
