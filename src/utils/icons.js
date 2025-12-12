// src/utils/icons.js (النسخة النهائية مع توحيد الخريطتين)

import clearDay from '../assets/icons/clear-day.svg';
import clearNight from '../assets/icons/clear-night.svg';
import cloudy from '../assets/icons/cloudy.svg';
import fog from '../assets/icons/fog.svg';
import partlyCloudyDay from '../assets/icons/partly-cloudy-day.svg';
import partlyCloudyNight from '../assets/icons/partly-cloudy-night.svg';
import rain from '../assets/icons/rain.svg';
import snow from '../assets/icons/snow.svg';
import thunderstorm from '../assets/icons/thunderstorm.svg';

// --- هذا هو الجزء الذي تم تحديثه بالكامل ---
const iconMap = {
  0: clearDay,
  1: partlyCloudyDay,
  2: cloudy,
  3: cloudy,
  45: fog,
  48: fog,
  51: rain,
  53: rain,
  55: rain,
  56: rain,
  57: rain,
  61: rain,
  63: rain,
  65: rain,
  66: rain,
  67: rain,
  71: snow,
  73: snow,
  75: snow,
  77: snow,
  80: rain,
  81: rain,
  82: rain,
  85: snow,
  86: snow,
  95: thunderstorm,
  96: thunderstorm,
  99: thunderstorm,
};

const descriptionMap = {
    0: 'Clear Sky',
    1: 'Mainly Clear',
    2: 'Partly Cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Rime Fog',
    51: 'Light Drizzle',
    53: 'Drizzle',
    55: 'Dense Drizzle',
    56: 'Light Freezing Drizzle',
    57: 'Dense Freezing Drizzle',
    61: 'Slight Rain',
    63: 'Rain',
    65: 'Heavy Rain',
    66: 'Light Freezing Rain',
    67: 'Heavy Freezing Rain',
    71: 'Slight Snowfall',
    73: 'Snowfall',
    75: 'Heavy Snowfall',
    77: 'Snow Grains',
    80: 'Slight Rain Showers',
    81: 'Rain Showers',
    82: 'Violent Rain Showers',
    85: 'Slight Snow Showers',
    86: 'Heavy Snow Showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with Hail',
    99: 'Thunderstorm with Hail',
};

// src/utils/icons.js (تحديث دالة الأيقونة)

export function getWeatherIcon(code, is_day = 1) { // افترض أنه نهار إذا لم يتم توفير القيمة
  const condition = weatherConditions[code] || 'default';
  
  if (condition === 'clear' && !is_day) {
    return clearNight;
  }
  if (condition === 'cloudy' && !is_day) {
    return partlyCloudyNight; // استخدم أيقونة ليلية مناسبة للغيوم
  }
  
  return iconMap[code] || cloudy;
}
