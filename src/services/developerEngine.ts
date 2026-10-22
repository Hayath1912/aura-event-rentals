import { AuditLog, SystemHealth, UserRole } from '../types/marketplace';

// Secret developer code - verified strictly on server/engine boundary
export const DEV_SECRET_PASSCODE = 'DEV-NSPHERE-2026-ROOT';
export const DEV_DEFAULT_EMAIL = 'developer@nsphere.internal';

export interface DeveloperAuthResult {
  success: boolean;
  message: string;
  token?: string;
  sessionExpiry?: string;
}

export interface FeatureFlags {
  maintenanceMode: boolean;
  simulatePaymentFailures: boolean;
  strictStockCheck: boolean;
  verboseLogging: boolean;
  autoApproveVendors: boolean;
}

export const INITIAL_FEATURE_FLAGS: FeatureFlags = {
  maintenanceMode: false,
  simulatePaymentFailures: false,
  strictStockCheck: true,
  verboseLogging: true,
  autoApproveVendors: false,
};

/**
 * Server-simulated verification for developer authentication.
 * The secret key is evaluated here and never directly exposed in public storage.
 */
export function verifyDeveloperCredentials(
  email: string,
  pass: string,
  secretCode: string
): DeveloperAuthResult {
  if (!email || !pass || !secretCode) {
    return {
      success: false,
      message: 'All fields (Email, Password, and Developer Secret Code) are required.',
    };
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanCode = secretCode.trim();

  // Allow developer or admin
  const isAuthorizedEmail =
    cleanEmail === DEV_DEFAULT_EMAIL ||
    cleanEmail.endsWith('@nsphere.internal') ||
    cleanEmail === 'admin@agc.com' ||
    cleanEmail === 'testuser@agc.com';

  if (!isAuthorizedEmail) {
    return {
      success: false,
      message: 'Unauthorized identity. Access is restricted to internal platform operators.',
    };
  }

  if (pass.length < 6) {
    return {
      success: false,
      message: 'Password must be at least 6 characters.',
    };
  }

  if (cleanCode !== DEV_SECRET_PASSCODE) {
    return {
      success: false,
      message: 'Invalid Developer Secret Access Code. Access Denied.',
    };
  }

  const token = `dev_tok_${Math.random().toString(36).substring(2)}_${Date.now()}`;
  const expiry = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString();

  return {
    success: true,
    message: 'Developer authenticated successfully. Full root privileges active.',
    token,
    sessionExpiry: expiry,
  };
}

/**
 * Generates an AuditLog entry
 */
export function createAuditLog(
  userId: string,
  userName: string,
  role: UserRole,
  action: string,
  entityType: 'order' | 'product' | 'vendor' | 'payment' | 'user' | 'system',
  entityId: string,
  details: string
): AuditLog {
  return {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    userId,
    userName,
    role,
    action,
    entityType,
    entityId,
    details,
    ipAddress: '192.168.1.104',
  };
}

/**
 * Returns dynamic telemetry for the system health monitor
 */
export function getUpdatedSystemHealth(current: SystemHealth): SystemHealth {
  const memoryJitter = Math.floor(180 + Math.random() * 15);
  return {
    ...current,
    uptimeSeconds: current.uptimeSeconds + 5,
    memoryUsageMb: memoryJitter,
  };
}
