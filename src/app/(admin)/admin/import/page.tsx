// src/app/(admin)/admin/import/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle, Search } from "lucide-react";
import Link from "next/link";

export default function ImportClearance() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Import Clearance Requests</h1>
        <Link href="/admin/import/clearance">
          <Button className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5" />
            New Clearance
          </Button>
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by reference number, client, or status..."
            className="pl-10 pr-4 py-2 border rounded-lg w-full"
          />
        </div>
      </div>

      {/* Clearance Requests Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference No.</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              {
                ref: "IMP-2024-001",
                client: "ABC Corporation",
                status: "Document Verification",
                created: "2024-03-15",
                updated: "2024-03-16",
              },
              {
                ref: "IMP-2024-002",
                client: "XYZ Trading",
                status: "Payment Pending",
                created: "2024-03-14",
                updated: "2024-03-15",
              },
            ].map((request) => (
              <TableRow key={request.ref}>
                <TableCell className="font-medium">{request.ref}</TableCell>
                <TableCell>{request.client}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    request.status === 'Document Verification' ? 'bg-yellow-100 text-yellow-800' :
                    request.status === 'Payment Pending' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {request.status}
                  </span>
                </TableCell>
                <TableCell>{request.created}</TableCell>
                <TableCell>{request.updated}</TableCell>
                <TableCell>
                  <Link href={`/admin/import/${request.ref}`}>
                    <Button variant="outline" size="sm">View</Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}