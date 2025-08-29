// Set up test environment variables
process.env.NODE_ENV = 'test';

// Use environment variables for database connection, fallback to test defaults
const dbUser = process.env.POSTGRES_USER || 'user';
const dbPassword = process.env.POSTGRES_PASSWORD || 'password';
const dbHost = process.env.POSTGRES_HOST || 'localhost';
const dbPort = process.env.POSTGRES_PORT || '5432';
const dbName = process.env.POSTGRES_DB || 'pipeline_dashboard_test';

process.env.DATABASE_URL = `postgres://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;

// Global test timeout
jest.setTimeout(10000);
