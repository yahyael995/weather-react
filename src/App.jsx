// D:\weather-react\src\App.jsx (Reverted to the last working state)

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useDebounce } from './hooks/useDebounce';
import CurrentWeather from './components/CurrentWeather';
import HourlyForecast from './components/HourlyForecast';
import DailyForecast from './components/DailyForecast';
import SearchBar from './components/SearchBar';
import WeatherChart from './components/WeatherChart';
import PrecipitationChart from './components/PrecipitationChart';
import './App.css';

const getBackgroundImage = (weatherData) => {
  if (!weatherData) return '/backgrounds/default.jpg';
  const code = weatherData.current.weathercode;
  if ([0, 1].includes(code)) return '/backgrounds/clear.jpg';
  if ([2, 3].includes(code)) return '/backgrounds/cloudy.jpg';
  if (code >= 51 && code <= 67) return '/backgrounds/rain.jpg';
  if (code >= 71 && code <= 77) return '/backgrounds/snow.jpg';
  if (code >= 80 && code <= 82) return '/backgrounds/rain.jpg';
  if (code >= 95) return '/backgrounds/thunderstorm.jpg';
  return '/backgrounds/default.jpg';
};

function App() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [unit, setUnit] = useState('celsius');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  const debouncedCity = useDebounce(city, 500);

  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleUnitToggle = () => {
    setUnit(prevUnit => (prevUnit === 'celsius' ? 'fahrenheit' : 'celsius'));
  };

  const handleSurpriseMe = () => {
    const surpriseCities = ['Tokyo', 'Paris', 'New York', 'Sydney', 'Cairo', 'Rio de Janeiro'];
    const randomCity = surpriseCities[Math.floor(Math.random() * surpriseCities.length)];
    setCity(randomCity);
  };

  const fetchWeatherData = useCallback(async (searchQuery) => {
    if (!searchQuery) return;

    setLoading(true);
    setError(null);
    setWeatherData(null);

    try {
      const url = `https://weather-backend-ogz2.onrender.com/weather?city=${searchQuery}&units=${unit}`;
      localStorage.setItem('lastCity', searchQuery );
      
      const response = await axios.get(url);
      const data = response.data;

      const now = new Date(data.current.time);
      const currentHourIndex = data.hourly.time.findIndex(
        (hourString) => new Date(hourString) >= now
      );
      const startIndex = currentHourIndex > -1 ? currentHourIndex : 0;

      const relevantHourlyData = data.hourly.time
        .slice(startIndex, startIndex + 24)
        .map((t, index) => {
          const originalIndex = startIndex + index;
          return {
            time: t,
            temperature: data.hourly.temperature_2m[originalIndex],
            apparent_temperature: data.hourly.apparent_temperature[originalIndex],
            weathercode: data.hourly.weathercode[originalIndex],
            is_day: data.hourly.is_day[originalIndex],
            precipitation_probability: data.hourly.precipitation_probability[originalIndex],
          };
        });

      const transformedDailyData = data.daily.time.map((t, index) => ({
        time: t,
        weathercode: data.daily.weathercode[index],
        temperature_max: data.daily.temperature_2m_max[index],
        temperature_min: data.daily.temperature_2m_min[index],
      }));

      setWeatherData({
        ...data,
        hourly: relevantHourlyData,
        daily: transformedDailyData,
      });

    } catch (err) {
      if (err.response && err.response.status === 404) {
  setError(`Sorry, we couldn't find a city named "${searchQuery}". Please check the spelling.`);
} else {
  setError('Oops! Something went wrong while fetching the weather data. Please try again later.');
}
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [unit]);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  useEffect(() => {
    const lastCity = localStorage.getItem('lastCity');
    if (lastCity) {
      setCity(lastCity);
    }
  }, []);

  useEffect(() => {
    if (debouncedCity) {
      fetchWeatherData(debouncedCity);
    } else {
      setWeatherData(null);
      setError(null);
    }
  }, [debouncedCity, fetchWeatherData]);

  return (
    <div 
      className="App" 
      style={{ 
        backgroundImage: `url(${getBackgroundImage(weatherData)})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        display: 'flex',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '20px'
      }}
    >
      <div className="main-container">
        <div className="top-bar">
          <SearchBar city={city} onCityChange={setCity} />
          <div className="button-group">
            <button onClick={handleUnitToggle} title="Switch Units">{unit === 'celsius' ? '°F' : '°C'}</button>
            <button onClick={handleThemeToggle} title="Toggle Theme">{theme === 'light' ? '🌙' : '☀️'}</button>
            <button onClick={handleSurpriseMe} title="Surprise Me!">🎉</button>
          </div>
        </div>

        <div className="content-area">
          {loading ? (
            <div className="loading-spinner"></div>
          ) : error ? (
            <div className="error-box">
              <span className="error-icon">⚠️</span>
              <p>{error}</p>
            </div>
          ) : weatherData ? (
            <>
              <CurrentWeather data={weatherData.current} location={weatherData.location} />
              <HourlyForecast data={weatherData.hourly} />
              <DailyForecast data={weatherData.daily} />
              <WeatherChart hourlyData={weatherData.hourly} />
              <PrecipitationChart hourlyData={weatherData.hourly} /> 
            </>
          ) : (
            <div className="welcome-message">
              <h2>Welcome to Weather React!</h2>
              <p>Search for a city to begin.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
