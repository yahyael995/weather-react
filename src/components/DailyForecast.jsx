// src/components/DailyForecast.jsx (The Fix for WeatherAPI data)
import React from 'react';
import { getWeatherIcon } from '../utils/icons';

function DailyForecast({ data, unit }) {
  // Defensive check: If data or data.time is missing, render nothing.
  if (!data || !data.time) {
    return null;
  }

  return (
    <div className="solid-card daily-forecast">
      <h3>7-Day Forecast</h3>
      {data.time.map((day, index) => {
        const maxTemp = Math.round(data.temperature_2m_max[index]);
        const minTemp = Math.round(data.temperature_2m_min[index]);
        const weatherCode = data.weather_code[index];
        const date = new Date(day);
        const dayName = index === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' });

        return (
          <div className="day-item" key={day}>
            <span>{dayName}</span>
            <img
              src={getWeatherIcon(weatherCode, true)} // Assume day for forecast icons
              alt="Weather icon"
              className="weather-icon"
            />
            <span>
              {minTemp}° / {maxTemp}°
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default DailyForecast;
