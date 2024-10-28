import React, { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/router';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { 
  Ship, 
  Plane, 
  Package, 
  Upload as UploadIcon,
  Plus,
  FileText
} from 'lucide-react';

interface Client {
  id: number;
  name: string;
  contact: string;
}

interface Exporter {
  id: number;
  name: string;
  address: string;
}

interface UploadedDocs {
  [key: string]: string[];
}

interface BlForm {
  id: number;
}

type ShipmentType = 'sea' | 'air';

// Mock data
const MOCK_CLIENTS: Client[] = [
  { id: 1, name: 'ABC Company', contact: 'John Doe' },
  { id: 2, name: 'XYZ Corp', contact: 'Jane Smith' },
];

const MOCK_EXPORTERS: Exporter[] = [
  { id: 1, name: 'Supplier Co Ltd', address: '123 Export St, China' },
  { id: 2, name: 'Global Trade Inc', address: '456 Trade Ave, Singapore' },
];

const INCOTERMS: string[] = [
  'FOB', 'CIF', 'CFR', 'EXW', 'DDP', 'DAP'
];

const ImportClearancePage: React.FC = () => {
  const router = useRouter();
  const [shipmentType, setShipmentType] = useState<ShipmentType>('sea');
  const [selectedClient, setSelectedClient] = useState<number | null>(null);
  const [blForms, setBlForms] = useState<BlForm[]>([{ id: 1 }]);
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDocs>({});

  const handleDocumentUpload = (event: ChangeEvent<HTMLInputElement>, docType: string) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedDocs(prev => ({
        ...prev,
        [docType]: [...(prev[docType] || []), file.name]
      }));
    }
  };

  const ShipmentForm: React.FC<{ formId: number }> = ({ formId }) => (
    <div className="space-y-6 p-6 bg-gray-50 rounded-lg mt-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Client Selection */}
        <div className="col-span-2">
          <Label>Consignee</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select client" />
            </SelectTrigger>
            <SelectContent>
              {MOCK_CLIENTS.map(client => (
                <SelectItem key={client.id} value={client.id.toString()}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Exporter Details */}
        <div>
          <Label>Exporter Name</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select or enter exporter" />
            </SelectTrigger>
            <SelectContent>
              {MOCK_EXPORTERS.map(exporter => (
                <SelectItem key={exporter.id} value={exporter.id.toString()}>
                  {exporter.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Exporter Address</Label>
          <Input placeholder="Exporter address will auto-fill" />
        </div>

        {/* Shipment Type Specific Fields */}
        {shipmentType === 'sea' ? (
          <>
            <div>
              <Label>Bill of Lading No.</Label>
              <Input placeholder="Enter B/L number" />
            </div>
            <div>
              <Label>Vessel Name</Label>
              <Input placeholder="Enter vessel name" />
            </div>
            <div>
              <Label>Container No.</Label>
              <Input placeholder="Enter container number" />
            </div>
          </>
        ) : (
          <>
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
          </>
        )}

        {/* Common Fields */}
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
      </div>

      {/* Goods Declaration */}
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-4">Goods Declaration</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Description</th>
                <th className="p-2 text-left">Invoice Value (USD)</th>
                <th className="p-2 text-left">Gross Weight</th>
                <th className="p-2 text-left">Net Weight</th>
                <th className="p-2 text-left">Quantity</th>
                <th className="p-2 text-left">HS Code</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2"><Input placeholder="Description" /></td>
                <td className="p-2"><Input type="number" placeholder="0.00" /></td>
                <td className="p-2"><Input type="number" placeholder="0.00" /></td>
                <td className="p-2"><Input type="number" placeholder="0.00" /></td>
                <td className="p-2"><Input type="number" placeholder="0" /></td>
                <td className="p-2"><Input placeholder="Auto-detect" /></td>
                <td className="p-2">
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Document Upload */}
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-4">Supporting Documents</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Commercial Invoice</Label>
            <div className="mt-2">
              <Button variant="outline" className="w-full" onClick={() => document.getElementById(`invoice-upload-${formId}`)?.click()}>
                <UploadIcon className="w-4 h-4 mr-2" />
                Upload Invoice
              </Button>
              <input
                id={`invoice-upload-${formId}`}
                type="file"
                className="hidden"
                onChange={(e) => handleDocumentUpload(e, 'invoice')}
              />
            </div>
            {uploadedDocs['invoice']?.map((doc: string) => (
              <div key={doc} className="text-sm text-gray-600 mt-1 flex items-center">
                <FileText className="w-4 h-4 mr-1" />
                {doc}
              </div>
            ))}
          </div>
          <div>
            <Label>Packing List</Label>
            <div className="mt-2">
              <Button variant="outline" className="w-full" onClick={() => document.getElementById(`packing-upload-${formId}`)?.click()}>
                <UploadIcon className="w-4 h-4 mr-2" />
                Upload Packing List
              </Button>
              <input
                id={`packing-upload-${formId}`}
                type="file"
                className="hidden"
                onChange={(e) => handleDocumentUpload(e, 'packing')}
              />
            </div>
            {uploadedDocs['packing']?.map((doc: string) => (
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
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Import Clearance</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="sea" onValueChange={(value) => setShipmentType(value as ShipmentType)}>
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
              {blForms.map(form => (
                <ShipmentForm key={form.id} formId={form.id} />
              ))}
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setBlForms(prev => [...prev, { id: prev.length + 1 }])}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Another B/L
              </Button>
            </TabsContent>

            <TabsContent value="air">
              <ShipmentForm formId={1} />
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex justify-end space-x-4">
            <Button variant="outline">Cancel</Button>
            <Button>Create Import Clearance</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImportClearancePage;