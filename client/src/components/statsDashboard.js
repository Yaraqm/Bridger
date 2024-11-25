import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const StatsDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTable, setShowTable] = useState(true);

  // To hold data for the graph
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Users Created Over Time',
        data: [],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  });

  // Retrieve the token from local storage (or session, depending on how it's stored)
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    if (!token) {
      setError('You must be logged in to view stats.');
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats/stats', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user stats');
        }

        const data = await response.json();
        setUsers(data.Users); // Set the users data returned from the backend

        // Process data for the chart
        const dates = data.Users.map((user) => new Date(user.created_at).toLocaleDateString());
        const dateCounts = {};

        // Count the number of users created each day
        dates.forEach((date) => {
          dateCounts[date] = (dateCounts[date] || 0) + 1;
        });

        // Prepare chart data
        const labels = Object.keys(dateCounts);
        const userCountData = Object.values(dateCounts);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Users Created Over Time',
              data: userCountData,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              fill: true,
            },
          ],
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  const toggleTable = () => {
    setShowTable(!showTable); // Toggle table visibility
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!users.length) {
    return <div>No users available.</div>;
  }

  return (
    <div>
      <h1>All Users Stats Dashboard</h1>

      {/* Display Total Users */}
      <div style={{ marginBottom: '20px' }}>
        <h2>Total Users: {users.length}</h2>
      </div>

      {/* Line Chart */}
      <div style={{ marginBottom: '20px' }}>
        <Line data={chartData} options={{ responsive: true }} />
      </div>

      {/* Toggle Table */}
      <button onClick={toggleTable}>
        {showTable ? 'Hide Table' : 'Show Table'}
      </button>

      {/* Display Users Table */}
      {showTable && (
        <table border="1" cellPadding="10" style={{ marginTop: '20px', width: '100%', textAlign: 'left' }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Account Created At</th>
              <th>Total Points</th>
              <th>Friends Count</th>
              <th>Friend User IDs</th>
              <th>High Contrast</th>
              <th>Screen Reader</th>
              <th>Keyboard Navigation</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td>{user.name || 'No name available'}</td>
                <td>{user.email || 'No email available'}</td>
                <td>{new Date(user.created_at).toLocaleDateString()}</td>
                <td>{user.total_points}</td>
                <td>{user.friend_user_ids ? user.friend_user_ids.length : 0}</td>
                <td>{user.friend_user_ids ? user.friend_user_ids.join(', ') : 'None'}</td>
                <td>{user.high_contrast ? 'Enabled' : 'Disabled'}</td>
                <td>{user.screen_reader ? 'Enabled' : 'Disabled'}</td>
                <td>{user.keyboard_navigation ? 'Enabled' : 'Disabled'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StatsDashboard;
