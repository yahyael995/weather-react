// src/components/WeatherIcon.jsx

// هذا الكائن (Object) يربط كل كود طقس بوصف بسيط
const WMO_CODES = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  95: 'Thunderstorm',
};

// هذا المكون وظيفته عرض أيقونة بناءً على الكود
function WeatherIcon({ code, className }) {
  let icon;
  const description = WMO_CODES[code] || 'Unknown';

  // بناءً على الكود، نختار الأيقونة المناسبة
  if ([0, 1].includes(code)) { // شمس
    icon = (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
     );
  } else if ([2, 3].includes(code)) { // غيوم
    icon = (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
      </svg>
     );
  } else if (code >= 51 && code <= 82) { // مطر
    icon = (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21.7 15.2c.5-1.1.8-2.3.8-3.5 0-4.4-3.6-8-8-8s-8 3.6-8 8c0 1.2.3 2.4.8 3.5"></path><path d="M12 16v6"></path><path d="m16 18-4 4-4-4"></path>
      </svg>
     );
  } else if (code >= 95) { // عاصفة رعدية
    icon = (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21.7 15.2c.5-1.1.8-2.3.8-3.5 0-4.4-3.6-8-8-8s-8 3.6-8 8c0 1.2.3 2.4.8 3.5"></path><path d="m13 12-3 5h4l-3 5"></path>
      </svg>
     );
  } else { // أيقونة افتراضية
    icon = (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path>
      </svg>
     );
  }

  return (
    <div className={`weather-icon ${className || ''}`} title={description}>
      {icon}
      <span className="icon-description">{description}</span>
    </div>
  );
}

export default WeatherIcon;
