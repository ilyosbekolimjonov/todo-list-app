import 'dotenv/config';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

pool.connect((err) => {
  if (err) console.error('❌ DB connection error:', err.message);
  else console.log('✅ Connected to Neon PostgreSQL');
});

export default pool;
