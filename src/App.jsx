// src/App.jsx (النسخة النهائية مع التوثيق)

// --- 1. استيراد المكتبات والمكونات ---
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';
import CurrentWeather from './components/CurrentWeather';
import HourlyForecast from './components/HourlyForecast';
import DailyForecast from './components/DailyForecast';
import WeatherChart from './components/WeatherChart';
import PrecipitationChart from './components/PrecipitationChart';
import { getBackgroundImage } from './utils/backgrounds';
import { getRandomCity } from './utils/randomCities';
import defaultBackground from './assets/backgrounds/default.jpg';

// --- 2. المكون الرئيسي للتطبيق ---
function App() {
  // --- 3. تعريف الحالات (States) ---
  const [weatherData, setWeatherData] = useState(null); // لتخزين بيانات الطقس الكاملة
  const [loading, setLoading] = useState(false);       // لتتبع حالة التحميل (لإظهار الدائرة الدوارة)
  const [error, setError] = useState(null);           // لتخزين أي رسائل خطأ
  const [unit, setUnit] = useState('celsius');        // لتتبع وحدة الحرارة الحالية (°C أو °F)
  const [lastQuery, setLastQuery] = useState(null);     // لتذكر آخر بحث تم إجراؤه (مفيد عند تبديل الوحدات)
  const [isDarkMode, setIsDarkMode] = useState(false);  // لتتبع حالة الوضع الليلي

  // --- 4. التأثيرات الجانبية (Side Effects) ---
  // هذا التأثير يعمل عند تغيير isDarkMode ويقوم بإضافة أو إزالة كلاس 'dark' من body
  useEffect(() => {
    document.body.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  // --- 5. الدالة الرئيسية لجلب البيانات ---
  // useCallback يستخدم لتحسين الأداء عن طريق منع إعادة إنشاء الدالة في كل مرة يتم فيها إعادة العرض
  const fetchWeatherData = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    
    const queryParams = new URLSearchParams();
    queryParams.append('units', params.unit || unit);

    // قراءة رابط الخادم الخلفي من متغيرات البيئة (التي تم تعيينها في Vercel)
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    let finalUrl;
    let currentQuery;

    if (params.city) {
      // إذا كان البحث حسب المدينة
      currentQuery = { type: 'city', value: params.city };
      queryParams.append('city', params.city);
      finalUrl = `${API_BASE_URL}/weather?${queryParams.toString()}`;
    } else if (params.coords) {
      // إذا كان البحث حسب الموقع الجغرافي
      currentQuery = { type: 'coords', value: params.coords };
      queryParams.append('lat', params.coords.latitude);
      queryParams.append('lon', params.coords.longitude);
      finalUrl = `${API_BASE_URL}/weather?${queryParams.toString()}`;
    } else {
      // حالة طارئة إذا لم يتم توفير أي شيء
      setError('No city or coordinates provided.');
      setLoading(false);
      return;
    }

    try {
      // إجراء الطلب باستخدام axios
      const response = await axios.get(finalUrl);
      setWeatherData(response.data);
      setLastQuery(currentQuery); // حفظ البحث الأخير
    } catch (err) {
      // معالجة الأخطاء
      console.error("AxiosError:", err);
      const errorMessage = err.response?.data?.error || 'Failed to fetch data from external API.';
      setError(`Error: ${errorMessage}. Please try again.`);
      setWeatherData(null);
    } finally {
      // هذا الجزء يعمل دائمًا، سواء نجح الطلب أو فشل
      setLoading(false);
    }
  }, [unit]); // تعتمد هذه الدالة على 'unit'، لذا يتم إعادة إنشائها فقط عند تغيير الوحدة

  // --- 6. دوال معالجة الأحداث (Event Handlers) ---
  const handleSearch = (city) => {
    if (city) fetchWeatherData({ city });
  };

  const handleGeolocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => fetchWeatherData({ coords: position.coords }),
        () => setError('Geolocation permission denied. Please enable it in your browser settings.')
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

  const toggleUnit = () => {
    const newUnit = unit === 'celsius' ? 'fahrenheit' : 'celsius';
    setUnit(newUnit);
    // إعادة جلب البيانات بالوحدة الجديدة لآخر بحث تم
    if (lastQuery) {
      if (lastQuery.type === 'city') {
        fetchWeatherData({ city: lastQuery.value, unit: newUnit });
      } else if (lastQuery.type === 'coords') {
        fetchWeatherData({ coords: lastQuery.value, unit: newUnit });
      }
    }
  };

  const handleSurpriseMe = () => {
    const city = getRandomCity();
    handleSearch(city);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  // --- 7. منطق العرض (Render Logic) ---
  // تحديد الخلفية: ديناميكية إذا كانت البيانات موجودة، وإلا فالافتراضية
  const backgroundStyle = {
    backgroundImage: weatherData
      ? `url(${getBackgroundImage(weatherData.current.weathercode, weatherData.current.is_day)})`
      : `url(${defaultBackground})`
  };

  // --- 8. بنية JSX (ما يتم عرضه على الشاشة) ---
  return (
    <div className="App" style={backgroundStyle}>
      <div className="main-container">
        {/* شريط البحث والأزرار العلوي */}
        <div className="top-bar">
          <form className="search-bar" onSubmit={(e) => { e.preventDefault(); handleSearch(e.target.elements.city.value); }}>
            <input type="text" name="city" placeholder="Search for a city..." />
            <button type="submit">Search</button>
          </form>
          <div className="button-group">
            <button onClick={handleGeolocate}>📍</button>
            <button onClick={toggleUnit}>{unit === 'celsius' ? '°C' : '°F'}</button>
            <button onClick={handleSurpriseMe}>?</button>
            <button onClick={toggleDarkMode}>{isDarkMode ? '☀️' : '🌙'}</button>
          </div>
        </div>

        {/* منطقة المحتوى الرئيسية */}
        <div className="content-area">
          {loading && <div className="loading-spinner"></div>}
          {error && <div className="solid-card error-box"><p>⚠️  
{error}</p></div>}
          {!loading && !error && !weatherData && (
            <div className="solid-card welcome-message">
              <h2>Welcome to Weather React</h2>
              <p>Enter a city name or use geolocation to get the weather forecast.</p>
            </div>
          )}
          {weatherData && (
            <>
              <CurrentWeather data={weatherData} unit={unit} />
              <HourlyForecast data={weatherData.hourly} unit={unit} />
              <DailyForecast data={weatherData.daily} unit={unit} />
              <div className="solid-card chart-container">
                <WeatherChart hourlyData={weatherData.hourly} unit={unit} />
              </div>
              <div className="solid-card chart-container">
                <PrecipitationChart hourlyData={weatherData.hourly} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
