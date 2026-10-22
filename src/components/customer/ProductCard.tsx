import React, { useMemo } from 'react';
import { Product } from '../../types/marketplace';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Star, Shield, Plus, Check, MapPin, Eye } from 'lucide-react';
import { checkProductAvailability } from '../../services/availabilityEngine';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    bookingDates,
    masterOrders,
    addToCart,
    cartItems,
    setActiveProductModal,
    updateCartQty,
  } = useMarketplace();

  // Real-time date availability check
  const availability = useMemo(() => {
    return checkProductAvailability(
      product,
      bookingDates.startDate,
      bookingDates.endDate,
      masterOrders,
      1
    );
  }, [product, bookingDates, masterOrders]);

  // Check if item is already in cart
  const cartItem = useMemo(() => {
    return cartItems.find((ci) => ci.product.id === product.id);
  }, [cartItems, product.id]);

  const billedDays = bookingDates.billedDays || 1;
  const totalPriceForPeriod = product.rentalPrice * billedDays;

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      border: '1px solid #e7e5e4',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      position: 'relative',
    }}>
      {/* Product Image Area */}
      <div
        onClick={() => setActiveProductModal(product)}
        style={{
          position: 'relative',
          paddingTop: '75%', // 4:3 Aspect Ratio
          backgroundColor: '#f5f5f4',
          cursor: 'pointer',
          overflow: 'hidden',
        }}
      >
        <img
          src={product.primaryImageUrl}
          alt={product.name}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80';
          }}
        />

        {/* Top Badges */}
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          right: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pointerEvents: 'none',
        }}>
          {/* Availability badge */}
          <span style={{
            fontSize: '11px',
            fontWeight: 700,
            padding: '3px 8px',
            borderRadius: '9999px',
            backgroundColor:
              availability.status === 'available'
                ? 'rgba(16, 185, 129, 0.95)'
                : availability.status === 'low_stock'
                ? 'rgba(245, 158, 11, 0.95)'
                : 'rgba(239, 68, 68, 0.95)',
            color: '#ffffff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
          }}>
            {availability.status === 'available'
              ? `${availability.availableQuantity} in Stock`
              : availability.status === 'low_stock'
              ? `Only ${availability.availableQuantity} Left`
              : 'Booked Out'}
          </span>

          {/* Quick View Icon */}
          <span style={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: '5px',
            borderRadius: '50%',
            color: '#1c1917',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}>
            <Eye size={13} />
          </span>
        </div>

        {/* Bottom Vendor Badge Overlay */}
        <div style={{
          position: 'absolute',
          bottom: '8px',
          left: '8px',
          backgroundColor: 'rgba(28, 25, 23, 0.85)',
          backdropFilter: 'blur(4px)',
          color: '#ffffff',
          padding: '2px 8px',
          borderRadius: '6px',
          fontSize: '10px',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}>
          <span>{product.vendorName}</span>
          <span>•</span>
          <span style={{ color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '2px' }}>
            <Star size={9} fill="#fbbf24" /> {product.vendorRating}
          </span>
        </div>
      </div>

      {/* Details Area */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ fontSize: '11px', color: '#78716c', fontWeight: 600, textTransform: 'uppercase' }}>
            {product.categoryName}
          </span>
          <span style={{ fontSize: '10px', color: '#a8a29e', fontFamily: 'monospace' }}>
            {product.itemCode}
          </span>
        </div>

        {/* Product Title */}
        <h3
          onClick={() => setActiveProductModal(product)}
          style={{
            fontSize: '15px',
            fontWeight: 700,
            color: '#1c1917',
            lineHeight: 1.3,
            margin: '0 0 6px',
            cursor: 'pointer',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '40px',
          }}
        >
          {product.name}
        </h3>

        {/* Specs Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
          <span style={{
            fontSize: '11px',
            color: '#57534e',
            backgroundColor: '#f5f5f4',
            padding: '2px 8px',
            borderRadius: '4px',
          }}>
            Dim: {product.dimension}
          </span>
          <span style={{
            fontSize: '11px',
            color: '#57534e',
            backgroundColor: '#f5f5f4',
            padding: '2px 8px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
          }}>
            <Shield size={11} style={{ color: '#065f46' }} />
            ₹{product.securityDeposit} Deposit
          </span>
        </div>

        {/* Price & Action Row */}
        <div style={{
          marginTop: 'auto',
          paddingTop: '12px',
          borderTop: '1px solid #f5f5f4',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: '11px', color: '#78716c' }}>
              Rental Rate
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
              <span style={{ fontSize: '18px', fontWeight: 800, color: '#065f46' }}>
                ₹{product.rentalPrice.toLocaleString('en-IN')}
              </span>
              <span style={{ fontSize: '11px', color: '#78716c' }}>/ day</span>
            </div>
            {billedDays > 1 && (
              <div style={{ fontSize: '11px', color: '#0284c7', fontWeight: 600 }}>
                ₹{totalPriceForPeriod.toLocaleString('en-IN')} for {billedDays} days
              </div>
            )}
          </div>

          {/* Add / Qty Controls */}
          {cartItem ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#ecfdf5',
              border: '1px solid #a7f3d0',
              borderRadius: '8px',
              padding: '2px 4px',
            }}>
              <button
                onClick={() => updateCartQty(cartItem.id, cartItem.quantity - 1)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#065f46',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer',
                  padding: '2px 8px',
                }}
              >
                -
              </button>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#065f46', padding: '0 4px' }}>
                {cartItem.quantity}
              </span>
              <button
                onClick={() => updateCartQty(cartItem.id, cartItem.quantity + 1)}
                disabled={cartItem.quantity >= availability.availableQuantity}
                style={{
                  background: 'none',
                  border: 'none',
                  color: cartItem.quantity >= availability.availableQuantity ? '#a8a29e' : '#065f46',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: cartItem.quantity >= availability.availableQuantity ? 'not-allowed' : 'pointer',
                  padding: '2px 8px',
                }}
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={() => addToCart(product, 1)}
              disabled={availability.status === 'out_of_stock'}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                backgroundColor: availability.status === 'out_of_stock' ? '#e7e5e4' : '#065f46',
                color: availability.status === 'out_of_stock' ? '#a8a29e' : '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 14px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: availability.status === 'out_of_stock' ? 'not-allowed' : 'pointer',
                boxShadow: availability.status === 'out_of_stock' ? 'none' : '0 2px 6px rgba(6, 95, 70, 0.25)',
                transition: 'all 0.15s ease',
              }}
            >
              <Plus size={14} />
              Rent
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
