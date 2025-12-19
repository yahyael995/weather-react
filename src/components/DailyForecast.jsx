// src/components/DailyForecast.jsx (النسخة النهائية مع إعادة فحص الأمان)

import React from 'react';
import { getWeatherIcon } from '../utils/icons';

const DailyForecast = ({ data, unit }) => {
  // --- هذا هو فحص الأمان الذي تمت إعادته ---
  // إذا لم تكن البيانات أو الوقت موجودًا، لا تعرض أي شيء
  if (!data || !data.time) {
    return null;
  }

  const tempUnitLabel = unit === 'celsius' ? '°C' : '°F';

  return (
    <div className="solid-card daily-forecast">
      <h3>7-Day Forecast</h3>
      {data.time.map((time, index) => {
        const day = new Date(time).toLocaleDateString('en-US', {
          weekday: 'short',
        });
        // --- هذا هو الإصلاح الثاني: نستخدم weathercode بدون شرطة سفلية ---
        const iconCode = data.weathercode[index];
        const maxTemp = Math.round(data.temperature_2m_max[index]);
        const minTemp = Math.round(data.temperature_2m_min[index]);

        return (
          <div key={index} className="day-item">
            <span className="day-name">{index === 0 ? 'Today' : day}</span>
            <img
              src={getWeatherIcon(iconCode)}
              alt="Weather icon"
              className="weather-icon"
            />
            <div className="temp-range">
              <span>
                {maxTemp}
                {tempUnitLabel}
              </span>
              <span className="temp-min">
                {minTemp}
                {tempUnitLabel}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DailyForecast;
