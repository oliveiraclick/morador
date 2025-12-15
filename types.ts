export enum UserRole {
  RESIDENT = 'RESIDENT',
  PROFESSIONAL = 'PROFESSIONAL',
  ADMIN = 'ADMIN'
}

export interface Service {
  id: string;
  title: string;
  rating: number;
  reviews: number;
  price: number;
  image: string;
  providerName: string;
  category: string;
}

export interface Order {
  id: string;
  title: string;
  location: string;
  time: string;
  status: 'URGENT' | 'NOVO' | 'NORMAL' | 'PENDING' | 'DONE';
  price: number;
  description: string;
  image: string;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  category: string;
  seller: string;
  sellerAvatar?: string;
  active: boolean;
}