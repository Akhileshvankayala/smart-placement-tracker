import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminCompanies from './pages/AdminCompanies';
import AdminStudents from './pages/AdminStudents';
import AdminApplications from './pages/AdminApplications';

// Student Pages
import StudentDashboard from './pages/StudentDashboard';
import StudentCompanies from './pages/StudentCompanies';
import StudentApplications from './pages/StudentApplications';
import StudentProfile from './pages/StudentProfile';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Admin Routes */}
          <Route element={<Layout allowedRoles={['admin']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/companies" element={<AdminCompanies />} />
            <Route path="/admin/students" element={<AdminStudents />} />
            <Route path="/admin/applications" element={<AdminApplications />} />
            <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
          </Route>

          {/* Student Routes */}
          <Route element={<Layout allowedRoles={['student']} />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/companies" element={<StudentCompanies />} />
            <Route path="/student/applications" element={<StudentApplications />} />
            <Route path="/student/profile" element={<StudentProfile />} />
            <Route path="/student" element={<Navigate to="/student/dashboard" />} />
          </Route>

          {/* Fallback routing */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
