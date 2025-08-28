// Set up test environment variables
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgres://user:password@localhost:5432/pipeline_dashboard_test';

// Global test timeout
jest.setTimeout(10000);
