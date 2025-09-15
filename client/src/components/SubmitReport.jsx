import React, { useState } from 'react';
import './SubmitReport.css';
import { FaClipboardList, FaPencilAlt, FaImage } from 'react-icons/fa';
import { useNavigate } from 'react-router';

const titleOptions = [
  'Coastal Flooding / Tidal Surge',
  'Oil Spill / Chemical Leak',
  'Marine Debris / Plastic Pollution',
  'Coastal Erosion',
  'Harmful Algal Bloom (Red Tide)',
  'Damaged Coastal Infrastructure',
  'Vessel in Distress',
  'Illegal Fishing / Poaching',
  'Other',
];

const SubmitReport = () => {

    const navigate = useNavigate();
  // State for text inputs
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });

  // Separate state for the image file and its preview URL
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

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
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // Create a temporary URL for preview
      if (errors.image) setErrors({ ...errors, image: null });
    } else {
      setImageFile(null);
      setImagePreview('');
    }
  };

  // Validation logic
  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = 'Please select a report title.';
    if (!formData.description) newErrors.description = 'Description cannot be empty.';
    if (!imageFile) newErrors.image = 'Please upload an image.';
    return newErrors;
  };

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      const submissionData = new FormData();
      submissionData.append('title', formData.title);
      submissionData.append('description', formData.description);
      submissionData.append('image', imageFile);
      
      console.log('Form Submitted:', {
        title: formData.title,
        description: formData.description,
        image: imageFile.name,
      });

      alert('Report submitted successfully!');

      navigate('/dashboard');
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
            <select name="title" className="input-field" value={formData.title} onChange={handleChange}>
              <option value="" disabled>Select Incident Type...</option>
              {titleOptions.map(option => (
                <option key={option} value={option}>{option}</option>
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
            {errors.description && <p className="error-text">{errors.description}</p>}
          </div>

          {/* Image Upload */}
          <div className="input-group">
            <label htmlFor="imageUpload" className="image-upload-label">
              <FaImage />
              <span>{imageFile ? imageFile.name : 'Upload an Image'}</span>
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
              <img src={imagePreview} alt="Selected Preview" className="image-preview" />
            </div>
          )}

          <button type="submit" className="submit-button">
            Submit Report
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmitReport;