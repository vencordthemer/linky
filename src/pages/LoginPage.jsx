import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
// Remove direct axios import if not needed elsewhere in the file eventually
// import axios from 'axios'; 
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  // Get login function, loading state, and auth status from context
  const { login, signInWithGoogle, isAuthenticated, loading } = useAuth(); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    // No need for setLoading(true/false) here, context handles it
    
    // Call the login function from context
    const result = await login(formData.email, formData.password);
    
    // If login failed in the context, show the error
    if (!result.success) {
        setError(result.error);
    }
    // Navigation is handled within the login function in AuthContext
  };

  // Handle Google Sign-In click
  const handleGoogleSignIn = async () => {
    setError('');
    const result = await signInWithGoogle();
    if (!result.success && result.error) { // Show error only if one was returned
        setError(result.error);
    }
    // Navigation is handled in AuthContext
  };

  // If already authenticated (and not loading), redirect to admin
  if (!loading && isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="container" style={{ maxWidth: '500px' }}>
      <form onSubmit={handleSubmit}>
        <h2 className="text-center mb-4">Login</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="mb-3">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading} // Use loading state from context
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
            disabled={loading} // Use loading state from context
          />
        </div>
        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {/* Google Sign-In Button */}
      <div className="text-center mt-3 mb-3">
        <p style={{marginBottom: '0.5rem'}}>OR</p>
        <button 
            onClick={handleGoogleSignIn} 
            className="btn btn-secondary" // Use secondary style or create a google style
            disabled={loading}
            style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}} // Basic styling
        >
           {/* Add Google Icon later if desired */} 
          <span style={{marginLeft: '0.5rem'}}>{loading ? 'Signing in...' : 'Sign in with Google'}</span>
        </button>
      </div>

      <p className="text-center mt-3">
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
};

export default LoginPage; 