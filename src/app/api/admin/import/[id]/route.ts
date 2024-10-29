// src/app/api/admin/import/[id]/route.ts
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
  ) {
    try {
      const shipment = shipments.find(s => s.id === params.id);
      if (!shipment) {
        return NextResponse.json({ error: 'Shipment not found' }, { status: 404 });
      }
      return NextResponse.json(shipment);
    } catch (error) {
      console.error('Error fetching shipment:', error);
      return NextResponse.json({ error: 'Failed to fetch shipment' }, { status: 500 });
    }
  }
  
  export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
  ) {
    try {
      const body = await req.json();
      const shipmentIndex = shipments.findIndex(s => s.id === params.id);
      
      if (shipmentIndex === -1) {
        return NextResponse.json({ error: 'Shipment not found' }, { status: 404 });
      }
  
      // Update shipment and add to timeline
      const updatedShipment = {
        ...shipments[shipmentIndex],
        ...body,
        timeline: [
          ...shipments[shipmentIndex].timeline,
          {
            stage: body.currentStage,
            status: body.status || 'pending',
            timestamp: new Date().toISOString()
          }
        ]
      };
  
      shipments[shipmentIndex] = updatedShipment;
      return NextResponse.json(updatedShipment);
    } catch (error) {
      console.error('Error updating shipment:', error);
      return NextResponse.json({ error: 'Failed to update shipment' }, { status: 500 });
    }
  }