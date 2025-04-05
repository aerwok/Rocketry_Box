import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { 
  reportsService, 
  ReportStats, 
  ReportChartData,
  DeliveryPartnerShare,
  ReportFilters
} from "../services/reports.service";

interface ReportsState {
  loading: boolean;
  statsLoading: boolean;
  revenueLoading: boolean;
  partnersLoading: boolean;
  error: string | null;
  stats: ReportStats | null;
  revenueData: ReportChartData[];
  deliveryPartners: DeliveryPartnerShare[];
  filters: ReportFilters;
}

const initialState: ReportsState = {
  loading: false,
  statsLoading: false,
  revenueLoading: false,
  partnersLoading: false,
  error: null,
  stats: null,
  revenueData: [],
  deliveryPartners: [],
  filters: {
    dateRange: {
      from: new Date(new Date().setDate(new Date().getDate() - 30)),
      to: new Date()
    },
    timeFilter: "1M"
  }
};

export const useReports = () => {
  const [state, setState] = useState<ReportsState>(initialState);

  const fetchReportsData = useCallback(async (filters: ReportFilters) => {
    setState(prev => ({ 
      ...prev, 
      loading: true, 
      statsLoading: true,
      revenueLoading: true,
      partnersLoading: true,
      error: null 
    }));

    try {
      // Fetch stats
      reportsService.getReportStats()
        .then(stats => {
          setState(prev => ({
            ...prev,
            statsLoading: false,
            stats
          }));
        })
        .catch(error => {
          setState(prev => ({
            ...prev,
            statsLoading: false,
            error: error instanceof Error ? error.message : "Failed to fetch stats"
          }));
          toast.error("Failed to fetch report statistics");
        });

      // Fetch revenue data
      reportsService.getRevenueData(filters)
        .then(revenueData => {
          setState(prev => ({
            ...prev,
            revenueLoading: false,
            revenueData
          }));
        })
        .catch(error => {
          setState(prev => ({
            ...prev,
            revenueLoading: false,
            error: error instanceof Error ? error.message : "Failed to fetch revenue data"
          }));
          toast.error("Failed to fetch revenue data");
        });

      // Fetch delivery partner shares
      reportsService.getDeliveryPartnerShares()
        .then(deliveryPartners => {
          setState(prev => ({
            ...prev,
            partnersLoading: false,
            deliveryPartners,
            filters
          }));
        })
        .catch(error => {
          setState(prev => ({
            ...prev,
            partnersLoading: false,
            error: error instanceof Error ? error.message : "Failed to fetch delivery partner data"
          }));
          toast.error("Failed to fetch delivery partner data");
        });

      // Set overall loading to false when all data is loaded
      const checkAllLoaded = setInterval(() => {
        setState(prev => {
          if (!prev.statsLoading && !prev.revenueLoading && !prev.partnersLoading) {
            clearInterval(checkAllLoaded);
            return { ...prev, loading: false };
          }
          return prev;
        });
      }, 100);
      
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        statsLoading: false,
        revenueLoading: false,
        partnersLoading: false,
        error: error instanceof Error ? error.message : "An error occurred"
      }));
      toast.error("Failed to fetch reports data");
    }
  }, []);

  const updateFilters = useCallback((newFilters: Partial<ReportFilters>) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, ...newFilters }
    }));
  }, []);

  const downloadReport = useCallback(async (format: "csv" | "pdf") => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      
      const blob = await reportsService.downloadReport(format);
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `reports-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setState(prev => ({ ...prev, loading: false }));
      toast.success(`Report downloaded as ${format.toUpperCase()}`);
    } catch (error) {
      setState(prev => ({ ...prev, loading: false }));
      toast.error("Failed to download report");
    }
  }, []);

  useEffect(() => {
    fetchReportsData(state.filters);
  }, [fetchReportsData, state.filters]);

  return {
    ...state,
    updateFilters,
    downloadReport,
    refresh: () => fetchReportsData(state.filters)
  };
}; 