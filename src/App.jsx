import React, { useState, useEffect } from 'react';
import './App.css';
import { useWeather } from './hooks/useWeather';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import HourlyForecast from './components/HourlyForecast';
import DailyForecast from './components/DailyForecast';
import { getBackgroundImage } from './utils/backgrounds';
import { getRandomCity } from './utils/randomCities';
import defaultBackground from './assets/backgrounds/default.jpg';

const WeatherChart = React.lazy(() => import('./components/WeatherChart'));
const PrecipitationChart = React.lazy(
  () => import('./components/PrecipitationChart')
);

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

  useEffect(() => {
    handleGeolocate();
  }, []);

  // --- هذا هو التأثير الجديد ---
  useEffect(() => {
    if (weatherData) {
      const temp = Math.round(weatherData.current.temperature_2m);
      const city = weatherData.location.name;
      const tempUnit = unit === 'celsius' ? '°C' : '°F';
      document.title = `${temp}${tempUnit} in ${city} - Weather React`;
    } else {
      document.title = 'Weather React';
    }
  }, [weatherData, unit]); // أضفنا unit هنا لتحديث العنوان عند تغيير الوحدة

  const handleSearch = (city) => {
    if (city) fetchWeatherData({ city });
  };

  const handleGeolocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => fetchWeatherData({ coords: position.coords }),
        () =>
          setError(
            'Geolocation permission denied. To see local weather, please enable it in your browser settings and refresh the page.'
          )
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
    setIsDarkMode((prevMode) => !prevMode);
  };

  // This is the CRITICAL FIX.
// We check if weatherData AND weatherData.current exist before trying to access their properties.
const backgroundStyle = {
  backgroundImage: (weatherData && weatherData.current)
    ? `url(${getBackgroundImage(weatherData.current.weather_code, weatherData.current.is_day)})`
    : `url(${defaultBackground})`,
};


  return (
    <div className="App" style={backgroundStyle}>
      <div className="main-container">
        <div className="top-bar">
          <SearchBar onSearch={handleSearch} loading={loading} />
          <div className="button-group">
            <button onClick={handleGeolocate} disabled={loading}>
              📍
            </button>
            <button onClick={toggleUnit} disabled={loading}>
              {unit === 'celsius' ? '°C' : '°F'}
            </button>
            <button onClick={handleSurpriseMe} disabled={loading}>
              ?
            </button>
            <button onClick={toggleDarkMode} disabled={loading}>
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>

        <div className="content-area">
          {loading && <div className="loading-spinner"></div>}
          {error && (
            <div className="solid-card error-box">
              <p>
                ⚠️
                {error}
              </p>
            </div>
          )}
          {!loading && !error && !weatherData && (
            <div className="solid-card welcome-message">
              <h2>Welcome to Weather React</h2>
              <p>
                Enter a city name or use the location button to get the weather
                forecast.
              </p>
            </div>
          )}
          {weatherData && (
            <>
              <CurrentWeather data={weatherData} unit={unit} />
              <HourlyForecast data={weatherData.hourly} unit={unit} />
              <DailyForecast data={weatherData.daily} unit={unit} />
              <React.Suspense
                fallback={<div className="loading-spinner"></div>}
              >
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


