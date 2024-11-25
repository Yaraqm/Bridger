import React, { useState } from "react";
import axios from "axios";



const FriendFinder = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState("");

  // Dynamically search friends as user types
  const handleSearchChange = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim() === "") {
      setSearchResults([]); // Clear results for empty input
      setError("");
      return;
    }

    try {
      const response = await axios.get(
        "http://localhost:5000/api/friends/search",
        {
          params: { query: term },
        }
      );
      setSearchResults(response.data);
      setError("");
    } catch (err) {
      console.error("Error from API:", err.response || err.message);
      setError("Failed to search for friends.");
    }
  };

  // Add friend functionality
  const addFriend = async (friendId) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("You need to be logged in to send a friend request.");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/friends/send", // Ensure the URL is correct
        { targetUserId: friendId }, // Correct request body
        { headers: { Authorization: `Bearer ${token}` } } // Authorization token
      );

      alert("Friend request sent successfully!");
      setSearchResults((prev) =>
        prev.filter((user) => user.user_id !== friendId)
      );
    } catch (error) {
      if (error.response) {
        // Server responded with a specific error
        alert(`${error.response.data.message}`);
      } else {
        // General error (e.g., network issue)
        alert("Failed to send friend request. Please try again.");
      }
      console.error("Error sending friend request:", error.message);
    }
  };

  return (
    <div style={styles.friendFinder}>
      <h2>Find New Friends</h2>
      <input
        type="text"
        placeholder="Search friends by name"
        value={searchTerm}
        onChange={handleSearchChange}
        style={styles.searchInput}
      />
      <div style={styles.resultsContainer}>
        {error && <p style={styles.error}>{error}</p>}
        {searchResults.length === 0 && !error && searchTerm.trim() === "" && (
          <p>Start typing to search for friends...</p>
        )}
        {searchResults.length === 0 && !error && searchTerm.trim() !== "" && (
          <p>No results found</p>
        )}
        <ul style={styles.results}>
          {searchResults.map((user) => (
            <li key={user.user_id} style={styles.resultItem}>
              {user.name} ({user.email})
              <button
                onClick={() => addFriend(user.user_id)}
                style={styles.addButton}
              >
                Add Friend
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const styles = {
  friendFinder: {
    position: "relative",
    height: "100%",
    overflowY: "auto",
    padding: "10px",
    color: "#fff",
    backgroundColor: "#2C3E50",
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    backgroundColor: "#acd2ed",
    color: "#00004a",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    fontWeight: "bold",
    padding: "5px 10px",
    cursor: "pointer",
  },
  searchInput: {
    width: "90%",
    padding: "10px",
    marginBottom: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  resultsContainer: {
    overflowY: "auto",
    maxHeight: "400px", // Adjust for reasonable scrolling
  },
  results: {
    marginTop: "10px",
    listStyleType: "none",
    padding: 0,
  },
  resultItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
    color: "#fff",
    fontSize: "15px",
  },
  addButton: {
    fontSize: "12px",
    fontWeight: "bold",
    width: "100px",
    padding: "10px 5px",
    color: "#000",
    backgroundColor: "#ddbdf2",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontFamily: "Raleway, sans-serif",
  },
};

export default FriendFinder;
