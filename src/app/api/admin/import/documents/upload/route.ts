// src/app/api/admin/import/documents/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

// In production, replace this with Google Cloud Storage
const saveFile = async (file: File, docType: string, shipmentId: string) => {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create unique filename
    const extension = path.extname(file.name);
    const filename = `${shipmentId}-${docType}-${randomUUID()}${extension}`;
    const filepath = path.join(process.cwd(), 'public', 'uploads', filename);
    
    await writeFile(filepath, buffer);
    return `/uploads/${filename}`;
  } catch (error) {
    console.error('Error saving file:', error);
    throw new Error('Failed to save file');
  }
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const docType = formData.get('documentType') as string;
    const shipmentId = formData.get('shipmentId') as string;

    if (!file || !docType || !shipmentId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF, JPEG, and PNG files are allowed' },
        { status: 400 }
      );
    }

    // Save file and get URL
    const fileUrl = await saveFile(file, docType, shipmentId);

    // Update shipment documents (replace with database update later)
    const shipmentIndex = shipments.findIndex(s => s.id === shipmentId);
    if (shipmentIndex !== -1) {
      const docIndex = shipments[shipmentIndex].documents.findIndex(
        d => d.name === docType
      );
      
      if (docIndex !== -1) {
        shipments[shipmentIndex].documents[docIndex] = {
          ...shipments[shipmentIndex].documents[docIndex],
          status: 'draft',
          url: fileUrl
        };
      }
    }

    return NextResponse.json({
      success: true,
      fileUrl,
      message: 'Document uploaded successfully'
    });
  } catch (error) {
    console.error('Error uploading document:', error);
    return NextResponse.json(
      { error: 'Failed to upload document' },
      { status: 500 }
    );
  }
}