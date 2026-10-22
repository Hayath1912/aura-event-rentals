import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import {
  X,
  CheckCircle2,
  MapPin,
  Calendar,
  CreditCard,
  QrCode,
  Shield,
  Truck,
  ArrowRight,
  ArrowLeft,
  Clock,
  Sparkles,
  Phone,
  Building,
  FileText,
} from 'lucide-react';
import { MasterOrder } from '../../types/marketplace';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cartCalculation,
    placeOrder,
    currentUser,
    bookingDates,
    selectedCity,
    setIsCustomerOrdersOpen,
    addToast,
  } = useMarketplace();

  const [step, setStep] = useState<'details' | 'review' | 'payment' | 'success'>('details');

  // Customer & Event Logistics Form
  const [venueName, setVenueName] = useState('Bolgatty Palace Convention Hall');
  const [deliveryAddress, setDeliveryAddress] = useState('Mulavukad, Bolgatty Island, Kochi, Kerala 682504');
  const [coordinatorName, setCoordinatorName] = useState(currentUser.fullName);
  const [coordinatorPhone, setCoordinatorPhone] = useState(currentUser.phone);
  const [alternatePhone, setAlternatePhone] = useState('+91 9847123982');
  const [deliverySlot, setDeliverySlot] = useState('Early Morning (6:00 AM - 10:00 AM)');
  const [returnSlot, setReturnSlot] = useState('Post-Event Night (11:00 PM - 2:00 AM)');
  const [specialInstructions, setSpecialInstructions] = useState('Use Service Elevator #2 for loading chairs & chandeliers.');

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'corporate_invoice'>('upi');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<MasterOrder | null>(null);

  if (!isCheckoutOpen) return null;

  const handleNextToReview = () => {
    if (!venueName.trim() || !deliveryAddress.trim() || !coordinatorPhone.trim()) {
      addToast('error', 'Missing Information', 'Please complete Venue Name, Address, and Contact Phone.');
      return;
    }
    setStep('review');
  };

  const handleExecutePayment = () => {
    setIsProcessingPayment(true);

    setTimeout(() => {
      const generatedTxnId = `RZP_TXN_${Math.floor(100000 + Math.random() * 900000)}`;
      const order = placeOrder(
        {
          id: currentUser.id,
          name: coordinatorName,
          phone: coordinatorPhone,
          email: currentUser.email,
          address: deliveryAddress,
          venueName,
        },
        paymentMethod === 'corporate_invoice' ? 'wallet' : paymentMethod,
        generatedTxnId
      );

      setConfirmedOrder(order);
      setIsProcessingPayment(false);
      setStep('success');
    }, 1800);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1050,
      padding: '16px',
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '720px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
        border: '1px solid #e7e5e4',
        position: 'relative',
        animation: 'scaleUp 0.25s ease-out',
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
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1c1917', margin: 0 }}>
              Event Booking & Dispatch Checkout
            </h3>
            <p style={{ fontSize: '12px', color: '#78716c', margin: 0 }}>
              Step {step === 'details' ? '1 of 3: Event Logistics' : step === 'review' ? '2 of 3: Policy Review' : step === 'payment' ? '3 of 3: Payment Gateway' : 'Confirmed'}
            </p>
          </div>
          {step !== 'success' && (
            <button
              onClick={() => setIsCheckoutOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: '#78716c',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '6px',
              }}
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px' }}>
          {/* STEP 1: EVENT LOGISTICS FORM */}
          {step === 'details' && (
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#1c1917', marginBottom: '16px' }}>
                Event Venue & Loading Dock Logistics
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1c1917', marginBottom: '6px' }}>
                    Venue / Banquet Name
                  </label>
                  <input
                    type="text"
                    value={venueName}
                    onChange={(e) => setVenueName(e.target.value)}
                    placeholder="e.g. Grand Hyatt Bolgatty"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #d6d3d1',
                      fontSize: '13px',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1c1917', marginBottom: '6px' }}>
                    Event City
                  </label>
                  <input
                    type="text"
                    disabled
                    value={selectedCity}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #e7e5e4',
                      backgroundColor: '#f5f5f4',
                      fontSize: '13px',
                      color: '#78716c',
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1c1917', marginBottom: '6px' }}>
                  Full Delivery Address & Landmark
                </label>
                <textarea
                  rows={2}
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #d6d3d1',
                    fontSize: '13px',
                    outline: 'none',
                    resize: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1c1917', marginBottom: '6px' }}>
                    On-Site Event Coordinator
                  </label>
                  <input
                    type="text"
                    value={coordinatorName}
                    onChange={(e) => setCoordinatorName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #d6d3d1',
                      fontSize: '13px',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1c1917', marginBottom: '6px' }}>
                    Coordinator Phone (For Truck Dispatch)
                  </label>
                  <input
                    type="text"
                    value={coordinatorPhone}
                    onChange={(e) => setCoordinatorPhone(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #d6d3d1',
                      fontSize: '13px',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              {/* Time Slots */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1c1917', marginBottom: '6px' }}>
                    Setup / Delivery Time Slot
                  </label>
                  <select
                    value={deliverySlot}
                    onChange={(e) => setDeliverySlot(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #d6d3d1',
                      fontSize: '13px',
                      backgroundColor: '#ffffff',
                      outline: 'none',
                    }}
                  >
                    <option>Early Morning (6:00 AM - 10:00 AM)</option>
                    <option>Midday (10:00 AM - 2:00 PM)</option>
                    <option>Afternoon (2:00 PM - 6:00 PM)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1c1917', marginBottom: '6px' }}>
                    Teardown / Pickup Time Slot
                  </label>
                  <select
                    value={returnSlot}
                    onChange={(e) => setReturnSlot(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #d6d3d1',
                      fontSize: '13px',
                      backgroundColor: '#ffffff',
                      outline: 'none',
                    }}
                  >
                    <option>Post-Event Night (11:00 PM - 2:00 AM)</option>
                    <option>Next Morning (6:00 AM - 10:00 AM)</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1c1917', marginBottom: '6px' }}>
                  Loading Dock / Access Instructions
                </label>
                <input
                  type="text"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #d6d3d1',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                />
              </div>

              <button
                onClick={handleNextToReview}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '10px',
                  backgroundColor: '#065f46',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 10px rgba(6, 95, 70, 0.25)',
                }}
              >
                <span>Continue to Policy & Vendor Review</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}

          {/* STEP 2: POLICY REVIEW & SPLIT ORDERS PREVIEW */}
          {step === 'review' && (
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#1c1917', marginBottom: '12px' }}>
                Multi-Vendor Order Routing & Escrow Policy
              </h4>

              {/* Vendors affected */}
              <div style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '14px',
                marginBottom: '16px',
              }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', marginBottom: '8px', textTransform: 'uppercase' }}>
                  Orders Dispatched To {cartCalculation.vendorGroups.length} Vendors:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {cartCalculation.vendorGroups.map((g, idx) => (
                    <div key={g.vendorId} style={{
                      backgroundColor: '#ffffff',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '12px',
                    }}>
                      <div>
                        <strong>{idx + 1}. {g.vendorName}</strong> ({g.items.length} items)
                      </div>
                      <div style={{ color: '#065f46', fontWeight: 700 }}>
                        ₹{g.vendorTotal.toLocaleString('en-IN')} (incl. ₹{g.securityDeposit.toLocaleString('en-IN')} deposit)
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Policy Highlights */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                <div style={{
                  backgroundColor: '#ecfdf5',
                  border: '1px solid #a7f3d0',
                  borderRadius: '10px',
                  padding: '12px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                }}>
                  <Shield size={18} style={{ color: '#065f46', flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ fontSize: '12px', color: '#065f46', lineHeight: 1.4 }}>
                    <strong>100% Refundable Security Deposit Escrow:</strong> Your ₹{cartCalculation.totalSecurityDeposit.toLocaleString('en-IN')} deposit is held in verified bank escrow. It will be released automatically within 24 hours after the return inspection.
                  </div>
                </div>

                <div style={{
                  backgroundColor: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '10px',
                  padding: '12px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                }}>
                  <Truck size={18} style={{ color: '#1d4ed8', flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ fontSize: '12px', color: '#1e40af', lineHeight: 1.4 }}>
                    <strong>Dedicated Dispatch Logistics:</strong> Each vendor generates a dedicated dispatch manifest with assigned vehicle number and driver phone. You will receive real-time dispatch updates.
                  </div>
                </div>
              </div>

              {/* Grand Total Bar */}
              <div style={{
                backgroundColor: '#1c1917',
                color: '#ffffff',
                borderRadius: '12px',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
              }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#a8a29e' }}>Payable Amount (incl. 18% GST + Escrow Deposit)</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#10b981' }}>
                    ₹{cartCalculation.grandTotal.toLocaleString('en-IN')}
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: '#e7e5e4' }}>
                  {bookingDates.billedDays} Billed Days
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setStep('details')}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #d6d3d1',
                    backgroundColor: '#ffffff',
                    color: '#44403c',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <ArrowLeft size={16} />
                  Back
                </button>
                <button
                  onClick={() => setStep('payment')}
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
                    boxShadow: '0 4px 10px rgba(6, 95, 70, 0.25)',
                  }}
                >
                  <span>Select Payment Gateway</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT GATEWAY SIMULATION */}
          {step === 'payment' && (
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#1c1917', marginBottom: '14px' }}>
                Secure Payment Gateway (Razorpay & UPI Verified)
              </h4>

              {/* Payment Method Selector */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '20px' }}>
                {[
                  { id: 'upi', label: 'UPI / QR', icon: <QrCode size={18} /> },
                  { id: 'card', label: 'Cards (Visa/MC)', icon: <CreditCard size={18} /> },
                  { id: 'netbanking', label: 'NetBanking', icon: <Building size={18} /> },
                  { id: 'corporate_invoice', label: 'Invoice / PO', icon: <FileText size={18} /> },
                ].map((pm) => (
                  <button
                    key={pm.id}
                    onClick={() => setPaymentMethod(pm.id as any)}
                    style={{
                      padding: '12px 6px',
                      borderRadius: '10px',
                      border: paymentMethod === pm.id ? '2px solid #065f46' : '1px solid #e7e5e4',
                      backgroundColor: paymentMethod === pm.id ? '#ecfdf5' : '#ffffff',
                      color: paymentMethod === pm.id ? '#065f46' : '#44403c',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '12px',
                      fontWeight: 700,
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {pm.icon}
                    <span>{pm.label}</span>
                  </button>
                ))}
              </div>

              {/* Gateway Simulation View */}
              <div style={{
                backgroundColor: '#fafaf9',
                border: '1px solid #e7e5e4',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center',
                marginBottom: '24px',
              }}>
                {paymentMethod === 'upi' ? (
                  <div>
                    <div style={{
                      width: '130px',
                      height: '130px',
                      backgroundColor: '#ffffff',
                      border: '2px solid #1c1917',
                      borderRadius: '10px',
                      margin: '0 auto 12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '8px',
                    }}>
                      <QrCode size={100} style={{ color: '#1c1917' }} />
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#1c1917' }}>
                      Scan to Pay ₹{cartCalculation.grandTotal.toLocaleString('en-IN')}
                    </div>
                    <div style={{ fontSize: '11px', color: '#78716c', marginTop: '4px' }}>
                      Supported by Google Pay, PhonePe, Paytm, and BHIM UPI
                    </div>
                  </div>
                ) : paymentMethod === 'card' ? (
                  <div style={{ textAlign: 'left', maxWidth: '360px', margin: '0 auto' }}>
                    <div style={{ marginBottom: '10px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 600, color: '#44403c' }}>Card Number</label>
                      <input
                        type="text"
                        readOnly
                        value="4532 •••• •••• 8912"
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #d6d3d1', fontSize: '13px' }}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 600, color: '#44403c' }}>Expiry</label>
                        <input
                          type="text"
                          readOnly
                          value="12 / 28"
                          style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #d6d3d1', fontSize: '13px' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 600, color: '#44403c' }}>CVV</label>
                        <input
                          type="password"
                          readOnly
                          value="•••"
                          style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #d6d3d1', fontSize: '13px' }}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Building size={36} style={{ color: '#065f46', margin: '0 auto 8px' }} />
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#1c1917' }}>
                      Institutional & NetBanking Gateway
                    </div>
                    <div style={{ fontSize: '11px', color: '#78716c' }}>
                      Verified 256-bit encrypted bank checkout
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setStep('review')}
                  disabled={isProcessingPayment}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #d6d3d1',
                    backgroundColor: '#ffffff',
                    color: '#44403c',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: isProcessingPayment ? 'not-allowed' : 'pointer',
                  }}
                >
                  Back
                </button>
                <button
                  onClick={handleExecutePayment}
                  disabled={isProcessingPayment}
                  style={{
                    flex: 2,
                    padding: '12px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: isProcessingPayment ? '#a8a29e' : '#065f46',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: 800,
                    cursor: isProcessingPayment ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 10px rgba(6, 95, 70, 0.3)',
                  }}
                >
                  {isProcessingPayment ? (
                    <span>Processing Secure Payment...</span>
                  ) : (
                    <span>Authorize & Confirm (₹{cartCalculation.grandTotal.toLocaleString('en-IN')})</span>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS CONFIRMATION & SPLIT ORDERS */}
          {step === 'success' && confirmedOrder && (
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#ecfdf5',
                color: '#065f46',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                border: '4px solid #a7f3d0',
              }}>
                <CheckCircle2 size={36} />
              </div>

              <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#1c1917', margin: '0 0 6px' }}>
                Rental Booking Successfully Confirmed!
              </h3>
              <p style={{ fontSize: '13px', color: '#78716c', marginBottom: '20px' }}>
                Master Order <strong style={{ color: '#065f46' }}>{confirmedOrder.orderNumber}</strong> has been created and dispatched to individual vendor fulfillment queues.
              </p>

              {/* Split Vendor Orders List */}
              <div style={{
                backgroundColor: '#fafaf9',
                borderRadius: '12px',
                border: '1px solid #e7e5e4',
                padding: '16px',
                textAlign: 'left',
                marginBottom: '20px',
              }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#1c1917', marginBottom: '10px', textTransform: 'uppercase' }}>
                  Child Vendor Orders Generated:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {confirmedOrder.vendorOrders.map((vo) => (
                    <div
                      key={vo.id}
                      style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e7e5e4',
                        borderRadius: '8px',
                        padding: '10px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#1c1917' }}>
                          {vo.orderNumber} • {vo.vendorName}
                        </div>
                        <div style={{ fontSize: '11px', color: '#78716c' }}>
                          {vo.items.length} product(s) • Status: <span style={{ color: '#065f46', fontWeight: 600 }}>Confirmed</span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#065f46' }}>
                          ₹{vo.subtotal.toLocaleString('en-IN')}
                        </div>
                        <div style={{ fontSize: '10px', color: '#78716c' }}>
                          +₹{vo.securityDeposit.toLocaleString('en-IN')} deposit
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Final Actions */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button
                  onClick={() => {
                    setIsCheckoutOpen(false);
                    setIsCustomerOrdersOpen(true);
                  }}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: '#065f46',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Track in "My Bookings"
                </button>
                <button
                  onClick={() => setIsCheckoutOpen(false)}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #d6d3d1',
                    backgroundColor: '#ffffff',
                    color: '#44403c',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
