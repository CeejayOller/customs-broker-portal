// src/app/(admin)/admin/import/components/ImportDocumentUpload.tsx
import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Upload, FileUp, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

interface ImportDocumentUploadProps {
  clearanceId?: string;
  documentType: 'bill_of_lading' | 'commercial_invoice' | 'packing_list' | 'other';
  maxFileSize?: number;
  onUploadSuccess?: (fileUrl: string) => void;
}

interface UploadResponse {
  fileUrl: string;
  message: string;
}

const DOCUMENT_TYPE_LABELS = {
  bill_of_lading: 'Bill of Lading',
  commercial_invoice: 'Commercial Invoice',
  packing_list: 'Packing List',
  other: 'Other Document'
};

const ImportDocumentUpload: React.FC<ImportDocumentUploadProps> = ({
  clearanceId,
  documentType,
  maxFileSize = 5 * 1024 * 1024,
  onUploadSuccess
}) => {
  const [file, setFile] = React.useState<File | null>(null);
  const { toast } = useToast();
  
  const uploadMutation = useMutation({
    mutationFn: async (file: File): Promise<UploadResponse> => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentType', documentType);
      if (clearanceId) {
        formData.append('clearanceId', clearanceId);
      }
      
      const response = await fetch('/api/admin/import/documents/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Upload failed');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: 'Success',
        description: `${DOCUMENT_TYPE_LABELS[documentType]} uploaded successfully`,
        variant: 'default',
      });
      onUploadSuccess?.(data.fileUrl);
      setFile(null);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to upload document',
        variant: 'destructive',
      });
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    
    if (!selectedFile) return;
    
    if (selectedFile.size > maxFileSize) {
      toast({
        title: 'Error',
        description: `File size exceeds ${maxFileSize / (1024 * 1024)}MB limit`,
        variant: 'destructive',
      });
      return;
    }
    
    // Allow only PDF and image files
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(selectedFile.type)) {
      toast({
        title: 'Error',
        description: 'Only PDF, JPEG, and PNG files are allowed',
        variant: 'destructive',
      });
      return;
    }
    
    setFile(selectedFile);
  };

  const handleUpload = () => {
    if (!file) return;
    uploadMutation.mutate(file);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{DOCUMENT_TYPE_LABELS[documentType]}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div 
            className={`border-2 border-dashed rounded-lg p-6 text-center 
              ${uploadMutation.isPending ? 'bg-gray-50' : 'hover:bg-gray-50'} 
              transition-colors duration-150`}
          >
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              id={`file-upload-${documentType}`}
              accept=".pdf,.jpg,.jpeg,.png"
              disabled={uploadMutation.isPending}
            />
            <label
              htmlFor={`file-upload-${documentType}`}
              className="cursor-pointer flex flex-col items-center space-y-2"
            >
              <FileUp className="h-8 w-8 text-gray-400" />
              <span className="text-sm text-gray-500">
                {file ? file.name : 'Click to select file'}
              </span>
              <span className="text-xs text-gray-400">
                PDF, JPEG, or PNG (Max {maxFileSize / (1024 * 1024)}MB)
              </span>
            </label>
          </div>

          {file && (
            <Button
              onClick={handleUpload}
              className="w-full"
              disabled={uploadMutation.isPending}
            >
              {uploadMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload {DOCUMENT_TYPE_LABELS[documentType]}
                </>
              )}
            </Button>
          )}

          {uploadMutation.isError && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {uploadMutation.error.message || 'Failed to upload document'}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ImportDocumentUpload;