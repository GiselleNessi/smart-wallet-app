import {
  AuthMethod,
  InitiateAuthRequest,
  InitiateAuthResponse,
  CompleteAuthRequest,
  CompleteAuthResponse,
  WalletInfoResponse,
  UserQuery,
  AllUsersResponse,
  SingleUserResponse,
  ApiError,
} from '../types/thirdweb';

// Thirdweb API service for wallet authentication
const THIRDWEB_API_BASE = 'https://api.thirdweb.com';

class ThirdwebApiService {
  private clientId: string;
  private secretKey: string;

  constructor() {
    this.clientId = process.env.REACT_APP_THIRDWEB_CLIENT_ID || 'your-project-client-id';
    this.secretKey = process.env.REACT_APP_THIRDWEB_SECRET_KEY || 'your-project-secret-key';
  }

  // Initiate authentication (email or SMS)
  async initiateAuth(method: AuthMethod, payload: Partial<InitiateAuthRequest>): Promise<InitiateAuthResponse> {
    console.log('🚀 [API] Initiating auth with method:', method);
    console.log('📤 [API] Payload:', { method, ...payload });
    console.log('🔑 [API] Using client ID:', this.clientId);
    
    try {
      const response = await fetch(`${THIRDWEB_API_BASE}/v1/auth/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-client-id': this.clientId,
        },
        body: JSON.stringify({
          method,
          ...payload,
        }),
      });

      console.log('📡 [API] Response status:', response.status);
      console.log('📡 [API] Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        console.error('❌ [API] Auth initiation failed:', errorData);
        throw new Error(errorData.message || 'Authentication initiation failed');
      }

      const result = await response.json() as InitiateAuthResponse;
      console.log('✅ [API] Auth initiation successful:', result);
      return result;
    } catch (error) {
      console.error('💥 [API] Error initiating authentication:', error);
      throw error;
    }
  }

  // Complete authentication
  async completeAuth(method: AuthMethod, payload: CompleteAuthRequest): Promise<CompleteAuthResponse> {
    console.log('🔐 [API] Completing auth with method:', method);
    console.log('📤 [API] Payload:', payload);
    console.log('🔑 [API] Using client ID:', this.clientId);
    
    try {
      const response = await fetch(`${THIRDWEB_API_BASE}/v1/auth/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-client-id': this.clientId,
        },
        body: JSON.stringify(payload),
      });

      console.log('📡 [API] Response status:', response.status);
      console.log('📡 [API] Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        console.error('❌ [API] Auth completion failed:', errorData);
        throw new Error(errorData.message || 'Authentication completion failed');
      }

      const result = await response.json() as CompleteAuthResponse;
      console.log('✅ [API] Auth completion successful:', result);
      console.log('🎫 [API] Token received:', result.token ? 'Yes' : 'No');
      console.log('👤 [API] Is new user:', result.isNewUser);
      console.log('🏷️ [API] Auth type:', result.type);
      return result;
    } catch (error) {
      console.error('💥 [API] Error completing authentication:', error);
      throw error;
    }
  }


  // Get wallet information
  async getWalletInfo(token: string): Promise<WalletInfoResponse> {
    console.log('💼 [API] Fetching wallet information');
    console.log('🎫 [API] Token (first 20 chars):', token.substring(0, 20) + '...');
    console.log('🔑 [API] Using secret key:', this.secretKey.substring(0, 10) + '...');
    
    try {
      const response = await fetch(`${THIRDWEB_API_BASE}/v1/wallets/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-secret-key': this.secretKey,
        },
      });

      console.log('📡 [API] Response status:', response.status);
      console.log('📡 [API] Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        console.error('❌ [API] Wallet info fetch failed:', errorData);
        throw new Error(errorData.message || 'Failed to fetch wallet info');
      }

      const result = await response.json() as WalletInfoResponse;
      console.log('✅ [API] Wallet info fetched successfully:', result);
      console.log('🏠 [API] Wallet address:', result.result?.address);
      console.log('🧠 [API] Smart wallet address:', result.result?.smartWalletAddress || 'Not available (regular wallet)');
      console.log('👥 [API] Profiles count:', result.result?.profiles?.length || 0);
      return result;
    } catch (error) {
      console.error('💥 [API] Error fetching wallet info:', error);
      throw error;
    }
  }

  // Email authentication methods
  async initiateEmailAuth(email: string): Promise<InitiateAuthResponse> {
    console.log('📧 [API] Initiating email auth for:', email);
    return this.initiateAuth('email', { email });
  }

  async completeEmailAuth(email: string, code: string): Promise<CompleteAuthResponse> {
    console.log('📧 [API] Completing email auth for:', email, 'with code:', code);
    return this.completeAuth('email', { method: 'email', email, code });
  }


  // User Management Methods
  async getAllUsers(limit: number = 20, page: number = 1): Promise<AllUsersResponse> {
    try {
      const response = await fetch(`${THIRDWEB_API_BASE}/v1/wallets/user?limit=${limit}&page=${page}`, {
        method: 'GET',
        headers: {
          'x-secret-key': this.secretKey,
        },
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.message || 'Failed to fetch users');
      }

      return await response.json() as AllUsersResponse;
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw error;
    }
  }

  async getSingleUser(query: UserQuery): Promise<SingleUserResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (query.address) queryParams.append('address', query.address);
      if (query.email) queryParams.append('email', query.email);
      if (query.phone) queryParams.append('phone', query.phone);
      if (query.externalWalletAddress) queryParams.append('externalWalletAddress', query.externalWalletAddress);
      if (query.id) queryParams.append('id', query.id);

      const response = await fetch(`${THIRDWEB_API_BASE}/v1/wallets/user?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'x-secret-key': this.secretKey,
        },
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.message || 'Failed to fetch user');
      }

      return await response.json() as SingleUserResponse;
    } catch (error) {
      console.error('Error fetching single user:', error);
      throw error;
    }
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new ThirdwebApiService();
