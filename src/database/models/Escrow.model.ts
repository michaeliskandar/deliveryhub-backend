export interface Escrow {
  id: string;
  shipmentId: string;
  amount: number;
  status: 'pending' | 'released' | 'refunded';
  releaseDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
