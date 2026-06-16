export interface Dispute {
  id: string;
  shipmentId: string;
  raisedBy: string;
  reason: string;
  status: 'open' | 'in_review' | 'resolved' | 'closed';
  resolution?: string;
  createdAt: Date;
  updatedAt: Date;
}
