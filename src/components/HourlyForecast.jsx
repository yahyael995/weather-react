// src/components/HourlyForecast.jsx (النسخة النهائية مع منطق الوقت الصحيح)

import React from 'react';
import { getWeatherIcon } from '../utils/icons';

const HourlyForecast = ({ data, unit }) => {
  if (!data || !data.time) {
    return null;
  }

  const tempUnitLabel = unit === 'celsius' ? '°C' : '°F';

  // --- هذا هو الإصلاح الكامل ---
  const now = new Date();
  const currentHour = now.getHours();

  // 1. ابحث عن فهرس الساعة الحالية في بيانات واجهة برمجة التطبيقات
  const startIndex = data.time.findIndex(
    (timeStr) => new Date(timeStr).getHours() === currentHour
  );

  // 2. إذا لم نجد الساعة الحالية (نادر جدًا)، ابدأ من الصفر
  const validStartIndex = startIndex === -1 ? 0 : startIndex;

  // 3. اقطع البيانات لتبدأ من الساعة الحالية وتأخذ الـ 24 ساعة التالية
  const forecastHours = data.time.slice(validStartIndex, validStartIndex + 24);

  return (
    <div className="solid-card hourly-forecast">
      <h3>Hourly Forecast</h3>
      <div className="hourly-scroll">
        {forecastHours.map((time, index) => {
          const actualIndex = validStartIndex + index; // هذا هو الفهرس الحقيقي في البيانات الأصلية
          const date = new Date(time);
          const hour = date.getHours();
          const displayHour =
            hour === 0
              ? '12am'
              : hour === 12
                ? '12pm'
                : hour > 12
                  ? `${hour - 12}pm`
                  : `${hour}am`;

          // استخدم الفهرس الحقيقي للحصول على البيانات الصحيحة
          const iconCode = data.weathercode[actualIndex];
          const temperature = Math.round(data.temperature_2m[actualIndex]);
          // --- هذا هو الإصلاح: استخدم is_day من بيانات الساعة ---
          const isDay = data.is_day[actualIndex];

          return (
            <div key={actualIndex} className="hour-item">
              <span>{index === 0 ? 'Now' : displayHour}</span>
              {/* --- هذا هو الإصلاح: مرر isDay إلى دالة الأيقونة --- */}
              <img
                src={getWeatherIcon(iconCode, isDay)}
                alt="Weather icon"
                className="weather-icon-small"
              />
              <span>
                {temperature}
                {tempUnitLabel}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HourlyForecast;
