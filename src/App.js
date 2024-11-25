import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/auth/Login';
import AdminDashboard from './components/AdminDashboard';
import GuestDashboard from './components/GuestDashboard';
import Register from './components/auth/Register';
import Dashboard from './components/Dashboard';
import RoleLogin from './components/auth/RoleLogin';
import Volunteer from './pages/VolunteerForm';
import VenueForm from './pages/VenueForm';
import Profile from './components/Profile';
import SubmitVenue from './pages/SubmitVenue';
import MapComponent from './components/MapComponent'; 
import StatsDashboard from './components/statsDashboard'; 

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/member-login" element={<RoleLogin isAdmin={false} />} />
                <Route path="/admin-login" element={<RoleLogin isAdmin={true} />} />
                <Route path="/signup" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/guest-dashboard" element={<GuestDashboard />} />
                <Route path="/venueForm" element={<VenueForm />} />
                <Route path="/volunteer" element={<Volunteer />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/submit-venue" element={<SubmitVenue />} />
                <Route path="/map" element={<MapComponent />} />
                <Route path="/stats" element={<StatsDashboard />} />
            </Routes>
        </Router>
    );
}

export default App;
