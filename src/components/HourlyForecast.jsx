// D:\weather-react\src\components\HourlyForecast.jsx (The final, 100% correct version)

import React from 'react';
import WeatherIcon from './WeatherIcon';
import './HourlyForecast.css'; // Make sure this import exists

const HourlyForecast = ({ data }) => {
  // If there's no data, render nothing
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className="hourly-forecast">
      <h3>Hourly Forecast</h3>
      {/* This div with the correct className enables horizontal scrolling */}
      <div className="scroll-container">
        {data.map((hour, index) => (
          // This is the content for each individual hour card
          <div key={index} className="hour-card">
            <p>{new Date(hour.time).toLocaleTimeString('en-US', { hour: '2-digit' })}</p>
            <WeatherIcon code={hour.weathercode} isDay={hour.is_day} />
            <p className="temp">{Math.round(hour.temperature)}°</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HourlyForecast;
