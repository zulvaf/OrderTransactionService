require('dotenv').config()
const { Pool, Client } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || '',
  user: process.env.PGUSER || '',
  host: process.env.PGHOST || '',
  database: process.env.PGDATABASE || '',
  password: process.env.PGPASSWORD || '',
  port: process.env.PGPORT || ''
});

module.exports = pool;