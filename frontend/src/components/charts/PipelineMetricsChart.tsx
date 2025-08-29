import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Box, Typography } from '@mui/material';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface PipelineMetricsChartProps {
  data?: {
    success_rate: number;
    avg_build_time: number;
    last_build_time: string;
    last_build_status: string;
  };
}

const PipelineMetricsChart: React.FC<PipelineMetricsChartProps> = ({ data }) => {
  if (!data) {
    return (
      <Box p={2}>
        <Typography variant="h6">Pipeline Metrics</Typography>
        <Typography color="textSecondary">No data available</Typography>
      </Box>
    );
  }

  const chartData = {
    labels: ['Success Rate (%)', 'Avg Build Time (s)'],
    datasets: [
      {
        label: 'Pipeline Metrics',
        data: [data.success_rate * 100, data.avg_build_time],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(54, 162, 235, 0.6)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(54, 162, 235, 1)'],
        borderWidth: 1,
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
        text: 'Pipeline Performance Metrics',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>
        Pipeline Metrics
      </Typography>
      <Bar data={chartData} options={options} />
      <Box mt={2}>
        <Typography variant="body2" color="textSecondary">
          Last Build: {new Date(data.last_build_time).toLocaleString()} ({data.last_build_status})
        </Typography>
      </Box>
    </Box>
  );
};

export default PipelineMetricsChart;
