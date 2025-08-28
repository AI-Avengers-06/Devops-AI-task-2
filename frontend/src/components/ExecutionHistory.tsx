import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import type { Execution } from '../services/api';

interface ExecutionHistoryProps {
  executions: Execution[];
}

export const ExecutionHistory: React.FC<ExecutionHistoryProps> = ({ executions }) => {
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
                <TableCell>{execution.duration}s</TableCell>
                <TableCell>
                  <a href="#" onClick={() => console.log('View logs:', execution.id)}>
                    View Logs
                  </a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
