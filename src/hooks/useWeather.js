// src/hooks/useWeather.js (The 100% Correct and Final Version)

import { useState, useCallback } from 'react';
import axios from 'axios';

// The VITE_ prefix is important for Vercel to expose the variable
const apiUrl = import.meta.env.VITE_API_URL || "";

export const useWeather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState('celsius');

  const fetchWeatherData = useCallback(
    async (searchParams) => {
      setLoading(true);
      setError(null);
      setWeatherData(null); // Clear old data immediately

      try {
        // --- THIS IS THE CRITICAL FIX ---
        // We build the parameters object manually to ensure it's correct.
        const params = {
          units: unit,
        };

        if (searchParams.city) {
          params.city = searchParams.city;
        } else if (searchParams.coords) {
          params.lat = searchParams.coords.latitude;
          params.lon = searchParams.coords.longitude;
        } else {
          // This case should not happen, but it's a good safeguard
          throw new Error("No search parameters provided.");
        }
        // --- END OF CRITICAL FIX ---

        const response = await axios.get(apiUrl, { params });
        setWeatherData(response.data);
      } catch (err) {
        console.error("AxiosError:", err);
        if (err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          setError(err.response.data.error || 'An unknown server error occurred. Please try again.');
        } else if (err.request) {
          // The request was made but no response was received
          setError('Network error: Could not connect to the weather server. Please check your connection.');
        } else {
          // Something happened in setting up the request that triggered an Error
          setError('An unexpected error occurred. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    },
    [unit] // Dependency array includes 'unit'
  );

  const toggleUnit = () => {
    setUnit((prevUnit) => {
      const newUnit = prevUnit === 'celsius' ? 'fahrenheit' : 'celsius';
      // In a more advanced version, we would refetch data here.
      // For now, the logic in App.jsx will handle re-rendering with the new unit.
      return newUnit;
    });
  };

  return { weatherData, loading, error, unit, fetchWeatherData, toggleUnit, setError };
};
