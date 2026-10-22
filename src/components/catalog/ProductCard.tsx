import React, { useState } from 'react';
import { Plus, Check, Eye } from 'lucide-react';
import { InventoryItem } from '../../types';

interface ProductCardProps {
  item: InventoryItem;
  onSelect: (item: InventoryItem) => void;
  onQuickAdd: (item: InventoryItem) => void;
  isItemInCart: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  item,
  onSelect,
  onQuickAdd,
  isItemInCart,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <article
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
        overflow: 'hidden',
        boxShadow: isHovered ? 'var(--shadow-pop)' : 'var(--shadow-subtle)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        transform: isHovered ? 'translateY(-4px)' : 'none',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {/* Image Container */}
      <div
        onClick={() => onSelect(item)}
        style={{
          position: 'relative',
          height: '240px',
          width: '100%',
          overflow: 'hidden',
          backgroundColor: 'var(--color-surface-muted)',
          cursor: 'pointer',
        }}
      >
        <img
          src={item.primary_image_url}
          alt={item.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: isHovered ? 'scale(1.06)' : 'scale(1)',
            transition: 'transform 0.4s ease',
          }}
        />

        {/* Dimension Pill Badge */}
        {item.dimension && (
          <span
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              padding: '3px 8px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'rgba(0, 0, 0, 0.65)',
              color: '#ffffff',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.04em',
              backdropFilter: 'blur(4px)',
            }}
          >
            {item.dimension}
          </span>
        )}

        {/* Quick Add Overlay on Hover */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            left: '12px',
            display: 'flex',
            gap: '8px',
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? 'translateY(0)' : 'translateY(8px)',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickAdd(item);
            }}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '9px 12px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: isItemInCart ? 'var(--color-success)' : 'var(--color-accent)',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: 700,
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            }}
          >
            {isItemInCart ? <Check size={14} /> : <Plus size={14} />}
            <span>{isItemInCart ? 'Added' : 'Quick Add'}</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(item);
            }}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              color: 'var(--color-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
            aria-label="View details"
          >
            <Eye size={15} />
          </button>
        </div>
      </div>

      {/* Item Metadata */}
      <div
        style={{
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '6px',
            }}
          >
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--color-accent)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              {item.category_name}
            </span>
            <span
              style={{
                fontSize: '11px',
                color: 'var(--color-text-muted)',
                fontWeight: 500,
              }}
            >
              {item.sku}
            </span>
          </div>

          <h3
            onClick={() => onSelect(item)}
            style={{
              fontSize: '15px',
              fontWeight: 700,
              color: 'var(--color-text)',
              marginBottom: '8px',
              lineHeight: 1.3,
              cursor: 'pointer',
            }}
          >
            {item.name}
          </h3>
        </div>

        {/* Pricing & Stock */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            borderTop: '1px solid var(--color-border)',
            paddingTop: '10px',
            marginTop: '8px',
          }}
        >
          <div>
            <span
              style={{
                fontSize: '17px',
                fontWeight: 800,
                color: 'var(--color-text)',
              }}
            >
              ₹{item.rental_price.toLocaleString('en-IN')}
            </span>
            <span
              style={{
                fontSize: '11px',
                color: 'var(--color-text-muted)',
                marginLeft: '4px',
              }}
            >
              / day
            </span>
          </div>

          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: (item.available_qty ?? item.total_qty) > 0 ? 'var(--color-success)' : 'var(--color-danger)',
            }}
          >
            {(item.available_qty ?? item.total_qty) > 0 ? `${item.total_qty} Available` : 'Booked'}
          </span>
        </div>
      </div>
    </article>
  );
};
