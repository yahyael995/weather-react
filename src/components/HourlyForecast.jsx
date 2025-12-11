// src/components/HourlyForecast.jsx (النسخة النهائية مع فحص الأمان)

import React from 'react';
import { getWeatherIcon } from '../utils/icons';

const HourlyForecast = ({ data, unit }) => {
  // --- هذا هو فحص الأمان الذي يحل المشكلة ---
  // إذا لم تكن البيانات أو الوقت موجودًا، لا تعرض أي شيء
  if (!data || !data.time) {
    return null; // أو يمكنك عرض رسالة "جاري التحميل..."
  }

  const tempUnitLabel = unit === 'celsius' ? '°C' : '°F';

  // اعرض فقط الـ 24 ساعة القادمة
  const next24Hours = data.time.slice(0, 24);

  return (
    <div className="solid-card hourly-forecast">
      <h3>Hourly Forecast</h3>
      <div className="hourly-scroll">
        {next24Hours.map((time, index) => {
          const hour = new Date(time).getHours();
          const displayHour = hour === 0 ? '12am' : hour === 12 ? '12pm' : hour > 12 ? `${hour - 12}pm` : `${hour}am`;
          
          // --- هذا هو فحص الأمان الإضافي داخل الـ map ---
          const iconCode = data.weather_code ? data.weather_code[index] : 0;
          const temperature = data.temperature_2m ? Math.round(data.temperature_2m[index]) : 'N/A';

          return (
            <div key={index} className="hour-item">
              <span>{index === 0 ? 'Now' : displayHour}</span>
              <img src={getWeatherIcon(iconCode)} alt="Weather icon" className="weather-icon-small" />
              <span>{temperature}{tempUnitLabel}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HourlyForecast;
