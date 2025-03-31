import { useState, useEffect, useCallback } from "react";
import { DashboardState, DashboardFilters, DashboardStats, Order, Shipment } from "../types/dashboard";
import { dashboardService } from "../services/dashboard";
import { toast } from "sonner";

const initialState: DashboardState = {
    loading: false,
    error: null,
    stats: null,
    filters: {
        dateRange: undefined,
        status: undefined,
        search: undefined
    },
    orders: [],
    shipments: []
};

export const useDashboard = () => {
    const [state, setState] = useState<DashboardState>(initialState);

    const fetchDashboardData = useCallback(async (filters: DashboardFilters) => {
        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            const [stats, orders, shipments] = await Promise.all([
                dashboardService.getDashboardStats(filters),
                dashboardService.getRecentOrders(filters),
                dashboardService.getShipments(filters)
            ]);

            setState(prev => ({
                ...prev,
                loading: false,
                stats,
                orders,
                shipments,
                filters
            }));
        } catch (error) {
            setState(prev => ({
                ...prev,
                loading: false,
                error: error instanceof Error ? error.message : "An error occurred"
            }));
            toast.error("Failed to fetch dashboard data");
        }
    }, []);

    const updateFilters = useCallback((newFilters: Partial<DashboardFilters>) => {
        setState(prev => ({
            ...prev,
            filters: { ...prev.filters, ...newFilters }
        }));
    }, []);

    const downloadReport = useCallback(async (format: "csv" | "pdf") => {
        try {
            const blob = await dashboardService.downloadReport(state.filters, format);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `dashboard-report.${format}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            toast.error("Failed to download report");
        }
    }, [state.filters]);

    useEffect(() => {
        fetchDashboardData(state.filters);
    }, [fetchDashboardData, state.filters]);

    return {
        ...state,
        updateFilters,
        downloadReport,
        refresh: () => fetchDashboardData(state.filters)
    };
}; 