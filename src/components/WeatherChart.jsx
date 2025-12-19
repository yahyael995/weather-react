// D:\weather-react\src/components/WeatherChart.jsx (Corrected)

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

function WeatherChart({ hourlyData }) {
  // 1. Check if data is available
  if (!hourlyData || !hourlyData.time) {
    return null;
  }

  // 2. Restructure the data into the format Recharts expects
  const now = new Date();
  const currentHourIndex = hourlyData.time.findIndex((t) => new Date(t) >= now);

  // If we can't find the current hour, default to 0
  const startIndex = currentHourIndex !== -1 ? currentHourIndex : 0;

  // Slice the next 24 hours starting from the current hour
  const chartData = hourlyData.time
    .slice(startIndex, startIndex + 24)
    .map((time, index) => ({
      time: new Date(time).getHours() + ':00',
      temperature: hourlyData.temperature_2m[startIndex + index],
      'feels like': hourlyData.apparent_temperature[startIndex + index],
    }));

  return (
    <div className="chart-container glass-card">
      <h3>Temperature & Feels Like (°C)</h3>
      <ResponsiveContainer width="100%" height={300}>
        {/* 3. Use the new chartData array */}
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: -10,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              border: '1px solid #ccc',
              borderRadius: '10px',
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="temperature"
            stroke="#ff7300"
            activeDot={{ r: 8 }}
          />
          <Line type="monotone" dataKey="feels like" stroke="#387908" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default WeatherChart;
