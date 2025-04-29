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
import {
  Routes,
  Route,
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
