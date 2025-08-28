import { Request, Response } from 'express';
import pool from '../config/database';

export const getAlertConfigs = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM alerts');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createAlertConfig = async (req: Request, res: Response) => {
  const { pipeline_id, type, threshold, channels } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO alerts (pipeline_id, type, threshold, channels) VALUES ($1, $2, $3, $4) RETURNING *',
      [pipeline_id, type, threshold, channels]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateAlertConfig = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { type, threshold, channels } = req.body;
  try {
    const result = await pool.query(
      'UPDATE alerts SET type = $1, threshold = $2, channels = $3 WHERE id = $4 RETURNING *',
      [type, threshold, channels, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Alert config not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteAlertConfig = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM alerts WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Alert config not found' });
    }
    res.json({ message: 'Alert config deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
