import { ApiService, ApiResponse } from './api.service';
import api from '@/config/api.config';

export interface OrderItem {
    name: string;
    sku: string;
    quantity: number;
    price: number;
}

export interface OrderData {
    orderId: string;
    date: string;
    customer: string;
    contact: string;
    items: OrderItem[];
    amount: string;
    payment: "COD" | "Prepaid";
    chanel: "MANUAL" | "EXCEL" | "SHOPIFY" | "WOOCOMMERCE" | "AMAZON" | "FLIPKART" | "OPENCART" | "API";
    weight: string;
    tags: string;
    action: "Ship" | "Processing" | "In Transit" | "Cancelled" | "Error" | "Pending";
    whatsapp: "Message Delivered" | "Message Read" | "Order Confirm" | "Order Cancelled";
    status: "not-booked" | "processing" | "booked" | "cancelled" | "shipment-cancelled" | "error";
    awbNumber?: string; // Optional AWB number
    pincode?: string; // Optional pincode
}

export interface OrderFilters {
    dateRange?: {
        from: Date;
        to: Date;
    };
    status?: OrderData['status'];
    search?: string;
}

export interface OrderStats {
    total: number;
    notBooked: number;
    processing: number;
    booked: number;
    cancelled: number;
    shipmentCancelled: number;
    error: number;
}

class SellerOrderService extends ApiService {
    private static instance: SellerOrderService;

    private constructor() {
        super();
    }

    public static getInstance(): SellerOrderService {
        if (!SellerOrderService.instance) {
            SellerOrderService.instance = new SellerOrderService();
        }
        return SellerOrderService.instance;
    }

    async getOrders(filters: OrderFilters): Promise<ApiResponse<OrderData[]>> {
        return SellerOrderService.handleRequest<OrderData[]>(
            api.get('/seller/orders', {
                params: {
                    from: filters.dateRange?.from?.toISOString(),
                    to: filters.dateRange?.to?.toISOString(),
                    status: filters.status,
                    search: filters.search
                },
                headers: {
                    ...SellerOrderService.getAuthHeader(),
                    ...SellerOrderService.getCsrfHeader()
                }
            })
        );
    }

    async getOrderStats(filters: OrderFilters): Promise<ApiResponse<OrderStats>> {
        return SellerOrderService.handleRequest<OrderStats>(
            api.get('/seller/orders/stats', {
                params: {
                    from: filters.dateRange?.from?.toISOString(),
                    to: filters.dateRange?.to?.toISOString(),
                    status: filters.status
                },
                headers: {
                    ...SellerOrderService.getAuthHeader(),
                    ...SellerOrderService.getCsrfHeader()
                }
            })
        );
    }

    async updateOrderStatus(orderId: string, status: OrderData['status']): Promise<ApiResponse<void>> {
        return SellerOrderService.handleRequest<void>(
            api.patch(`/seller/orders/${orderId}/status`, {
                status
            }, {
                headers: {
                    ...SellerOrderService.getAuthHeader(),
                    ...SellerOrderService.getCsrfHeader()
                }
            })
        );
    }

    async bulkUpdateOrderStatus(orderIds: string[], status: OrderData['status']): Promise<ApiResponse<void>> {
        return SellerOrderService.handleRequest<void>(
            api.patch('/seller/orders/bulk-status', {
                orderIds,
                status
            }, {
                headers: {
                    ...SellerOrderService.getAuthHeader(),
                    ...SellerOrderService.getCsrfHeader()
                }
            })
        );
    }
}

export const sellerOrderService = SellerOrderService.getInstance(); 