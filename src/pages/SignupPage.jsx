import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SignupPage = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { signup, signInWithGoogle, isAuthenticated, loading } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await signup(formData.username, formData.email, formData.password);
    if (!result.success) {
        setError(result.error);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    const result = await signInWithGoogle();
    if (!result.success && result.error) {
        setError(result.error);
    }
  };

  if (!loading && isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="container" style={{ maxWidth: '500px' }}>
      <form onSubmit={handleSubmit}>
        <h2 className="text-center mb-4">Sign Up</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="mb-3">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
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
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
      <div className="text-center mt-3 mb-3">
        <p style={{marginBottom: '0.5rem'}}>OR</p>
        <button 
            onClick={handleGoogleSignIn} 
            className="btn btn-secondary"
            disabled={loading}
            style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}
        >
          <span style={{marginLeft: '0.5rem'}}>{loading ? 'Signing in...' : 'Sign up with Google'}</span>
        </button>
      </div>
      <p className="text-center mt-3">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default SignupPage; 