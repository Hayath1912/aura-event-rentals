import { Product, MasterOrder } from '../types/marketplace';

export interface AvailabilityResult {
  isAvailable: boolean;
  availableQuantity: number;
  totalQuantity: number;
  conflictingReservedQty: number;
  status: 'available' | 'low_stock' | 'out_of_stock';
  message: string;
}

/**
 * Checks if two date ranges [s1, e1] and [s2, e2] overlap
 */
export function areDatesOverlapping(
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean {
  if (!start1 || !end1 || !start2 || !end2) return false;
  const s1 = new Date(start1).getTime();
  const e1 = new Date(end1).getTime();
  const s2 = new Date(start2).getTime();
  const e2 = new Date(end2).getTime();

  return s1 <= e2 && s2 <= e1;
}

/**
 * Calculates real-time available quantity of a product for given rental date span
 * by inspecting active Master Orders in 'confirmed', 'preparing', 'dispatched', or 'at_event' status.
 */
export function checkProductAvailability(
  product: Product,
  startDate: string,
  endDate: string,
  orders: MasterOrder[] = [],
  requestedQty: number = 1
): AvailabilityResult {
  let reservedQty = 0;

  for (const master of orders) {
    // Only count active orders that are holding inventory
    if (['cancelled', 'completed', 'refunded'].includes(master.paymentStatus) || master.status === 'cancelled') {
      continue;
    }

    for (const vOrder of master.vendorOrders) {
      if (['returned', 'inspected_and_closed', 'cancelled'].includes(vOrder.status)) {
        continue;
      }

      for (const item of vOrder.items) {
        if (item.productId === product.id) {
          // Check if order dates overlap with requested booking dates
          if (areDatesOverlapping(startDate, endDate, vOrder.startDate, vOrder.endDate)) {
            reservedQty += item.quantity;
          }
        }
      }
    }
  }

  // Usable stock is total stock minus inRepairQuantity and reservedQty
  const usableTotal = Math.max(0, product.totalQuantity - (product.inRepairQuantity || 0));
  const availableQuantity = Math.max(0, usableTotal - reservedQty);
  const isAvailable = availableQuantity >= requestedQty;

  let status: 'available' | 'low_stock' | 'out_of_stock' = 'available';
  let message = `${availableQuantity} units available for these dates`;

  if (availableQuantity === 0) {
    status = 'out_of_stock';
    message = 'Fully booked for selected dates';
  } else if (availableQuantity <= 5 || availableQuantity < requestedQty) {
    status = 'low_stock';
    message = `Only ${availableQuantity} units remaining for selected dates`;
  }

  return {
    isAvailable,
    availableQuantity,
    totalQuantity: product.totalQuantity,
    conflictingReservedQty: reservedQty,
    status,
    message,
  };
}
