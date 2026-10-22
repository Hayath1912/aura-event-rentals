import React, { useState, useMemo } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import {
  X,
  Star,
  Shield,
  Calendar,
  CheckCircle2,
  Truck,
  Plus,
  Minus,
  ShoppingBag,
  Info,
  MapPin,
  Clock,
} from 'lucide-react';
import { checkProductAvailability } from '../../services/availabilityEngine';

export const ProductDetailModal: React.FC = () => {
  const {
    activeProductModal,
    setActiveProductModal,
    bookingDates,
    setIsDatePickerOpen,
    masterOrders,
    addToCart,
    cartItems,
    setIsCartOpen,
  } = useMarketplace();

  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!activeProductModal) return null;

  const product = activeProductModal;
  const billedDays = bookingDates.billedDays || 1;

  // Real-time date availability check
  const availability = checkProductAvailability(
    product,
    bookingDates.startDate,
    bookingDates.endDate,
    masterOrders,
    quantity
  );

  const images = product.imageUrls && product.imageUrls.length > 0
    ? product.imageUrls
    : [product.primaryImageUrl];

  const currentImage = images[selectedPhotoIndex] || product.primaryImageUrl;

  // Pricing calculations
  const rentalTotal = product.rentalPrice * billedDays * quantity;
  const depositTotal = product.securityDeposit * quantity;
  const estimatedItemTotal = rentalTotal + depositTotal;

  // Existing cart quantity for this product
  const inCartItem = cartItems.find((ci) => ci.product.id === product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setActiveProductModal(null);
  };

  const handleBookNow = () => {
    addToCart(product, quantity);
    setActiveProductModal(null);
    setIsCartOpen(true);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '960px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
        border: '1px solid #e7e5e4',
        position: 'relative',
        animation: 'scaleUp 0.25s ease-out',
      }}>
        {/* Close Button */}
        <button
          onClick={() => setActiveProductModal(null)}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            zIndex: 10,
            background: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid #e7e5e4',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#44403c',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          }}
        >
          <X size={18} />
        </button>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '32px',
          padding: '32px',
        }}>
          {/* Left: Image Gallery */}
          <div>
            <div style={{
              position: 'relative',
              borderRadius: '16px',
              overflow: 'hidden',
              backgroundColor: '#f5f5f4',
              height: '360px',
              marginBottom: '12px',
              border: '1px solid #e7e5e4',
            }}>
              <img
                src={currentImage}
                alt={product.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80';
                }}
              />

              {/* Status Badge */}
              <span style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                fontSize: '11px',
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: '9999px',
                backgroundColor:
                  availability.status === 'available'
                    ? '#065f46'
                    : availability.status === 'low_stock'
                    ? '#f59e0b'
                    : '#ef4444',
                color: '#ffffff',
              }}>
                {availability.status === 'available'
                  ? `${availability.availableQuantity} Units Available`
                  : availability.status === 'low_stock'
                  ? `Low Stock (${availability.availableQuantity} Left)`
                  : 'Sold Out for Dates'}
              </span>
            </div>

            {/* Thumbnail Row */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedPhotoIndex(idx)}
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: selectedPhotoIndex === idx ? '2px solid #065f46' : '1px solid #e7e5e4',
                      cursor: 'pointer',
                      padding: 0,
                      backgroundColor: '#f5f5f4',
                      flexShrink: 0,
                    }}
                  >
                    <img src={img} alt="Thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}

            {/* Refundable Escrow Box */}
            <div style={{
              backgroundColor: '#ecfdf5',
              border: '1px solid #a7f3d0',
              borderRadius: '12px',
              padding: '14px',
              marginTop: '16px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
            }}>
              <Shield size={20} style={{ color: '#065f46', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#065f46' }}>
                  ₹{product.securityDeposit.toLocaleString('en-IN')} Refundable Deposit Escrow
                </div>
                <div style={{ fontSize: '11px', color: '#047857', marginTop: '2px', lineHeight: 1.4 }}>
                  Deposits are held safely by the platform escrow and refunded directly to your original payment method within 24 hours of successful post-event return inspection.
                </div>
              </div>
            </div>
          </div>

          {/* Right: Product Details & Live Calculator */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Vendor info header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '8px',
              backgroundColor: '#fafaf9',
              padding: '6px 12px',
              borderRadius: '8px',
              width: 'fit-content',
            }}>
              <MapPin size={13} style={{ color: '#065f46' }} />
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#1c1917' }}>
                {product.vendorName}
              </span>
              <span style={{ color: '#a8a29e' }}>•</span>
              <span style={{ fontSize: '11px', color: '#78716c' }}>{product.location}</span>
              <span style={{ color: '#a8a29e' }}>•</span>
              <span style={{ color: '#d97706', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}>
                <Star size={11} fill="#d97706" /> {product.rating}
              </span>
            </div>

            <div style={{ fontSize: '12px', color: '#78716c', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>
              {product.categoryName} • Item Code: {product.itemCode}
            </div>

            <h2 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '24px',
              fontWeight: 800,
              color: '#1c1917',
              margin: '0 0 10px',
              lineHeight: 1.25,
            }}>
              {product.name}
            </h2>

            <p style={{ fontSize: '13px', color: '#57534e', lineHeight: 1.6, marginBottom: '16px' }}>
              {product.description}
            </p>

            {/* Specifications Grid */}
            <div style={{
              backgroundColor: '#fafaf9',
              borderRadius: '12px',
              padding: '12px 16px',
              border: '1px solid #e7e5e4',
              marginBottom: '20px',
            }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#1c1917', marginBottom: '8px', textTransform: 'uppercase' }}>
                Item Specifications
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
                <div><span style={{ color: '#78716c' }}>Dimensions:</span> <strong style={{ color: '#1c1917' }}>{product.dimension}</strong></div>
                {Object.entries(product.specs || {}).map(([key, val]) => (
                  <div key={key}><span style={{ color: '#78716c' }}>{key}:</span> <strong style={{ color: '#1c1917' }}>{val}</strong></div>
                ))}
              </div>
            </div>

            {/* Event Dates Banner */}
            <div
              onClick={() => setIsDatePickerOpen(true)}
              style={{
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '10px',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                marginBottom: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={16} style={{ color: '#065f46' }} />
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#065f46' }}>
                  {bookingDates.startDate} to {bookingDates.endDate} ({bookingDates.durationDays} Days, {billedDays} Billed)
                </span>
              </div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#047857', textDecoration: 'underline' }}>
                Change
              </span>
            </div>

            {/* Quantity Selector & Live Price Box */}
            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '16px',
              marginBottom: '20px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                  Quantity Required:
                </span>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                }}>
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    style={{
                      padding: '6px 12px',
                      background: 'none',
                      border: 'none',
                      cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
                      color: quantity <= 1 ? '#94a3b8' : '#0f172a',
                    }}
                  >
                    <Minus size={14} />
                  </button>
                  <span style={{ padding: '0 10px', fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(availability.availableQuantity, q + 1))}
                    disabled={quantity >= availability.availableQuantity}
                    style={{
                      padding: '6px 12px',
                      background: 'none',
                      border: 'none',
                      cursor: quantity >= availability.availableQuantity ? 'not-allowed' : 'pointer',
                      color: quantity >= availability.availableQuantity ? '#94a3b8' : '#0f172a',
                    }}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: '#475569' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Rental (₹{product.rentalPrice} × {billedDays} days × {quantity} qty):</span>
                  <strong style={{ color: '#0f172a' }}>₹{rentalTotal.toLocaleString('en-IN')}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Security Deposit (₹{product.securityDeposit} × {quantity} qty):</span>
                  <strong style={{ color: '#065f46' }}>+ ₹{depositTotal.toLocaleString('en-IN')} (Refundable)</strong>
                </div>
                <div style={{
                  paddingTop: '8px',
                  marginTop: '4px',
                  borderTop: '1px solid #cbd5e1',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>Estimated Line Total:</span>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: '#065f46' }}>
                    ₹{estimatedItemTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: 'auto' }}>
              <button
                onClick={handleAddToCart}
                disabled={availability.status === 'out_of_stock'}
                style={{
                  padding: '14px',
                  borderRadius: '10px',
                  backgroundColor: '#ffffff',
                  border: '2px solid #065f46',
                  color: '#065f46',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: availability.status === 'out_of_stock' ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <ShoppingBag size={16} />
                {inCartItem ? 'Add More to Cart' : 'Add to Rental Cart'}
              </button>

              <button
                onClick={handleBookNow}
                disabled={availability.status === 'out_of_stock'}
                style={{
                  padding: '14px',
                  borderRadius: '10px',
                  backgroundColor: availability.status === 'out_of_stock' ? '#a8a29e' : '#065f46',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: availability.status === 'out_of_stock' ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 10px rgba(6, 95, 70, 0.3)',
                }}
              >
                <CheckCircle2 size={16} />
                Instant Book & Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
