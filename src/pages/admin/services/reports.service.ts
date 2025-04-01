import { DateRange } from "react-day-picker";
import { toast } from "sonner";
import { fetchSellers } from "@/lib/api/admin-seller";

// Admin Service with proper return types
const adminService = {
  // In a real implementation, these would call API endpoints
  getReportStats: async (params: any): Promise<{ data: ReportStats }> => {
    // Mock API call
    throw new Error("Not implemented in API");
  },
  getRevenueData: async (params: any): Promise<{ data: ReportChartData[] }> => {
    // Mock API call
    throw new Error("Not implemented in API");
  },
  getDeliveryPartnerShares: async (params: any): Promise<{ data: DeliveryPartnerShare[] }> => {
    // Mock API call
    throw new Error("Not implemented in API");
  },
  downloadReport: async (params: any): Promise<{ data: Blob }> => {
    // Mock API call
    throw new Error("Not implemented in API");
  }
};

// Toggle between mock and real data
const USE_MOCK_DATA = true;

// Types
export interface ReportStats {
  totalRevenue: number;
  totalOrders: number;
  totalShipments: number;
  conversionRate: number;
}

export interface ReportChartData {
  time: string;
  revenue: number;
}

export interface DeliveryPartnerShare {
  name: string;
  value: number;
  fill: string;
}

export interface ReportFilters {
  dateRange?: DateRange;
  timeFilter?: "1D" | "1W" | "1M" | "3M" | "1Y" | "ALL";
}

// Mock data
const mockReportStats: ReportStats = {
  totalRevenue: 12576350,
  totalOrders: 8753,
  totalShipments: 8124,
  conversionRate: 92.8
};

const generateMockRevenueData = (filter: string, dateRange?: DateRange): ReportChartData[] => {
  const baseData = {
    "1D": [
      { time: "12 AM", revenue: 12000 },
      { time: "4 AM", revenue: 8000 },
      { time: "8 AM", revenue: 25000 },
      { time: "12 PM", revenue: 45000 },
      { time: "4 PM", revenue: 32000 },
      { time: "8 PM", revenue: 18000 }
    ],
    "1W": [
      { time: "Mon", revenue: 120000 },
      { time: "Tue", revenue: 135000 },
      { time: "Wed", revenue: 90000 },
      { time: "Thu", revenue: 110000 },
      { time: "Fri", revenue: 150000 },
      { time: "Sat", revenue: 200000 },
      { time: "Sun", revenue: 80000 }
    ],
    "1M": [
      { time: "Week 1", revenue: 350000 },
      { time: "Week 2", revenue: 420000 },
      { time: "Week 3", revenue: 380000 },
      { time: "Week 4", revenue: 510000 }
    ],
    "3M": [
      { time: "Jan", revenue: 1200000 },
      { time: "Feb", revenue: 1450000 },
      { time: "Mar", revenue: 1650000 }
    ],
    "1Y": [
      { time: "Q1", revenue: 3500000 },
      { time: "Q2", revenue: 4200000 },
      { time: "Q3", revenue: 3800000 },
      { time: "Q4", revenue: 5100000 }
    ],
    "ALL": [
      { time: "2020", revenue: 8500000 },
      { time: "2021", revenue: 9800000 },
      { time: "2022", revenue: 10500000 },
      { time: "2023", revenue: 11700000 },
      { time: "2024", revenue: 12500000 }
    ]
  };

  // Add some randomness to the data
  return (baseData[filter as keyof typeof baseData] || baseData["1M"]).map(item => ({
    ...item,
    revenue: Math.floor(item.revenue * (0.9 + Math.random() * 0.2))
  }));
};

const mockDeliveryPartnerShares: DeliveryPartnerShare[] = [
  { name: "Bluedart", value: 35, fill: "#8D79F6" },
  { name: "Delhivery", value: 28, fill: "#4FBAF0" },
  { name: "DTDC", value: 22, fill: "#FEBD38" },
  { name: "Ekart", value: 15, fill: "#FF6B6B" }
];

// Service methods
export const reportsService = {
  getReportStats: async (filters: ReportFilters): Promise<ReportStats> => {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      return mockReportStats;
    }

    try {
      const response = await adminService.getReportStats({
        fromDate: filters.dateRange?.from?.toISOString(),
        toDate: filters.dateRange?.to?.toISOString()
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching report stats:", error);
      toast.error("Failed to fetch report statistics");
      throw error;
    }
  },

  getRevenueData: async (filters: ReportFilters): Promise<ReportChartData[]> => {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return generateMockRevenueData(filters.timeFilter || "1M", filters.dateRange);
    }

    try {
      const response = await adminService.getRevenueData({
        fromDate: filters.dateRange?.from?.toISOString(),
        toDate: filters.dateRange?.to?.toISOString(),
        timeFilter: filters.timeFilter
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching revenue data:", error);
      toast.error("Failed to fetch revenue data");
      throw error;
    }
  },

  getDeliveryPartnerShares: async (filters: ReportFilters): Promise<DeliveryPartnerShare[]> => {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 700));
      
      // Add some randomness to the data
      return mockDeliveryPartnerShares.map(item => ({
        ...item,
        value: Math.floor(item.value * (0.9 + Math.random() * 0.2))
      }));
    }

    try {
      const response = await adminService.getDeliveryPartnerShares({
        fromDate: filters.dateRange?.from?.toISOString(),
        toDate: filters.dateRange?.to?.toISOString()
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching delivery partner shares:", error);
      toast.error("Failed to fetch delivery partner data");
      throw error;
    }
  },

  downloadReport: async (filters: ReportFilters, format: "csv" | "pdf"): Promise<Blob> => {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create a dummy blob for testing
      const dummyData = format === "csv" 
        ? "Date,Revenue,Orders,Shipments\n2023-01-01,120000,150,145\n2023-01-02,135000,162,158"
        : "%PDF-1.7\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /Resources 4 0 R /MediaBox [0 0 612 792] /Contents 5 0 R >>\nendobj";
      
      return new Blob([dummyData], { 
        type: format === "csv" ? "text/csv" : "application/pdf" 
      });
    }

    try {
      const response = await adminService.downloadReport({
        fromDate: filters.dateRange?.from?.toISOString(),
        toDate: filters.dateRange?.to?.toISOString(),
        format
      });
      
      return response.data;
    } catch (error) {
      console.error("Error downloading report:", error);
      toast.error(`Failed to download ${format.toUpperCase()} report`);
      throw error;
    }
  }
}; 