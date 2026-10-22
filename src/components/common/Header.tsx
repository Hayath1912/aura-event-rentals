import React from 'react';
import { Calendar, ShoppingBag, User, Sparkles } from 'lucide-react';
import { Tenant, BookingDates } from '../../types';

interface HeaderProps {
  tenant: Tenant;
  bookingDates: BookingDates;
  cartCount: number;
  onOpenDatePicker: () => void;
  onOpenCart: () => void;
  onOpenProfile: () => void;
  onGoHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  tenant,
  bookingDates,
  cartCount,
  onOpenDatePicker,
  onOpenCart,
  onOpenProfile,
  onGoHome,
}) => {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.94)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--color-border)',
        height: '68px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        justifyContent: 'space-between',
        transition: 'box-shadow 0.2s ease',
      }}
    >
      {/* Brand Logo & Name */}
      <div
        onClick={onGoHome}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--color-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: 'var(--shadow-subtle)',
          }}
        >
          <Sparkles size={22} />
        </div>
        <div>
          <h1
            style={{
              fontSize: '19px',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: 'var(--color-text)',
              lineHeight: 1.1,
            }}
          >
            {tenant.name}
          </h1>
          <span
            style={{
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--color-text-muted)',
              fontWeight: 600,
            }}
          >
            Luxury Wedding & Event Rentals
          </span>
        </div>
      </div>

      {/* Action Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Date Selector Trigger */}
        <button
          onClick={onOpenDatePicker}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: 'var(--radius-pill)',
            border: bookingDates.startDate ? '1.5px solid var(--color-accent)' : '1px solid var(--color-border)',
            backgroundColor: bookingDates.startDate ? 'rgba(124, 58, 237, 0.08)' : 'var(--color-surface)',
            color: bookingDates.startDate ? 'var(--color-accent)' : 'var(--color-text)',
            fontSize: '13px',
            fontWeight: 600,
            transition: 'all 0.2s ease',
          }}
          aria-label="Select booking dates"
        >
          <Calendar size={16} color={bookingDates.startDate ? 'var(--color-accent)' : 'var(--color-text-muted)'} />
          <span>
            {bookingDates.startDate && bookingDates.endDate
              ? `${bookingDates.startDate} to ${bookingDates.endDate} (${bookingDates.durationDays}d)`
              : 'Pick Booking Dates'}
          </span>
        </button>

        {/* Cart Trigger */}
        <button
          onClick={onOpenCart}
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: 'var(--color-accent)',
            color: 'var(--color-on-accent)',
            fontSize: '13px',
            fontWeight: 700,
            boxShadow: '0 2px 8px rgba(124, 58, 237, 0.25)',
            transition: 'transform 0.15s ease, background-color 0.2s ease',
          }}
          aria-label={`Cart with ${cartCount} items`}
        >
          <ShoppingBag size={16} />
          <span>Cart</span>
          {cartCount > 0 && (
            <span
              style={{
                marginLeft: '4px',
                padding: '1px 7px',
                borderRadius: '999px',
                backgroundColor: '#ffffff',
                color: 'var(--color-accent)',
                fontSize: '11px',
                fontWeight: 800,
              }}
            >
              {cartCount}
            </span>
          )}
        </button>

        {/* Profile Trigger */}
        <button
          onClick={onOpenProfile}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-text-muted)',
            backgroundColor: 'var(--color-surface)',
            transition: 'color 0.2s ease, border-color 0.2s ease',
          }}
          aria-label="Account and orders"
        >
          <User size={18} />
        </button>
      </div>
    </header>
  );
};
