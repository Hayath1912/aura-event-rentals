import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import {
  UserRole,
  User,
  Vendor,
  Category,
  Product,
  CartItem,
  CartCalculation,
  MasterOrder,
  VendorOrder,
  VendorOrderStatus,
  DispatchManifest,
  MaintenanceRecord,
  MaintenanceStatus,
  AuditLog,
  SystemHealth,
  VendorStatus,
} from '../types/marketplace';
import {
  INITIAL_CATEGORIES,
  INITIAL_VENDORS,
  INITIAL_PRODUCTS,
  INITIAL_MASTER_ORDERS,
  INITIAL_MAINTENANCE,
  INITIAL_AUDIT_LOGS,
  INITIAL_HEALTH,
  MOCK_USERS,
} from '../data/marketplaceData';
import { calculateCart, calculateDurationDays } from '../services/cartEngine';
import { createMasterOrder, CheckoutCustomerInfo, updateVendorOrderStatus } from '../services/orderEngine';
import {
  verifyDeveloperCredentials,
  DeveloperAuthResult,
  FeatureFlags,
  INITIAL_FEATURE_FLAGS,
  createAuditLog,
  getUpdatedSystemHealth,
} from '../services/developerEngine';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error' | 'warning';
  title: string;
  description?: string;
}

export interface BookingDatesState {
  startDate: string;
  endDate: string;
  durationDays: number;
  billedDays: number;
}

interface MarketplaceContextType {
  // Roles & Users
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentUser: User;
  setCurrentUser: (user: User) => void;
  activeVendorId: string;
  setActiveVendorId: (id: string) => void;
  activeVendor: Vendor | undefined;

  // Master Entities
  categories: Category[];
  vendors: Vendor[];
  products: Product[];
  masterOrders: MasterOrder[];
  maintenanceRecords: MaintenanceRecord[];
  auditLogs: AuditLog[];
  systemHealth: SystemHealth;
  featureFlags: FeatureFlags;

  // Filters & State
  bookingDates: BookingDatesState;
  setBookingDates: (dates: BookingDatesState) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategoryFilter: string | null;
  setSelectedCategoryFilter: (id: string | null) => void;
  selectedVendorFilter: string | null;
  setSelectedVendorFilter: (id: string | null) => void;

  // UI Modals
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isDatePickerOpen: boolean;
  setIsDatePickerOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isCustomerOrdersOpen: boolean;
  setIsCustomerOrdersOpen: (open: boolean) => void;
  activeProductModal: Product | null;
  setActiveProductModal: (prod: Product | null) => void;

  // Cart
  cartItems: CartItem[];
  cartCalculation: CartCalculation;
  cartCount: number;
  addToCart: (product: Product, quantity?: number, customDates?: { startDate: string; endDate: string }) => void;
  updateCartQty: (itemId: string, qty: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;

  // Order Operations
  placeOrder: (customer: CheckoutCustomerInfo, paymentMethod: any, paymentId: string) => MasterOrder;
  updateOrderStatus: (vendorOrderId: string, newStatus: VendorOrderStatus, manifest?: DispatchManifest) => void;
  processReturnInspection: (
    vendorOrderId: string,
    returnData: { missingDamagedCount: number; damageNotes: string; penaltyFee: number; action: 'restock' | 'send_to_maintenance' }
  ) => void;

  // Vendor Operations
  addNewProduct: (product: Partial<Product>) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  addMaintenanceItem: (item: Partial<MaintenanceRecord>) => void;
  resolveMaintenanceItem: (recordId: string, status: MaintenanceStatus, cost?: number) => void;
  requestVendorPayout: (vendorId: string, amount: number) => void;

  // Admin Operations
  updateVendorKycStatus: (vendorId: string, status: VendorStatus) => void;
  updateVendorCommission: (vendorId: string, commissionPct: number) => void;
  approveVendorPayout: (vendorId: string, amount: number) => void;
  toggleProductFeatured: (productId: string) => void;

  // Developer Operations
  developerToken: string | null;
  loginDeveloper: (email: string, pass: string, secretCode: string) => DeveloperAuthResult;
  logoutDeveloper: () => void;
  toggleFeatureFlag: (flagKey: keyof FeatureFlags) => void;
  resetToSeedData: () => void;

  // Notifications
  toasts: ToastMessage[];
  addToast: (type: 'success' | 'info' | 'error' | 'warning', title: string, description?: string) => void;
  removeToast: (id: string) => void;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Roles & Users
  const [role, setRoleState] = useState<UserRole>('customer');
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[0]); // Customer by default
  const [activeVendorId, setActiveVendorId] = useState<string>('ven-royal');

  // 2. Data Collections
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [vendors, setVendors] = useState<Vendor[]>(INITIAL_VENDORS);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [masterOrders, setMasterOrders] = useState<MasterOrder[]>(INITIAL_MASTER_ORDERS);
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>(INITIAL_MAINTENANCE);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [systemHealth, setSystemHealth] = useState<SystemHealth>(INITIAL_HEALTH);
  const [featureFlags, setFeatureFlags] = useState<FeatureFlags>(INITIAL_FEATURE_FLAGS);

  // 3. Developer Auth Token (never exposed in persistent storage)
  const [developerToken, setDeveloperToken] = useState<string | null>(null);

  // 4. Booking Dates & City
  const defaultStart = new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0];
  const defaultEnd = new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0];
  const initialDuration = calculateDurationDays(defaultStart, defaultEnd);

  const [bookingDates, setBookingDates] = useState<BookingDatesState>({
    startDate: defaultStart,
    endDate: defaultEnd,
    durationDays: initialDuration.durationDays,
    billedDays: initialDuration.billedDays,
  });

  const [selectedCity, setSelectedCity] = useState<string>('Kochi');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);
  const [selectedVendorFilter, setSelectedVendorFilter] = useState<string | null>(null);

  // 5. UI Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCustomerOrdersOpen, setIsCustomerOrdersOpen] = useState(false);
  const [activeProductModal, setActiveProductModal] = useState<Product | null>(null);

  // 6. Cart Items
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // 7. Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'info' | 'error' | 'warning', title: string, description?: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Derive active vendor
  const activeVendor = useMemo(() => {
    return vendors.find((v) => v.id === activeVendorId) || vendors[0];
  }, [vendors, activeVendorId]);

  // Sync role switch with currentUser mock
  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    const targetUser = MOCK_USERS.find((u: User) => u.role === newRole) || MOCK_USERS[0];
    setCurrentUser(targetUser);

    // If switching to vendor role, ensure active vendor is set
    if (newRole === 'vendor') {
      const v = vendors.find((vend) => vend.userId === targetUser.id) || vendors[0];
      if (v) setActiveVendorId(v.id);
    }

    addToast('info', `Switched Role to ${newRole.toUpperCase()}`, `Now viewing interface as ${targetUser.fullName}`);
  };

  // Cart Calculation
  const cartCalculation = useMemo(() => {
    return calculateCart(cartItems);
  }, [cartItems]);

  const cartCount = useMemo(() => {
    return cartItems.reduce((acc, ci) => acc + ci.quantity, 0);
  }, [cartItems]);

  // Cart Actions
  const addToCart = (product: Product, quantity = 1, customDates?: { startDate: string; endDate: string }) => {
    const sDate = customDates?.startDate || bookingDates.startDate;
    const eDate = customDates?.endDate || bookingDates.endDate;
    const { durationDays, billedDays } = calculateDurationDays(sDate, eDate);

    // Stock check
    if (quantity > product.availableQuantity) {
      addToast('error', 'Stock Limit Exceeded', `Only ${product.availableQuantity} units available.`);
      return;
    }

    setCartItems((prev) => {
      const existing = prev.find((ci) => ci.product.id === product.id);
      if (existing) {
        const newQty = existing.quantity + quantity;
        if (newQty > product.availableQuantity) {
          addToast('warning', 'Max Available Quantity Reached', `Cart adjusted to ${product.availableQuantity} units`);
          return prev.map((ci) => (ci.product.id === product.id ? { ...ci, quantity: product.availableQuantity } : ci));
        }
        return prev.map((ci) => (ci.product.id === product.id ? { ...ci, quantity: newQty } : ci));
      }
      const newItem: CartItem = {
        id: `cart-${product.id}-${Date.now()}`,
        product,
        quantity,
        startDate: sDate,
        endDate: eDate,
        durationDays,
        billedDays,
      };
      return [...prev, newItem];
    });

    addToast(
      'success',
      `Added ${product.name} to Cart`,
      `${quantity} unit(s) • ${durationDays} days (${billedDays} billed) • ₹${(product.rentalPrice * billedDays * quantity).toLocaleString('en-IN')}`
    );
  };

  const updateCartQty = (itemId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((ci) => {
        if (ci.id === itemId) {
          const clampedQty = Math.min(qty, ci.product.availableQuantity);
          return { ...ci, quantity: clampedQty };
        }
        return ci;
      })
    );
  };

  const removeFromCart = (itemId: string) => {
    setCartItems((prev) => prev.filter((ci) => ci.id !== itemId));
    addToast('info', 'Item Removed from Cart');
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Place Master Order with child vendor orders
  const placeOrder = (
    customer: CheckoutCustomerInfo,
    paymentMethod: any,
    paymentId: string
  ): MasterOrder => {
    const newMasterOrder = createMasterOrder({
      customer,
      cartCalc: cartCalculation,
      paymentMethod,
      paymentTransactionId: paymentId,
      vendors,
    });

    // 1. Save master order
    setMasterOrders((prev) => [newMasterOrder, ...prev]);

    // 2. Decrement available stock for ordered products
    setProducts((prev) =>
      prev.map((prod) => {
        const cartItem = cartItems.find((ci) => ci.product.id === prod.id);
        if (cartItem) {
          const newAvail = Math.max(0, prod.availableQuantity - cartItem.quantity);
          return { ...prod, availableQuantity: newAvail };
        }
        return prod;
      })
    );

    // 3. Update vendor stats (totalEarnings, activeRentals)
    setVendors((prev) =>
      prev.map((v) => {
        const vOrder = newMasterOrder.vendorOrders.find((vo) => vo.vendorId === v.id);
        if (vOrder) {
          return {
            ...v,
            activeRentals: v.activeRentals + vOrder.items.reduce((s, it) => s + it.quantity, 0),
            totalEarnings: v.totalEarnings + vOrder.vendorPayoutAmount,
            availableBalance: v.availableBalance + vOrder.vendorPayoutAmount,
          };
        }
        return v;
      })
    );

    // 4. Log Audit Event
    const log = createAuditLog(
      currentUser.id,
      currentUser.fullName,
      currentUser.role,
      `Placed Master Order ${newMasterOrder.orderNumber} (Split into ${newMasterOrder.vendorOrders.length} vendor orders)`,
      'order',
      newMasterOrder.id,
      `Grand Total: ₹${newMasterOrder.grandTotal.toLocaleString('en-IN')}, Txn: ${paymentId}`
    );
    setAuditLogs((prev) => [log, ...prev]);

    // 5. Clear cart & close checkout
    clearCart();
    setIsCheckoutOpen(false);

    addToast(
      'success',
      'Booking Confirmed!',
      `Master Order ${newMasterOrder.orderNumber} successfully processed for ₹${newMasterOrder.grandTotal.toLocaleString('en-IN')}`
    );

    return newMasterOrder;
  };

  // Update Vendor Order Status
  const updateOrderStatus = (vendorOrderId: string, newStatus: VendorOrderStatus, manifest?: DispatchManifest) => {
    setMasterOrders((prev) =>
      prev.map((master) => {
        const hasOrder = master.vendorOrders.some((vo) => vo.id === vendorOrderId);
        if (!hasOrder) return master;

        const updatedVendorOrders = master.vendorOrders.map((vo) => {
          if (vo.id === vendorOrderId) {
            return updateVendorOrderStatus(vo, newStatus, manifest);
          }
          return vo;
        });

        // Determine master order status rollup
        const allCompleted = updatedVendorOrders.every((vo) => ['completed', 'returned'].includes(vo.status));
        const allCancelled = updatedVendorOrders.every((vo) => vo.status === 'cancelled');
        let newMasterStatus = master.status;
        if (allCompleted) newMasterStatus = 'completed';
        else if (allCancelled) newMasterStatus = 'cancelled';
        else if (updatedVendorOrders.some((vo) => ['out_for_delivery', 'rented'].includes(vo.status))) {
          newMasterStatus = 'partially_dispatched';
        }

        return {
          ...master,
          status: newMasterStatus,
          vendorOrders: updatedVendorOrders,
        };
      })
    );

    const log = createAuditLog(
      currentUser.id,
      currentUser.fullName,
      currentUser.role,
      `Updated Order Status to ${newStatus}`,
      'order',
      vendorOrderId,
      manifest ? `Dispatch Manifest: Vehicle ${manifest.vehicleNumber}, Driver ${manifest.driverName}` : 'Status step change'
    );
    setAuditLogs((prev) => [log, ...prev]);

    addToast('success', 'Order Status Updated', `Order #${vendorOrderId} set to "${newStatus.toUpperCase()}"`);
  };

  // Process Return Inspection
  const processReturnInspection = (
    vendorOrderId: string,
    returnData: { missingDamagedCount: number; damageNotes: string; penaltyFee: number; action: 'restock' | 'send_to_maintenance' }
  ) => {
    let targetVendorOrder: VendorOrder | undefined;

    setMasterOrders((prev) =>
      prev.map((master) => {
        const vo = master.vendorOrders.find((o) => o.id === vendorOrderId);
        if (vo) {
          targetVendorOrder = vo;
          const updatedVO: VendorOrder = {
            ...vo,
            status: 'completed',
          };
          return {
            ...master,
            vendorOrders: master.vendorOrders.map((o) => (o.id === vendorOrderId ? updatedVO : o)),
          };
        }
        return master;
      })
    );

    if (targetVendorOrder) {
      // If items damaged, add to maintenance records
      if (returnData.missingDamagedCount > 0 && returnData.action === 'send_to_maintenance') {
        const firstItem = targetVendorOrder.items[0];
        const newRecord: MaintenanceRecord = {
          id: `maint-${Date.now()}`,
          vendorId: targetVendorOrder.vendorId,
          productId: firstItem.productId,
          productName: firstItem.productName,
          productImage: firstItem.productImage,
          itemCode: firstItem.itemCode,
          quantity: returnData.missingDamagedCount,
          location: 'Main Warehouse - Bay 2 (Repair)',
          status: 'in_repair',
          damageDescription: returnData.damageNotes,
          damageRecoveryFee: returnData.penaltyFee,
          repairCost: returnData.penaltyFee,
          reportedDate: new Date().toISOString(),
        };

        setMaintenanceRecords((prev) => [newRecord, ...prev]);

        // Put in repair
        setProducts((prev) =>
          prev.map((p) => {
            if (p.id === firstItem.productId) {
              return {
                ...p,
                inRepairQuantity: (p.inRepairQuantity || 0) + returnData.missingDamagedCount,
              };
            }
            return p;
          })
        );
      } else {
        // Restock available quantity
        targetVendorOrder.items.forEach((item) => {
          setProducts((prev) =>
            prev.map((p) => {
              if (p.id === item.productId) {
                return {
                  ...p,
                  availableQuantity: Math.min(p.totalQuantity, p.availableQuantity + item.quantity),
                };
              }
              return p;
            })
          );
        });
      }
    }

    addToast('success', 'Return Inspection Completed', 'Inventory updated and security deposit reconciled');
  };

  // Vendor Inventory Operations
  const addNewProduct = (prodData: Partial<Product>) => {
    const newId = `prod-${Date.now()}`;
    const vendor = vendors.find((v) => v.id === activeVendorId) || vendors[0];
    const category = categories.find((c) => c.id === prodData.categoryId) || categories[0];

    const newProduct: Product = {
      id: newId,
      vendorId: vendor.id,
      vendorName: vendor.businessName,
      vendorRating: vendor.rating,
      categoryId: category.id,
      categoryName: category.name,
      name: prodData.name || 'New Rental Prop',
      slug: (prodData.name || 'new-rental-prop').toLowerCase().replace(/\s+/g, '-'),
      description: prodData.description || 'Premium event rental decor piece.',
      specs: prodData.specs || { Material: 'High-Grade Metal', Finish: 'Polished' },
      itemCode: prodData.itemCode || `AGC-${Math.floor(1000 + Math.random() * 9000)}`,
      rentalPrice: prodData.rentalPrice || 500,
      pricingUnit: prodData.pricingUnit || 'per_day',
      securityDeposit: prodData.securityDeposit || 1000,
      minDurationDays: 1,
      maxDurationDays: 30,
      dimension: prodData.dimension || '12 x 12 x 24 in',
      totalQuantity: prodData.totalQuantity || 10,
      availableQuantity: prodData.totalQuantity || 10,
      inRepairQuantity: 0,
      primaryImageUrl: prodData.primaryImageUrl || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
      imageUrls: prodData.imageUrls || [
        prodData.primaryImageUrl || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
      ],
      tags: prodData.tags || ['decor', 'rental', 'wedding'],
      location: prodData.location || `${vendor.city}, ${vendor.state}`,
      deliveryAvailable: true,
      deliveryCharge: prodData.deliveryCharge || 500,
      pickupAvailable: true,
      status: 'active',
      rating: 5.0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
    };

    setProducts((prev) => [newProduct, ...prev]);

    // Increment vendor count
    setVendors((prev) =>
      prev.map((v) => (v.id === vendor.id ? { ...v, totalProducts: v.totalProducts + 1 } : v))
    );

    const log = createAuditLog(
      currentUser.id,
      currentUser.fullName,
      currentUser.role,
      `Created Product ${newProduct.name} (${newProduct.itemCode})`,
      'product',
      newProduct.id,
      `Rate: ₹${newProduct.rentalPrice}/day, Qty: ${newProduct.totalQuantity}`
    );
    setAuditLogs((prev) => [log, ...prev]);

    addToast('success', 'Product Published to Catalog', `${newProduct.name} is now live for rental bookings`);
  };

  const updateProduct = (productId: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          return { ...p, ...updates };
        }
        return p;
      })
    );
    addToast('info', 'Product Updated Successfully');
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    addToast('warning', 'Product Removed from Catalog');
  };

  // Maintenance Operations
  const addMaintenanceItem = (item: Partial<MaintenanceRecord>) => {
    const record: MaintenanceRecord = {
      id: `maint-${Date.now()}`,
      vendorId: activeVendorId,
      productId: item.productId || 'prod-custom',
      productName: item.productName || 'Damaged Prop Item',
      productImage: item.productImage || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
      itemCode: item.itemCode || 'AGC-DAM-01',
      quantity: item.quantity || 1,
      location: item.location || 'Warehouse Repair Dock',
      status: 'in_repair',
      damageDescription: item.damageDescription || 'Polishing required',
      damageRecoveryFee: item.damageRecoveryFee || 500,
      repairCost: item.repairCost || 500,
      reportedDate: new Date().toISOString(),
    };

    setMaintenanceRecords((prev) => [record, ...prev]);
    addToast('info', 'Logged to Maintenance Pool', `Moved ${record.quantity} unit(s) to repair workflow`);
  };

  const resolveMaintenanceItem = (recordId: string, status: MaintenanceStatus, cost?: number) => {
    setMaintenanceRecords((prev) =>
      prev.map((rec) => {
        if (rec.id === recordId) {
          return {
            ...rec,
            status,
            repairCost: cost !== undefined ? cost : rec.repairCost,
            resolvedDate: new Date().toISOString(),
          };
        }
        return rec;
      })
    );

    // If marked repaired, restore available stock
    const target = maintenanceRecords.find((m) => m.id === recordId);
    if (target && status === 'repaired') {
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id === target.productId) {
            return {
              ...p,
              availableQuantity: Math.min(p.totalQuantity, p.availableQuantity + target.quantity),
              inRepairQuantity: Math.max(0, (p.inRepairQuantity || 0) - target.quantity),
            };
          }
          return p;
        })
      );
    }

    addToast('success', 'Maintenance Stage Updated', `Item transitioned to ${status.toUpperCase()}`);
  };

  // Vendor Payouts
  const requestVendorPayout = (vendorId: string, amount: number) => {
    setVendors((prev) =>
      prev.map((v) => {
        if (v.id === vendorId) {
          if (v.availableBalance < amount) {
            addToast('error', 'Insufficient Balance', `Available balance is ₹${v.availableBalance.toLocaleString('en-IN')}`);
            return v;
          }
          return {
            ...v,
            availableBalance: v.availableBalance - amount,
            pendingPayouts: v.pendingPayouts + amount,
          };
        }
        return v;
      })
    );
    addToast('success', 'Payout Request Submitted', `₹${amount.toLocaleString('en-IN')} queued for platform admin approval`);
  };

  // Admin Operations
  const updateVendorKycStatus = (vendorId: string, status: VendorStatus) => {
    setVendors((prev) =>
      prev.map((v) => (v.id === vendorId ? { ...v, status } : v))
    );
    const log = createAuditLog(
      currentUser.id,
      currentUser.fullName,
      currentUser.role,
      `Updated Vendor KYC Status to ${status}`,
      'vendor',
      vendorId,
      `Status set to ${status}`
    );
    setAuditLogs((prev) => [log, ...prev]);
    addToast('info', 'Vendor KYC Updated', `Vendor status is now ${status.toUpperCase()}`);
  };

  const updateVendorCommission = (vendorId: string, commissionPct: number) => {
    setVendors((prev) =>
      prev.map((v) => (v.id === vendorId ? { ...v, commissionRatePct: commissionPct } : v))
    );
    addToast('success', 'Commission Rate Updated', `New commission: ${commissionPct}%`);
  };

  const approveVendorPayout = (vendorId: string, amount: number) => {
    setVendors((prev) =>
      prev.map((v) => {
        if (v.id === vendorId) {
          return {
            ...v,
            pendingPayouts: Math.max(0, v.pendingPayouts - amount),
          };
        }
        return v;
      })
    );
    addToast('success', 'Payout Dispatched via Bank Transfer', `₹${amount.toLocaleString('en-IN')} approved and settled`);
  };

  const toggleProductFeatured = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, featured: !p.featured } : p))
    );
  };

  // Developer Operations
  const loginDeveloper = (email: string, pass: string, secretCode: string): DeveloperAuthResult => {
    const res = verifyDeveloperCredentials(email, pass, secretCode);
    if (res.success && res.token) {
      setDeveloperToken(res.token);
      setRole('developer');
      const devUser = MOCK_USERS.find((u: User) => u.role === 'developer') || currentUser;
      setCurrentUser(devUser);
      addToast('success', 'Developer Control Room Unlocked', 'Authenticated with ROOT permissions.');
    } else {
      addToast('error', 'Developer Authentication Failed', res.message);
    }
    return res;
  };

  const logoutDeveloper = () => {
    setDeveloperToken(null);
    setRole('customer');
    addToast('info', 'Developer Session Terminated');
  };

  const toggleFeatureFlag = (flagKey: keyof FeatureFlags) => {
    setFeatureFlags((prev) => {
      const updated = { ...prev, [flagKey]: !prev[flagKey] };
      addToast('info', `Feature Flag: ${flagKey}`, `Toggled to ${updated[flagKey] ? 'ENABLED' : 'DISABLED'}`);
      return updated;
    });
  };

  const resetToSeedData = () => {
    setCategories(INITIAL_CATEGORIES);
    setVendors(INITIAL_VENDORS);
    setProducts(INITIAL_PRODUCTS);
    setMasterOrders(INITIAL_MASTER_ORDERS);
    setMaintenanceRecords(INITIAL_MAINTENANCE);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setFeatureFlags(INITIAL_FEATURE_FLAGS);
    setCartItems([]);
    addToast('warning', 'Database Reset', 'All entities restored to initial seed state.');
  };

  // Periodic Telemetry heartbeat
  useEffect(() => {
    const timer = setInterval(() => {
      setSystemHealth((prev) => getUpdatedSystemHealth(prev));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <MarketplaceContext.Provider
      value={{
        role,
        setRole,
        currentUser,
        setCurrentUser,
        activeVendorId,
        setActiveVendorId,
        activeVendor,
        categories,
        vendors,
        products,
        masterOrders,
        maintenanceRecords,
        auditLogs,
        systemHealth,
        featureFlags,
        bookingDates,
        setBookingDates,
        selectedCity,
        setSelectedCity,
        searchQuery,
        setSearchQuery,
        selectedCategoryFilter,
        setSelectedCategoryFilter,
        selectedVendorFilter,
        setSelectedVendorFilter,
        isCartOpen,
        setIsCartOpen,
        isDatePickerOpen,
        setIsDatePickerOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isCustomerOrdersOpen,
        setIsCustomerOrdersOpen,
        activeProductModal,
        setActiveProductModal,
        cartItems,
        cartCalculation,
        cartCount,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        placeOrder,
        updateOrderStatus,
        processReturnInspection,
        addNewProduct,
        updateProduct,
        deleteProduct,
        addMaintenanceItem,
        resolveMaintenanceItem,
        requestVendorPayout,
        updateVendorKycStatus,
        updateVendorCommission,
        approveVendorPayout,
        toggleProductFeatured,
        developerToken,
        loginDeveloper,
        logoutDeveloper,
        toggleFeatureFlag,
        resetToSeedData,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
};
