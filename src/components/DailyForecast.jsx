// src/components/DailyForecast.jsx (The Final Correct Version)
import React from 'react';
import { getWeatherIcon } from '../utils/icons';

function DailyForecast({ data, unit }) {
  if (!data || !Array.isArray(data.time)) {
    return null;
  }

  return (
    <div className="solid-card daily-forecast">
      <h3>7-Day Forecast</h3>
      {data.time.map((date, index) => {
        const day = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
        const maxTemp = Math.round(data.temperature_2m_max[index]);
        const minTemp = Math.round(data.temperature_2m_min[index]);
        const weatherCode = data.weather_code[index];

        return (
          <div className="day-item" key={date}>
            <span>{day}</span>
            <img
              src={getWeatherIcon(weatherCode, true)} // Always use day icon for forecast
              alt="Weather icon"
              className="weather-icon"
            />
            <span>{maxTemp}° / {minTemp}°</span>
          </div>
        );
      })}
    </div>
  );
}

export default DailyForecast;
