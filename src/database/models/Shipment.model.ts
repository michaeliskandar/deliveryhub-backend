export interface Shipment {
  id: string;
  customerId: string;
  pickupAddress: string;
  deliveryAddress: string;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  status: 'pending' | 'assigned' | 'in_transit' | 'delivered' | 'cancelled';
  price: number;
  createdAt: Date;
  updatedAt: Date;
}
