// src/utils/backgrounds.js (Updated for WeatherAPI.com codes)
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
import defaultBg from '../assets/backgrounds/default.jpg';

const backgroundMap = {
  // Clear/Sunny
  1000: { day: clearDay, night: clearNight },
  // Cloudy
  1003: { day: cloudyDay, night: cloudyNight }, // Partly Cloudy
  1006: { day: cloudyDay, night: cloudyNight }, // Cloudy
  1009: { day: cloudyDay, night: cloudyNight }, // Overcast
  // Rain
  1063: { day: rainyDay, night: rainyNight },
  1150: { day: rainyDay, night: rainyNight },
  1183: { day: rainyDay, night: rainyNight },
  1189: { day: rainyDay, night: rainyNight },
  1195: { day: rainyDay, night: rainyNight },
  1240: { day: rainyDay, night: rainyNight },
  1243: { day: rainyDay, night: rainyNight },
  // Snow
  1066: { day: snowyDay, night: snowyNight },
  1213: { day: snowyDay, night: snowyNight },
  1219: { day: snowyDay, night: snowyNight },
  1225: { day: snowyDay, night: snowyNight },
  1255: { day: snowyDay, night: snowyNight },
  // Thunderstorm
  1087: { day: thunderstormDay, night: thunderstormNight },
  1273: { day: thunderstormDay, night: thunderstormNight },
  1276: { day: thunderstormDay, night: thunderstormNight },
};

export const getBackgroundImage = (code, isDay) => {
  const condition = backgroundMap[code];
  if (condition) {
    return isDay ? condition.day : condition.night;
  }
  return defaultBg;
};
