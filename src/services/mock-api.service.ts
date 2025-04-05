import { delay } from "../utils/helpers";
import { ApiResponse } from "./api.service";

/**
 * Mock API Service for frontend-only deployment
 * This service provides simulated API responses for development and demo purposes
 * Replace with actual API calls when connecting to a real backend
 */
export class MockApiService {
  /**
   * Generic method to simulate API requests
   * @param endpoint The API endpoint (for logging purposes only)
   * @param mockData The mock data to return
   * @param delayMs Optional delay to simulate network latency (default: 500ms)
   * @param errorRate Optional error rate as a decimal (0-1) (default: 0)
   */
  static async request<T>(
    endpoint: string,
    mockData: T,
    delayMs = 500,
    errorRate = 0
  ): Promise<ApiResponse<T>> {
    console.log(`[MOCK API] Request to ${endpoint}`);
    
    // Simulate network delay
    await delay(delayMs);
    
    // Randomly throw error based on errorRate
    if (Math.random() < errorRate) {
      throw {
        response: {
          status: 500,
          data: {
            message: "Simulated server error",
            code: "SIMULATED_ERROR"
          }
        }
      };
    }
    
    return {
      data: mockData,
      status: 200
    };
  }
  
  /**
   * Simulate authentication API
   * @param credentials Login credentials
   */
  static async login(credentials: { email: string; password: string }): Promise<ApiResponse<any>> {
    // For demo purposes, just check a few hardcoded credentials
    interface MockUser {
      id: string;
      name: string;
      email: string;
      role: string;
    }
    
    const mockUsers: Record<string, MockUser> = {
      "customer@example.com": {
        id: "cust1",
        name: "Demo Customer",
        email: "customer@example.com",
        role: "customer"
      },
      "seller@example.com": {
        id: "sell1",
        name: "Demo Seller",
        email: "seller@example.com",
        role: "seller"
      },
      "admin@example.com": {
        id: "adm1",
        name: "Demo Admin",
        email: "admin@example.com",
        role: "admin"
      }
    };
    
    if (mockUsers[credentials.email] && credentials.password === "password123") {
      const user = mockUsers[credentials.email];
      // Set mock token in localStorage
      localStorage.setItem(`${user.role}_token`, "mock_jwt_token");
      
      return this.request("/api/auth/login", {
        token: "mock_jwt_token",
        user
      });
    }
    
    // Simulate authentication error
    await delay(500);
    throw {
      response: {
        status: 401,
        data: {
          message: "Invalid email or password",
          code: "INVALID_CREDENTIALS"
        }
      }
    };
  }
  
  /**
   * Simulate user registration
   */
  static async register(userData: any): Promise<ApiResponse<any>> {
    return this.request("/api/auth/register", {
      token: "mock_jwt_token",
      user: {
        id: "new_user_" + Date.now(),
        ...userData,
      }
    });
  }
  
  /**
   * Simulate fetching user profile data
   */
  static async getUserProfile(role: string): Promise<ApiResponse<any>> {
    const mockProfiles: Record<string, any> = {
      customer: {
        id: "cust1",
        name: "Demo Customer",
        email: "customer@example.com",
        phone: "9876543210",
        address: {
          street: "123 Customer St",
          city: "Bangalore",
          state: "Karnataka",
          pincode: "560001",
          country: "India"
        }
      },
      seller: {
        id: "sell1",
        name: "Demo Seller",
        email: "seller@example.com",
        phone: "9876543211",
        companyName: "Demo Shipping Co.",
        businessType: "E-commerce",
        gstin: "29ABCDE1234F1Z5",
        pan: "ABCDE1234F",
        address: {
          street: "456 Seller Ave",
          city: "Mumbai",
          state: "Maharashtra",
          pincode: "400001",
          country: "India"
        },
        documents: [
          {
            type: "gstin",
            url: "https://example.com/docs/gstin.pdf",
            status: "verified"
          },
          {
            type: "pan",
            url: "https://example.com/docs/pan.pdf",
            status: "verified"
          }
        ],
        settings: {
          notifications: {
            email: true,
            sms: true,
            push: false
          },
          autoAcceptOrders: true,
          defaultServiceType: "standard",
          defaultPaymentMethod: "cod"
        }
      },
      admin: {
        id: "adm1",
        name: "Demo Admin",
        email: "admin@example.com",
        role: "admin",
        permissions: ["users.view", "users.edit", "orders.view", "orders.edit", "settings.edit"]
      }
    };
    
    return this.request(`/api/${role}/profile`, mockProfiles[role]);
  }
  
  /**
   * Simulate fetching orders
   */
  static async getOrders(role: string): Promise<ApiResponse<any>> {
    const mockOrders = [
      {
        id: "ORD123456",
        trackingId: "TRK789012",
        status: "processing",
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
        pickupAddress: {
          street: "123 Pickup St",
          city: "Delhi",
          state: "Delhi",
          pincode: "110001",
          country: "India",
          contactName: "Pickup Person",
          contactPhone: "9876543210"
        },
        deliveryAddress: {
          street: "456 Delivery Ave",
          city: "Bangalore",
          state: "Karnataka",
          pincode: "560001",
          country: "India",
          contactName: "Delivery Person",
          contactPhone: "9876543211"
        },
        package: {
          weight: 1.5,
          length: 30,
          width: 20,
          height: 15,
          items: [
            {
              name: "Smartphone",
              quantity: 1,
              value: 15000
            },
            {
              name: "Phone Case",
              quantity: 1,
              value: 500
            }
          ],
          totalValue: 15500
        },
        timeline: [
          {
            status: "order_placed",
            location: "Online",
            timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
            description: "Order has been placed"
          },
          {
            status: "processing",
            location: "Fulfillment Center",
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            description: "Order is being processed"
          }
        ],
        payment: {
          status: "paid",
          method: "prepaid",
          amount: 250
        }
      },
      {
        id: "ORD789012",
        trackingId: "TRK345678",
        status: "shipped",
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        pickupAddress: {
          street: "789 Pickup Rd",
          city: "Mumbai",
          state: "Maharashtra",
          pincode: "400001",
          country: "India",
          contactName: "Another Pickup",
          contactPhone: "9876543212"
        },
        deliveryAddress: {
          street: "101 Delivery Blvd",
          city: "Chennai",
          state: "Tamil Nadu",
          pincode: "600001",
          country: "India",
          contactName: "Another Delivery",
          contactPhone: "9876543213"
        },
        package: {
          weight: 2.5,
          length: 40,
          width: 30,
          height: 20,
          items: [
            {
              name: "Headphones",
              quantity: 1,
              value: 2000
            },
            {
              name: "Bluetooth Speaker",
              quantity: 1,
              value: 3000
            }
          ],
          totalValue: 5000
        },
        timeline: [
          {
            status: "order_placed",
            location: "Online",
            timestamp: new Date(Date.now() - 86400000 * 5).toISOString(),
            description: "Order has been placed"
          },
          {
            status: "processing",
            location: "Fulfillment Center",
            timestamp: new Date(Date.now() - 86400000 * 4).toISOString(),
            description: "Order is being processed"
          },
          {
            status: "shipped",
            location: "Mumbai Sorting Center",
            timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
            description: "Order has been shipped"
          }
        ],
        payment: {
          status: "pending",
          method: "cod",
          amount: 350
        }
      }
    ];
    
    return this.request(`/api/${role}/orders`, { orders: mockOrders });
  }

  /**
   * Simulate order creation
   */
  static async createOrder(orderData: any): Promise<ApiResponse<any>> {
    const mockOrder = {
      id: "ORD" + Date.now().toString().substring(7),
      trackingId: "TRK" + Date.now().toString().substring(7),
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...orderData
    };
    
    return this.request("/api/customer/orders", mockOrder);
  }
  
  /**
   * Simulate shipping rate calculation
   */
  static async calculateShippingRates(rateData: any): Promise<ApiResponse<any>> {
    const mockRates = [
      {
        courier: "RocketryBox",
        serviceType: rateData.serviceType || "Standard",
        deliveryTime: rateData.serviceType === "Express" ? "1-2 days" : "3-5 days",
        baseRate: rateData.serviceType === "Express" ? 150 : 100,
        weightCharge: (rateData.weight || 1) * 20,
        fuelSurcharge: 50,
        codCharge: rateData.paymentMethod === "cod" ? 30 : 0,
        gst: 18,
        totalCharge: rateData.serviceType === "Express" ? 250 : 200,
        isRecommended: true
      },
      {
        courier: "Express Delivery",
        serviceType: rateData.serviceType || "Standard",
        deliveryTime: rateData.serviceType === "Express" ? "1-2 days" : "3-5 days",
        baseRate: rateData.serviceType === "Express" ? 180 : 120,
        weightCharge: (rateData.weight || 1) * 25,
        fuelSurcharge: 60,
        codCharge: rateData.paymentMethod === "cod" ? 35 : 0,
        gst: 18,
        totalCharge: rateData.serviceType === "Express" ? 280 : 220,
        isRecommended: false
      }
    ];
    
    return this.request("/api/shipping/calculate-rates", { rates: mockRates });
  }
  
  /**
   * Simulate wallet operations
   */
  static async getWalletBalance(): Promise<ApiResponse<any>> {
    return this.request("/api/wallet/balance", {
      balance: 5000.75,
      currency: "INR",
      lastUpdated: new Date().toISOString()
    });
  }
  
  /**
   * Get mock wallet transactions
   */
  static async getWalletTransactions(): Promise<ApiResponse<any>> {
    const mockTransactions = [
      {
        id: "TXN1001",
        type: "credit",
        amount: 2000,
        description: "Added money to wallet",
        timestamp: new Date(Date.now() - 86400000 * 10).toISOString(),
        status: "completed",
        reference: "REF123456"
      },
      {
        id: "TXN1002",
        type: "debit",
        amount: 350,
        description: "Payment for order #ORD789012",
        timestamp: new Date(Date.now() - 86400000 * 5).toISOString(),
        status: "completed",
        reference: "ORD789012"
      },
      {
        id: "TXN1003",
        type: "credit",
        amount: 1000,
        description: "Refund for cancelled order #ORD654321",
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
        status: "completed",
        reference: "ORD654321"
      }
    ];
    
    return this.request("/api/wallet/transactions", {
      transactions: mockTransactions,
      total: mockTransactions.length,
      page: 1,
      limit: 10
    });
  }
} 