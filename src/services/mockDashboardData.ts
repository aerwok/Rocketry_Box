import { DashboardStats, DashboardChartData, CourierData, ProductData } from './seller-dashboard.service';

export const mockDashboardStats: DashboardStats = {
  orders: {
    total: 1254,
    pending: 182,
    processing: 78,
    shipped: 356,
    delivered: 589,
    cancelled: 49,
    todayCount: 24
  },
  shipments: {
    total: 1023,
    todayCount: 18
  },
  delivery: {
    total: 589,
    todayCount: 12
  },
  cod: {
    expected: 78650.50,
    totalDue: 156890.25
  },
  revenue: {
    total: 567890.75,
    dailyGrowth: 14.5
  },
  ndr: {
    pending: 42,
    actionRequired: 18
  }
};

export const mockCourierData: CourierData[] = [
  {
    courier: "BlueDart",
    total: 325,
    notShipped: 25,
    pendingPickup: 42,
    inTransit: 85,
    ofd: 18,
    delivered: { count: 145, percentage: "44.6%" },
    cancelled: { count: 5, percentage: "1.5%" },
    exception: { count: 3, percentage: "0.9%" },
    rto: 12,
    lostDamage: 2
  },
  {
    courier: "Delhivery",
    total: 287,
    notShipped: 20,
    pendingPickup: 38,
    inTransit: 72,
    ofd: 15,
    delivered: { count: 132, percentage: "46.0%" },
    cancelled: { count: 4, percentage: "1.4%" },
    exception: { count: 2, percentage: "0.7%" },
    rto: 10,
    lostDamage: 1
  },
  {
    courier: "DTDC",
    total: 175,
    notShipped: 15,
    pendingPickup: 22,
    inTransit: 45,
    ofd: 8,
    delivered: { count: 78, percentage: "44.6%" },
    cancelled: { count: 3, percentage: "1.7%" },
    exception: { count: 2, percentage: "1.1%" },
    rto: 5,
    lostDamage: 1
  },
  {
    courier: "Ekart",
    total: 215,
    notShipped: 18,
    pendingPickup: 25,
    inTransit: 58,
    ofd: 12,
    delivered: { count: 95, percentage: "44.2%" },
    cancelled: { count: 3, percentage: "1.4%" },
    exception: { count: 2, percentage: "0.9%" },
    rto: 7,
    lostDamage: 1
  },
  {
    courier: "XpressBees",
    total: 198,
    notShipped: 16,
    pendingPickup: 24,
    inTransit: 52,
    ofd: 10,
    delivered: { count: 88, percentage: "44.4%" },
    cancelled: { count: 3, percentage: "1.5%" },
    exception: { count: 2, percentage: "1.0%" },
    rto: 6,
    lostDamage: 1
  },
  {
    courier: "Amazon",
    total: 165,
    notShipped: 12,
    pendingPickup: 20,
    inTransit: 42,
    ofd: 8,
    delivered: { count: 75, percentage: "45.5%" },
    cancelled: { count: 2, percentage: "1.2%" },
    exception: { count: 1, percentage: "0.6%" },
    rto: 5,
    lostDamage: 0
  }
];

export const mockTopProducts: ProductData[] = [
  {
    productName: "iPhone 15 Pro Max",
    quantity: 250,
    totalShipments: 230,
    notShipped: 20,
    cancelled: 5,
    pendingPickup: 15,
    inTransit: 80,
    delivered: 110,
    rto: 20
  },
  {
    productName: "Samsung Galaxy S24 Ultra",
    quantity: 200,
    totalShipments: 180,
    notShipped: 20,
    cancelled: 8,
    pendingPickup: 12,
    inTransit: 60,
    delivered: 85,
    rto: 15
  },
  {
    productName: "MacBook Pro M3",
    quantity: 150,
    totalShipments: 140,
    notShipped: 10,
    cancelled: 3,
    pendingPickup: 7,
    inTransit: 50,
    delivered: 70,
    rto: 10
  },
  {
    productName: "AirPods Pro 2",
    quantity: 300,
    totalShipments: 280,
    notShipped: 20,
    cancelled: 10,
    pendingPickup: 20,
    inTransit: 100,
    delivered: 130,
    rto: 20
  },
  {
    productName: "iPad Pro 12.9",
    quantity: 180,
    totalShipments: 160,
    notShipped: 20,
    cancelled: 5,
    pendingPickup: 15,
    inTransit: 55,
    delivered: 75,
    rto: 10
  },
  {
    productName: "Apple Watch Series 9",
    quantity: 220,
    totalShipments: 200,
    notShipped: 20,
    cancelled: 7,
    pendingPickup: 18,
    inTransit: 70,
    delivered: 95,
    rto: 10
  },
  {
    productName: "Sony WH-1000XM5",
    quantity: 160,
    totalShipments: 150,
    notShipped: 10,
    cancelled: 4,
    pendingPickup: 11,
    inTransit: 45,
    delivered: 80,
    rto: 10
  },
  {
    productName: "Dell XPS 15",
    quantity: 120,
    totalShipments: 110,
    notShipped: 10,
    cancelled: 3,
    pendingPickup: 8,
    inTransit: 35,
    delivered: 55,
    rto: 9
  },
  {
    productName: "Nintendo Switch OLED",
    quantity: 140,
    totalShipments: 130,
    notShipped: 10,
    cancelled: 4,
    pendingPickup: 9,
    inTransit: 40,
    delivered: 67,
    rto: 10
  },
  {
    productName: "PS5 Digital Edition",
    quantity: 170,
    totalShipments: 160,
    notShipped: 10,
    cancelled: 5,
    pendingPickup: 12,
    inTransit: 58,
    delivered: 75,
    rto: 10
  }
];

export const mockChartData: DashboardChartData = {
  orderStatusDistribution: {
    delivered: 589,
    inTransit: 356,
    pending: 260
  },
  shipmentTrends: [
    { day: "Mon", current: 85, previous: 65 },
    { day: "Tue", current: 95, previous: 75 },
    { day: "Wed", current: 110, previous: 90 },
    { day: "Thu", current: 100, previous: 85 },
    { day: "Fri", current: 120, previous: 95 },
    { day: "Sat", current: 90, previous: 75 },
    { day: "Sun", current: 75, previous: 60 }
  ],
  revenueTrends: [
    { month: "Jan", value: 78500 },
    { month: "Feb", value: 82300 },
    { month: "Mar", value: 75000 },
    { month: "Apr", value: 92000 },
    { month: "May", value: 84500 },
    { month: "Jun", value: 107000 },
    { month: "Jul", value: 98500 }
  ],
  topProducts: [
    { month: "iPhone 15 Pro", desktop: 350 },
    { month: "Samsung S24", desktop: 280 },
    { month: "AirPods Pro", desktop: 240 },
    { month: "MacBook Air", desktop: 180 },
    { month: "iPad Pro", desktop: 150 }
  ],
  deliveryPerformance: [
    { month: "Week 1", desktop: 82 },
    { month: "Week 2", desktop: 78 },
    { month: "Week 3", desktop: 85 },
    { month: "Week 4", desktop: 90 }
  ],
  courierData: mockCourierData,
  productData: mockTopProducts
}; 