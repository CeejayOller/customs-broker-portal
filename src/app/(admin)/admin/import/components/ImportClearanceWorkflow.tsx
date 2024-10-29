// src/app/(admin)/admin/import/components/ImportClearanceWorkflow.tsx
// 1. Import and Components Setup
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Edit } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

// Import types and constants
import { WORKFLOW_STATES, REQUIRED_DOCUMENTS } from '../constants/workflow-states';
import type { ShipmentData, WorkflowStageStatus, ReferenceNumberResponse } from '../types/workflow';
import type { ImportTransactionType } from '@/lib/utils/reference-number';

// State interfaces for the component
interface WorkflowState {
  currentState: keyof typeof WORKFLOW_STATES;
  showConfirmDialog: boolean;
  showUploadDialog: boolean;
  selectedDocument: string | null;
  isLoading: boolean;
  freightType: ImportTransactionType;
}

const ImportClearanceWorkflow: React.FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  // Component states
  const [state, setState] = useState<WorkflowState>({
    currentState: 'CLIENT_DETAILS',
    showConfirmDialog: false,
    showUploadDialog: false,
    selectedDocument: null,
    isLoading: true,
    freightType: 'IMS'
  });

  // Shipment data state
  const [shipmentData, setShipmentData] = useState<ShipmentData>({
    id: '',
    referenceNumber: '',
    consignee: {
      name: '',
      address: '',
      tin: '',
      brn: ''
    },
    exporter: {
      name: '',
      address: ''
    },
    shipmentDetails: {
      bl_number: '',
      vessel_name: '',
      flight_number: '',
      registry_number: '',
      voyage_number: '',
      port_of_origin: '',
      port_of_discharge: '',
      eta: '',
      ata: '',
      description_of_goods: '',
      volume: ''
    },
    documents: REQUIRED_DOCUMENTS.map(doc => ({
      name: doc.name,
      status: 'not_uploaded',
      isVerified: false,
      isRequired: doc.isRequired
    })),
    computations: {
      dutiable_value: 0,
      customs_duty: 0,
      vat: 0,
      other_charges: 0,
      total_payable: 0
    },
    timeline: [],
    notes: []
  });

  // 2. Utility Functions and Event Handlers
  // Reference number generation
  const generateReferenceNumber = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      const response = await fetch('/api/admin/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shipmentType: state.freightType,
          formData: {
            consignee: {},
            exporter: {},
            shipmentDetails: {},
            documents: REQUIRED_DOCUMENTS.map(doc => ({
              name: doc.name,
              status: 'not_uploaded',
              isVerified: false,
              isRequired: doc.isRequired
            }))
          }
        }),
      });

      if (!response.ok) throw new Error('Failed to create shipment');

      const data = await response.json();
      setShipmentData(data);
    } catch (error) {
      console.error('Error creating shipment:', error);
      toast({
        title: 'Error',
        description: 'Failed to create shipment',
        variant: 'destructive',
      });
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // function to update shipment
  const updateShipment = async (updates: Partial<ShipmentData>) => {
    try {
      if (!shipmentData?.id) return;

      const response = await fetch(`/api/admin/import/${shipmentData.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...updates,
          currentStage: state.currentState,
        }),
      });

      if (!response.ok) throw new Error('Failed to update shipment');

      const updatedShipment = await response.json();
      setShipmentData(updatedShipment);
      
      toast({
        title: 'Success',
        description: 'Shipment updated successfully',
      });
    } catch (error) {
      console.error('Error updating shipment:', error);
      toast({
        title: 'Error',
        description: 'Failed to update shipment',
        variant: 'destructive',
      });
    }
  };

  // Freight type handler
  const handleFreightTypeChange = (freightType: ImportTransactionType) => {
    setState(prev => ({ ...prev, freightType }));
    generateReferenceNumber();
  };

  // Stage status helper
  const getStageStatus = (stage: keyof typeof WORKFLOW_STATES): WorkflowStageStatus => {
    const timeline = shipmentData.timeline.find(t => t.stage === stage);
    return timeline?.status || 'pending';
  };

  // Stage completion handler to use API
  const handleStageCompletion = async () => {
    try {
      await updateShipment({
        timeline: [
          ...shipmentData.timeline,
          {
            stage: state.currentState,
            status: 'complete',
            timestamp: new Date().toISOString()
          }
        ]
      });

      const states = Object.keys(WORKFLOW_STATES) as Array<keyof typeof WORKFLOW_STATES>;
      const currentIndex = states.indexOf(state.currentState);
      if (currentIndex < states.length - 1) {
        setState(prev => ({
          ...prev,
          currentState: states[currentIndex + 1],
          showConfirmDialog: false
        }));
      }
    } catch (error) {
      console.error('Error completing stage:', error);
      toast({
        title: 'Error',
        description: 'Failed to complete stage',
        variant: 'destructive',
      });
    }
  };

  // Document Upload Handler
  const handleDocumentUpload = async (file: File, documentType: string) => {
    try {
      if (!shipmentData?.id) return;

      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentType', documentType);
      formData.append('shipmentId', shipmentData.id);

      const response = await fetch('/api/admin/import/documents/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload document');

      const result = await response.json();
      
      // Update local state
      const docIndex = shipmentData.documents.findIndex(d => d.name === documentType);
      if (docIndex !== -1) {
        const updatedDocs = [...shipmentData.documents];
        updatedDocs[docIndex] = {
          ...updatedDocs[docIndex],
          status: 'draft',
          url: result.fileUrl,
        };

        await updateShipment({ documents: updatedDocs });
      }

      toast({
        title: 'Success',
        description: 'Document uploaded successfully',
      });
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload document',
        variant: 'destructive',
      });
    }
  };

  // 3. Effects
  // Generate reference number on mount
  useEffect(() => {
    if (!shipmentData.referenceNumber) {
      generateReferenceNumber();
    }
  }, []);

  // 4. Header Component
const ShipmentHeader: React.FC = () => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {shipmentData.referenceNumber || 'Loading...'}
        </h2>
        <div className="flex gap-2">
          <Button
            variant={state.freightType === 'IMS' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleFreightTypeChange('IMS')}
            disabled={!!shipmentData.referenceNumber}
          >
            Sea Freight
          </Button>
          <Button
            variant={state.freightType === 'IMA' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleFreightTypeChange('IMA')}
            disabled={!!shipmentData.referenceNumber}
          >
            Air Freight
          </Button>
        </div>
      </div>
    </div>
  );
};

// 5. Card Components
const ShipmentDetailsCard: React.FC = () => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-medium">Shipment Details</h3>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Edit className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-sm space-y-1">
          <p>
            <span className="font-medium">
              {state.freightType === 'IMS' ? 'BL Number:' : 'AWB Number:'}
            </span> {shipmentData.shipmentDetails.bl_number}
          </p>
          {state.freightType === 'IMS' ? (
            <>
              <p><span className="font-medium">Vessel:</span> {shipmentData.shipmentDetails.vessel_name}</p>
              <p><span className="font-medium">Voyage No:</span> {shipmentData.shipmentDetails.voyage_number}</p>
              <p><span className="font-medium">Registry No:</span> {shipmentData.shipmentDetails.registry_number}</p>
            </>
          ) : (
            <p><span className="font-medium">Flight Number:</span> {shipmentData.shipmentDetails.flight_number}</p>
          )}
          <p><span className="font-medium">Port of Origin:</span> {shipmentData.shipmentDetails.port_of_origin}</p>
          <p><span className="font-medium">Port of Discharge:</span> {shipmentData.shipmentDetails.port_of_discharge}</p>
          <p><span className="font-medium">ETA:</span> {shipmentData.shipmentDetails.eta}</p>
          <p><span className="font-medium">ATA:</span> {shipmentData.shipmentDetails.ata}</p>
        </div>
      </CardContent>
    </Card>
  );
};

const ConsigneeCard: React.FC = () => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-medium">Consignee Details</h3>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Edit className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-sm space-y-1">
          <p><span className="font-medium">Name:</span> {shipmentData.consignee.name}</p>
          <p><span className="font-medium">Address:</span> {shipmentData.consignee.address}</p>
          <p><span className="font-medium">TIN:</span> {shipmentData.consignee.tin}</p>
          <p><span className="font-medium">BRN:</span> {shipmentData.consignee.brn}</p>
        </div>
        <div className="mt-4">
          <h4 className="font-medium mb-2">Exporter Details</h4>
          <div className="text-sm space-y-1">
            <p><span className="font-medium">Name:</span> {shipmentData.exporter.name}</p>
            <p><span className="font-medium">Address:</span> {shipmentData.exporter.address}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const CargoDetailsCard: React.FC = () => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-medium">Cargo Details</h3>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Edit className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-sm space-y-1">
          <p><span className="font-medium">Description:</span></p>
          <p className="text-gray-600">{shipmentData.shipmentDetails.description_of_goods}</p>
          <p><span className="font-medium">Volume:</span> {shipmentData.shipmentDetails.volume}</p>
        </div>
      </CardContent>
    </Card>
  );
};

// 6. Timeline Component
const WorkflowTimeline: React.FC = () => {
  const states = Object.entries(WORKFLOW_STATES);
  const currentIndex = states.findIndex(([key]) => key === state.currentState);

  return (
    <div className="relative mt-8">
      <div className="absolute left-0 w-full h-1 bg-gray-200 top-5" />
      <div className="relative flex justify-between">
        {states.map(([key, stageInfo], index) => {
          const StateIcon = stageInfo.icon;
          const isActive = index <= currentIndex;
          const isCurrent = key === state.currentState;
          const stageStatus = getStageStatus(key as keyof typeof WORKFLOW_STATES);
          
          const getIconColor = () => {
            if (!isActive) return 'bg-gray-200 text-gray-400';
            if (stageStatus === 'complete') return `${stageInfo.bgColor} ${stageInfo.color}`;
            if (stageStatus === 'partial') return 'bg-yellow-100 text-yellow-500';
            return `${stageInfo.bgColor} ${stageInfo.color}`;
          };

          return (
            <div key={key} className="flex flex-col items-center relative group">
              <div
                className={`z-10 flex items-center justify-center w-10 h-10 rounded-full 
                  ${getIconColor()}
                  ${isCurrent ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
              >
                <StateIcon className="w-5 h-5" />
              </div>
              <span className={`mt-2 text-sm font-medium 
                ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                {stageInfo.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 7. Dialog Components
const ConfirmationDialog: React.FC = () => {
  return (
    <Dialog 
      open={state.showConfirmDialog} 
      onOpenChange={(open) => setState(prev => ({ ...prev, showConfirmDialog: open }))}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Stage Completion</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>Are you sure you want to complete this stage?</p>
          <p className="text-sm text-gray-500 mt-2">
            This action cannot be undone for fully completed stages.
          </p>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setState(prev => ({ ...prev, showConfirmDialog: false }))}
          >
            Cancel
          </Button>
          <Button
            onClick={handleStageCompletion}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const DocumentUploadDialog: React.FC = () => {
  const [uploadType, setUploadType] = useState<'draft' | 'final'>('draft');
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file || !state.selectedDocument) return;
    
    await handleDocumentUpload(file, state.selectedDocument);
    setState(prev => ({ ...prev, showUploadDialog: false, selectedDocument: null }));
    setFile(null);
  };

  return (
    <Dialog 
      open={state.showUploadDialog} 
      onOpenChange={(open) => setState(prev => ({ ...prev, showUploadDialog: open }))}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Document Type</h4>
            <p className="text-sm text-gray-500">{state.selectedDocument}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Document Status</h4>
            <div className="flex gap-4">
              <Button
                variant={uploadType === 'draft' ? 'default' : 'outline'}
                onClick={() => setUploadType('draft')}
              >
                Draft
              </Button>
              <Button
                variant={uploadType === 'final' ? 'default' : 'outline'}
                onClick={() => setUploadType('final')}
              >
                Final
              </Button>
            </div>
          </div>
          <div>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full"
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setState(prev => ({ ...prev, showUploadDialog: false }))}
          >
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={!file}>
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// 8. Main Render Function
return (
  <div className="p-6">
    {state.isLoading ? (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">Generating reference number...</p>
        </div>
      </div>
    ) : (
      <>
        <ShipmentHeader />
        
        <div className="grid grid-cols-3 gap-4">
          <ShipmentDetailsCard />
          <ConsigneeCard />
          <CargoDetailsCard />
        </div>

        <WorkflowTimeline />

        {/* Current Stage Content */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{WORKFLOW_STATES[state.currentState].label}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {state.currentState === 'CLIENT_DETAILS' && (
                <div>
                  {/* Client details stage content */}
                  <Button
                    onClick={() => setState(prev => ({ ...prev, showConfirmDialog: true }))}
                    disabled={!shipmentData.consignee.name} // Add more validation as needed
                  >
                    Confirm Details
                  </Button>
                </div>
              )}

              {state.currentState === 'DOCUMENT_COLLECTION' && (
                <div className="space-y-4">
                  {shipmentData.documents.map((doc) => (
                    <div 
                      key={doc.name}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          doc.status === 'not_uploaded' ? 'bg-gray-400' :
                          doc.status === 'draft' ? 'bg-yellow-400' :
                          doc.isVerified ? 'bg-green-400' : 'bg-orange-400'
                        }`} />
                        <span>{doc.name}</span>
                        {doc.isRequired && (
                          <span className="text-xs text-red-500">Required</span>
                        )}
                      </div>
                      {doc.status === 'not_uploaded' ? (
                        <Button
                          size="sm"
                          onClick={() => setState(prev => ({
                            ...prev,
                            showUploadDialog: true,
                            selectedDocument: doc.name
                          }))}
                        >
                          Upload
                        </Button>
                      ) : !doc.isVerified ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {/* Handle verification */}}
                        >
                          Verify
                        </Button>
                      ) : (
                        <span className="text-green-500 text-sm">Verified</span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Add more stage-specific content here */}
            </div>
          </CardContent>
        </Card>

        <ConfirmationDialog />
        <DocumentUploadDialog />
      </>
    )}
  </div>
);
};

//export component
export default ImportClearanceWorkflow;