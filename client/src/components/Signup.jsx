import React, { useState } from "react";
import "./SignUp.css"; // We'll create this file next
import { FaUser, FaEnvelope, FaLock, FaUserTag } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  // State for form fields
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // State for validation errors
  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Validate the form data
  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid";
    }
    if (!formData.role) newErrors.role = "Please select a role";
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);

    // If there are no errors, proceed with form submission
    if (Object.keys(validationErrors).length === 0) {
      console.log("Form submitted successfully:", formData);
      // Here you would typically send the data to a server
      // Reset form or redirect user
      navigate("/dashboard"); // Redirect to dashboard after successful signup
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form-wrapper">
        <form className="signup-form" onSubmit={handleSubmit} noValidate>
          <h2 className="signup-title">Create Your Account</h2>
          <p className="signup-location">📍 Prayagraj, India</p>

          {/* Username Field */}
          <div className="input-group">
            <FaUser className="input-icon" />
            <input
              type="text"
              name="username"
              className="input-field"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
            />
            {errors.username && <p className="error-text">{errors.username}</p>}
          </div>

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

          {/* Role field */}
          <div className="input-group">
            <FaUserTag className="input-icon" /> {/* Using a different icon */}
            <select
              name="role"
              className="input-field" // Reusing the same class for consistent styling
              value={formData.role}
              onChange={handleChange}
            >
              <option value="" disabled>
                Select a Role...
              </option>
              <option value="citizen">Citizen</option>
              <option value="analyst">Analyst</option>
            </select>
            {errors.role && <p className="error-text">{errors.role}</p>}
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

          {/* Confirm Password Field */}
          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              name="confirmPassword"
              className="input-field"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && (
              <p className="error-text">{errors.confirmPassword}</p>
            )}
          </div>

          <button type="submit" className="signup-button">
            Sign Up
          </button>

          <p className="login-link">
            Already have an account? <a href="/login">Log In</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
