// src/App.jsx (النسخة المبسطة بعد إعادة الهيكلة)

import React, { useState, useEffect } from 'react';
import './App.css';
import { useWeather } from './hooks/useWeather'; // <-- استيراد الـ Hook الجديد
import CurrentWeather from './components/CurrentWeather';
import HourlyForecast from './components/HourlyForecast';
import DailyForecast from './components/DailyForecast';
import { getBackgroundImage } from './utils/backgrounds';
import { getRandomCity } from './utils/randomCities';
import defaultBackground from './assets/backgrounds/default.jpg';

// التحميل الكسول للمكونات الثقيلة
const WeatherChart = React.lazy(() => import('./components/WeatherChart'));
const PrecipitationChart = React.lazy(() => import('./components/PrecipitationChart'));

function App() {
  // --- استخدام الـ Hook المخصص ---
  const {
    weatherData,
    loading,
    error,
    unit,
    fetchWeatherData,
    toggleUnit,
    setError,
  } = useWeather();

  // حالة الوضع الليلي تبقى هنا لأنها تؤثر على body مباشرة
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  // --- دوال معالجة الأحداث (أصبحت أبسط) ---
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

  const handleSurpriseMe = () => {
    const city = getRandomCity();
    handleSearch(city);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  // --- منطق العرض (لا تغيير هنا) ---
  const backgroundStyle = {
    backgroundImage: weatherData
      ? `url(${getBackgroundImage(weatherData.current.weathercode, weatherData.current.is_day)})`
      : `url(${defaultBackground})`
  };

  // --- بنية JSX (لا تغيير هنا) ---
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
