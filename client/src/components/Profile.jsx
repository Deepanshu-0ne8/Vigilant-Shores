// src/UserProfile.js

import React, { useEffect, useState } from "react";
import axios from "axios"; // 1. Added axios import
import { USER_API_ENDPOINT } from "../utils/constant"; // 1. Added constant import
import "./Profile.css";

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
                const response = await axios.get(`${USER_API_ENDPOINT}/profile`);
                const user = response.data.data.user;
                // 2. Set profile with actual fetched data
                setProfile({
                    name: user.name, 
                    username: user.name,
                    email: user.email,
                    bio: user.bio || "", // Use fetched bio or fallback to empty string
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
        setEditForm({ ...profile });
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

    // 5. Handle saving the form with an API call
    const handleSave = async (e) => {
        e.preventDefault();
        setStatus("Saving...");
        try {
            // In a real app, you would make a PUT or PATCH request
            await axios.put(`${USER_API_ENDPOINT}/profile/update`, editForm);
            
            setProfile(editForm); // Update the main profile state with the new data
            setStatus("Profile saved successfully!");
            setIsEditing(false); // Switch back to view mode
        } catch (error) {
            console.error("Failed to save profile:", error);
            setStatus("Error: Could not save profile. Please try again.");
        }
    };

    // Render loading state
    if (loading) {
        return <div className="profile-container"><h2>Loading Profile...</h2></div>;
    }

    // Render error/empty state if profile could not be fetched
    if (!profile) {
        return <div className="profile-container"><h2>{status}</h2></div>;
    }

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
                        <input type="text" id="name" name="name" value={editForm.name} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input type="text" id="username" name="username" value={editForm.username} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" value={editForm.email} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="bio">Bio</label>
                        <textarea id="bio" name="bio" rows="4" value={editForm.bio} onChange={handleChange}></textarea>
                    </div>
                    <div className="button-group">
                        <button type="submit" className="btn btn-primary" disabled={status === "Saving..."}>
                            {status === "Saving..." ? "Saving..." : "Save"}
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                            Cancel
                        </button>
                    </div>
                    {status && <p className="status-message">{status}</p>}
                </form>
            ) : (
                // VIEW MODE
                <div className="profile-display">
                    <div className="detail-item"><strong>Name:</strong><p>{profile.name}</p></div>
                    <div className="detail-item"><strong>Username:</strong><p>{profile.username}</p></div>
                    <div className="detail-item"><strong>Email:</strong><p>{profile.email}</p></div>
                    <div className="detail-item"><strong>Bio:</strong><p>{profile.bio || "No bio set."}</p></div>
                    <div className="button-group">
                        <button className="btn btn-primary" onClick={handleEditClick}>
                            Edit Profile
                        </button>
                    </div>
                    {status && <p className="status-message">{status}</p>}
                </div>
            )}
        </div>
    );
};

export default Profile;
