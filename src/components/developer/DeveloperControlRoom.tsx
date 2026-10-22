import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import {
  Terminal,
  Database,
  Activity,
  Sliders,
  RotateCcw,
  KeyRound,
  CheckCircle2,
  Copy,
  Lock,
  Server,
} from 'lucide-react';
import { DEV_SECRET_PASSCODE, DEV_DEFAULT_EMAIL } from '../../services/developerEngine';

export const DeveloperControlRoom: React.FC = () => {
  const {
    developerToken,
    loginDeveloper,
    logoutDeveloper,
    systemHealth,
    featureFlags,
    toggleFeatureFlag,
    resetToSeedData,
    products,
    vendors,
    masterOrders,
    maintenanceRecords,
    auditLogs,
    addToast,
  } = useMarketplace();

  // Login form state
  const [email, setEmail] = useState(DEV_DEFAULT_EMAIL);
  const [password, setPassword] = useState('NSPHERE#DEV2026');
  const [secretCode, setSecretCode] = useState(DEV_SECRET_PASSCODE);
  const [errorMessage, setErrorMessage] = useState('');

  // Dev Console active subtab
  const [devTab, setDevTab] = useState<'health' | 'database' | 'flags' | 'stream'>('health');
  const [selectedCollection, setSelectedCollection] = useState<'products' | 'vendors' | 'orders' | 'maintenance' | 'audit'>('products');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const res = loginDeveloper(email, password, secretCode);
    if (!res.success) {
      setErrorMessage(res.message);
    }
  };

  const getCollectionData = () => {
    switch (selectedCollection) {
      case 'products':
        return products;
      case 'vendors':
        return vendors;
      case 'orders':
        return masterOrders;
      case 'maintenance':
        return maintenanceRecords;
      case 'audit':
        return auditLogs;
      default:
        return [];
    }
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(getCollectionData(), null, 2));
    addToast('success', 'JSON Copied to Clipboard');
  };

  // If NOT authenticated, show the secure developer login screen
  if (!developerToken) {
    return (
      <div style={{
        maxWidth: '520px',
        margin: '60px auto',
        padding: '24px',
      }}>
        <div style={{
          backgroundColor: '#1c1917',
          color: '#f5f3ef',
          borderRadius: '20px',
          padding: '32px',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              backgroundColor: '#ea580c',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Terminal size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                Developer Control Room
              </h2>
              <div style={{ fontSize: '11px', color: '#a8a29e', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Internal Root Access Gate
              </div>
            </div>
          </div>

          <p style={{ fontSize: '13px', color: '#d6d3d1', lineHeight: 1.5, marginBottom: '24px' }}>
            Restricted to authorized system developers. Requires verified engineer email, password, and the <strong>Developer Secret Passcode</strong>.
          </p>

          {errorMessage && (
            <div style={{
              backgroundColor: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid #ef4444',
              color: '#fca5a5',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              marginBottom: '16px',
            }}>
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#a8a29e', marginBottom: '6px' }}>
                Developer Internal Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  backgroundColor: '#292524',
                  border: '1px solid #44403c',
                  color: '#ffffff',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#a8a29e', marginBottom: '6px' }}>
                Engineering Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  backgroundColor: '#292524',
                  border: '1px solid #44403c',
                  color: '#ffffff',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#ea580c' }}>
                  Secret Developer Access Code
                </label>
                <span style={{ fontSize: '10px', color: '#78716c' }}>
                  Required: DEV-NSPHERE-2026-ROOT
                </span>
              </div>
              <input
                type="text"
                required
                value={secretCode}
                onChange={(e) => setSecretCode(e.target.value)}
                placeholder="DEV-NSPHERE-2026-ROOT"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  backgroundColor: '#292524',
                  border: '1px solid #ea580c',
                  color: '#fbbf24',
                  fontFamily: 'monospace',
                  fontSize: '13px',
                  outline: 'none',
                  fontWeight: 700,
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: '#ea580c',
                color: '#ffffff',
                border: 'none',
                fontSize: '14px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(234, 88, 12, 0.4)',
              }}
            >
              <KeyRound size={16} />
              Verify & Unlock Control Room
            </button>
          </form>
        </div>
      </div>
    );
  }

  // AUTHENTICATED: Display Developer Console
  return (
    <div style={{
      maxWidth: '1440px',
      margin: '0 auto',
      padding: '24px',
      minHeight: 'calc(100vh - 120px)',
    }}>
      {/* Dev Header */}
      <div style={{
        backgroundColor: '#1c1917',
        color: '#ffffff',
        borderRadius: '16px',
        padding: '20px 24px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        border: '1px solid #292524',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            backgroundColor: '#ea580c',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Terminal size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>
                Developer Control Room (Root Session)
              </h2>
              <span style={{
                fontSize: '11px',
                fontWeight: 700,
                backgroundColor: 'rgba(34, 197, 94, 0.2)',
                color: '#4ade80',
                padding: '2px 8px',
                borderRadius: '9999px',
                border: '1px solid rgba(34, 197, 94, 0.4)',
              }}>
                ACTIVE SESSION
              </span>
            </div>
            <div style={{ fontSize: '11px', color: '#a8a29e', marginTop: '3px' }}>
              Secret Code Verified: <strong>{DEV_SECRET_PASSCODE}</strong> • Token: {developerToken.substring(0, 16)}...
            </div>
          </div>
        </div>

        <button
          onClick={logoutDeveloper}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#292524',
            color: '#ef4444',
            border: '1px solid #44403c',
            borderRadius: '8px',
            padding: '8px 14px',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          <Lock size={14} />
          Lock / Terminate Session
        </button>
      </div>

      {/* Dev Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        borderBottom: '1px solid #e7e5e4',
        marginBottom: '24px',
        overflowX: 'auto',
      }}>
        {[
          { id: 'health', label: 'System Health & Telemetry', icon: <Activity size={15} /> },
          { id: 'database', label: 'Live Database Inspector', icon: <Database size={15} /> },
          { id: 'flags', label: 'Feature Flags & Controls', icon: <Sliders size={15} /> },
          { id: 'stream', label: 'Live Event Logs Stream', icon: <Server size={15} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setDevTab(tab.id as any)}
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
              color: devTab === tab.id ? '#ea580c' : '#78716c',
              borderBottom: devTab === tab.id ? '3px solid #ea580c' : '3px solid transparent',
              whiteSpace: 'nowrap',
            }}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* SUBTAB 1: HEALTH & TELEMETRY */}
      {devTab === 'health' && (
        <div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            marginBottom: '24px',
          }}>
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e7e5e4', borderRadius: '14px', padding: '18px' }}>
              <div style={{ fontSize: '11px', color: '#78716c', fontWeight: 600, textTransform: 'uppercase' }}>API Status</div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#16a34a', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={18} /> {systemHealth.apiStatus.toUpperCase()}
              </div>
              <div style={{ fontSize: '11px', color: '#78716c', marginTop: '2px' }}>Latency: 22ms</div>
            </div>

            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e7e5e4', borderRadius: '14px', padding: '18px' }}>
              <div style={{ fontSize: '11px', color: '#78716c', fontWeight: 600, textTransform: 'uppercase' }}>Database Status</div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#0284c7', marginTop: '4px' }}>
                CONNECTED
              </div>
              <div style={{ fontSize: '11px', color: '#78716c', marginTop: '2px' }}>Supabase / Postgres Pool</div>
            </div>

            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e7e5e4', borderRadius: '14px', padding: '18px' }}>
              <div style={{ fontSize: '11px', color: '#78716c', fontWeight: 600, textTransform: 'uppercase' }}>Memory Allocated</div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#7c3aed', marginTop: '4px' }}>
                {systemHealth.memoryUsageMb} MB
              </div>
              <div style={{ fontSize: '11px', color: '#78716c', marginTop: '2px' }}>Garbage collection nominal</div>
            </div>

            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e7e5e4', borderRadius: '14px', padding: '18px' }}>
              <div style={{ fontSize: '11px', color: '#78716c', fontWeight: 600, textTransform: 'uppercase' }}>System Uptime</div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#1c1917', marginTop: '4px' }}>
                {Math.floor(systemHealth.uptimeSeconds / 60)}m {systemHealth.uptimeSeconds % 60}s
              </div>
              <div style={{ fontSize: '11px', color: '#78716c', marginTop: '2px' }}>0 fatal crashes logged</div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: DATABASE INSPECTOR */}
      {devTab === 'database' && (
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
            flexWrap: 'wrap',
            gap: '12px',
          }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[
                { id: 'products', label: `Products (${products.length})` },
                { id: 'vendors', label: `Vendors (${vendors.length})` },
                { id: 'orders', label: `MasterOrders (${masterOrders.length})` },
                { id: 'maintenance', label: `Maintenance (${maintenanceRecords.length})` },
                { id: 'audit', label: `AuditLogs (${auditLogs.length})` },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCollection(c.id as any)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: selectedCollection === c.id ? '2px solid #ea580c' : '1px solid #e7e5e4',
                    backgroundColor: selectedCollection === c.id ? '#fff7ed' : '#ffffff',
                    color: selectedCollection === c.id ? '#ea580c' : '#44403c',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleCopyJson}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                backgroundColor: '#1c1917',
                color: '#ffffff',
                border: 'none',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Copy size={13} />
              Copy Collection JSON
            </button>
          </div>

          {/* JSON Explorer View */}
          <div style={{
            backgroundColor: '#1c1917',
            borderRadius: '14px',
            padding: '16px',
            border: '1px solid #292524',
            maxHeight: '520px',
            overflowY: 'auto',
          }}>
            <pre style={{
              margin: 0,
              fontSize: '12px',
              fontFamily: 'Consolas, Monaco, monospace',
              color: '#34d399',
              lineHeight: 1.4,
            }}>
              {JSON.stringify(getCollectionData(), null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* SUBTAB 3: FEATURE FLAGS */}
      {devTab === 'flags' && (
        <div style={{ maxWidth: '680px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1c1917', marginBottom: '16px' }}>
            Runtime System Overrides & Feature Flags
          </h3>

          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e7e5e4',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}>
            {[
              {
                key: 'strictStockCheck' as const,
                title: 'Strict Date-Aware Stock Lock',
                desc: 'Prevents checkout if requested quantity overlaps with an existing reserved order',
              },
              {
                key: 'maintenanceMode' as const,
                title: 'Global Maintenance Mode',
                desc: 'Displays maintenance banner on customer storefront',
              },
              {
                key: 'simulatePaymentFailures' as const,
                title: 'Simulate Payment Gateway Failures',
                desc: 'Forces gateway authorization to throw mock decline error',
              },
              {
                key: 'verboseLogging' as const,
                title: 'Verbose Telemetry & Audit Logs',
                desc: 'Captures sub-millisecond trace headers on every mutation',
              },
            ].map((flag) => {
              const isEnabled = featureFlags[flag.key];

              return (
                <div
                  key={flag.key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingBottom: '12px',
                    borderBottom: '1px solid #f5f5f4',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#1c1917' }}>{flag.title}</div>
                    <div style={{ fontSize: '12px', color: '#78716c' }}>{flag.desc}</div>
                  </div>

                  <button
                    onClick={() => toggleFeatureFlag(flag.key)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '9999px',
                      border: 'none',
                      backgroundColor: isEnabled ? '#065f46' : '#e7e5e4',
                      color: isEnabled ? '#ffffff' : '#78716c',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {isEnabled ? 'ENABLED' : 'DISABLED'}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Dangerous Operations */}
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '16px',
            padding: '20px',
          }}>
            <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#991b1b', margin: '0 0 6px' }}>
              Database Reset & Seed Recovery
            </h4>
            <p style={{ fontSize: '12px', color: '#b91c1c', margin: '0 0 16px' }}>
              Replaces in-memory state with freshly seeded categories, products, orders, and verified vendors.
            </p>
            <button
              onClick={resetToSeedData}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '8px',
                backgroundColor: '#dc2626',
                color: '#ffffff',
                border: 'none',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <RotateCcw size={14} />
              Reset All Collections to Initial Seed
            </button>
          </div>
        </div>
      )}

      {/* SUBTAB 4: LIVE EVENT STREAM */}
      {devTab === 'stream' && (
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1c1917', marginBottom: '16px' }}>
            Real-Time Platform Event Stream ({auditLogs.length} Events)
          </h3>

          <div style={{
            backgroundColor: '#1c1917',
            borderRadius: '14px',
            padding: '16px',
            border: '1px solid #292524',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}>
            {auditLogs.map((log) => (
              <div
                key={log.id}
                style={{
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  color: '#e7e5e4',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  borderBottom: '1px solid #292524',
                  paddingBottom: '6px',
                }}
              >
                <span style={{ color: '#ea580c' }}>
                  [{new Date(log.timestamp).toISOString().split('T')[1].substring(0, 8)}]
                </span>
                <span style={{ color: '#38bdf8' }}>{log.role.toUpperCase()}</span>
                <span style={{ color: '#4ade80' }}>{log.action}</span>
                <span style={{ color: '#a8a29e', marginLeft: 'auto' }}>{log.details}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
