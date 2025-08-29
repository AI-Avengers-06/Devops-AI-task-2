import { useEffect, useState } from 'react';
import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { Dashboard } from './components/Dashboard';
import { ExecutionHistory } from './components/ExecutionHistory';
import { api, type Pipeline, type PipelineMetrics, type Execution } from './services/api';
import { wsService } from './services/websocket.service';

const theme = createTheme();

function App() {
  const [pipeline, setPipeline] = useState<Pipeline | null>(null);
  const [metrics, setMetrics] = useState<PipelineMetrics | null>(null);
  const [executions, setExecutions] = useState<Execution[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pipelines = await api.getPipelines();
        if (pipelines.length > 0) {
          const selectedPipeline = pipelines[0];
          setPipeline(selectedPipeline);

          const [pipelineMetrics, pipelineExecutions] = await Promise.all([
            api.getPipelineMetrics(selectedPipeline.id),
            api.getPipelineExecutions(selectedPipeline.id),
          ]);

          setMetrics(pipelineMetrics);
          setExecutions(pipelineExecutions);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();

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
