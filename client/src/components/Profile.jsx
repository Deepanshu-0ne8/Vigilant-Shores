// src/UserProfile.js

import React, { useState } from 'react';
import './Profile.css';

const Profile = () => {
  // State for the user profile data. In a real app, you'd fetch this.
  const [profile, setProfile] = useState({
    name: 'Alexandra Chen',
    username: 'alex_chen',
    email: 'alex.chen@example.com',
    bio: 'Software developer and tech enthusiast. I love building things with React and exploring new technologies. Coffee-powered coder.',
  });

  // State to toggle between view and edit mode
  const [isEditing, setIsEditing] = useState(false);

  // Temporary state to hold form data while editing
  const [editForm, setEditForm] = useState({ ...profile });

  // Handle input changes in the form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prevForm => ({
      ...prevForm,
      [name]: value,
    }));
  };

  // Handle saving the form
  const handleSave = (e) => {
    e.preventDefault();
    setProfile(editForm); // Update the main profile state
    setIsEditing(false);  // Switch back to view mode
    // In a real app, you would make an API call here to save the data
    console.log('Profile saved:', editForm);
  };

  // Handle canceling the edit
  const handleCancel = () => {
    setEditForm(profile); // Reset form to original profile data
    setIsEditing(false);  // Switch back to view mode
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>User Profile</h1>
      </div>

      {isEditing ? (
        // EDIT MODE
        <form className="profile-form" onSubmit={handleSave}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={editForm.name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={editForm.username}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={editForm.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              rows="4"
              value={editForm.bio}
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="button-group">
            <button type="submit" className="btn btn-primary">Save</button>
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
          </div>
        </form>
      ) : (
        // VIEW MODE
        <div className="profile-display">
          <div className="detail-item">
            <strong>Name:</strong>
            <p>{profile.name}</p>
          </div>
          <div className="detail-item">
            <strong>Username:</strong>
            <p>{profile.username}</p>
          </div>
          <div className="detail-item">
            <strong>Email:</strong>
            <p>{profile.email}</p>
          </div>
          <div className="detail-item">
            <strong>Bio:</strong>
            <p>{profile.bio}</p>
          </div>
          <div className="button-group">
            <button className="btn btn-primary" onClick={() => setIsEditing(true)}>Edit Profile</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;