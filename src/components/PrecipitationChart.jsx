// D:\weather-react\src\components\PrecipitationChart.jsx (Corrected)

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function PrecipitationChart({ hourlyData }) {
  // 1. Check if data is available
  if (!hourlyData || !hourlyData.time || !hourlyData.precipitation_probability) {
    return null;
  }

  // 2. Restructure the data
  const now = new Date();
const currentHourIndex = hourlyData.time.findIndex(t => new Date(t) >= now);
const startIndex = currentHourIndex !== -1 ? currentHourIndex : 0;

const chartData = hourlyData.time.slice(startIndex, startIndex + 24).map((time, index) => ({
  time: new Date(time).getHours() + ':00',
  'precipitation (%)': hourlyData.precipitation_probability[startIndex + index],
}));

  return (
    <div className="chart-container glass-card">
      <h3>Precipitation Probability</h3>
      <ResponsiveContainer width="100%" height={300}>
        {/* 3. Use the new chartData array */}
        <BarChart
          data={chartData}
          margin={{
            top: 5, right: 30, left: -10, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
          <XAxis dataKey="time" />
          <YAxis unit="%" />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              border: '1px solid #ccc',
              borderRadius: '10px'
            }}
          />
          <Legend />
          <Bar dataKey="precipitation (%)" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PrecipitationChart;
