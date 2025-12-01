// D:\weather-react\src\components\PrecipitationChart.jsx (Reverted to a working state)

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PrecipitationChart = ({ hourlyData }) => {
  if (!hourlyData || hourlyData.length === 0 || hourlyData[0].precipitation_probability === undefined) {
    return null; 
  }

  const chartData = hourlyData.map(hour => ({
    time: new Date(hour.time).toLocaleTimeString('en-US', { hour: '2-digit' }),
    'Precipitation (%)': hour.precipitation_probability,
  }));

  return (
    <div className="weather-chart"> 
      <h3>24-Hour Precipitation Forecast</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          {/* Reverted to the original, simple label */}
          <YAxis domain={[0, 100]} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              border: '1px solid #ccc',
              borderRadius: '5px',
            }}
          />
          <Legend />
          <Bar dataKey="Precipitation (%)" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PrecipitationChart;
