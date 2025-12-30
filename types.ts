export enum UserRole {
  CLIENT = 'CLIENT',
  WORKER = 'WORKER',
  MERCHANT = 'MERCHANT',
  SUPPORT = 'SUPPORT',
  ADMIN = 'ADMIN'
}

export enum ErrandStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  PREPARING = 'PREPARING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  walletBalance: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  merchantId: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  timestamp: string;
  attachmentUrl?: string;
}

export interface Conversation {
  id: string;
  orderId: string;
  participants: string[];
  status: 'active' | 'archived';
}

export interface Errand {
  id: string;
  clientId: string;
  workerId?: string;
  merchantId?: string;
  status: ErrandStatus;
  pickup: string;
  destination: string;
  budget: number;
  currentSpend: number;
  distance: number;
  items: string[];
  proofPhotos: string[];
}

export interface Ticket {
  $id: string;
  user_id: string;
  userName: string; // Virtual field for UI
  category: 'Payment' | 'Tech Support' | 'Safety' | 'Merchant Issue';
  priority: 'Low' | 'Medium' | 'Urgent';
  transcript?: string;
  status: 'open' | 'pending' | 'resolved' | 'closed';
  time: string; // Virtual field for UI derived from $createdAt
  orderId?: string; // Optional contextual link
  metadata?: {
    device?: string;
    location?: string;
    tags?: string[];
    lastAction?: string;
  };
}

export interface PricingTier {
  maxKm: number;
  price: number;
}
