import React, { useState, useMemo } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import {
  ShieldCheck,
  Users,
  DollarSign,
  Package,
  ClipboardList,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Star,
  Building,
  FileText,
  Search,
} from 'lucide-react';
import { VendorStatus } from '../../types/marketplace';

export const AdminPortal: React.FC = () => {
  const {
    vendors,
    products,
    masterOrders,
    auditLogs,
    updateVendorKycStatus,
    updateVendorCommission,
    approveVendorPayout,
    toggleProductFeatured,
    addToast,
  } = useMarketplace();

  const [adminTab, setAdminTab] = useState<'metrics' | 'vendors' | 'catalog' | 'financials' | 'audit'>('metrics');
  const [vendorSearch, setVendorSearch] = useState('');

  // Platform KPIs
  const totalGmv = useMemo(() => {
    return masterOrders.reduce((sum, o) => sum + o.grandTotal, 0);
  }, [masterOrders]);

  const totalEscrowDeposits = useMemo(() => {
    return masterOrders.reduce((sum, o) => sum + o.securityDepositTotal, 0);
  }, [masterOrders]);

  const totalPlatformCommissions = useMemo(() => {
    let comm = 0;
    for (const m of masterOrders) {
      for (const vo of m.vendorOrders) {
        comm += vo.commissionAmount || 0;
      }
    }
    return comm;
  }, [masterOrders]);

  const filteredVendors = useMemo(() => {
    if (!vendorSearch.trim()) return vendors;
    const q = vendorSearch.toLowerCase();
    return vendors.filter(
      (v) =>
        v.businessName.toLowerCase().includes(q) ||
        v.city.toLowerCase().includes(q) ||
        v.email.toLowerCase().includes(q)
    );
  }, [vendors, vendorSearch]);

  return (
    <div style={{
      maxWidth: '1440px',
      margin: '0 auto',
      padding: '24px',
      minHeight: 'calc(100vh - 120px)',
    }}>
      {/* Admin Title */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: '#f3e8ff',
            color: '#7c3aed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <ShieldCheck size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1c1917', margin: 0 }}>
              Platform Administrator Command Center
            </h2>
            <p style={{ fontSize: '12px', color: '#78716c', margin: 0 }}>
              Multi-vendor governance, KYC compliance, commission engine & escrow settlement
            </p>
          </div>
        </div>

        <span style={{
          fontSize: '11px',
          fontWeight: 700,
          backgroundColor: '#7c3aed',
          color: '#ffffff',
          padding: '4px 12px',
          borderRadius: '9999px',
        }}>
          NSPHERE CORE ADMIN v2.6
        </span>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        borderBottom: '1px solid #e7e5e4',
        marginBottom: '24px',
        overflowX: 'auto',
      }}>
        {[
          { id: 'metrics', label: 'Platform KPIs', icon: <DollarSign size={15} /> },
          { id: 'vendors', label: `Vendor Governance (${vendors.length})`, icon: <Users size={15} /> },
          { id: 'catalog', label: `Catalog Moderation (${products.length})`, icon: <Package size={15} /> },
          { id: 'financials', label: 'Commissions & Payouts', icon: <Building size={15} /> },
          { id: 'audit', label: `Audit Trail (${auditLogs.length})`, icon: <ClipboardList size={15} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setAdminTab(tab.id as any)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 16px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 700,
              color: adminTab === tab.id ? '#7c3aed' : '#78716c',
              borderBottom: adminTab === tab.id ? '3px solid #7c3aed' : '3px solid transparent',
              whiteSpace: 'nowrap',
            }}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: METRICS */}
      {adminTab === 'metrics' && (
        <div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px',
            marginBottom: '28px',
          }}>
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e7e5e4',
              borderRadius: '14px',
              padding: '18px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
            }}>
              <div style={{ fontSize: '12px', color: '#78716c', fontWeight: 600, textTransform: 'uppercase' }}>
                Gross Marketplace Value (GMV)
              </div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#1c1917', marginTop: '4px' }}>
                ₹{totalGmv.toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '11px', color: '#15803d', marginTop: '4px' }}>
                Across {masterOrders.length} customer bookings
              </div>
            </div>

            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e7e5e4',
              borderRadius: '14px',
              padding: '18px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
            }}>
              <div style={{ fontSize: '12px', color: '#78716c', fontWeight: 600, textTransform: 'uppercase' }}>
                Platform Commission Earned
              </div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#7c3aed', marginTop: '4px' }}>
                ₹{totalPlatformCommissions.toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '11px', color: '#6d28d9', marginTop: '4px' }}>
                Average take rate: 10%
              </div>
            </div>

            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e7e5e4',
              borderRadius: '14px',
              padding: '18px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
            }}>
              <div style={{ fontSize: '12px', color: '#78716c', fontWeight: 600, textTransform: 'uppercase' }}>
                Escrow Deposits Held
              </div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#065f46', marginTop: '4px' }}>
                ₹{totalEscrowDeposits.toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '11px', color: '#047857', marginTop: '4px' }}>
                100% safeguarded in escrow trust account
              </div>
            </div>

            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e7e5e4',
              borderRadius: '14px',
              padding: '18px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
            }}>
              <div style={{ fontSize: '12px', color: '#78716c', fontWeight: 600, textTransform: 'uppercase' }}>
                Active Regional Vendors
              </div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#0284c7', marginTop: '4px' }}>
                {vendors.filter((v) => v.status === 'verified').length} / {vendors.length}
              </div>
              <div style={{ fontSize: '11px', color: '#0369a1', marginTop: '4px' }}>
                All KYC verified & audited warehouses
              </div>
            </div>
          </div>

          {/* Master Orders Overview */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e7e5e4',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1c1917', marginBottom: '14px' }}>
              All Platform Master Orders
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {masterOrders.map((mo) => (
                <div
                  key={mo.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    backgroundColor: '#fafaf9',
                    borderRadius: '10px',
                    border: '1px solid #e7e5e4',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#1c1917' }}>
                      {mo.orderNumber} • {mo.customerName}
                    </div>
                    <div style={{ fontSize: '11px', color: '#78716c' }}>
                      {mo.vendorOrders.length} child orders • {mo.shippingAddress}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#065f46' }}>
                      ₹{mo.grandTotal.toLocaleString('en-IN')}
                    </div>
                    <div style={{ fontSize: '10px', color: '#78716c' }}>
                      Txn: {mo.paymentTransactionId}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: VENDOR GOVERNANCE & KYC */}
      {adminTab === 'vendors' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1c1917', margin: 0 }}>
              Vendor Verification & Commission Management
            </h3>
            <input
              type="text"
              placeholder="Filter by vendor name or city..."
              value={vendorSearch}
              onChange={(e) => setVendorSearch(e.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid #d6d3d1',
                fontSize: '12px',
                width: '240px',
              }}
            />
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e7e5e4',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#fafaf9', borderBottom: '1px solid #e7e5e4', color: '#78716c', fontWeight: 700 }}>
                  <th style={{ padding: '12px 16px' }}>Vendor Business</th>
                  <th style={{ padding: '12px 16px' }}>Location</th>
                  <th style={{ padding: '12px 16px' }}>GST & Bank</th>
                  <th style={{ padding: '12px 16px' }}>Commission %</th>
                  <th style={{ padding: '12px 16px' }}>KYC Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVendors.map((v) => (
                  <tr key={v.id} style={{ borderBottom: '1px solid #f5f5f4' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img
                          src={v.logoUrl}
                          alt={v.businessName}
                          style={{ width: '38px', height: '38px', borderRadius: '8px', objectFit: 'cover' }}
                        />
                        <div>
                          <strong style={{ color: '#1c1917' }}>{v.businessName}</strong>
                          <div style={{ fontSize: '11px', color: '#78716c' }}>{v.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#57534e' }}>{v.city}, {v.state}</td>
                    <td style={{ padding: '12px 16px', fontSize: '11px' }}>
                      <div>GST: <strong>{v.gstNumber || '32AAFCE0708D1ZD'}</strong></div>
                      <div style={{ color: '#78716c' }}>Bank: {v.bankAccount || '921020038819201'}</div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <input
                        type="number"
                        value={v.commissionRatePct}
                        onChange={(e) => updateVendorCommission(v.id, Number(e.target.value))}
                        style={{
                          width: '60px',
                          padding: '4px 6px',
                          borderRadius: '6px',
                          border: '1px solid #d6d3d1',
                          fontSize: '12px',
                          fontWeight: 700,
                        }}
                      />
                      <span style={{ marginLeft: '4px', fontSize: '12px' }}>%</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '9999px',
                        backgroundColor: v.status === 'verified' ? '#ecfdf5' : '#fef3c7',
                        color: v.status === 'verified' ? '#065f46' : '#b45309',
                      }}>
                        {v.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      {v.status !== 'verified' ? (
                        <button
                          onClick={() => updateVendorKycStatus(v.id, 'verified')}
                          style={{
                            padding: '4px 10px',
                            borderRadius: '6px',
                            backgroundColor: '#065f46',
                            color: '#ffffff',
                            border: 'none',
                            fontSize: '11px',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          Approve KYC
                        </button>
                      ) : (
                        <button
                          onClick={() => updateVendorKycStatus(v.id, 'suspended')}
                          style={{
                            padding: '4px 10px',
                            borderRadius: '6px',
                            backgroundColor: '#dc2626',
                            color: '#ffffff',
                            border: 'none',
                            fontSize: '11px',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          Suspend
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CATALOG MODERATION */}
      {adminTab === 'catalog' && (
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1c1917', marginBottom: '16px' }}>
            Rental Catalog Moderation ({products.length} Products)
          </h3>

          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e7e5e4',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#fafaf9', borderBottom: '1px solid #e7e5e4', color: '#78716c', fontWeight: 700 }}>
                  <th style={{ padding: '12px 16px' }}>Product</th>
                  <th style={{ padding: '12px 16px' }}>Vendor</th>
                  <th style={{ padding: '12px 16px' }}>Category</th>
                  <th style={{ padding: '12px 16px' }}>Price/Deposit</th>
                  <th style={{ padding: '12px 16px' }}>Stock</th>
                  <th style={{ padding: '12px 16px' }}>Featured Flag</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f5f5f4' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img
                          src={p.primaryImageUrl}
                          alt={p.name}
                          style={{ width: '38px', height: '38px', borderRadius: '6px', objectFit: 'cover' }}
                        />
                        <div>
                          <strong style={{ color: '#1c1917' }}>{p.name}</strong>
                          <div style={{ fontSize: '10px', color: '#78716c' }}>{p.itemCode}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#57534e' }}>{p.vendorName}</td>
                    <td style={{ padding: '12px 16px', color: '#57534e' }}>{p.categoryName}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ color: '#065f46', fontWeight: 700 }}>₹{p.rentalPrice}/d</span>
                      <span style={{ fontSize: '11px', color: '#78716c', marginLeft: '4px' }}>(₹{p.securityDeposit})</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <strong>{p.availableQuantity}</strong> / {p.totalQuantity}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <button
                        onClick={() => toggleProductFeatured(p.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          border: p.featured ? '1px solid #d97706' : '1px solid #e7e5e4',
                          backgroundColor: p.featured ? '#fef3c7' : '#ffffff',
                          color: p.featured ? '#b45309' : '#78716c',
                          cursor: 'pointer',
                          fontSize: '11px',
                          fontWeight: 700,
                        }}
                      >
                        <Star size={12} fill={p.featured ? '#d97706' : 'none'} />
                        {p.featured ? 'Featured' : 'Standard'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: FINANCIALS & SETTLEMENTS */}
      {adminTab === 'financials' && (
        <div style={{ maxWidth: '780px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1c1917', marginBottom: '16px' }}>
            Pending Vendor Payout Batch Approvals
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {vendors.filter((v) => v.pendingPayouts > 0).length === 0 ? (
              <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e7e5e4',
                borderRadius: '12px',
                padding: '24px',
                textAlign: 'center',
                color: '#78716c',
              }}>
                All vendor payouts have been settled. No pending withdrawal requests.
              </div>
            ) : (
              vendors.filter((v) => v.pendingPayouts > 0).map((vend) => (
                <div
                  key={vend.id}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e7e5e4',
                    borderRadius: '14px',
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#1c1917', margin: 0 }}>
                      {vend.businessName}
                    </h4>
                    <div style={{ fontSize: '12px', color: '#78716c', marginTop: '2px' }}>
                      Account: {vend.bankAccount || '921020038819201'} ({vend.ifscCode || 'HDFC0001244'})
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '16px', fontWeight: 800, color: '#065f46' }}>
                        ₹{vend.pendingPayouts.toLocaleString('en-IN')}
                      </div>
                      <div style={{ fontSize: '11px', color: '#b45309' }}>Pending Wire Transfer</div>
                    </div>

                    <button
                      onClick={() => approveVendorPayout(vend.id, vend.pendingPayouts)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        backgroundColor: '#065f46',
                        color: '#ffffff',
                        border: 'none',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Approve & Dispatch
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 5: SYSTEM AUDIT LOGS */}
      {adminTab === 'audit' && (
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1c1917', marginBottom: '16px' }}>
            Chronological System Audit Trail ({auditLogs.length} Events)
          </h3>

          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e7e5e4',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
              <thead>
                <tr style={{ backgroundColor: '#fafaf9', borderBottom: '1px solid #e7e5e4', color: '#78716c', fontWeight: 700 }}>
                  <th style={{ padding: '12px 16px' }}>Timestamp</th>
                  <th style={{ padding: '12px 16px' }}>Actor</th>
                  <th style={{ padding: '12px 16px' }}>Action</th>
                  <th style={{ padding: '12px 16px' }}>Entity</th>
                  <th style={{ padding: '12px 16px' }}>Details</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log.id} style={{ borderBottom: '1px solid #f5f5f4' }}>
                    <td style={{ padding: '10px 16px', color: '#78716c', whiteSpace: 'nowrap' }}>
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td style={{ padding: '10px 16px' }}>
                      <strong>{log.userName}</strong> ({log.role})
                    </td>
                    <td style={{ padding: '10px 16px', color: '#1c1917', fontWeight: 600 }}>
                      {log.action}
                    </td>
                    <td style={{ padding: '10px 16px', textTransform: 'uppercase', color: '#78716c', fontFamily: 'monospace' }}>
                      {log.entityType}
                    </td>
                    <td style={{ padding: '10px 16px', color: '#57534e' }}>
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
