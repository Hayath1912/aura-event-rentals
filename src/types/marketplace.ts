export type UserRole = 'customer' | 'vendor' | 'admin' | 'developer';

export interface User {
  id: string;
  email: string;
  phone: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}

export type VendorStatus = 'pending' | 'verified' | 'rejected' | 'suspended';

export interface Vendor {
  id: string;
  userId: string;
  businessName: string;
  slug: string;
  description: string;
  logoUrl: string;
  coverImageUrl: string;
  rating: number;
  reviewCount: number;
  status: VendorStatus;
  city: string;
  state: string;
  address: string;
  phone: string;
  email: string;
  gstNumber?: string;
  bankAccount?: string;
  ifscCode?: string;
  commissionRatePct: number; // default 10%
  totalProducts: number;
  activeRentals: number;
  totalEarnings: number;
  pendingPayouts: number;
  availableBalance: number;
  joinedDate: string;
  kycDocumentUrl?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  coverImageUrl: string;
  itemCount: number;
}

export type PricingUnit = 'per_day' | 'per_hour' | 'per_week' | 'per_month';

export interface Product {
  id: string;
  vendorId: string;
  vendorName: string;
  vendorRating: number;
  categoryId: string;
  categoryName: string;
  name: string;
  slug: string;
  description: string;
  specs: Record<string, string>;
  itemCode: string;
  rentalPrice: number; // in INR per unit duration
  pricingUnit: PricingUnit;
  securityDeposit: number;
  minDurationDays: number;
  maxDurationDays: number;
  dimension: string;
  totalQuantity: number;
  availableQuantity: number;
  inRepairQuantity: number;
  primaryImageUrl: string;
  imageUrls: string[];
  tags: string[];
  location: string;
  deliveryAvailable: boolean;
  deliveryCharge: number;
  pickupAvailable: boolean;
  isBundle?: boolean;
  bundleItems?: { productId: string; name: string; quantity: number; unitPrice: number }[];
  status: 'active' | 'draft' | 'pending_approval' | 'rejected';
  rating: number;
  reviewCount: number;
  featured?: boolean;
  createdAt: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  durationDays: number;
  billedDays: number;
}

export interface VendorCartGroup {
  vendorId: string;
  vendorName: string;
  vendorLocation: string;
  items: CartItem[];
  subtotal: number;
  deliveryCharge: number;
  securityDeposit: number;
  vendorTotal: number;
}

export interface CartCalculation {
  vendorGroups: VendorCartGroup[];
  totalRentalCost: number;
  totalDeliveryFee: number;
  totalSecurityDeposit: number;
  platformServiceFee: number;
  taxAmount: number; // 18% GST
  discountAmount: number;
  grandTotal: number;
}

export type MasterOrderStatus = 'confirmed' | 'partially_dispatched' | 'active' | 'completed' | 'cancelled';

export type VendorOrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready_for_pickup'
  | 'out_for_delivery'
  | 'rented'
  | 'returned'
  | 'completed'
  | 'cancelled';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  itemCode: string;
  quantity: number;
  unitPrice: number;
  durationDays: number;
  billedDays: number;
  lineTotal: number;
}

export interface DispatchManifest {
  eventLocation: string;
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  pickupDate: string;
  pickupTime: string;
  notes?: string;
  receiptGeneratedAt?: string;
}

export interface VendorOrder {
  id: string;
  orderNumber: string;
  masterOrderId: string;
  vendorId: string;
  vendorName: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  startDate: string;
  endDate: string;
  durationDays: number;
  billedDays: number;
  subtotal: number;
  deliveryFee: number;
  securityDeposit: number;
  commissionAmount: number;
  vendorPayoutAmount: number;
  status: VendorOrderStatus;
  logistics?: DispatchManifest;
  createdAt: string;
}

export interface MasterOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: string;
  vendorOrders: VendorOrder[];
  rentalSubtotal: number;
  deliveryFeeTotal: number;
  securityDepositTotal: number;
  platformFee: number;
  gstTax: number;
  discount: number;
  grandTotal: number;
  paymentMethod: 'upi' | 'card' | 'netbanking' | 'wallet' | 'cash_on_delivery';
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed';
  paymentTransactionId: string;
  status: MasterOrderStatus;
  createdAt: string;
}

export type MaintenanceStatus = 'damaged' | 'in_repair' | 'repaired' | 'scrapped' | 'lost' | 'sold';

export interface MaintenanceRecord {
  id: string;
  vendorId: string;
  productId: string;
  productName: string;
  productImage: string;
  itemCode: string;
  quantity: number;
  location: string;
  status: MaintenanceStatus;
  damageDescription: string;
  damageRecoveryFee: number;
  repairCost: number;
  reportedDate: string;
  resolvedDate?: string;
}

export interface WarehouseLocation {
  id: string;
  vendorId: string;
  name: string;
  shortCode: string;
  city: string;
  rooms: { id: string; name: string; racks: string[] }[];
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  vendorId: string;
  customerName: string;
  rating: number; // 1-5
  comment: string;
  date: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  role: UserRole;
  action: string;
  entityType: 'order' | 'product' | 'vendor' | 'payment' | 'user' | 'system';
  entityId: string;
  details: string;
  ipAddress: string;
}

export interface SystemHealth {
  apiStatus: 'healthy' | 'degraded' | 'down';
  databaseStatus: 'connected' | 'error';
  activeSessions: number;
  uptimeSeconds: number;
  memoryUsageMb: number;
  pendingWebhooks: number;
  failedTransactionsCount: number;
}
