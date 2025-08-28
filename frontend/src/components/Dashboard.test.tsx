import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Dashboard } from './Dashboard';

describe('Dashboard Component', () => {
  const mockPipeline = {
    id: 1,
    name: 'Test Pipeline',
    repository: 'test/repo',
    created_at: '2023-01-01',
    updated_at: '2023-01-01'
  };

  const mockMetrics = {
    success_rate: 0.85,
    avg_build_time: 120,
    last_build_status: 'success'
  };

  it('renders pipeline name', () => {
    render(<Dashboard pipeline={mockPipeline} metrics={mockMetrics} />);
    expect(screen.getByText('Test Pipeline')).toBeDefined();
  });

  it('displays success rate correctly', () => {
    render(<Dashboard pipeline={mockPipeline} metrics={mockMetrics} />);
    expect(screen.getByText('85.0%')).toBeDefined();
  });

  it('displays build time correctly', () => {
    render(<Dashboard pipeline={mockPipeline} metrics={mockMetrics} />);
    expect(screen.getByText('120s')).toBeDefined();
  });
});
