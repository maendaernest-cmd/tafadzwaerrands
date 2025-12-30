// Mock Data Layer - Simulating Appwrite Database

export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: 'CLIENT' | 'WORKER' | 'MERCHANT' | 'SUPPORT' | 'ADMIN';
  avatar: string;
  walletBalance: number;
  phone?: string;
  location?: string;
  rating?: number;
}

export interface MockErrand {
  id: string;
  clientId: string;
  workerId?: string;
  merchantId?: string;
  status: 'PENDING' | 'ACCEPTED' | 'PREPARING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  pickup: string;
  destination: string;
  budget: number;
  currentSpend: number;
  distance: number;
  items: string[];
  proofPhotos: string[];
  createdAt: string;
  estimatedDelivery: string;
  client: MockUser;
  worker?: MockUser;
  merchant?: MockUser;
}

export interface MockOrder {
  id: string;
  errandId: string;
  merchantId: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  status: 'PENDING' | 'ACCEPTED' | 'PREPARING' | 'READY' | 'COMPLETED';
  createdAt: string;
}

export interface MockMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'CLIENT' | 'WORKER' | 'MERCHANT' | 'SUPPORT';
  text: string;
  timestamp: string;
  attachmentUrl?: string;
}

// Predefined Route Coordinates for Animation
export const ROUTE_COORDINATES = [
  { lat: 60, lng: 60 }, // Start (OK Mart)
  { lat: 58, lng: 58 },
  { lat: 56, lng: 56 },
  { lat: 54, lng: 54 },
  { lat: 52, lng: 52 },
  { lat: 50, lng: 50 },
  { lat: 48, lng: 48 },
  { lat: 46, lng: 46 },
  { lat: 44, lng: 44 },
  { lat: 42, lng: 42 },
  { lat: 40, lng: 40 },
  { lat: 38, lng: 38 },
  { lat: 36, lng: 36 },
  { lat: 34, lng: 34 },
  { lat: 32, lng: 32 }, // End (Delivery)
];

// Mock Users
export const MOCK_USERS: Record<string, MockUser> = {
  client1: {
    id: 'client1',
    name: 'Tafadzwa Diaspora',
    email: 'tafadzwa@example.com',
    role: 'CLIENT',
    avatar: 'https://picsum.photos/seed/tafadzwa/100/100',
    walletBalance: 245.50,
    phone: '+263 77 123 4567',
    location: 'Avondale, Harare',
    rating: 4.8
  },
  worker1: {
    id: 'worker1',
    name: 'Simba Runner',
    email: 'simba@atumwa.co.zw',
    role: 'WORKER',
    avatar: 'https://picsum.photos/seed/simba/100/100',
    walletBalance: 125.75,
    phone: '+263 71 987 6543',
    location: 'Borrowdale, Harare',
    rating: 4.9
  },
  merchant1: {
    id: 'merchant1',
    name: 'OK Mart Manager',
    email: 'manager@okmart.co.zw',
    role: 'MERCHANT',
    avatar: 'https://picsum.photos/seed/merchant/100/100',
    walletBalance: 0,
    phone: '+263 24 123 456',
    location: 'Avondale, Harare'
  }
};

// Mock Errands
