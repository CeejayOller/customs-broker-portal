#!/bin/bash

# Install required dependencies
npm install pg @types/pg dotenv @types/dotenv typescript ts-node --save-dev

# Create TypeScript configuration
cat > tsconfig.json << EOL
{
  "compilerOptions": {
    "target": "es2017",
    "module": "commonjs",
    "lib": ["es2017", "dom"],
    "strict": true,
    "esModuleInterport": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
EOL

# Create test connection script
mkdir -p scripts
cat > scripts/test-connection.ts << EOL
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
    await pool.query(\`
      CREATE TABLE IF NOT EXISTS connection_test (
        id SERIAL PRIMARY KEY,
        test_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    \`);
    console.log('✅ Schema creation successful');

    // Test data insertion
    console.log('\nTesting data insertion...');
    await pool.query(\`
      INSERT INTO connection_test DEFAULT VALUES
    \`);
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
EOL

# Create development start script
cat > scripts/start-dev.sh << EOL
#!/bin/bash

# Load environment variables
set -a
source .env.local
set +a

# Start Cloud SQL Proxy
echo "Starting Cloud SQL Proxy..."
cloud_sql_proxy --port 5432 \
  "\$INSTANCE_CONNECTION_NAME" \
  --credentials-file="\$GOOGLE_APPLICATION_CREDENTIALS" &

# Store proxy PID
echo \$! > .proxy.pid

# Wait for proxy to start
echo "Waiting for proxy to start..."
sleep 5

# Start Next.js development server
echo "Starting Next.js development server..."
npm run dev

# Cleanup on exit
trap 'kill \$(cat .proxy.pid) && rm .proxy.pid' EXIT
EOL

# Make scripts executable
chmod +x scripts/start-dev.sh

# Update package.json scripts
npm pkg set scripts.dev="next dev"
npm pkg set scripts.build="next build"
npm pkg set scripts.start="next start"
npm pkg set scripts.test-db="ts-node scripts/test-connection.ts"

echo "Development environment setup complete!"
