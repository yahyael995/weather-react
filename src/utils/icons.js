// src/utils/icons.js (النسخة النهائية مع إضافة الدالة المفقودة)

import clearDay from '../assets/icons/clear-day.svg';
import clearNight from '../assets/icons/clear-night.svg';
import cloudy from '../assets/icons/cloudy.svg';
import fog from '../assets/icons/fog.svg';
import partlyCloudyDay from '../assets/icons/partly-cloudy-day.svg';
import partlyCloudyNight from '../assets/icons/partly-cloudy-night.svg';
import rain from '../assets/icons/rain.svg';
import snow from '../assets/icons/snow.svg';
import thunderstorm from '../assets/icons/thunderstorm.svg';

const iconMap = {
  0: clearDay, // Clear sky
  1: partlyCloudyDay, // Mainly clear
  2: cloudy, // Partly cloudy
  3: cloudy, // Overcast
  45: fog, // Fog
  46: fog, // Depositing rime fog
  51: rain, // Drizzle: Light
  53: rain, // Drizzle: Moderate
  55: rain, // Drizzle: Dense intensity
  61: rain, // Rain: Slight
  63: rain, // Rain: Moderate
  65: rain, // Rain: Heavy intensity
  80: rain, // Rain showers: Slight
  81: rain, // Rain showers: Moderate
  82: rain, // Rain showers: Violent
  95: thunderstorm, // Thunderstorm: Slight or moderate
  // Add night icons if you have them and logic to switch
};

const descriptionMap = {
    0: 'Clear Sky',
    1: 'Mainly Clear',
    2: 'Partly Cloudy',
    3: 'Overcast',
    45: 'Fog',
    46: 'Rime Fog',
    51: 'Light Drizzle',
    53: 'Drizzle',
    55: 'Dense Drizzle',
    61: 'Slight Rain',
    63: 'Rain',
    65: 'Heavy Rain',
    71: 'Slight Snow',
    73: 'Snow',
    75: 'Heavy Snow',
    77: 'Snow Grains',
    80: 'Slight Showers',
    81: 'Rain Showers',
    82: 'Violent Showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with Hail',
    99: 'Thunderstorm with Hail',
};

export function getWeatherIcon(code) {
  return iconMap[code] || cloudy; // Return a default icon if code not found
}

// --- هذه هي الدالة التي كانت مفقودة ---
export function getWeatherDescription(code) {
    return descriptionMap[code] || 'Unknown'; // Return a default description
}
