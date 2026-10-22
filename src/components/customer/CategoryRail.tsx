import React from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { ChevronRight } from 'lucide-react';

export const CategoryRail: React.FC = () => {
  const { categories, selectedCategoryFilter, setSelectedCategoryFilter } = useMarketplace();

  return (
    <section style={{
      padding: '32px 24px 20px',
      maxWidth: '1440px',
      margin: '0 auto',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginBottom: '18px',
      }}>
        <div>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '24px',
            fontWeight: 800,
            color: '#1c1917',
            margin: 0,
          }}>
            Explore by Rental Category
          </h2>
          <p style={{ fontSize: '13px', color: '#78716c', margin: '4px 0 0' }}>
            Event furniture, antique brass tableware, crystal lighting, and stage decor
          </p>
        </div>

        {selectedCategoryFilter && (
          <button
            onClick={() => setSelectedCategoryFilter(null)}
            style={{
              background: 'none',
              border: 'none',
              color: '#065f46',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            Clear Filter (Show All)
          </button>
        )}
      </div>

      {/* Snap Scroll Grid of Categories */}
      <div className="snap-rail" style={{ gap: '14px', paddingBottom: '10px' }}>
        {categories.map((cat) => {
          const isSelected = selectedCategoryFilter === cat.id;

          return (
            <div
              key={cat.id}
              onClick={() => setSelectedCategoryFilter(isSelected ? null : cat.id)}
              style={{
                width: '180px',
                cursor: 'pointer',
                borderRadius: '14px',
                overflow: 'hidden',
                backgroundColor: '#ffffff',
                border: isSelected ? '2px solid #065f46' : '1px solid #e7e5e4',
                boxShadow: isSelected ? '0 8px 20px rgba(6, 95, 70, 0.2)' : '0 2px 6px rgba(0,0,0,0.04)',
                transform: isSelected ? 'translateY(-2px)' : 'none',
                transition: 'all 0.2s ease',
                flexShrink: 0,
              }}
            >
              <div style={{
                position: 'relative',
                height: '120px',
                backgroundColor: '#f5f5f4',
                overflow: 'hidden',
              }}>
                <img
                  src={cat.coverImageUrl}
                  alt={cat.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease',
                  }}
                  onError={(e) => {
                    // Fallback if network issue
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80';
                  }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 60%)',
                }} />
                <div style={{
                  position: 'absolute',
                  bottom: '8px',
                  right: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  fontSize: '10px',
                  fontWeight: 700,
                  color: '#1c1917',
                }}>
                  {cat.itemCount} items
                </div>
              </div>

              <div style={{ padding: '10px 12px' }}>
                <div style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: isSelected ? '#065f46' : '#1c1917',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {cat.name}
                </div>
                <div style={{
                  fontSize: '11px',
                  color: '#78716c',
                  marginTop: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <span>Browse catalog</span>
                  <ChevronRight size={12} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
