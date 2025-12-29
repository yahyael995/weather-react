// src/components/HourlyForecast.jsx (The Bulletproof Final Version)
import React from 'react';
import { getWeatherIcon } from '../utils/icons';

function HourlyForecast({ data, unit }) {
  // --- THE BULLETPROOF CHECK ---
  if (!data || !Array.isArray(data.time)) {
    return null;
  }
  // --- END OF BULLETPROOF CHECK ---

  return (
    <div className="solid-card hourly-forecast">
      <h3>Hourly Forecast</h3>
      <div className="hourly-scroll">
        {data.time.map((time, index) => {
          const temp = data.temperature_2m?.[index] !== undefined ? Math.round(data.temperature_2m[index]) : '--';
          const weatherCode = data.weather_code?.[index];
          const isDay = data.is_day?.[index] === 1;
          
          const date = new Date(time);
          const hour = !isNaN(date) ? date.getHours() + ':00' : 'N/A';

          return (
            <div className="hour-item" key={time || index}>
              <span>{hour}</span>
              <img
                src={getWeatherIcon(weatherCode, isDay)}
                alt="Weather icon"
                className="weather-icon"
              />
              <span>{temp}°</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HourlyForecast;
