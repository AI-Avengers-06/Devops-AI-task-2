import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
      }
    : {
        user: 'postgres',
        password: 'postgres',
        host: 'localhost',
        port: 5432,
        database: 'pipeline_dashboard'
      }
);

export default pool;
