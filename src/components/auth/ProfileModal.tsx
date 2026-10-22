import React, { useState } from 'react';
import { X, User, Phone, FileText } from 'lucide-react';
import { Tenant } from '../../types';

interface ProfileModalProps {
  tenant?: Tenant;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ onClose }) => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp' | 'profile'>('phone');
  const userName = 'Priya Sharma';

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length >= 10) {
      setStep('otp');
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 4) {
      setStep('profile');
    }
  };

  return (
    <div
      className="animate-fade-in"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        className="animate-scale-up"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-xl)',
          padding: '32px',
          boxShadow: 'var(--shadow-pop)',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '18px', right: '18px', color: 'var(--color-text-muted)' }}
          aria-label="Close profile modal"
        >
          <X size={20} />
        </button>

        {step === 'phone' && (
          <div>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(124, 58, 237, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-accent)',
                marginBottom: '16px',
              }}
            >
              <User size={24} />
            </div>

            <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '6px' }}>
              Renter Account
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '24px' }}>
              Sign in to view saved quotes and track event rentals.
            </p>

            <form onSubmit={handleSendOtp}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                Mobile Number
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 14px',
                  backgroundColor: 'var(--color-bg)',
                  marginBottom: '20px',
                }}
              >
                <Phone size={16} color="var(--color-text-muted)" style={{ marginRight: '8px' }} />
                <span style={{ fontSize: '14px', fontWeight: 600, marginRight: '8px' }}>+91</span>
                <input
                  type="tel"
                  placeholder="98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  style={{
                    flex: 1,
                    border: 'none',
                    backgroundColor: 'transparent',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={phone.length < 10}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 'var(--radius-pill)',
                  backgroundColor: phone.length >= 10 ? 'var(--color-accent)' : 'var(--color-border)',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: phone.length >= 10 ? 'pointer' : 'not-allowed',
                }}
              >
                Send Verification Code
              </button>
            </form>
          </div>
        )}

        {step === 'otp' && (
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '6px' }}>
              Enter 4-Digit Code
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '24px' }}>
              Sent via SMS to +91 {phone} (Use 1234 for demo)
            </p>

            <form onSubmit={handleVerifyOtp}>
              <input
                type="text"
                maxLength={4}
                placeholder="1 2 3 4"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                style={{
                  width: '100%',
                  textAlign: 'center',
                  letterSpacing: '14px',
                  fontSize: '24px',
                  fontWeight: 800,
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-bg)',
                  marginBottom: '20px',
                  outline: 'none',
                }}
                required
              />

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 'var(--radius-pill)',
                  backgroundColor: 'var(--color-accent)',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: 700,
                }}
              >
                Verify & Continue
              </button>
            </form>
          </div>
        )}

        {step === 'profile' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-accent)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '18px',
                }}
              >
                PS
              </div>
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: 800 }}>{userName}</h4>
                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                  +91 {phone || '9072600699'} • Verified Event Stylist
                </span>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
              <h5 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileText size={15} color="var(--color-accent)" />
                <span>Recent Quotation Requests</span>
              </h5>

              <div
                style={{
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  marginBottom: '10px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700 }}>Wedding Sangeet Setup</span>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-success)' }}>
                    Quotation Sent
                  </span>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', display: 'block' }}>
                  5-Arm Candelabra (6x), Moroccan Floor Lantern (4x)
                </span>
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-accent)', marginTop: '4px', display: 'block' }}>
                  Est. ₹7,200 (3 Days)
                </span>
              </div>
            </div>

            <button
              onClick={() => setStep('phone')}
              style={{
                width: '100%',
                marginTop: '16px',
                padding: '10px',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid var(--color-border)',
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--color-text-muted)',
              }}
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
