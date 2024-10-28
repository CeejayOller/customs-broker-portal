// src/app/(admin)/admin/import/components/NewImportForm.tsx
'use client';

import React, { useState } from 'react';
import { getNextReferenceNumber } from '@/lib/utils/reference-number';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Ship, Plane, Plus, Upload, FileText, X } from 'lucide-react';
import {
  type NewImportFormProps,
  type ShipmentForm,
  type ValidationErrors,
  type GoodsItem,
  MOCK_CLIENTS,
  MOCK_EXPORTERS,
  INCOTERMS,
} from '../types/import-form';

const ShipmentFormFields = ({ 
  formIndex,
  form,
  onChange,
  onGoodsChange,
  onGoodsRemove,
  onGoodsAdd,
  onDocumentUpload
}: {
  formIndex: number;
  form: ShipmentForm;
  onChange: (index: number, field: string, value: any) => void;
  onGoodsChange: (formIndex: number, goodsIndex: number, field: string, value: any) => void;
  onGoodsRemove: (formIndex: number, goodsIndex: number) => void;
  onGoodsAdd: (formIndex: number) => void;
  onDocumentUpload: (event: React.ChangeEvent<HTMLInputElement>, docType: string, formIndex: number) => void;
}) => {
  return (
    <div className="space-y-6 p-4 bg-gray-50 rounded-lg mt-4 max-w-7xl mx-auto">
      {/* Consignee Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-1 md:col-span-2">
          <Label>Consignee</Label>
          <Select 
            value={form.consigneeId}
            onValueChange={(value) => onChange(formIndex, 'consigneeId', value)}
          >
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
        <div>
          <Label>Exporter</Label>
          <Select 
            value={form.exporterId}
            onValueChange={(value) => {
              const exporter = MOCK_EXPORTERS.find(e => e.id === value);
              if (exporter) {
                onChange(formIndex, 'exporterId', value);
                onChange(formIndex, 'exporterAddress', exporter.address);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select exporter" />
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
            value={form.exporterAddress} 
            onChange={(e) => onChange(formIndex, 'exporterAddress', e.target.value)}
          />
        </div>
      </div>

      {/* Document Upload Section */}
      <div>
        <Label className="text-lg">Supporting Documents</Label>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {/* Commercial Invoice */}
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
                onChange={(e) => onDocumentUpload(e, 'invoice', formIndex)}
              />
            </div>
            {form.documents['invoice']?.map(doc => (
              <div key={doc} className="text-sm text-gray-600 mt-1 flex items-center">
                <FileText className="w-4 h-4 mr-1" />
                {doc}
              </div>
            ))}
          </div>
          
          {/* Packing List */}
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
                onChange={(e) => onDocumentUpload(e, 'packing', formIndex)}
              />
            </div>
            {form.documents['packing']?.map(doc => (
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
};

const NewImportForm = ({ onComplete }: NewImportFormProps) => {
  const [shipmentType, setShipmentType] = useState<'sea' | 'air'>('sea');
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [formErrors, setFormErrors] = useState<ValidationErrors>({});
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  // Form handlers
  const handleFormChange = (index: number, field: string, value: any) => {
    const updatedForms = [...forms];
    updatedForms[index] = {
      ...updatedForms[index],
      [field]: value,
    };
    setForms(updatedForms);
  };

  const handleGoodsChange = (formIndex: number, goodsIndex: number, field: string, value: any) => {
    const updatedForms = [...forms];
    updatedForms[formIndex].goods[goodsIndex] = {
      ...updatedForms[formIndex].goods[goodsIndex],
      [field]: value,
    };
    setForms(updatedForms);
  };

  const handleGoodsAdd = (formIndex: number) => {
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

  // Submission handlers
  const handleSubmit = async () => {
    const errors = validateForm(forms[0]);
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const { referenceNumber } = await getNextReferenceNumber(
        shipmentType === 'sea' ? 'IMS' : 'IMA'
      );

      setReferenceNumber(referenceNumber);
      setIsConfirmDialogOpen(true);
    } catch (error) {
      console.error('Error generating reference number:', error);
      setFormErrors({
        ...formErrors,
        submit: 'Failed to generate reference number. Please try again.',
      });
    }
  };

  const handleConfirmSubmit = async () => {
    try {
      setIsSubmitting(true);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setIsConfirmDialogOpen(false);
      onComplete();
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormErrors({
        ...formErrors,
        submit: 'Failed to submit form. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

return (
  <div className="w-full max-h-[80vh] overflow-y-auto">
    {/* Error Display */}
    {Object.keys(formErrors).length > 0 && (
      <div className="mb-4 p-4 border border-red-200 rounded bg-red-50">
        <h4 className="text-red-700 font-medium mb-2">Please fix the following errors:</h4>
        <ul className="list-disc pl-5 text-red-600">
          {Object.entries(formErrors).map(([key, value]) => (
            <li key={key}>{value || ''}</li>
          ))}
        </ul>
      </div>
    )}

    {/* Freight Type Tabs */}
    <Tabs value={shipmentType} onValueChange={(value) => setShipmentType(value as 'sea' | 'air')}>
      <TabsList className="w-full sm:w-auto">
        <TabsTrigger value="sea" className="flex-1 sm:flex-none">
          <Ship className="w-4 h-4 mr-2" />
          Sea Freight
        </TabsTrigger>
        <TabsTrigger value="air" className="flex-1 sm:flex-none">
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

    {/* Action Buttons */}
    <div className="mt-6 flex justify-end space-x-4">
      <Button variant="outline" onClick={onComplete}>Cancel</Button>
      <Button onClick={handleSubmitForm}>Create Shipment</Button>
    </div>

    {/* Confirmation Dialog */}
    <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm New Shipment</DialogTitle>
          <DialogDescription>
            Creating a new {shipmentType === 'sea' ? 'sea' : 'air'} freight shipment. Please confirm the details.
          </DialogDescription>
        </DialogHeader>

        <Alert>
          <AlertDescription>
            A reference number will be automatically generated upon confirmation.
            Format: CLEX-{shipmentType === 'sea' ? 'IMS' : 'IMA'}{new Date().getFullYear().toString().slice(-2)}-XXXX
          </AlertDescription>
        </Alert>

        <div className="mt-4">
          <h4 className="font-medium mb-2">Shipment Summary</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-gray-500">Type:</div>
            <div>{shipmentType === 'sea' ? 'Sea Freight' : 'Air Freight'}</div>
            <div className="text-gray-500">Consignee:</div>
            <div>{MOCK_CLIENTS.find(c => c.id === forms[0].consigneeId)?.name || 'Not selected'}</div>
            <div className="text-gray-500">Documents:</div>
            <div>{Object.keys(forms[0].documents).length} uploaded</div>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setIsConfirmDialogOpen(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Confirm & Create'}
          </Button>
        </DialogFooter>
    </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewImportForm;