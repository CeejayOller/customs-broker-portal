// src/app/(admin)/admin/import/types/import-form.ts

export interface Client {
    id: string;
    name: string;
    contactPerson: string;
  }
  
  export interface Exporter {
    id: string;
    name: string;
    address: string;
  }
  
  export interface GoodsItem {
    id: string;
    description: string;
    invoiceValue: number;
    grossWeight: number;
    netWeight: number;
    quantity: number;
    hsCode: string;
  }
  
  export interface ShipmentForm {
    id: string;
    consigneeId: string;
    exporterId: string;
    exporterAddress: string;
    portOfOrigin: string;
    portOfDischarge: string;
    termsOfDelivery: string;
    markingsAndNumbers: string;
    packagingCode: string;
    // Sea freight specific
    blNumber?: string;
    vesselName?: string;
    registryNo?: string;
    voyageNo?: string;
    containerNo?: string;
    // Air freight specific
    awbNumber?: string;
    aircraftName?: string;
    flightNo?: string;
    goods: GoodsItem[];
    documents: { [key: string]: string[] };
  }
  
  export interface ValidationErrors {
    consignee?: string;
    exporter?: string;
    shipmentDetails?: string;
    documents?: string;
    goods?: string;
    submit?: string;
  }
  
  export const MOCK_CLIENTS: Client[] = [
    { id: '1', name: 'ABC Company', contactPerson: 'John Doe' },
    { id: '2', name: 'XYZ Corp', contactPerson: 'Jane Smith' },
  ];
  
  export const MOCK_EXPORTERS: Exporter[] = [
    { id: '1', name: 'Global Supply Co', address: '123 Export St, Shanghai, China' },
    { id: '2', name: 'Trade Partners Ltd', address: '456 Trade Ave, Singapore' },
  ];
  
  export const INCOTERMS = [
    'FOB', 'CIF', 'CFR', 'EXW', 'DDP', 'DAP'
  ];
  
  export interface NewImportFormProps {
    onComplete: () => void;
  }