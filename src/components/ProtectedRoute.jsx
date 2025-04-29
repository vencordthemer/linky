/*!
 * Linky - A Linktree Clone Built with Vite and Firebase
 * Copyright (c) 2025 Vencordthemer and contributors
 *
 * This project is open-source and licensed under the MIT License.
 * You can find the source code at: https://github.com/vencordthemer/linky
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * MIT License for more details.
 *Credits:
* - Firebase for authentication and database
* - Vencordthemer for coding the main app
* - Freepik for icons
* - YOU for using this app
 */
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
