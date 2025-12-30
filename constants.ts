import { PricingTier } from './types';

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