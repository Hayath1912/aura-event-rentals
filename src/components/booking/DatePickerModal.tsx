import React, { useState } from 'react';
import { X, Calendar as CalendarIcon, Check } from 'lucide-react';
import { BookingDates } from '../../types';

interface DatePickerModalProps {
  currentDates: BookingDates;
  onApplyDates: (dates: BookingDates) => void;
  onClose: () => void;
}

export const DatePickerModal: React.FC<DatePickerModalProps> = ({
  currentDates,
  onApplyDates,
  onClose,
}) => {
  const [start, setStart] = useState<string>(currentDates.startDate || '');
  const [end, setEnd] = useState<string>(currentDates.endDate || '');

  // Calculate rental duration in days
  const calculateDays = (s: string, e: string) => {
    if (!s) return 0;
    if (!e) return 1;
    const d1 = new Date(s);
    const d2 = new Date(e);
    const diff = Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(1, diff + 1);
  };

  const days = calculateDays(start, end);

  const handleSave = () => {
    if (!start) return;
    const finalEnd = end || start;
    const finalDays = calculateDays(start, finalEnd);
    onApplyDates({
      startDate: start,
      endDate: finalEnd,
      durationDays: finalDays,
    });
    onClose();
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div
      className="animate-fade-in"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
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
          maxWidth: '480px',
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-xl)',
          padding: '28px',
          boxShadow: 'var(--shadow-pop)',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            color: 'var(--color-text-muted)',
          }}
          aria-label="Close date picker"
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(124, 58, 237, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-accent)',
            }}
          >
            <CalendarIcon size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Pick Booking Dates</h3>
            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
              Select delivery and return dates for your event
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', margin: '24px 0' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
              Delivery / Setup Date
            </label>
            <input
              type="date"
              min={todayStr}
              value={start}
              onChange={(e) => {
                setStart(e.target.value);
                if (end && e.target.value > end) {
                  setEnd(e.target.value);
                }
              }}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-bg)',
                fontSize: '14px',
                color: 'var(--color-text)',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
              Teardown / Return Date
            </label>
            <input
              type="date"
              min={start || todayStr}
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-bg)',
                fontSize: '14px',
                color: 'var(--color-text)',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Calculation Pill */}
        {start && (
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: 'rgba(124, 58, 237, 0.08)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(124, 58, 237, 0.2)',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-accent)' }}>
              Rental Duration:
            </span>
            <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-accent)' }}>
              {days} Day{days > 1 ? 's' : ''}
            </span>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => {
              setStart('');
              setEnd('');
            }}
            style={{
              padding: '12px 18px',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid var(--color-border)',
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--color-text-muted)',
            }}
          >
            Clear Dates
          </button>

          <button
            onClick={handleSave}
            disabled={!start}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '12px 20px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: start ? 'var(--color-accent)' : 'var(--color-border)',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 700,
              cursor: start ? 'pointer' : 'not-allowed',
            }}
          >
            <Check size={16} />
            <span>Apply Booking Dates</span>
          </button>
        </div>
      </div>
    </div>
  );
};
