import DateRangePicker from "@/components/admin/date-range-picker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown, Download } from "lucide-react";
import { useState } from "react";
import { DateRange } from "react-day-picker";

interface DashboardCard {
    title: string;
    value: string | number;
    change: string;
}

const DASHBOARD_CARDS: DashboardCard[] = [
    {
        title: "Total Customers",
        value: "0",
        change: "0% from last month"
    },
    {
        title: "Active Customers",
        value: "0",
        change: "0% from last month"
    },
    {
        title: "New Customers",
        value: "0",
        change: "0% from last month"
    },
    {
        title: "Customer Retention",
        value: "0%",
        change: "0% from last month"
    }
];

interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    orders: number;
    totalSpent: string;
    lastOrder: string;
    status: string;
}

const CUSTOMERS: Customer[] = [];

const getStatusStyle = (status: string) => {
    switch (status) {
        case "Active":
            return "bg-green-100 text-green-800";
        case "Inactive":
            return "bg-red-100 text-red-800";
        case "New":
            return "bg-blue-100 text-blue-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
};

const CustomersTable = ({ data }: { data: Customer[] }) => {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow className="bg-[#F4F2FF] hover:bg-[#F4F2FF]">
                        <TableHead className="min-w-[100px] whitespace-nowrap text-black">
                            <div className="flex items-center gap-1 cursor-pointer">
                                Customer ID
                                <ArrowUpDown className="size-3" />
                            </div>
                        </TableHead>
                        <TableHead className="min-w-[150px] whitespace-nowrap text-black">
                            <div className="flex items-center gap-1 cursor-pointer">
                                Name
                                <ArrowUpDown className="size-3" />
                            </div>
                        </TableHead>
                        <TableHead className="min-w-[200px] whitespace-nowrap text-black">
                            <div className="flex items-center gap-1 cursor-pointer">
                                Email
                                <ArrowUpDown className="size-3" />
                            </div>
                        </TableHead>
                        <TableHead className="min-w-[150px] whitespace-nowrap text-black">
                            <div className="flex items-center gap-1 cursor-pointer">
                                Phone
                                <ArrowUpDown className="size-3" />
                            </div>
                        </TableHead>
                        <TableHead className="min-w-[100px] whitespace-nowrap text-black">
                            <div className="flex items-center gap-1 cursor-pointer">
                                Orders
                                <ArrowUpDown className="size-3" />
                            </div>
                        </TableHead>
                        <TableHead className="min-w-[120px] whitespace-nowrap text-black">
                            <div className="flex items-center gap-1 cursor-pointer">
                                Total Spent
                                <ArrowUpDown className="size-3" />
                            </div>
                        </TableHead>
                        <TableHead className="min-w-[120px] whitespace-nowrap text-black">
                            <div className="flex items-center gap-1 cursor-pointer">
                                Last Order
                                <ArrowUpDown className="size-3" />
                            </div>
                        </TableHead>
                        <TableHead className="min-w-[100px] whitespace-nowrap text-black">
                            <div className="flex items-center gap-1 cursor-pointer">
                                Status
                                <ArrowUpDown className="size-3" />
                            </div>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((customer) => (
                        <TableRow key={customer.id}>
                            <TableCell className="font-medium">
                                {customer.id}
                            </TableCell>
                            <TableCell>
                                {customer.name}
                            </TableCell>
                            <TableCell>
                                {customer.email}
                            </TableCell>
                            <TableCell>
                                {customer.phone}
                            </TableCell>
                            <TableCell>
                                {customer.orders}
                            </TableCell>
                            <TableCell>
                                {customer.totalSpent}
                            </TableCell>
                            <TableCell>
                                {customer.lastOrder}
                            </TableCell>
                            <TableCell>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(customer.status)}`}>
                                    {customer.status}
                                </span>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

const AdminCustomerDashboardPage = () => {

    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(2024, 0, 1),
        to: new Date(2024, 1, 7),
    });

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <h1 className="text-xl lg:text-2xl font-semibold">
                    Customer Dashboard
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {DASHBOARD_CARDS.map((card) => (
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

            {/* Recent Customers */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Recent Customers</h2>
                    <Button variant="link" className="text-main">View All</Button>
                </div>
                <CustomersTable data={CUSTOMERS} />
            </div>
        </div>
    );
};

export default AdminCustomerDashboardPage; 