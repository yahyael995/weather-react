// src/components/CurrentWeather.jsx (النسخة النهائية مع الإصلاح)
import React from 'react';
import { getWeatherIcon, getWeatherDescription } from '../utils/icons';

const CurrentWeather = ({ data, unit }) => {
  if (!data || !data.current || !data.location) {
    return null;
  }

  const temperature = Math.round(data.current.temperature_2m);
  const feelsLike = Math.round(data.current.apparent_temperature);
  // --- هذا هو الإصلاح ---
  const weatherCode = data.current.weathercode; 
  const locationName = data.location.name;
  const countryName = data.location.country;
  const tempUnitLabel = unit === 'celsius' ? '°C' : '°F';

  return (
    <div className="solid-card current-weather">
      <h1 className="temperature">{temperature}{tempUnitLabel}</h1>
      <h2 className="location">{locationName}, {countryName}</h2>
      <div className="description">
        <img src={getWeatherIcon(weatherCode)} alt="Weather icon" className="weather-icon-large" />
        <span>{getWeatherDescription(weatherCode)}</span>
      </div>
      <div className="details">
        <p>Feels like: {feelsLike}{tempUnitLabel}</p>
      </div>
    </div>
  );
};

export default CurrentWeather;
