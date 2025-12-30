// src/hooks/useWeather.js (The 100% Final Correct Error Handling)
import { useState, useCallback } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const useWeather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState('celsius');
  const [lastQuery, setLastQuery] = useState(null);

  const fetchWeatherData = useCallback(async (query) => {
    setLoading(true);
    setError(null);
    if (query) { // Only update lastQuery if a new query is provided
        setLastQuery(query);
    }

    const currentQuery = query || lastQuery;
    if (!currentQuery) {
        setLoading(false);
        return;
    }

    let params = { units: unit };
    if (currentQuery.city) {
      params.city = currentQuery.city;
    } else if (currentQuery.coords) {
      params.lat = currentQuery.coords.latitude;
      params.lon = currentQuery.coords.longitude;
    }

    try {
      const response = await axios.get(`${API_URL}/weather`, { params });
      setWeatherData(response.data);
    } catch (err) {
      // --- THIS IS THE CRITICAL FIX ---
      // Always set the error to a simple string message.
      const errorMessage = err.response?.data?.error || err.message || 'An unexpected error occurred.';
      setError(errorMessage);
      // --- END OF CRITICAL FIX ---
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  }, [unit, lastQuery]); // We need lastQuery here now

  const toggleUnit = () => {
    const newUnit = unit === 'celsius' ? 'fahrenheit' : 'celsius';
    setUnit(newUnit);
  };

  // This new useEffect will trigger a refetch whenever the unit changes
  useEffect(() => {
    if (lastQuery) {
        fetchWeatherData();
    }
  }, [unit]); // It runs ONLY when 'unit' changes

  return { weatherData, loading, error, unit, fetchWeatherData, toggleUnit, setError };
};
