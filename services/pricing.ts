
import { PRICING_TIERS, SURCHARGE_PER_KM } from '../constants';

export const calculateDeliveryPrice = (distanceKm: number): number => {
  if (distanceKm <= 0) return 0;
  
  // Find fixed tier
  const tier = PRICING_TIERS.find(t => distanceKm <= t.maxKm);
  if (tier) return tier.price;
  
  // 22km+ logic: $10 + $0.50 per km over 22
  const extraKm = distanceKm - 22;
  return 10 + (extraKm * SURCHARGE_PER_KM);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};
