// src/lib/google/auth.ts
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

export const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Setup Google Drive API
export const drive = google.drive({ version: 'v3', auth: oauth2Client });

// Setup Gmail API
export const gmail = google.gmail({ version: 'v1', auth: oauth2Client });