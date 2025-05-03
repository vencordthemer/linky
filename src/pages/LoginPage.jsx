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
*
*Credits:
* - Firebase for authentication and database
* - Vencordthemer for coding the main app
* - Freepik for icons
* - YOU for using this app
*/
import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import googleIcon from '../assets/googleIcon.svg';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { login, signInWithGoogle, resetPassword, isAuthenticated, loading } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    const result = await login(formData.email, formData.password);
    if (!result.success) {
      setError(result.error);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setMessage('');
    const result = await signInWithGoogle();
    if (!result.success && result.error) {
      setError(result.error);
    }
  };

  const handleResetPassword = async () => {
    if (!formData.email) {
      setError('Please enter your email address first.');
      setMessage('');
      return;
    }
    const result = await resetPassword(formData.email);
    if (!result.success) {
      setError(result.error);
      setMessage('');
    } else {
      setError('');
      setMessage('A password reset email has been sent.');
    }
  };

  if (!loading && isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="container" style={{ maxWidth: '500px' }}>
      <form onSubmit={handleSubmit}>
        <h2 className="text-center mb-4">Login</h2>

        {error && <p className="alert alert-danger">{error}</p>}
        {message && <p className="alert alert-success">{message}</p>}

        <div className="mb-3">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

{/* Google Sign-In Button */}
<div className="text-center mt-3 mb-3">
  <p style={{ marginBottom: '0.5rem' }}>OR</p>
  <div style={{ display: 'flex', justifyContent: 'center' }}>
    <button
      onClick={handleGoogleSignIn}
      className="btn"
      disabled={loading}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '50px', // Set width
        height: '50px', // Set height
        borderRadius: '50%', // Make it circular
        background: '#000000',
        border: '1px solid #ddd',
        padding: '0',
      }}
    >
      <img
        src={googleIcon}
        alt="Sign in with Google"
        style={{
          width: '24px',
          height: '24px',
        }}
      />
    </button>
  </div>
</div>

      <p className="text-center mt-3">
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>

      <p className="text-center mt-3">
        Forgot your password?{' '}
        <button onClick={handleResetPassword} className="btn btn-link p-0 m-0 align-baseline">
          Reset it!
        </button>
      </p>
    </div>
  );
};

export default LoginPage;

