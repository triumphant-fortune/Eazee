import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Storefront from './pages/Storefront';
import CaptionGenerator from './pages/CaptionGenerator';
import Landing from './pages/Landing';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  return user ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/onboarding" element={<PrivateRoute><Onboarding /></PrivateRoute>} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/captions" element={<PrivateRoute><CaptionGenerator /></PrivateRoute>} />
      <Route path="/store/:slug" element={<Storefront />} />
    </Routes>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-center" toastOptions={{ duration: 3000, style: { borderRadius: '12px', fontFamily: 'Inter, sans-serif', fontSize: '14px' } }} />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
