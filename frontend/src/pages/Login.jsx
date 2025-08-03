import React, { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isRegistering) {
        const response = await authAPI.register(formData);
        login(response.data.user, response.data.token);
      } else {
        const response = await authAPI.login({
          email: formData.email,
          password: formData.password
        });
        login(response.data.user, response.data.token);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  }, [formData, isRegistering, login, navigate]);

  const toggleMode = useCallback(() => {
    setIsRegistering(!isRegistering);
    setError('');
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'user'
    });
  }, [isRegistering]);

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Finance Tracker</h1>
          <p>{isRegistering ? 'Create your account' : 'Welcome back'}</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {isRegistering && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter your full name"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder="Enter your password"
                minLength={6}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {isRegistering && (
            <div className="form-group">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                required
              >
                <option value="user">User</option>
                <option value="read-only">Read Only</option>
              </select>
            </div>
          )}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Loading...' : (isRegistering ? 'Register' : 'Login')}
          </button>
        </form>

        <div className="login-footer">
          <p>
            {isRegistering ? 'Already have an account?' : "Don't have an account?"}
            <button
              type="button"
              className="toggle-btn"
              onClick={toggleMode}
            >
              {isRegistering ? 'Login' : 'Register'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
