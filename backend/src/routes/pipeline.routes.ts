import { Router } from 'express';
import { 
  getPipelines,
  getPipelineById,
  getPipelineMetrics,
  getExecutions,
  getExecutionLogs,
  createWebhook
} from '../controllers/pipeline.controller';

const router = Router();

router.get('/', getPipelines);
router.get('/:id', getPipelineById);
router.get('/:id/metrics', getPipelineMetrics);
router.get('/:id/executions', getExecutions);
router.get('/executions/:executionId/logs', getExecutionLogs);
router.post('/webhook', createWebhook);

export { router };
