import { DHL_CONFIG } from '@/config/dhl';

interface DHLTrackingResponse {
  shipments: Array<{
    id: string;
    status: {
      timestamp: string;
      location: {
        address: {
          countryCode: string;
          city: string;
        };
      };
      statusCode: string;
      status: string;
      description: string;
    };
    events: Array<{
      timestamp: string;
      location: {
        address: {
          countryCode: string;
          city: string;
        };
      };
      statusCode: string;
      description: string;
    }>;
    // Add other fields as needed
  }>;
}

export async function getShipmentTracking(trackingNumber: string) {
  const response = await fetch(
    `${DHL_CONFIG.BASE_URL}/track/shipments/${trackingNumber}`,
    {
      headers: {
        'DHL-API-Key': DHL_CONFIG.API_KEY,
        'DHL-API-Secret': DHL_CONFIG.API_SECRET,
      },
    }
  );
  
  return response.json();
} 