import axios from "axios";
import { DashboardStats, Order, Shipment, DashboardFilters } from "../types/dashboard";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3000/api";

export const dashboardService = {
    async getDashboardStats(filters: DashboardFilters): Promise<DashboardStats> {
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