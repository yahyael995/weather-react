// src/App.jsx (النسخة النهائية الكاملة - v2.0)

import { useState, useEffect, useCallback } from 'react';
import SearchBar from './components/SearchBar';
import WeatherForecast from './components/WeatherForecast';
import LoadingSpinner from './components/LoadingSpinner';
import useDebounce from './hooks/useDebounce';
import { getCoordinates, getWeather, getCityNameFromCoords } from './services/weatherService';
import './App.css';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [isDarkMode, setIsDarkMode] = useState(() => JSON.parse(localStorage.getItem('darkMode')) ?? (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches));
  
  // 1. إضافة حالة وحدة القياس
  const [tempUnit, setTempUnit] = useState(() => localStorage.getItem('tempUnit') || 'celsius');

  // 2. تحديث handleSearch ليعتمد على tempUnit
  const handleSearch = useCallback(async (searchQuery) => {
    if (!searchQuery) return;
    setIsLoading(true);
    setError(null);
    try {
      const coords = await getCoordinates(searchQuery);
      // تمرير tempUnit هنا
      const weather = await getWeather(coords.latitude, coords.longitude, tempUnit);
      setWeatherData({ ...weather, name: coords.name });
      localStorage.setItem('lastCity', coords.name);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [tempUnit]); // 3. إضافة tempUnit كاعتمادية لـ useCallback

  // ... (useEffect للبحث التلقائي يبقى كما هو)
  useEffect(() => {
    if (debouncedSearchTerm) {
      handleSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, handleSearch]);

  // ... (useEffect للبدء التلقائي يبقى كما هو)
  useEffect(() => {
    const lastCity = localStorage.getItem('lastCity');
    if (lastCity) {
      setSearchTerm(lastCity);
    } else if (navigator.geolocation) {
      // ...
    }
  }, [handleSearch]);

  // ... (useEffect للوضع الليلي يبقى كما هو)
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // 4. useEffect جديد لحفظ وحدة القياس
  useEffect(() => {
    localStorage.setItem('tempUnit', tempUnit);
  }, [tempUnit]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);
  // 5. دالة جديدة لتبديل وحدة القياس
  const toggleTempUnit = () => {
    setTempUnit(prevUnit => (prevUnit === 'celsius' ? 'fahrenheit' : 'celsius'));
  };

  return (
    <div className="app-container">
      <div className="header-controls">
        <h1>Weather React</h1>
        <div className="button-group">
          {/* 6. إضافة زر تبديل الوحدة */}
          <button onClick={toggleTempUnit} className="mode-toggle">
            °{tempUnit === 'celsius' ? 'F' : 'C'}
          </button>
          <button onClick={toggleDarkMode} className="mode-toggle">
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
      <SearchBar value={searchTerm} onChange={setSearchTerm} />
      
      {isLoading && <LoadingSpinner />}
      {error && !isLoading && <p className="error-message">Error: {error}</p>}
      {weatherData && !isLoading && <WeatherForecast data={weatherData} />}
      {!isLoading && !error && !weatherData && (
        <div className="empty-state">
          <h2>Welcome!</h2>
          <p>Enter a city name or allow location access.</p>
        </div>
      )}
    </div>
  );
}

export default App;
