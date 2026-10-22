import React from 'react';
import { Category } from '../../types';

interface CategoryRailProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (id: string | null) => void;
}

export const CategoryRail: React.FC<CategoryRailProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
}) => {
  return (
    <section style={{ padding: '48px 24px 24px 24px', maxWidth: '1280px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <span
            style={{
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontWeight: 700,
              color: 'var(--color-accent)',
            }}
          >
            DISCOVER INVENTORY
          </span>
          <h2
            className="font-display"
            style={{
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
              textTransform: 'uppercase',
              letterSpacing: '0.01em',
              lineHeight: 1,
              marginTop: '4px',
            }}
          >
            Shop by Category
          </h2>
        </div>
        {selectedCategoryId && (
          <button
            onClick={() => onSelectCategory(null)}
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--color-accent)',
              textDecoration: 'underline',
            }}
          >
            Clear Filter (Show All)
          </button>
        )}
      </div>

      {/* Snap Scroll Category Rail */}
      <div
        className="snap-rail"
        style={{
          display: 'flex',
          gap: '16px',
          paddingBottom: '12px',
        }}
      >
        {/* All Items Card */}
        <div
          onClick={() => onSelectCategory(null)}
          style={{
            cursor: 'pointer',
            width: '160px',
            borderRadius: 'var(--radius-lg)',
            border: selectedCategoryId === null ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
            backgroundColor: selectedCategoryId === null ? 'rgba(124, 58, 237, 0.05)' : 'var(--color-surface)',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            boxShadow: 'var(--shadow-subtle)',
            transition: 'all 0.2s ease',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-surface-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              fontWeight: 800,
              color: 'var(--color-accent)',
              marginBottom: '10px',
            }}
          >
            ★
          </div>
          <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text)' }}>
            All Items
          </span>
          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
            Full Collection
          </span>
        </div>

        {/* Category Cards */}
        {categories.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              style={{
                cursor: 'pointer',
                width: '160px',
                borderRadius: 'var(--radius-lg)',
                border: isSelected ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                backgroundColor: 'var(--color-surface)',
                overflow: 'hidden',
                boxShadow: isSelected ? '0 4px 14px rgba(124, 58, 237, 0.2)' : 'var(--shadow-subtle)',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ height: '110px', width: '100%', overflow: 'hidden' }}>
                <img
                  src={cat.cover_image_url}
                  alt={cat.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease',
                  }}
                />
              </div>
              <div style={{ padding: '12px', display: 'flex', flexDirection: 'column' }}>
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: isSelected ? 'var(--color-accent)' : 'var(--color-text)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {cat.name}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                  {cat.item_count} pieces
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
