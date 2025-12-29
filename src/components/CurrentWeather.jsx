// src/components/CurrentWeather.jsx (The Fix for WeatherAPI data)
import React from 'react';
import { getWeatherIcon } from '../utils/icons';
import { getWeatherDescription } from '../utils/descriptions';

function CurrentWeather({ data, unit }) {
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
        {getWeatherDescription(weatherCode)}
      </div>
      <div className="details">
        Feels like: {feelsLike}°
      </div>
    </div>
  );
}

export default CurrentWeather;
