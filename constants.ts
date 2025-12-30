import { PricingTier, User, Errand, ErrandStatus, Ticket, Product, Message, UserRole } from './types';

export const PRICING_TIERS: PricingTier[] = [
  { maxKm: 3, price: 2 },
  { maxKm: 5, price: 3 },
  { maxKm: 7, price: 4 },
  { maxKm: 9, price: 5 },
  { maxKm: 12, price: 6 },
  { maxKm: 14, price: 7 },
  { maxKm: 17, price: 8 },
  { maxKm: 19, price: 9 },
  { maxKm: 22, price: 10 }
];

export const SURCHARGE_PER_KM = 0.50;

export const APP_COLORS = {
  primary: '#FF3008', // DoorDash Brand Red
  secondary: '#191919', // Deep Neutral
  accent: '#00CC44', // Success Green
  warning: '#FFC107',
  danger: '#FF3B30',
  surface: '#F6F6F6'
};

// Comprehensive Dummy Data for All Dashboards

// Dummy Users for different roles
export const MOCK_USERS: User[] = [
  // Clients
  { id: 'u1', name: 'Tafadzwa D.', email: 'tafadzwad@example.com', role: UserRole.CLIENT, avatar: 'https://picsum.photos/seed/user1/100/100', walletBalance: 45.20 },
  { id: 'u2', name: 'Sarah J.', email: 'sarahj@example.com', role: UserRole.CLIENT, avatar: 'https://picsum.photos/seed/user2/100/100', walletBalance: 120.50 },
  { id: 'u3', name: 'Dr. Moyo', email: 'drmoyo@example.com', role: UserRole.CLIENT, avatar: 'https://picsum.photos/seed/user3/100/100', walletBalance: 89.75 },
  { id: 'u4', name: 'Maria K.', email: 'mariak@example.com', role: UserRole.CLIENT, avatar: 'https://picsum.photos/seed/user4/100/100', walletBalance: 234.10 },

  // Workers
  { id: 'w1', name: 'Simba R.', email: 'simbar@example.com', role: UserRole.WORKER, avatar: 'https://picsum.photos/seed/worker1/100/100', walletBalance: 156.80 },
  { id: 'w2', name: 'Blessing M.', email: 'blessingm@example.com', role: UserRole.WORKER, avatar: 'https://picsum.photos/seed/worker2/100/100', walletBalance: 98.45 },
  { id: 'w3', name: 'Tendai G.', email: 'tendaig@example.com', role: UserRole.WORKER, avatar: 'https://picsum.photos/seed/worker3/100/100', walletBalance: 67.90 },
  { id: 'w4', name: 'Nyasha P.', email: 'nyashap@example.com', role: UserRole.WORKER, avatar: 'https://picsum.photos/seed/worker4/100/100', walletBalance: 145.25 },
  { id: 'w5', name: 'Farai M.', email: 'faraim@example.com', role: UserRole.WORKER, avatar: 'https://picsum.photos/seed/worker5/100/100', walletBalance: 78.60 },

  // Merchants
  { id: 'm1', name: 'OK Mart Avondale', email: 'manager@okmart.co.zw', role: UserRole.MERCHANT, avatar: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=100', walletBalance: 1250.00 },
  { id: 'm2', name: 'SPAR Borrowdale', email: 'manager@spar.co.zw', role: UserRole.MERCHANT, avatar: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=100', walletBalance: 890.50 },
  { id: 'm3', name: 'Greenwood Pharmacy', email: 'manager@greenwood.co.zw', role: UserRole.MERCHANT, avatar: 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&q=80&w=100', walletBalance: 567.80 },

  // Support & Admin
  { id: 's1', name: 'Support Agent', email: 'support@errands.co.zw', role: UserRole.SUPPORT, avatar: 'https://picsum.photos/seed/support/100/100', walletBalance: 0 },
  { id: 'a1', name: 'Admin User', email: 'admin@errands.co.zw', role: UserRole.ADMIN, avatar: 'https://picsum.photos/seed/admin/100/100', walletBalance: 0 },
];

// Dummy Errands for different statuses
export const MOCK_ERRANDS: Errand[] = [
  // Active/Pending errands
  {
    id: 'ORD-4829',
    clientId: 'u1',
    workerId: 'w1',
    merchantId: 'm1',
    status: ErrandStatus.IN_PROGRESS,
    pickup: 'OK Mart Avondale, Harare',
    destination: '123 Samora Machel Ave, Apartment 4B, Harare',
    budget: 60.00,
    currentSpend: 42.30,
    distance: 3.2,
    items: ['2L Mazoe Orange Crush', '2kg White Sugar', '1 Loaf Bread', '5L Cooking Oil', '2L Milk'],
    proofPhotos: []
  },
  {
    id: 'ORD-4955',
    clientId: 'u2',
    workerId: 'w2',
    status: ErrandStatus.IN_PROGRESS,
    pickup: 'SPAR Borrowdale, Harare',
    destination: '45 Enterprise Road, Office Block A, Harare',
    budget: 45.00,
    currentSpend: 38.50,
    distance: 2.8,
    items: ['Office Supplies', 'Coffee', 'Snacks'],
    proofPhotos: []
  },
  {
    id: 'ORD-5120',
    clientId: 'u3',
    status: ErrandStatus.PENDING,
    pickup: 'Greenwood Pharmacy, Fife Ave',
    destination: '12 Jacaranda Mews, Avenues, Harare',
    budget: 25.00,
    currentSpend: 0,
    distance: 4.1,
    items: ['Prescription Medicine', 'Pain Relief Tablets'],
    proofPhotos: []
  },
  {
    id: 'ORD-5187',
    clientId: 'u4',
    workerId: 'w3',
    status: ErrandStatus.PREPARING,
    pickup: 'TM Pick n Pay Bond St',
    destination: '78 Borrowdale Road, Harare',
    budget: 85.00,
    currentSpend: 72.40,
    distance: 5.6,
    items: ['Weekly Groceries', 'Cleaning Supplies', 'Personal Care'],
    proofPhotos: []
  },
  {
    id: 'ORD-5234',
    clientId: 'u1',
    status: ErrandStatus.PENDING,
    pickup: 'The Cake Hut, Avondale',
    destination: '25 Milton Park, Harare',
    budget: 35.00,
    currentSpend: 0,
    distance: 6.2,
    items: ['Custom Birthday Cake', 'Party Candles'],
    proofPhotos: []
  },
  {
    id: 'ORD-5291',
    clientId: 'u2',
    workerId: 'w4',
    status: ErrandStatus.COMPLETED,
    pickup: 'Hardware Store, CBD',
    destination: '156 Mount Pleasant, Harare',
    budget: 150.00,
    currentSpend: 134.50,
    distance: 8.9,
    items: ['Paint Supplies', 'Tools', 'Hardware Items'],
    proofPhotos: ['receipt1.jpg', 'proof1.jpg']
  }
];

// Dummy Products for merchants
export const MOCK_PRODUCTS: Product[] = [
  // OK Mart Products
  { id: 'p1', name: 'Mazoe Orange Crush 2L', price: 4.50, category: 'Beverages', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=200', merchantId: 'm1' },
  { id: 'p2', name: 'White Sugar 2kg', price: 8.20, category: 'Pantry', image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&q=80&w=200', merchantId: 'm1' },
  { id: 'p3', name: 'Bread Loaf', price: 2.80, category: 'Bakery', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=200', merchantId: 'm1' },
  { id: 'p4', name: 'Cooking Oil 5L', price: 15.60, category: 'Pantry', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=200', merchantId: 'm1' },
  { id: 'p5', name: 'Fresh Milk 2L', price: 5.40, category: 'Dairy', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=200', merchantId: 'm1' },

  // SPAR Products
  { id: 'p6', name: 'Office Paper A4', price: 12.00, category: 'Office', image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&q=80&w=200', merchantId: 'm2' },
  { id: 'p7', name: 'Coffee Beans 500g', price: 18.50, category: 'Beverages', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=200', merchantId: 'm2' },
  { id: 'p8', name: 'Snack Assortment', price: 24.80, category: 'Snacks', image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&q=80&w=200', merchantId: 'm2' },

  // Pharmacy Products
  { id: 'p9', name: 'Pain Relief Tablets', price: 8.90, category: 'Medicines', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=200', merchantId: 'm3' },
  { id: 'p10', name: 'Vitamins C 1000mg', price: 15.20, category: 'Supplements', image: 'https://images.unsplash.com/photo-1550572017-edd951aa8ca9?auto=format&fit=crop&q=80&w=200', merchantId: 'm3' },
];

// Dummy Messages for conversations
export const MOCK_MESSAGES: Message[] = [
  { id: 'msg1', senderId: 'u1', senderName: 'Tafadzwa D.', senderRole: UserRole.CLIENT, text: 'Hi Simba, how is the shopping going?', timestamp: '2024-12-30T10:30:00Z' },
  { id: 'msg2', senderId: 'w1', senderName: 'Simba R.', senderRole: UserRole.WORKER, text: 'Going well! Just picked up the Mazoe and sugar. Heading to get the bread now.', timestamp: '2024-12-30T10:32:00Z' },
  { id: 'msg3', senderId: 'u1', senderName: 'Tafadzwa D.', senderRole: UserRole.CLIENT, text: 'Great! Please make sure to get the fresh loaf, not the packaged one.', timestamp: '2024-12-30T10:35:00Z' },
  { id: 'msg4', senderId: 'w1', senderName: 'Simba R.', senderRole: UserRole.WORKER, text: 'Will do! I\'m at the bakery section now.', timestamp: '2024-12-30T10:37:00Z' },
  { id: 'msg5', senderId: 'w1', senderName: 'Simba R.', senderRole: UserRole.WORKER, text: 'All items collected! Heading to checkout now. Total should be around $42.30', timestamp: '2024-12-30T10:45:00Z' },
  { id: 'msg6', senderId: 'u1', senderName: 'Tafadzwa D.', senderRole: UserRole.CLIENT, text: 'Perfect! That\'s within budget. Please take a photo of the receipt.', timestamp: '2024-12-30T10:46:00Z' },
];

// Dummy Tickets for support dashboard
export const MOCK_TICKETS: Ticket[] = [
  {
    $id: 'TIC-102',
    user_id: 'w1',
    userName: 'Simba R. (Worker)',
    category: 'Merchant Issue',
    priority: 'Urgent',
    status: 'open',
    transcript: 'Store closed unexpectedly at OK Mart Avondale. Runner is stuck at the gate.',
    time: '5m ago',
    orderId: 'ORD-4829',
    metadata: {
      device: "Android 13 / Samsung S22",
      location: "Avondale, Harare",
      tags: ["Store-Closed", "Runner-Blocked"],
      lastAction: "GPS Pinged"
    }
  },
  {
    $id: 'TIC-110',
    user_id: 'u1',
    userName: 'Tafadzwa D. (Client)',
    category: 'Payment',
    priority: 'Urgent',
    status: 'open',
    transcript: 'Double charge reported on Stripe for last wallet top-up. Needs immediate reversal.',
    time: '8m ago',
    metadata: {
      device: "iOS 17 / iPhone 15 Pro",
      location: "London, UK",
      tags: ["Billing", "Stripe"],
      lastAction: "Payment Log Inspected"
    }
  },
  {
    $id: 'TIC-115',
    user_id: 'w2',
    userName: 'Tendai G. (Worker)',
    category: 'Safety',
    priority: 'Urgent',
    status: 'open',
    transcript: 'Runner reported a flat tire during delivery. Parcel is safe but ETA is breached.',
    time: '12m ago',
    orderId: 'ORD-5120',
    metadata: {
      device: "Android 12 / Huawei P30",
      location: "Milton Park, Harare",
      tags: ["Vehicle-Issue", "ETA-Delayed"],
      lastAction: "Incident Logged"
    }
  },
  {
    $id: 'TIC-105',
    user_id: 'u4',
    userName: 'Maria K. (Client)',
    category: 'Tech Support',
    priority: 'Low',
    status: 'pending',
    transcript: 'Budget guardian not updating live on mobile. Web app seems fine.',
    time: '25m ago',
    orderId: 'ORD-4829',
    metadata: {
      device: "Android 14 / Google Pixel 7",
      location: "Pretoria, SA",
      tags: ["UI-Bug", "Budget-Guardian"]
    }
  },
  {
    $id: 'TIC-108',
    user_id: 'w3',
    userName: 'Farai M. (Worker)',
    category: 'Safety',
    priority: 'Medium',
    status: 'open',
    transcript: 'Customer not answering door or phone in Avondale. Runner has been waiting for 10 mins.',
    time: '34m ago',
    orderId: 'ORD-4955',
    metadata: {
      device: "Android 11 / Redmi Note 10",
      location: "Avondale, Harare",
      tags: ["No-Show", "Delivery-Wait"],
      lastAction: "Client Pinned"
    }
  },
  {
    $id: 'TIC-122',
    user_id: 'm1',
    userName: 'OK Mart Manager (Merchant)',
    category: 'Merchant Issue',
    priority: 'Medium',
    status: 'pending',
    transcript: 'Cannot toggle stock for "Huletts Sugar". Inventory sync error.',
    time: '1h ago',
    metadata: {
      device: "Windows 11 / Chrome 120",
      location: "Chisipite, Harare",
      tags: ["Inventory", "API-Sync"]
    }
  },
];

// Additional dummy data for enhanced dashboards
export const WORKER_EARNINGS_HISTORY = [
  { date: '2024-12-30', amount: 45.20, orders: 3, rating: 4.9 },
  { date: '2024-12-29', amount: 67.80, orders: 5, rating: 4.8 },
  { date: '2024-12-28', amount: 38.50, orders: 2, rating: 5.0 },
  { date: '2024-12-27', amount: 89.40, orders: 6, rating: 4.7 },
  { date: '2024-12-26', amount: 52.10, orders: 4, rating: 4.9 },
];

export const MERCHANT_SALES_DATA = [
  { date: '2024-12-30', revenue: 450.20, orders: 12, customers: 10 },
  { date: '2024-12-29', revenue: 678.50, orders: 18, customers: 15 },
  { date: '2024-12-28', revenue: 389.80, orders: 9, customers: 8 },
  { date: '2024-12-27', revenue: 892.40, orders: 22, customers: 19 },
  { date: '2024-12-26', revenue: 521.60, orders: 14, customers: 12 },
];

export const ADMIN_ANALYTICS = {
  totalVolume: 24850.20,
  activeErrands: 142,
  onlineRunners: 38,
  merchantPartners: 22,
  avgDeliveryTime: 28, // minutes
  customerSatisfaction: 4.7,
  platformFees: 1242.50,
  totalUsers: 1250,
  activeToday: 89,
};
