import { useState } from "react";
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
import { cn } from "@/lib/utils";

type OrderStatus = "Active" | "Inactive";

interface DashboardCard {
    title: string;
    value: string | number;
    change: string;
}

interface Order {
    id: string;
    name: string;
    email: string;
    status: OrderStatus;
    registrationDate: string;
    transactionAmount: string;
    senderName: string;
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
}

const DASHBOARD_CARDS: DashboardCard[] = [
    {
        title: "Total Shipments",
        value: "0",
        change: "0% from last month"
    },
    {
        title: "Revenue generated",
        value: "$0",
        change: "0% from last month"
    },
    {
        title: "Pending Orders",
        value: "0",
        change: "0% from last month"
    },
    {
        title: "Active users",
        value: "0",
        change: "0% from last month"
    },
    {
        title: "New users",
        value: "0",
        change: "0% from last month"
    }
];

const RECENT_ORDERS: Order[] = [];

const SHIPMENTS: Shipment[] = [];

const COURIER_LOAD: Shipment[] = [];

const COURIER_STATUS: Shipment[] = [];

const getStatusStyle = (status: string) => {
    const styles = {
        "Booked": "bg-green-100 text-green-800",
        "In-transit": "bg-blue-100 text-blue-800",
        "Pending Pickup": "bg-orange-100 text-orange-800",
        "Delivered": "bg-purple-100 text-purple-800"
    };
    return styles[status as keyof typeof styles] || "bg-gray-100 text-gray-800";
};

const getPaymentStyle = (payment: string) => {
    return payment.includes("COD") ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800";
};

type SortConfig = {
    key: keyof Shipment | null;
    direction: 'asc' | 'desc' | null;
};

const ShipmentsTable = ({ data }: { data: Shipment[] }) => {

    const [sortConfig, setSortConfig] = useState<SortConfig>({
        key: null,
        direction: null,
    });

    const handleSort = (key: keyof Shipment) => {
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
            if (a[sortConfig.key!] < b[sortConfig.key!]) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (a[sortConfig.key!] > b[sortConfig.key!]) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    };

    const getSortIcon = (key: keyof Shipment) => {
        return <ArrowUpDown className="size-3" />;
    };

    const sortedData = getSortedData();

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow className="bg-neutral-100 hover:bg-neutral-100">
                        <TableHead className="min-w-[120px] whitespace-nowrap">
                            <div
                                className="flex items-center gap-1 cursor-pointer"
                                onClick={() => handleSort('orderId')}
                            >
                                Order ID
                                {getSortIcon('orderId')}
                            </div>
                        </TableHead>
                        <TableHead className="min-w-[100px] whitespace-nowrap">
                            <div
                                className="flex items-center gap-1 cursor-pointer"
                                onClick={() => handleSort('date')}
                            >
                                Date
                                {getSortIcon('date')}
                            </div>
                        </TableHead>
                        <TableHead className="min-w-[120px] whitespace-nowrap">
                            <div
                                className="flex items-center gap-1 cursor-pointer"
                                onClick={() => handleSort('seller')}
                            >
                                Seller
                                {getSortIcon('seller')}
                            </div>
                        </TableHead>
                        <TableHead className="min-w-[150px] whitespace-nowrap">
                            <div
                                className="flex items-center gap-1 cursor-pointer"
                                onClick={() => handleSort('product')}
                            >
                                Product
                                {getSortIcon('product')}
                            </div>
                        </TableHead>
                        <TableHead className="min-w-[80px] whitespace-nowrap">
                            <div
                                className="flex items-center gap-1 cursor-pointer"
                                onClick={() => handleSort('weight')}
                            >
                                Weight
                                {getSortIcon('weight')}
                            </div>
                        </TableHead>
                        <TableHead className="min-w-[120px] whitespace-nowrap">
                            <div
                                className="flex items-center gap-1 cursor-pointer"
                                onClick={() => handleSort('payment')}
                            >
                                Payment
                                {getSortIcon('payment')}
                            </div>
                        </TableHead>
                        <TableHead className="min-w-[120px] whitespace-nowrap">
                            <div
                                className="flex items-center gap-1 cursor-pointer"
                                onClick={() => handleSort('customer')}
                            >
                                Customer
                                {getSortIcon('customer')}
                            </div>
                        </TableHead>
                        <TableHead className="min-w-[180px] whitespace-nowrap">
                            <div
                                className="flex items-center gap-1 cursor-pointer"
                                onClick={() => handleSort('carrier')}
                            >
                                Carrier
                                {getSortIcon('carrier')}
                            </div>
                        </TableHead>
                        <TableHead className="min-w-[100px] whitespace-nowrap">
                            <div
                                className="flex items-center gap-1 cursor-pointer"
                                onClick={() => handleSort('status')}
                            >
                                Status
                                {getSortIcon('status')}
                            </div>
                        </TableHead>
                        <TableHead className="min-w-[90px] whitespace-nowrap">
                            <div
                                className="flex items-center gap-1 cursor-pointer"
                                onClick={() => handleSort('fulfilled')}
                            >
                                Fulfilled
                                {getSortIcon('fulfilled')}
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
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStyle(shipment.payment)}`}>
                                    {shipment.payment}
                                </span>
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

const AdminDashboardPage = () => {

    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(2024, 0, 20),
        to: new Date(2024, 1, 7),
    });

    const [sortConfig, setSortConfig] = useState<{
        key: keyof Order | null;
        direction: 'asc' | 'desc' | null;
    }>({
        key: null,
        direction: null,
    });

    const handleSort = (key: keyof Order) => {
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

    const getSortedOrders = () => {
        if (!sortConfig.key || !sortConfig.direction) return RECENT_ORDERS;

        return [...RECENT_ORDERS].sort((a, b) => {
            if (a[sortConfig.key!] < b[sortConfig.key!]) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (a[sortConfig.key!] > b[sortConfig.key!]) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    };

    const sortedOrders = getSortedOrders();

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <h1 className="text-xl lg:text-2xl font-semibold">
                    Dashboard
                </h1>
                <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                    <DateRangePicker date={date} setDate={setDate} className="w-20 md:w-auto" />
                    <Button variant="outline" className="w-full md:w-auto">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                    </Button>
                </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {DASHBOARD_CARDS.map((card) => (
                    <div
                        key={card.title}
                        className="p-4 rounded-lg bg-neutral-200 space-y-2"
                    >
                        <h3 className="text-base lg:text-lg font-medium">
                            {card.title}
                        </h3>
                        <p className="text-2xl lg:text-3xl font-bold">
                            {card.value}
                        </p>
                        <p className="text-main text-sm">
                            {card.change}
                        </p>
                    </div>
                ))}
            </div>

            {/* Tables Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <div className="space-y-4 w-full">
                    <h2 className="text-lg lg:text-xl font-semibold">
                        Recent Orders
                    </h2>
                    <div className="border rounded-lg">
                        <div className="max-h-[400px] overflow-auto">
                            <Table>
                                <TableHeader className="bg-neutral-100 sticky top-0">
                                    <TableRow>
                                        <TableHead>
                                            <div
                                                className="flex items-center gap-1 cursor-pointer min-w-[100px] whitespace-nowrap"
                                                onClick={() => handleSort('id')}
                                            >
                                                User ID
                                                <ArrowUpDown className="size-3" />
                                            </div>
                                        </TableHead>
                                        <TableHead>
                                            <div
                                                className="flex items-center gap-1 cursor-pointer min-w-[150px] whitespace-nowrap"
                                                onClick={() => handleSort('name')}
                                            >
                                                Name
                                                <ArrowUpDown className="size-3" />
                                            </div>
                                        </TableHead>
                                        <TableHead>
                                            <div
                                                className="flex items-center gap-1 cursor-pointer min-w-[200px] whitespace-nowrap"
                                                onClick={() => handleSort('email')}
                                            >
                                                Email
                                                <ArrowUpDown className="size-3" />
                                            </div>
                                        </TableHead>
                                        <TableHead>
                                            <div
                                                className="flex items-center gap-1 cursor-pointer min-w-[150px] whitespace-nowrap"
                                                onClick={() => handleSort('senderName')}
                                            >
                                                Sender's Name
                                                <ArrowUpDown className="size-3" />
                                            </div>
                                        </TableHead>
                                        <TableHead>
                                            <div
                                                className="flex items-center gap-1 cursor-pointer min-w-[100px] whitespace-nowrap"
                                                onClick={() => handleSort('status')}
                                            >
                                                Status
                                                <ArrowUpDown className="size-3" />
                                            </div>
                                        </TableHead>
                                        <TableHead>
                                            <div
                                                className="flex items-center gap-1 cursor-pointer min-w-[150px] whitespace-nowrap"
                                                onClick={() => handleSort('registrationDate')}
                                            >
                                                Registration Date
                                                <ArrowUpDown className="size-3" />
                                            </div>
                                        </TableHead>
                                        <TableHead>
                                            <div
                                                className="flex items-center gap-1 cursor-pointer min-w-[150px] whitespace-nowrap"
                                                onClick={() => handleSort('transactionAmount')}
                                            >
                                                Transaction Amount
                                                <ArrowUpDown className="size-3" />
                                            </div>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sortedOrders.map((order) => (
                                        <TableRow key={order.id} className="hover:bg-neutral-50">
                                            <TableCell className="min-w-[100px] whitespace-nowrap">
                                                <Link
                                                    to={`/admin/dashboard/orders/${order.id}`}
                                                    className="text-purple-600 hover:underline font-medium"
                                                >
                                                    {order.id}
                                                </Link>
                                            </TableCell>
                                            <TableCell className="min-w-[150px] whitespace-nowrap">
                                                {order.name}
                                            </TableCell>
                                            <TableCell className="min-w-[200px] whitespace-nowrap">
                                                {order.email}
                                            </TableCell>
                                            <TableCell className="min-w-[150px] whitespace-nowrap">
                                                {order.senderName}
                                            </TableCell>
                                            <TableCell className="min-w-[100px] whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <div className={cn(
                                                        "w-2 h-2 rounded-full",
                                                        order.status === "Active" ? "bg-green-500" : "bg-neutral-400"
                                                    )} />
                                                    <span className={cn(
                                                        "px-2 py-1 rounded-md text-sm",
                                                        getStatusStyle(order.status)
                                                    )}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="min-w-[150px] whitespace-nowrap">
                                                {order.registrationDate}
                                            </TableCell>
                                            <TableCell className="min-w-[150px] whitespace-nowrap">
                                                {order.transactionAmount}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>

                {/* Shipments */}
                <div className="space-y-4 w-full overflow-hidden">
                    <h2 className="text-lg lg:text-xl font-semibold">
                        Shipments
                    </h2>
                    <div className="w-full overflow-x-auto">
                        <div className="min-w-full">
                            <ShipmentsTable data={SHIPMENTS} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Second Tables Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Courier Wise Load */}
                <div className="space-y-4 w-full overflow-hidden">
                    <h2 className="text-lg lg:text-xl font-semibold">
                        Courier Wise Load
                    </h2>
                    <div className="border rounded-lg overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-neutral-100">
                                <TableRow>
                                    <TableHead className="whitespace-nowrap">Seller ID</TableHead>
                                    <TableHead className="whitespace-nowrap">Seller</TableHead>
                                    <TableHead className="whitespace-nowrap">Orders</TableHead>
                                    <TableHead className="whitespace-nowrap">Booked</TableHead>
                                    <TableHead className="whitespace-nowrap">Fulfilled</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {COURIER_LOAD.map((item, index) => (
                                    <TableRow key={`${item.orderId}-${index}`}>
                                        <TableCell className="whitespace-nowrap">{item.orderId}</TableCell>
                                        <TableCell className="whitespace-nowrap">{item.seller}</TableCell>
                                        <TableCell className="whitespace-nowrap">{item.product}</TableCell>
                                        <TableCell className="whitespace-nowrap">{item.weight}</TableCell>
                                        <TableCell className="whitespace-nowrap">{item.fulfilled}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* Courier Wise Status */}
                <div className="space-y-4 w-full overflow-hidden">
                    <h2 className="text-lg lg:text-xl font-semibold">
                        Courier Wise Status
                    </h2>
                    <div className="border rounded-lg overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-neutral-100">
                                <TableRow>
                                    <TableHead className="whitespace-nowrap">Seller ID</TableHead>
                                    <TableHead className="whitespace-nowrap">Seller</TableHead>
                                    <TableHead className="whitespace-nowrap">Orders</TableHead>
                                    <TableHead className="whitespace-nowrap">Booked</TableHead>
                                    <TableHead className="whitespace-nowrap">Fulfilled</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {COURIER_STATUS.map((item, index) => (
                                    <TableRow key={`${item.orderId}-${index}`}>
                                        <TableCell className="whitespace-nowrap">{item.orderId}</TableCell>
                                        <TableCell className="whitespace-nowrap">{item.seller}</TableCell>
                                        <TableCell className="whitespace-nowrap">{item.product}</TableCell>
                                        <TableCell className="whitespace-nowrap">{item.weight}</TableCell>
                                        <TableCell className="whitespace-nowrap">{item.fulfilled}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage; 