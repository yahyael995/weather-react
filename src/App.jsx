// src/App.jsx (النسخة النهائية مع الجلب التلقائي عند التحميل)

import React, { useState, useEffect } from 'react';
import './App.css';
import { useWeather } from './hooks/useWeather';
import CurrentWeather from './components/CurrentWeather';
import HourlyForecast from './components/HourlyForecast';
import DailyForecast from './components/DailyForecast';
import { getBackgroundImage } from './utils/backgrounds';
import { getRandomCity } from './utils/randomCities';
import defaultBackground from './assets/backgrounds/default.jpg';

const WeatherChart = React.lazy(() => import('./components/WeatherChart'));
const PrecipitationChart = React.lazy(() => import('./components/PrecipitationChart'));

function App() {
  const {
    weatherData,
    loading,
    error,
    unit,
    fetchWeatherData,
    toggleUnit,
    setError,
  } = useWeather();

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  // --- هذا هو التأثير الجديد ---
  // يعمل مرة واحدة فقط عند تحميل التطبيق لأول مرة
  useEffect(() => {
    // استدعاء دالة تحديد الموقع الجغرافي تلقائيًا
    handleGeolocate();
  }, []); // المصفوفة الفارغة [] تضمن أن هذا التأثير يعمل مرة واحدة فقط

  const handleSearch = (city) => {
    if (city) fetchWeatherData({ city });
  };

  const handleGeolocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => fetchWeatherData({ coords: position.coords }),
        () => setError('Geolocation permission denied. To see local weather, please enable it in your browser settings and refresh the page.')
      );
    } else {
      setError('Geolocation is not supported by this browser.');
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
              <p>Attempting to get your local weather...</p>
            </div>
          )}
          {weatherData && (
            <>
              <CurrentWeather data={weatherData} unit={unit} />
              <HourlyForecast data={weatherData.hourly} unit={unit} />
              <DailyForecast data={weatherData.daily} unit={unit} />
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
