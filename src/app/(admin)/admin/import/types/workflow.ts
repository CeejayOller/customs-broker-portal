// src/app/(admin)/admin/import/types/workflow.ts

import { LucideIcon } from 'lucide-react';

// Base state interface
export interface WorkflowStateBase {
  label: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

// Shipment data interfaces
export interface ShipmentData {
  id: string;
  referenceNumber: string;
  consignee: {
    name: string;
    address: string;
    tin: string;
    brn: string; // Bank Reference Number
  };
  exporter: {
    name: string;
    address: string;
  };
  shipmentDetails: {
    bl_number: string;
    vessel_name?: string;
    flight_number?: string;
    registry_number: string;
    voyage_number: string;
    port_of_origin: string;
    port_of_discharge: string;
    eta: string;
    ata: string;
    description_of_goods: string;
    volume: string;
  };
  documents: {
    name: string;
    status: 'not_uploaded' | 'draft' | 'final';
    isVerified: boolean;
    isRequired: boolean;
    url?: string;
  }[];
  computations: {
    dutiable_value: number;
    customs_duty: number;
    vat: number;
    other_charges: number;
    total_payable: number;
  };
  timeline: {
    stage: string;
    status: WorkflowStageStatus;
    timestamp: string;
  }[];
  notes: string[];
}

export type WorkflowStageStatus = 'pending' | 'partial' | 'complete';

// Automated transaction reference numbering
export interface ReferenceNumberResponse {
    referenceNumber: string;
    sequenceNumber: number;
  }

// to handle API responses
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

// for pagination responses
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}