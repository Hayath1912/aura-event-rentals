import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error';
  title: string;
  description?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '32px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 70,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        alignItems: 'center',
        pointerEvents: 'none',
      }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="animate-slide-up"
          style={{
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 18px',
            backgroundColor: '#09090b',
            color: '#ffffff',
            borderRadius: 'var(--radius-pill)',
            boxShadow: 'var(--shadow-pop)',
            minWidth: '280px',
            maxWidth: '90vw',
          }}
        >
          {toast.type === 'success' && <CheckCircle2 size={18} color="#22c55e" />}
          {toast.type === 'info' && <Info size={18} color="#38bdf8" />}
          {toast.type === 'error' && <AlertCircle size={18} color="#f87171" />}

          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '13px', fontWeight: 600, display: 'block' }}>
              {toast.title}
            </span>
            {toast.description && (
              <span style={{ fontSize: '11px', color: '#a1a1aa', display: 'block' }}>
                {toast.description}
              </span>
            )}
          </div>

          <button
            onClick={() => onDismiss(toast.id)}
            style={{ color: '#a1a1aa', display: 'flex', alignItems: 'center' }}
            aria-label="Dismiss notification"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};
