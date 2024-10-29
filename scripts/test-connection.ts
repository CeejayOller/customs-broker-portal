import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function testConnection() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    // Test basic connection
    console.log('Testing database connection...');
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Database connected successfully at:', result.rows[0].now);

    // Test schema creation
    console.log('\nTesting schema creation...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS connection_test (
        id SERIAL PRIMARY KEY,
        test_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Schema creation successful');

    // Test data insertion
    console.log('\nTesting data insertion...');
    await pool.query(`
      INSERT INTO connection_test DEFAULT VALUES
    `);
    console.log('✅ Data insertion successful');

    // Clean up
    await pool.query('DROP TABLE connection_test');
    console.log('\n✅ All tests passed successfully!');
  } catch (error) {
    console.error('❌ Database test failed:', error);
  } finally {
    await pool.end();
  }
}

testConnection();
