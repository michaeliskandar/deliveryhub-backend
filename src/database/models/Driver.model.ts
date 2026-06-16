export interface Driver {
  id: string;
  userId: string;
  licenseNumber: string;
  vehicleType: string;
  vehiclePlate: string;
  isAvailable: boolean;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}
