// src/app/admin/admin/import/clearance/page.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import type { ImportClearance } from '@/types/clearance';

export default function NewClearancePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const clearanceData = {
      referenceNumber: `IMP-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      status: "DOCUMENTS_PENDING",
      clientId: "client123",
      shipmentDetails: {
        consignee: formData.get('consignee'),
        portOfEntry: formData.get('portOfEntry'),
        estimatedArrival: new Date(formData.get('estimatedArrival') as string),
        shipmentType: formData.get('shipmentType'),
        cargoDescription: formData.get('cargoDescription')
      },
      documents: [],
      timeline: {
        createdAt: new Date(),
      },
      customsValue: {
        declaredValue: parseFloat(formData.get('declaredValue') as string),
        currency: formData.get('currency') || 'USD',
      },
      notes: []
    };

    try {
      // In a real app, you would make an API call here
      // const response = await fetch('/api/clearances', {
      //   method: 'POST',
      //   body: JSON.stringify(clearanceData)
      // });
      // const data = await response.json();
      
      // For testing, we'll just simulate a success
      toast({
        title: "Success",
        description: "New clearance created successfully",
      });
      
      // Redirect to the clearance list
      router.push('/admin/admin/import');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create clearance",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">New Import Clearance</h1>
        <Button
          variant="outline"
          onClick={() => router.push('/admin/admin/import')}
        >
          Back to List
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Shipment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Consignee</label>
                <Input
                  name="consignee"
                  placeholder="Enter consignee name"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Port of Entry</label>
                <Input
                  name="portOfEntry"
                  placeholder="Enter port of entry"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Estimated Arrival</label>
                <Input
                  type="date"
                  name="estimatedArrival"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Shipment Type</label>
                <select
                  name="shipmentType"
                  className="w-full border rounded-md h-10 px-3"
                  required
                >
                  <option value="SEA">Sea Freight</option>
                  <option value="AIR">Air Freight</option>
                  <option value="LAND">Land Freight</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Declared Value</label>
                <Input
                  type="number"
                  name="declaredValue"
                  placeholder="Enter value"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Currency</label>
                <select
                  name="currency"
                  className="w-full border rounded-md h-10 px-3"
                  required
                >
                  <option value="USD">USD</option>
                  <option value="PHP">PHP</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Cargo Description</label>
              <textarea
                name="cargoDescription"
                className="w-full border rounded-md p-3"
                rows={3}
                placeholder="Enter cargo description"
                required
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/admin/import')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Clearance'}
          </Button>
        </div>
      </form>
    </div>
  );
}