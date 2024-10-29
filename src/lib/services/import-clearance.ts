// src/lib/services/import-clearance.ts
import { ShipmentData } from '@/app/types/workflow';

export const ImportClearanceService = {
  // Fetch all shipments
  async getShipments(params?: { status?: string; page?: number; limit?: number }) {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append('status', params.status);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    const response = await fetch(`/api/admin/import?${searchParams}`);
    return response.json();
  },

  // Create new shipment
  async createShipment(freightType: 'IMS' | 'IMA') {
    const response = await fetch('/api/admin/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ freightType })
    });
    return response.json();
  },

  // Get single shipment
  async getShipment(id: string) {
    const response = await fetch(`/api/admin/import/${id}`);
    return response.json();
  },

  // Update shipment
  async updateShipment(id: string, data: Partial<ShipmentData>) {
    const response = await fetch(`/api/admin/import/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // Upload document
  async uploadDocument(id: string, file: File, documentType: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);

    const response = await fetch(`/api/admin/import/${id}/documents`, {
      method: 'POST',
      body: formData
    });
    return response.json();
  }
};