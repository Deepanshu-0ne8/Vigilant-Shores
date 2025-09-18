import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";
import { FaEnvelope, FaLock } from "react-icons/fa";
import axios from "axios"; // 1. Import axios
import { USER_API_ENDPOINT } from "../utils/constant";
import { useAuth } from "../context/AuthContext";


const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // Use the login function from context
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid";
    }
    if (!formData.password) newErrors.password = "Password is required";
    return newErrors;
  };

  // 3. Corrected the function structure
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    try {
      // 3. Instead of axios, call the context's login function
      await login(formData.email, formData.password);

      // If login is successful, the user state is now updated globally.
      // Now we can navigate to the dashboard.
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      const errorMessage =
        error.response?.data?.message || "Login failed. Please try again.";
      setErrors({ api: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className="absolute top-6 left-6">
        <Link to="/" className="text-2xl font-bold text-[#1E3A8A]">
          <div className='flex items-center gap-2'>
            <span><img className='w-12 h-12 border rounded-full' src="/logo.png" alt="Logo" /></span>
            <span>Vigilant<span className='text-blue-400'>Shores</span></span>
          </div>
        </Link>
      </div>
      <div className="login-container">
        <div className="login-form-wrapper">
          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <h2 className="login-title">Welcome Back</h2>
            {/* 5. Updated date */}
            <p className="login-location">
              Prayagraj, Uttar Pradesh — Sept. 17, 2025
            </p>

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
              {errors.password && (
                <p className="error-text">{errors.password}</p>
              )}
            </div>

            {/* 7. Enhanced button with loading state */}
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? "Logging In..." : "Log In"}
            </button>

            <p className="signup-link">
              Don't have an account? <Link to="/signup">Sign Up</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
