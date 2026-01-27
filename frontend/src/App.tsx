import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { authService } from './services/api';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Resident pages
import DashboardPage from './pages/resident/DashboardPage';
import BuildingInfoPage from './pages/resident/BuildingInfoPage';
import MetersPage from './pages/resident/MetersPage';
import PaymentsPage from './pages/resident/PaymentsPage';
import RequestsPage from './pages/resident/RequestsPage';
import CreateRequestPage from './pages/resident/CreateRequestPage';
import NewsPage from './pages/resident/NewsPage';
import ProfilePage from './pages/resident/ProfilePage';
// Manager pages
import ManagerDashboardPage from './pages/manager/ManagerDashboardPage';
import ExecutorDashboardPage from './pages/executor/ExecutorDashboardPage';
import ManagerRequestsPage from './pages/manager/ManagerRequestsPage';

const ProtectedRoute: React.FC<{ children: React.ReactElement; allowedRoles?: string[] }> = ({ children, allowedRoles }) => {
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getCurrentUser();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }
  
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Resident routes */}
        <Route path="/resident/dashboard" element={<ProtectedRoute allowedRoles={['resident']}><DashboardPage /></ProtectedRoute>} />
            <Route path="/resident/building" element={<ProtectedRoute allowedRoles={['resident']}><BuildingInfoPage /></ProtectedRoute>} />
            <Route path="/resident/meters" element={<ProtectedRoute allowedRoles={['resident']}><MetersPage /></ProtectedRoute>} />
        <Route path="/resident/payments" element={<ProtectedRoute allowedRoles={['resident']}><PaymentsPage /></ProtectedRoute>} />
        <Route path="/resident/requests" element={<ProtectedRoute allowedRoles={['resident']}><RequestsPage /></ProtectedRoute>} />
        <Route path="/resident/requests/new" element={<ProtectedRoute allowedRoles={['resident']}><CreateRequestPage /></ProtectedRoute>} />
        <Route path="/resident/news" element={<ProtectedRoute allowedRoles={['resident']}><NewsPage /></ProtectedRoute>} />
        <Route path="/resident/profile" element={<ProtectedRoute allowedRoles={['resident']}><ProfilePage /></ProtectedRoute>} />
        <Route path="/resident/meters" element={<ProtectedRoute allowedRoles={['resident']}><MetersPage /></ProtectedRoute>} />

        {/* Manager routes */}

        {/* Executor routes */}
        <Route path="/executor/dashboard" element={<ProtectedRoute allowedRoles={['executor']}><ExecutorDashboardPage /></ProtectedRoute>} />
        <Route path="/manager/requests" element={<ProtectedRoute allowedRoles={['manager', 'admin']}><ManagerRequestsPage /></ProtectedRoute>} />
        <Route path="/manager/dashboard" element={<ProtectedRoute allowedRoles={['manager', 'admin']}><ManagerDashboardPage /></ProtectedRoute>} />

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
