// src/app/(admin)/admin/import/constants/workflow-states.ts
import { 
    ClipboardList, 
    FileCheck, 
    Calculator, 
    Upload, 
    Truck, 
    Package, 
    Check,
    FileText,
    DollarSign,
    Building
  } from 'lucide-react';
  
  export const WORKFLOW_STATES = {
    CLIENT_DETAILS: {
      label: 'Client Shipment Details',
      icon: ClipboardList,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100'
    },
    DOCUMENT_COLLECTION: {
      label: 'Document Collection & Verification',
      icon: FileText,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100'
    },
    TAX_COMPUTATION: {
      label: 'Tax/Duty Computation',
      icon: Calculator,
      color: 'text-purple-500',
      bgColor: 'bg-purple-100'
    },
    READY_FOR_LODGEMENT: {
      label: 'Ready for E2M',
      icon: Upload,
      color: 'text-green-500',
      bgColor: 'bg-green-100'
    },
    LODGED: {
      label: 'Lodged in E2M and Portal',
      icon: Check,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    PAYMENT_COMPLETED: {
      label: 'Payment Completed',
      icon: DollarSign,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-100'
    },
    PORT_RELEASE: {
      label: 'Port Release',
      icon: Building,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-100'
    },
    IN_TRANSIT: {
      label: 'In Transit',
      icon: Truck,
      color: 'text-amber-500',
      bgColor: 'bg-amber-100'
    },
    DELIVERED: {
      label: 'Delivered',
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    }
  } as const;
  
  export const REQUIRED_DOCUMENTS = [
    { name: 'Bill of Lading / Airway Bill', isRequired: true },
    { name: 'Commercial Invoice', isRequired: true },
    { name: 'Packing List', isRequired: true },
    { name: 'Letterhead', isRequired: true },
    { name: 'Safety Data Sheet (SDS)', isRequired: false },
    { name: 'Certificate of Origin', isRequired: false },
    { name: 'Import Permit', isRequired: false },
    { name: 'Product Certifications', isRequired: false },
    { name: 'Final SAD', isRequired: false }
  ] as const;