import React, { useState } from "react";
import "./SubmitReport.css";
import { FaClipboardList, FaPencilAlt, FaImage } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "../context/LocationContext";
import axios from "axios";
import { REPORT_API_ENDPOINT } from "../utils/constant";

const titleOptions = [
  "Tsunami",
  "Hurricane",
  "Coastal Flooding",
  "Typhoon",
  "Cyclone",
  "Storm Surge",
  "Erosion",
  "Oil spill",
  "Red Tide",
  "Other",
];

const severityOptions = ["Low", "Medium", "High"];

const SubmitReport = () => {
  const [loadingsub, setLoadingsub] = useState(false);
  const { user } = useAuth();
  const userId = user._id;
  const { location, loading, error, fetchLocation } = useLocation();

  const navigate = useNavigate();
  // State for text inputs
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    severity: "",
  });

  // Separate state for the image file and its preview URL
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // State for validation errors
  const [errors, setErrors] = useState({});

  // Handler for text and select inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handler specifically for the image input
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // Create a temporary URL for preview
      if (errors.image) setErrors({ ...errors, image: null });
    } else {
      setImageFile(null);
      setImagePreview("");
    }
  };

  // Validation logic
  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = "Please select a report title.";
    if (!formData.description)
      newErrors.description = "Description cannot be empty.";
    if (!formData.severity)
      newErrors.severity = "Please select the severity level.";
    if (!imageFile) newErrors.image = "Please upload an image.";
    return newErrors;
  };

  // Form submission handler
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   const validationErrors = validateForm();
  //   setErrors(validationErrors);

  //   if (Object.keys(validationErrors).length === 0) {
  //     const submissionData = new FormData();
  //     submissionData.append('title', formData.title);
  //     submissionData.append('description', formData.description);
  //     submissionData.append('image', imageFile);

  //     console.log('Form Submitted:', {
  //       title: formData.title,
  //       description: formData.description,
  //       severity: formData.severity,
  //       image: imageFile.name,
  //     });

  //     alert('Report submitted successfully!');

  //     navigate('/dashboard');
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setLoadingsub(true);
    try {
      const submissionData = new FormData();
      submissionData.append("title", formData.title);
      submissionData.append("description", formData.description);
      submissionData.append("severity", formData.severity);
      submissionData.append("location", location);
      submissionData.append("image", imageFile);
      submissionData.append("createdBy", userId);
      const response = await axios.post(
        `${REPORT_API_ENDPOINT}/create`,
        submissionData
      );

      console.log("Registration successful:", response.data);
      alert("Registration successful! Please log in.");

      navigate("/");
    } catch (error) {
      console.error("Registration failed:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      setErrors({ api: errorMessage });
    } finally {
      setLoadingsub(false);
    }
  };

  return (
    <div className="report-container">
      <div className="report-form-wrapper">
        <form className="report-form" onSubmit={handleSubmit} noValidate>
          <h2 className="report-title">Submit a Coastal Incident Report</h2>
          <p className="report-location">📍 Prayagraj, Uttar Pradesh</p>

          {/* Title Dropdown */}
          <div className="input-group">
            <FaClipboardList className="input-icon" />
            <select
              name="title"
              className="input-field"
              value={formData.title}
              onChange={handleChange}
            >
              <option value="" disabled>
                Select Incident Type...
              </option>
              {titleOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.title && <p className="error-text">{errors.title}</p>}
          </div>

          {/* Description Textarea */}
          <div className="input-group">
            <FaPencilAlt className="input-icon textarea-icon" />
            <textarea
              name="description"
              className="input-field"
              placeholder="Describe the incident..."
              rows="4"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
            {errors.description && (
              <p className="error-text">{errors.description}</p>
            )}
          </div>

          {/* Severity Dropdown */}
          <div className="input-group">
            <FaClipboardList className="input-icon" />
            <select
              name="severity"
              className="input-field"
              value={formData.severity}
              onChange={handleChange}
            >
              <option value="" disabled>
                Select Incident severity...
              </option>
              {severityOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.title && <p className="error-text">{errors.title}</p>}
          </div>

          {/*Location/*/}
          <div>
            <label className="px-2 mt-4 block text-sm font-medium text-slate-700">
              Location
            </label>
            <div className="my-1">
              {/* 3. Call fetchLocation on button click */}
              <button
                type="button"
                onClick={fetchLocation}
                className="bg-blue-500 text-white font-semibold m-2 py-2 px-4 rounded-lg hover:bg-blue-600"
              >
                📍 {loading ? "Fetching..." : "Get Current Location"}
              </button>
              {/* 4. Display status and results from context */}
              {error && <p className="text-sm text-red-500 m-2">{error}</p>}
              {location && (
                <p className="text-sm text-green-600 m-2">
                  Location Captured: {location.latitude.toFixed(4)},{" "}
                  {location.longitude.toFixed(4)}
                </p>
              )}
            </div>
          </div>

          {/* Image Upload */}
          <div className="input-group">
            <label htmlFor="imageUpload" className="image-upload-label">
              <FaImage />
              <span>{imageFile ? imageFile.name : "Upload an Image"}</span>
            </label>
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              className="image-upload-input"
              onChange={handleImageChange}
            />
            {errors.image && <p className="error-text">{errors.image}</p>}
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="image-preview-container">
              <img
                src={imagePreview}
                alt="Selected Preview"
                className="image-preview"
              />
            </div>
          )}

          <button type="submit" className="submit-button" disabled={loadingsub}>
            {loadingsub ? "Submitting report.." : "Submit report"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmitReport;
