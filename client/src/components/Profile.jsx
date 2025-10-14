// src/UserProfile.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import { USER_API_ENDPOINT } from "../utils/constant";
import "./Profile.css";
import Navbar from "./Navbar";

const Profile = () => {
  // State for the user profile data, initialized to null
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // State to toggle between view and edit mode
  const [isEditing, setIsEditing] = useState(false);

  // Temporary state to hold form data while editing
  const [editForm, setEditForm] = useState({});

  // State for providing feedback to the user (e.g., "Saving...", "Error!")
  const [status, setStatus] = useState("");

  // Effect to fetch profile data when the component loads
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${USER_API_ENDPOINT}/profile`, {
          withCredentials: true,
        });
        // GET /profile returns { success: true, data: { user } }
        const user = response.data?.data?.user;
        if (!user) throw new Error("Invalid profile response");

        // Set profile with fetched data; keep structure similar to backend model
        setProfile({
          name: user.name || "",
          userName: user.userName || "",
          email: user.email || "",
          displaypic: user.displaypic || { url: "" },
          achievements: user.achievements || [],
        });
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        setProfile(null); // Set profile to null on error
        setStatus("Could not load user profile.");
      } finally {
        // 3. Simplified loading state management
        setLoading(false);
      }
    };

    fetchProfile();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Handler for starting the edit process
  const handleEditClick = () => {
    // 4. Correctly syncs state by copying current profile to form
    setEditForm({ name: profile.name || "", newDpFile: null });
    setStatus(""); // Clear any previous status messages
    setIsEditing(true);
  };

  // Handle canceling the edit
  const handleCancel = () => {
    setIsEditing(false);
    // No need to reset editForm, it will be reset on the next edit click
  };

  // Handle input changes in the form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setEditForm((prev) => ({ ...prev, newDpFile: file }));
  };

  // 5. Handle saving the form with an API call
  const handleSave = async (e) => {
    e.preventDefault();
    setStatus("Saving...");
    try {
      // Backend expects multipart/form-data with field 'name' and file field 'displayPic'
      const formData = new FormData();
      if (editForm.name !== undefined) formData.append("name", editForm.name);
      if (editForm.newDpFile) formData.append("displayPic", editForm.newDpFile);

      const response = await axios.patch(`${USER_API_ENDPOINT}/profile/update`, formData, {
        withCredentials: true,
        headers: {
          // Let the browser set Content-Type including boundary
        },
      });

      // PATCH returns { status: 'success', message, data: updatedUser }
      const updated = response.data?.data;
      if (!updated) throw new Error("Invalid update response");

      setProfile({
        name: updated.name || "",
        userName: updated.userName || "",
        email: updated.email || "",
        displaypic: updated.displaypic || { url: "" },
        achievements: updated.achievements || [],
      });

      setStatus(response.data?.message || "Profile saved successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save profile:", error);
      setStatus("Error: Could not save profile. Please try again.");
    }
  };

  const handleDeleteDp = async () => {
    if (
      !window.confirm("Are you sure you want to remove your profile picture?")
    )
      return;
    setStatus("Removing picture...");
    try {
      const response = await axios.delete(`${USER_API_ENDPOINT}/profile/deleteDp`, {
        withCredentials: true,
      });
      const updated = response.data?.data;
      if (updated) {
        setProfile((prev) => ({
          ...prev,
          displaypic: updated.displaypic || { url: "" },
        }));
      }
      setStatus(response.data?.message || "Picture removed");
    } catch (error) {
      console.error("Failed to remove picture", error);
      setStatus("Error: Could not remove picture.");
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="profile-container">
        <h2>Loading Profile...</h2>
      </div>
    );
  }

  // Render error/empty state if profile could not be fetched
  if (!profile) {
    return (
      <div className="profile-container">
        <h2>{status}</h2>
      </div>
    );
  }

  return (
    <>
    <Navbar/>
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
              value={editForm.name || ""}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="displayPic">Profile picture</label>
            <input
              type="file"
              id="displayPic"
              name="displayPic"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          <div className="button-group">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={status === "Saving..."}
            >
              {status === "Saving..." ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
          {status && <p className="status-message">{status}</p>}
        </form>
      ) : (
        // VIEW MODE
        <>
        <div className="profile-display">
          <div className="profile-pic">
            {profile.displaypic?.url ? (
              <img
                src={profile.displaypic.url}
                alt="profile"
                style={{
                  width: 120,
                  height: 120,
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              />
            ) : (
              <div
                style={{
                  width: 120,
                  height: 120,
                  background: "#eee",
                  borderRadius: "50%",
                }}
              />
            )}
            <div>
              <button
                className="btn btn-danger"
                onClick={handleDeleteDp}
                style={{ marginTop: 8 }}
              >
                Remove picture
              </button>
            </div>
          </div>

          <div className="detail-item">
            <strong>Name:</strong>
            <p>{profile.name}</p>
          </div>
          <div className="detail-item">
            <strong>Username:</strong>
            <p>{profile.userName}</p>
          </div>
          <div className="detail-item">
            <strong>Email:</strong>
            <p>{profile.email}</p>
          </div>

          <div className="button-group">
            <button className="btn btn-primary" onClick={handleEditClick}>
              Edit Profile
            </button>
          </div>
          {status && <p className="status-message">{status}</p>}
        </div>
      </>
      )}
    </div>
    </>
  );
};

export default Profile;
