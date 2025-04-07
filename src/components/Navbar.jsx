import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { isAuthenticated, logout, user } = useAuth();

    const handleLogout = () => {
        logout();
    };

    const activeStyle = ({ isActive }) => {
        return {
            fontWeight: isActive ? 'bold' : 'normal',
        };
    };

    return (
        <nav className="navbar">
            <div className="navbar-container container">
                <Link to="/" className="navbar-logo">Linky</Link>
                <ul className="navbar-menu">
                    <li className="navbar-item">
                        <NavLink to="/" className="navbar-links" style={activeStyle} end>
                            Home
                        </NavLink>
                    </li>
                    {isAuthenticated && user ? (
                        <>
                            <li className="navbar-item">
                                <NavLink to="/admin" className="navbar-links" style={activeStyle}>
                                    Admin
                                </NavLink>
                            </li>
                            <li className="navbar-item">
                                <NavLink 
                                    to={user.profile?.username ? `/${user.profile.username}` : '/'}
                                    className="navbar-links" 
                                    style={activeStyle}
                                >
                                    My Page
                                </NavLink>
                            </li>
                            <li className="navbar-item">
                                <button onClick={handleLogout} className="navbar-button-link">
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="navbar-item">
                                <NavLink to="/login" className="navbar-links" style={activeStyle}>
                                    Login
                                </NavLink>
                            </li>
                            <li className="navbar-item">
                                <NavLink to="/signup" className="navbar-links" style={activeStyle}>
                                    Sign Up
                                </NavLink>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar; 