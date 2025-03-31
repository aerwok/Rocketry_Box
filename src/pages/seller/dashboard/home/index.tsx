import StatCard from "@/components/seller/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, Box, IndianRupee, Package, TrendingUp, Truck, Download } from "lucide-react";
import { useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import DateRangePicker from "@/components/admin/date-range-picker";
import { DateRange } from "react-day-picker";

const pieData = [
    { name: "Delivered", value: 73, fill: "#8D79F6" },
    { name: "In Transit", value: 15, fill: "#FEBD38" },
    { name: "Pending", value: 12, fill: "#4FBAF0" },
];

const lineData = [
    { month: "Jan", value: 1000 },
    { month: "Feb", value: 2000 },
    { month: "Mar", value: 1500 },
    { month: "Apr", value: 3000 },
    { month: "May", value: 2500 },
    { month: "Jun", value: 4000 },
    { month: "Jul", value: 3500 },
];

const chartConfig = {
    current: {
        label: "Current Week",
        color: "#8D79F6",
    },
    previous: {
        label: "Previous Week",
        color: "#B09FFF",
    },
} satisfies ChartConfig;

const pieChartConfig = {
    delivered: {
        label: "Delivered",
        color: "#8D79F6",
    },
    inTransit: {
        label: "In Transit",
        color: "#FEBD38",
    },
    pending: {
        label: "Pending",
        color: "#4FBAF0",
    },
} satisfies ChartConfig;

const lineChartConfig = {
    value: {
        label: "Revenue",
        color: "#B09FFF",
    },
} satisfies ChartConfig;

const courierData = [
    {
        courier: "Amazon",
        total: 0,
        notShipped: 0,
        pendingPickup: 0,
        inTransit: 0,
        ofd: 0,
        delivered: { count: 0, percentage: "0.0%" },
        cancelled: { count: 0, percentage: "0.0%" },
        exception: { count: 0, percentage: "0.0%" },
        rto: 0,
        lostDamage: 0,
    },
    {
        courier: "Bluedart",
        total: 0,
        notShipped: 0,
        pendingPickup: 0,
        inTransit: 0,
        ofd: 0,
        delivered: { count: 0, percentage: "0.0%" },
        cancelled: { count: 0, percentage: "0.0%" },
        exception: { count: 0, percentage: "0.0%" },
        rto: 0,
        lostDamage: 0,
    },
    {
        courier: "Delhivery",
        total: 0,
        notShipped: 0,
        pendingPickup: 0,
        inTransit: 0,
        ofd: 0,
        delivered: { count: 0, percentage: "0.0%" },
        cancelled: { count: 0, percentage: "0.0%" },
        exception: { count: 0, percentage: "0.0%" },
        rto: 0,
        lostDamage: 0,
    },
    {
        courier: "DTDC",
        total: 0,
        notShipped: 0,
        pendingPickup: 0,
        inTransit: 0,
        ofd: 0,
        delivered: { count: 0, percentage: "0.0%" },
        cancelled: { count: 0, percentage: "0.0%" },
        exception: { count: 0, percentage: "0.0%" },
        rto: 0,
        lostDamage: 0,
    },
    {
        courier: "EcomExpress",
        total: 0,
        notShipped: 0,
        pendingPickup: 0,
        inTransit: 0,
        ofd: 0,
        delivered: { count: 0, percentage: "0.0%" },
        cancelled: { count: 0, percentage: "0.0%" },
        exception: { count: 0, percentage: "0.0%" },
        rto: 0,
        lostDamage: 0,
    },
    {
        courier: "Ekart",
        total: 0,
        notShipped: 0,
        pendingPickup: 0,
        inTransit: 0,
        ofd: 0,
        delivered: { count: 0, percentage: "0.0%" },
        cancelled: { count: 0, percentage: "0.0%" },
        exception: { count: 0, percentage: "0.0%" },
        rto: 0,
        lostDamage: 0,
    },
    {
        courier: "Shadowfax",
        total: 0,
        notShipped: 0,
        pendingPickup: 0,
        inTransit: 0,
        ofd: 0,
        delivered: { count: 0, percentage: "0.0%" },
        cancelled: { count: 0, percentage: "0.0%" },
        exception: { count: 0, percentage: "0.0%" },
        rto: 0,
        lostDamage: 0,
    },
    {
        courier: "Smartr",
        total: 0,
        notShipped: 0,
        pendingPickup: 0,
        inTransit: 0,
        ofd: 0,
        delivered: { count: 0, percentage: "0.0%" },
        cancelled: { count: 0, percentage: "0.0%" },
        exception: { count: 0, percentage: "0.0%" },
        rto: 0,
        lostDamage: 0,
    },
    {
        courier: "Xpressbees",
        total: 0,
        notShipped: 0,
        pendingPickup: 0,
        inTransit: 0,
        ofd: 0,
        delivered: { count: 0, percentage: "0.0%" },
        cancelled: { count: 0, percentage: "0.0%" },
        exception: { count: 0, percentage: "0.0%" },
        rto: 0,
        lostDamage: 0,
    },
    {
        courier: "Bluedart+",
        total: 0,
        notShipped: 0,
        pendingPickup: 0,
        inTransit: 0,
        ofd: 0,
        delivered: { count: 0, percentage: "0.0%" },
        cancelled: { count: 0, percentage: "0.0%" },
        exception: { count: 0, percentage: "0.0%" },
        rto: 0,
        lostDamage: 0,
    },
];

const topProductsData = [
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

type TimeFilter = "1D" | "1W" | "1M" | "3M" | "1Y" | "ALL";

const getFilteredData = (filter: TimeFilter, dateRange?: DateRange) => {
    let result;

    switch (filter) {
        case "1D":
            result = {
                barData: [
                    { day: "Today", current: 40, previous: 30 }
                ],
                pieData: [
                    { name: "Delivered", value: 20, fill: "#8D79F6" },
                    { name: "In Transit", value: 5, fill: "#FEBD38" },
                    { name: "Pending", value: 3, fill: "#4FBAF0" }
                ],
                lineData: [{ month: "Today", value: 1000 }],
                topProducts: [
                    { month: "iPhone 15", desktop: 25 },
                    { month: "MacBook Pro", desktop: 20 },
                    { month: "AirPods Pro", desktop: 15 },
                    { month: "iPad Pro", desktop: 12 },
                    { month: "Apple Watch", desktop: 10 }
                ],
                deliveryPerformance: [
                    { month: "Morning", desktop: 75 },
                    { month: "Afternoon", desktop: 82 },
                    { month: "Evening", desktop: 78 },
                    { month: "Night", desktop: 70 }
                ]
            };
            break;
        case "1W":
            result = {
                barData: [
                    { day: "Mon", current: 40, previous: 30 },
                    { day: "Tue", current: 60, previous: 45 },
                    { day: "Wed", current: 80, previous: 65 },
                    { day: "Thu", current: 70, previous: 55 },
                    { day: "Fri", current: 50, previous: 35 },
                    { day: "Sat", current: 75, previous: 60 },
                    { day: "Sun", current: 65, previous: 50 }
                ],
                pieData: [
                    { name: "Delivered", value: 45, fill: "#8D79F6" },
                    { name: "In Transit", value: 10, fill: "#FEBD38" },
                    { name: "Pending", value: 8, fill: "#4FBAF0" }
                ],
                lineData: lineData.slice(-2),
                topProducts: [
                    { month: "iPhone 15", desktop: 120 },
                    { month: "MacBook Pro", desktop: 98 },
                    { month: "AirPods Pro", desktop: 86 },
                    { month: "iPad Pro", desktop: 75 },
                    { month: "Apple Watch", desktop: 64 }
                ],
                deliveryPerformance: [
                    { month: "Mon", desktop: 85 },
                    { month: "Tue", desktop: 75 },
                    { month: "Wed", desktop: 90 },
                    { month: "Thu", desktop: 70 },
                    { month: "Fri", desktop: 85 },
                    { month: "Sat", desktop: 95 },
                    { month: "Sun", desktop: 88 }
                ]
            };
            break;
        case "1M":
            result = {
                barData: [
                    { day: "Week 1", current: 120, previous: 90 },
                    { day: "Week 2", current: 150, previous: 110 },
                    { day: "Week 3", current: 180, previous: 140 },
                    { day: "Week 4", current: 200, previous: 160 }
                ],
                pieData: [
                    { name: "Delivered", value: 73, fill: "#8D79F6" },
                    { name: "In Transit", value: 15, fill: "#FEBD38" },
                    { name: "Pending", value: 12, fill: "#4FBAF0" }
                ],
                lineData: lineData.slice(-3),
                topProducts: [
                    { month: "iPhone 15", desktop: 450 },
                    { month: "MacBook Pro", desktop: 380 },
                    { month: "AirPods Pro", desktop: 320 },
                    { month: "iPad Pro", desktop: 280 },
                    { month: "Apple Watch", desktop: 250 }
                ],
                deliveryPerformance: [
                    { month: "Week 1", desktop: 82 },
                    { month: "Week 2", desktop: 88 },
                    { month: "Week 3", desktop: 85 },
                    { month: "Week 4", desktop: 92 }
                ]
            };
            break;
        case "3M":
            result = {
                barData: [
                    { day: "Month 1", current: 450, previous: 380 },
                    { day: "Month 2", current: 520, previous: 420 },
                    { day: "Month 3", current: 600, previous: 480 }
                ],
                pieData: [
                    { name: "Delivered", value: 85, fill: "#8D79F6" },
                    { name: "In Transit", value: 20, fill: "#FEBD38" },
                    { name: "Pending", value: 15, fill: "#4FBAF0" }
                ],
                lineData: lineData.slice(-4),
                topProducts: [
                    { month: "iPhone 15", desktop: 1200 },
                    { month: "MacBook Pro", desktop: 980 },
                    { month: "AirPods Pro", desktop: 860 },
                    { month: "iPad Pro", desktop: 750 },
                    { month: "Apple Watch", desktop: 640 }
                ],
                deliveryPerformance: [
                    { month: "Month 1", desktop: 85 },
                    { month: "Month 2", desktop: 88 },
                    { month: "Month 3", desktop: 92 }
                ]
            };
            break;
        case "1Y":
            result = {
                barData: [
                    { day: "Q1", current: 1500, previous: 1200 },
                    { day: "Q2", current: 1800, previous: 1400 },
                    { day: "Q3", current: 2100, previous: 1700 },
                    { day: "Q4", current: 2400, previous: 2000 }
                ],
                pieData: [
                    { name: "Delivered", value: 120, fill: "#8D79F6" },
                    { name: "In Transit", value: 30, fill: "#FEBD38" },
                    { name: "Pending", value: 25, fill: "#4FBAF0" }
                ],
                lineData: lineData,
                topProducts: [
                    { month: "iPhone 15", desktop: 4800 },
                    { month: "MacBook Pro", desktop: 3900 },
                    { month: "AirPods Pro", desktop: 3400 },
                    { month: "iPad Pro", desktop: 3000 },
                    { month: "Apple Watch", desktop: 2600 }
                ],
                deliveryPerformance: [
                    { month: "Q1", desktop: 88 },
                    { month: "Q2", desktop: 85 },
                    { month: "Q3", desktop: 92 },
                    { month: "Q4", desktop: 95 }
                ]
            };
            break;
        default:
            result = {
                barData: [
                    { day: "2020", current: 5000, previous: 4000 },
                    { day: "2021", current: 6500, previous: 5200 },
                    { day: "2022", current: 8000, previous: 6500 },
                    { day: "2023", current: 9500, previous: 7800 },
                    { day: "2024", current: 11000, previous: 9000 }
                ],
                pieData,
                lineData,
                topProducts: [
                    { month: "iPhone 15", desktop: 15000 },
                    { month: "MacBook Pro", desktop: 12000 },
                    { month: "AirPods Pro", desktop: 10000 },
                    { month: "iPad Pro", desktop: 8500 },
                    { month: "Apple Watch", desktop: 7000 }
                ],
                deliveryPerformance: [
                    { month: "2020", desktop: 82 },
                    { month: "2021", desktop: 85 },
                    { month: "2022", desktop: 88 },
                    { month: "2023", desktop: 92 },
                    { month: "2024", desktop: 95 }
                ]
            };
    }

    if (dateRange?.from && dateRange?.to) {
        const daysDiff = Math.floor((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24));

        let filterLevel = 0;
        if (daysDiff <= 7) filterLevel = 1;
        else if (daysDiff <= 30) filterLevel = 2;
        else if (daysDiff <= 90) filterLevel = 3;
        else filterLevel = 4;

        result.barData = result.barData.map(item => ({
            ...item,
            current: Math.round(item.current * (0.8 + (filterLevel * 0.1))),
            previous: Math.round(item.previous * (0.8 + (filterLevel * 0.1)))
        }));

        result.pieData = result.pieData.map(item => ({
            ...item,
            value: Math.round(item.value * (0.9 + (filterLevel * 0.05)))
        }));

        result.topProducts = result.topProducts.map(item => ({
            ...item,
            desktop: Math.round(item.desktop * (0.85 + (filterLevel * 0.05)))
        }));

        result.deliveryPerformance = result.deliveryPerformance.map(item => ({
            ...item,
            desktop: Math.min(100, Math.round(item.desktop * (0.95 + (filterLevel * 0.02))))
        }));
    }

    return result;
};

const SellerDashboardPage = () => {
    
    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(2024, 0, 20),
        to: new Date(2024, 1, 7),
    });

    const [bottomDate, setBottomDate] = useState<DateRange | undefined>({
        from: new Date(2024, 0, 1),
        to: new Date(2024, 1, 7),
    });

    const selectedFilter = "1M";
    const bottomChartsFilter = "1M";

    const {
        barData: filteredBarData,
        pieData: filteredPieData,
        lineData: filteredLineData,
    } = getFilteredData(selectedFilter, date);

    const {
        topProducts: filteredTopProducts,
        deliveryPerformance: filteredDeliveryPerformance
    } = getFilteredData(bottomChartsFilter, bottomDate);

    const getBarChartTitle = () => {
        return "Monthly";
    };

    const getBarChartDescription = () => {
        if (date?.from && date?.to) {
            return `Current vs Previous Month (${date.from.toLocaleDateString()} - ${date.to.toLocaleDateString()})`;
        }
        return "Current vs Previous Month";
    };

    const getTopProductsTitle = () => {
        if (bottomDate?.from && bottomDate?.to) {
            const fromMonth = bottomDate.from.toLocaleString('default', { month: 'short' });
            const toMonth = bottomDate.to.toLocaleString('default', { month: 'short' });
            if (fromMonth === toMonth) {
                return `${fromMonth}'s`;
            }
            return `${fromMonth}-${toMonth}`;
        }
        return "This Month's";
    };

    const getDateRangeText = (dateObj?: DateRange) => {
        if (!dateObj?.from || !dateObj?.to) return "1M Overview";

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const fromMonth = monthNames[dateObj.from.getMonth()];
        const toMonth = monthNames[dateObj.to.getMonth()];

        if (fromMonth === toMonth) {
            return `${fromMonth} ${dateObj.from.getFullYear()} Overview`;
        }
        return `${fromMonth}-${toMonth} ${dateObj.from.getFullYear()} Overview`;
    };

    return (
        <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {/* Column 1 */}
                <div>
                    <div className="grid grid-cols-1 gap-2">
                        <div className="grid lg:grid-cols-2 gap-2">
                            <StatCard
                                title="Orders"
                                subtitle="Cancelled not included"
                                value="0"
                                todayValue="0"
                                icon={Package}
                                href="/seller/dashboard/orders"
                            />
                            <StatCard
                                title="Shipments"
                                subtitle="Cancelled not included"
                                value="0"
                                todayValue="0"
                                icon={Truck}
                                href="/seller/dashboard/shipments"
                            />
                        </div>
                    </div>
                </div>

                {/* Column 2 */}
                <div>
                    <div className="grid grid-cols-1 gap-2">
                        <div className="grid lg:grid-cols-2 gap-2">
                            <StatCard
                                title="Delivered"
                                subtitle="Successfully delivered orders"
                                value="0"
                                todayValue="0"
                                icon={Box}
                                href="/seller/dashboard/shipments?tab=delivered"
                            />
                            <StatCard
                                title="Expected COD"
                                subtitle="Pending cash on delivery"
                                value="₹0.00"
                                additionalValue={{
                                    label: "Total Due COD",
                                    value: "₹0.00"
                                }}
                                icon={IndianRupee}
                                href="/seller/dashboard/cod"
                            />
                        </div>
                    </div>
                </div>

                {/* Column 3 */}
                <div>
                    <div className="grid grid-cols-1 gap-2">
                        <div className="grid lg:grid-cols-2 gap-2">
                            <StatCard
                                title="Total Revenue"
                                subtitle="Total of Delivered Shipments"
                                value="₹0.00"
                                additionalValue={{
                                    label: "vs. Yesterday",
                                    value: "14.0%"
                                }}
                                icon={TrendingUp}
                                href="/seller/dashboard/billing?tab=wallet-history"
                            />
                            <StatCard
                                title="Pending NDR"
                                subtitle="Action required + Action requested"
                                value="0"
                                additionalValue={{
                                    label: "Action required",
                                    value: "0"
                                }}
                                icon={AlertTriangle}
                                href="/seller/dashboard/ndr"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="space-y-4">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <h2 className="text-lg lg:text-xl font-semibold">
                        Performance Overview
                    </h2>
                    <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                        <DateRangePicker date={date} setDate={setDate} className="w-20 md:w-auto" />
                        <Button variant="outline" className="w-full md:w-auto">
                            <Download className="mr-2 h-4 w-4" />
                            Download
                        </Button>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Bar Chart */}
                    <Card className="p-2 md:p-4">
                        <CardHeader className="p-2 md:p-4">
                            <CardTitle>
                                {getBarChartTitle()} Shipment Chart
                            </CardTitle>
                            <CardDescription>
                                {getBarChartDescription()}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-2 md:p-4">
                            <ChartContainer config={chartConfig}>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={filteredBarData}>
                                        <defs>
                                            <linearGradient id="previousGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#B09FFF" stopOpacity={0.4} />
                                                <stop offset="100%" stopColor="#8D79F6" stopOpacity={0.4} />
                                            </linearGradient>
                                            <linearGradient id="currentGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#B09FFF" />
                                                <stop offset="100%" stopColor="#8D79F6" />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                                        <XAxis
                                            dataKey="day"
                                            tickLine={false}
                                            tickMargin={10}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tickMargin={10}
                                        />
                                        <ChartTooltip
                                            cursor={false}
                                            content={<ChartTooltipContent indicator="dashed" />}
                                        />
                                        <Bar
                                            dataKey="previous"
                                            fill="url(#previousGradient)"
                                            radius={[4, 4, 0, 0]}
                                        />
                                        <Bar
                                            dataKey="current"
                                            fill="url(#currentGradient)"
                                            radius={[4, 4, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </CardContent>
                        <CardFooter className="flex-col items-start gap-2 text-sm p-2 md:p-4">
                            <div className="flex gap-2 font-medium leading-none">
                                Trending up by 35% this period <TrendingUp className="h-4 w-4" />
                            </div>
                            <div className="leading-none text-muted-foreground">
                                {getBarChartDescription()}
                            </div>
                        </CardFooter>
                    </Card>

                    {/* Pie Chart */}
                    <Card className="flex flex-col p-2 md:p-4">
                        <CardHeader className="items-center pb-0 p-2 md:p-4">
                            <CardTitle>
                                Delivery Growth
                            </CardTitle>
                            <CardDescription>
                                {getDateRangeText(date)}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 pb-0 p-2 md:p-4">
                            <ChartContainer
                                config={pieChartConfig}
                                className="mx-auto aspect-square max-h-[250px]"
                            >
                                <PieChart>
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent hideLabel />}
                                    />
                                    <Pie
                                        data={filteredPieData}
                                        dataKey="value"
                                        nameKey="name"
                                        innerRadius={60}
                                        outerRadius={80}
                                        fill="#8884d8"
                                    >
                                        {filteredPieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ChartContainer>
                        </CardContent>
                        <CardFooter className="flex-col gap-2 text-sm p-2 md:p-4">
                            <div className="flex items-center gap-2 font-medium leading-none">
                                Delivery success rate up by 8.5% <TrendingUp className="h-4 w-4" />
                            </div>
                            <div className="leading-none text-muted-foreground">
                                Showing delivery status breakdown for selected period
                            </div>
                        </CardFooter>
                    </Card>

                    {/* Line Chart */}
                    <Card className="col-span-1 p-2 md:p-4">
                        <CardHeader className="p-2 md:p-4">
                            <CardTitle>
                                Revenue Report
                            </CardTitle>
                            <CardDescription>
                                {getDateRangeText(date)} revenue
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-2 md:p-4">
                            <ChartContainer config={lineChartConfig}>
                                <ResponsiveContainer width="100%" height={300}>
                                    <AreaChart
                                        data={filteredLineData}
                                        margin={{
                                            left: 12,
                                            right: 12,
                                        }}
                                    >
                                        <defs>
                                            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#B09FFF" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#B09FFF" stopOpacity={0.1} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                                        <XAxis
                                            dataKey="month"
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={8}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tickMargin={10}
                                        />
                                        <ChartTooltip
                                            cursor={false}
                                            content={<ChartTooltipContent />}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="value"
                                            stroke="#B09FFF"
                                            fill="url(#revenueGradient)"
                                            fillOpacity={1}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </CardContent>
                        <CardFooter className="p-2 md:p-4">
                            <div className="flex w-full items-start gap-2 text-sm">
                                <div className="grid gap-2">
                                    <div className="flex items-center gap-2 font-medium leading-none">
                                        Revenue up by 15% <TrendingUp className="h-4 w-4" />
                                    </div>
                                    <div className="leading-none text-muted-foreground">
                                        {date?.from && date?.to
                                            ? `${date.from.toLocaleDateString()} - ${date.to.toLocaleDateString()}`
                                            : "January - July 2024"
                                        }
                                    </div>
                                </div>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </div>

            {/* Courier Wise Details Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-center">
                        Courier Wise Details
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative w-full overflow-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-purple-900 hover:bg-purple-900">
                                    <TableHead className="min-w-[120px] font-medium text-white">
                                        Courier
                                    </TableHead>
                                    <TableHead className="min-w-[80px] font-medium text-white">
                                        Total
                                    </TableHead>
                                    <TableHead className="min-w-[100px] font-medium text-white">
                                        Not Shipped
                                    </TableHead>
                                    <TableHead className="min-w-[120px] font-medium text-white">
                                        Pending Pickup
                                    </TableHead>
                                    <TableHead className="min-w-[100px] font-medium text-white">
                                        In Transit
                                    </TableHead>
                                    <TableHead className="min-w-[80px] font-medium text-white">
                                        OFD
                                    </TableHead>
                                    <TableHead className="min-w-[120px] font-medium text-white">
                                        Delivered
                                    </TableHead>
                                    <TableHead className="min-w-[120px] font-medium text-white">
                                        Cancelled
                                    </TableHead>
                                    <TableHead className="min-w-[120px] font-medium text-white">
                                        Exception
                                    </TableHead>
                                    <TableHead className="min-w-[80px] font-medium text-white">
                                        RTO
                                    </TableHead>
                                    <TableHead className="min-w-[120px] font-medium text-white">
                                        Lost/Damage
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {courierData.map((row) => (
                                    <TableRow key={row.courier}>
                                        <TableCell className="font-medium">
                                            {row.courier}
                                        </TableCell>
                                        <TableCell className="bg-purple-50">
                                            {row.total}
                                        </TableCell>
                                        <TableCell>
                                            {row.notShipped}
                                        </TableCell>
                                        <TableCell className="bg-purple-50">
                                            {row.pendingPickup}
                                        </TableCell>
                                        <TableCell>
                                            {row.inTransit}
                                        </TableCell>
                                        <TableCell className="bg-purple-50">
                                            {row.ofd}
                                        </TableCell>
                                        <TableCell>
                                            {row.delivered.count} {row.delivered.percentage}
                                        </TableCell>
                                        <TableCell className="bg-purple-50">
                                            {row.cancelled.count} {row.cancelled.percentage}
                                        </TableCell>
                                        <TableCell>
                                            {row.exception.count} {row.exception.percentage}
                                        </TableCell>
                                        <TableCell className="bg-purple-50">
                                            {row.rto}
                                        </TableCell>
                                        <TableCell>
                                            {row.lostDamage}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Additional Charts */}
            <div className="space-y-4">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <h2 className="text-lg lg:text-xl font-semibold">
                        Product Analysis
                    </h2>
                    <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                        <DateRangePicker date={bottomDate} setDate={setBottomDate} className="w-20 md:w-auto" />
                        <Button variant="outline" className="w-full md:w-auto">
                            <Download className="mr-2 h-4 w-4" />
                            Download
                        </Button>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Top Products Chart */}
                    <Card className="p-2 md:p-4">
                        <CardHeader className="p-2 md:p-4">
                            <CardTitle>{getTopProductsTitle()} Top 5 Products</CardTitle>
                            <CardDescription>Best performing products</CardDescription>
                        </CardHeader>
                        <CardContent className="p-2 md:p-4">
                            <ChartContainer config={{
                                desktop: {
                                    label: "Sales",
                                    color: "#8D79F6",
                                },
                            }}>
                                <BarChart
                                    data={filteredTopProducts}
                                    accessibilityLayer
                                >
                                    <CartesianGrid vertical={false} />
                                    <XAxis
                                        dataKey="month"
                                        tickLine={false}
                                        tickMargin={10}
                                        axisLine={false}
                                        tickFormatter={(value) => value.slice(0, 15)}
                                    />
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent hideLabel />}
                                    />
                                    <Bar
                                        dataKey="desktop"
                                        fill="var(--color-desktop)"
                                        radius={8}
                                    />
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                        <CardFooter className="flex-col items-start gap-2 text-sm p-2 md:p-4">
                            <div className="flex gap-2 font-medium leading-none">
                                iPhone 15 leads with 450 units <TrendingUp className="h-4 w-4" />
                            </div>
                            <div className="leading-none text-muted-foreground">
                                Showing top 5 products by sales volume
                            </div>
                        </CardFooter>
                    </Card>

                    {/* Delivery Performance Chart */}
                    <Card className="p-2 md:p-4">
                        <CardHeader className="p-2 md:p-4">
                            <CardTitle>Delivery Performance</CardTitle>
                            <CardDescription>{getDateRangeText(bottomDate)} performance</CardDescription>
                        </CardHeader>
                        <CardContent className="p-2 md:p-4">
                            <ChartContainer config={{
                                desktop: {
                                    label: "Deliveries",
                                    color: "#8D79F6"
                                }
                            }}>
                                <LineChart
                                    data={filteredDeliveryPerformance}
                                    accessibilityLayer
                                    margin={{
                                        left: 12,
                                        right: 12,
                                    }}
                                >
                                    <CartesianGrid vertical={false} />
                                    <XAxis
                                        dataKey="month"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                        tickFormatter={(value) => value.length > 3 ? value.slice(0, 3) : value}
                                    />
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent hideLabel />}
                                    />
                                    <Line
                                        dataKey="desktop"
                                        type="natural"
                                        stroke="var(--color-desktop)"
                                        strokeWidth={2}
                                        dot={false}
                                    />
                                </LineChart>
                            </ChartContainer>
                        </CardContent>
                        <CardFooter className="flex-col items-start gap-2 text-sm p-2 md:p-4">
                            <div className="flex gap-2 font-medium leading-none">
                                Performance improved by 18% <TrendingUp className="h-4 w-4" />
                            </div>
                            <div className="leading-none text-muted-foreground">
                                Average delivery performance: 87%
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </div>

            {/* Top 10 Products Status Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-center">
                        Top 10 Products Status
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative w-full overflow-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-purple-900 hover:bg-purple-900">
                                    <TableHead className="min-w-[200px] font-medium text-white">
                                        Product Name
                                    </TableHead>
                                    <TableHead className="min-w-[100px] font-medium text-white">
                                        Quantity
                                    </TableHead>
                                    <TableHead className="min-w-[120px] font-medium text-white">
                                        Total Shipments
                                    </TableHead>
                                    <TableHead className="min-w-[120px] font-medium text-white">
                                        Not Shipped
                                    </TableHead>
                                    <TableHead className="min-w-[100px] font-medium text-white">
                                        Cancelled
                                    </TableHead>
                                    <TableHead className="min-w-[120px] font-medium text-white">
                                        Pending Pickup
                                    </TableHead>
                                    <TableHead className="min-w-[100px] font-medium text-white">
                                        In Transit
                                    </TableHead>
                                    <TableHead className="min-w-[100px] font-medium text-white">
                                        Delivered
                                    </TableHead>
                                    <TableHead className="min-w-[80px] font-medium text-white">
                                        RTO
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {topProductsData.map((product) => (
                                    <TableRow key={product.productName}>
                                        <TableCell className="font-medium">
                                            {product.productName}
                                        </TableCell>
                                        <TableCell className="bg-purple-50">
                                            {product.quantity}
                                        </TableCell>
                                        <TableCell>
                                            {product.totalShipments}
                                        </TableCell>
                                        <TableCell className="bg-purple-50">
                                            {product.notShipped}
                                        </TableCell>
                                        <TableCell>
                                            {product.cancelled}
                                        </TableCell>
                                        <TableCell className="bg-purple-50">
                                            {product.pendingPickup}
                                        </TableCell>
                                        <TableCell>
                                            {product.inTransit}
                                        </TableCell>
                                        <TableCell className="bg-purple-50">
                                            {product.delivered}
                                        </TableCell>
                                        <TableCell>
                                            {product.rto}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SellerDashboardPage; 