// src/App.jsx
import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import LoginPageWithNavbar from './pages/LoginPageWithNavbar';
import UserPage from './pages/UserPage';
import SignUpPage from './pages/SignUpPage';
import { Navbar } from './components/Navbar';
import { AuthProvider } from './context/authContext';
import { AdminProvider } from './context/adminContext';
import ProtectedRoute from './components/ProtectedRoute';
import CustomScrollbar from './components/CustomScrollbar'; // Asegúrate de crear este componente
import './App.css';

function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <BrowserRouter>
          <CustomScrollbar>
            <div className="app-container">
              <Navbar />
              <div className="content-container">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/signin" element={<LoginPageWithNavbar />} />
                  <Route path="/register" element={<SignUpPage />} />
                  <Route
                    path="/admin/panel"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AdminPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/user"
                    element={
                      <ProtectedRoute allowedRoles={['user']}>
                        <UserPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute allowedRoles={['user', 'admin']}>
                        <h1>Perfil</h1>
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </div>
            </div>
          </CustomScrollbar>
        </BrowserRouter>
      </AdminProvider>
    </AuthProvider>
  );
}

export default App;