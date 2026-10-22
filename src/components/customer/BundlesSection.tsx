import React from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Sparkles, Layers, Shield, Plus, Check } from 'lucide-react';

export const BundlesSection: React.FC = () => {
  const { products, addToCart, setActiveProductModal, bookingDates } = useMarketplace();

  // Find bundle items
  const bundleProducts = products.filter((p) => p.isBundle);

  if (bundleProducts.length === 0) return null;

  return (
    <section style={{
      padding: '20px 24px 40px',
      maxWidth: '1440px',
      margin: '0 auto',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginBottom: '20px',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ea580c', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            <Sparkles size={13} />
            Pre-Curated Event Packages
          </div>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '24px',
            fontWeight: 800,
            color: '#1c1917',
            margin: '4px 0 0',
          }}>
            Thematic Stage & Lounge Setups
          </h2>
          <p style={{ fontSize: '13px', color: '#78716c', margin: '4px 0 0' }}>
            Complete setups bundled with coordinated seating, centerpieces, backdrops, and lighting
          </p>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px',
      }}>
        {bundleProducts.map((bundle) => {
          const billedDays = bookingDates.billedDays || 1;
          const totalBundlePrice = bundle.rentalPrice * billedDays;

          return (
            <div
              key={bundle.id}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '18px',
                border: '1px solid #e7e5e4',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Cover Image */}
              <div
                onClick={() => setActiveProductModal(bundle)}
                style={{
                  position: 'relative',
                  height: '200px',
                  backgroundColor: '#f5f5f4',
                  cursor: 'pointer',
                }}
              >
                <img
                  src={bundle.primaryImageUrl}
                  alt={bundle.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80';
                  }}
                />
                <span style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  backgroundColor: '#ea580c',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}>
                  <Layers size={11} /> Thematic Bundle
                </span>
                <span style={{
                  position: 'absolute',
                  bottom: '10px',
                  right: '10px',
                  backgroundColor: 'rgba(28, 25, 23, 0.85)',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '3px 8px',
                  borderRadius: '6px',
                }}>
                  By {bundle.vendorName}
                </span>
              </div>

              {/* Bundle Content */}
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3
                  onClick={() => setActiveProductModal(bundle)}
                  style={{
                    fontSize: '16px',
                    fontWeight: 800,
                    color: '#1c1917',
                    margin: '0 0 6px',
                    cursor: 'pointer',
                  }}
                >
                  {bundle.name}
                </h3>
                <p style={{ fontSize: '12px', color: '#57534e', lineHeight: 1.5, margin: '0 0 14px' }}>
                  {bundle.description}
                </p>

                {/* Included items chips */}
                {bundle.bundleItems && (
                  <div style={{
                    backgroundColor: '#fafaf9',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    border: '1px solid #e7e5e4',
                    marginBottom: '16px',
                  }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#78716c', marginBottom: '6px', textTransform: 'uppercase' }}>
                      Package Inclusions:
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11px', color: '#44403c' }}>
                      {bundle.bundleItems.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Check size={12} style={{ color: '#065f46' }} />
                          <span><strong>{item.quantity}x</strong> {item.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price and CTA */}
                <div style={{
                  marginTop: 'auto',
                  paddingTop: '12px',
                  borderTop: '1px solid #f5f5f4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#78716c' }}>Bundle Package Rate</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
                      <span style={{ fontSize: '18px', fontWeight: 800, color: '#065f46' }}>
                        ₹{bundle.rentalPrice.toLocaleString('en-IN')}
                      </span>
                      <span style={{ fontSize: '11px', color: '#78716c' }}>/ day</span>
                    </div>
                    {billedDays > 1 && (
                      <div style={{ fontSize: '11px', color: '#0284c7', fontWeight: 600 }}>
                        ₹{totalBundlePrice.toLocaleString('en-IN')} for {billedDays} days
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => addToCart(bundle, 1)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      backgroundColor: '#065f46',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 14px',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(6, 95, 70, 0.25)',
                    }}
                  >
                    <Plus size={14} />
                    Rent Setup
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
