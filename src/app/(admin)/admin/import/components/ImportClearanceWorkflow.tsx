// src/app/(admin)/admin/import/components/ImportClearanceWorkflow.tsx
"use client"

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, Clock, AlertTriangle } from "lucide-react";
import ImportDocumentUpload from './ImportDocumentUpload'; // Changed to default import
import { useToast } from '@/components/ui/use-toast';
import type { ImportClearance, ClearanceStatus, DocumentType } from '@/types/clearance';

const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  bill_of_lading: 'Bill of Lading',
  commercial_invoice: 'Commercial Invoice',
  packing_list: 'Packing List',
  other: 'Other Document'
} as const;

const STATUS_CONFIG: Record<ClearanceStatus, {
  label: string;
  color: string;
  icon: React.ReactNode;
}> = {
  DRAFT: {
    label: "Draft",
    color: "bg-gray-200",
    icon: <Clock className="h-5 w-5 text-gray-500" />
  },
  DOCUMENTS_PENDING: {
    label: "Documents Pending",
    color: "bg-yellow-200",
    icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />
  },
  DOCUMENTS_SUBMITTED: {
    label: "Documents Submitted",
    color: "bg-blue-200",
    icon: <Clock className="h-5 w-5 text-blue-500" />
  },
  UNDER_ASSESSMENT: {
    label: "Under Assessment",
    color: "bg-purple-200",
    icon: <Clock className="h-5 w-5 text-purple-500" />
  },
  PAYMENT_PENDING: {
    label: "Payment Pending",
    color: "bg-orange-200",
    icon: <AlertTriangle className="h-5 w-5 text-orange-500" />
  },
  PAYMENT_COMPLETED: {
    label: "Payment Completed",
    color: "bg-green-200",
    icon: <CheckCircle className="h-5 w-5 text-green-500" />
  },
  GOODS_RELEASE_PENDING: {
    label: "Release Pending",
    color: "bg-blue-200",
    icon: <Clock className="h-5 w-5 text-blue-500" />
  },
  COMPLETED: {
    label: "Completed",
    color: "bg-green-200",
    icon: <CheckCircle className="h-5 w-5 text-green-500" />
  },
  ON_HOLD: {
    label: "On Hold",
    color: "bg-red-200",
    icon: <AlertTriangle className="h-5 w-5 text-red-500" />
  }
};

interface ImportClearanceWorkflowProps {
  clearanceId?: string;
  clearance?: ImportClearance;
  onUpdateStatus?: (status: ClearanceStatus) => void;
}

const ImportClearanceWorkflow: React.FC<ImportClearanceWorkflowProps> = ({
  clearanceId,
  clearance,
  onUpdateStatus
}) => {
  const { toast } = useToast();

  const handleUploadSuccess = (documentType: string, fileUrl: string) => {
    toast({
      title: 'Document Uploaded',
      description: `${documentType} has been uploaded successfully.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Status Card */}
      {clearance && (
        <Card>
          <CardHeader>
            <CardTitle>Clearance Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              {STATUS_CONFIG[clearance.status].icon}
              <div>
                <p className="font-medium">{STATUS_CONFIG[clearance.status].label}</p>
                <p className="text-sm text-gray-500">
                  Reference: {clearance.referenceNumber}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Documents Management Card */}
      <Card>
        <CardHeader>
          <CardTitle>Import Clearance Documents</CardTitle>
          <CardDescription>
            Upload and manage required documents for import clearance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="required" className="space-y-4">
            <TabsList>
              <TabsTrigger value="required">Required Documents</TabsTrigger>
              <TabsTrigger value="additional">Additional Documents</TabsTrigger>
            </TabsList>
            
            <TabsContent value="required" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ImportDocumentUpload
                  clearanceId={clearanceId}
                  documentType="bill_of_lading"
                  onUploadSuccess={(fileUrl: string) => handleUploadSuccess('Bill of Lading', fileUrl)}
                />
                <ImportDocumentUpload
                  clearanceId={clearanceId}
                  documentType="commercial_invoice"
                  onUploadSuccess={(fileUrl: string) => handleUploadSuccess('Commercial Invoice', fileUrl)}
                />
                <ImportDocumentUpload
                  clearanceId={clearanceId}
                  documentType="packing_list"
                  onUploadSuccess={(fileUrl: string) => handleUploadSuccess('Packing List', fileUrl)}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="additional">
              <ImportDocumentUpload
                clearanceId={clearanceId}
                documentType="other"
                onUploadSuccess={(fileUrl: string) => handleUploadSuccess('Additional Document', fileUrl)}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Display uploaded documents if available */}
      {clearance?.documents && clearance.documents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {clearance.documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <p className="font-medium">
                      {DOCUMENT_TYPE_LABELS[doc.type as DocumentType]}
                    </p>
                    <p className="text-sm text-gray-500">{doc.fileName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      doc.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                      doc.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {doc.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ImportClearanceWorkflow;