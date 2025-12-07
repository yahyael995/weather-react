// D:\weather-react\src\utils\backgrounds.js

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

const weatherBackgrounds = {
  day: {
    clear: clearDay, // WMO codes: 0, 1
    cloudy: cloudyDay, // WMO codes: 2, 3
    rain: rainyDay, // WMO codes: 51, 53, 55, 61, 63, 65, 80, 81, 82
    snow: snowyDay, // WMO codes: 71, 73, 75, 85, 86
    thunderstorm: thunderstormDay, // WMO codes: 95, 96, 99
  },
  night: {
    clear: clearNight,
    cloudy: cloudyNight,
    rain: rainyNight,
    snow: snowyNight,
    thunderstorm: thunderstormNight,
  },
};

export const getBackgroundImage = (weatherData) => {
  if (!weatherData || !weatherData.current) {
    return defaultBg;
  }

  const code = weatherData.current.weathercode;
  const isDay = weatherData.current.is_day === 1;
  const timeOfDay = isDay ? 'day' : 'night';

  if ([0, 1].includes(code)) {
    return weatherBackgrounds[timeOfDay].clear;
  }
  if ([2, 3].includes(code)) {
    return weatherBackgrounds[timeOfDay].cloudy;
  }
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) {
    return weatherBackgrounds[timeOfDay].rain;
  }
  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return weatherBackgrounds[timeOfDay].snow;
  }
  if ([95, 96, 99].includes(code)) {
    return weatherBackgrounds[timeOfDay].thunderstorm;
  }

  return defaultBg;
};
