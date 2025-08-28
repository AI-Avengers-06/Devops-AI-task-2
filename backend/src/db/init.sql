-- Create pipelines table
CREATE TABLE IF NOT EXISTS pipelines (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    repository VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create executions table
CREATE TABLE IF NOT EXISTS executions (
    id SERIAL PRIMARY KEY,
    pipeline_id INTEGER REFERENCES pipelines(id),
    status VARCHAR(50) NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    duration INTEGER,
    logs TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
    id SERIAL PRIMARY KEY,
    pipeline_id INTEGER REFERENCES pipelines(id),
    type VARCHAR(50) NOT NULL,
    threshold JSONB NOT NULL,
    channels JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on pipeline_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_executions_pipeline_id ON executions(pipeline_id);
CREATE INDEX IF NOT EXISTS idx_alerts_pipeline_id ON alerts(pipeline_id);

-- Create index on start_time for faster metrics calculations
CREATE INDEX IF NOT EXISTS idx_executions_start_time ON executions(start_time);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_pipelines_updated_at
    BEFORE UPDATE ON pipelines
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_alerts_updated_at
    BEFORE UPDATE ON alerts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO pipelines (name, repository) VALUES
    ('Main Pipeline', 'organization/main-repo'),
    ('Frontend Build', 'organization/frontend-repo'),
    ('Backend Build', 'organization/backend-repo');

-- Insert sample executions
INSERT INTO executions (pipeline_id, status, start_time, end_time, duration, logs) VALUES
    (1, 'success', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '45 minutes', 900, 'Build completed successfully'),
    (1, 'failure', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '1 hour 45 minutes', 900, 'Tests failed'),
    (2, 'success', NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '15 minutes', 900, 'Frontend build successful');

-- Insert sample alert configurations
INSERT INTO alerts (pipeline_id, type, threshold, channels) VALUES
    (1, 'failure', '{"consecutive_failures": 2}', '["slack", "email"]'),
    (2, 'duration', '{"max_duration": 1800}', '["slack"]');
