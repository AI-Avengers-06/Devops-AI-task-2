import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material';

interface LogsDialogProps {
  open: boolean;
  onClose: () => void;
  logs: string;
}

export const LogsDialog: React.FC<LogsDialogProps> = ({ open, onClose, logs }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Execution Logs</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            backgroundColor: '#1e1e1e',
            color: '#fff',
            padding: 2,
            borderRadius: 1,
            fontFamily: 'monospace',
            fontSize: '0.875rem',
            maxHeight: '400px',
            overflow: 'auto',
            whiteSpace: 'pre-wrap',
          }}
        >
          {logs || 'No logs available'}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};