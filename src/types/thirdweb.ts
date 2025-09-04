// Thirdweb API Types

export type AuthMethod = 'email';

export interface InitiateAuthRequest {
  method: AuthMethod;
  email?: string;
}

export interface InitiateAuthResponse {
  method: AuthMethod;
  success: boolean;
}

export interface CompleteAuthRequest {
  method: AuthMethod;
  email?: string;
  code: string;
}

export interface CompleteAuthResponse {
  isNewUser: boolean;
  token: string;
  type: string;
  walletAddress: string;
}

export interface Profile {
  email?: string;
  emailVerified?: boolean;
  hd?: string;
  id: string;
  locale?: string;
  picture?: string;
  type: string;
  familyName?: string;
  givenName?: string;
  name?: string;
}

export interface WalletInfo {
  profiles: Profile[];
  address: string;
  createdAt: string;
  smartWalletAddress?: string;
}

export interface WalletInfoResponse {
  result: WalletInfo;
}

// User Management Types
export interface UserQuery {
  address?: string;
  email?: string;
  phone?: string;
  externalWalletAddress?: string;
  id?: string;
}

export interface Pagination {
  hasMore: boolean;
  limit: number;
  page: number;
}

export interface AllUsersResponse {
  result: {
    pagination: Pagination;
    wallets: WalletInfo[];
  };
}

export interface SingleUserResponse {
  result: WalletInfo;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

// Component Props Types
export interface AuthFormProps {
  onAuthSuccess: (result: CompleteAuthResponse) => void;
}

export interface WalletInfoProps {
  authResult: CompleteAuthResponse;
  onLogout: () => void;
}

// Form State Types
export interface AuthFormState {
  authMethod: AuthMethod;
  email: string;
  code: string;
  step: 'initiate' | 'verify';
  loading: boolean;
  error: string;
}

// Environment Variables
export interface EnvironmentConfig {
  REACT_APP_THIRDWEB_CLIENT_ID: string;
  REACT_APP_THIRDWEB_SECRET_KEY: string;
}
