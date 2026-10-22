import React from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Calendar, MapPin, Sparkles, ShieldCheck, Truck, Clock } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { bookingDates, setIsDatePickerOpen, selectedCity, setSelectedCity } = useMarketplace();

  return (
    <section style={{
      backgroundColor: '#fbfaf8',
      padding: '48px 24px 36px',
      borderBottom: '1px solid #e7e5e4',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative gradient glow */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-5%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(6, 95, 70, 0.08) 0%, rgba(251, 250, 248, 0) 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1440px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#ecfdf5',
            color: '#065f46',
            fontSize: '12px',
            fontWeight: 700,
            padding: '4px 12px',
            borderRadius: '9999px',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}>
            <Sparkles size={13} />
            India's Multi-Vendor Event & Decor Rental Marketplace
          </span>
        </div>

        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(32px, 5vw, 54px)',
          lineHeight: 1.15,
          fontWeight: 800,
          color: '#1c1917',
          maxWidth: '920px',
          marginBottom: '16px',
        }}>
          Curate Exceptional Weddings & Banquets with Heritage Props & Decor
        </h1>

        <p style={{
          fontSize: 'clamp(15px, 2vw, 18px)',
          color: '#57534e',
          maxWidth: '780px',
          lineHeight: 1.6,
          marginBottom: '32px',
        }}>
          Direct access to certified regional event inventory: Chiavari & Dior seating, palatial brass urulis, crystal chandeliers, luxury linens, and bespoke stage backdrops. Multi-vendor cart with unified dispatch tracking.
        </p>

        {/* Floating Date & Location Action Bar */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '12px 20px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08)',
          border: '1px solid #e7e5e4',
          display: 'inline-flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          marginBottom: '32px',
        }}>
          {/* Location */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: '#f5f5f4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#065f46',
            }}>
              <MapPin size={20} />
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#78716c', fontWeight: 600, textTransform: 'uppercase' }}>
                Event City
              </div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#1c1917' }}>
                {selectedCity}, India
              </div>
            </div>
          </div>

          <div style={{ width: '1px', height: '36px', backgroundColor: '#e7e5e4' }} />

          {/* Dates */}
          <div
            onClick={() => setIsDatePickerOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          >
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: '#ecfdf5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#065f46',
            }}>
              <Calendar size={20} />
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#78716c', fontWeight: 600, textTransform: 'uppercase' }}>
                Rental Window (Setup to Teardown)
              </div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#065f46' }}>
                {bookingDates.startDate} → {bookingDates.endDate} ({bookingDates.durationDays} Days, {bookingDates.billedDays} Billed)
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsDatePickerOpen(true)}
            style={{
              padding: '10px 18px',
              borderRadius: '10px',
              backgroundColor: '#065f46',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 6px -1px rgba(6, 95, 70, 0.2)',
            }}
          >
            Change Dates
          </button>
        </div>

        {/* 4 Trust Badges */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
        }}>
          {[
            {
              icon: <ShieldCheck size={20} style={{ color: '#065f46' }} />,
              title: '100% Refundable Deposit Escrow',
              desc: 'Returned within 24h post-event inspection',
            },
            {
              icon: <Truck size={20} style={{ color: '#0284c7' }} />,
              title: 'Multi-Vendor Manifest Dispatch',
              desc: 'Dedicated vehicle & driver assigned per vendor order',
            },
            {
              icon: <Clock size={20} style={{ color: '#7c3aed' }} />,
              title: 'Guaranteed On-Time Delivery',
              desc: 'Setup completed 4 hours prior to event commencement',
            },
            {
              icon: <Sparkles size={20} style={{ color: '#ea580c' }} />,
              title: 'Pristine Inspection Standard',
              desc: 'Items sanitised, polished, and stage-ready',
            },
          ].map((badge, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e7e5e4',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
              }}
            >
              <div style={{
                backgroundColor: '#f5f5f4',
                padding: '8px',
                borderRadius: '8px',
              }}>
                {badge.icon}
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#1c1917', marginBottom: '2px' }}>
                  {badge.title}
                </div>
                <div style={{ fontSize: '11px', color: '#78716c', lineHeight: 1.4 }}>
                  {badge.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
