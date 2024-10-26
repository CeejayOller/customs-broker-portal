// src/types/clearance.ts
export type DocumentType = 'bill_of_lading' | 'commercial_invoice' | 'packing_list' | 'other';

export type DocumentStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type ClearanceStatus = 
  | 'DRAFT'
  | 'DOCUMENTS_PENDING'
  | 'DOCUMENTS_SUBMITTED'
  | 'UNDER_ASSESSMENT'
  | 'PAYMENT_PENDING'
  | 'PAYMENT_COMPLETED'
  | 'GOODS_RELEASE_PENDING'
  | 'COMPLETED'
  | 'ON_HOLD';

export interface Document {
  id: string;
  type: DocumentType;
  fileName: string;
  fileUrl: string;
  status: DocumentStatus;
  uploadedAt: string;
}

export interface ImportClearance {
  id: string;
  referenceNumber: string;
  status: ClearanceStatus;
  documents: Document[];
  createdAt: string;
  updatedAt: string;
}