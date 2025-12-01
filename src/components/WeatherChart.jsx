// D:\weather-react\src\components\WeatherChart.jsx (The final, working version with icons)

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './WeatherChart.css';
import WeatherIcon from './WeatherIcon'; // Import the WeatherIcon component

// This component renders a weather icon instead of a regular dot on the chart
const CustomizedDot = (props) => {
  // Recharts provides all necessary props, including the index and the payload (our data)
  const { cx, cy, payload, index } = props;

  // To prevent the chart from being too crowded, we only render an icon every 3 hours.
  // We use the 'index' of the data point for this logic.
  if (index % 3 !== 0) {
    return null; // Return null to not render a dot for this data point
  }

  return (
    <g transform={`translate(${cx},${cy})`}>
      {/* foreignObject allows us to render HTML/React components inside an SVG */}
      <foreignObject x={-12} y={-12} width={24} height={24}>
        <div style={{ fontSize: '20px', textAlign: 'center' }}>
          <WeatherIcon code={payload.weathercode} isDay={payload.is_day} />
        </div>
      </foreignObject>
    </g>
  );
};

const WeatherChart = ({ hourlyData }) => {
  if (!hourlyData || hourlyData.length === 0) {
    return null;
  }

  // We need to pass weathercode and is_day to the chart data for the custom dot to use
  const chartData = hourlyData.map(hour => ({
    time: new Date(hour.time).toLocaleTimeString('en-US', { hour: '2-digit' }), // Keep this for the X-axis label
    Temperature: Math.round(hour.temperature),
    'Feels Like': Math.round(hour.apparent_temperature),
    weathercode: hour.weathercode, // Pass weathercode
    is_day: hour.is_day,           // Pass is_day
  }));

  return (
    <div className="weather-chart">
      <h3>24-Hour Temperature Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={chartData}
          margin={{
            top: 20, // Increased top margin to make space for icons
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              border: '1px solid #ccc',
              borderRadius: '5px',
            }}
          />
          <Legend />
          {/* Apply the custom dot to the Temperature line */}
          <Line type="monotone" dataKey="Temperature" stroke="#8884d8" activeDot={{ r: 8 }} dot={<CustomizedDot />} />
          <Line type="monotone" dataKey="Feels Like" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeatherChart;
