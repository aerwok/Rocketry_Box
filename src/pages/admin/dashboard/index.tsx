import { useState, useEffect } from "react";
import { DateRange } from "react-day-picker";
import { Download, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import DateRangePicker from "@/components/admin/date-range-picker";
import { Link } from "react-router-dom";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import AdminCustomerDashboardPage from "./customer";

interface DashboardCard {
    title: string;
    value: string | number;
    change: string;
}

interface Shipment {
    orderId: string;
    date: string;
    seller: string;
    product: string;
    weight: string;
    payment: string;
    customer: string;
    carrier: string;
    status: string;
    fulfilled: string;
    // Courier Load properties
    orders?: number;
    capacityUsed?: string;
    availableCapacity?: string;
    // Courier Status properties
    activeOrders?: number;
    delivered?: number;
    inTransit?: number;
    pending?: number;
    // Transaction Amount for orders
    transactionAmount?: string;
}

// Mock data for testing
const MOCK_DASHBOARD_CARDS: DashboardCard[] = [
    {
        title: "Total Shipments",
        value: "156",
        change: "+12% from last month"
    },
    {
        title: "Revenue generated",
        value: "$45,678",
        change: "+8% from last month"
    },
    {
        title: "Pending Orders",
        value: "23",
        change: "-5% from last month"
    },
    {
        title: "Active users",
        value: "1,234",
        change: "+15% from last month"
    },
    {
        title: "New users",
        value: "89",
        change: "+23% from last month"
    }
];

const MOCK_SHIPMENTS: Shipment[] = [
    {
        orderId: "ORD001",
        date: "2024-02-15",
        seller: "Electronics Store",
        product: "Smartphone X",
        weight: "0.5 kg",
        payment: "Prepaid",
        customer: "John Doe",
        carrier: "Express Delivery",
        status: "In-transit",
        fulfilled: "Yes",
        orders: 45,
        capacityUsed: "75%",
        availableCapacity: "25%",
        activeOrders: 12,
        delivered: 28,
        inTransit: 5,
        pending: 0,
        transactionAmount: "$1200"
    },
    {
        orderId: "ORD002",
        date: "2024-02-14",
        seller: "Fashion Hub",
        product: "Designer Watch",
        weight: "0.2 kg",
        payment: "COD",
        customer: "Jane Smith",
        carrier: "Quick Ship",
        status: "Delivered",
        fulfilled: "Yes",
        orders: 32,
        capacityUsed: "60%",
        availableCapacity: "40%",
        activeOrders: 8,
        delivered: 20,
        inTransit: 4,
        pending: 0,
        transactionAmount: "$350"
    },
    {
        orderId: "ORD003",
        date: "2024-02-13",
        seller: "Home Goods",
        product: "Coffee Maker",
        weight: "2.5 kg",
        payment: "Prepaid",
        customer: "Mike Johnson",
        carrier: "Heavy Haul",
        status: "Pending Pickup",
        fulfilled: "No",
        orders: 18,
        capacityUsed: "90%",
        availableCapacity: "10%",
        activeOrders: 5,
        delivered: 10,
        inTransit: 3,
        pending: 0,
        transactionAmount: "$80"
    }
];

// Commented out for now; uncomment when real APIs are used
// const API_ENDPOINTS = {
//     DASHBOARD_STATS: '/api/admin/dashboard/stats',
//     SHIPMENTS: '/api/admin/dashboard/shipments',
//     COURIER_LOAD: '/api/admin/dashboard/courier-load',
//     COURIER_STATUS: '/api/admin/dashboard/courier-status'
// };

const getStatusStyle = (status: string) => {
    const styles = {
        "Booked": "bg-green-100 text-green-800",
        "In-transit": "bg-blue-100 text-blue-800",
        "Pending Pickup": "bg-orange-100 text-orange-800",
        "Delivered": "bg-purple-100 text-purple-800"
    };
    return styles[status as keyof typeof styles] || "bg-gray-100 text-gray-800";
};

type SortableFields = keyof Shipment | 'orders' | 'capacityUsed' | 'availableCapacity' | 'activeOrders' | 'delivered' | 'inTransit' | 'pending';

type SortConfig = {
    key: SortableFields | null;
    direction: 'asc' | 'desc' | null;
};

const ShipmentsTable = ({ data, type = "shipment" }: { data: Shipment[], type?: "shipment" | "order" | "courierLoad" | "courierStatus" }) => {
    const [sortConfig, setSortConfig] = useState<SortConfig>({
        key: null,
        direction: null,
    });

    const handleSort = (key: SortableFields) => {
        let direction: 'asc' | 'desc' | null = 'asc';

        if (sortConfig.key === key) {
            if (sortConfig.direction === 'asc') {
                direction = 'desc';
            } else if (sortConfig.direction === 'desc') {
                direction = null;
            }
        }

        setSortConfig({ key, direction });
    };

    const getSortedData = () => {
        if (!sortConfig.key || !sortConfig.direction) return data;

        return [...data].sort((a, b) => {
            let aValue: any = a[sortConfig.key as keyof Shipment];
            let bValue: any = b[sortConfig.key as keyof Shipment];

            // Ensure transactionAmount is always a string for comparison
            if (sortConfig.key === 'transactionAmount') {
                aValue = aValue ? aValue.replace(/[^\d.]/g, '') : '0';
                bValue = bValue ? bValue.replace(/[^\d.]/g, '') : '0';
                return sortConfig.direction === 'asc'
                    ? parseFloat(aValue) - parseFloat(bValue)
                    : parseFloat(bValue) - parseFloat(aValue);
            }

            // Handle numeric fields
            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
            }

            // Handle string fields
            aValue = String(aValue ?? '');
            bValue = String(bValue ?? '');

            if (aValue < bValue) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    };

    const getSortIcon = () => {
        return <ArrowUpDown className="size-3" />;
    };

    const sortedData = getSortedData();

    if (type === "order") {
        return (
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableHead className="min-w-[100px] whitespace-nowrap">
                            <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('orderId')}>
                                User ID
                                {getSortIcon()}
                            </div>
                        </TableHead>
                        <TableHead className="min-w-[150px] whitespace-nowrap">
                            <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('seller')}>
                                Name
                                {getSortIcon()}
                            </div>
                        </TableHead>
                        <TableHead className="min-w-[180px] whitespace-nowrap">
                            <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('customer')}>
                                Email
                                {getSortIcon()}
                            </div>
                        </TableHead>
                        <TableHead className="min-w-[150px] whitespace-nowrap">
                            <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('seller')}>
                                Sender's Name
                                {getSortIcon()}
                            </div>
                        </TableHead>
                        <TableHead className="min-w-[140px] whitespace-nowrap">
                            <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('date')}>
                                Registration Date
                                {getSortIcon()}
                            </div>
                        </TableHead>
                        <TableHead className="min-w-[140px] whitespace-nowrap">
                            <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('transactionAmount')}>
                                Transaction Amount
                                {getSortIcon()}
                            </div>
                        </TableHead>
                        <TableHead className="min-w-[100px] whitespace-nowrap">
                            <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('status')}>
                                Status
                                {getSortIcon()}
                            </div>
                        </TableHead>
                    </TableHeader>
                    <TableBody>
                        {sortedData.map((shipment, index) => (
                            <TableRow key={`${shipment.orderId}-${index}`}>
                                <TableCell className="whitespace-nowrap font-medium">
                                    <Link
                                        to={`/admin/dashboard/orders/${shipment.orderId}`}
                                        className="text-purple-600 hover:underline font-medium"
                                    >
                                        {shipment.orderId}
                                    </Link>
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                    {shipment.seller}
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                    {shipment.customer}
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                    {shipment.carrier}
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                    {shipment.date}
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                    {shipment.transactionAmount}
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(shipment.status)}`}>
                                        {shipment.status}
                                    </span>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        );
    }

    if (type === "courierLoad") {
        return (
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-neutral-100 hover:bg-neutral-100">
                            <TableHead className="min-w-[120px] whitespace-nowrap">
                                <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('carrier')}>
                                    Courier Name
                                    {getSortIcon()}
                                </div>
                            </TableHead>
                            <TableHead className="min-w-[120px] whitespace-nowrap">
                                <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('orders')}>
                                    Total Orders
                                    {getSortIcon()}
                                </div>
                            </TableHead>
                            <TableHead className="min-w-[120px] whitespace-nowrap">
                                <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('weight')}>
                                    Total Weight
                                    {getSortIcon()}
                                </div>
                            </TableHead>
                            <TableHead className="min-w-[120px] whitespace-nowrap">
                                <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('capacityUsed')}>
                                    Capacity Used
                                    {getSortIcon()}
                                </div>
                            </TableHead>
                            <TableHead className="min-w-[120px] whitespace-nowrap">
                                <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('availableCapacity')}>
                                    Available Capacity
                                    {getSortIcon()}
                                </div>
                            </TableHead>
                            <TableHead className="min-w-[120px] whitespace-nowrap">
                                <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('status')}>
                                    Status
                                    {getSortIcon()}
                                </div>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedData.map((shipment, index) => (
                            <TableRow key={`${shipment.orderId}-${index}`}>
                                <TableCell className="whitespace-nowrap font-medium">
                                    {shipment.carrier}
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                    {shipment.orders || 0}
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                    {shipment.weight}
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                    {shipment.capacityUsed || "0%"}
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                    {shipment.availableCapacity || "100%"}
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(shipment.status)}`}>
                                        {shipment.status}
                                    </span>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        );
    }

    if (type === "courierStatus") {
        return (
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-neutral-100 hover:bg-neutral-100">
                            <TableHead className="min-w-[120px] whitespace-nowrap">
                                <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('carrier')}>
                                    Courier Name
                                    {getSortIcon()}
                                </div>
                            </TableHead>
                            <TableHead className="min-w-[120px] whitespace-nowrap">
                                <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('activeOrders')}>
                                    Active Orders
                                    {getSortIcon()}
                                </div>
                            </TableHead>
                            <TableHead className="min-w-[120px] whitespace-nowrap">
                                <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('delivered')}>
                                    Delivered
                                    {getSortIcon()}
                                </div>
                            </TableHead>
                            <TableHead className="min-w-[120px] whitespace-nowrap">
                                <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('inTransit')}>
                                    In Transit
                                    {getSortIcon()}
                                </div>
                            </TableHead>
                            <TableHead className="min-w-[120px] whitespace-nowrap">
                                <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('pending')}>
                                    Pending
                                    {getSortIcon()}
                                </div>
                            </TableHead>
                            <TableHead className="min-w-[120px] whitespace-nowrap">
                                <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('status')}>
                                    Status
                                    {getSortIcon()}
                                </div>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedData.map((shipment, index) => (
                            <TableRow key={`${shipment.orderId}-${index}`}>
                                <TableCell className="whitespace-nowrap font-medium">
                                    {shipment.carrier}
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                    {shipment.activeOrders || 0}
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                    {shipment.delivered || 0}
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                    {shipment.inTransit || 0}
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                    {shipment.pending || 0}
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(shipment.status)}`}>
                                        {shipment.status}
                                    </span>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        );
    }

    // Default shipment table
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow className="bg-neutral-100 hover:bg-neutral-100">
                        <TableHead className="min-w-[120px] whitespace-nowrap">
                            <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('orderId')}>
                                Order ID
                                {getSortIcon()}
                            </div>
                        </TableHead>
                        <TableHead className="min-w-[100px] whitespace-nowrap">
                            <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('date')}>
                                Date
                                {getSortIcon()}
                            </div>
                        </TableHead>
                        <TableHead className="min-w-[120px] whitespace-nowrap">
                            <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('seller')}>
                                Seller
                                {getSortIcon()}
                            </div>
                        </TableHead>
                        <TableHead className="min-w-[150px] whitespace-nowrap">
                            <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('product')}>
                                Product
                                {getSortIcon()}
                            </div>
                        </TableHead>
                        <TableHead className="min-w-[100px] whitespace-nowrap">
                            <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('weight')}>
                                Weight
                                {getSortIcon()}
                            </div>
                        </TableHead>
                        <TableHead className="min-w-[120px] whitespace-nowrap">
                            <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('transactionAmount')}>
                                Transaction Amount
                                {getSortIcon()}
                            </div>
                        </TableHead>
                        <TableHead className="min-w-[120px] whitespace-nowrap">
                            <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('customer')}>
                                Customer
                                {getSortIcon()}
                            </div>
                        </TableHead>
                        <TableHead className="min-w-[120px] whitespace-nowrap">
                            <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('carrier')}>
                                Carrier
                                {getSortIcon()}
                            </div>
                        </TableHead>
                        <TableHead className="min-w-[100px] whitespace-nowrap">
                            <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('status')}>
                                Status
                                {getSortIcon()}
                            </div>
                        </TableHead>
                        <TableHead className="min-w-[100px] whitespace-nowrap">
                            <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('fulfilled')}>
                                Fulfilled
                                {getSortIcon()}
                            </div>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedData.map((shipment, index) => (
                        <TableRow key={`${shipment.orderId}-${index}`}>
                            <TableCell className="whitespace-nowrap font-medium">
                                <Link
                                    to={`/admin/dashboard/shipments/${shipment.orderId}`}
                                    className="text-purple-600 hover:underline font-medium"
                                >
                                    {shipment.orderId}
                                </Link>
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                                {shipment.date}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                                {shipment.seller}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                                {shipment.product}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                                {shipment.weight}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                                {shipment.transactionAmount}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                                {shipment.customer}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                                {shipment.carrier}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(shipment.status)}`}>
                                    {shipment.status}
                                </span>
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                                {shipment.fulfilled}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

// Helper function to filter by date range
function filterByDateRange<T extends { date: string }>(data: T[], dateRange: DateRange | undefined) {
    if (!dateRange?.from || !dateRange?.to) return data;
    const from = dateRange.from.getTime();
    const to = dateRange.to.getTime();
    return data.filter(item => {
        const itemDate = new Date(item.date).getTime();
        return itemDate >= from && itemDate <= to;
    });
}

// Helper to convert array of objects to CSV
function arrayToCSV<T>(data: T[], columns: string[]): string {
    const header = columns.join(",");
    const rows = data.map(row => columns.map(col => `"${(row as any)[col] ?? ''}"`).join(","));
    return [header, ...rows].join("\n");
}

function downloadCSV(filename: string, csv: string) {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

const AdminDashboardPage = () => {
    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(2024, 1, 10), // Feb 10, 2024
        to: new Date(2024, 1, 20),   // Feb 20, 2024
    });
    const [dashboardCards, setDashboardCards] = useState<DashboardCard[]>(MOCK_DASHBOARD_CARDS);
    const [shipments, setShipments] = useState<Shipment[]>(MOCK_SHIPMENTS);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Commented out API calls for testing with mock data only
        // const fetchDashboardData = async () => {
        //     try {
        //         setLoading(true);
        //         // Fetch dashboard stats
        //         const statsResponse = await fetch(API_ENDPOINTS.DASHBOARD_STATS);
        //         if (!statsResponse.ok) throw new Error('Failed to fetch dashboard stats');
        //         const statsData = await statsResponse.json();
        //         setDashboardCards(statsData);
        //
        //         // Fetch shipments data
        //         const shipmentsResponse = await fetch(API_ENDPOINTS.SHIPMENTS);
        //         if (!shipmentsResponse.ok) throw new Error('Failed to fetch shipments');
        //         const shipmentsData = await shipmentsResponse.json();
        //         setShipments(shipmentsData);
        //
        //         setError(null);
        //     } catch (err) {
        //         setError(err instanceof Error ? err.message : 'An error occurred');
        //         // Fallback to mock data in case of error
        //         setDashboardCards(MOCK_DASHBOARD_CARDS);
        //         setShipments(MOCK_SHIPMENTS);
        //     } finally {
        //         setLoading(false);
        //     }
        // };
        //
        // fetchDashboardData();
        setDashboardCards(MOCK_DASHBOARD_CARDS);
        setShipments(MOCK_SHIPMENTS);
        setLoading(false);
        setError(null);
    }, [date]);

    // Filtered data for seller dashboard
    const filteredShipments = filterByDateRange(shipments, date);

    // Download handler
    const handleDownload = () => {
        console.log("Download clicked", filteredShipments);
        if (!filteredShipments.length) {
            alert("No data to download.");
            return;
        }
        const shipmentCSV = arrayToCSV(filteredShipments, [
            'orderId', 'date', 'seller', 'product', 'weight', 'payment', 'customer', 'carrier', 'status', 'fulfilled', 'transactionAmount', 'orders', 'capacityUsed', 'availableCapacity', 'activeOrders', 'delivered', 'inTransit', 'pending'
        ]);
        if (!shipmentCSV || shipmentCSV === '') {
            // Fallback: minimal test download
            const blob = new Blob(["test"], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = "test.txt";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            alert("CSV was empty, downloaded test file instead.");
            return;
        }
        downloadCSV('shipments.csv', shipmentCSV);
    };

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500 p-4">Error: {error}</div>;
    }

    return (
        <div className="space-y-6">
            {/* Tabs */}
            <Tabs defaultValue="seller" className="space-y-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <h1 className="text-xl lg:text-2xl font-semibold">
                        Dashboard
                    </h1>
                    <TabsList>
                        <TabsTrigger value="seller">Seller Dashboard</TabsTrigger>
                        <TabsTrigger value="customer">Customer Dashboard</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="seller" className="space-y-6">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                            <DateRangePicker date={date} setDate={setDate} className="w-20 md:w-auto" />
                            <Button variant="outline" className="w-full md:w-auto" onClick={handleDownload}>
                                <Download className="mr-2 h-4 w-4" />
                                Download
                            </Button>
                        </div>
                    </div>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {dashboardCards.map((card) => (
                            <Card
                                key={card.title}
                                className="bg-neutral-200"
                            >
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base lg:text-lg font-medium">
                                        {card.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl lg:text-3xl font-bold">
                                        {card.value}
                                    </p>
                                    <p className="text-main text-sm mt-1">
                                        {card.change}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Tables Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Recent Orders */}
                        <div className="space-y-4 w-full">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold">Recent Orders</h2>
                                <Button variant="link" className="text-main">View All</Button>
                            </div>
                            <ShipmentsTable data={filteredShipments} type="order" />
                        </div>

                        {/* Shipments */}
                        <div className="space-y-4 w-full">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold">Shipments</h2>
                                <Button variant="link" className="text-main">View All</Button>
                            </div>
                            <ShipmentsTable data={filteredShipments} />
                        </div>

                        {/* Courier Load */}
                        <div className="space-y-4 w-full">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold">Courier Load</h2>
                                <Button variant="link" className="text-main">View All</Button>
                            </div>
                            <ShipmentsTable data={filteredShipments} type="courierLoad" />
                        </div>

                        {/* Courier Status */}
                        <div className="space-y-4 w-full">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold">Courier Status</h2>
                                <Button variant="link" className="text-main">View All</Button>
                            </div>
                            <ShipmentsTable data={filteredShipments} type="courierStatus" />
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="customer" className="space-y-6">
                    <AdminCustomerDashboardPage />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AdminDashboardPage; 