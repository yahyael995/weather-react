// src/components/DailyForecast.jsx (The Bulletproof Final Version)
import React from 'react';
import { getWeatherIcon } from '../utils/icons';

function DailyForecast({ data, unit }) {
  // --- THE BULLETPROOF CHECK ---
  // If 'data' is missing, or 'data.time' is missing, or 'data.time' is not an array,
  // then render absolutely nothing. This prevents any possibility of a crash.
  if (!data || !Array.isArray(data.time)) {
    return null;
  }
  // --- END OF BULLETPROOF CHECK ---

  return (
    <div className="solid-card daily-forecast">
      <h3>7-Day Forecast</h3>
      {/* We can now safely map over data.time */}
      {data.time.map((day, index) => {
        // Defensive checks for each property inside the loop
        const maxTemp = data.temperature_2m_max?.[index] !== undefined ? Math.round(data.temperature_2m_max[index]) : '--';
        const minTemp = data.temperature_2m_min?.[index] !== undefined ? Math.round(data.temperature_2m_min[index]) : '--';
        const weatherCode = data.weather_code?.[index];
        
        const date = new Date(day);
        // Check if the date is valid before trying to format it
        const dayName = !isNaN(date) 
          ? (index === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' }))
          : 'N/A';

        return (
          <div className="day-item" key={day || index}>
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
