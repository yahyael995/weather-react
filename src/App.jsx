// ===================================================================
// ===         WEATHER REACT - FINAL & CLEANED JSX (v1.1)          ===
// ===================================================================

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Import CSS and Utility Functions
import './App.css';
import { getBackgroundImage } from './utils/backgrounds';
import { getRandomCity } from './utils/randomCities';

// Import Components
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import HourlyForecast from './components/HourlyForecast';
import DailyForecast from './components/DailyForecast';
import WeatherChart from './components/WeatherChart';
import PrecipitationChart from './components/PrecipitationChart';

function App() {
  // --- STATE MANAGEMENT ---
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState('celsius');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  // --- DATA FETCHING ---
  const fetchWeatherData = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    
    const queryParams = new URLSearchParams();
    queryParams.append('units', params.unit || unit);

    if (params.city) {
      queryParams.append('city', params.city);
    } else if (params.coords) {
      queryParams.append('lat', params.coords.latitude);
      queryParams.append('lon', params.coords.longitude);
    } else {
      setError('No city or coordinates provided.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`/api/weather?${queryParams.toString()}`);
      if (response.data && response.data.current) {
        setWeatherData(response.data);
        if (response.data.location?.city) {
          localStorage.setItem('lastCity', response.data.location.city);
        }
      } else {
        throw new Error('Invalid data structure from server.');
      }
    } catch (err) {
      console.error("AxiosError:", err);
      const errorMessage = err.response?.data?.error || 'City not found or network error.';
      setError(`Error: ${errorMessage}. Please try again.`);
      setWeatherData(null);
    } finally {
      setLoading(false);
      setIsLocating(false);
    }
  }, [unit]); // Re-create this function only if 'unit' changes

  // --- SIDE EFFECTS (useEffect) ---

  // Effect for initial load: check for last city or get geolocation
  useEffect(() => {
    const lastCity = localStorage.getItem('lastCity');
    if (lastCity) {
      fetchWeatherData({ city: lastCity });
    } else if (navigator.geolocation) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (position) => fetchWeatherData({ coords: position.coords }),
        (err) => {
          console.error("Geolocation error:", err.message);
          setIsLocating(false); // Turn off indicator on failure
        }
      );
    }
  }, [fetchWeatherData]); // Run once on mount

  // Effect for theme changes
  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  // --- EVENT HANDLERS ---
  const handleSearch = (searchCity) => {
    if (searchCity) {
      fetchWeatherData({ city: searchCity });
    }
  };

  const handleGeoLocate = () => {
    if (navigator.geolocation) {
      setIsLocating(true);
      setWeatherData(null); // Clear old data to show locating status
      navigator.geolocation.getCurrentPosition(
        (position) => fetchWeatherData({ coords: position.coords }),
        (err) => {
          setError('Unable to retrieve your location. Please grant permission.');
          setIsLocating(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  };

  const handleUnitToggle = () => {
    const newUnit = unit === 'celsius' ? 'fahrenheit' : 'celsius';
    setUnit(newUnit);
    
    if (weatherData) {
      // Refetch data with the new unit
      const params = weatherData.location?.city 
        ? { city: weatherData.location.city, unit: newUnit }
        : { coords: { latitude: weatherData.location.latitude, longitude: weatherData.location.longitude }, unit: newUnit };
      fetchWeatherData(params);
    }
  };

  const handleThemeToggle = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const handleSurpriseMe = () => {
    const randomCity = getRandomCity();
    handleSearch(randomCity);
  };

  // --- RENDER LOGIC ---
  const renderContent = () => {
    if (isLocating) {
      return <div className="solid-card welcome-message"><p>Getting your location...</p></div>;
    }
    if (loading && !weatherData) { // Show main spinner only on initial load
      return <div className="loading-spinner"></div>;
    }
    if (error) {
      return <div className="solid-card error-box"><span className="error-icon">⚠️</span><p>{error}</p></div>;
    }
    if (weatherData) {
      return (
        <>
          <div className="solid-card">
            <CurrentWeather data={weatherData.current} location={weatherData.location} />
          </div>
          <div className="solid-card">
            <HourlyForecast data={weatherData.hourly} />
          </div>
          <div className="solid-card">
            <DailyForecast data={weatherData.daily} />
          </div>
          <div className="solid-card">
            <WeatherChart hourlyData={weatherData.hourly} />
          </div>
          <div className="solid-card">
            <PrecipitationChart hourlyData={weatherData.hourly} />
          </div>
        </>
      );
    }
    return (
      <div className="solid-card welcome-message">
        <h2>Welcome to Weather React!</h2>
        <p>Search for a city or allow location access to begin.</p>
      </div>
    );
  };

  return (
    <div className="App" style={{ backgroundImage: `url(${getBackgroundImage(weatherData)})` }}>
      <div className="main-container">
        <div className="top-bar solid-card">
          <SearchBar onSearch={handleSearch} />
          <div className="button-group">
            <button onClick={handleGeoLocate} title="My Location">📍</button>
            <button onClick={handleUnitToggle} title="Switch Units">{unit === 'celsius' ? '°F' : '°C'}</button>
            <button onClick={handleThemeToggle} title="Toggle Theme">{theme === 'light' ? '🌙' : '☀️'}</button>
            <button onClick={handleSurpriseMe} title="Surprise Me!">🎉</button>
          </div>
        </div>
        
        <div className="content-area">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default App;
