// src/hooks/useWeather.js (The 100% Final Correct Version with State Memory)
import { useState, useCallback } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const useWeather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState('celsius');
  const [lastQuery, setLastQuery] = useState(null); // To remember the last search

  const fetchWeatherData = useCallback(async (query) => {
    setLoading(true);
    setError(null);
    setLastQuery(query); // Remember this query

    let params = { units: unit };
    if (query.city) {
      params.city = query.city;
    } else if (query.coords) {
      params.lat = query.coords.latitude;
      params.lon = query.coords.longitude;
    }

    try {
      const response = await axios.get(`${API_URL}/weather`, { params });
      setWeatherData(response.data);
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'An unexpected error occurred. Please try again.';
      setError(errorMessage);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  }, [unit]); // Re-create this function only if 'unit' changes

  const toggleUnit = () => {
  console.log("--- TOGGLE UNIT BUTTON CLICKED! ---"); // <--- أضف هذا السطر فقط

  const newUnit = unit === 'celsius' ? 'fahrenheit' : 'celsius';
  setUnit(newUnit);
    
    // --- THIS IS THE CRITICAL FIX ---
    // If we have a last query, re-fetch the data with the new unit
    if (lastQuery) {
        // We need to manually call fetch with the new unit because the state update is async
        const reFetch = async () => {
            setLoading(true);
            setError(null);
            
            let params = { units: newUnit }; // Use newUnit directly
            if (lastQuery.city) {
                params.city = lastQuery.city;
            } else if (lastQuery.coords) {
                params.lat = lastQuery.coords.latitude;
                params.lon = lastQuery.coords.longitude;
            }

            try {
                const response = await axios.get(`${API_URL}/weather`, { params });
                setWeatherData(response.data);
            } catch (err) {
                const errorMessage = err.response?.data?.error || 'An unexpected error occurred. Please try again.';
                setError(errorMessage);
                setWeatherData(null);
            } finally {
                setLoading(false);
            }
        };
        reFetch();
    }
    // --- END OF CRITICAL FIX ---
  };

  return { weatherData, loading, error, unit, fetchWeatherData, toggleUnit, setError };
};
