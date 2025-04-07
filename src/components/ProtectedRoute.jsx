import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    // Show loading indicator while checking auth status
    if (loading) {
        return <div>Loading authentication status...</div>; // Or a spinner component
    }

    // If not authenticated, redirect to login page,
    // saving the current location they tried to access
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If authenticated, render the child component
    return children;
};

export default ProtectedRoute; 