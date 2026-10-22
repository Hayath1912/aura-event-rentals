import {
  CartCalculation,
  MasterOrder,
  VendorOrder,
  OrderItem,
  VendorOrderStatus,
  DispatchManifest,
  Vendor
} from '../types/marketplace';

export interface CheckoutCustomerInfo {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  venueName?: string;
}

export interface CreateOrderParams {
  customer: CheckoutCustomerInfo;
  cartCalc: CartCalculation;
  paymentMethod: 'upi' | 'card' | 'netbanking' | 'wallet' | 'cash_on_delivery';
  paymentTransactionId: string;
  vendors: Vendor[];
}

/**
 * Creates 1 MasterOrder and splits it into child VendorOrders per vendor group.
 */
export function createMasterOrder({
  customer,
  cartCalc,
  paymentMethod,
  paymentTransactionId,
  vendors,
}: CreateOrderParams): MasterOrder {
  const now = new Date();
  const dateSuffix = Math.floor(1000 + Math.random() * 9000);
  const masterId = `ord-${Date.now()}`;
  const orderNumber = `AGC-ORD-2026-${dateSuffix}`;

  const vendorOrders: VendorOrder[] = cartCalc.vendorGroups.map((group, index) => {
    const vOrderCode = `AGC-VO-${dateSuffix}-${index + 1}`;
    const vendor = vendors.find((v) => v.id === group.vendorId);
    const commissionRate = vendor ? vendor.commissionRatePct : 10;
    const commissionAmount = Math.round((group.subtotal * commissionRate) / 100);
    const vendorPayoutAmount = group.subtotal - commissionAmount;

    // determine date bounds from items
    const startDate = group.items[0]?.startDate || now.toISOString().split('T')[0];
    const endDate = group.items[0]?.endDate || now.toISOString().split('T')[0];
    const durationDays = group.items[0]?.durationDays || 1;
    const billedDays = group.items[0]?.billedDays || 1;

    const items: OrderItem[] = group.items.map((it) => ({
      id: `oi-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      productId: it.product.id,
      productName: it.product.name,
      productImage: it.product.primaryImageUrl,
      itemCode: it.product.itemCode,
      quantity: it.quantity,
      unitPrice: it.product.rentalPrice,
      durationDays: it.durationDays,
      billedDays: it.billedDays,
      lineTotal: it.product.rentalPrice * (it.billedDays || 1) * it.quantity,
    }));

    return {
      id: `vo-${Date.now()}-${index}`,
      orderNumber: vOrderCode,
      masterOrderId: masterId,
      vendorId: group.vendorId,
      vendorName: group.vendorName,
      customerName: customer.name,
      customerPhone: customer.phone,
      customerAddress: customer.venueName ? `${customer.venueName}, ${customer.address}` : customer.address,
      items,
      startDate,
      endDate,
      durationDays,
      billedDays,
      subtotal: group.subtotal,
      deliveryFee: group.deliveryCharge,
      securityDeposit: group.securityDeposit,
      commissionAmount,
      vendorPayoutAmount,
      status: 'confirmed' as VendorOrderStatus,
      createdAt: now.toISOString(),
    };
  });

  return {
    id: masterId,
    orderNumber,
    customerId: customer.id,
    customerName: customer.name,
    customerPhone: customer.phone,
    customerEmail: customer.email,
    shippingAddress: customer.venueName ? `${customer.venueName}, ${customer.address}` : customer.address,
    vendorOrders,
    rentalSubtotal: cartCalc.totalRentalCost,
    deliveryFeeTotal: cartCalc.totalDeliveryFee,
    securityDepositTotal: cartCalc.totalSecurityDeposit,
    platformFee: cartCalc.platformServiceFee,
    gstTax: cartCalc.taxAmount,
    discount: cartCalc.discountAmount,
    grandTotal: cartCalc.grandTotal,
    paymentMethod,
    paymentStatus: 'paid',
    paymentTransactionId,
    status: 'confirmed',
    createdAt: now.toISOString(),
  };
}

/**
 * Updates a child vendor order status and optionally attaches dispatch manifest logistics
 */
export function updateVendorOrderStatus(
  order: VendorOrder,
  newStatus: VendorOrderStatus,
  manifest?: DispatchManifest
): VendorOrder {
  return {
    ...order,
    status: newStatus,
    logistics: manifest ? manifest : order.logistics,
  };
}
