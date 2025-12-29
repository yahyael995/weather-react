// src/hooks/useWeather.js (The Radical and Final Fix)

import { useState, useCallback } from 'react';
import axios from 'axios';

const API_BASE_URL = "https://weather-backend-final.onrender.com/weather";

export const useWeather = ( ) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState('celsius');

  const fetchWeatherData = useCallback(
    async (searchParams) => {
      setLoading(true);
      setError(null);
      setWeatherData(null);

      try {
        // --- THIS IS THE COMPLETELY NEW AND DIFFERENT FIX ---
        let finalUrl;
        const unitParam = `units=${unit}`;

        if (searchParams.city) {
          // We build the URL string manually, encoding the city name
          finalUrl = `${API_BASE_URL}?${unitParam}&city=${encodeURIComponent(searchParams.city)}`;
        } else if (searchParams.coords) {
          // We build the URL string manually for coordinates
          finalUrl = `${API_BASE_URL}?${unitParam}&lat=${searchParams.coords.latitude}&lon=${searchParams.coords.longitude}`;
        } else {
          throw new Error("No search parameters provided.");
        }
        
        console.log("Requesting URL:", finalUrl); // For debugging, we can see the exact URL
        
        // We now pass the fully constructed URL directly to axios
        const response = await axios.get(finalUrl);
        // --- END OF THE NEW FIX ---

        setWeatherData(response.data);
      } catch (err) {
        console.error("AxiosError:", err);
        if (err.response) {
          setError(err.response.data.error || 'An unknown server error occurred. Please try again.');
        } else if (err.request) {
          setError('Network error: Could not connect to the weather server. Please check your connection.');
        } else {
          setError('An unexpected error occurred. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    },
    [unit]
  );

  const toggleUnit = () => {
    setUnit((prevUnit) => {
      const newUnit = prevUnit === 'celsius' ? 'fahrenheit' : 'celsius';
      return newUnit;
    });
  };

  return { weatherData, loading, error, unit, fetchWeatherData, toggleUnit, setError };
};
