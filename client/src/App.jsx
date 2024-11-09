import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import ProtectedPage from './pages/Protected';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import HomePage from './pages/Homepage';
import VideoChatPage from "./pages/VideoChatPage";
import SettingsPage from "./pages/SettingsPage";
import FitnessProfile from './pages/FitnessProfile';

function App() {

    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/protected" element={<ProtectedPage />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/videochatpage" element={<VideoChatPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="fitnessprofile" element={<FitnessProfile />}/>
            </Routes>
        </Router>
    );
}

export default App;