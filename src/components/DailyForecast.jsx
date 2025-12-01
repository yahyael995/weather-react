// D:\weather-react\src\components\DailyForecast.jsx (NEW, corrected version)
import React from 'react';
import WeatherIcon from './WeatherIcon';
import './DailyForecast.css';

const DailyForecast = ({ data }) => {
  // --- START: Add this protection line ---
  if (!data || data.length === 0) {
    return null; // If there's no data, render nothing
  }
  // --- END: Add this protection line ---

  return (
    <div className="daily-forecast">
      <h2>7-Day Forecast</h2>
      <div className="daily-items">
        {data.map((day, index) => (
          <div key={index} className="daily-item">
            <p>{new Date(day.time).toLocaleDateString('en-US', { weekday: 'short' })}</p>
            <WeatherIcon code={day.weathercode} />
            <p>{Math.round(day.temperature_max)}° / {Math.round(day.temperature_min)}°</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyForecast;
