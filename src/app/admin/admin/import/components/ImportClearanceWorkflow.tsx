// src/app/(admin)/admin/import/components/ImportClearanceWorkflow.tsx
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ImportDocumentUpload from './ImportDocumentUpload';
import { useToast } from '@/components/ui/use-toast';

interface ImportClearanceWorkflowProps {
  clearanceId?: string;
}

const ImportClearanceWorkflow: React.FC<ImportClearanceWorkflowProps> = ({
  clearanceId
}) => {
  const { toast } = useToast();

  const handleUploadSuccess = (documentType: string, fileUrl: string) => {
    toast({
      title: 'Document Uploaded',
      description: `${documentType} has been uploaded successfully.`,
    });
    // Add any additional logic here (e.g., updating workflow state)
  };

  return (
    <div className="space-y-6">
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
                  onUploadSuccess={(fileUrl) => handleUploadSuccess('Bill of Lading', fileUrl)}
                />
                <ImportDocumentUpload
                  clearanceId={clearanceId}
                  documentType="commercial_invoice"
                  onUploadSuccess={(fileUrl) => handleUploadSuccess('Commercial Invoice', fileUrl)}
                />
                <ImportDocumentUpload
                  clearanceId={clearanceId}
                  documentType="packing_list"
                  onUploadSuccess={(fileUrl) => handleUploadSuccess('Packing List', fileUrl)}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="additional">
              <ImportDocumentUpload
                clearanceId={clearanceId}
                documentType="other"
                onUploadSuccess={(fileUrl) => handleUploadSuccess('Additional Document', fileUrl)}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImportClearanceWorkflow;