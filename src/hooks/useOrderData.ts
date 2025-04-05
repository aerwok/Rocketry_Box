import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { 
    sellerOrderService, 
    OrderData, 
    OrderFilters, 
    OrderStats 
} from '@/services/seller-order.service';

// Mock data for testing
const mockOrders: OrderData[] = [
    {
        orderId: "ORD-2025-001",
        date: "2024-02-20",
        customer: "Rahul Sharma",
        contact: "9876543210",
        items: [
            {
                name: "Gaming Laptop",
                sku: "LAP-001",
                quantity: 1,
                price: 97497.00
            }
        ],
        amount: "97497.00",
        payment: "COD",
        chanel: "MANUAL",
        weight: "2.5",
        tags: "Gaming",
        action: "Ship",
        whatsapp: "Message Delivered",
        status: "not-booked",
        awbNumber: undefined,
        pincode: "400001"
    },
    {
        orderId: "ORD-2025-002",
        date: "2024-02-19",
        customer: "Priya Patel",
        contact: "9876543211",
        items: [
            {
                name: "Wireless Mouse",
                sku: "WM001",
                quantity: 1,
                price: 7999.00
            },
            {
                name: "Keyboard",
                sku: "KB001",
                quantity: 1,
                price: 8000.00
            }
        ],
        amount: "15999.00",
        payment: "Prepaid",
        chanel: "EXCEL",
        weight: "1.2",
        tags: "Electronics",
        action: "Processing",
        whatsapp: "Message Read",
        status: "processing",
        awbNumber: "AWB123456",
        pincode: "400002"
    },
    {
        orderId: "ORD-2025-003",
        date: "2024-02-19",
        customer: "Amit Kumar",
        contact: "9876543212",
        items: [
            {
                name: "Premium Headphones",
                sku: "PH001",
                quantity: 1,
                price: 49999.00
            }
        ],
        amount: "49999.00",
        payment: "COD",
        chanel: "SHOPIFY",
        weight: "3.5",
        tags: "Premium",
        action: "Pending",
        whatsapp: "Order Confirm",
        status: "booked",
        awbNumber: "AWB123457",
        pincode: "400003"
    },
    {
        orderId: "ORD-2025-004",
        date: "2024-02-18",
        customer: "Neha Singh",
        contact: "9876543213",
        items: [
            {
                name: "Phone Case",
                sku: "PC001",
                quantity: 2,
                price: 999.00
            },
            {
                name: "Screen Guard",
                sku: "SG001",
                quantity: 1,
                price: 11001.00
            }
        ],
        amount: "12999.00",
        payment: "Prepaid",
        chanel: "WOOCOMMERCE",
        weight: "1.8",
        tags: "Accessories",
        action: "Processing",
        whatsapp: "Message Read",
        status: "processing",
        awbNumber: "AWB123458",
        pincode: "400004"
    },
    {
        orderId: "ORD-2025-005",
        date: "2024-02-18",
        customer: "Vikram Verma",
        contact: "9876543214",
        items: [
            {
                name: "Bluetooth Speaker",
                sku: "BS001",
                quantity: 1,
                price: 7999.00
            }
        ],
        amount: "7999.00",
        payment: "COD",
        chanel: "AMAZON",
        weight: "0.8",
        tags: "Electronics",
        action: "Cancelled",
        whatsapp: "Message Delivered",
        status: "shipment-cancelled",
        awbNumber: "AWB123459",
        pincode: "400005"
    },
    {
        orderId: "ORD-2025-006",
        date: "2024-02-17",
        customer: "Anjali Gupta",
        contact: "9876543215",
        items: [
            {
                name: "Gaming Mouse",
                sku: "GM001",
                quantity: 1,
                price: 12499.00
            },
            {
                name: "Gaming Keyboard",
                sku: "GK001",
                quantity: 1,
                price: 12500.00
            }
        ],
        amount: "24999.00",
        payment: "Prepaid",
        chanel: "FLIPKART",
        weight: "1.5",
        tags: "Gaming",
        action: "Error",
        whatsapp: "Message Read",
        status: "error",
        awbNumber: "AWB123460",
        pincode: "400006"
    },
    {
        orderId: "ORD-2025-007",
        date: "2024-02-17",
        customer: "Rajesh Kumar",
        contact: "9876543216",
        items: [
            {
                name: "Premium Smartwatch",
                sku: "PS001",
                quantity: 1,
                price: 39999.00
            }
        ],
        amount: "39999.00",
        payment: "COD",
        chanel: "OPENCART",
        weight: "2.2",
        tags: "Premium",
        action: "In Transit",
        whatsapp: "Order Confirm",
        status: "not-booked",
        awbNumber: undefined,
        pincode: "400007"
    },
    {
        orderId: "ORD-2025-008",
        date: "2024-02-16",
        customer: "Meera Shah",
        contact: "9876543217",
        items: [
            {
                name: "Power Bank",
                sku: "PB001",
                quantity: 1,
                price: 3999.00
            },
            {
                name: "USB Cable",
                sku: "UC001",
                quantity: 1,
                price: 5000.00
            }
        ],
        amount: "8999.00",
        payment: "Prepaid",
        chanel: "API",
        weight: "1.0",
        tags: "Accessories",
        action: "Processing",
        whatsapp: "Order Cancelled",
        status: "processing",
        awbNumber: "AWB123461",
        pincode: "400008"
    },
    {
        orderId: "ORD-2025-009",
        date: "2024-02-16",
        customer: "Arun Reddy",
        contact: "9876543218",
        items: [
            {
                name: "Wireless Earbuds",
                sku: "WE001",
                quantity: 1,
                price: 15999.00
            }
        ],
        amount: "15999.00",
        payment: "COD",
        chanel: "MANUAL",
        weight: "1.3",
        tags: "Electronics",
        action: "Pending",
        whatsapp: "Message Delivered",
        status: "booked",
        awbNumber: "AWB123462",
        pincode: "400009"
    },
    {
        orderId: "ORD-2025-010",
        date: "2024-02-15",
        customer: "Pooja Sharma",
        contact: "9876543219",
        items: [
            {
                name: "Gaming Console",
                sku: "GC001",
                quantity: 1,
                price: 29999.00
            },
            {
                name: "Game Controller",
                sku: "GCT001",
                quantity: 2,
                price: 0.00
            }
        ],
        amount: "29999.00",
        payment: "Prepaid",
        chanel: "EXCEL",
        weight: "2.0",
        tags: "Gaming",
        action: "Cancelled",
        whatsapp: "Message Read",
        status: "cancelled",
        awbNumber: "AWB123463",
        pincode: "400010"
    }
];

const USE_MOCK_DATA = true; // Set to true to use mock data for testing

interface OrderDataState {
    loading: boolean;
    error: string | null;
    orders: OrderData[] | null;
    stats: OrderStats | null;
    filters: OrderFilters;
    selectedOrders: string[];
}


export const useOrderData = () => {
    const [state, setState] = useState<OrderDataState>({
        loading: false,
        error: null,
        orders: null,
        stats: null,
        filters: {},
        selectedOrders: []
    });

    const fetchOrders = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true, error: null }));
        try {
            if (USE_MOCK_DATA) {
                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Filter mock data based on filters
                let filteredOrders = [...mockOrders];
                if (state.filters.status) {
                    filteredOrders = filteredOrders.filter(order => order.status === state.filters.status);
                }
                if (state.filters.search) {
                    const searchTerm = state.filters.search.toLowerCase();
                    filteredOrders = filteredOrders.filter(order => 
                        order.orderId.toLowerCase().includes(searchTerm) ||
                        order.customer.toLowerCase().includes(searchTerm) ||
                        order.contact.toLowerCase().includes(searchTerm) ||
                        order.items.some(item => item.name.toLowerCase().includes(searchTerm)) ||
                        order.amount.toLowerCase().includes(searchTerm) ||
                        order.payment.toLowerCase().includes(searchTerm) ||
                        order.chanel.toLowerCase().includes(searchTerm) ||
                        order.weight.toLowerCase().includes(searchTerm) ||
                        order.tags.toLowerCase().includes(searchTerm) ||
                        order.action.toLowerCase().includes(searchTerm) ||
                        order.whatsapp.toLowerCase().includes(searchTerm)
                    );
                }

                // Calculate mock stats
                const mockStats: OrderStats = {
                    total: mockOrders.length,
                    notBooked: mockOrders.filter(o => o.status === "not-booked").length,
                    processing: mockOrders.filter(o => o.status === "processing").length,
                    booked: mockOrders.filter(o => o.status === "booked").length,
                    cancelled: mockOrders.filter(o => o.status === "cancelled").length,
                    shipmentCancelled: mockOrders.filter(o => o.status === "shipment-cancelled").length,
                    error: mockOrders.filter(o => o.status === "error").length
                };

                setState(prev => ({
                    ...prev,
                    orders: filteredOrders,
                    stats: mockStats,
                    loading: false
                }));
            } else {
                // Use real backend data
                const [ordersResponse, statsResponse] = await Promise.all([
                    sellerOrderService.getOrders(state.filters),
                    sellerOrderService.getOrderStats(state.filters)
                ]);

                if (ordersResponse.status === 200 && statsResponse.status === 200) {
                    setState(prev => ({
                        ...prev,
                        orders: ordersResponse.data,
                        stats: statsResponse.data,
                        loading: false
                    }));
                } else {
                    throw new Error('Failed to fetch order data');
                }
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred while fetching orders';
            setState(prev => ({
                ...prev,
                error: errorMessage,
                loading: false
            }));
            toast.error(errorMessage);
        }
    }, [state.filters]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const updateFilters = useCallback((newFilters: Partial<OrderFilters>) => {
        setState(prev => ({
            ...prev,
            filters: { ...prev.filters, ...newFilters }
        }));
    }, []);

    const getActionFromStatus = (status: OrderData['status']): OrderData['action'] => {
        switch (status) {
            case 'not-booked':
                return 'Ship';
            case 'processing':
                return 'Processing';
            case 'booked':
                return 'In Transit';
            case 'cancelled':
                return 'Cancelled';
            case 'shipment-cancelled':
                return 'Cancelled';
            case 'error':
                return 'Error';
            default:
                return 'Pending';
        }
    };

    const updateOrderStatus = useCallback(async (orderId: string, status: OrderData['status']) => {
        try {
            if (USE_MOCK_DATA) {
                // Update mock data
                const updatedOrders = state.orders?.map(order => 
                    order.orderId === orderId 
                        ? { 
                            ...order, 
                            status,
                            action: getActionFromStatus(status)
                        } 
                        : order
                );
                setState(prev => ({ ...prev, orders: updatedOrders || null }));
                toast.success('Order status updated successfully');
            } else {
                const response = await sellerOrderService.updateOrderStatus(orderId, status);
                if (response.status === 200) {
                    await fetchOrders(); // Refresh data
                    toast.success('Order status updated successfully');
                } else {
                    throw new Error('Failed to update order status');
                }
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to update order status';
            toast.error(errorMessage);
        }
    }, [fetchOrders, state.orders]);

    const bulkUpdateOrderStatus = useCallback(async (orderIds: string[], status: OrderData['status']) => {
        try {
            if (USE_MOCK_DATA) {
                // Update mock data
                const updatedOrders = state.orders?.map(order => 
                    orderIds.includes(order.orderId) 
                        ? { 
                            ...order, 
                            status,
                            action: getActionFromStatus(status)
                        } 
                        : order
                );
                setState(prev => ({ ...prev, orders: updatedOrders || null }));
                toast.success('Orders status updated successfully');
            } else {
                const response = await sellerOrderService.bulkUpdateOrderStatus(orderIds, status);
                if (response.status === 200) {
                    await fetchOrders(); // Refresh data
                    toast.success('Orders status updated successfully');
                } else {
                    throw new Error('Failed to update orders status');
                }
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to update orders status';
            toast.error(errorMessage);
        }
    }, [fetchOrders, state.orders]);

    const getFilteredOrders = useCallback((status: OrderData['status']) => {
        if (!state.orders) return [];
        return state.orders.filter(order => order.status === status);
    }, [state.orders]);

    // Add selection handlers
    const toggleOrderSelection = useCallback((orderId: string) => {
        setState(prev => ({
            ...prev,
            selectedOrders: prev.selectedOrders.includes(orderId)
                ? prev.selectedOrders.filter(id => id !== orderId)
                : [...prev.selectedOrders, orderId]
        }));
    }, []);

    const clearSelection = useCallback(() => {
        setState(prev => ({
            ...prev,
            selectedOrders: []
        }));
    }, []);

    return {
        ...state,
        updateFilters,
        updateOrderStatus,
        bulkUpdateOrderStatus,
        getFilteredOrders,
        refresh: fetchOrders,
        toggleOrderSelection,
        clearSelection
    };
}; 