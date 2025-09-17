import React, { useState } from "react";
import "./SignUp.css";
import { FaUser, FaEnvelope, FaLock, FaUserTag } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { USER_API_ENDPOINT } from "../utils/constant";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    // Correction 1: Updated validation message for clarity
    if (!formData.name) newErrors.name = "Name is required";
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
    return newErrors;
  };

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
        `${USER_API_ENDPOINT}/register`,
        formData
      );

      console.log("Registration successful:", response.data);
      alert("Registration successful! Please log in.");

      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      setErrors({ api: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form-wrapper">
        <form className="signup-form" onSubmit={handleSubmit} noValidate>
          <h2 className="signup-title">Create Your Account</h2>
          <p className="signup-location">📍 Prayagraj, India</p>

          {errors.api && <p className="error-text api-error">{errors.api}</p>}

          {/* Name Field */}
          <div className="input-group">
            <FaUser className="input-icon" />
            <input
              type="text"
              // Correction 2: Changed name attribute to match state
              name="name"
              className="input-field"
              // Correction 3: Updated placeholder to match
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <p className="error-text">{errors.name}</p>}
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

          {/* Role Field */}
          <div className="input-group">
            <FaUserTag className="input-icon" />
            <select
              name="role"
              className="input-field"
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

          <button type="submit" className="signup-button" disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>

          <p className="login-link">
            Already have an account? <Link to="/login">Log In</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
