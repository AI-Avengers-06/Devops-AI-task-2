import { Request, Response } from 'express';
import pool from '../config/database';
import { sendSlackNotification } from '../services/slack.service';
import { sendEmailNotification } from '../services/email.service';
import { broadcastUpdate } from '../services/websocket.service';

export const getPipelines = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM pipelines');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPipelineById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM pipelines WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pipeline not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPipelineMetrics = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const metrics = await pool.query(`
      SELECT 
        COUNT(CASE WHEN status = 'success' THEN 1 END)::float / COUNT(*)::float as success_rate,
        AVG(EXTRACT(EPOCH FROM (end_time - start_time)))::integer as avg_build_time,
        MAX(end_time) as last_build_time,
        (SELECT status FROM executions WHERE pipeline_id = $1 ORDER BY end_time DESC LIMIT 1) as last_build_status
      FROM executions
      WHERE pipeline_id = $1
      AND end_time > NOW() - INTERVAL '7 days'
    `, [id]);
    
    res.json(metrics.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getExecutions = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { limit = 10, offset = 0 } = req.query;
  try {
    const result = await pool.query(
      'SELECT * FROM executions WHERE pipeline_id = $1 ORDER BY start_time DESC LIMIT $2 OFFSET $3',
      [id, limit, offset]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createWebhook = async (req: Request, res: Response) => {
  const { pipeline_id, status, start_time, end_time, logs } = req.body;
  
  try {
    // Insert execution record
    const result = await pool.query(
      'INSERT INTO executions (pipeline_id, status, start_time, end_time, logs) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [pipeline_id, status, start_time, end_time, logs]
    );

    // Check if alerts should be sent
    if (status === 'failure') {
      const pipeline = await pool.query('SELECT * FROM pipelines WHERE id = $1', [pipeline_id]);
      const alertConfigs = await pool.query('SELECT * FROM alerts WHERE pipeline_id = $1', [pipeline_id]);
      
      for (const config of alertConfigs.rows) {
        if (config.channels.includes('slack')) {
          await sendSlackNotification({
            pipelineName: pipeline.rows[0].name,
            status,
            buildTime: end_time - start_time,
            logs
          });
        }
        
        if (config.channels.includes('email')) {
          await sendEmailNotification({
            pipelineName: pipeline.rows[0].name,
            status,
            buildTime: end_time - start_time,
            logs
          });
        }
      }
    }

    const execution = result.rows[0];
    
    // Broadcast the update to all connected clients
    broadcastUpdate({
      type: 'EXECUTION_CREATED',
      data: execution
    });

    res.status(201).json(execution);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
