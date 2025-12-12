// src/App.jsx (النسخة النهائية مع تحسين معالجة الأخطاء)

// --- (لا تغيير في قسم الاستيراد) ---
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';
import CurrentWeather from './components/CurrentWeather';
import HourlyForecast from './components/HourlyForecast';
import DailyForecast from './components/DailyForecast';
const WeatherChart = React.lazy(() => import('./components/WeatherChart'));
const PrecipitationChart = React.lazy(() => import('./components/PrecipitationChart'));
import { getBackgroundImage } from './utils/backgrounds';
import { getRandomCity } from './utils/randomCities';
import defaultBackground from './assets/backgrounds/default.jpg';

function App() {
  // --- (لا تغيير في تعريف الحالات) ---
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState('celsius');
  const [lastQuery, setLastQuery] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

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
      // --- هذا هو التغيير: إضافة حد زمني (10 ثوانٍ) ---
      const response = await axios.get(finalUrl, { timeout: 10000 }); // 10000ms = 10 seconds
      
      setWeatherData(response.data);
      setLastQuery(currentQuery);
    } catch (err) {
      console.error("AxiosError:", err);
      
      // --- هذا هو التغيير: تحسين رسائل الخطأ ---
      if (err.code === 'ECONNABORTED') {
        // إذا انتهى الوقت المحدد
        setError('Error: The request took too long to respond. Please check your internet connection and try again.');
      } else {
        // للأخطاء الأخرى
        const errorMessage = err.response?.data?.error || 'Failed to fetch data from external API.';
        setError(`Error: ${errorMessage}. Please try again.`);
      }
      
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  }, [unit]);

  // --- (لا تغيير في باقي الدوال: handleSearch, handleGeolocate, etc.) ---
  const handleSearch = (city) => {
    if (city) fetchWeatherData({ city });
  };

  const handleGeolocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => fetchWeatherData({ coords: position.coords }),
        () => setError('Geolocation permission denied. Please enable it in your browser settings.')
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

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

  const handleSurpriseMe = () => {
    const city = getRandomCity();
    handleSearch(city);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  const backgroundStyle = {
    backgroundImage: weatherData
      ? `url(${getBackgroundImage(weatherData.current.weathercode, weatherData.current.is_day)})`
      : `url(${defaultBackground})`
  };

  // --- (لا تغيير في بنية JSX) ---
  return (
    <div className="App" style={backgroundStyle}>
      <div className="main-container">
        <div className="top-bar">
          <form className="search-bar" onSubmit={(e) => { e.preventDefault(); handleSearch(e.target.elements.city.value); }}>
            <input type="text" name="city" placeholder="Search for a city..." />
            <button type="submit">Search</button>
          </form>
          <div className="button-group">
            <button onClick={handleGeolocate}>📍</button>
            <button onClick={toggleUnit}>{unit === 'celsius' ? '°C' : '°F'}</button>
            <button onClick={handleSurpriseMe}>?</button>
            <button onClick={toggleDarkMode}>{isDarkMode ? '☀️' : '🌙'}</button>
          </div>
        </div>

        <div className="content-area">
          {loading && <div className="loading-spinner"></div>}
          {error && <div className="solid-card error-box"><p>⚠️  
{error}</p></div>}
          {!loading && !error && !weatherData && (
            <div className="solid-card welcome-message">
              <h2>Welcome to Weather React</h2>
              <p>Enter a city name or use geolocation to get the weather forecast.</p>
            </div>
          )}
          // هذا هو الكود الجديد
{weatherData && (
  <>
    <CurrentWeather data={weatherData} unit={unit} />
    <HourlyForecast data={weatherData.hourly} unit={unit} />
    <DailyForecast data={weatherData.daily} unit={unit} />
    
    {/* --- هذا هو التغيير --- */}
    <React.Suspense fallback={<div className="loading-spinner"></div>}>
      <div className="solid-card chart-container">
        <WeatherChart hourlyData={weatherData.hourly} unit={unit} />
      </div>
      <div className="solid-card chart-container">
        <PrecipitationChart hourlyData={weatherData.hourly} />
      </div>
    </React.Suspense>
  </>
)}

        </div>
      </div>
    </div>
  );
}

export default App;
