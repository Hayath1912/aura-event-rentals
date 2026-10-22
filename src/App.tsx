import React from 'react';
import { MarketplaceProvider, useMarketplace } from './context/MarketplaceContext';
import { RoleBanner } from './components/common/RoleBanner';
import { ToastContainer } from './components/common/ToastContainer';
import { DatePickerModal } from './components/common/DatePickerModal';
import { Navbar } from './components/navigation/Navbar';
import { HeroSection } from './components/customer/HeroSection';
import { CategoryRail } from './components/customer/CategoryRail';
import { ProductGrid } from './components/customer/ProductGrid';
import { BundlesSection } from './components/customer/BundlesSection';
import { VendorShowcase } from './components/customer/VendorShowcase';
import { ProductDetailModal } from './components/customer/ProductDetailModal';
import { MultiVendorCartDrawer } from './components/customer/MultiVendorCartDrawer';
import { CheckoutModal } from './components/customer/CheckoutModal';
import { CustomerOrdersModal } from './components/customer/CustomerOrdersModal';
import { VendorDashboard } from './components/vendor/VendorDashboard';
import { AdminPortal } from './components/admin/AdminPortal';
import { DeveloperControlRoom } from './components/developer/DeveloperControlRoom';
import { Shield, Sparkles, Phone, Mail, MapPin } from 'lucide-react';

function MarketplaceApp() {
  const { role } = useMarketplace();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--color-bg)',
      color: 'var(--color-text)',
    }}>
      {/* 1. Global Role Switcher Banner */}
      <RoleBanner />

      {/* 2. Primary Navigation Bar */}
      <Navbar />

      {/* 3. Main Content based on active Role */}
      <main style={{ flex: 1 }}>
        {role === 'customer' && (
          <>
            <HeroSection />
            <CategoryRail />
            <BundlesSection />
            <ProductGrid />
            <VendorShowcase />

            {/* Customer Storefront Footer */}
            <footer style={{
              backgroundColor: '#1c1917',
              color: '#f5f3ef',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              padding: '48px 24px 32px',
              marginTop: '40px',
            }}>
              <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '32px',
                  marginBottom: '40px',
                }}>
                  {/* Brand Column */}
                  <div>
                    <div style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '24px',
                      letterSpacing: '0.04em',
                      lineHeight: 1,
                      color: '#ffffff',
                      textTransform: 'uppercase',
                      marginBottom: '10px',
                    }}>
                      NSPHERE <span style={{ color: '#10b981' }}>RENTALS</span>
                    </div>
                    <p style={{ fontSize: '13px', color: '#a8a29e', lineHeight: 1.6, marginBottom: '16px' }}>
                      India's premier multi-vendor rental marketplace dedicated to wedding props, banquet furniture, crystal lighting, and handcrafted brass tableware.
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#34d399' }}>
                      <Shield size={14} />
                      <span>100% Escrow Refund Guarantee</span>
                    </div>
                  </div>

                  {/* Rental Categories */}
                  <div>
                    <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', marginBottom: '14px' }}>
                      Rental Categories
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#a8a29e' }}>
                      <span>Banquet & Chiavari Seating</span>
                      <span>Handcrafted Brass Urulis & Vilakku</span>
                      <span>Cascading Crystal Chandeliers</span>
                      <span>Luxury Jacquard Table Linens</span>
                      <span>Wedding Entrance & Mandap Backdrops</span>
                    </div>
                  </div>

                  {/* Vendor Operating Hubs */}
                  <div>
                    <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', marginBottom: '14px' }}>
                      Operating Hubs
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#a8a29e' }}>
                      <span>Kochi Hub • NH-66 Edappally</span>
                      <span>Bengaluru Hub • Indiranagar Stage 2</span>
                      <span>Chennai Hub • Guindy Industrial Estate</span>
                      <span>Mumbai Hub • BKC Bandra West</span>
                      <span>Hyderabad Hub • Gachibowli</span>
                    </div>
                  </div>

                  {/* Contact & Support */}
                  <div>
                    <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', marginBottom: '14px' }}>
                      Event Logistics Concierge
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#a8a29e' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Phone size={14} style={{ color: '#10b981' }} />
                        <span>+91 8943544149 / +91 9447182910</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Mail size={14} style={{ color: '#10b981' }} />
                        <span>rentals@nsphere.internal</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <MapPin size={14} style={{ color: '#10b981' }} />
                        <span>Central Dispatch Terminal, Kochi</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{
                  borderTop: '1px solid rgba(255,255,255,0.1)',
                  paddingTop: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                  fontSize: '12px',
                  color: '#78716c',
                }}>
                  <div>© 2026 NSPHERE Rentals & EventOS. All rights reserved.</div>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <span>Security Deposit Policy</span>
                    <span>Damage Inspection Terms</span>
                    <span>Vendor Onboarding KYC</span>
                    <span>Privacy Policy</span>
                  </div>
                </div>
              </div>
            </footer>
          </>
        )}

        {role === 'vendor' && <VendorDashboard />}
        {role === 'admin' && <AdminPortal />}
        {role === 'developer' && <DeveloperControlRoom />}
      </main>

      {/* Global Interactive Modals */}
      <ProductDetailModal />
      <DatePickerModal />
      <MultiVendorCartDrawer />
      <CheckoutModal />
      <CustomerOrdersModal />
      <ToastContainer />
    </div>
  );
}

export function App() {
  return (
    <MarketplaceProvider>
      <MarketplaceApp />
    </MarketplaceProvider>
  );
}

export default App;
