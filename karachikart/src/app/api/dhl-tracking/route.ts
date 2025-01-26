import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/authOptions';
import { z } from 'zod';
import type { TrackingData } from '@/types/tracking';
import { client } from '@/sanity/lib/client';
import { getShipmentTracking } from '@/services/dhl';

// Validation schema for tracking request
const trackingRequestSchema = z.object({
  trackingNumber: z.string().min(1),
});

type TrackingRequest = z.infer<typeof trackingRequestSchema>;

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const trackingNumber = searchParams.get('trackingNumber');

    if (!trackingNumber) {
      return NextResponse.json(
        { error: 'Tracking number is required' },
        { status: 400 }
      );
    }

    const validatedData = trackingRequestSchema.parse({ trackingNumber });

    try {
      // Get order details from Sanity
      const order = await client.fetch(
        `*[_type == "order" && trackingNumber == $trackingNumber][0]`,
        { trackingNumber }
      );

      if (!order) {
        return NextResponse.json(
          { error: 'Order not found' },
          { status: 404 }
        );
      }

      // Get tracking details from DHL
      const dhlData = await getShipmentTracking(validatedData.trackingNumber);

      // Transform DHL data to our format
      const trackingData: TrackingData = {
        shipmentInfo: {
          id: dhlData.shipments[0].id,
          service: 'DHL Express',
          origin: `${dhlData.shipments[0].status.location.address.city}, ${dhlData.shipments[0].status.location.address.countryCode}`,
          destination: `${order.shippingAddress.city}, ${order.shippingAddress.country}`,
          estimatedDelivery: dhlData.shipments[0].status.timestamp,
          status: dhlData.shipments[0].status.statusCode.toLowerCase() as 'picked_up' | 'in_transit' | 'delivered' | 'delayed',
        },
        events: dhlData.shipments[0].events.map((event: any) => ({
          timestamp: event.timestamp,
          location: `${event.location.address.city}, ${event.location.address.countryCode}`,
          status: event.statusCode.toLowerCase() as 'picked_up' | 'in_transit' | 'delivered' | 'delayed',
          description: event.description,
        })),
      };

      return NextResponse.json({
        ...trackingData,
        orderNumber: order.orderNumber
      });
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        // Return mock data in development
        const mockTrackingData: TrackingData = {
          shipmentInfo: {
            id: trackingNumber,
            service: "DHL Express",
            origin: "Karachi, Pakistan",
            destination: "Lahore, Pakistan",
            estimatedDelivery: new Date(Date.now() + 86400000 * 2).toISOString(),
            status: "in_transit",
          },
          events: [
            {
              timestamp: new Date(Date.now() - 86400000).toISOString(),
              location: "Karachi, Pakistan",
              status: "picked_up",
              description: "Shipment picked up",
            },
            {
              timestamp: new Date().toISOString(),
              location: "Karachi Hub, Pakistan",
              status: "in_transit",
              description: "Processed at DHL facility",
            },
          ],
        };

        return NextResponse.json({
          ...mockTrackingData,
          orderNumber: "MOCK-" + trackingNumber
        });
      }

      throw error;
    }
  } catch (error) {
    console.error('Tracking API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tracking information' },
      { status: 500 }
    );
  }
} 