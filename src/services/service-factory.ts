import { MockApiService } from './mock-api.service';
import { ApiResponse } from './api.service';

/**
 * Service factory that decides whether to use real API services or mock responses
 * This allows easy switching between development (mock) and production (real) modes
 */
export class ServiceFactory {
  /**
   * Determines whether to use mock API based on localStorage setting
   * @returns Boolean indicating whether to use mock API
   */
  static shouldUseMockApi(): boolean {
    // Check the mock API flag in localStorage
    const useMockApi = localStorage.getItem('use_mock_api');
    
    // Return true for mock API if:
    // 1. The flag is explicitly set to 'true' in localStorage
    // 2. The flag is not set but we're in development mode
    // 3. The API URL is not configured (fallback to mocks)
    if (useMockApi === 'true') {
      return true;
    }
    
    if (useMockApi === 'false') {
      return false;
    }
    
    // Default to mock in development, real in production
    if (import.meta.env.MODE === 'development') {
      return true;
    }
    
    // Check if API URL is configured
    const apiUrl = import.meta.env.VITE_API_URL;
    if (!apiUrl) {
      console.warn('No API URL configured. Using mock API responses.');
      return true;
    }
    
    return false;
  }
  
  /**
   * Auth Services
   */
  static auth = {
    async login(credentials: { email: string; password: string }): Promise<ApiResponse<any>> {
      if (ServiceFactory.shouldUseMockApi()) {
        return MockApiService.login(credentials);
      }
      
      // TODO: Implement real API calls when backend is available
      throw new Error('Real API not implemented yet');
    },
    
    async register(userData: any): Promise<ApiResponse<any>> {
      if (ServiceFactory.shouldUseMockApi()) {
        return MockApiService.register(userData);
      }
      
      // TODO: Implement real API calls when backend is available
      throw new Error('Real API not implemented yet');
    }
  };
  
  /**
   * Profile Services
   */
  static profile = {
    async getProfile(role: string): Promise<ApiResponse<any>> {
      if (ServiceFactory.shouldUseMockApi()) {
        return MockApiService.getUserProfile(role);
      }
      
      // TODO: Implement real API calls when backend is available
      throw new Error('Real API not implemented yet');
    }
  };
  
  /**
   * Order Services
   */
  static orders = {
    async getOrders(role: string): Promise<ApiResponse<any>> {
      if (ServiceFactory.shouldUseMockApi()) {
        return MockApiService.getOrders(role);
      }
      
      // TODO: Implement real API calls when backend is available
      throw new Error('Real API not implemented yet');
    },
    
    async createOrder(orderData: any): Promise<ApiResponse<any>> {
      if (ServiceFactory.shouldUseMockApi()) {
        return MockApiService.createOrder(orderData);
      }
      
      // TODO: Implement real API calls when backend is available
      throw new Error('Real API not implemented yet');
    }
  };
  
  /**
   * Shipping Services
   */
  static shipping = {
    async calculateRates(rateData: any): Promise<ApiResponse<any>> {
      if (ServiceFactory.shouldUseMockApi()) {
        return MockApiService.calculateShippingRates(rateData);
      }
      
      // TODO: Implement real API calls when backend is available
      throw new Error('Real API not implemented yet');
    }
  };
  
  /**
   * Partners Services
   */
  static partners = {
    async getPartners(filters?: { status?: string }): Promise<ApiResponse<any>> {
      if (ServiceFactory.shouldUseMockApi()) {
        return MockApiService.getPartners(filters);
      }
      
      // TODO: Implement real API calls when backend is available
      throw new Error('Real API not implemented yet');
    },
    
    async getPartnerById(id: string): Promise<ApiResponse<any>> {
      if (ServiceFactory.shouldUseMockApi()) {
        return MockApiService.getPartnerById(id);
      }
      
      // TODO: Implement real API calls when backend is available
      throw new Error('Real API not implemented yet');
    },
    
    async createPartner(partnerData: any): Promise<ApiResponse<any>> {
      if (ServiceFactory.shouldUseMockApi()) {
        return MockApiService.createPartner(partnerData);
      }
      
      // TODO: Implement real API calls when backend is available
      throw new Error('Real API not implemented yet');
    },
    
    async updatePartner(id: string, partnerData: any): Promise<ApiResponse<any>> {
      if (ServiceFactory.shouldUseMockApi()) {
        return MockApiService.updatePartner(id, partnerData);
      }
      
      // TODO: Implement real API calls when backend is available
      throw new Error('Real API not implemented yet');
    },
    
    async deletePartner(id: string): Promise<ApiResponse<any>> {
      if (ServiceFactory.shouldUseMockApi()) {
        return MockApiService.deletePartner(id);
      }
      
      // TODO: Implement real API calls when backend is available
      throw new Error('Real API not implemented yet');
    },
    
    async deleteManyPartners(ids: string[]): Promise<ApiResponse<any>> {
      if (ServiceFactory.shouldUseMockApi()) {
        return MockApiService.deleteManyPartners(ids);
      }
      
      // TODO: Implement real API calls when backend is available
      throw new Error('Real API not implemented yet');
    },
    
    async refreshPartnerAPIs(ids: string[]): Promise<ApiResponse<any>> {
      if (ServiceFactory.shouldUseMockApi()) {
        return MockApiService.refreshPartnerAPIs(ids);
      }
      
      // TODO: Implement real API calls when backend is available
      throw new Error('Real API not implemented yet');
    }
  };
  
  /**
   * Wallet Services
   */
  static wallet = {
    async getBalance(): Promise<ApiResponse<any>> {
      if (ServiceFactory.shouldUseMockApi()) {
        return MockApiService.getWalletBalance();
      }
      
      // TODO: Implement real API calls when backend is available
      throw new Error('Real API not implemented yet');
    },
    
    async getTransactions(): Promise<ApiResponse<any>> {
      if (ServiceFactory.shouldUseMockApi()) {
        return MockApiService.getWalletTransactions();
      }
      
      // TODO: Implement real API calls when backend is available
      throw new Error('Real API not implemented yet');
    }
  };
} 