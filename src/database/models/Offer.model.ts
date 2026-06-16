export interface Offer {
  id: string;
  shipmentId: string;
  driverId: string;
  offeredPrice: number;
  estimatedDeliveryTime: Date;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  createdAt: Date;
  updatedAt: Date;
}
