// src/components/CurrentWeather.jsx (The Final Correct Version)
import React from 'react';
import { getWeatherIcon } from '../utils/icons';
import { getWeatherDescription } from '../utils/descriptions';

function CurrentWeather({ data, unit }) {
  if (!data || !data.current) {
    return null;
  }

  const { location, current } = data;
  const temp = Math.round(current.temperature_2m);
  const feelsLike = Math.round(current.apparent_temperature);
  const weatherCode = current.weather_code;
  const isDay = current.is_day === 1;
  const description = getWeatherDescription(weatherCode);

  return (
    <div className="solid-card current-weather">
      <h1>{temp}°</h1>
      <div className="location">{location.name}, {location.country}</div>
      <div className="description">
        <img
          src={getWeatherIcon(weatherCode, isDay)}
          alt={description}
          className="weather-icon-large"
        />
        <span>{description}</span>
      </div>
      <div className="details">
        Feels like: {feelsLike}°
      </div>
    </div>
  );
}

export default CurrentWeather;
