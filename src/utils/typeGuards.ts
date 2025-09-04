import { CompleteAuthResponse, WalletInfo, Profile } from '../types/thirdweb';

// Type guards for runtime type checking
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

export const isValidWalletAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

export const isCompleteAuthResponse = (obj: any): obj is CompleteAuthResponse => {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.isNewUser === 'boolean' &&
    typeof obj.token === 'string' &&
    typeof obj.type === 'string' &&
    typeof obj.walletAddress === 'string'
  );
};

export const isWalletInfo = (obj: any): obj is WalletInfo => {
  return (
    obj &&
    typeof obj === 'object' &&
    Array.isArray(obj.profiles) &&
    typeof obj.address === 'string' &&
    typeof obj.createdAt === 'string'
  );
};

export const isProfile = (obj: any): obj is Profile => {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.type === 'string'
  );
};

// Utility functions for safe property access
export const safeGet = <T>(obj: any, path: string, defaultValue: T): T => {
  const keys = path.split('.');
  let result = obj;
  
  for (const key of keys) {
    if (result == null || typeof result !== 'object') {
      return defaultValue;
    }
    result = result[key];
  }
  
  return result !== undefined ? result : defaultValue;
};

// Error handling utilities
export const createApiError = (message: string, code?: string, status?: number): Error => {
  const error = new Error(message);
  (error as any).code = code;
  (error as any).status = status;
  return error;
};

export const isApiError = (error: any): error is Error & { code?: string; status?: number } => {
  return error instanceof Error && (error as any).code !== undefined;
};
