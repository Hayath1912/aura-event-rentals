import React from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useMarketplace();

  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      zIndex: 9999,
      maxWidth: '380px',
      pointerEvents: 'none'
    }}>
      {toasts.map((toast) => {
        let icon = <CheckCircle2 size={18} style={{ color: '#10b981', flexShrink: 0 }} />;
        let borderLeftColor = '#10b981';

        if (toast.type === 'error') {
          icon = <AlertCircle size={18} style={{ color: '#ef4444', flexShrink: 0 }} />;
          borderLeftColor = '#ef4444';
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle size={18} style={{ color: '#f59e0b', flexShrink: 0 }} />;
          borderLeftColor = '#f59e0b';
        } else if (toast.type === 'info') {
          icon = <Info size={18} style={{ color: '#3b82f6', flexShrink: 0 }} />;
          borderLeftColor = '#3b82f6';
        }

        return (
          <div
            key={toast.id}
            style={{
              backgroundColor: '#1c1917',
              color: '#f5f3ef',
              padding: '12px 16px',
              borderRadius: '8px',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)',
              borderLeft: `4px solid ${borderLeftColor}`,
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              pointerEvents: 'auto',
              animation: 'slideInRight 0.25s ease-out',
            }}
          >
            <div style={{ marginTop: '2px' }}>{icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff' }}>
                {toast.title}
              </div>
              {toast.description && (
                <div style={{ fontSize: '12px', color: '#a8a29e', marginTop: '2px', lineHeight: 1.4 }}>
                  {toast.description}
                </div>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#78716c',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
