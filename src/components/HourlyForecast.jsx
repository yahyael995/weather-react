// D:\weather-react\src\components\HourlyForecast.jsx (Corrected for styling)

import React from 'react';
import { getWeatherIcon } from '../utils/icons';

function HourlyForecast({ data }) {
  if (!data || !data.time || !data.temperature_2m) {
    return null;
  }

  const formattedData = data.time.map((time, index) => ({
    time: new Date(time).getHours(),
    temp: Math.round(data.temperature_2m[index]),
    weathercode: data.weathercode[index],
    is_day: data.is_day[index],
  })).slice(0, 24);

  return (
    // 1. REMOVED "glass-card" from this outer div
    <div className="hourly-forecast">
      <h3>Hourly Forecast</h3>
      <div className="hourly-scroll">
        {formattedData.map((hour, index) => (
          // 2. ADDED "glass-card" to this inner div
          <div key={index} className="hour-item glass-card">
            <p>{hour.time}:00</p>
            <img 
              src={getWeatherIcon(hour.weathercode, hour.is_day)} 
              alt="Weather icon" 
              className="weather-icon-small"
            />
            <p>{hour.temp}°</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HourlyForecast;
