'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import ImportClearanceWorkflow from '../components/ImportClearanceWorkflow';

interface Event {
  id: string;
  timestamp: string;
  description: string;
  status: string;
  user: string;
}

interface PageProps {
  params: {
    id: string;
  };
}

const ShipmentDetailPage = ({ params }: PageProps) => {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      timestamp: '2024-10-26T10:30:00',
      description: 'Documents received from client',
      status: 'DOCUMENT_COLLECTION',
      user: 'John Doe'
    },
    {
      id: '2',
      timestamp: '2024-10-26T11:45:00',
      description: 'Started document verification process',
      status: 'DOCUMENT_VERIFICATION',
      user: 'Jane Smith'
    }
  ]);

  const [newEvent, setNewEvent] = useState({
    description: '',
    status: 'DOCUMENT_COLLECTION'
  });

  const handleAddEvent = () => {
    if (newEvent.description.trim()) {
      setEvents(prev => [...prev, {
        id: Math.random().toString(),
        timestamp: new Date().toISOString(),
        description: newEvent.description,
        status: newEvent.status,
        user: 'Current User' // Replace with actual user data
      }]);
      setNewEvent({ description: '', status: 'DOCUMENT_COLLECTION' });
    }
  };

  const StatementOfFacts = () => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Statement of Facts</CardTitle>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Event</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Event</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Description</Label>
                <Textarea 
                  placeholder="Enter event description" 
                  value={newEvent.description}
                  onChange={(e) => setNewEvent(prev => ({
                    ...prev,
                    description: e.target.value
                  }))}
                />
              </div>
              <Button onClick={handleAddEvent}>Save Event</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div className="absolute left-4 top-0 h-full w-px bg-gray-200" />
          <div className="space-y-6 relative">
            {events.map((event) => (
              <div key={event.id} className="flex gap-4 relative">
                <div className="absolute -left-2 mt-2 w-4 h-4 rounded-full bg-blue-500" />
                <div className="ml-6">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">
                      {format(new Date(event.timestamp), 'MMM dd, yyyy HH:mm')}
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-0.5">
                      {event.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{event.description}</p>
                  <p className="mt-1 text-xs text-gray-500">By: {event.user}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button variant="outline" onClick={() => router.back()}>
          Back to List
        </Button>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Shipment #{params.id}</CardTitle>
          </CardHeader>
          <CardContent>
            <ImportClearanceWorkflow />
          </CardContent>
        </Card>
        <StatementOfFacts />
      </div>
    </div>
  );
};

export default ShipmentDetailPage;