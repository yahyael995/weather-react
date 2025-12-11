// src/utils/backgrounds.js (النسخة النهائية مع الإصلاح النهائي)

import clearDay from '../assets/backgrounds/clear-day.jpg';
import clearNight from '../assets/backgrounds/clear-night.jpg';
import cloudyDay from '../assets/backgrounds/cloudy-day.jpg';
import cloudyNight from '../assets/backgrounds/cloudy-night.jpg';
import rainyDay from '../assets/backgrounds/rainy-day.jpg';
import rainyNight from '../assets/backgrounds/rainy-night.jpg';
import snowyDay from '../assets/backgrounds/snowy-day.jpg';
import snowyNight from '../assets/backgrounds/snowy-night.jpg';
import thunderstormDay from '../assets/backgrounds/thunderstorm-day.jpg';
import thunderstormNight from '../assets/backgrounds/thunderstorm-night.jpg';
import defaultDay from '../assets/backgrounds/default.jpg'; // Assuming default is a day image

const backgroundMap = {
  'clear-day': clearDay,
  'clear-night': clearNight,
  'cloudy-day': cloudyDay,
  'cloudy-night': cloudyNight,
  'rainy-day': rainyDay,
  'rainy-night': rainyNight,
  'snowy-day': snowyDay,
  'snowy-night': snowyNight,
  'thunderstorm-day': thunderstormDay,
  'thunderstorm-night': thunderstormNight,
  'default-day': defaultDay,
  'default-night': cloudyNight, // Fallback for default night
};

const weatherConditions = {
  0: 'clear',
  1: 'clear',
  2: 'cloudy',
  3: 'cloudy',
  45: 'cloudy', // Fog
  48: 'cloudy', // Rime Fog
  51: 'rainy',
  53: 'rainy',
  55: 'rainy',
  61: 'rainy',
  63: 'rainy',
  65: 'rainy',
  71: 'snowy',
  73: 'snowy',
  75: 'snowy',
  80: 'rainy',
  81: 'rainy',
  82: 'rainy',
  95: 'thunderstorm',
  96: 'thunderstorm',
  99: 'thunderstorm',
};

// --- هذا هو الإصلاح ---
export function getBackgroundImage(code, is_day) {
  const condition = weatherConditions[code] || 'default';
  const timeOfDay = is_day ? 'day' : 'night';
  const key = `${condition}-${timeOfDay}`;
  return backgroundMap[key] || backgroundMap['default-day'];
}
