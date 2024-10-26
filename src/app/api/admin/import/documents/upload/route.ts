// src/app/api/admin/import/documents/upload/route.ts
import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { Readable } from 'stream';

const GOOGLE_DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_IMPORT_DOCS_FOLDER_ID;

const getGoogleDriveService = () => {
  const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
  
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: SCOPES,
  });

  return google.drive({ version: 'v3', auth });
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const documentType = formData.get('documentType') as string;
    const clearanceId = formData.get('clearanceId') as string | null;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!documentType) {
      return NextResponse.json(
        { error: 'Document type not specified' },
        { status: 400 }
      );
    }

    const drive = getGoogleDriveService();
    
    // Convert File to Buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    const stream = Readable.from(buffer);

    // Create file in Google Drive
    const driveResponse = await drive.files.create({
      requestBody: {
        name: `${clearanceId || 'import'}_${documentType}_${file.name}`,
        mimeType: file.type,
        parents: GOOGLE_DRIVE_FOLDER_ID ? [GOOGLE_DRIVE_FOLDER_ID] : undefined,
      },
      media: {
        mimeType: file.type,
        body: stream,
      },
    });

    // Set file permissions to anyone with link can view
    await drive.permissions.create({
      fileId: driveResponse.data.id!,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    // Get the web view link
    const fileData = await drive.files.get({
      fileId: driveResponse.data.id!,
      fields: 'webViewLink',
    });

    return NextResponse.json({
      fileUrl: fileData.data.webViewLink,
      message: 'File uploaded successfully',
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}