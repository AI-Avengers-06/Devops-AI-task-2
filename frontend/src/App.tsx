import { useEffect, useState } from 'react';
import { Container, CssBaseline, ThemeProvider, createTheme, Box, FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';
import { Dashboard } from './components/Dashboard';
import { ExecutionHistory } from './components/ExecutionHistory';
import { api, type Pipeline, type PipelineMetrics, type Execution } from './services/api';
import { wsService } from './services/websocket.service';

const theme = createTheme();

function App() {
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [selectedPipelineId, setSelectedPipelineId] = useState<number | null>(null);
  const [pipeline, setPipeline] = useState<Pipeline | null>(null);
  const [metrics, setMetrics] = useState<PipelineMetrics | null>(null);
  const [executions, setExecutions] = useState<Execution[]>([]);

  // Load pipeline data when pipeline selection changes
  const loadPipelineData = async (pipelineId: number) => {
    try {
      const selectedPipeline = pipelines.find(p => p.id === pipelineId);
      if (selectedPipeline) {
        setPipeline(selectedPipeline);

        const [pipelineMetrics, pipelineExecutions] = await Promise.all([
          api.getPipelineMetrics(selectedPipeline.id),
          api.getPipelineExecutions(selectedPipeline.id),
        ]);

        setMetrics(pipelineMetrics);
        setExecutions(pipelineExecutions);
      }
    } catch (error) {
      console.error('Failed to fetch pipeline data:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allPipelines = await api.getPipelines();
        setPipelines(allPipelines);
        
        if (allPipelines.length > 0) {
          const firstPipelineId = allPipelines[0].id;
          setSelectedPipelineId(firstPipelineId);
          await loadPipelineData(firstPipelineId);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedPipelineId) {
      loadPipelineData(selectedPipelineId);
    }
  }, [selectedPipelineId, pipelines]);

  useEffect(() => {
    // Define WebSocket event handler
    const handleNewExecution = async (data: Execution) => {
      if (pipeline && data.pipeline_id === pipeline.id) {
        setExecutions(prev => [data, ...prev]);
        const newMetrics = await api.getPipelineMetrics(pipeline.id);
        setMetrics(newMetrics);
      }
    };

    // Set up WebSocket connection with error handling
    // Skip WebSocket if explicitly disabled
    if (import.meta.env.VITE_DISABLE_WEBSOCKET !== 'true') {
      try {
        wsService.connect();
        wsService.addEventListener('EXECUTION_CREATED', handleNewExecution);
      } catch (error) {
        console.warn('WebSocket initialization failed - continuing without real-time updates:', error);
      }
    } else {
      console.log('WebSocket disabled via environment variable');
    }

    return () => {
      wsService.removeEventListener('EXECUTION_CREATED', handleNewExecution);
      wsService.disconnect();
    };
  }, [pipeline]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            DevOps Pipeline Dashboard
          </Typography>
          
          {pipelines.length > 0 && (
            <FormControl fullWidth sx={{ mt: 2, maxWidth: 400 }}>
              <InputLabel id="pipeline-select-label">Select Pipeline</InputLabel>
              <Select
                labelId="pipeline-select-label"
                value={selectedPipelineId || ''}
                label="Select Pipeline"
                onChange={(e) => setSelectedPipelineId(Number(e.target.value))}
              >
                {pipelines.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.name} ({p.repository})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Box>

        {pipeline && metrics && (
          <>
            <Dashboard pipeline={pipeline} metrics={metrics} />
            <ExecutionHistory executions={executions} />
          </>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;
