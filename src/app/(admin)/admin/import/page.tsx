// src/app/(admin)/admin/import/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, FileText, Ship, Plane } from 'lucide-react';
import { format } from 'date-fns';
import NewImportForm from './components/NewImportForm';

interface Shipment {
  id: string;
  referenceNumber: string;
  consignee: string;
  type: 'sea' | 'air';
  blNumber?: string;
  awbNumber?: string;
  status: string;
  eta?: string;
  completionDate?: string;
  lastUpdate: string;
  isLocked?: boolean;
}

interface ShipmentTableProps {
  shipments: Shipment[];
  isHistorical?: boolean;
}

const ImportClearancePage = () => {
  const router = useRouter();
  const [isNewImportOpen, setIsNewImportOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("active");
  const [isLoading, setIsLoading] = useState(true);
  const [shipments, setShipments] = useState<Shipment[]>([]);

  // Fetch shipments
  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const response = await fetch('/api/admin/import');
        if (!response.ok) throw new Error('Failed to fetch shipments');
        const data = await response.json();
        setShipments(data.data);
      } catch (error) {
        console.error('Error fetching shipments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShipments();
  }, []);

  const handleViewShipment = (id: string, isLocked: boolean) => {
    router.push(`/admin/import/${id}?locked=${isLocked}`);
  };

  // Status style helper
  const getStatusStyle = (status: string) => {
    const styles: { [key: string]: string } = {
      DOCUMENT_COLLECTION: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80',
      TAX_COMPUTATION: 'bg-purple-100 text-purple-800 hover:bg-purple-100/80',
      READY_FOR_E2M: 'bg-blue-100 text-blue-800 hover:bg-blue-100/80',
      LODGED_IN_E2M: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-100/80',
      PAYMENT_COMPLETED: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100/80',
      PORT_RELEASE: 'bg-orange-100 text-orange-800 hover:bg-orange-100/80',
      IN_TRANSIT: 'bg-cyan-100 text-cyan-800 hover:bg-cyan-100/80',
      DELIVERED: 'bg-green-100 text-green-800 hover:bg-green-100/80'
    };
    return styles[status] || 'bg-gray-100 text-gray-800 hover:bg-gray-100/80';
  };

  const ShipmentTable: React.FC<ShipmentTableProps> = ({ shipments, isHistorical = false }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Reference No.</TableHead>
          <TableHead>Consignee</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>{isHistorical ? 'Completion Date' : 'ETA'}</TableHead>
          <TableHead>Document No.</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Last Update</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {shipments.map((shipment) => (
          <TableRow key={shipment.id}>
            <TableCell className="font-medium">{shipment.referenceNumber}</TableCell>
            <TableCell>{shipment.consignee}</TableCell>
            <TableCell>
              {shipment.type === 'sea' ? (
                <div className="flex items-center">
                  <Ship className="w-4 h-4 mr-1" />
                  SEA
                </div>
              ) : (
                <div className="flex items-center">
                  <Plane className="w-4 h-4 mr-1" />
                  AIR
                </div>
              )}
            </TableCell>
            <TableCell>
              {format(
                new Date(isHistorical ? shipment.completionDate! : shipment.eta!),
                'MMM dd, yyyy'
              )}
            </TableCell>
            <TableCell>
              {shipment.type === 'sea' ? shipment.blNumber : shipment.awbNumber}
            </TableCell>
            <TableCell>
              <Badge 
                className={`${getStatusStyle(shipment.status)} border-none`}
                variant="outline"
              >
                {shipment.status.replace(/_/g, ' ')}
              </Badge>
            </TableCell>
            <TableCell>
              {format(new Date(shipment.lastUpdate), 'MMM dd, HH:mm')}
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewShipment(shipment.id, shipment.isLocked || false)}
                >
                  <FileText className="w-4 h-4 mr-1" />
                  View
                </Button>
                {shipment.isLocked && (
                  <Badge variant="secondary">
                    Locked
                  </Badge>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Import Clearance</h1>
        <Dialog open={isNewImportOpen} onOpenChange={setIsNewImportOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Import
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-5xl">
            <DialogHeader>
              <DialogTitle>Create New Import Clearance</DialogTitle>
            </DialogHeader>
            <NewImportForm onComplete={() => setIsNewImportOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="active">Active Shipments</TabsTrigger>
          <TabsTrigger value="history">Shipment History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Active Shipments</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div>Loading...</div>
              ) : (
                <ShipmentTable 
                  shipments={shipments.filter((s: Shipment) => s.status !== 'DELIVERED')} 
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Shipment History</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div>Loading...</div>
              ) : (
                <ShipmentTable 
                  shipments={shipments.filter((s: Shipment) => s.status === 'DELIVERED')}
                  isHistorical={true}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ImportClearancePage;