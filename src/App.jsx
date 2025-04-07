import React from 'react';
import {
  Routes,
  Route,
  // Link // We'll use Link later in components like Navbar
} from 'react-router-dom';

// Import Page Components
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AdminPage from './pages/AdminPage'; // We'll add protected routing later
import UserProfilePage from './pages/UserProfilePage';
import NotFoundPage from './pages/NotFoundPage'; // Create this page

// Import Components
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute
import Navbar from './components/Navbar'; // Import Navbar
// TODO: Import AuthProvider/context

function App() {
  return (
    // TODO: Wrap with AuthProvider
    <>
      <Navbar /> {/* Add Navbar here */}
      <div className="container mt-4"> {/* Use container and add margin-top */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route path="/:username" element={<UserProfilePage />} />
          <Route path="*" element={<NotFoundPage />} /> {/* Catch-all for 404 */} 
        </Routes>
      </div>
    </>
  );
}

export default App;
