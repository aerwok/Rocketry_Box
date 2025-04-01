import axios from "axios";
import { DashboardStats, Order, Shipment, DashboardFilters } from "../types/dashboard";
import { mockAdminStats, mockRecentOrders, mockShipments } from "@/services/adminMockData";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3000/api";

// Toggle between mock data and real API calls
const USE_MOCK_DATA = true;

export const dashboardService = {
    async getDashboardStats(filters: DashboardFilters): Promise<DashboardStats> {
        if (USE_MOCK_DATA) {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 800));
            return mockAdminStats;
        }

        try {
            const response = await axios.get(`${API_BASE_URL}/admin/dashboard/stats`, {
                params: filters
            });
            return response.data;
        } catch (error) {
            throw new Error("Failed to fetch dashboard stats");
        }
    },

    async getRecentOrders(filters: DashboardFilters): Promise<Order[]> {
        if (USE_MOCK_DATA) {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1200));
            return mockRecentOrders;
        }

        try {
            const response = await axios.get(`${API_BASE_URL}/admin/dashboard/orders`, {
                params: filters
            });
            return response.data;
        } catch (error) {
            throw new Error("Failed to fetch recent orders");
        }
    },

    async getShipments(filters: DashboardFilters): Promise<Shipment[]> {
        if (USE_MOCK_DATA) {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            return mockShipments;
        }

        try {
            const response = await axios.get(`${API_BASE_URL}/admin/dashboard/shipments`, {
                params: filters
            });
            return response.data;
        } catch (error) {
            throw new Error("Failed to fetch shipments");
        }
    },

    async downloadReport(filters: DashboardFilters, format: "csv" | "pdf"): Promise<Blob> {
        if (USE_MOCK_DATA) {
            // Create a simple mock blob for testing
            const mockData = 'This is a mock admin report file for testing purposes.\n' +
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
            const response = await axios.get(`${API_BASE_URL}/admin/dashboard/report`, {
                params: { ...filters, format },
                responseType: "blob"
            });
            return response.data;
        } catch (error) {
            throw new Error("Failed to download report");
        }
    }
}; 