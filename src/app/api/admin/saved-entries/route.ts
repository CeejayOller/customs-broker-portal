// src/app/api/admin/saved-entries/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { CustomEntity } from '@/app/(admin)/admin/import/types/import-form';

// In-memory storage (replace with database later)
let savedConsignees: CustomEntity[] = [];
let savedExporters: CustomEntity[] = [];

export async function GET(req: NextRequest) {
  const type = new URL(req.url).searchParams.get('type');
  
  return NextResponse.json({
    data: type === 'consignee' ? savedConsignees : savedExporters
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { type, entity } = body;

  if (type === 'consignee') {
    savedConsignees.push(entity);
  } else {
    savedExporters.push(entity);
  }

  return NextResponse.json({ success: true });
}