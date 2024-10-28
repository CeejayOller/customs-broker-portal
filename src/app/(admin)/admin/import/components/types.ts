// src/app/(admin)/admin/import/components/types.ts

export interface Document {
    id: string;
    name: string;
    type: string;
    status: 'pending' | 'uploaded' | 'verified';
    url?: string;
    uploadedAt?: Date;
    verifiedAt?: Date;
  }
  
  export interface ShipmentDetails {
    referenceNumber: string;
    consignee: {
      name: string;
      address: string;
      tin: string;
      brn: string;
    };
    exporter: {
      name: string;
      address: string;
    };
    transport: {
      type: 'sea' | 'air';
      blNumber?: string;
      awbNumber?: string;
      vesselName?: string;
      flightNumber?: string;
      registryNumber: string;
      voyageNumber: string;
    };
    portOfOrigin: string;
    portOfDischarge: string;
    eta: string;
    ata: string;
    goodsDescription: string;
    volume: string;
    documents: Document[];
  }
  
  export type WorkflowStage = 
    | 'CLIENT_SHIPMENT'
    | 'DOCUMENT_COLLECTION'
    | 'TAX_COMPUTATION'
    | 'READY_FOR_E2M'
    | 'LODGED_IN_E2M'
    | 'PAYMENT_COMPLETED'
    | 'PORT_RELEASE'
    | 'IN_TRANSIT'
    | 'DELIVERED';
  
  export interface RequiredDocument {
    type: string;
    name: string;
    required: boolean;
  }
  
  export const REQUIRED_DOCUMENTS: RequiredDocument[] = [
    { type: 'bl', name: 'Bill of Lading / Airway Bill', required: true },
    { type: 'invoice', name: 'Commercial Invoice', required: true },
    { type: 'packing', name: 'Packing List', required: true },
    { type: 'letterhead', name: 'Letterhead', required: true },
    { type: 'sds', name: 'Safety Data Sheet (SDS)', required: false },
  ];