// src/lib/config.ts
import path from 'path';
import os from 'os';

interface CloudConfig {
  projectId: string;
  instanceConnectionName: string;
  databaseUrl: string;
  storageBucket: string;
  credentials: {
    path: string;
    exists: boolean;
  };
}

export function getCloudConfig(): CloudConfig {
  // Expand home directory for Mac compatibility
  const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS?.replace(
    '~',
    os.homedir()
  );

  const config: CloudConfig = {
    projectId: process.env.GOOGLE_CLOUD_PROJECT || '',
    instanceConnectionName: process.env.INSTANCE_CONNECTION_NAME || '',
    databaseUrl: process.env.DATABASE_URL || '',
    storageBucket: process.env.GOOGLE_STORAGE_BUCKET || '',
    credentials: {
      path: credentialsPath || '',
      exists: false
    }
  };

  // Validate configuration
  const requiredVars = [
    'projectId',
    'instanceConnectionName',
    'databaseUrl',
    'storageBucket'
  ];

  const missingVars = requiredVars.filter(key => !config[key as keyof typeof config]);

  if (missingVars.length > 0) {
    console.warn(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
  }

  // Check if credentials file exists
  try {
    const fs = require('fs');
    config.credentials.exists = fs.existsSync(config.credentials.path);
    if (!config.credentials.exists) {
      console.warn('Google Cloud credentials file not found');
    }
  } catch (error) {
    console.error('Error checking credentials:', error);
  }

  return config;
}

// Initialize configuration on startup
const cloudConfig = getCloudConfig();
export default cloudConfig;