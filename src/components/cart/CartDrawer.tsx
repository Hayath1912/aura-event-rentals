import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, Calendar, MessageCircle, ArrowRight } from 'lucide-react';
import { CartItem, BookingDates, Tenant } from '../../types';

interface CartDrawerProps {
  tenant: Tenant;
  cartItems: CartItem[];
  bookingDates: BookingDates;
  onClose: () => void;
  onUpdateQty: (itemId: string, qty: number) => void;
  onRemoveItem: (itemId: string) => void;
  onOpenDatePicker: () => void;
  onQuoteDispatched: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  tenant,
  cartItems,
  bookingDates,
  onClose,
  onUpdateQty,
  onRemoveItem,
  onOpenDatePicker,
  onQuoteDispatched,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [eventLocation, setEventLocation] = useState('');

  const duration = bookingDates.durationDays || 1;

  const subtotal = cartItems.reduce(
    (sum, ci) => sum + ci.item.rental_price * ci.quantity * duration,
    0
  );

  const handleWhatsAppCheckout = () => {
    if (cartItems.length === 0) return;

    // Generate formatted WhatsApp quotation message
    const dateText = bookingDates.startDate
      ? `📅 *Rental Dates:* ${bookingDates.startDate} to ${bookingDates.endDate} (${duration} Day${duration > 1 ? 's' : ''})\n`
      : `📅 *Rental Dates:* Pending Date Confirmation\n`;

    const customerText = customerName ? `👤 *Client Name:* ${customerName}\n📱 *Phone:* ${customerPhone || 'Not provided'}\n📍 *Venue/City:* ${eventLocation || 'TBD'}\n\n` : '';

    const itemsText = cartItems
      .map(
        (ci, i) =>
          `${i + 1}. *${ci.item.name}* (${ci.item.sku})\n   Qty: ${ci.quantity} | Rate: ₹${ci.item.rental_price}/d | Total: ₹${ci.item.rental_price * ci.quantity * duration}`
      )
      .join('\n\n');

    const totalText = `\n\n💰 *Estimated Total:* ₹${subtotal.toLocaleString('en-IN')}\n\n_Sent via ${tenant.name} Online Rental Storefront_`;

    const fullMessage = encodeURIComponent(
      `Hello ${tenant.name}! 👋 I would like to request a formal quotation and check availability for the following event rental items:\n\n${customerText}${dateText}\n*Selected Items:*\n${itemsText}${totalText}`
    );

    const waUrl = `https://wa.me/${tenant.whatsapp_number.replace(/[^0-9]/g, '')}?text=${fullMessage}`;

    onQuoteDispatched();
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="animate-fade-in"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        backgroundColor: 'rgba(0, 0, 0, 0.55)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        justifyContent: 'flex-end',
      }}
      onClick={onClose}
    >
      <div
        className="animate-slide-right"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '460px',
          height: '100%',
          backgroundColor: 'var(--color-surface)',
          boxShadow: 'var(--shadow-drawer)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-text)' }}>
              Rental Cart ({cartItems.length})
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
              {tenant.name}
            </span>
          </div>

          <button
            onClick={onClose}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-text-muted)',
              backgroundColor: 'var(--color-bg)',
            }}
            aria-label="Close cart"
          >
            <X size={18} />
          </button>
        </div>

        {/* Dates Banner */}
        <div
          style={{
            padding: '12px 24px',
            backgroundColor: bookingDates.startDate ? 'rgba(124, 58, 237, 0.08)' : 'var(--color-surface-muted)',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={16} color="var(--color-accent)" />
            <span style={{ fontSize: '12px', fontWeight: 600 }}>
              {bookingDates.startDate
                ? `${bookingDates.startDate} to ${bookingDates.endDate} (${duration} Days)`
                : 'No dates selected yet'}
            </span>
          </div>
          <button
            onClick={onOpenDatePicker}
            style={{
              fontSize: '12px',
              fontWeight: 700,
              color: 'var(--color-accent)',
              textDecoration: 'underline',
            }}
          >
            {bookingDates.startDate ? 'Change' : 'Select'}
          </button>
        </div>

        {/* Cart Item List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '64px 16px' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-surface-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto',
                  color: 'var(--color-text-muted)',
                }}
              >
                <Calendar size={28} />
              </div>
              <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>
                Your rental cart is empty
              </h4>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '20px' }}>
                Browse our catalog to select props and decor for your event.
              </p>
              <button
                onClick={onClose}
                style={{
                  padding: '10px 24px',
                  borderRadius: 'var(--radius-pill)',
                  backgroundColor: 'var(--color-accent)',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 700,
                }}
              >
                Browse Inventory
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {cartItems.map((ci) => {
                const itemTotal = ci.item.rental_price * ci.quantity * duration;
                return (
                  <div
                    key={ci.item.id}
                    style={{
                      display: 'flex',
                      gap: '14px',
                      padding: '12px',
                      borderRadius: 'var(--radius-lg)',
                      backgroundColor: 'var(--color-bg)',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    <img
                      src={ci.item.primary_image_url}
                      alt={ci.item.name}
                      style={{
                        width: '70px',
                        height: '70px',
                        objectFit: 'cover',
                        borderRadius: 'var(--radius-md)',
                      }}
                    />

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text)' }}>
                            {ci.item.name}
                          </h4>
                          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                            {ci.item.sku} {ci.item.dimension ? `• ${ci.item.dimension}` : ''}
                          </span>
                        </div>
                        <button
                          onClick={() => onRemoveItem(ci.item.id)}
                          style={{ color: 'var(--color-text-muted)', padding: '2px' }}
                          aria-label="Remove item"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                        {/* Qty Modifier */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: 'var(--color-surface)',
                          }}
                        >
                          <button
                            onClick={() => onUpdateQty(ci.item.id, ci.quantity - 1)}
                            style={{ width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            <Minus size={13} />
                          </button>
                          <span style={{ width: '28px', textAlign: 'center', fontSize: '12px', fontWeight: 700 }}>
                            {ci.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQty(ci.item.id, ci.quantity + 1)}
                            style={{ width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            <Plus size={13} />
                          </button>
                        </div>

                        {/* Price */}
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-text)' }}>
                            ₹{itemTotal.toLocaleString('en-IN')}
                          </span>
                          {duration > 1 && (
                            <span style={{ display: 'block', fontSize: '10px', color: 'var(--color-text-muted)' }}>
                              (₹{ci.item.rental_price}/d × {duration}d)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Checkout Section */}
        {cartItems.length > 0 && (
          <div
            style={{
              padding: '20px 24px',
              borderTop: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-surface)',
            }}
          >
            {/* Contact details for WhatsApp summary */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
              <input
                type="text"
                placeholder="Your Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  fontSize: '12px',
                  outline: 'none',
                }}
              />
              <input
                type="text"
                placeholder="Phone (Optional)"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  fontSize: '12px',
                  outline: 'none',
                }}
              />
            </div>
            <input
              type="text"
              placeholder="Event Venue / City (Optional)"
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                fontSize: '12px',
                outline: 'none',
                marginBottom: '16px',
              }}
            />

            {/* Subtotal */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px' }}>
              <span style={{ fontSize: '14px', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                Estimated Rental Total:
              </span>
              <span style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-text)' }}>
                ₹{subtotal.toLocaleString('en-IN')}
              </span>
            </div>

            {/* WhatsApp CTA */}
            <button
              onClick={handleWhatsAppCheckout}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '14px 20px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: '#25D366',
                color: '#ffffff',
                fontSize: '15px',
                fontWeight: 700,
                boxShadow: '0 4px 14px rgba(37, 211, 102, 0.4)',
                transition: 'transform 0.15s ease',
              }}
            >
              <MessageCircle size={18} />
              <span>Inquire on WhatsApp</span>
              <ArrowRight size={16} />
            </button>
            <span
              style={{
                display: 'block',
                textAlign: 'center',
                fontSize: '11px',
                color: 'var(--color-text-muted)',
                marginTop: '8px',
              }}
            >
              Direct chat with owner • Pre-filled items & dates
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
