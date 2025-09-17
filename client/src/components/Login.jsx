import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import axios from 'axios'; // 1. Import axios
import { USER_API_ENDPOINT } from '../utils/constant';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // 2. Add loading state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

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

  // 3. Corrected the function structure
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${USER_API_ENDPOINT}/signin`,
        formData
      );
      
      // On successful login, navigate to the dashboard
      navigate("/dashboard");

    } catch (error) {
      console.error("Login failed:", error);
      // 4. Improved error message context
      const errorMessage =
        error.response?.data?.message ||
        "Login failed. Please try again.";
      setErrors({ api: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-wrapper">
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <h2 className="login-title">Welcome Back</h2>
          {/* 5. Updated date */}
          <p className="login-location">Prayagraj, Uttar Pradesh — Sept. 17, 2025</p>
          
          {/* 6. Added a place to display API errors */}
          {errors.api && <p className="error-text api-error">{errors.api}</p>}
          
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

          {/* 7. Enhanced button with loading state */}
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Logging In...' : 'Log In'}
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