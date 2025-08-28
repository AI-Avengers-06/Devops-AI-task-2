import request from 'supertest';
import { jest } from '@jest/globals';
import express from 'express';
import { router as pipelineRoutes } from '../routes/pipeline.routes';
import { router as alertRoutes } from '../routes/alert.routes';
import pool from '../config/database';

const app = express();
app.use(express.json());
app.use('/api/pipelines', pipelineRoutes);
app.use('/api/alerts', alertRoutes);

describe('Pipeline API', () => {
  beforeAll(async () => {
    // Ensure database is connected
    await pool.query('SELECT 1');
  });

  afterAll(async () => {
    await pool.end();
  });

  it('should get all pipelines', async () => {
    const response = await request(app).get('/api/pipelines');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should get pipeline metrics', async () => {
    // First get a pipeline
    const pipelines = await request(app).get('/api/pipelines');
    const pipelineId = pipelines.body[0].id;

    const response = await request(app).get(`/api/pipelines/${pipelineId}/metrics`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success_rate');
    expect(response.body).toHaveProperty('avg_build_time');
    expect(response.body).toHaveProperty('last_build_status');
  });

  it('should create and receive webhook events', async () => {
    const pipelines = await request(app).get('/api/pipelines');
    const pipelineId = pipelines.body[0].id;

    const webhookData = {
      pipeline_id: pipelineId,
      status: 'success',
      start_time: new Date(Date.now() - 1000 * 60).toISOString(), // 1 minute ago
      end_time: new Date().toISOString(),
      logs: 'Test execution completed successfully'
    };

    const response = await request(app)
      .post('/api/pipelines/webhook')
      .send(webhookData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.status).toBe('success');
  });
});
