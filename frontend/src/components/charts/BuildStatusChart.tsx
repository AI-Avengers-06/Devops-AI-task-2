import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Box, Typography } from '@mui/material';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface BuildStatusChartProps {
  data?: Array<{
    id: number;
    status: string;
    start_time: string;
    end_time: string;
  }>;
}

const BuildStatusChart: React.FC<BuildStatusChartProps> = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <Box p={2}>
        <Typography variant="h6">Build Status Trend</Typography>
        <Typography color="textSecondary">No build data available</Typography>
      </Box>
    );
  }

  const last10Builds = data.slice(-10);
  
  const chartData = {
    labels: last10Builds.map((_, index) => `Build ${index + 1}`),
    datasets: [
      {
        label: 'Build Status',
        data: last10Builds.map(build => build.status === 'success' ? 1 : 0),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        pointBackgroundColor: last10Builds.map(build => 
          build.status === 'success' ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)'
        ),
        pointBorderColor: last10Builds.map(build => 
          build.status === 'success' ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)'
        ),
        pointRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Build Status Trend (Last 10 Builds)',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
        ticks: {
          callback: function(value: any) {
            return value === 1 ? 'Success' : 'Failure';
          }
        }
      },
    },
  };

  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>
        Build Status Trend
      </Typography>
      <Line data={chartData} options={options} />
    </Box>
  );
};

export default BuildStatusChart;
