import React from 'react';
import { Grid2, Paper, Typography } from '@mui/material';

// Local type definition to avoid import issues
interface Pipeline {
  id: number;
  name: string;
  repository: string;
  created_at: string;
  updated_at: string;
}

interface MetricsCardProps {
  title: string;
  value: string | number;
  description?: string;
}

const MetricsCard: React.FC<MetricsCardProps> = ({ title, value, description }) => (
  <Paper sx={{ p: 2, height: '100%' }}>
    <Typography variant="h6" gutterBottom>
      {title}
    </Typography>
    <Typography variant="h4" component="div">
      {value}
    </Typography>
    {description && (
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    )}
  </Paper>
);

interface DashboardProps {
  pipeline: Pipeline;
  metrics: {
    success_rate: number;
    avg_build_time: number;
    last_build_status: string;
  };
}

export const Dashboard: React.FC<DashboardProps> = ({ pipeline, metrics }) => {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        {pipeline.name}
      </Typography>
      <Grid2 container spacing={3}>
        <Grid2 xs={12} md={4}>
          <MetricsCard
            title="Success Rate"
            value={`${(metrics.success_rate * 100).toFixed(1)}%`}
            description="Last 7 days"
          />
        </Grid2>
        <Grid2 xs={12} md={4}>
          <MetricsCard
            title="Average Build Time"
            value={`${Math.round(metrics.avg_build_time)}s`}
            description="Last 7 days"
          />
        </Grid2>
        <Grid2 xs={12} md={4}>
          <MetricsCard
            title="Last Build Status"
            value={metrics.last_build_status}
          />
        </Grid2>
      </Grid2>
    </div>
  );
};
