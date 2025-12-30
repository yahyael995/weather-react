// src/hooks/useWeather.js (The TRUE Final Version)
import { useState, useCallback, useEffect } from 'react'; // FIX 1: useEffect is included
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
    
    const queryToUse = query || lastQuery;
    if (query) {
        setLastQuery(query);
    }

    if (!queryToUse) {
        setLoading(false);
        return;
    }

    let params = { units: unit };
    if (queryToUse.city) {
      params.city = queryToUse.city;
    } else if (queryToUse.coords) {
      params.lat = queryToUse.coords.latitude;
      params.lon = queryToUse.coords.longitude;
    }

    try {
      const response = await axios.get(`${API_URL}/weather`, { params });
      setWeatherData(response.data);
    } catch (err) {
      // FIX 2: Ensure error is always a string
      const errorMessage = err.response?.data?.error || err.message || 'An unexpected error occurred.';
      setError(errorMessage);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  }, [unit, lastQuery]);

  const toggleUnit = () => {
    setUnit(prevUnit => prevUnit === 'celsius' ? 'fahrenheit' : 'celsius');
  };

  useEffect(() => {
    // This effect runs when 'unit' changes.
    // It refetches data only if we have a location already.
    if (lastQuery) {
        fetchWeatherData();
    }
  }, [unit]); // Dependency array ensures it ONLY runs when 'unit' changes

  return { weatherData, loading, error, unit, fetchWeatherData, toggleUnit, setError };
};
