'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';  // Changed from next/router
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  consignee: string;
  type: 'sea' | 'air';
  blNumber?: string;
  awbNumber?: string;
  status: string;
  eta?: string;
  completionDate?: string;
  lastUpdate: string;
}

interface ShipmentTableProps {
  shipments: Shipment[];
  isHistorical?: boolean;
}

// Mock data with proper typing
const MOCK_ACTIVE_SHIPMENTS: Shipment[] = [
  {
    id: '1',
    consignee: 'ABC Company',
    type: 'sea',
    blNumber: 'BL123456',
    status: 'DOCUMENT_COLLECTION',
    eta: '2024-11-01',
    lastUpdate: '2024-10-26T10:30:00',
  },
  {
    id: '2',
    consignee: 'XYZ Corp',
    type: 'air',
    awbNumber: 'AWB789012',
    status: 'TAX_COMPUTATION',
    eta: '2024-10-29',
    lastUpdate: '2024-10-26T09:15:00',
  },
];

const MOCK_HISTORICAL_SHIPMENTS: Shipment[] = [
  {
    id: '3',
    consignee: 'DEF Industries',
    type: 'sea',
    blNumber: 'BL654321',
    status: 'DELIVERED',
    completionDate: '2024-10-20',
    lastUpdate: '2024-10-20T15:45:00',
  },
];

const ImportClearancePage = () => {
  const router = useRouter();
  const [isNewImportOpen, setIsNewImportOpen] = useState(false);

  const handleViewShipment = (id: string) => {
    router.push(`/admin/import/${id}`);
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
            <TableCell className="font-medium">{shipment.id}</TableCell>
            <TableCell>{shipment.consignee}</TableCell>
            <TableCell>
              {shipment.type === 'sea' ? (
                <Ship className="w-4 h-4 inline mr-1" />
              ) : (
                <Plane className="w-4 h-4 inline mr-1" />
              )}
              {shipment.type.toUpperCase()}
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
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                ${shipment.status === 'DELIVERED' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`
              }>
                {shipment.status.replace(/_/g, ' ')}
              </span>
            </TableCell>
            <TableCell>
              {format(new Date(shipment.lastUpdate), 'MMM dd, HH:mm')}
            </TableCell>
            <TableCell>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleViewShipment(shipment.id)}
              >
                <FileText className="w-4 h-4 mr-1" />
                View
              </Button>
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
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Create New Import Clearance</DialogTitle>
            </DialogHeader>
            <NewImportForm onComplete={() => setIsNewImportOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">Active Shipments</TabsTrigger>
          <TabsTrigger value="history">Shipment History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Active Shipments</CardTitle>
            </CardHeader>
            <CardContent>
              <ShipmentTable shipments={MOCK_ACTIVE_SHIPMENTS} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Shipment History</CardTitle>
            </CardHeader>
            <CardContent>
              <ShipmentTable 
                shipments={MOCK_HISTORICAL_SHIPMENTS} 
                isHistorical={true}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ImportClearancePage;