'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Ship, Plane, Plus, Upload, FileText, X } from 'lucide-react';

interface NewImportFormProps {
  onComplete: () => void;
}

interface Client {
  id: string;
  name: string;
  contactPerson: string;
}

interface Exporter {
  id: string;
  name: string;
  address: string;
}

interface GoodsItem {
  id: string;
  description: string;
  invoiceValue: number;
  grossWeight: number;
  netWeight: number;
  quantity: number;
  hsCode: string;
}

interface ShipmentForm {
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

const MOCK_CLIENTS: Client[] = [
  { id: '1', name: 'ABC Company', contactPerson: 'John Doe' },
  { id: '2', name: 'XYZ Corp', contactPerson: 'Jane Smith' },
];

const MOCK_EXPORTERS: Exporter[] = [
  { id: '1', name: 'Global Supply Co', address: '123 Export St, Shanghai, China' },
  { id: '2', name: 'Trade Partners Ltd', address: '456 Trade Ave, Singapore' },
];

const INCOTERMS = [
  'FOB', 'CIF', 'CFR', 'EXW', 'DDP', 'DAP'
];

const NewImportForm: React.FC<NewImportFormProps> = ({ onComplete }) => {
  const [shipmentType, setShipmentType] = useState<'sea' | 'air'>('sea');
  const [forms, setForms] = useState<ShipmentForm[]>([{
    id: '1',
    consigneeId: '',
    exporterId: '',
    exporterAddress: '',
    portOfOrigin: '',
    portOfDischarge: '',
    termsOfDelivery: '',
    markingsAndNumbers: '',
    packagingCode: '',
    goods: [],
    documents: {},
  }]);

  const handleExporterChange = (exporterId: string, formIndex: number) => {
    const exporter = MOCK_EXPORTERS.find(e => e.id === exporterId);
    if (exporter) {
      const updatedForms = [...forms];
      updatedForms[formIndex] = {
        ...updatedForms[formIndex],
        exporterId,
        exporterAddress: exporter.address,
      };
      setForms(updatedForms);
    }
  };

  const handleAddGoods = (formIndex: number) => {
    const updatedForms = [...forms];
    updatedForms[formIndex].goods.push({
      id: Math.random().toString(),
      description: '',
      invoiceValue: 0,
      grossWeight: 0,
      netWeight: 0,
      quantity: 0,
      hsCode: '',
    });
    setForms(updatedForms);
  };

  const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>, docType: string, formIndex: number) => {
    const file = event.target.files?.[0];
    if (file) {
      const updatedForms = [...forms];
      const currentDocs = updatedForms[formIndex].documents[docType] || [];
      updatedForms[formIndex].documents = {
        ...updatedForms[formIndex].documents,
        [docType]: [...currentDocs, file.name],
      };
      setForms(updatedForms);
    }
  };

  const ShipmentFormFields: React.FC<{ formIndex: number }> = ({ formIndex }) => (
    <div className="space-y-6 p-4 bg-gray-50 rounded-lg mt-4">
      {/* Consignee Selection */}
      <div>
        <Label>Consignee</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select consignee" />
          </SelectTrigger>
          <SelectContent>
            {MOCK_CLIENTS.map(client => (
              <SelectItem key={client.id} value={client.id}>
                {client.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Exporter Details */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Exporter</Label>
          <Select onValueChange={(value) => handleExporterChange(value, formIndex)}>
            <SelectTrigger>
              <SelectValue placeholder="Select or enter exporter" />
            </SelectTrigger>
            <SelectContent>
              {MOCK_EXPORTERS.map(exporter => (
                <SelectItem key={exporter.id} value={exporter.id}>
                  {exporter.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Exporter Address</Label>
          <Input 
            value={forms[formIndex].exporterAddress} 
            onChange={(e) => {
              const updatedForms = [...forms];
              updatedForms[formIndex].exporterAddress = e.target.value;
              setForms(updatedForms);
            }}
          />
        </div>
      </div>

      {/* Shipment Type Specific Fields */}
      {shipmentType === 'sea' ? (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Bill of Lading No.</Label>
            <Input placeholder="Enter B/L number" />
          </div>
          <div>
            <Label>Vessel Name</Label>
            <Input placeholder="Enter vessel name" />
          </div>
          <div>
            <Label>Registry No.</Label>
            <Input placeholder="Enter registry number" />
          </div>
          <div>
            <Label>Voyage No.</Label>
            <Input placeholder="Enter voyage number" />
          </div>
          <div>
            <Label>Container No.</Label>
            <Input placeholder="Enter container number" />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Airway Bill No.</Label>
            <Input placeholder="Enter AWB number" />
          </div>
          <div>
            <Label>Aircraft Name</Label>
            <Input placeholder="Enter aircraft name" />
          </div>
          <div>
            <Label>Flight No.</Label>
            <Input placeholder="Enter flight number" />
          </div>
        </div>
      )}

      {/* Common Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Port of Origin</Label>
          <Input placeholder="Enter port of origin" />
        </div>
        <div>
          <Label>Port of Discharge</Label>
          <Input placeholder="Enter port of discharge" />
        </div>
        <div>
          <Label>Terms of Delivery</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select incoterm" />
            </SelectTrigger>
            <SelectContent>
              {INCOTERMS.map(term => (
                <SelectItem key={term} value={term}>
                  {term}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Packaging Code</Label>
          <Input placeholder="Enter packaging code" />
        </div>
      </div>

      {/* Goods Declaration */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <Label className="text-lg">Goods Declaration</Label>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleAddGoods(formIndex)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Invoice Value (USD)</TableHead>
              <TableHead>Gross Weight</TableHead>
              <TableHead>Net Weight</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>HS Code</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {forms[formIndex].goods.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell><Input placeholder="Description" /></TableCell>
                <TableCell><Input type="number" placeholder="0.00" /></TableCell>
                <TableCell><Input type="number" placeholder="0.00" /></TableCell>
                <TableCell><Input type="number" placeholder="0.00" /></TableCell>
                <TableCell><Input type="number" placeholder="0" /></TableCell>
                <TableCell><Input placeholder="Auto-detect" /></TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-red-500"
                    onClick={() => {
                      const updatedForms = [...forms];
                      updatedForms[formIndex].goods.splice(index, 1);
                      setForms(updatedForms);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Document Upload */}
      <div>
        <Label className="text-lg">Supporting Documents</Label>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <Label>Commercial Invoice</Label>
            <div className="mt-2">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => document.getElementById(`invoice-upload-${formIndex}`)?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Invoice
              </Button>
              <input
                id={`invoice-upload-${formIndex}`}
                type="file"
                className="hidden"
                onChange={(e) => handleDocumentUpload(e, 'invoice', formIndex)}
              />
            </div>
            {forms[formIndex].documents['invoice']?.map(doc => (
              <div key={doc} className="text-sm text-gray-600 mt-1 flex items-center">
                <FileText className="w-4 h-4 mr-1" />
                {doc}
              </div>
            ))}
          </div>
          <div>
            <Label>Packing List</Label>
            <div className="mt-2">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => document.getElementById(`packing-upload-${formIndex}`)?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Packing List
              </Button>
              <input
                id={`packing-upload-${formIndex}`}
                type="file"
                className="hidden"
                onChange={(e) => handleDocumentUpload(e, 'packing', formIndex)}
              />
            </div>
            {forms[formIndex].documents['packing']?.map(doc => (
              <div key={doc} className="text-sm text-gray-600 mt-1 flex items-center">
                <FileText className="w-4 h-4 mr-1" />
                {doc}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4">
      <Tabs value={shipmentType} onValueChange={(value) => setShipmentType(value as 'sea' | 'air')}>
        <TabsList>
          <TabsTrigger value="sea">
            <Ship className="w-4 h-4 mr-2" />
            Sea Freight
          </TabsTrigger>
          <TabsTrigger value="air">
            <Plane className="w-4 h-4 mr-2" />
            Air Freight
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sea">
          {forms.map((form, index) => (
            <ShipmentFormFields key={form.id} formIndex={index} />
          ))}
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => setForms(prev => [...prev, {
              id: Math.random().toString(),
              consigneeId: '',
              exporterId: '',
              exporterAddress: '',
              portOfOrigin: '',
              portOfDischarge: '',
              termsOfDelivery: '',
              markingsAndNumbers: '',
              packagingCode: '',
              goods: [],
              documents: {},
            }])}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Another B/L
          </Button>
        </TabsContent>

        <TabsContent value="air">
          <ShipmentFormFields formIndex={0} />
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex justify-end space-x-4">
        <Button variant="outline" onClick={onComplete}>Cancel</Button>
        <Button onClick={onComplete}>Create Shipment</Button>
      </div>
    </div>
  );
};

export default NewImportForm;