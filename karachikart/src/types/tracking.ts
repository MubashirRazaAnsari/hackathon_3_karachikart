export interface TrackingEvent {
  timestamp: string;
  location: string;
  status: string;
  description: string;
}

export interface ShipmentInfo {
  id: string;
  service: string;
  origin: string;
  destination: string;
  estimatedDelivery: string;
  status: 'picked_up' | 'in_transit' | 'delivered' | 'delayed';
}

export interface TrackingData {
  shipmentInfo: ShipmentInfo;
  events: TrackingEvent[];
} 