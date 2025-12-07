// D:\weather-react\src\components\DailyForecast.jsx (Corrected for styling)

import React from 'react';
import { getWeatherIcon } from '../utils/icons';

function DailyForecast({ data }) {
  if (!data || !data.time || !data.temperature_2m_max) {
    return null;
  }

  const formattedData = data.time.map((time, index) => ({
    date: new Date(time).toLocaleDateString('en-US', { weekday: 'short' }),
    maxTemp: Math.round(data.temperature_2m_max[index]),
    minTemp: Math.round(data.temperature_2m_min[index]),
    weathercode: data.weathercode[index],
  }));

  return (
    // 1. REMOVED "glass-card" from this outer div
    <div className="daily-forecast">
      <h3>7-Day Forecast</h3>
      {/* 2. ADDED "glass-card" to EACH inner div */}
      {formattedData.map((day, index) => (
        <div key={index} className="day-item glass-card">
          <p className="day-name">{day.date}</p>
          <img 
            src={getWeatherIcon(day.weathercode, true)}
            alt="Weather icon" 
            className="weather-icon-small"
          />
          <p className="day-temp">{day.maxTemp}° / {day.minTemp}°</p>
        </div>
      ))}
    </div>
  );
}

export default DailyForecast;
