import { DashboardStats, Order, Shipment } from '@/pages/admin/types/dashboard';

export const mockAdminStats: DashboardStats = {
  totalShipments: 3245,
  revenue: 458950,
  pendingOrders: 145,
  activeUsers: 1872,
  newUsers: 324,
  monthlyGrowth: {
    shipments: 15.3,
    revenue: 18.7,
    users: 9.2
  }
};

export const mockRecentOrders: Order[] = [
  {
    id: "ORD-001278",
    userId: "USR-7834",
    name: "Amit Sharma",
    date: "2024-04-12",
    status: "Active",
    amount: "₹4,590"
  },
  {
    id: "ORD-001277",
    userId: "USR-6543",
    name: "Priya Patel",
    date: "2024-04-12",
    status: "Active",
    amount: "₹2,350"
  },
  {
    id: "ORD-001276",
    userId: "USR-8976",
    name: "Rahul Gupta",
    date: "2024-04-11",
    status: "Completed",
    amount: "₹1,875"
  },
  {
    id: "ORD-001275",
    userId: "USR-5432",
    name: "Neha Singh",
    date: "2024-04-11",
    status: "Inactive",
    amount: "₹3,420"
  },
  {
    id: "ORD-001274",
    userId: "USR-9021",
    name: "Vikram Reddy",
    date: "2024-04-10",
    status: "Pending",
    amount: "₹5,675"
  },
  {
    id: "ORD-001273",
    userId: "USR-3456",
    name: "Deepika Malhotra",
    date: "2024-04-10",
    status: "Cancelled",
    amount: "₹990"
  },
  {
    id: "ORD-001272",
    userId: "USR-7865",
    name: "Rajesh Kumar",
    date: "2024-04-09",
    status: "Completed",
    amount: "₹2,780"
  },
  {
    id: "ORD-001271",
    userId: "USR-4321",
    name: "Meera Desai",
    date: "2024-04-09",
    status: "Active",
    amount: "₹1,560"
  }
];

export const mockShipments: Shipment[] = [
  {
    id: "SHP-00578",
    trackingNumber: "BLDT4569872",
    status: "In-transit",
    origin: "Mumbai",
    destination: "Delhi",
    date: "2024-04-12",
    courier: "BlueDart"
  },
  {
    id: "SHP-00577",
    trackingNumber: "DELY7865432",
    status: "Pending Pickup",
    origin: "Bangalore",
    destination: "Chennai",
    date: "2024-04-12",
    courier: "Delhivery"
  },
  {
    id: "SHP-00576",
    trackingNumber: "DTDC9087654",
    status: "Booked",
    origin: "Hyderabad",
    destination: "Pune",
    date: "2024-04-11",
    courier: "DTDC"
  },
  {
    id: "SHP-00575",
    trackingNumber: "EKRT5432167",
    status: "Delivered",
    origin: "Delhi",
    destination: "Jaipur",
    date: "2024-04-11",
    courier: "Ekart"
  },
  {
    id: "SHP-00574",
    trackingNumber: "XPRS8765432",
    status: "In-transit",
    origin: "Kolkata",
    destination: "Ahmedabad",
    date: "2024-04-10",
    courier: "XpressBees"
  },
  {
    id: "SHP-00573",
    trackingNumber: "AMZN6543219",
    status: "Delivered",
    origin: "Chennai",
    destination: "Coimbatore",
    date: "2024-04-10",
    courier: "Amazon"
  },
  {
    id: "SHP-00572",
    trackingNumber: "SFAX7654321",
    status: "Cancelled",
    origin: "Pune",
    destination: "Mumbai",
    date: "2024-04-09",
    courier: "Shadowfax"
  },
  {
    id: "SHP-00571",
    trackingNumber: "BLDT3456789",
    status: "Delivered",
    origin: "Bangalore",
    destination: "Mysore",
    date: "2024-04-09",
    courier: "BlueDart"
  }
];

export const mockRevenueChartData = [
  { time: "Jan", revenue: 32500 },
  { time: "Feb", revenue: 28750 },
  { time: "Mar", revenue: 36200 },
  { time: "Apr", revenue: 42800 },
  { time: "May", revenue: 38400 },
  { time: "Jun", revenue: 45600 },
  { time: "Jul", revenue: 52300 }
];

export const mockCourierDistribution = [
  { name: "BlueDart", value: 38, fill: "#8D79F6" },
  { name: "Delhivery", value: 25, fill: "#4FBAF0" },
  { name: "DTDC", value: 18, fill: "#FEBD38" },
  { name: "Ekart", value: 19, fill: "#FF6B6B" }
];

export const mockDashboardCards = [
  {
    title: "Total Shipments",
    value: "3,245",
    change: "15.3% from last month"
  },
  {
    title: "Revenue generated",
    value: "₹4,58,950",
    change: "18.7% from last month"
  },
  {
    title: "Pending Orders",
    value: "145",
    change: "5.8% from last month"
  },
  {
    title: "Active users",
    value: "1,872",
    change: "9.2% from last month"
  },
  {
    title: "New users",
    value: "324",
    change: "12.5% from last month"
  }
]; 