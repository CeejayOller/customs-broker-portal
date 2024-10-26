// src/types/clearance.ts
export type DocumentType = 'bill_of_lading' | 'commercial_invoice' | 'packing_list' | 'other';

export type ClearanceStatus =
  | "DRAFT"
  | "DOCUMENTS_PENDING"
  | "DOCUMENTS_SUBMITTED"
  | "UNDER_ASSESSMENT"
  | "PAYMENT_PENDING"
  | "PAYMENT_COMPLETED"
  | "GOODS_RELEASE_PENDING"
  | "COMPLETED"
  | "ON_HOLD";

export interface Document {
  id: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: Date;
  type: DocumentType;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export interface ImportClearance {
  id: string;
  referenceNumber: string;
  status: ClearanceStatus;
  clientId: string;
  shipmentDetails: {
    consignee: string;
    portOfEntry: string;
    estimatedArrival: Date;
    shipmentType: "AIR" | "SEA" | "LAND";
    cargoDescription: string;
  };
  documents: Document[];
  timeline: {
    createdAt: Date;
    updatedAt?: Date;
    documentationComplete?: Date;
    assessmentStarted?: Date;
    paymentCompleted?: Date;
    releaseApproved?: Date;
    completedAt?: Date;
  };
  customsValue: {
    declaredValue: number;
    currency: string;
    dutyAmount?: number;
    taxAmount?: number;
    otherFees?: number;
    totalAmount?: number;
  };
  notes: string[];
  assignedAgent?: string;
}