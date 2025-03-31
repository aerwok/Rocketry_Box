import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ArrowUpDown, Download } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Invoice {
    invoiceId: string;
    date: string;
    amount: string;
    type: "Shipping" | "Service" | "Other";
    status: "Paid" | "Pending" | "Overdue";
    dueDate: string;
}

const invoiceData: Invoice[] = [
    {
        invoiceId: "INV123456",
        date: "2024-03-20",
        amount: "₹5000",
        type: "Shipping",
        status: "Paid",
        dueDate: "2024-03-27"
    },
    {
        invoiceId: "INV123457",
        date: "2024-03-19",
        amount: "₹3500",
        type: "Service",
        status: "Pending",
        dueDate: "2024-03-26"
    },
    {
        invoiceId: "INV123458",
        date: "2024-03-18",
        amount: "₹7500",
        type: "Shipping",
        status: "Overdue",
        dueDate: "2024-03-25"
    },
    {
        invoiceId: "INV123459",
        date: "2024-03-17",
        amount: "₹2000",
        type: "Other",
        status: "Paid",
        dueDate: "2024-03-24"
    },
    {
        invoiceId: "INV123460",
        date: "2024-03-16",
        amount: "₹4500",
        type: "Service",
        status: "Pending",
        dueDate: "2024-03-23"
    }
];

const Invoices = () => {
    const [sortConfig, setSortConfig] = useState<{
        key: keyof Invoice;
        direction: 'asc' | 'desc';
    } | null>(null);

    const sortedData = [...invoiceData].sort((a, b) => {
        if (!sortConfig) return 0;

        const { key, direction } = sortConfig;
        if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
        if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
        return 0;
    });

    const handleSort = (key: keyof Invoice) => {
        setSortConfig(current => ({
            key,
            direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc',
        }));
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                    Invoice History
                </h2>
                <div className="text-sm text-muted-foreground">
                    Total Outstanding:
                    <span className="font-semibold text-red-600">
                        ₹11,000
                    </span>
                </div>
            </div>

            <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                    <Table>
                        <TableHeader className="bg-[#F4F2FF] h-12">
                            <TableRow className="hover:bg-[#F4F2FF]">
                                <TableHead
                                    onClick={() => handleSort('invoiceId')}
                                    className="cursor-pointer text-black min-w-[140px] whitespace-nowrap"
                                >
                                    Invoice ID
                                    <ArrowUpDown className="inline h-4 w-4 ml-1" />
                                </TableHead>
                                <TableHead
                                    onClick={() => handleSort('date')}
                                    className="cursor-pointer text-black min-w-[100px] whitespace-nowrap"
                                >
                                    Date
                                    <ArrowUpDown className="inline h-4 w-4 ml-1" />
                                </TableHead>
                                <TableHead
                                    onClick={() => handleSort('amount')}
                                    className="cursor-pointer text-black min-w-[100px] whitespace-nowrap"
                                >
                                    Amount
                                    <ArrowUpDown className="inline h-4 w-4 ml-1" />
                                </TableHead>
                                <TableHead
                                    onClick={() => handleSort('type')}
                                    className="cursor-pointer text-black min-w-[100px] whitespace-nowrap"
                                >
                                    Type
                                    <ArrowUpDown className="inline h-4 w-4 ml-1" />
                                </TableHead>
                                <TableHead
                                    onClick={() => handleSort('status')}
                                    className="cursor-pointer text-black min-w-[100px] whitespace-nowrap"
                                >
                                    Status
                                    <ArrowUpDown className="inline h-4 w-4 ml-1" />
                                </TableHead>
                                <TableHead
                                    onClick={() => handleSort('dueDate')}
                                    className="cursor-pointer text-black min-w-[120px] whitespace-nowrap"
                                >
                                    Due Date
                                    <ArrowUpDown className="inline h-4 w-4 ml-1" />
                                </TableHead>
                                <TableHead className="text-black min-w-[80px] whitespace-nowrap">
                                    Action
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedData.map((invoice, index) => (
                                <TableRow key={index} className="h-12">
                                    <TableCell className="min-w-[140px] whitespace-nowrap">
                                        {invoice.invoiceId}
                                    </TableCell>
                                    <TableCell className="min-w-[100px] whitespace-nowrap">
                                        {invoice.date}
                                    </TableCell>
                                    <TableCell className="font-medium min-w-[100px] whitespace-nowrap">
                                        {invoice.amount}
                                    </TableCell>
                                    <TableCell className="min-w-[100px] whitespace-nowrap">
                                        <span className={cn(
                                            "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                                            {
                                                "bg-blue-100 text-blue-800": invoice.type === "Shipping",
                                                "bg-purple-100 text-purple-800": invoice.type === "Service",
                                                "bg-gray-100 text-gray-800": invoice.type === "Other"
                                            }
                                        )}>
                                            {invoice.type}
                                        </span>
                                    </TableCell>
                                    <TableCell className="min-w-[100px] whitespace-nowrap">
                                        <span className={cn(
                                            "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                                            {
                                                "bg-green-100 text-green-800": invoice.status === "Paid",
                                                "bg-yellow-100 text-yellow-800": invoice.status === "Pending",
                                                "bg-red-100 text-red-800": invoice.status === "Overdue"
                                            }
                                        )}>
                                            {invoice.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="min-w-[120px] whitespace-nowrap">
                                        {invoice.dueDate}
                                    </TableCell>
                                    <TableCell className="min-w-[80px] whitespace-nowrap">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="hover:text-purple-600"
                                        >
                                            <Download className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default Invoices; 