import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Label, Pie, PieChart, XAxis } from "recharts";

const pieChartData = [
    { browser: "chrome", visitors: 0, fill: "hsl(var(--chart-1))" },
    { browser: "safari", visitors: 0, fill: "hsl(var(--chart-2))" },
    { browser: "firefox", visitors: 0, fill: "hsl(var(--chart-3))" },
    { browser: "edge", visitors: 0, fill: "hsl(var(--chart-4))" },
    { browser: "other", visitors: 0, fill: "hsl(var(--chart-5))" },
];

const barChartData = [
    { month: "January", desktop: 0, mobile: 0 },
    { month: "February", desktop: 0, mobile: 0 },
    { month: "March", desktop: 0, mobile: 0 },
    { month: "April", desktop: 0, mobile: 0 },
    { month: "May", desktop: 0, mobile: 0 },
    { month: "June", desktop: 0, mobile: 0 },
];

const pieChartConfig = {
    visitors: { label: "Visitors" },
    chrome: { label: "Chrome", color: "hsl(var(--chart-1))" },
    safari: { label: "Safari", color: "hsl(var(--chart-2))" },
    firefox: { label: "Firefox", color: "hsl(var(--chart-3))" },
    edge: { label: "Edge", color: "hsl(var(--chart-4))" },
    other: { label: "Other", color: "hsl(var(--chart-5))" },
} as const;

const barChartConfig = {
    desktop: {
        label: "Desktop",
        color: "hsl(var(--chart-1))",
    },
    mobile: {
        label: "Mobile",
        color: "hsl(var(--chart-2))",
    },
} as const;

const ReportsOverview = () => {
    const totalVisitors = pieChartData.reduce((acc, curr) => acc + curr.visitors, 0);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Shipments Card */}
            <Card className="h-full flex-1 flex flex-col">
                <CardHeader>
                    <CardTitle>
                        Total Shipments
                    </CardTitle>
                    <CardDescription>
                        Last 30 days
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 mt-auto flex flex-col justify-end">
                    <div className="text-3xl font-semibold">
                        0
                    </div>
                    <p className="text-main mt-2">
                        0% from last month
                    </p>
                </CardContent>
            </Card>

            {/* Progress Card */}
            <Card className="h-full flex-1 flex flex-col">
                <CardHeader>
                    <CardTitle>
                        Delivery Status
                    </CardTitle>
                    <CardDescription>
                        Current month progress
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 flex-1 mt-auto flex flex-col justify-end">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Delivered</span>
                            <span>0%</span>
                        </div>
                        <Progress value={0} className="h-2" />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>In Transit</span>
                            <span>0%</span>
                        </div>
                        <Progress value={0} className="h-2" />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Pending</span>
                            <span>0%</span>
                        </div>
                        <Progress value={0} className="h-2" />
                    </div>
                </CardContent>
            </Card>

            {/* Pie Chart Card */}
            <Card className="flex flex-col flex-1">
                <CardHeader className="pb-0">
                    <CardTitle>
                        Courier Distribution
                    </CardTitle>
                    <CardDescription>
                        January - June 2024
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 pb-0">
                    <ChartContainer
                        config={pieChartConfig}
                        className="mx-auto aspect-square max-h-[200px]"
                    >
                        <PieChart>
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Pie
                                data={pieChartData}
                                dataKey="visitors"
                                nameKey="browser"
                                innerRadius={45}
                                strokeWidth={8}
                            >
                                <Label
                                    content={({ viewBox }) => {
                                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                            return (
                                                <text
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    textAnchor="middle"
                                                    dominantBaseline="middle"
                                                >
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={viewBox.cy}
                                                        className="fill-foreground text-2xl font-semibold"
                                                    >
                                                        {totalVisitors.toLocaleString()}
                                                    </tspan>
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={(viewBox.cy || 0) + 24}
                                                        className="fill-muted-foreground"
                                                    >
                                                        Users
                                                    </tspan>
                                                </text>
                                            );
                                        }
                                    }}
                                />
                            </Pie>
                        </PieChart>
                    </ChartContainer>
                </CardContent>
                <CardFooter className="flex-col gap-2 text-sm">
                    <div className="flex items-center gap-2 font-medium leading-none">
                        No change this month
                        <TrendingUp className="h-4 w-4" />
                    </div>
                </CardFooter>
            </Card>

            {/* Bar Chart Card */}
            <Card className="h-full flex-1 flex flex-col">
                <CardHeader>
                    <CardTitle>
                        Delivery Performance
                    </CardTitle>
                    <CardDescription>
                        January - June 2024
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 mt-auto flex flex-col justify-end">
                    <ChartContainer config={barChartConfig}>
                        <BarChart data={barChartData}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="month"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) => value.slice(0, 3)}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent indicator="dashed" />}
                            />
                            <Bar
                                dataKey="desktop"
                                fill="hsl(var(--chart-1))"
                                radius={4}
                            />
                            <Bar
                                dataKey="mobile"
                                fill="hsl(var(--chart-2))"
                                radius={4}
                            />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
                <CardFooter className="flex-col items-start gap-2 text-sm">
                    <div className="flex gap-2 font-medium leading-none">
                        No change this month
                        <TrendingUp className="h-4 w-4" />
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default ReportsOverview; 