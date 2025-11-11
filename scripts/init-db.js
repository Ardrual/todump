#!/usr/bin/env node

/**
 * Database initialization script
 * Run with: node scripts/init-db.js
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function initDatabase() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('Connecting to database...');

    // Read the migration file
    const migrationPath = path.join(__dirname, '..', 'db', 'migrations', '001_init.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    console.log('Running migrations...');
    await pool.query(sql);

    console.log('✅ Database initialized successfully!');
    console.log('');
    console.log('Your database is ready. You can now:');
    console.log('1. Run: npm run dev');
    console.log('2. Navigate to: http://localhost:3000');
    console.log('3. Create an account and start using todump!');
  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    console.error('');
    console.error('Make sure:');
    console.error('1. PostgreSQL is running');
    console.error('2. DATABASE_URL is correctly set in .env.local');
    console.error('3. The database exists (run: createdb todump)');
    process.exit(1);
  } finally {
    await pool.end();
  }
}

initDatabase();
