import React, { useState, useMemo } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import {
  Store,
  Package,
  Truck,
  Wrench,
  DollarSign,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Shield,
  Layers,
  Phone,
  Calendar,
  X,
  FileText,
  Building,
} from 'lucide-react';
import { Product, VendorOrderStatus, DispatchManifest } from '../../types/marketplace';

export const VendorDashboard: React.FC = () => {
  const {
    activeVendor,
    activeVendorId,
    setActiveVendorId,
    vendors,
    products,
    masterOrders,
    maintenanceRecords,
    addNewProduct,
    updateProduct,
    deleteProduct,
    updateOrderStatus,
    processReturnInspection,
    resolveMaintenanceItem,
    requestVendorPayout,
    addMaintenanceItem,
    addToast,
  } = useMarketplace();

  const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'orders' | 'maintenance' | 'payouts'>('overview');

  // Vendor inventory
  const vendorProducts = useMemo(() => {
    return products.filter((p) => p.vendorId === activeVendorId);
  }, [products, activeVendorId]);

  // Vendor orders
  const vendorOrders = useMemo(() => {
    const list = [];
    for (const master of masterOrders) {
      for (const vo of master.vendorOrders) {
        if (vo.vendorId === activeVendorId) {
          list.push({ ...vo, masterDate: master.createdAt, shippingAddress: master.shippingAddress });
        }
      }
    }
    return list;
  }, [masterOrders, activeVendorId]);

  // Vendor maintenance items
  const vendorMaintenance = useMemo(() => {
    return maintenanceRecords.filter((m) => m.vendorId === activeVendorId);
  }, [maintenanceRecords, activeVendorId]);

  // Modals
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [dispatchModalOrder, setDispatchModalOrder] = useState<any | null>(null);
  const [inspectionModalOrder, setInspectionModalOrder] = useState<any | null>(null);

  // Add Product Form State
  const [newProdName, setNewProdName] = useState('');
  const [newProdCatId, setNewProdCatId] = useState('cat-chairs');
  const [newProdPrice, setNewProdPrice] = useState(650);
  const [newProdDeposit, setNewProdDeposit] = useState(1000);
  const [newProdQty, setNewProdQty] = useState(25);
  const [newProdDim, setNewProdDim] = useState('18 x 18 x 38 in');
  const [newProdImg, setNewProdImg] = useState('https://nvndtckbkpuhalyalufh.supabase.co/storage/v1/object/public/inventory-media/52f1f88d-faa3-49f9-a96d-30480ee0c054/98bac4e1-f9c3-49b2-b108-403e8643da96/photo/1781935064604-ovb8x.blob');
  const [newProdDesc, setNewProdDesc] = useState('Luxury commercial-grade event chair with reinforced frame.');

  // Dispatch Manifest Form State (From AGC EventOS audit)
  const [manifestVehicle, setManifestVehicle] = useState('KL-07-CD-8921');
  const [manifestDriver, setManifestDriver] = useState('Suresh Kumar');
  const [manifestPhone, setManifestPhone] = useState('+91 9447182910');
  const [manifestPickupDate, setManifestPickupDate] = useState(new Date().toISOString().split('T')[0]);
  const [manifestPickupTime, setManifestPickupTime] = useState('06:30 AM');
  const [manifestNotes, setManifestNotes] = useState('Load wrapped in protective furniture blankets.');

  // Return Inspection Form State (From AGC EventOS audit)
  const [damagedCount, setDamagedCount] = useState(0);
  const [damageNotes, setDamageNotes] = useState('');
  const [penaltyFee, setPenaltyFee] = useState(0);
  const [inspectionAction, setInspectionAction] = useState<'restock' | 'send_to_maintenance'>('restock');

  // Payout request form
  const [payoutAmount, setPayoutAmount] = useState(5000);

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) {
      addToast('error', 'Product Name Required');
      return;
    }
    addNewProduct({
      name: newProdName,
      categoryId: newProdCatId,
      rentalPrice: Number(newProdPrice),
      securityDeposit: Number(newProdDeposit),
      totalQuantity: Number(newProdQty),
      availableQuantity: Number(newProdQty),
      dimension: newProdDim,
      primaryImageUrl: newProdImg,
      description: newProdDesc,
      status: 'active',
    });
    setIsAddProductOpen(false);
  };

  const handleConfirmDispatch = () => {
    if (!dispatchModalOrder) return;
    const manifest: DispatchManifest = {
      eventLocation: dispatchModalOrder.shippingAddress || 'Event Venue',
      vehicleNumber: manifestVehicle,
      driverName: manifestDriver,
      driverPhone: manifestPhone,
      pickupDate: manifestPickupDate,
      pickupTime: manifestPickupTime,
      notes: manifestNotes,
      receiptGeneratedAt: new Date().toISOString(),
    };
    updateOrderStatus(dispatchModalOrder.id, 'out_for_delivery', manifest);
    setDispatchModalOrder(null);
  };

  const handleConfirmInspection = () => {
    if (!inspectionModalOrder) return;
    processReturnInspection(inspectionModalOrder.id, {
      missingDamagedCount: Number(damagedCount),
      damageNotes: damageNotes || 'Normal wear & tear inspection cleared',
      penaltyFee: Number(penaltyFee),
      action: inspectionAction,
    });
    setInspectionModalOrder(null);
  };

  if (!activeVendor) {
    return <div>No active vendor found.</div>;
  }

  return (
    <div style={{
      maxWidth: '1440px',
      margin: '0 auto',
      padding: '24px',
      minHeight: 'calc(100vh - 120px)',
    }}>
      {/* Top Banner: Vendor Profile & Quick Vendor Switcher */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e7e5e4',
        borderRadius: '16px',
        padding: '20px 24px',
        marginBottom: '24px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img
            src={activeVendor.logoUrl}
            alt={activeVendor.businessName}
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '12px',
              objectFit: 'cover',
              border: '1px solid #e7e5e4',
            }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1c1917', margin: 0 }}>
                {activeVendor.businessName}
              </h2>
              <span style={{
                fontSize: '11px',
                fontWeight: 700,
                backgroundColor: '#ecfdf5',
                color: '#065f46',
                padding: '2px 8px',
                borderRadius: '9999px',
                textTransform: 'uppercase',
              }}>
                {activeVendor.status}
              </span>
            </div>
            <p style={{ fontSize: '12px', color: '#78716c', margin: '2px 0 0' }}>
              {activeVendor.address} • GST: {activeVendor.gstNumber || '32AAFCE0708D1ZD'} • Commission: {activeVendor.commissionRatePct}%
            </p>
          </div>
        </div>

        {/* Switch Vendor Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '12px', color: '#78716c', fontWeight: 600 }}>Switch Vendor Workspace:</span>
          <select
            value={activeVendorId}
            onChange={(e) => setActiveVendorId(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #d6d3d1',
              backgroundColor: '#f5f5f4',
              fontSize: '13px',
              fontWeight: 700,
              color: '#1c1917',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            {vendors.map((v) => (
              <option key={v.id} value={v.id}>
                {v.businessName} ({v.city})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        borderBottom: '1px solid #e7e5e4',
        marginBottom: '24px',
        overflowX: 'auto',
      }}>
        {[
          { id: 'overview', label: 'Overview & KPIs', icon: <Store size={15} /> },
          { id: 'inventory', label: `Inventory & Props (${vendorProducts.length})`, icon: <Package size={15} /> },
          { id: 'orders', label: `Orders & Dispatch (${vendorOrders.length})`, icon: <Truck size={15} /> },
          { id: 'maintenance', label: `Maintenance Pool (${vendorMaintenance.length})`, icon: <Wrench size={15} /> },
          { id: 'payouts', label: 'Earnings & Payouts', icon: <DollarSign size={15} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
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
              color: activeTab === tab.id ? '#065f46' : '#78716c',
              borderBottom: activeTab === tab.id ? '3px solid #065f46' : '3px solid transparent',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease',
            }}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW & KPIS */}
      {activeTab === 'overview' && (
        <div>
          {/* 4 Metric Cards */}
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
                Total Revenue Earned
              </div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#065f46', marginTop: '4px' }}>
                ₹{activeVendor.totalEarnings.toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '11px', color: '#15803d', marginTop: '4px' }}>
                After 10% platform commission deduction
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
                Available For Payout
              </div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#0284c7', marginTop: '4px' }}>
                ₹{activeVendor.availableBalance.toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                ₹{activeVendor.pendingPayouts.toLocaleString('en-IN')} currently pending transfer
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
                Active Rentals On Event
              </div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#ea580c', marginTop: '4px' }}>
                {activeVendor.activeRentals} Units
              </div>
              <div style={{ fontSize: '11px', color: '#c2410c', marginTop: '4px' }}>
                Across {vendorOrders.filter((o) => ['rented', 'out_for_delivery'].includes(o.status)).length} venues
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
                Maintenance / Repair Pool
              </div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#b91c1c', marginTop: '4px' }}>
                {vendorMaintenance.filter((m) => m.status === 'in_repair' || m.status === 'damaged').length} Units
              </div>
              <div style={{ fontSize: '11px', color: '#991b1b', marginTop: '4px' }}>
                Damaged props undergoing polish/repair
              </div>
            </div>
          </div>

          {/* Recent Orders in pipeline */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e7e5e4',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1c1917', marginBottom: '14px' }}>
              Pending & Active Dispatches
            </h3>
            {vendorOrders.length === 0 ? (
              <div style={{ fontSize: '13px', color: '#78716c', padding: '20px 0' }}>No active orders for this vendor.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {vendorOrders.slice(0, 5).map((vo) => (
                  <div
                    key={vo.id}
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
                        {vo.orderNumber} • {vo.customerName}
                      </div>
                      <div style={{ fontSize: '11px', color: '#78716c' }}>
                        {vo.items.length} items • Delivery: {vo.startDate} • Venue: {vo.customerAddress}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: '#065f46' }}>
                        ₹{vo.subtotal.toLocaleString('en-IN')}
                      </span>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '9999px',
                        backgroundColor: '#dbeafe',
                        color: '#1e40af',
                      }}>
                        {vo.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: INVENTORY & PROPS */}
      {activeTab === 'inventory' && (
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1c1917', margin: 0 }}>
              Rental Props & Stock Batches ({vendorProducts.length})
            </h3>
            <button
              onClick={() => setIsAddProductOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#065f46',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Plus size={15} />
              Add New Rental Prop
            </button>
          </div>

          {/* Inventory Table */}
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
                  <th style={{ padding: '12px 16px' }}>Photo / Code</th>
                  <th style={{ padding: '12px 16px' }}>Product Title</th>
                  <th style={{ padding: '12px 16px' }}>Category</th>
                  <th style={{ padding: '12px 16px' }}>Stock Stats</th>
                  <th style={{ padding: '12px 16px' }}>Rental Rate</th>
                  <th style={{ padding: '12px 16px' }}>Deposit</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {vendorProducts.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f5f5f4' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img
                          src={p.primaryImageUrl}
                          alt={p.name}
                          style={{ width: '44px', height: '44px', borderRadius: '6px', objectFit: 'cover' }}
                        />
                        <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#78716c' }}>
                          {p.itemCode}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <strong style={{ color: '#1c1917' }}>{p.name}</strong>
                      <div style={{ fontSize: '11px', color: '#78716c' }}>{p.dimension}</div>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#57534e' }}>{p.categoryName}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: '6px', fontSize: '11px' }}>
                        <span style={{ backgroundColor: '#ecfdf5', color: '#065f46', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                          {p.availableQuantity} Avail
                        </span>
                        <span style={{ backgroundColor: '#fef3c7', color: '#b45309', padding: '2px 6px', borderRadius: '4px' }}>
                          {p.totalQuantity - p.availableQuantity - (p.inRepairQuantity || 0)} Out
                        </span>
                        {(p.inRepairQuantity || 0) > 0 && (
                          <span style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '2px 6px', borderRadius: '4px' }}>
                            {p.inRepairQuantity} Repair
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 700, color: '#065f46' }}>
                      ₹{p.rentalPrice}/day
                    </td>
                    <td style={{ padding: '12px 16px', color: '#57534e' }}>
                      ₹{p.securityDeposit}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        backgroundColor: p.status === 'active' ? '#ecfdf5' : '#f5f5f4',
                        color: p.status === 'active' ? '#065f46' : '#78716c',
                      }}>
                        {p.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <button
                        onClick={() => deleteProduct(p.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#dc2626',
                          cursor: 'pointer',
                          padding: '4px',
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ORDERS & LOGISTICS FULFILLMENT (7 STEPS PIPELINE) */}
      {activeTab === 'orders' && (
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1c1917', marginBottom: '16px' }}>
            Vendor Fulfillment Pipeline ({vendorOrders.length} Orders)
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {vendorOrders.map((order) => (
              <div
                key={order.id}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e7e5e4',
                  borderRadius: '16px',
                  padding: '20px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                }}
              >
                {/* Order Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid #f5f5f4',
                  paddingBottom: '12px',
                  marginBottom: '14px',
                  flexWrap: 'wrap',
                  gap: '10px',
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <strong style={{ fontSize: '15px', color: '#1c1917' }}>{order.orderNumber}</strong>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        backgroundColor:
                          order.status === 'rented' || order.status === 'out_for_delivery'
                            ? '#dbeafe'
                            : order.status === 'completed'
                            ? '#dcfce7'
                            : '#fef3c7',
                        color:
                          order.status === 'rented' || order.status === 'out_for_delivery'
                            ? '#1e40af'
                            : order.status === 'completed'
                            ? '#15803d'
                            : '#b45309',
                      }}>
                        {order.status.toUpperCase().replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#78716c', marginTop: '2px' }}>
                      Customer: <strong>{order.customerName}</strong> ({order.customerPhone}) • Venue: {order.customerAddress}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#065f46' }}>
                      ₹{order.subtotal.toLocaleString('en-IN')}
                    </div>
                    <div style={{ fontSize: '11px', color: '#78716c' }}>
                      Net Payout: ₹{order.vendorPayoutAmount.toLocaleString('en-IN')} (10% platform fee deducted)
                    </div>
                  </div>
                </div>

                {/* Items in this order */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#78716c', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Inventory Lines to Dispatch:
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
                    {order.items.map((it, idx) => (
                      <div
                        key={idx}
                        style={{
                          backgroundColor: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          padding: '8px 10px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <img
                          src={it.productImage}
                          alt={it.productName}
                          style={{ width: '32px', height: '32px', borderRadius: '4px', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>
                            {it.quantity}x {it.productName}
                          </div>
                          <div style={{ fontSize: '10px', color: '#64748b' }}>
                            {it.itemCode}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Logistics Dispatch Details if available */}
                {order.logistics && (
                  <div style={{
                    backgroundColor: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '12px',
                    color: '#1e40af',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Truck size={16} />
                      <span>Truck: <strong>{order.logistics.vehicleNumber}</strong> • Driver: <strong>{order.logistics.driverName}</strong> ({order.logistics.driverPhone})</span>
                    </div>
                    <span>Pickup: {order.logistics.pickupDate} at {order.logistics.pickupTime}</span>
                  </div>
                )}

                {/* 7-Step Lifecycle Action Buttons */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flexWrap: 'wrap',
                  paddingTop: '12px',
                  borderTop: '1px solid #f5f5f4',
                }}>
                  <span style={{ fontSize: '12px', color: '#78716c', fontWeight: 600 }}>Update Status:</span>

                  {order.status === 'confirmed' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'preparing')}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        backgroundColor: '#fef3c7',
                        color: '#b45309',
                        border: '1px solid #fde68a',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Mark "Preparing / Packing"
                    </button>
                  )}

                  {order.status === 'preparing' && (
                    <button
                      onClick={() => setDispatchModalOrder(order)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '6px 14px',
                        borderRadius: '6px',
                        backgroundColor: '#0284c7',
                        color: '#ffffff',
                        border: 'none',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      <Truck size={13} />
                      Generate Truck Manifest & Dispatch
                    </button>
                  )}

                  {order.status === 'out_for_delivery' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'rented')}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        backgroundColor: '#065f46',
                        color: '#ffffff',
                        border: 'none',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Confirm Delivered at Venue ("Rented Out")
                    </button>
                  )}

                  {order.status === 'rented' && (
                    <button
                      onClick={() => setInspectionModalOrder(order)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '6px 14px',
                        borderRadius: '6px',
                        backgroundColor: '#7c3aed',
                        color: '#ffffff',
                        border: 'none',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      <Wrench size={13} />
                      Execute Return & Damage Inspection
                    </button>
                  )}

                  {order.status === 'completed' && (
                    <span style={{ fontSize: '12px', color: '#15803d', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={14} /> Completed & Reconciled
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: MAINTENANCE POOL (From AGC EventOS audit) */}
      {activeTab === 'maintenance' && (
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1c1917', marginBottom: '16px' }}>
            Damaged Props & Repair Workflow ({vendorMaintenance.length} Items)
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {vendorMaintenance.map((record) => (
              <div
                key={record.id}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e7e5e4',
                  borderRadius: '14px',
                  padding: '16px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <img
                    src={record.productImage}
                    alt={record.productName}
                    style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                  />
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#1c1917', margin: 0 }}>
                      {record.quantity}x {record.productName}
                    </h4>
                    <span style={{ fontSize: '11px', color: '#78716c' }}>{record.itemCode}</span>
                  </div>
                </div>

                <div style={{
                  backgroundColor: '#fee2e2',
                  color: '#991b1b',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 600,
                  marginBottom: '10px',
                }}>
                  Damage: {record.damageDescription}
                </div>

                <div style={{ fontSize: '12px', color: '#57534e', marginBottom: '12px' }}>
                  <div>Repair Dock: <strong>{record.location}</strong></div>
                  <div>Estimated Cost: <strong>₹{record.repairCost}</strong></div>
                  <div>Reported Date: <strong>{new Date(record.reportedDate).toLocaleDateString()}</strong></div>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
                  {record.status !== 'repaired' ? (
                    <button
                      onClick={() => resolveMaintenanceItem(record.id, 'repaired', record.repairCost)}
                      style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '6px',
                        backgroundColor: '#065f46',
                        color: '#ffffff',
                        border: 'none',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                      }}
                    >
                      <CheckCircle2 size={13} />
                      Mark Repaired & Restock
                    </button>
                  ) : (
                    <div style={{ fontSize: '12px', color: '#15803d', fontWeight: 700 }}>
                      ✓ Repaired & Restocked to Catalog
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: EARNINGS & PAYOUTS */}
      {activeTab === 'payouts' && (
        <div style={{ maxWidth: '640px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1c1917', marginBottom: '16px' }}>
            Vendor Bank Settlement & Payouts
          </h3>

          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e7e5e4',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
            marginBottom: '20px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#78716c', fontWeight: 600 }}>AVAILABLE BALANCE</div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#065f46' }}>
                  ₹{activeVendor.availableBalance.toLocaleString('en-IN')}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '12px', color: '#78716c' }}>Pending Approval</div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#b45309' }}>
                  ₹{activeVendor.pendingPayouts.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            <div style={{
              backgroundColor: '#fafaf9',
              border: '1px solid #e7e5e4',
              borderRadius: '10px',
              padding: '12px',
              fontSize: '12px',
              marginBottom: '20px',
            }}>
              <div>Settlement Account: <strong>{activeVendor.bankAccount || '921020038819201'}</strong></div>
              <div>IFSC Code: <strong>{activeVendor.ifscCode || 'HDFC0001244'}</strong></div>
              <div>Account Name: <strong>{activeVendor.businessName}</strong></div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1c1917', marginBottom: '6px' }}>
                Amount to Withdraw (INR)
              </label>
              <input
                type="number"
                value={payoutAmount}
                onChange={(e) => setPayoutAmount(Number(e.target.value))}
                max={activeVendor.availableBalance}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #d6d3d1',
                  fontSize: '14px',
                  fontWeight: 700,
                  outline: 'none',
                }}
              />
            </div>

            <button
              onClick={() => requestVendorPayout(activeVendor.id, payoutAmount)}
              disabled={activeVendor.availableBalance < payoutAmount || payoutAmount <= 0}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: activeVendor.availableBalance < payoutAmount ? '#d6d3d1' : '#065f46',
                color: '#ffffff',
                border: 'none',
                fontSize: '14px',
                fontWeight: 700,
                cursor: activeVendor.availableBalance < payoutAmount ? 'not-allowed' : 'pointer',
              }}
            >
              Request Bank Payout Transfer
            </button>
          </div>
        </div>
      )}

      {/* MODAL: ADD PRODUCT */}
      {isAddProductOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1100,
          padding: '16px',
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '560px',
            padding: '24px',
            maxHeight: '90vh',
            overflowY: 'auto',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>Add New Rental Prop</h3>
              <button onClick={() => setIsAddProductOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateProduct}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600 }}>Product Title</label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="e.g. Vintage Teakwood Dining Chair"
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #d6d3d1' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600 }}>Category</label>
                  <select
                    value={newProdCatId}
                    onChange={(e) => setNewProdCatId(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #d6d3d1' }}
                  >
                    <option value="cat-chairs">Chairs & Seating</option>
                    <option value="cat-tables">Tables & Furniture</option>
                    <option value="cat-lighting">Chandeliers & Lights</option>
                    <option value="cat-tableware">Tableware & Cutlery</option>
                    <option value="cat-linens">Linens & Tiebacks</option>
                    <option value="cat-props">Stage Props</option>
                    <option value="cat-vases">Brass Vases</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600 }}>Total Units</label>
                  <input
                    type="number"
                    value={newProdQty}
                    onChange={(e) => setNewProdQty(Number(e.target.value))}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #d6d3d1' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600 }}>Rental Rate (₹/day)</label>
                  <input
                    type="number"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #d6d3d1' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600 }}>Security Deposit (₹)</label>
                  <input
                    type="number"
                    value={newProdDeposit}
                    onChange={(e) => setNewProdDeposit(Number(e.target.value))}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #d6d3d1' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600 }}>Dimensions</label>
                <input
                  type="text"
                  value={newProdDim}
                  onChange={(e) => setNewProdDim(e.target.value)}
                  placeholder="e.g. 18 x 18 x 38 in"
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #d6d3d1' }}
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600 }}>Image URL</label>
                <input
                  type="text"
                  value={newProdImg}
                  onChange={(e) => setNewProdImg(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #d6d3d1' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600 }}>Description</label>
                <textarea
                  rows={2}
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #d6d3d1' }}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: '#065f46',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Publish to Rental Catalog
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: LOGISTICS DISPATCH MANIFEST (From AGC EventOS audit) */}
      {dispatchModalOrder && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.65)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1100,
          padding: '16px',
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '520px',
            padding: '24px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Truck size={20} style={{ color: '#0284c7' }} />
                <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0 }}>
                  Generate Dispatch Manifest ({dispatchModalOrder.orderNumber})
                </h3>
              </div>
              <button onClick={() => setDispatchModalOrder(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600 }}>Assigned Vehicle Number</label>
              <input
                type="text"
                value={manifestVehicle}
                onChange={(e) => setManifestVehicle(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #d6d3d1' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600 }}>Driver Name</label>
                <input
                  type="text"
                  value={manifestDriver}
                  onChange={(e) => setManifestDriver(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #d6d3d1' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600 }}>Driver Mobile</label>
                <input
                  type="text"
                  value={manifestPhone}
                  onChange={(e) => setManifestPhone(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #d6d3d1' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600 }}>Dispatch Date</label>
                <input
                  type="date"
                  value={manifestPickupDate}
                  onChange={(e) => setManifestPickupDate(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #d6d3d1' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600 }}>Pickup Slot</label>
                <input
                  type="text"
                  value={manifestPickupTime}
                  onChange={(e) => setManifestPickupTime(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #d6d3d1' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600 }}>Manifest Instructions</label>
              <input
                type="text"
                value={manifestNotes}
                onChange={(e) => setManifestNotes(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #d6d3d1' }}
              />
            </div>

            <button
              onClick={handleConfirmDispatch}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: '#0284c7',
                color: '#ffffff',
                border: 'none',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Sign Manifest & Mark Dispatched
            </button>
          </div>
        </div>
      )}

      {/* MODAL: RETURN & DAMAGE INSPECTION (From AGC EventOS audit) */}
      {inspectionModalOrder && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.65)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1100,
          padding: '16px',
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '520px',
            padding: '24px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Wrench size={20} style={{ color: '#7c3aed' }} />
                <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0 }}>
                  Post-Event Return Inspection ({inspectionModalOrder.orderNumber})
                </h3>
              </div>
              <button onClick={() => setInspectionModalOrder(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600 }}>Damaged / Missing Items Count</label>
              <input
                type="number"
                min={0}
                value={damagedCount}
                onChange={(e) => setDamagedCount(Number(e.target.value))}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #d6d3d1' }}
              />
            </div>

            {damagedCount > 0 && (
              <>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600 }}>Damage Description</label>
                  <input
                    type="text"
                    value={damageNotes}
                    onChange={(e) => setDamageNotes(e.target.value)}
                    placeholder="e.g. Scratched gold plating / chipped rim"
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #d6d3d1' }}
                  />
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600 }}>Deduction Penalty Fee (₹)</label>
                  <input
                    type="number"
                    value={penaltyFee}
                    onChange={(e) => setPenaltyFee(Number(e.target.value))}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #d6d3d1' }}
                  />
                  <span style={{ fontSize: '11px', color: '#78716c' }}>
                    Deducted from customer's ₹{inspectionModalOrder.securityDeposit} refundable deposit
                  </span>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600 }}>Route Damaged Props To:</label>
                  <select
                    value={inspectionAction}
                    onChange={(e) => setInspectionAction(e.target.value as any)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #d6d3d1' }}
                  >
                    <option value="send_to_maintenance">Move to Vendor Maintenance / Repair Pool</option>
                    <option value="restock">Minor Scuffs - Restock directly to Catalog</option>
                  </select>
                </div>
              </>
            )}

            <button
              onClick={handleConfirmInspection}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: '#7c3aed',
                color: '#ffffff',
                border: 'none',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Finalize Inspection & Settle Escrow Deposit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
