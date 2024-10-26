// src/app/admin/admin/import/clearance/page.tsx
"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import ImportClearanceWorkflow from "../components/ImportClearanceWorkflow";

export default function ImportClearancePage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Import Clearance</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Shipment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium">Reference Number</h3>
              <p className="text-gray-600">IMP-2024-001</p>
            </div>
            <div>
              <h3 className="font-medium">Client</h3>
              <p className="text-gray-600">Sample Client</p>
            </div>
            <div>
              <h3 className="font-medium">ETA</h3>
              <p className="text-gray-600">2024-03-15</p>
            </div>
            <div>
              <h3 className="font-medium">Port of Discharge</h3>
              <p className="text-gray-600">Manila International Container Port</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <ImportClearanceWorkflow />
    </div>
  );
}