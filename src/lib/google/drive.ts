// src/lib/google/drive.ts
import { drive } from './auth';
import { Readable } from 'stream';

export const googleDriveService = {
  async uploadFile(
    file: Buffer,
    filename: string,
    mimeType: string,
    folderId?: string
  ) {
    try {
      const fileMetadata = {
        name: filename,
        parents: folderId ? [folderId] : undefined,
      };

      const media = {
        mimeType,
        body: Readable.from(file),
      };

      const response = await drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: 'id, name, webViewLink',
      });

      return {
        fileId: response.data.id,
        fileName: response.data.name,
        webViewLink: response.data.webViewLink,
      };
    } catch (error) {
      console.error('Google Drive upload error:', error);
      throw error;
    }
  },

  async createFolder(folderName: string, parentFolderId?: string) {
    try {
      const fileMetadata = {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: parentFolderId ? [parentFolderId] : undefined,
      };

      const response = await drive.files.create({
        requestBody: fileMetadata,
        fields: 'id, name',
      });

      return {
        folderId: response.data.id,
        folderName: response.data.name,
      };
    } catch (error) {
      console.error('Google Drive folder creation error:', error);
      throw error;
    }
  },
};