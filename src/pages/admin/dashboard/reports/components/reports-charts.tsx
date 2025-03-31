import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Download, TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, Cell, Label, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { DateRange } from "react-day-picker";

type TimeFilter = "1D" | "1W" | "1M" | "3M" | "1Y" | "ALL";

const getFilteredRevenueData = (filter: TimeFilter, dateRange?: DateRange) => {
    let result;

    switch (filter) {
        case "1D":
            result = [
                { time: "12 AM", revenue: 0 },
                { time: "4 AM", revenue: 0 },
                { time: "8 AM", revenue: 0 },
                { time: "12 PM", revenue: 0 },
                { time: "4 PM", revenue: 0 },
                { time: "8 PM", revenue: 0 }
            ];
            break;
        case "1W":
            result = [
                { time: "Mon", revenue: 0 },
                { time: "Tue", revenue: 0 },
                { time: "Wed", revenue: 0 },
                { time: "Thu", revenue: 0 },
                { time: "Fri", revenue: 0 },
                { time: "Sat", revenue: 0 },
                { time: "Sun", revenue: 0 }
            ];
            break;
        case "1M":
            result = [
                { time: "Week 1", revenue: 0 },
                { time: "Week 2", revenue: 0 },
                { time: "Week 3", revenue: 0 },
                { time: "Week 4", revenue: 0 }
            ];
            break;
        case "3M":
            result = [
                { time: "Month 1", revenue: 0 },
                { time: "Month 2", revenue: 0 },
                { time: "Month 3", revenue: 0 }
            ];
            break;
        case "1Y":
            result = [
                { time: "Q1", revenue: 0 },
                { time: "Q2", revenue: 0 },
                { time: "Q3", revenue: 0 },
                { time: "Q4", revenue: 0 }
            ];
            break;
        default:
            result = [
                { time: "2020", revenue: 0 },
                { time: "2021", revenue: 0 },
                { time: "2022", revenue: 0 },
                { time: "2023", revenue: 0 },
                { time: "2024", revenue: 0 }
            ];
    }

    return result;
};

const getFilteredDeliveryData = (filter: TimeFilter, dateRange?: DateRange) => {
    let result;

    switch (filter) {
        case "1D":
            result = [
                { name: "Bluedart", value: 0, fill: "#8D79F6" },
                { name: "Delhivery", value: 0, fill: "#4FBAF0" },
                { name: "DTDC", value: 0, fill: "#FEBD38" },
                { name: "Ekart", value: 0, fill: "#FF6B6B" }
            ];
            break;
        case "1W":
            result = [
                { name: "Bluedart", value: 0, fill: "#8D79F6" },
                { name: "Delhivery", value: 0, fill: "#4FBAF0" },
                { name: "DTDC", value: 0, fill: "#FEBD38" },
                { name: "Ekart", value: 0, fill: "#FF6B6B" }
            ];
            break;
        case "1M":
            result = [
                { name: "Bluedart", value: 0, fill: "#8D79F6" },
                { name: "Delhivery", value: 0, fill: "#4FBAF0" },
                { name: "DTDC", value: 0, fill: "#FEBD38" },
                { name: "Ekart", value: 0, fill: "#FF6B6B" }
            ];
            break;
        case "3M":
            result = [
                { name: "Bluedart", value: 0, fill: "#8D79F6" },
                { name: "Delhivery", value: 0, fill: "#4FBAF0" },
                { name: "DTDC", value: 0, fill: "#FEBD38" },
                { name: "Ekart", value: 0, fill: "#FF6B6B" }
            ];
            break;
        case "1Y":
            result = [
                { name: "Bluedart", value: 0, fill: "#8D79F6" },
                { name: "Delhivery", value: 0, fill: "#4FBAF0" },
                { name: "DTDC", value: 0, fill: "#FEBD38" },
                { name: "Ekart", value: 0, fill: "#FF6B6B" }
            ];
            break;
        default:
            result = [
                { name: "Bluedart", value: 0, fill: "#8D79F6" },
                { name: "Delhivery", value: 0, fill: "#4FBAF0" },
                { name: "DTDC", value: 0, fill: "#FEBD38" },
                { name: "Ekart", value: 0, fill: "#FF6B6B" }
            ];
    }

    return result;
};

const getDateRangeTitle = (dateRange?: DateRange) => {
    if (!dateRange?.from || !dateRange?.to) return "This Month's";

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    const fromMonth = monthNames[dateRange.from.getMonth()];
    const toMonth = monthNames[dateRange.to.getMonth()];

    if (fromMonth === toMonth && dateRange.from.getFullYear() === dateRange.to.getFullYear()) {
        return `${fromMonth}'s`;
    }

    return `${fromMonth}-${toMonth}'s`;
};

const getDateRangeDescription = (dateRange?: DateRange) => {
    if (!dateRange?.from || !dateRange?.to) return "Revenue growth over time";

    return `Revenue from ${dateRange.from.toLocaleDateString()} to ${dateRange.to.toLocaleDateString()}`;
};

const pieChartConfig = {
    value: { label: "Share" },
    Bluedart: { label: "Bluedart", color: "#8D79F6" },
    Delhivery: { label: "Delhivery", color: "#4FBAF0" },
    DTDC: { label: "DTDC", color: "#FEBD38" },
    Ekart: { label: "Ekart", color: "#FF6B6B" },
};

interface ReportsChartsProps {
    date?: DateRange;
}

const ReportsCharts = ({ date }: ReportsChartsProps) => {
    // Use "1M" as the default filter
    const defaultFilter = "1M";

    const revenueData = getFilteredRevenueData(defaultFilter, date);
    const deliveryData = getFilteredDeliveryData(defaultFilter, date);

    const totalValue = deliveryData.reduce((acc, curr) => acc + curr.value, 0);

    return (
        <div className="space-y-6">
            <h2 className="text-lg lg:text-xl font-semibold">
                Performance Charts
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Trends Chart */}
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle>
                            {getDateRangeTitle(date)} Revenue Trends
                        </CardTitle>
                        <CardDescription>
                            {getDateRangeDescription(date)}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer
                            config={{
                                revenue: {
                                    label: "Revenue",
                                    color: "#8D79F6"
                                }
                            }}
                            className="min-h-[300px]"
                        >
                            <AreaChart
                                data={revenueData}
                                margin={{
                                    left: 12,
                                    right: 12,
                                }}
                            >
                                <defs>
                                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8D79F6" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#8D79F6" stopOpacity={0.1} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="time"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tickMargin={10}
                                    tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
                                />
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent />}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#8D79F6"
                                    fill="url(#revenueGradient)"
                                    fillOpacity={1}
                                />
                            </AreaChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                {/* Delivery Partners Share Chart */}
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle>
                            {getDateRangeTitle(date)} Delivery Partners Share
                        </CardTitle>
                        <CardDescription>
                            Distribution from {date?.from?.toLocaleDateString() || "start"} to {date?.to?.toLocaleDateString() || "end"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center">
                        <div className="w-full h-[250px] flex items-center justify-center">
                            <ChartContainer
                                config={pieChartConfig}
                                className="w-full h-full"
                            >
                                <PieChart>
                                    <Pie
                                        data={deliveryData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={100}
                                        paddingAngle={2}
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        labelLine={false}
                                    >
                                        {deliveryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ChartContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Critical Insight */}
            <div className="bg-[#0058AA1A] p-4 lg:p-6 rounded-lg">
                <h2 className="text-xl font-semibold">
                    Critical Insight
                </h2>
                <p className="text-lg mt-2">
                    Delivery delays increased by 20% this week.
                </p>
            </div>

            {/* Export Buttons */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <Button variant="primary" className="bg-[#0058AA1A] text-black hover:bg-[#b9d6f1]">
                    Export as CSV
                </Button>
                <Button variant="primary">
                    Export as PDF
                </Button>
            </div>
        </div>
    );
};

export default ReportsCharts; 