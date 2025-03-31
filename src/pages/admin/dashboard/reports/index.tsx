import DateRangePicker from "@/components/admin/date-range-picker";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import ReportsCharts from "./components/reports-charts";
import ReportsOverview from "./components/reports-overview";
import ReportsTable from "./components/reports-table";

const AdminReportsPage = () => {
    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(2024, 0, 20),
        to: new Date(2024, 1, 7),
    });

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <h1 className="text-xl lg:text-2xl font-semibold">
                    Reports & Analytics
                </h1>
                <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                    <DateRangePicker date={date} setDate={setDate} className="w-20 md:w-auto" />
                    <Button variant="outline" className="w-full md:w-auto">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                    </Button>
                </div>
            </div>

            {/* Overview Cards */}
            <ReportsOverview />

            {/* Reports Table */}
            <ReportsTable />

            {/* Charts Section */}
            <ReportsCharts date={date} />
        </div>
    );
};

export default AdminReportsPage;
