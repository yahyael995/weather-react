// src/components/WeatherChart.jsx (The Bulletproof Final Version)
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function WeatherChart({ hourlyData, unit }) {
  // --- THE BULLETPROOF CHECK ---
  if (!hourlyData || !Array.isArray(hourlyData.time)) {
    return null; // Render nothing if data is not ready
  }
  // --- END OF BULLETPROOF CHECK ---

  const chartData = hourlyData.time.map((time, index) => ({
    time: new Date(time).getHours() + ':00',
    temperature: Math.round(hourlyData.temperature_2m[index]),
  }));

  return (
    <>
      <h3>Temperature Forecast</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis unit={unit === 'celsius' ? '°C' : '°F'} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="temperature" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}

export default WeatherChart;
