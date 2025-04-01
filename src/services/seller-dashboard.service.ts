import { ApiService, ApiResponse } from './api.service';
import api from '@/config/api.config';
import { mockDashboardStats, mockChartData, mockCourierData, mockTopProducts } from './mockDashboardData';

export interface DashboardStats {
    orders: {
        total: number;
        pending: number;
        processing: number;
        shipped: number;
        delivered: number;
        cancelled: number;
        todayCount: number;
    };
    shipments: {
        total: number;
        todayCount: number;
    };
    delivery: {
        total: number;
        todayCount: number;
    };
    cod: {
        expected: number;
        totalDue: number;
    };
    revenue: {
        total: number;
        dailyGrowth: number;
    };
    ndr: {
        pending: number;
        actionRequired: number;
    };
}

export interface OrderStatusDistribution {
    delivered: number;
    inTransit: number;
    pending: number;
}

export interface ShipmentTrend {
    day: string;
    current: number;
    previous: number;
}

export interface RevenueTrend {
    month: string;
    value: number;
}

export interface TopProduct {
    month: string;
    desktop: number;
}

export interface DeliveryPerformance {
    month: string;
    desktop: number;
}

export interface CourierData {
    courier: string;
    total: number;
    notShipped: number;
    pendingPickup: number;
    inTransit: number;
    ofd: number;
    delivered: { count: number; percentage: string };
    cancelled: { count: number; percentage: string };
    exception: { count: number; percentage: string };
    rto: number;
    lostDamage: number;
}

export interface ProductData {
    productName: string;
    quantity: number;
    totalShipments: number;
    notShipped: number;
    cancelled: number;
    pendingPickup: number;
    inTransit: number;
    delivered: number;
    rto: number;
}

export interface DashboardChartData {
    orderStatusDistribution: OrderStatusDistribution;
    shipmentTrends: ShipmentTrend[];
    revenueTrends: RevenueTrend[];
    topProducts: TopProduct[];
    deliveryPerformance: DeliveryPerformance[];
    courierData: CourierData[];
    productData: ProductData[];
}

export interface DateRangeFilter {
    from: Date;
    to: Date;
}

export interface DashboardFilters {
    dateRange?: DateRangeFilter;
    timeFilter?: "1D" | "1W" | "1M" | "3M" | "1Y" | "ALL";
}

// Flag to toggle between mock data and real API calls
const USE_MOCK_DATA = true;

class SellerDashboardService extends ApiService {
    private static instance: SellerDashboardService;

    private constructor() {
        super();
    }

    public static getInstance(): SellerDashboardService {
        if (!SellerDashboardService.instance) {
            SellerDashboardService.instance = new SellerDashboardService();
        }
        return SellerDashboardService.instance;
    }

    async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
        if (USE_MOCK_DATA) {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            return {
                data: mockDashboardStats,
                status: 200
            };
        }

        return SellerDashboardService.handleRequest<DashboardStats>(
            api.get('/seller/dashboard/stats', {
                headers: {
                    ...SellerDashboardService.getAuthHeader(),
                    ...SellerDashboardService.getCsrfHeader()
                }
            })
        );
    }

    async getDashboardChartData(filters: DashboardFilters): Promise<ApiResponse<DashboardChartData>> {
        if (USE_MOCK_DATA) {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            return {
                data: mockChartData,
                status: 200
            };
        }

        return SellerDashboardService.handleRequest<DashboardChartData>(
            api.get('/seller/dashboard/charts', {
                params: {
                    from: filters.dateRange?.from?.toISOString(),
                    to: filters.dateRange?.to?.toISOString(),
                    timeFilter: filters.timeFilter
                },
                headers: {
                    ...SellerDashboardService.getAuthHeader(),
                    ...SellerDashboardService.getCsrfHeader()
                }
            })
        );
    }

    async getCourierPerformance(): Promise<ApiResponse<CourierData[]>> {
        if (USE_MOCK_DATA) {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 800));
            return {
                data: mockCourierData,
                status: 200
            };
        }

        return SellerDashboardService.handleRequest<CourierData[]>(
            api.get('/seller/dashboard/courier-performance', {
                headers: {
                    ...SellerDashboardService.getAuthHeader(),
                    ...SellerDashboardService.getCsrfHeader()
                }
            })
        );
    }

    async getTopProducts(): Promise<ApiResponse<ProductData[]>> {
        if (USE_MOCK_DATA) {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1200));
            return {
                data: mockTopProducts,
                status: 200
            };
        }

        return SellerDashboardService.handleRequest<ProductData[]>(
            api.get('/seller/dashboard/top-products', {
                headers: {
                    ...SellerDashboardService.getAuthHeader(),
                    ...SellerDashboardService.getCsrfHeader()
                }
            })
        );
    }

    async downloadDashboardReport(format: 'csv' | 'pdf'): Promise<Blob> {
        if (USE_MOCK_DATA) {
            // Create a simple mock blob for testing
            const mockData = 'This is a mock report file for testing purposes.\n' +
                'It contains sample data for the dashboard report.\n' +
                'In a real environment, this would be dynamically generated based on actual data.';
            
            const blob = new Blob([mockData], { 
                type: format === 'csv' 
                    ? 'text/csv;charset=utf-8' 
                    : 'application/pdf' 
            });
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            return blob;
        }

        try {
            const response = await api.get('/seller/dashboard/report', {
                params: { format },
                responseType: 'blob',
                headers: {
                    ...SellerDashboardService.getAuthHeader(),
                    ...SellerDashboardService.getCsrfHeader()
                }
            });
            return response.data;
        } catch (error) {
            throw new Error('Failed to download dashboard report');
        }
    }
}

export const sellerDashboardService = SellerDashboardService.getInstance();

export default sellerDashboardService; 