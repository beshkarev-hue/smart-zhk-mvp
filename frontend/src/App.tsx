import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { authService } from './services/api';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Resident pages
import DashboardPage from './pages/resident/DashboardPage';
import PaymentsPage from './pages/resident/PaymentsPage';
import RequestsPage from './pages/resident/RequestsPage';
import CreateRequestPage from './pages/resident/CreateRequestPage';
import NewsPage from './pages/resident/NewsPage';
import ProfilePage from './pages/resident/ProfilePage';
import MetersPage from './pages/resident/MetersPage';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Resident routes */}
        <Route path="/resident/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/resident/payments" element={<ProtectedRoute><PaymentsPage /></ProtectedRoute>} />
        <Route path="/resident/requests" element={<ProtectedRoute><RequestsPage /></ProtectedRoute>} />
        <Route path="/resident/requests/new" element={<ProtectedRoute><CreateRequestPage /></ProtectedRoute>} />
        <Route path="/resident/news" element={<ProtectedRoute><NewsPage /></ProtectedRoute>} />
        <Route path="/resident/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/resident/meters" element={<ProtectedRoute><MetersPage /></ProtectedRoute>} />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
