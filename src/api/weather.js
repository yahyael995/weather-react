// /api/weather.js (Vercel Serverless Function)
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// This is now the main export, the serverless function handler
export default async function handler(req, res) {
  console.log('--- VERCEL FUNCTION: WEATHER REQUEST RECEIVED! ---');
  
  const { unit, city, latitude, longitude } = req.query;
  const apiKey = process.env.VITE_WEATHER_API_KEY;

  if (!apiKey) {
    console.error('API Key is missing on the server.');
    return res.status(500).json({ error: 'API Key is missing on the server.' });
  }

  if (!city && (!latitude || !longitude)) {
    console.error('City or coordinates are required.');
    return res.status(400).json({ error: 'City or coordinates are required.' });
  }

  let lat = latitude;
  let lon = longitude;

  try {
    if (city) {
      const geocodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
      const geocodeResponse = await axios.get(geocodeUrl );
      if (geocodeResponse.data.length === 0) {
        return res.status(404).json({ error: 'City not found.' });
      }
      lat = geocodeResponse.data[0].lat;
      lon = geocodeResponse.data[0].lon;
    }

    const weatherUrl = `https://api.open-meteo.com/v1/forecast`;
    const weatherParams = {
      latitude: lat,
      longitude: lon,
      current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weathercode,wind_speed_10m',
      hourly: 'temperature_2m,weathercode,is_day',
      daily: 'weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
      timezone: 'auto',
      temperature_unit: unit === 'fahrenheit' ? 'fahrenheit' : 'celsius',
      forecast_days: 8,
    };

    const weatherResponse = await axios.get(weatherUrl, { params: weatherParams } );
    const responseData = weatherResponse.data;

    // Fetch location name for coordinates
    let locationName = city;
    if (!locationName) {
      try {
        const reverseGeocodeUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;
        const reverseGeocodeResponse = await axios.get(reverseGeocodeUrl );
        if (reverseGeocodeResponse.data.length > 0) {
          locationName = reverseGeocodeResponse.data[0].name;
        }
      } catch (e) {
        console.warn('Could not reverse geocode, continuing without a location name.');
      }
    }

    // Send the final combined data
    res.status(200).json({ ...responseData, city: locationName });

  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    res.status(500).json({ error: 'Failed to fetch weather data from external API.' });
  }
}
