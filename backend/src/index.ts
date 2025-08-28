import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { router as pipelineRoutes } from './routes/pipeline.routes';
import { router as alertRoutes } from './routes/alert.routes';
import { initializeWebSocket } from './services/websocket.service';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/pipelines', pipelineRoutes);
app.use('/api/alerts', alertRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

const server = createServer(app);
initializeWebSocket(server);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
