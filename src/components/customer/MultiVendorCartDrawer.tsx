import React from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Store,
  Shield,
  Truck,
  ArrowRight,
  Info,
  Sparkles,
} from 'lucide-react';

export const MultiVendorCartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cartItems,
    cartCalculation,
    updateCartQty,
    removeFromCart,
    clearCart,
    setIsCheckoutOpen,
    bookingDates,
  } = useMarketplace();

  if (!isCartOpen) return null;

  const {
    vendorGroups,
    totalRentalCost,
    totalDeliveryFee,
    totalSecurityDeposit,
    platformServiceFee,
    taxAmount,
    grandTotal,
  } = cartCalculation;

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      justifyContent: 'flex-end',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        width: '100%',
        maxWidth: '560px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-10px 0 30px rgba(0,0,0,0.2)',
        animation: 'slideInRight 0.25s ease-out',
        position: 'relative',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e7e5e4',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#fafaf9',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: '#ecfdf5',
              color: '#065f46',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <ShoppingBag size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1c1917', margin: 0 }}>
                Multi-Vendor Rental Cart
              </h3>
              <p style={{ fontSize: '12px', color: '#78716c', margin: 0 }}>
                {cartItems.length} unique items across {vendorGroups.length} verified vendors
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {cartItems.length > 0 && (
              <button
                onClick={clearCart}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#dc2626',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '4px 8px',
                }}
              >
                Clear Cart
              </button>
            )}
            <button
              onClick={() => setIsCartOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: '#78716c',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '6px',
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Cart Content: Grouped by Vendor */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {cartItems.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#f5f5f4',
                color: '#a8a29e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}>
                <ShoppingBag size={32} />
              </div>
              <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#1c1917', marginBottom: '6px' }}>
                Your Rental Cart is Empty
              </h4>
              <p style={{ fontSize: '13px', color: '#78716c', marginBottom: '20px' }}>
                Browse our catalog of luxury banquet chairs, crystal chandeliers, brass props, and table settings.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  backgroundColor: '#065f46',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Explore Rental Catalog
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Event Dates Reminder */}
              <div style={{
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '10px',
                padding: '10px 14px',
                fontSize: '12px',
                color: '#065f46',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <span>
                  Event Dates: <strong>{bookingDates.startDate} to {bookingDates.endDate}</strong> ({bookingDates.durationDays} Days, {bookingDates.billedDays} Billed)
                </span>
                <span style={{ fontWeight: 700 }}>
                  {bookingDates.billedDays}x Rate Applied
                </span>
              </div>

              {/* Vendor Groups */}
              {vendorGroups.map((group) => (
                <div
                  key={group.vendorId}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e7e5e4',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                  }}
                >
                  {/* Vendor Group Header */}
                  <div style={{
                    padding: '12px 16px',
                    backgroundColor: '#fafaf9',
                    borderBottom: '1px solid #e7e5e4',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Store size={16} style={{ color: '#065f46' }} />
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#1c1917' }}>
                        {group.vendorName}
                      </span>
                      <span style={{ fontSize: '11px', color: '#78716c' }}>({group.vendorLocation})</span>
                    </div>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      backgroundColor: '#ecfdf5',
                      color: '#065f46',
                      padding: '2px 8px',
                      borderRadius: '9999px',
                    }}>
                      Independent Dispatch
                    </span>
                  </div>

                  {/* Items list */}
                  <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {group.items.map((item) => {
                      const itemRental = item.product.rentalPrice * (item.billedDays || 1) * item.quantity;
                      const itemDeposit = item.product.securityDeposit * item.quantity;

                      return (
                        <div
                          key={item.id}
                          style={{
                            display: 'flex',
                            gap: '12px',
                            paddingBottom: '12px',
                            borderBottom: '1px solid #f5f5f4',
                          }}
                        >
                          <img
                            src={item.product.primaryImageUrl}
                            alt={item.product.name}
                            style={{
                              width: '64px',
                              height: '64px',
                              borderRadius: '8px',
                              objectFit: 'cover',
                              backgroundColor: '#f5f5f4',
                              flexShrink: 0,
                            }}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <h5 style={{ fontSize: '13px', fontWeight: 700, color: '#1c1917', margin: '0 0 2px' }}>
                                {item.product.name}
                              </h5>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: '#a8a29e',
                                  cursor: 'pointer',
                                  padding: '2px',
                                }}
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>

                            <div style={{ fontSize: '11px', color: '#78716c', marginBottom: '8px' }}>
                              ₹{item.product.rentalPrice}/day × {item.billedDays} days • Deposit: ₹{item.product.securityDeposit}/ea
                            </div>

                            {/* Qty row & price */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                backgroundColor: '#f5f5f4',
                                borderRadius: '6px',
                                border: '1px solid #e7e5e4',
                              }}>
                                <button
                                  onClick={() => updateCartQty(item.id, item.quantity - 1)}
                                  style={{
                                    padding: '2px 8px',
                                    border: 'none',
                                    background: 'none',
                                    cursor: 'pointer',
                                    fontWeight: 700,
                                  }}
                                >
                                  -
                                </button>
                                <span style={{ fontSize: '12px', fontWeight: 700, padding: '0 4px' }}>
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateCartQty(item.id, item.quantity + 1)}
                                  style={{
                                    padding: '2px 8px',
                                    border: 'none',
                                    background: 'none',
                                    cursor: 'pointer',
                                    fontWeight: 700,
                                  }}
                                >
                                  +
                                </button>
                              </div>

                              <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '13px', fontWeight: 800, color: '#065f46' }}>
                                  ₹{itemRental.toLocaleString('en-IN')}
                                </div>
                                <div style={{ fontSize: '10px', color: '#78716c' }}>
                                  +₹{itemDeposit.toLocaleString('en-IN')} deposit
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Vendor Subtotal Bar */}
                  <div style={{
                    backgroundColor: '#fafaf9',
                    padding: '10px 16px',
                    borderTop: '1px solid #e7e5e4',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '12px',
                  }}>
                    <div style={{ color: '#57534e' }}>
                      Delivery Fee: <strong style={{ color: '#1c1917' }}>₹{group.deliveryCharge}</strong> • Deposit: <strong style={{ color: '#065f46' }}>₹{group.securityDeposit.toLocaleString('en-IN')}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#78716c', marginRight: '4px' }}>Vendor Total:</span>
                      <strong style={{ fontSize: '13px', color: '#1c1917' }}>
                        ₹{group.vendorTotal.toLocaleString('en-IN')}
                      </strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer: Order Summary & Checkout */}
        {cartItems.length > 0 && (
          <div style={{
            padding: '20px 24px',
            backgroundColor: '#ffffff',
            borderTop: '1px solid #e7e5e4',
            boxShadow: '0 -4px 15px rgba(0,0,0,0.05)',
          }}>
            {/* Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#57534e' }}>
                <span>Rental Subtotal ({cartItems.length} items):</span>
                <span>₹{totalRentalCost.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#57534e' }}>
                <span>Vendor Logistics & Dedicated Trucking:</span>
                <span>₹{totalDeliveryFee.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#57534e' }}>
                <span>Platform Booking & Escrow Protection Fee:</span>
                <span>₹{platformServiceFee.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#57534e' }}>
                <span>GST (18% - CGST 9% + SGST 9%):</span>
                <span>₹{taxAmount.toLocaleString('en-IN')}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                color: '#065f46',
                fontWeight: 700,
                backgroundColor: '#ecfdf5',
                padding: '6px 10px',
                borderRadius: '6px',
                margin: '4px 0',
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Shield size={14} /> Refundable Security Deposit (Escrow):
                </span>
                <span>₹{totalSecurityDeposit.toLocaleString('en-IN')}</span>
              </div>

              {/* Grand Total */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                paddingTop: '8px',
                borderTop: '1px solid #e7e5e4',
              }}>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#1c1917' }}>Grand Total</div>
                  <div style={{ fontSize: '11px', color: '#78716c' }}>
                    Includes 18% GST + Refundable Deposit
                  </div>
                </div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#065f46' }}>
                  ₹{grandTotal.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={handleProceedToCheckout}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '10px',
                backgroundColor: '#065f46',
                color: '#ffffff',
                border: 'none',
                fontSize: '15px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(6, 95, 70, 0.3)',
              }}
            >
              <span>Proceed to Event Checkout</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
