import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Calendar, Clock, Check, X, Sparkles } from 'lucide-react';
import { calculateDurationDays } from '../../services/cartEngine';

export const DatePickerModal: React.FC = () => {
  const { isDatePickerOpen, setIsDatePickerOpen, bookingDates, setBookingDates, addToast } = useMarketplace();

  const [start, setStart] = useState(bookingDates.startDate);
  const [end, setEnd] = useState(bookingDates.endDate);

  if (!isDatePickerOpen) return null;

  const { durationDays, billedDays } = calculateDurationDays(start, end);

  const handleApply = () => {
    if (!start || !end) {
      addToast('error', 'Select Both Dates', 'Please pick valid event start and end dates.');
      return;
    }
    if (new Date(end) < new Date(start)) {
      addToast('error', 'Invalid Date Range', 'End date cannot be prior to start date.');
      return;
    }

    setBookingDates({
      startDate: start,
      endDate: end,
      durationDays,
      billedDays,
    });

    setIsDatePickerOpen(false);
    addToast('success', 'Event Dates Updated', `${start} to ${end} (${durationDays} Days, ${billedDays} Billed)`);
  };

  const handlePreset = (days: number) => {
    const today = new Date();
    const s = today.toISOString().split('T')[0];
    const eDate = new Date(today.getTime() + (days - 1) * 86400000);
    const e = eDate.toISOString().split('T')[0];
    setStart(s);
    setEnd(e);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '16px',
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '520px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        overflow: 'hidden',
        border: '1px solid #e7e5e4',
        animation: 'scaleUp 0.2s ease-out',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e7e5e4',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#fafaf9',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: '#ecfdf5',
              color: '#065f46',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Calendar size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1c1917', margin: 0 }}>
                Select Event Rental Dates
              </h3>
              <p style={{ fontSize: '12px', color: '#78716c', margin: 0 }}>
                Rental rates and stock availability are calculated dynamically
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsDatePickerOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              color: '#a8a29e',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '6px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          {/* Quick Presets */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#78716c', marginBottom: '8px', textTransform: 'uppercase' }}>
              Quick Event Presets
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {[
                { label: '1 Day', desc: 'Single Event', days: 1 },
                { label: '2 Days', desc: 'Weekend Party', days: 2 },
                { label: '3 Days', desc: 'Grand Wedding', days: 3 },
                { label: '5 Days', desc: 'Mega Festival', days: 5 },
              ].map((preset) => (
                <button
                  key={preset.days}
                  onClick={() => handlePreset(preset.days)}
                  style={{
                    padding: '8px 4px',
                    borderRadius: '8px',
                    border: '1px solid #e7e5e4',
                    backgroundColor: durationDays === preset.days ? '#ecfdf5' : '#f5f5f4',
                    borderColor: durationDays === preset.days ? '#065f46' : '#e7e5e4',
                    color: durationDays === preset.days ? '#065f46' : '#1c1917',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ fontSize: '13px', fontWeight: 700 }}>{preset.label}</div>
                  <div style={{ fontSize: '10px', color: '#78716c' }}>{preset.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Date Inputs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1c1917', marginBottom: '6px' }}>
                Delivery / Setup Date
              </label>
              <input
                type="date"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #d6d3d1',
                  fontSize: '14px',
                  color: '#1c1917',
                  backgroundColor: '#ffffff',
                  outline: 'none',
                }}
              />
              <span style={{ fontSize: '11px', color: '#78716c', marginTop: '4px', display: 'block' }}>
                Delivery before 10:00 AM
              </span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1c1917', marginBottom: '6px' }}>
                Pickup / Teardown Date
              </label>
              <input
                type="date"
                value={end}
                min={start}
                onChange={(e) => setEnd(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #d6d3d1',
                  fontSize: '14px',
                  color: '#1c1917',
                  backgroundColor: '#ffffff',
                  outline: 'none',
                }}
              />
              <span style={{ fontSize: '11px', color: '#78716c', marginTop: '4px', display: 'block' }}>
                Post-event pickup after 10:00 PM
              </span>
            </div>
          </div>

          {/* Calculation Banner */}
          <div style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Clock size={20} style={{ color: '#0284c7' }} />
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
                  {durationDays} Calendar Day{durationDays > 1 ? 's' : ''} ({billedDays} Event Billing Block{billedDays > 1 ? 's' : ''})
                </div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>
                  Standard event rental window (setup to post-reception teardown)
                </div>
              </div>
            </div>
            <div style={{
              backgroundColor: '#e0f2fe',
              color: '#0369a1',
              padding: '4px 10px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: 700,
            }}>
              {billedDays}x Rate Multiplier
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setIsDatePickerOpen(false)}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #d6d3d1',
                backgroundColor: '#ffffff',
                color: '#44403c',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              style={{
                flex: 2,
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#065f46',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 6px -1px rgba(6, 95, 70, 0.25)',
              }}
            >
              <Check size={16} />
              Lock Dates & Check Availability
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
