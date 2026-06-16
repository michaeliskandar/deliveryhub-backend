export interface Review {
  id: string;
  shipmentId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}
