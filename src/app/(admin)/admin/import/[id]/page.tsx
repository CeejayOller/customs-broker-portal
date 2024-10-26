// src/app/admin/admin/import/[id]/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import ImportClearanceWorkflow from '../components/ImportClearanceWorkflow';
import type { ImportClearance, ClearanceStatus } from '@/types/clearance';

// Mock data for testing
const MOCK_CLEARANCE: ImportClearance = {
  id: "1",
  referenceNumber: "IMP-2024-001",
  status: "DOCUMENTS_PENDING",
  clientId: "client123",
  shipmentDetails: {
    consignee: "ABC Corporation",
    portOfEntry: "Manila International Container Port",
    estimatedArrival: new Date(),
    shipmentType: "SEA",
    cargoDescription: "Industrial Equipment"
  },
  documents: [
    {
      id: "doc1",
      fileName: "invoice.pdf",
      fileUrl: "/documents/invoice.pdf",
      uploadedAt: new Date(),
      type: "commercial_invoice",
      status: "PENDING"
    }
  ],
  timeline: {
    createdAt: new Date(),
    updatedAt: new Date()
  },
  customsValue: {
    declaredValue: 50000,
    currency: "USD",
    dutyAmount: 2500,
    taxAmount: 6000,
    otherFees: 500,
    totalAmount: 9000
  },
  notes: []
};

export default function ViewClearancePage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [clearance, setClearance] = useState<ImportClearance | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const loadClearance = async () => {
      try {
        // In a real app, you would fetch from your API
        // const response = await fetch(`/api/clearances/${params.id}`);
        // const data = await response.json();
        
        // For testing, use mock data
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
        setClearance(MOCK_CLEARANCE);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load clearance data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadClearance();
  }, [params.id, toast]);

  const handleStatusUpdate = async (newStatus: ClearanceStatus) => {
    try {
      // In a real app, you would update via API
      // await fetch(`/api/clearances/${params.id}/status`, {
      //   method: 'PUT',
      //   body: JSON.stringify({ status: newStatus })
      // });

      setClearance(prev => prev ? {
        ...prev,
        status: newStatus,
        timeline: {
          ...prev.timeline,
          updatedAt: new Date()
        }
      } : null);

      toast({
        title: "Success",
        description: "Status updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!clearance) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Clearance not found
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Import Clearance Details</h1>
          <p className="text-gray-500">Reference: {clearance.referenceNumber}</p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push('/admin/admin/import')}
        >
          Back to List
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Shipment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Consignee</dt>
              <dd>{clearance.shipmentDetails.consignee}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Port of Entry</dt>
              <dd>{clearance.shipmentDetails.portOfEntry}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Estimated Arrival</dt>
              <dd>{new Date(clearance.shipmentDetails.estimatedArrival).toLocaleDateString()}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Shipment Type</dt>
              <dd>{clearance.shipmentDetails.shipmentType}</dd>
            </div>
            <div className="md:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Cargo Description</dt>
              <dd>{clearance.shipmentDetails.cargoDescription}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <ImportClearanceWorkflow
        clearanceId={params.id as string}
        clearance={clearance}
        onUpdateStatus={handleStatusUpdate}
      />
    </div>
  );
}