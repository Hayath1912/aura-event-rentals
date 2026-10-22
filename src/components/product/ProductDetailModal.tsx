import React, { useState } from 'react';
import { X, Plus, Minus, Check, Heart } from 'lucide-react';
import { InventoryItem, BookingDates } from '../../types';

interface ProductDetailModalProps {
  item: InventoryItem;
  relatedItems: InventoryItem[];
  bookingDates: BookingDates;
  isItemInCart: boolean;
  onClose: () => void;
  onAddToCart: (item: InventoryItem, qty: number) => void;
  onSelectRelated: (item: InventoryItem) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  item,
  relatedItems,
  bookingDates,
  isItemInCart,
  onClose,
  onAddToCart,
  onSelectRelated,
}) => {
  const [selectedImage, setSelectedImage] = useState(item.primary_image_url);
  const [quantity, setQuantity] = useState(1);
  const [isSaved, setIsSaved] = useState(false);

  const duration = bookingDates.durationDays || 1;
  const lineTotal = item.rental_price * quantity * duration;

  return (
    <div
      className="animate-fade-in"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        overflowY: 'auto',
      }}
      onClick={onClose}
    >
      <div
        className="animate-scale-up"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '920px',
          maxHeight: '90vh',
          overflowY: 'auto',
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-pop)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            zIndex: 10,
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            boxShadow: 'var(--shadow-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-text)',
          }}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Top Product Section */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '32px',
            padding: '32px',
          }}
        >
          {/* Gallery Column */}
          <div>
            <div
              style={{
                width: '100%',
                height: '380px',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                backgroundColor: 'var(--color-surface-muted)',
                marginBottom: '12px',
              }}
            >
              <img
                src={selectedImage}
                alt={item.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Thumbnail Row */}
            {item.image_urls.length > 1 && (
              <div style={{ display: 'flex', gap: '8px' }}>
                {item.image_urls.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      border: selectedImage === img ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                    }}
                  >
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Column */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: 'var(--color-accent)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {item.category_name}
                </span>
                <span style={{ color: 'var(--color-border)' }}>•</span>
                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                  SKU: {item.sku}
                </span>
              </div>

              <h2
                style={{
                  fontSize: '26px',
                  fontWeight: 800,
                  color: 'var(--color-text)',
                  lineHeight: 1.25,
                  marginBottom: '12px',
                }}
              >
                {item.name}
              </h2>

              <p
                style={{
                  fontSize: '14px',
                  color: 'var(--color-text-muted)',
                  lineHeight: 1.6,
                  marginBottom: '20px',
                }}
              >
                {item.description}
              </p>

              {/* Price Calculation Box */}
              <div
                style={{
                  backgroundColor: 'var(--color-surface-muted)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '16px',
                  marginBottom: '24px',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-text)' }}>
                      ₹{item.rental_price.toLocaleString('en-IN')}
                    </span>
                    <span style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginLeft: '6px' }}>
                      / day
                    </span>
                  </div>
                  {bookingDates.startDate && (
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-accent)' }}>
                      {duration} Day Event Rental
                    </span>
                  )}
                </div>

                {bookingDates.startDate && (
                  <div
                    style={{
                      marginTop: '8px',
                      paddingTop: '8px',
                      borderTop: '1px solid var(--color-border)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '13px',
                      color: 'var(--color-text)',
                    }}
                  >
                    <span>Rental Total ({quantity} unit × {duration}d):</span>
                    <span style={{ fontWeight: 800 }}>₹{lineTotal.toLocaleString('en-IN')}</span>
                  </div>
                )}
              </div>

              {/* Quantity Selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <span style={{ fontSize: '14px', fontWeight: 600 }}>Quantity:</span>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                  }}
                >
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    style={{
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'var(--color-surface)',
                    }}
                  >
                    <Minus size={15} />
                  </button>
                  <span
                    style={{
                      width: '44px',
                      textAlign: 'center',
                      fontSize: '14px',
                      fontWeight: 700,
                    }}
                  >
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(item.total_qty, q + 1))}
                    style={{
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'var(--color-surface)',
                    }}
                  >
                    <Plus size={15} />
                  </button>
                </div>
                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                  ({item.total_qty} units in warehouse)
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => onAddToCart(item, quantity)}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '14px 24px',
                  borderRadius: 'var(--radius-pill)',
                  backgroundColor: 'var(--color-accent)',
                  color: '#ffffff',
                  fontSize: '15px',
                  fontWeight: 700,
                  boxShadow: '0 4px 14px rgba(124, 58, 237, 0.35)',
                }}
              >
                {isItemInCart ? <Check size={18} /> : <Plus size={18} />}
                <span>{isItemInCart ? 'Added to Cart' : 'Add to Rental Cart'}</span>
              </button>

              <button
                onClick={() => setIsSaved(!isSaved)}
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-pill)',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isSaved ? 'var(--color-danger)' : 'var(--color-text)',
                  backgroundColor: isSaved ? 'rgba(239, 68, 68, 0.1)' : 'var(--color-surface)',
                }}
                aria-label="Save to moodboard collection"
              >
                <Heart size={20} fill={isSaved ? 'var(--color-danger)' : 'none'} />
              </button>
            </div>
          </div>
        </div>

        {/* Specifications Section */}
        <div style={{ padding: '0 32px 32px 32px' }}>
          <h3
            style={{
              fontSize: '18px',
              fontWeight: 800,
              color: 'var(--color-text)',
              marginBottom: '16px',
              borderBottom: '1px solid var(--color-border)',
              paddingBottom: '8px',
            }}
          >
            Item Specifications
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '14px',
            }}
          >
            <div style={{ backgroundColor: 'var(--color-surface-muted)', padding: '12px 16px', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block' }}>
                Dimensions
              </span>
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text)' }}>
                {item.dimension || 'Standard Event Scale'}
              </span>
            </div>

            <div style={{ backgroundColor: 'var(--color-surface-muted)', padding: '12px 16px', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block' }}>
                Item Classification
              </span>
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text)' }}>
                {item.item_type === 'non-consumable' ? 'Durable Prop / Furniture' : 'Consumable'}
              </span>
            </div>

            <div style={{ backgroundColor: 'var(--color-surface-muted)', padding: '12px 16px', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block' }}>
                Inspection & Care
              </span>
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text)' }}>
                Disinfected & Polished Pre-Dispatch
              </span>
            </div>
          </div>
        </div>

        {/* Complete the Look Cross-Sell Rail */}
        {relatedItems.length > 0 && (
          <div
            style={{
              padding: '24px 32px 32px 32px',
              backgroundColor: 'var(--color-bg)',
              borderTop: '1px solid var(--color-border)',
              borderRadius: '0 0 var(--radius-xl) var(--radius-xl)',
            }}
          >
            <h4
              style={{
                fontSize: '16px',
                fontWeight: 800,
                color: 'var(--color-text)',
                marginBottom: '16px',
              }}
            >
              Complete the Look (Recommended Styling Pairs)
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
              {relatedItems.slice(0, 3).map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onSelectRelated(rel)}
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    border: '1px solid var(--color-border)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px',
                  }}
                >
                  <img
                    src={rel.primary_image_url}
                    alt={rel.name}
                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                  />
                  <div>
                    <h5
                      style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '120px',
                      }}
                    >
                      {rel.name}
                    </h5>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-accent)' }}>
                      ₹{rel.rental_price}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
