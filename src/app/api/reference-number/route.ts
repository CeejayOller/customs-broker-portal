// src/app/api/reference-number/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { TransactionType } from '@/lib/utils/reference-number';

// This should be replaced with a database query
let sequenceCounters: { [key: string]: number } = {};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { transactionType, year } = body as { 
      transactionType: TransactionType; 
      year: string; 
    };

    // Create a unique key for each transaction type and year
    const counterKey = `${transactionType}${year}`;

    // Get the current sequence number or initialize it
    if (!sequenceCounters[counterKey]) {
      // TODO: Replace this with a database query to get the last sequence number
      sequenceCounters[counterKey] = 0;
    }

    // Increment the sequence number
    sequenceCounters[counterKey]++;
    
    // Format the sequence number
    const sequence = sequenceCounters[counterKey];
    const sequenceNumber = sequence.toString().padStart(4, '0');
    
    // Generate the reference number
    const referenceNumber = `CLEX-${transactionType}${year}-${sequenceNumber}`;

    return NextResponse.json({
      referenceNumber,
      sequenceNumber: sequence,
    });
  } catch (error) {
    console.error('Error generating reference number:', error);
    return NextResponse.json(
      { error: 'Failed to generate reference number' },
      { status: 500 }
    );
  }
}