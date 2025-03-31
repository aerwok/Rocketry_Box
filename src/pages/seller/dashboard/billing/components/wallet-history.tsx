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

interface WalletTransaction {
    transactionId: string;
    date: string;
    type: "Credit" | "Debit";
    amount: string;
    balance: string;
    description: string;
    status: "Success" | "Pending" | "Failed";
}

const transactionData: WalletTransaction[] = [
    {
        transactionId: "TXN123456",
        date: "2024-03-20",
        type: "Credit",
        amount: "₹1000",
        balance: "₹5000",
        description: "Wallet Recharge",
        status: "Success"
    },
    {
        transactionId: "TXN123457",
        date: "2024-03-19",
        type: "Debit",
        amount: "₹500",
        balance: "₹4000",
        description: "Shipping Payment",
        status: "Success"
    },
    {
        transactionId: "TXN123458",
        date: "2024-03-18",
        type: "Credit",
        amount: "₹2000",
        balance: "₹4500",
        description: "Refund",
        status: "Pending"
    },
    {
        transactionId: "TXN123459",
        date: "2024-03-17",
        type: "Debit",
        amount: "₹750",
        balance: "₹2500",
        description: "Service Charge",
        status: "Failed"
    },
    {
        transactionId: "TXN123460",
        date: "2024-03-16",
        type: "Credit",
        amount: "₹3000",
        balance: "₹3250",
        description: "Wallet Recharge",
        status: "Success"
    }
];

const WalletHistory = () => {
    
    const [sortConfig, setSortConfig] = useState<{
        key: keyof WalletTransaction;
        direction: 'asc' | 'desc';
    } | null>(null);

    const stats = [
        { title: "Total Recharge", amount: "₹50" },
        { title: "Total Used", amount: "₹340" },
        { title: "Last Recharge", amount: "₹430" },
        { title: "Closing Balance", amount: "₹40" },
        { title: "Total Remittance", amount: "₹20" },
        { title: "Remittance to Wallet", amount: "₹345" },
    ];

    const sortedData = [...transactionData].sort((a, b) => {
        if (!sortConfig) return 0;

        const { key, direction } = sortConfig;
        if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
        if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
        return 0;
    });

    const handleSort = (key: keyof WalletTransaction) => {
        setSortConfig(current => ({
            key,
            direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc',
        }));
    };

    return (
        <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-[#BCDDFF] p-4 rounded-lg">
                        <div className="flex flex-col gap-2">
                            <h3 className="text-sm font-medium">
                                {stat.title}
                            </h3>
                            <div className="flex items-center gap-2">
                                <Building2 className="size-5" />
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
                        Transaction History
                    </h2>
                    <div className="text-sm text-muted-foreground">
                        Current Balance:
                        <span className="font-semibold text-green-600">
                            ₹5000
                        </span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <div className="min-w-[800px]">
                        <Table>
                            <TableHeader className="bg-[#F4F2FF] h-12">
                                <TableRow className="hover:bg-[#F4F2FF]">
                                    <TableHead onClick={() => handleSort('transactionId')} className="cursor-pointer text-black min-w-[140px] whitespace-nowrap">
                                        Transaction ID
                                        <ArrowUpDown className="inline h-4 w-4 ml-1" />
                                    </TableHead>
                                    <TableHead onClick={() => handleSort('date')} className="cursor-pointer text-black min-w-[100px] whitespace-nowrap">
                                        Date
                                        <ArrowUpDown className="inline h-4 w-4 ml-1" />
                                    </TableHead>
                                    <TableHead onClick={() => handleSort('type')} className="cursor-pointer text-black min-w-[100px] whitespace-nowrap">
                                        Type
                                        <ArrowUpDown className="inline h-4 w-4 ml-1" />
                                    </TableHead>
                                    <TableHead onClick={() => handleSort('amount')} className="cursor-pointer text-black min-w-[100px] whitespace-nowrap">
                                        Amount
                                        <ArrowUpDown className="inline h-4 w-4 ml-1" />
                                    </TableHead>
                                    <TableHead onClick={() => handleSort('balance')} className="cursor-pointer text-black min-w-[100px] whitespace-nowrap">
                                        Balance
                                        <ArrowUpDown className="inline h-4 w-4 ml-1" />
                                    </TableHead>
                                    <TableHead onClick={() => handleSort('description')} className="cursor-pointer text-black min-w-[140px] whitespace-nowrap">
                                        Description
                                        <ArrowUpDown className="inline h-4 w-4 ml-1" />
                                    </TableHead>
                                    <TableHead onClick={() => handleSort('status')} className="cursor-pointer text-black min-w-[100px] whitespace-nowrap">
                                        Status
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
                                        <TableCell className="min-w-[100px] whitespace-nowrap">
                                            <span className={cn(
                                                "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                                                transaction.type === 'Credit'
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                            )}>
                                                {transaction.type}
                                            </span>
                                        </TableCell>
                                        <TableCell className={cn(
                                            "font-medium min-w-[100px] whitespace-nowrap",
                                            transaction.type === 'Credit' ? "text-green-600" : "text-red-600"
                                        )}>
                                            {transaction.amount}
                                        </TableCell>
                                        <TableCell className="min-w-[100px] whitespace-nowrap">
                                            {transaction.balance}
                                        </TableCell>
                                        <TableCell className="min-w-[140px] whitespace-nowrap">
                                            {transaction.description}
                                        </TableCell>
                                        <TableCell className="min-w-[100px] whitespace-nowrap">
                                            <span className={cn(
                                                "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                                                {
                                                    "bg-green-100 text-green-800": transaction.status === "Success",
                                                    "bg-yellow-100 text-yellow-800": transaction.status === "Pending",
                                                    "bg-red-100 text-red-800": transaction.status === "Failed"
                                                }
                                            )}>
                                                {transaction.status}
                                            </span>
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

export default WalletHistory; 