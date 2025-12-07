// D:\weather-react\src\utils\icons.js

// Import all your icon files here. 
// Make sure you have these icons in src/assets/icons/
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
    // Day icons
    day: {
        0: clearDay,
        1: clearDay,
        2: partlyCloudyDay,
        3: cloudy,
        45: fog,
        48: fog,
        51: rain, 53: rain, 55: rain,
        61: rain, 63: rain, 65: rain,
        80: rain, 81: rain, 82: rain,
        71: snow, 73: snow, 75: snow, 77: snow,
        85: snow, 86: snow,
        95: thunderstorm, 96: thunderstorm, 99: thunderstorm,
    },
    // Night icons
    night: {
        0: clearNight,
        1: clearNight,
        2: partlyCloudyNight,
        3: cloudy,
        45: fog,
        48: fog,
        51: rain, 53: rain, 55: rain,
        61: rain, 63: rain, 65: rain,
        80: rain, 81: rain, 82: rain,
        71: snow, 73: snow, 75: snow, 77: snow,
        85: snow, 86: snow,
        95: thunderstorm, 96: thunderstorm, 99: thunderstorm,
    }
};

export const getWeatherIcon = (code, isDay) => {
    const timeOfDay = isDay ? 'day' : 'night';
    return iconMap[timeOfDay][code] || cloudy; // Return a default icon if code not found
};
