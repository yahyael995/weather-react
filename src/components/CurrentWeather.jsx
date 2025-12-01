// D:\weather-react\src\components\CurrentWeather.jsx (The final, 100% corrected version)
import React from 'react';
import WeatherIcon from './WeatherIcon';
import './CurrentWeather.css';

const CurrentWeather = ({ data, location }) => {
  if (!data || !location) {
    return null;
  }

  // A helper function to get a weather description from the code
  const getWeatherDescription = (code) => {
    const descriptions = {
      0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
      45: 'Fog', 48: 'Depositing rime fog',
      51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
      56: 'Light freezing drizzle', 57: 'Dense freezing drizzle',
      61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
      66: 'Light freezing rain', 67: 'Heavy freezing rain',
      71: 'Slight snow fall', 73: 'Moderate snow fall', 75: 'Heavy snow fall',
      77: 'Snow grains',
      80: 'Slight rain showers', 81: 'Moderate rain showers', 82: 'Violent rain showers',
      85: 'Slight snow showers', 86: 'Heavy snow showers',
      95: 'Thunderstorm', 96: 'Thunderstorm with slight hail', 99: 'Thunderstorm with heavy hail',
    };
    return descriptions[code] || 'Unknown';
  };

  return (
    <div className="current-weather">
      
      <p className="location">{location.name}</p>
      <p className="country">{location.country}</p>

      <div className="main-info">
        <WeatherIcon code={data.weathercode} isDay={data.is_day} />
        {/* --- CORRECTION 1: Use temperature_2m --- */}
        <p className="temperature">{Math.round(data.temperature_2m)}°</p>
      </div>

      {/* --- CORRECTION 2: Use the helper function for a real description --- */}
      <p className="description">{getWeatherDescription(data.weathercode)}</p>

      <div className="details-vertical">
        <p>Feels like: {Math.round(data.apparent_temperature)}°</p>
        {/* --- CORRECTION 3: Use windspeed_10m --- */}
        <p>Wind: {Math.round(data.windspeed_10m)} km/h</p>
        {/* --- CORRECTION 4: Use relativehumidity_2m --- */}
        <p>Humidity: {data.relativehumidity_2m}%</p>
      </div>

    </div>
  );
};

export default CurrentWeather;
