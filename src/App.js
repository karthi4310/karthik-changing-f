import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import FarmerDashboard from './pages/FarmerDashboard';
import FarmerRegistration from './pages/FarmerRegistration';
import EmployeeRegistration from './pages/EmployeeRegistration';
import RegistrationForm from './pages/RegistrationForm';
import ForgotPassword from './pages/ForgotPassword';
import ForgotUserId from './pages/ForgotUserid';
import ChangePassword from './pages/ChangePassword';
import ChangeUserId from './pages/ChangeUserId';
import OtpVerification from './pages/OtpVerification';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/forgot-userid" element={<ForgotUserId />} />
            <Route path="/otp-verification" element={<OtpVerification />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/change-userid" element={<ChangeUserId />} />
            
            {/* Registration Routes */}
            <Route path="/farmer/registration" element={<FarmerRegistration />} />
            <Route path="/employee/registration" element={<EmployeeRegistration />} />
            <Route path="/register-employee" element={<RegistrationForm />} />
            <Route path="/register-farmer" element={<RegistrationForm />} />
            <Route path="/register-fpo" element={<RegistrationForm />} />
            
            {/* Protected Dashboard Routes */}
            <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/superadmin/dashboard" element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']}><SuperAdminDashboard /></ProtectedRoute>} />
            <Route path="/super-admin/dashboard" element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']}><SuperAdminDashboard /></ProtectedRoute>} />
            <Route path="/employee/dashboard" element={<ProtectedRoute allowedRoles={['EMPLOYEE']}><EmployeeDashboard /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['FARMER']}><FarmerDashboard /></ProtectedRoute>} />
            
            {/* Default Routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
