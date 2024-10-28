import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ClipboardList, 
  FileCheck, 
  Calculator, 
  Upload, 
  Truck, 
  Package, 
  Check,
  FileText,
  DollarSign,
  Building,
  LucideIcon
} from 'lucide-react';

// Define the base state interface
interface WorkflowStateBase {
  label: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

// Define specific state interfaces
interface DocumentState extends WorkflowStateBase {
  requiredDocs: string[];
}

interface VerificationState extends WorkflowStateBase {
  checkPoints: string[];
}

interface ComputationState extends WorkflowStateBase {
  computationItems: string[];
}

interface BasicState extends WorkflowStateBase {}

// Define the union type for all possible state types
type WorkflowState = DocumentState | VerificationState | ComputationState | BasicState;

// Define the type for the entire workflow states object
type WorkflowStates = {
  [K in keyof typeof WORKFLOW_STATES]: WorkflowState;
};

interface ShipmentData {
  referenceNumber: string;
  clientName: string;
  consignee: string;
  shipmentDetails: {
    bl_number: string;
    vessel: string;
    eta: string;
    port_of_discharge: string;
  };
  documents: string[];
  computations: {
    dutiable_value: number;
    customs_duty: number;
    vat: number;
    other_charges: number;
    total_payable: number;
  };
  timeline: string[];
  notes: string[];
}

const WORKFLOW_STATES = {
  CLIENT_ORDER: {
    label: 'Client Order Received',
    icon: ClipboardList,
    color: 'text-blue-500',
    bgColor: 'bg-blue-100',
    requiredDocs: [
      'Purchase Order',
      'Client Authorization Letter',
      'Client Profile/Registration'
    ]
  } as DocumentState,
  
  DOCUMENT_COLLECTION: {
    label: 'Document Collection',
    icon: FileText,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-100',
    requiredDocs: [
      'Bill of Lading',
      'Commercial Invoice',
      'Packing List',
      'Certificate of Origin',
      'Import Permit (if applicable)',
      'Product Certifications (if applicable)'
    ]
  } as DocumentState,
  
  DOCUMENT_VERIFICATION: {
    label: 'Document Verification',
    icon: FileCheck,
    color: 'text-orange-500',
    bgColor: 'bg-orange-100',
    checkPoints: [
      'HS Code Verification',
      'Document Completeness',
      'Value Declaration Check',
      'Import Restrictions Check'
    ]
  } as VerificationState,
  
  TAX_COMPUTATION: {
    label: 'Tax/Duty Computation',
    icon: Calculator,
    color: 'text-purple-500',
    bgColor: 'bg-purple-100',
    computationItems: [
      'Customs Duty',
      'VAT',
      'Other Taxes/Fees',
      'Brokerage Fees'
    ]
  } as ComputationState,
  
  READY_FOR_LODGEMENT: {
    label: 'Ready for E2M',
    icon: Upload,
    color: 'text-green-500',
    bgColor: 'bg-green-100'
  } as BasicState,
  
  LODGED: {
    label: 'Lodged in E2M',
    icon: Check,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  } as BasicState,
  
  PAYMENT_COMPLETED: {
    label: 'Payment Completed',
    icon: DollarSign,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-100'
  } as BasicState,
  
  PORT_RELEASE: {
    label: 'Port Release',
    icon: Building,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-100'
  } as BasicState,
  
  IN_TRANSIT: {
    label: 'In Transit',
    icon: Truck,
    color: 'text-amber-500',
    bgColor: 'bg-amber-100'
  } as BasicState,
  
  DELIVERED: {
    label: 'Delivered',
    icon: Package,
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  } as BasicState
} as const;

const ImportClearanceWorkflow: React.FC = () => {
  const [currentState, setCurrentState] = useState<keyof typeof WORKFLOW_STATES>('CLIENT_ORDER');
  const [shipmentData, setShipmentData] = useState<ShipmentData>({
    referenceNumber: '',
    clientName: '',
    consignee: '',
    shipmentDetails: {
      bl_number: '',
      vessel: '',
      eta: '',
      port_of_discharge: ''
    },
    documents: [],
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

  // Helper function to check if a state has required docs
  const hasRequiredDocs = (state: WorkflowState): state is DocumentState => {
    return 'requiredDocs' in state;
  };

  // Helper function to check if a state has checkpoints
  const hasCheckPoints = (state: WorkflowState): state is VerificationState => {
    return 'checkPoints' in state;
  };

  // Helper function to check if a state has computation items
  const hasComputationItems = (state: WorkflowState): state is ComputationState => {
    return 'computationItems' in state;
  };

  // Timeline component showing all states
  const WorkflowTimeline: React.FC = () => {
    const states = Object.entries(WORKFLOW_STATES);
    const currentIndex = states.findIndex(([key]) => key === currentState);

    return (
      <div className="relative mt-8">
        <div className="absolute left-0 w-full h-1 bg-gray-200 top-5" />
        <div className="relative flex justify-between">
          {states.map(([key, state], index) => {
            const StateIcon = state.icon;
            const isActive = index <= currentIndex;
            const isCurrent = key === currentState;
            
            return (
              <div key={key} className="flex flex-col items-center relative group">
                <div
                  className={`z-10 flex items-center justify-center w-10 h-10 rounded-full 
                    ${isActive ? state.bgColor : 'bg-gray-200'} 
                    ${isActive ? state.color : 'text-gray-400'}
                    ${isCurrent ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                >
                  <StateIcon className="w-5 h-5" />
                </div>
                <span className={`mt-2 text-sm font-medium 
                  ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                  {state.label}
                </span>
                
                {/* Hover tooltip for required items */}
                <div className="absolute bottom-full mb-2 hidden group-hover:block w-48 bg-white p-2 rounded shadow-lg text-xs">
                  {hasRequiredDocs(state) && (
                    <>
                      <strong>Required Documents:</strong>
                      <ul className="ml-2 mt-1">
                        {state.requiredDocs.map((doc: string) => (
                          <li key={doc}>• {doc}</li>
                        ))}
                      </ul>
                    </>
                  )}
                  {hasCheckPoints(state) && (
                    <>
                      <strong>Checkpoints:</strong>
                      <ul className="ml-2 mt-1">
                        {state.checkPoints.map((point: string) => (
                          <li key={point}>• {point}</li>
                        ))}
                      </ul>
                    </>
                  )}
                  {hasComputationItems(state) && (
                    <>
                      <strong>Computation Items:</strong>
                      <ul className="ml-2 mt-1">
                        {state.computationItems.map((item: string) => (
                          <li key={item}>• {item}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Current state details card
  const StateDetailsCard: React.FC = () => {
    const currentStateData = WORKFLOW_STATES[currentState];
    const StateIcon = currentStateData.icon;

    return (
      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center space-x-4">
          <div className={`p-2 rounded-full ${currentStateData.bgColor}`}>
            <StateIcon className={`w-6 h-6 ${currentStateData.color}`} />
          </div>
          <div>
            <CardTitle className="text-xl">
              Current Status: {currentStateData.label}
            </CardTitle>
            <p className="text-sm text-gray-500">
              Ref: {shipmentData.referenceNumber || 'Not yet assigned'}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {hasRequiredDocs(currentStateData) && (
              <div>
                <h4 className="font-medium mb-2">Required Documents</h4>
                <ul className="grid grid-cols-2 gap-2">
                  {currentStateData.requiredDocs.map((doc: string) => (
                    <li key={doc} className="flex items-center text-sm">
                      <div className="w-2 h-2 rounded-full bg-gray-300 mr-2" />
                      {doc}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {currentState === 'TAX_COMPUTATION' && (
              <div>
                <h4 className="font-medium mb-2">Computation Summary</h4>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Dutiable Value:</div>
                    <div className="text-right">₱{shipmentData.computations.dutiable_value.toLocaleString()}</div>
                    <div>Customs Duty:</div>
                    <div className="text-right">₱{shipmentData.computations.customs_duty.toLocaleString()}</div>
                    <div>VAT:</div>
                    <div className="text-right">₱{shipmentData.computations.vat.toLocaleString()}</div>
                    <div>Other Charges:</div>
                    <div className="text-right">₱{shipmentData.computations.other_charges.toLocaleString()}</div>
                    <div className="font-medium">Total Payable:</div>
                    <div className="text-right font-medium">₱{shipmentData.computations.total_payable.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-6">
      <WorkflowTimeline />
      <StateDetailsCard />
      
      {/* Action buttons */}
      <div className="mt-6 space-x-4">
        <Button 
          onClick={() => {
            const states = Object.keys(WORKFLOW_STATES) as Array<keyof typeof WORKFLOW_STATES>;
            const currentIndex = states.indexOf(currentState);
            if (currentIndex < states.length - 1) {
              setCurrentState(states[currentIndex + 1]);
            }
          }}
          variant="default"
          disabled={currentState === 'DELIVERED'}
        >
          Move to Next State
        </Button>
      </div>
    </div>
  );
};

export default ImportClearanceWorkflow;