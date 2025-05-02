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
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';
import githubMark from '../assets/github-mark.svg';

const Navbar = () => {
    const { isAuthenticated, logout, user } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setMenuOpen(false);
    };

    const toggleMenu = () => {
        setMenuOpen(prev => !prev);
    };

    const activeStyle = ({ isActive }) => ({
        fontWeight: isActive ? 'bold' : 'normal',
    });

    return (
        <nav className="navbar">
            <div className="navbar-container container">
                <Link to="/" className="navbar-logo">Linky</Link>
 
                <button className="navbar-toggle" onClick={toggleMenu} aria-label="Toggle menu">
    {menuOpen ? '✖' : '☰'}
</button>


                <ul className={`navbar-menu ${menuOpen ? 'mobile-open' : ''}`}>
                    <li className="navbar-item">
                        <NavLink to="/" className="navbar-links" style={activeStyle} end onClick={() => setMenuOpen(false)}>
                            Home
                        </NavLink>
                    </li>

                    {isAuthenticated && user ? (
                        <>
                            <li className="navbar-item">
                                <NavLink to="/admin" className="navbar-links" style={activeStyle} onClick={() => setMenuOpen(false)}>
                                    Admin
                                </NavLink>
                            </li>
                            <li className="navbar-item">
                                <NavLink
                                    to={user.profile?.username ? `/${user.profile.username}` : '/'}
                                    className="navbar-links"
                                    style={activeStyle}
                                    onClick={() => setMenuOpen(false)}
                                >
                                    My Page
                                </NavLink>
                            </li>
                            <li className="navbar-item logoutButton">
                                <button onClick={handleLogout} className="navbar-button-link">
                                    Logout
                                </button>
                            </li>
                            <li className="navbar-item">
                                <NavLink to="https://linky.statuspage.io/" className="navbar-links" style={activeStyle} end onClick={() => setMenuOpen(false)}>
                                    Status
                                </NavLink>
                            </li>
                            <li className="navbar-item">
                                <NavLink to="https://github.com/vencordthemer/linky/tree/master" className="navbar-links" style={activeStyle} onClick={() => setMenuOpen(false)}>
                                    <img src={githubMark} alt="GitHub" className="github-icon" />
                                </NavLink>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="navbar-item">
                                <NavLink to="/login" className="navbar-links" style={activeStyle} onClick={() => setMenuOpen(false)}>
                                    Login
                                </NavLink>
                            </li>
                            <li className="navbar-item">
                                <NavLink to="/signup" className="navbar-links" style={activeStyle} onClick={() => setMenuOpen(false)}>
                                    Sign Up
                                </NavLink>
                            </li>
                            <li className="navbar-item">
                                <NavLink to="https://linky.statuspage.io/" className="navbar-links" style={activeStyle} end onClick={() => setMenuOpen(false)}>
                                    Status
                                </NavLink>
                            </li>
                            <li className="navbar-item">
                                <NavLink to="https://github.com/vencordthemer/linky/tree/master" className="navbar-links" style={activeStyle} onClick={() => setMenuOpen(false)}>
                                    <img src={githubMark} alt="GitHub" className="github-icon" />
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

