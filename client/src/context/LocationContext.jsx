// src/context/LocationContext.jsx

import React, { createContext, useState, useContext } from 'react';

// 1. Create the context
const LocationContext = createContext(null);

// 2. Create a custom hook for easy access
export const useLocation = () => {
  return useContext(LocationContext);
};

// 3. Create the Provider component
export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null); // To store {latitude, longitude}
  const [loading, setLoading] = useState(false); // To show loading state
  const [error, setError] = useState(null);     // To store any errors

  // The function that any component can call to fetch the location
  const fetchLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        setLoading(false);
      },
      (err) => {
        setError(`Failed to get location: ${err.message}`);
        setLoading(false);
      }
    );
  };

  // The value that will be available to all consuming components
  const value = {
    location,
    loading,
    error,
    fetchLocation, // We provide the function itself
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};