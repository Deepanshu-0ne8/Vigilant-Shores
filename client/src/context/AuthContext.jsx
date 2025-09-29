// src/context/AuthContext.jsx

import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { USER_API_ENDPOINT } from "../utils/constant";

const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This function checks for an existing session on initial load
    const checkUserSession = async () => {
      try {
        const response = await axios.get(`${USER_API_ENDPOINT}/profile`);
        setUser(response.data.data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkUserSession();
  }, []);

  // --- ADD THIS NEW LOGIN FUNCTION ---
  const login = async (email, password) => {
    // The 'try...catch' will be handled by the Login component that calls this function
    const response = await axios.post(`${USER_API_ENDPOINT}/signin`, {
      email,
      password,
    });
    console.log("User session found:", response.data);

    // If the API call is successful, update the user state
    if (response.data.success) {
      setUser(response.data.data.user);
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${USER_API_ENDPOINT}/signout`);
      setUser(null);
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const value = {
    user,
    loading,
    login, // <-- Add the new function to the context's value
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
