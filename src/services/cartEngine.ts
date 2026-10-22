import { CartItem, VendorCartGroup, CartCalculation } from '../types/marketplace';

export const PLATFORM_SERVICE_FEE = 199;
export const GST_RATE = 0.18; // 18% GST

/**
 * Calculates calendar days and billed rental days between two dates (inclusive)
 */
export function calculateDurationDays(startDateStr: string, endDateStr: string): { durationDays: number; billedDays: number } {
  if (!startDateStr || !endDateStr) {
    return { durationDays: 1, billedDays: 1 };
  }
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  const diffTime = Math.max(0, end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // inclusive
  const durationDays = Math.max(1, diffDays);
  const billedDays = durationDays;
  return { durationDays, billedDays };
}

/**
 * Groups raw cart items by vendorId and calculates item subtotals, vendor delivery, and vendor security deposit
 */
export function calculateCart(items: CartItem[]): CartCalculation {
  if (items.length === 0) {
    return {
      vendorGroups: [],
      totalRentalCost: 0,
      totalDeliveryFee: 0,
      totalSecurityDeposit: 0,
      platformServiceFee: 0,
      taxAmount: 0,
      discountAmount: 0,
      grandTotal: 0,
    };
  }

  const groupsMap = new Map<string, { vendorName: string; vendorLocation: string; items: CartItem[]; deliveryCharge: number }>();

  let totalRentalCost = 0;
  let totalSecurityDeposit = 0;

  for (const item of items) {
    const vId = item.product.vendorId;
    if (!groupsMap.has(vId)) {
      groupsMap.set(vId, {
        vendorName: item.product.vendorName,
        vendorLocation: item.product.location || 'Kochi, Kerala',
        items: [],
        deliveryCharge: item.product.deliveryCharge || 500,
      });
    }

    const group = groupsMap.get(vId)!;
    group.items.push(item);

    const itemRentalTotal = item.product.rentalPrice * (item.billedDays || 1) * item.quantity;
    const itemDepositTotal = (item.product.securityDeposit || 0) * item.quantity;

    totalRentalCost += itemRentalTotal;
    totalSecurityDeposit += itemDepositTotal;
  }

  let totalDeliveryFee = 0;
  const vendorGroups: VendorCartGroup[] = [];

  for (const [vendorId, groupData] of groupsMap.entries()) {
    let groupSubtotal = 0;
    let groupDeposit = 0;

    for (const it of groupData.items) {
      groupSubtotal += it.product.rentalPrice * (it.billedDays || 1) * it.quantity;
      groupDeposit += (it.product.securityDeposit || 0) * it.quantity;
    }

    const deliveryCharge = groupData.deliveryCharge;
    totalDeliveryFee += deliveryCharge;
    const vendorTotal = groupSubtotal + groupDeposit + deliveryCharge;

    vendorGroups.push({
      vendorId,
      vendorName: groupData.vendorName,
      vendorLocation: groupData.vendorLocation,
      items: groupData.items,
      subtotal: groupSubtotal,
      deliveryCharge,
      securityDeposit: groupDeposit,
      vendorTotal,
    });
  }

  const taxableAmount = totalRentalCost + totalDeliveryFee + PLATFORM_SERVICE_FEE;
  const taxAmount = Math.round(taxableAmount * GST_RATE);
  const discountAmount = 0;
  const grandTotal = totalRentalCost + totalDeliveryFee + PLATFORM_SERVICE_FEE + taxAmount + totalSecurityDeposit;

  return {
    vendorGroups,
    totalRentalCost,
    totalDeliveryFee,
    totalSecurityDeposit,
    platformServiceFee: PLATFORM_SERVICE_FEE,
    taxAmount,
    discountAmount,
    grandTotal,
  };
}
