import React from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { ShoppingBag, Store, ShieldCheck, Terminal, ArrowRight, User } from 'lucide-react';

export const RoleBanner: React.FC = () => {
  const { role, setRole, currentUser, activeVendor, cartCount, masterOrders } = useMarketplace();

  return (
    <div style={{
      backgroundColor: '#1c1917',
      color: '#f5f3ef',
      fontSize: '12px',
      padding: '6px 16px',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '8px',
      zIndex: 60,
      position: 'relative'
    }}>
      {/* Left: Role Switcher Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ color: '#a8a29e', marginRight: '6px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Portal View:
        </span>

        <button
          onClick={() => setRole('customer')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '3px 10px',
            borderRadius: '9999px',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
            border: 'none',
            backgroundColor: role === 'customer' ? '#065f46' : 'rgba(255,255,255,0.08)',
            color: role === 'customer' ? '#ffffff' : '#d6d3d1',
            transition: 'all 0.15s ease'
          }}
        >
          <ShoppingBag size={12} />
          Customer Storefront {cartCount > 0 && `(${cartCount})`}
        </button>

        <button
          onClick={() => setRole('vendor')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '3px 10px',
            borderRadius: '9999px',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
            border: 'none',
            backgroundColor: role === 'vendor' ? '#0284c7' : 'rgba(255,255,255,0.08)',
            color: role === 'vendor' ? '#ffffff' : '#d6d3d1',
            transition: 'all 0.15s ease'
          }}
        >
          <Store size={12} />
          Vendor Portal {activeVendor ? `(${activeVendor.businessName.split(' ')[0]})` : ''}
        </button>

        <button
          onClick={() => setRole('admin')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '3px 10px',
            borderRadius: '9999px',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
            border: 'none',
            backgroundColor: role === 'admin' ? '#7c3aed' : 'rgba(255,255,255,0.08)',
            color: role === 'admin' ? '#ffffff' : '#d6d3d1',
            transition: 'all 0.15s ease'
          }}
        >
          <ShieldCheck size={12} />
          Admin Portal
        </button>

        <button
          onClick={() => setRole('developer')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '3px 10px',
            borderRadius: '9999px',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
            border: 'none',
            backgroundColor: role === 'developer' ? '#ea580c' : 'rgba(255,255,255,0.08)',
            color: role === 'developer' ? '#ffffff' : '#d6d3d1',
            transition: 'all 0.15s ease'
          }}
        >
          <Terminal size={12} />
          Developer Control Room
        </button>
      </div>

      {/* Right: Current User & Quick Stat */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', color: '#a8a29e' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <User size={12} style={{ color: '#065f46' }} />
          <span>Logged in as: <strong style={{ color: '#f5f3ef' }}>{currentUser.fullName}</strong> ({currentUser.role})</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', borderLeft: '1px solid rgba(255,255,255,0.15)', paddingLeft: '10px' }}>
          <span>Total Orders: <strong style={{ color: '#f5f3ef' }}>{masterOrders.length}</strong></span>
        </div>
      </div>
    </div>
  );
};
