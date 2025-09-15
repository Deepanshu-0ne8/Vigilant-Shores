import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link for SPA navigation
import './Login.css';
import { FaEnvelope, FaLock } from 'react-icons/fa';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  // Handles changes in the input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Validates the form data
  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }
    if (!formData.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  // Handles the form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      // Simulate a successful login
      console.log('Login successful with:', formData);
      alert('Login successful! Redirecting to the dashboard...');

      // Redirect to the dashboard page
      navigate('/dashboard');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-wrapper">
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <h2 className="login-title">Welcome Back</h2>
          <p className="login-location">Prayagraj, Uttar Pradesh — Sept. 15, 2025</p>
          
          {/* Email Field */}
          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              name="email"
              className="input-field"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

          {/* Password Field */}
          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              name="password"
              className="input-field"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>

          <button type="submit" className="submit-button">
            Log In
          </button>

          <p className="signup-link">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;