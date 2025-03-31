import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ArrowUpDown, Building2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface LedgerTransaction {
    transactionId: string;
    date: string;
    description: string;
    amount: string;
    paymentMethod: "UPI" | "Bank Transfer" | "Card" | "Wallet";
    status: "Completed" | "Processing" | "Failed";
    reference: string;
}

const transactionData: LedgerTransaction[] = [
    {
        transactionId: "TXN987654",
        date: "2024-03-20",
        description: "Bulk Shipping Payment",
        amount: "₹25,000",
        paymentMethod: "Bank Transfer",
        status: "Completed",
        reference: "REF123456"
    },
    {
        transactionId: "TXN987655",
        date: "2024-03-19",
        description: "Monthly Service Fee",
        amount: "₹15,000",
        paymentMethod: "UPI",
        status: "Processing",
        reference: "REF123457"
    },
    {
        transactionId: "TXN987656",
        date: "2024-03-18",
        description: "Premium Subscription",
        amount: "₹50,000",
        paymentMethod: "Card",
        status: "Failed",
        reference: "REF123458"
    },
    {
        transactionId: "TXN987657",
        date: "2024-03-17",
        description: "Bulk Order Payment",
        amount: "₹35,000",
        paymentMethod: "Wallet",
        status: "Completed",
        reference: "REF123459"
    },
    {
        transactionId: "TXN987658",
        date: "2024-03-16",
        description: "Annual Membership",
        amount: "₹75,000",
        paymentMethod: "Bank Transfer",
        status: "Processing",
        reference: "REF123460"
    }
];

const LedgerHistory = () => {

    const [sortConfig, setSortConfig] = useState<{
        key: keyof LedgerTransaction;
        direction: 'asc' | 'desc';
    } | null>(null);

    const stats = [
        { title: "Total Recharge", amount: "₹0", icon: <Building2 className="size-5" /> },
        { title: "Total Debit", amount: "₹0", icon: <Building2 className="size-5" /> },
        { title: "Total Credit", amount: "₹0", icon: <Building2 className="size-5" /> },
        { title: "Closing Balance", amount: "₹0", icon: <Building2 className="size-5" /> },
    ];

    const sortedData = [...transactionData].sort((a, b) => {
        if (!sortConfig) return 0;

        const { key, direction } = sortConfig;
        if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
        if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
        return 0;
    });

    const handleSort = (key: keyof LedgerTransaction) => {
        setSortConfig(current => ({
            key,
            direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc',
        }));
    };

    return (
        <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-[#BCDDFF] p-4 rounded-lg">
                        <div className="flex flex-col gap-2">
                            <h3 className="text-sm font-medium">
                                {stat.title}
                            </h3>
                            <div className="flex items-center gap-2">
                                {stat.icon}
                                <span className="text-lg font-semibold">
                                    {stat.amount}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">
                        Ledger Transaction History
                    </h2>
                    <div className="text-sm text-muted-foreground">
                        Total Value:
                        <span className="font-semibold text-purple-600">
                            ₹2,00,000
                        </span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <div className="min-w-[1000px]">
                        <Table>
                            <TableHeader className="bg-[#F4F2FF] h-12">
                                <TableRow className="hover:bg-[#F4F2FF]">
                                    <TableHead
                                        onClick={() => handleSort('transactionId')}
                                        className="cursor-pointer text-black min-w-[140px] whitespace-nowrap"
                                    >
                                        Transaction ID
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
                                        onClick={() => handleSort('description')}
                                        className="cursor-pointer text-black min-w-[180px] whitespace-nowrap"
                                    >
                                        Description
                                        <ArrowUpDown className="inline h-4 w-4 ml-1" />
                                    </TableHead>
                                    <TableHead
                                        onClick={() => handleSort('amount')}
                                        className="cursor-pointer text-black min-w-[120px] whitespace-nowrap"
                                    >
                                        Amount
                                        <ArrowUpDown className="inline h-4 w-4 ml-1" />
                                    </TableHead>
                                    <TableHead
                                        onClick={() => handleSort('paymentMethod')}
                                        className="cursor-pointer text-black min-w-[140px] whitespace-nowrap"
                                    >
                                        Payment Method
                                        <ArrowUpDown className="inline h-4 w-4 ml-1" />
                                    </TableHead>
                                    <TableHead
                                        onClick={() => handleSort('status')}
                                        className="cursor-pointer text-black min-w-[120px] whitespace-nowrap"
                                    >
                                        Status
                                        <ArrowUpDown className="inline h-4 w-4 ml-1" />
                                    </TableHead>
                                    <TableHead
                                        onClick={() => handleSort('reference')}
                                        className="cursor-pointer text-black min-w-[120px] whitespace-nowrap"
                                    >
                                        Reference
                                        <ArrowUpDown className="inline h-4 w-4 ml-1" />
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sortedData.map((transaction, index) => (
                                    <TableRow key={index} className="h-12">
                                        <TableCell className="min-w-[140px] whitespace-nowrap">
                                            {transaction.transactionId}
                                        </TableCell>
                                        <TableCell className="min-w-[100px] whitespace-nowrap">
                                            {transaction.date}
                                        </TableCell>
                                        <TableCell className="min-w-[180px] whitespace-nowrap">
                                            {transaction.description}
                                        </TableCell>
                                        <TableCell className="font-medium min-w-[120px] whitespace-nowrap">
                                            {transaction.amount}
                                        </TableCell>
                                        <TableCell className="min-w-[140px] whitespace-nowrap">
                                            <span className={cn(
                                                "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                                                {
                                                    "bg-purple-100 text-purple-800": transaction.paymentMethod === "UPI",
                                                    "bg-blue-100 text-blue-800": transaction.paymentMethod === "Bank Transfer",
                                                    "bg-green-100 text-green-800": transaction.paymentMethod === "Card",
                                                    "bg-orange-100 text-orange-800": transaction.paymentMethod === "Wallet"
                                                }
                                            )}>
                                                {transaction.paymentMethod}
                                            </span>
                                        </TableCell>
                                        <TableCell className="min-w-[120px] whitespace-nowrap">
                                            <span className={cn(
                                                "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                                                {
                                                    "bg-green-100 text-green-800": transaction.status === "Completed",
                                                    "bg-yellow-100 text-yellow-800": transaction.status === "Processing",
                                                    "bg-red-100 text-red-800": transaction.status === "Failed"
                                                }
                                            )}>
                                                {transaction.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="min-w-[120px] whitespace-nowrap">
                                            {transaction.reference}
                                        </TableCell>
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

export default LedgerHistory; 