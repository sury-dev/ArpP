import React, { useState, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, canAdd } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [logout, navigate]);

  const isActive = useCallback((path) => {
    return location.pathname === path;
  }, [location.pathname]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(!isMenuOpen);
  }, [isMenuOpen]);

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/dashboard" className="brand-link">
            <span className="brand-icon">💰</span>
            <span className="brand-text">Finance Tracker</span>
          </Link>
        </div>

        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <div className="nav-links">
            <Link 
              to="/dashboard" 
              className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              📊 Dashboard
            </Link>
            
            <Link 
              to="/transactions" 
              className={`nav-link ${isActive('/transactions') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              📝 Transactions
            </Link>
            
            {canAdd && (
              <Link 
                to="/transactions/add" 
                className={`nav-link ${isActive('/transactions/add') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                ➕ Add Transaction
              </Link>
            )}
            
            <Link 
              to="/analytics" 
              className={`nav-link ${isActive('/analytics') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              📈 Analytics
            </Link>
          </div>

          <div className="navbar-actions">
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>

            <div className="user-menu">
              <button 
                className="user-menu-toggle"
                onClick={toggleMenu}
                title="User menu"
              >
                <span className="user-avatar">
                  {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                </span>
                <span className="user-name">
                  {user.name || user.email}
                </span>
                <span className="user-role">
                  {user.role}
                </span>
              </button>

              {isMenuOpen && (
                <div className="user-dropdown">
                  <div className="user-info">
                    <div className="user-details">
                      <p className="user-full-name">{user.name || 'User'}</p>
                      <p className="user-email">{user.email}</p>
                      <p className="user-role-badge">{user.role}</p>
                    </div>
                  </div>
                  
                  <div className="dropdown-actions">
                    <button 
                      className="dropdown-item"
                      onClick={handleLogout}
                    >
                      🚪 Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <button 
            className="mobile-menu-toggle"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}></span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
