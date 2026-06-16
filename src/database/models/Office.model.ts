export interface Office {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  location: {
    lat: number;
    lng: number;
  };
  createdAt: Date;
  updatedAt: Date;
}
