// src/components/CurrentWeather.jsx (The 100% Correct and Final Version)
import React from 'react';
import { getWeatherIcon } from '../utils/icons';
// --- THIS LINE WAS MISSING ---
import { getWeatherDescription } from '../utils/descriptions'; 
// --- END OF FIX ---

function CurrentWeather({ data, unit }) {
  // Add a defensive check to prevent crashes if data is not ready
  if (!data || !data.current || !data.location) {
    return <div className="solid-card current-weather">Loading...</div>;
  }

  const temp = Math.round(data.current.temperature_2m);
  const feelsLike = Math.round(data.current.apparent_temperature);
  const weatherCode = data.current.weather_code;
  const isDay = data.current.is_day === 1;

  return (
    <div className="solid-card current-weather">
      <h1>{temp}°</h1>
      <div className="location">{data.location.name}, {data.location.country}</div>
      <div className="description">
        <img
          src={getWeatherIcon(weatherCode, isDay)}
          alt="Weather icon"
          className="weather-icon-large"
        />
        {/* This line now works because we imported the function */}
        {getWeatherDescription(weatherCode)}
      </div>
      <div className="details">
        Feels like: {feelsLike}°
      </div>
    </div>
  );
}

export default CurrentWeather;
