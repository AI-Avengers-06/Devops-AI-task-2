import React, { useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
} from '@mui/material';
import type { Execution } from '../services/api';
import { api } from '../services/api';
import { LogsDialog } from './LogsDialog';

interface ExecutionHistoryProps {
  executions: Execution[];
}

export const ExecutionHistory: React.FC<ExecutionHistoryProps> = ({ executions }) => {
  const [logsDialogOpen, setLogsDialogOpen] = useState(false);
  const [selectedLogs, setSelectedLogs] = useState('');
  const [loadingLogs, setLoadingLogs] = useState(false);

  const handleViewLogs = async (executionId: number) => {
    setLoadingLogs(true);
    try {
      const logsData = await api.getExecutionLogs(executionId);
      setSelectedLogs(logsData.logs);
      setLogsDialogOpen(true);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
      setSelectedLogs('Failed to load logs');
      setLogsDialogOpen(true);
    } finally {
      setLoadingLogs(false);
    }
  };

  const formatDuration = (execution: any) => {
    // Use the calculated duration_seconds from the backend if available
    if (execution.duration_seconds) {
      return `${execution.duration_seconds}s`;
    }
    // Fallback to original duration field
    if (execution.duration) {
      return `${execution.duration}s`;
    }
    // Calculate from start/end times if available
    if (execution.start_time && execution.end_time) {
      const start = new Date(execution.start_time);
      const end = new Date(execution.end_time);
      const duration = Math.round((end.getTime() - start.getTime()) / 1000);
      return `${duration}s`;
    }
    return '-';
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Recent Executions
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Status</TableCell>
              <TableCell>Start Time</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {executions.map((execution) => (
              <TableRow key={execution.id}>
                <TableCell>
                  <span
                    style={{
                      color: execution.status === 'success' ? 'green' : 'red',
                    }}
                  >
                    {execution.status}
                  </span>
                </TableCell>
                <TableCell>
                  {new Date(execution.start_time).toLocaleString()}
                </TableCell>
                <TableCell>{formatDuration(execution)}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleViewLogs(execution.id)}
                    disabled={loadingLogs}
                  >
                    {loadingLogs ? 'Loading...' : 'View Logs'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <LogsDialog
        open={logsDialogOpen}
        onClose={() => setLogsDialogOpen(false)}
        logs={selectedLogs}
      />
    </div>
  );
};
