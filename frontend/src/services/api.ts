import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface Pipeline {
  id: number;
  name: string;
  repository: string;
  created_at: string;
  updated_at: string;
}

export interface PipelineMetrics {
  success_rate: number;
  avg_build_time: number;
  last_build_time: string;
  last_build_status: string;
}

export interface Execution {
  id: number;
  pipeline_id: number;
  status: string;
  start_time: string;
  end_time: string;
  duration: number;
  logs: string;
}

export const api = {
  async getPipelines() {
    const response = await axios.get<Pipeline[]>(`${API_URL}/pipelines`);
    return response.data;
  },

  async getPipelineMetrics(id: number) {
    const response = await axios.get<PipelineMetrics>(`${API_URL}/pipelines/${id}/metrics`);
    return response.data;
  },

  async getPipelineExecutions(id: number, limit = 10, offset = 0) {
    const response = await axios.get<Execution[]>(
      `${API_URL}/pipelines/${id}/executions?limit=${limit}&offset=${offset}`
    );
    return response.data;
  }
};
