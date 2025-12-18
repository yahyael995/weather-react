// src/hooks/useWeather.js

import { useState, useCallback } from 'react';
import axios from 'axios';

export const useWeather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState('celsius');
  const [lastQuery, setLastQuery] = useState(null);

  const fetchWeatherData = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    
    const queryParams = new URLSearchParams();
    queryParams.append('units', params.unit || unit);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    let finalUrl;
    let currentQuery;

    if (params.city) {
      currentQuery = { type: 'city', value: params.city };
      queryParams.append('city', params.city);
      finalUrl = `${API_BASE_URL}/weather?${queryParams.toString()}`;
    } else if (params.coords) {
      currentQuery = { type: 'coords', value: params.coords };
      queryParams.append('lat', params.coords.latitude);
      queryParams.append('lon', params.coords.longitude);
      finalUrl = `${API_BASE_URL}/weather?${queryParams.toString()}`;
    } else {
      setError('No city or coordinates provided.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(finalUrl, { timeout: 10000 });
      setWeatherData(response.data);
      setLastQuery(currentQuery);
    } catch (err) {
      console.error("AxiosError:", err);
      if (err.code === 'ECONNABORTED') {
        setError('Error: The request took too long to respond. Please check your internet connection and try again.');
      } else {
        const errorMessage = err.response?.data?.error || 'Failed to fetch data from external API.';
        setError(`Error: ${errorMessage}. Please try again.`);
      }
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  }, [unit]);

  const toggleUnit = () => {
    const newUnit = unit === 'celsius' ? 'fahrenheit' : 'celsius';
    setUnit(newUnit);
    if (lastQuery) {
      if (lastQuery.type === 'city') {
        fetchWeatherData({ city: lastQuery.value, unit: newUnit });
      } else if (lastQuery.type === 'coords') {
        fetchWeatherData({ coords: lastQuery.value, unit: newUnit });
      }
    }
  };

  return {
    weatherData,
    loading,
    error,
    unit,
    fetchWeatherData,
    toggleUnit,
    setError, // Expose setError to be used for geolocation denial
  };
};
