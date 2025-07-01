/**
 * Types for user consent management
 */

export interface ConsentSettings {
  basicIdentification: boolean; // Required for app functionality
  modelTraining: boolean;
  exifMetadata: boolean;
  locationData: boolean;
  advancedSensors: boolean;
}

export interface ConsentAuditEntry {
  id: string;
  action: 'granted' | 'revoked';
  consentType: string;
  previousValue: boolean | null;
  newValue: boolean;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
}

export interface DataUsageStats {
  totalContributions: number;
  approvedContributions: number;
  pendingContributions: number;
  rejectedContributions: number;
  datasetUsage: {
    training: number;
    validation: number;
    testing: number;
  };
  modelUsage: number;
  modelDetails: Array<{
    name: string;
    version: string;
    status: string;
  }>;
}
