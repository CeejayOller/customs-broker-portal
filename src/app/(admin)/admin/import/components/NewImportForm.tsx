// src/app/(admin)/admin/import/components/NewImportForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
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
  type PackageCode,
  type CustomEntity,  // Add this import
  MOCK_CLIENTS,
  MOCK_EXPORTERS,
  INCOTERMS,
  PACKAGE_CODES,
  REQUIRED_DOCUMENTS,
} from '../types/import-form';
import { EntityInput } from './EntityInput';

const ShipmentFormFields = ({ 
  formIndex,
  form,
  shipmentType,
  onChange,
  onGoodsChange,
  onGoodsRemove,
  onGoodsAdd,
  onDocumentUpload
}: {
  formIndex: number;
  form: ShipmentForm;
  shipmentType: 'sea' | 'air';
  onChange: (index: number, field: string, value: any) => void;
  onGoodsChange: (formIndex: number, goodsIndex: number, field: string, value: any) => void;
  onGoodsRemove: (formIndex: number, goodsIndex: number) => void;
  onGoodsAdd: (formIndex: number) => void;
  onDocumentUpload: (event: React.ChangeEvent<HTMLInputElement>, docType: string, formIndex: number) => void;
}) => {
  // Add the states for saved entries
  const [savedConsignees, setSavedConsignees] = useState<CustomEntity[]>([]);
  const [savedExporters, setSavedExporters] = useState<CustomEntity[]>([]);

  useEffect(() => {
    const loadSavedEntries = async () => {
      try {
        const [consigneesRes, exportersRes] = await Promise.all([
          fetch('/api/admin/saved-entries?type=consignee'),
          fetch('/api/admin/saved-entries?type=exporter')
        ]);

        const consignees = await consigneesRes.json();
        const exporters = await exportersRes.json();

        setSavedConsignees(consignees.data);
        setSavedExporters(exporters.data);
      } catch (error) {
        console.error('Error loading saved entries:', error);
      }
    };

    loadSavedEntries();
  }, []);

  return (
    <div className="space-y-6 p-4 bg-gray-50 rounded-lg mt-4">
      {/* Basic Details Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Consignee & Contact Person */}
        <div className="col-span-1 md:col-span-2 grid gap-6">
          <EntityInput
            type="consignee"
            value={form.customConsignee || { name: '', address: '', tin: '', brn: '' }}
            onChange={(value) => onChange(formIndex, 'customConsignee', value)}
            savedEntries={savedConsignees}
            onSelectSaved={(entry) => onChange(formIndex, 'customConsignee', entry)}
          />

          <EntityInput
            type="exporter"
            value={form.customExporter || { name: '', address: '' }}
            onChange={(value) => onChange(formIndex, 'customExporter', value)}
            savedEntries={savedExporters}
            onSelectSaved={(entry) => onChange(formIndex, 'customExporter', entry)}
          />
    </div>

        <div>
          <Label>Contact Person</Label>
          <Input 
            value={form.contactPerson}
            onChange={(e) => onChange(formIndex, 'contactPerson', e.target.value)}
            placeholder="Enter contact person"
          />
        </div>
        
<div>
  <Label>Exporter Address</Label>
  <Input 
    value={form.exporterAddress} 
    onChange={(e) => onChange(formIndex, 'exporterAddress', e.target.value)}
    placeholder="Enter exporter address"
    disabled // Make this read-only since it's populated from selection
  />
</div>

        {/* Origin & Destination */}
        <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Country of Export</Label>
            <Input 
              value={form.countryOfExport}
              onChange={(e) => onChange(formIndex, 'countryOfExport', e.target.value)}
              placeholder="Enter country of export"
            />
          </div>
          <div>
            <Label>Country of Origin</Label>
            <Input 
              value={form.countryOfOrigin}
              onChange={(e) => onChange(formIndex, 'countryOfOrigin', e.target.value)}
              placeholder="Enter country of origin"
            />
          </div>
          <div>
            <Label>Port of Origin</Label>
            <Input 
              value={form.portOfOrigin}
              onChange={(e) => onChange(formIndex, 'portOfOrigin', e.target.value)}
              placeholder="Enter port of origin"
            />
          </div>
        </div>

        <div>
          <Label>Port of Discharge</Label>
          <Input 
            value={form.portOfDischarge}
            onChange={(e) => onChange(formIndex, 'portOfDischarge', e.target.value)}
            placeholder="Enter port of discharge"
          />
        </div>

        <div>
          <Label>Terms of Delivery</Label>
          <Select 
            value={form.termsOfDelivery}
            onValueChange={(value) => onChange(formIndex, 'termsOfDelivery', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Incoterms" />
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

        {/* Shipment Type Specific Fields */}
        {shipmentType === 'sea' ? (
          <>
            <div>
              <Label>Bill of Lading No.</Label>
              <Input 
                value={form.blNumber}
                onChange={(e) => onChange(formIndex, 'blNumber', e.target.value)}
                placeholder="Enter B/L number"
              />
            </div>
            <div>
              <Label>Vessel Name</Label>
              <Input 
                value={form.vesselName}
                onChange={(e) => onChange(formIndex, 'vesselName', e.target.value)}
                placeholder="Enter vessel name"
              />
            </div>
            <div>
              <Label>Registry No.</Label>
              <Input 
                value={form.registryNo}
                onChange={(e) => onChange(formIndex, 'registryNo', e.target.value)}
                placeholder="Enter registry number"
              />
            </div>
            <div>
              <Label>Voyage No.</Label>
              <Input 
                value={form.voyageNo}
                onChange={(e) => onChange(formIndex, 'voyageNo', e.target.value)}
                placeholder="Enter voyage number"
              />
            </div>
            <div>
              <Label>Container No.</Label>
              <Input 
                value={form.containerNo}
                onChange={(e) => onChange(formIndex, 'containerNo', e.target.value)}
                placeholder="Enter container number"
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <Label>Airway Bill No.</Label>
              <Input 
                value={form.awbNumber}
                onChange={(e) => onChange(formIndex, 'awbNumber', e.target.value)}
                placeholder="Enter AWB number"
              />
            </div>
            <div>
              <Label>Aircraft Name</Label>
              <Input 
                value={form.aircraftName}
                onChange={(e) => onChange(formIndex, 'aircraftName', e.target.value)}
                placeholder="Enter aircraft name"
              />
            </div>
            <div>
              <Label>Flight No.</Label>
              <Input 
                value={form.flightNo}
                onChange={(e) => onChange(formIndex, 'flightNo', e.target.value)}
                placeholder="Enter flight number"
              />
            </div>
          </>
        )}

        {/* Common Additional Fields */}
        <div>
          <Label>Markings & Numbers</Label>
          <Input 
            value={form.markingsAndNumbers}
            onChange={(e) => onChange(formIndex, 'markingsAndNumbers', e.target.value)}
            placeholder="Enter markings and numbers"
          />
        </div>
        <div>
          <Label>Packaging Code</Label>
          <Select 
            value={form.packagingCode}
            onValueChange={(value) => onChange(formIndex, 'packagingCode', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select packaging code" />
            </SelectTrigger>
            <SelectContent>
            {PACKAGE_CODES.map((pkg: PackageCode) => (
              <SelectItem key={pkg.code} value={pkg.code}>
                {pkg.code} - {pkg.description}
              </SelectItem>
            ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Goods Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <Label className="text-lg">Goods Declaration</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onGoodsAdd(formIndex)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>
        
        <div className="overflow-x-auto">
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
              {form.goods.map((item, goodsIndex) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Input 
                      value={item.description}
                      onChange={(e) => onGoodsChange(formIndex, goodsIndex, 'description', e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      type="number"
                      value={item.invoiceValue}
                      onChange={(e) => onGoodsChange(formIndex, goodsIndex, 'invoiceValue', parseFloat(e.target.value))}
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      type="number"
                      value={item.grossWeight}
                      onChange={(e) => onGoodsChange(formIndex, goodsIndex, 'grossWeight', parseFloat(e.target.value))}
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      type="number"
                      value={item.netWeight}
                      onChange={(e) => onGoodsChange(formIndex, goodsIndex, 'netWeight', parseFloat(e.target.value))}
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      type="number"
                      value={item.quantity}
                      onChange={(e) => onGoodsChange(formIndex, goodsIndex, 'quantity', parseInt(e.target.value))}
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      value={item.hsCode}
                      onChange={(e) => onGoodsChange(formIndex, goodsIndex, 'hsCode', e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onGoodsRemove(formIndex, goodsIndex)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
    // Custom entry flags
    useCustomConsignee: false,
    useCustomExporter: false,
    customConsignee: undefined,
    customExporter: undefined,
    // Common fields
    consigneeId: '',
    contactPerson: '',
    exporterId: '',
    exporterAddress: '',
    portOfOrigin: '',
    countryOfExport: '',
    countryOfOrigin: '',
    portOfDischarge: '',
    termsOfDelivery: '',
    markingsAndNumbers: '',
    packagingCode: '',
    
    // Sea freight fields
    blNumber: '',
    isMultipleBL: false,
    vesselName: '',
    registryNo: '',
    voyageNo: '',
    containerNo: '',
    
    // Air freight fields
    awbNumber: '',
    aircraftName: '',
    flightNo: '',
    
    // Common arrays
    goods: [],
    documents: {},
  }]);

  // Add function to create a new empty form
  const createEmptyForm = (): ShipmentForm => ({
    id: Math.random().toString(),
    useCustomConsignee: false,
    useCustomExporter: false,
    customConsignee: undefined,
    customExporter: undefined,
    // Common fields
    consigneeId: '',
    contactPerson: '',
    exporterId: '',
    exporterAddress: '',
    portOfOrigin: '',
    countryOfExport: '',
    countryOfOrigin: '',
    portOfDischarge: '',
    termsOfDelivery: '',
    markingsAndNumbers: '',
    packagingCode: '',
    
    // Sea freight fields
    blNumber: '',
    isMultipleBL: false,
    vesselName: '',
    registryNo: '',
    voyageNo: '',
    containerNo: '',
    
    // Air freight fields
    awbNumber: '',
    aircraftName: '',
    flightNo: '',
    
    // Common arrays
    goods: [],
    documents: {},
  });

  // Update your "Add Another B/L" button handler
  const handleAddForm = () => {
    setForms(prev => [...prev, createEmptyForm()]);
  };


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
  const handleSubmitForm = async () => {
    const errors = validateForm(forms[0]);
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
  
    try {
      setIsSubmitting(true);
      
      const formData = forms[0];
      const response = await fetch('/api/admin/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shipmentType: shipmentType === 'sea' ? 'IMS' : 'IMA',
          formData: {
            consignee: formData.useCustomConsignee 
              ? formData.customConsignee
              : {
                  name: MOCK_CLIENTS.find(c => c.id === formData.consigneeId)?.name || '',
                  address: MOCK_CLIENTS.find(c => c.id === formData.consigneeId)?.address || '',
                  tin: '',
                  brn: '',
                },
            exporter: formData.useCustomExporter
              ? formData.customExporter
              : {
                  name: MOCK_EXPORTERS.find(e => e.id === formData.exporterId)?.name || '',
                  address: formData.exporterAddress,
                },
            shipmentDetails: {
              bl_number: formData.blNumber || '',
              vessel_name: formData.vesselName || '',
              flight_number: formData.flightNo || '',
              registry_number: formData.registryNo || '',
              voyage_number: formData.voyageNo || '',
              port_of_origin: formData.portOfOrigin,
              port_of_discharge: formData.portOfDischarge,
              eta: '',
              ata: '',
              description_of_goods: formData.goods.map(g => g.description).join(', '),
              volume: ''
            }
          }
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to create shipment');
      }
  
      const newShipment = await response.json();
      setReferenceNumber(newShipment.referenceNumber);
      setIsConfirmDialogOpen(true);
    } catch (error) {
      console.error('Error creating shipment:', error);
      setFormErrors({
        ...formErrors,
        submit: 'Failed to create shipment. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
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

  const handleGoodsRemove = (formIndex: number, goodsIndex: number) => {
    const updatedForms = [...forms];
    updatedForms[formIndex].goods.splice(goodsIndex, 1);
    setForms(updatedForms);
  };

  const validateForm = (form: ShipmentForm): ValidationErrors => {
    const errors: ValidationErrors = {};
    
    // Common validations
    if (!form.consigneeId) errors.consignee = 'Please select a consignee';
    if (!form.contactPerson) errors.contactPerson = 'Contact person is required';
    if (!form.exporterId) errors.exporter = 'Please select an exporter';
    if (!form.exporterAddress) errors.exporterAddress = 'Exporter address is required';
    if (!form.portOfOrigin && !form.countryOfExport && !form.countryOfOrigin) {
      errors.origin = 'Either port of origin, country of export, or country of origin is required';
    }
    if (!form.portOfDischarge) errors.portOfDischarge = 'Port of discharge is required';
    if (!form.termsOfDelivery) errors.termsOfDelivery = 'Terms of delivery is required';
    if (!form.packagingCode) errors.packagingCode = 'Packaging code is required';
  
    // Shipment type specific validations
    if (shipmentType === 'sea') {
      if (!form.blNumber) errors.blNumber = 'Bill of Lading number is required';
      if (!form.vesselName) errors.vesselName = 'Vessel name is required';
      if (!form.registryNo) errors.registryNo = 'Registry number is required';
      if (!form.voyageNo) errors.voyageNo = 'Voyage number is required';
    } else {
      if (!form.awbNumber) errors.awbNumber = 'Airway Bill number is required';
      if (!form.aircraftName) errors.aircraftName = 'Aircraft name is required';
      if (!form.flightNo) errors.flightNo = 'Flight number is required';
    }
  
    // Validate goods if needed
    if (form.goods.length === 0) {
      errors.goods = 'At least one item must be added';
    }
      
    return errors;
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
<Tabs 
  value={shipmentType} 
  onValueChange={(value) => setShipmentType(value as 'sea' | 'air')}
  className="space-y-4"
>
  <div className="border-b">
    <TabsList className="w-full sm:w-auto">
      <TabsTrigger 
        value="sea" 
        className="flex-1 sm:flex-none data-[state=active]:border-primary"
      >
        <Ship className="w-4 h-4 mr-2" />
        Sea Freight
      </TabsTrigger>
      <TabsTrigger 
        value="air" 
        className="flex-1 sm:flex-none data-[state=active]:border-primary"
      >
        <Plane className="w-4 h-4 mr-2" />
        Air Freight
      </TabsTrigger>
    </TabsList>
  </div>

  <TabsContent value="sea" className="space-y-4">
  {forms.map((form, index) => (
    <ShipmentFormFields 
      key={form.id}
      formIndex={index}
      form={form}
      shipmentType="sea"
      onChange={handleFormChange}
      onGoodsChange={handleGoodsChange}
      onGoodsRemove={handleGoodsRemove}
      onGoodsAdd={handleGoodsAdd}
      onDocumentUpload={handleDocumentUpload}
    />
  ))}

  </TabsContent>

  <TabsContent value="air" className="space-y-4">
  <ShipmentFormFields 
    formIndex={0}
    form={forms[0]}
    shipmentType="air"
    onChange={handleFormChange}
    onGoodsChange={handleGoodsChange}
    onGoodsRemove={handleGoodsRemove}
    onGoodsAdd={handleGoodsAdd}
    onDocumentUpload={handleDocumentUpload}
  />
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