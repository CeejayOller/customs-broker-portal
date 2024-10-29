// src/app/api/admin/import/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ShipmentData, ReferenceNumberResponse } from '@/app/(admin)/admin/import/types/workflow';
import { randomUUID } from 'crypto';

// In-memory storage for development (replace with database later)
let shipments: ShipmentData[] = [];

// GET - List all shipments with filters
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type'); // IMS or IMA
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Filter shipments
    let filteredShipments = [...shipments];
    if (status) {
      filteredShipments = filteredShipments.filter(s => {
        const lastStage = s.timeline[s.timeline.length - 1];
        return lastStage?.status === status;
      });
    }

    // Calculate pagination
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedShipments = filteredShipments.slice(start, end);

    return NextResponse.json({
      data: paginatedShipments,
      total: filteredShipments.length,
      page,
      totalPages: Math.ceil(filteredShipments.length / limit)
    });
  } catch (error) {
    console.error('Error fetching shipments:', error);
    return NextResponse.json({ error: 'Failed to fetch shipments' }, { status: 500 });
  }
}

// POST - Create new shipment
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { shipmentType, formData } = body;

    // Generate reference number
    const referenceNumber = `${shipmentType}-${new Date().getFullYear()}-${String(shipments.length + 1).padStart(4, '0')}`;

    const newShipment: ShipmentData = {
      id: randomUUID(),
      referenceNumber,
      consignee: formData.consignee,
      exporter: formData.exporter,
      shipmentDetails: formData.shipmentDetails,
      documents: formData.documents || [],
      computations: {
        dutiable_value: 0,
        customs_duty: 0,
        vat: 0,
        other_charges: 0,
        total_payable: 0
      },
      timeline: [
        {
          stage: 'CLIENT_DETAILS',
          status: 'pending',
          timestamp: new Date().toISOString()
        }
      ],
      notes: []
    };

    shipments.push(newShipment);
    return NextResponse.json(newShipment);
  } catch (error) {
    console.error('Error creating shipment:', error);
    return NextResponse.json({ error: 'Failed to create shipment' }, { status: 500 });
  }
}