export interface Tracking {
  id: string;
  shipmentId: string;
  location: {
    lat: number;
    lng: number;
  };
  status: string;
  timestamp: Date;
}
