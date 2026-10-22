import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import {
  X,
  ClipboardList,
  Calendar,
  MapPin,
  Shield,
  Truck,
  CheckCircle2,
  Clock,
  Printer,
  Phone,
  MessageSquare,
} from 'lucide-react';
import { MasterOrder } from '../../types/marketplace';

export const CustomerOrdersModal: React.FC = () => {
  const {
    isCustomerOrdersOpen,
    setIsCustomerOrdersOpen,
    masterOrders,
    currentUser,
    addToast,
  } = useMarketplace();

  const [selectedOrder, setSelectedOrder] = useState<MasterOrder | null>(null);

  if (!isCustomerOrdersOpen) return null;

  // Filter orders for current user or all if admin/demo
  const userOrders = masterOrders;

  const handleSimulateWhatsApp = (orderNumber: string) => {
    addToast(
      'success',
      'WhatsApp Receipt Dispatched',
      `Sent instant booking confirmation and driver tracking link for ${orderNumber} to ${currentUser.phone}`
    );
  };

  const handlePrintReceipt = (orderNumber: string) => {
    window.print();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1050,
      padding: '20px',
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '840px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
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
              <ClipboardList size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1c1917', margin: 0 }}>
                My Event Bookings & Dispatches
              </h3>
              <p style={{ fontSize: '12px', color: '#78716c', margin: 0 }}>
                Track live fulfillment, driver manifests, and escrow deposit refunds
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCustomerOrdersOpen(false)}
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
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          {userOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Clock size={40} style={{ color: '#a8a29e', margin: '0 auto 12px' }} />
              <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#1c1917', marginBottom: '6px' }}>
                No Active Event Bookings Found
              </h4>
              <p style={{ fontSize: '13px', color: '#78716c', marginBottom: '16px' }}>
                Select items from our catalog and checkout to view live dispatch tracking.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {userOrders.map((order) => (
                <div
                  key={order.id}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e7e5e4',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  }}
                >
                  {/* Master Order Top Strip */}
                  <div style={{
                    padding: '14px 18px',
                    backgroundColor: '#fafaf9',
                    borderBottom: '1px solid #e7e5e4',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px',
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <strong style={{ fontSize: '15px', color: '#1c1917' }}>{order.orderNumber}</strong>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          backgroundColor: '#ecfdf5',
                          color: '#065f46',
                          padding: '2px 8px',
                          borderRadius: '9999px',
                        }}>
                          {order.paymentStatus === 'paid' ? 'PAID & CONFIRMED' : order.paymentStatus.toUpperCase()}
                        </span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#78716c', marginTop: '2px' }}>
                        Booked on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} • Venue: {order.shippingAddress}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        onClick={() => handleSimulateWhatsApp(order.orderNumber)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          backgroundColor: '#25d366',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '6px 10px',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        <MessageSquare size={12} />
                        WhatsApp Receipt
                      </button>

                      <button
                        onClick={() => handlePrintReceipt(order.orderNumber)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          backgroundColor: '#f5f5f4',
                          color: '#44403c',
                          border: '1px solid #d6d3d1',
                          borderRadius: '6px',
                          padding: '6px 10px',
                          fontSize: '11px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        <Printer size={12} />
                        Invoice PDF
                      </button>
                    </div>
                  </div>

                  {/* Child Vendor Orders */}
                  <div style={{ padding: '16px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#78716c', textTransform: 'uppercase', marginBottom: '10px' }}>
                      Child Vendor Orders ({order.vendorOrders.length} Regional Dispatches):
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {order.vendorOrders.map((vo) => (
                        <div
                          key={vo.id}
                          style={{
                            backgroundColor: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            borderRadius: '10px',
                            padding: '12px 14px',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <div>
                              <strong style={{ fontSize: '13px', color: '#0f172a' }}>{vo.vendorName}</strong>
                              <span style={{ fontSize: '11px', color: '#64748b', marginLeft: '6px' }}>({vo.orderNumber})</span>
                            </div>

                            {/* Status Pill */}
                            <span style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: '9999px',
                              backgroundColor:
                                vo.status === 'rented' || vo.status === 'out_for_delivery'
                                  ? '#dbeafe'
                                  : vo.status === 'completed'
                                  ? '#dcfce7'
                                  : '#fef3c7',
                              color:
                                vo.status === 'rented' || vo.status === 'out_for_delivery'
                                  ? '#1e40af'
                                  : vo.status === 'completed'
                                  ? '#15803d'
                                  : '#b45309',
                            }}>
                              {vo.status.toUpperCase().replace(/_/g, ' ')}
                            </span>
                          </div>

                          {/* Items summary */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '8px' }}>
                            {vo.items.map((it, idx) => (
                              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#334155' }}>
                                <img
                                  src={it.productImage}
                                  alt={it.productName}
                                  style={{ width: '28px', height: '28px', borderRadius: '4px', objectFit: 'cover' }}
                                />
                                <span>{it.quantity}x {it.productName}</span>
                                <span style={{ marginLeft: 'auto', fontWeight: 600 }}>₹{it.lineTotal.toLocaleString('en-IN')}</span>
                              </div>
                            ))}
                          </div>

                          {/* Driver / Logistics Manifest if assigned */}
                          {vo.logistics && (
                            <div style={{
                              backgroundColor: '#ffffff',
                              border: '1px solid #cbd5e1',
                              borderRadius: '8px',
                              padding: '8px 12px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              fontSize: '11px',
                              color: '#1e293b',
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Truck size={14} style={{ color: '#0284c7' }} />
                                <span>Truck: <strong>{vo.logistics.vehicleNumber}</strong></span>
                                <span>•</span>
                                <span>Driver: <strong>{vo.logistics.driverName}</strong></span>
                              </div>
                              <a
                                href={`tel:${vo.logistics.driverPhone}`}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  color: '#065f46',
                                  fontWeight: 700,
                                  textDecoration: 'none',
                                }}
                              >
                                <Phone size={11} />
                                {vo.logistics.driverPhone}
                              </a>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Master Order Financial Summary Footer */}
                  <div style={{
                    padding: '12px 18px',
                    backgroundColor: '#fafaf9',
                    borderTop: '1px solid #e7e5e4',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '12px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span style={{ color: '#57534e' }}>
                        Rental: <strong>₹{order.rentalSubtotal.toLocaleString('en-IN')}</strong>
                      </span>
                      <span style={{ color: '#065f46', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Shield size={13} />
                        Deposit Escrow: <strong>₹{order.securityDepositTotal.toLocaleString('en-IN')}</strong>
                      </span>
                    </div>

                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#1c1917' }}>
                      Paid: ₹{order.grandTotal.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
