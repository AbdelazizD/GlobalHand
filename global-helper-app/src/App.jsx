import './app.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

import { useAuth } from "@/hooks/useAuth";

// Import Pages and Components
import Dashboard from './pages/Dashboard'; // ✅ Import the full dashboard page
import RequestFormRoutes from './pages/request/RequestFormLayout';
import SuccessfulSubmission from './pages/SuccessfulSubmission';
import BrowseTasksPage from './pages/BrowseTasksPage';
import LoginPage from './pages/Login';
import Homepage from './pages/Homepage';
import NavigationBar from './components/NavigationBar';

function App() {
  const { isVolunteer } = useAuth();
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);
      console.log("Auth state changed, User UID:", currentUser?.uid || 'No user');
    });

    return () => unsubscribe();
  }, []);

  if (loadingAuth) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Loading authentication...</p>
      </div>
    );
  }

  return (
    <Router>
      <NavigationBar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" replace />} />

        {/* Protected Dashboard Route (delegates rendering logic to Dashboard.jsx) */}
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/login" state={{ from: '/dashboard' }} replace />}
        />

        {/* Volunteer-only Route */}
        {isVolunteer && (
          <Route path="/browse" element={<BrowseTasksPage />} />
        )}

        {/* Request Form Routes */}
        <Route
          path="/request/*"
          element={user ? <RequestFormRoutes user={user} /> : <Navigate to="/login" state={{ from: '/request' }} replace />}
        />

        {/* Success Page */}
        <Route path="/successful-submission" element={<SuccessfulSubmission />} />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
