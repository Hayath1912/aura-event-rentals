import React from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import {
  Calendar,
  MapPin,
  Search,
  ShoppingBag,
  Clock,
  Sparkles,
  ClipboardList,
  ChevronDown,
  Layers,
} from 'lucide-react';

const CITIES = ['Kochi', 'Bengaluru', 'Chennai', 'Mumbai', 'Hyderabad', 'Delhi NCR', 'Goa'];

export const Navbar: React.FC = () => {
  const {
    bookingDates,
    setIsDatePickerOpen,
    selectedCity,
    setSelectedCity,
    searchQuery,
    setSearchQuery,
    cartCount,
    setIsCartOpen,
    setIsCustomerOrdersOpen,
    masterOrders,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
  } = useMarketplace();

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid #e7e5e4',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
    }}>
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
      }}>
        {/* Brand Logo */}
        <div
          onClick={() => {
            setSelectedCategoryFilter(null);
            setSearchQuery('');
          }}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}
        >
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 10px rgba(6, 95, 70, 0.25)',
          }}>
            <Sparkles size={20} />
          </div>
          <div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '24px',
              letterSpacing: '0.04em',
              lineHeight: 1,
              color: '#1c1917',
              textTransform: 'uppercase',
            }}>
              NSPHERE <span style={{ color: '#065f46' }}>RENTALS</span>
            </div>
            <div style={{ fontSize: '10px', letterSpacing: '0.08em', color: '#78716c', textTransform: 'uppercase', fontWeight: 600 }}>
              Multi-Vendor Event & Decor OS
            </div>
          </div>
        </div>

        {/* Center: City Selector & Date Pill & Search Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, maxWidth: '780px' }}>
          {/* City Selector */}
          <div style={{ position: 'relative' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#f5f5f4',
              border: '1px solid #e7e5e4',
              borderRadius: '9999px',
              padding: '6px 12px',
              fontSize: '13px',
              color: '#1c1917',
              fontWeight: 600,
            }}>
              <MapPin size={14} style={{ color: '#065f46' }} />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#1c1917',
                  cursor: 'pointer',
                  paddingRight: '4px',
                }}
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Event Dates Pill */}
          <button
            onClick={() => setIsDatePickerOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#ecfdf5',
              border: '1px solid #a7f3d0',
              borderRadius: '9999px',
              padding: '6px 14px',
              fontSize: '13px',
              color: '#065f46',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease',
            }}
          >
            <Calendar size={14} />
            <span>
              {bookingDates.startDate} to {bookingDates.endDate} ({bookingDates.durationDays}D)
            </span>
          </button>

          {/* Search Bar */}
          <div style={{
            position: 'relative',
            flex: 1,
            display: 'flex',
            alignItems: 'center',
          }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', color: '#78716c' }} />
            <input
              type="text"
              placeholder="Search chairs, chandeliers, brass urulis, stage props..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                borderRadius: '9999px',
                border: '1px solid #e7e5e4',
                backgroundColor: '#f5f5f4',
                fontSize: '13px',
                color: '#1c1917',
                outline: 'none',
                transition: 'border-color 0.15s ease',
              }}
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Customer Orders / My Bookings */}
          <button
            onClick={() => setIsCustomerOrdersOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#f5f5f4',
              border: '1px solid #e7e5e4',
              borderRadius: '9999px',
              padding: '8px 14px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#44403c',
              cursor: 'pointer',
            }}
          >
            <ClipboardList size={16} style={{ color: '#065f46' }} />
            <span>My Bookings</span>
            {masterOrders.length > 0 && (
              <span style={{
                backgroundColor: '#065f46',
                color: '#ffffff',
                fontSize: '10px',
                fontWeight: 700,
                borderRadius: '9999px',
                padding: '1px 6px',
              }}>
                {masterOrders.length}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#065f46',
              border: 'none',
              borderRadius: '9999px',
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: 700,
              color: '#ffffff',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(6, 95, 70, 0.25)',
              position: 'relative',
            }}
          >
            <ShoppingBag size={16} />
            <span>Rental Cart</span>
            {cartCount > 0 && (
              <span style={{
                backgroundColor: '#f59e0b',
                color: '#1c1917',
                fontSize: '11px',
                fontWeight: 800,
                borderRadius: '9999px',
                padding: '2px 7px',
                marginLeft: '2px',
              }}>
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
