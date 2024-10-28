// src/lib/utils/reference-number.ts

export type TransactionType = 'IMS' | 'IMA' | 'ACN' | 'ACR' | 'EXP';

export interface ReferenceNumberConfig {
  prefix: string;
  transactionType: TransactionType;
  year: string;
  sequence: number;
}

export interface ReferenceNumberResponse {
  referenceNumber: string;
  sequenceNumber: number;
}

// Generate a reference number with the format CLEX-XXXYY-0001
export const generateReferenceNumber = async (config: ReferenceNumberConfig): Promise<string> => {
  const { prefix, transactionType, year, sequence } = config;
  const sequenceNumber = sequence.toString().padStart(4, '0');
  return `${prefix}-${transactionType}${year}-${sequenceNumber}`;
};

// Get the next reference number from the API
export const getNextReferenceNumber = async (transactionType: TransactionType): Promise<ReferenceNumberResponse> => {
  try {
    const response = await fetch('/api/reference-number', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transactionType,
        year: new Date().getFullYear().toString().slice(-2),
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate reference number');
    }

    return await response.json();
  } catch (error) {
    console.error('Error generating reference number:', error);
    throw error;
  }
};

export const validateReferenceNumber = (referenceNumber: string): boolean => {
  const pattern = /^CLEX-(IMS|IMA|ACN|ACR|EXP)\d{2}-\d{4}$/;
  return pattern.test(referenceNumber);
};

export const parseReferenceNumber = (referenceNumber: string) => {
  const match = referenceNumber.match(/^(CLEX)-(IMS|IMA|ACN|ACR|EXP)(\d{2})-(\d{4})$/);
  if (!match) throw new Error('Invalid reference number format');
  
  const [_, prefix, transactionType, year, sequence] = match;
  return {
    prefix,
    transactionType: transactionType as TransactionType,
    year,
    sequence: parseInt(sequence, 10)
  };
};