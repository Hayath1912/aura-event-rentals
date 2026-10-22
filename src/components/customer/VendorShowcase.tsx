import React from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Star, ShieldCheck, MapPin, Package, ArrowRight } from 'lucide-react';

export const VendorShowcase: React.FC = () => {
  const { vendors, selectedVendorFilter, setSelectedVendorFilter } = useMarketplace();

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
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '24px',
            fontWeight: 800,
            color: '#1c1917',
            margin: 0,
          }}>
            Verified Regional Event Rental Houses
          </h2>
          <p style={{ fontSize: '13px', color: '#78716c', margin: '4px 0 0' }}>
            Audited warehouses, dedicated dispatch trucks, and inspected stage equipment
          </p>
        </div>

        {selectedVendorFilter && (
          <button
            onClick={() => setSelectedVendorFilter(null)}
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
            Show All Vendors
          </button>
        )}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '16px',
      }}>
        {vendors.map((vendor) => {
          const isSelected = selectedVendorFilter === vendor.id;

          return (
            <div
              key={vendor.id}
              onClick={() => setSelectedVendorFilter(isSelected ? null : vendor.id)}
              style={{
                backgroundColor: '#ffffff',
                border: isSelected ? '2px solid #065f46' : '1px solid #e7e5e4',
                borderRadius: '16px',
                padding: '18px',
                cursor: 'pointer',
                boxShadow: isSelected ? '0 8px 20px rgba(6, 95, 70, 0.15)' : '0 2px 6px rgba(0,0,0,0.03)',
                transform: isSelected ? 'translateY(-2px)' : 'none',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <img
                  src={vendor.logoUrl}
                  alt={vendor.businessName}
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '10px',
                    objectFit: 'cover',
                    border: '1px solid #e7e5e4',
                    backgroundColor: '#f5f5f4',
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=200&q=80';
                  }}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#1c1917', margin: 0 }}>
                      {vendor.businessName}
                    </h4>
                    <ShieldCheck size={14} style={{ color: '#065f46' }} />
                  </div>
                  <div style={{ fontSize: '11px', color: '#78716c', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                    <MapPin size={11} /> {vendor.city}, {vendor.state}
                  </div>
                </div>
              </div>

              <p style={{
                fontSize: '12px',
                color: '#57534e',
                lineHeight: 1.5,
                margin: '0 0 14px',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                minHeight: '36px',
              }}>
                {vendor.description}
              </p>

              <div style={{
                marginTop: 'auto',
                paddingTop: '10px',
                borderTop: '1px solid #f5f5f4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '11px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#d97706', fontWeight: 700 }}>
                  <Star size={12} fill="#d97706" />
                  <span>{vendor.rating}</span>
                  <span style={{ color: '#a8a29e', fontWeight: 400 }}>({vendor.reviewCount} reviews)</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#065f46', fontWeight: 600 }}>
                  <Package size={12} />
                  <span>{vendor.totalProducts} props listed</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
