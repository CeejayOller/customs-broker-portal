// src/app/(admin)/admin/import/page.tsx
"use client"

import ImportClearanceWorkflow from './components/ImportClearanceWorkflow'

// Sample data for testing
const sampleClearance = {
  id: '123',
  referenceNumber: 'IMP-2024-001',
  status: 'DOCUMENTS_PENDING' as const,
  documents: [
    {
      id: '1',
      type: 'bill_of_lading' as const,
      fileName: 'bl-123.pdf',
      fileUrl: '/documents/bl-123.pdf',
      status: 'PENDING' as const,
      uploadedAt: new Date().toISOString()
    }
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

export default function ImportPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Import Clearance</h1>
      <ImportClearanceWorkflow 
        clearanceId="123"
        clearance={sampleClearance}
        onUpdateStatus={(status) => console.log('Status updated:', status)}
      />
    </div>
  )
}