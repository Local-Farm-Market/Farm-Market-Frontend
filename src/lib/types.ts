// Enum for order status
export enum OrderStatus {
  NEW = 0,
  PAID = 1,
  PROCESSING = 2,
  SHIPPED = 3,
  IN_DELIVERY = 4,
  DELIVERED = 5,
  COMPLETED = 6,
}

// User profile type
export interface UserProfile {
  name: string;
  contactInfo: string;
  location: string;
  bio: string;
  isVerified: boolean;
  rating: bigint;
  reviewCount: bigint;
  isSeller: boolean;
  farmName: string;
  farmDescription: string;
}

// Product type
export interface Product {
  id: bigint;
  seller: `0x${string}`;
  name: string;
  category: string;
  price: bigint;
  stockQuantity: bigint;
  unit: string;
  description: string;
  imageUrls: string[];
  isAvailable: boolean;
  isOrganic: boolean;
  soldCount: bigint;
}

// Cart item type
export interface CartItem {
  productId: bigint;
  quantity: bigint;
}

// Order type
export interface Order {
  id: bigint;
  buyer: `0x${string}`;
  seller: `0x${string}`;
  productIds: bigint[];
  quantities: bigint[];
  totalPrice: bigint;
  shippingFee: bigint;
  status: OrderStatus;
  shippingAddress: string;
  trackingInfo: string;
  updatedAt: bigint;
}

// Escrow type
export interface Escrow {
  orderId: bigint;
  amount: bigint;
  developerFee: bigint;
  sellerAmount: bigint;
  createdAt: bigint;
  releasedAt: bigint;
  isReleased: boolean;
  isRefunded: boolean;
  isClaimable: boolean;
  isClaimed: boolean;
}

// Platform stats type
export interface PlatformStats {
  totalVolume: bigint;
  totalOrders: bigint;
  developerFees: bigint;
  activeProducts: bigint;
  activeUsers: bigint;
}

// Helper functions for formatting
export function formatPrice(price: bigint): string {
  return (Number(price) / 1e18).toFixed(2);
}

export function parsePrice(price: string): bigint {
  return BigInt(Math.floor(Number.parseFloat(price) * 1e18));
}

export function formatAddress(address: `0x${string}`): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function getOrderStatusText(status: OrderStatus): string {
  switch (status) {
    case OrderStatus.NEW:
      return "New";
    case OrderStatus.PAID:
      return "Paid";
    case OrderStatus.PROCESSING:
      return "Processing";
    case OrderStatus.SHIPPED:
      return "Shipped";
    case OrderStatus.IN_DELIVERY:
      return "In Delivery";
    case OrderStatus.DELIVERED:
      return "Delivered";
    case OrderStatus.COMPLETED:
      return "Completed";
    default:
      return "Unknown";
  }
}
