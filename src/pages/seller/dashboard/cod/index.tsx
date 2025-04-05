import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ArrowUpDown, Building2, Download, Search } from "lucide-react";
import { useState } from "react";

interface RemittanceData {
    remittanceId: string;
    status: "Pending" | "Completed" | "Failed";
    paymentDate: string;
    remittanceAmount: string;
    freightDeduction: string;
    convenienceFee: string;
    total: string;
    paymentRef: string;
}

const remittanceData: RemittanceData[] = [
    {
        remittanceId: "REM001",
        status: "Completed",
        paymentDate: "2024-03-21",
        remittanceAmount: "₹15,000",
        freightDeduction: "₹500",
        convenienceFee: "₹150",
        total: "₹14,350",
        paymentRef: "PAY123456"
    },
    {
        remittanceId: "REM002",
        status: "Pending",
        paymentDate: "2024-03-22",
        remittanceAmount: "₹12,500",
        freightDeduction: "₹400",
        convenienceFee: "₹125",
        total: "₹11,975",
        paymentRef: "PAY123457"
    },
    {
        remittanceId: "REM003",
        status: "Failed",
        paymentDate: "2024-03-20",
        remittanceAmount: "₹18,000",
        freightDeduction: "₹600",
        convenienceFee: "₹180",
        total: "₹17,220",
        paymentRef: "PAY123458"
    },
    {
        remittanceId: "REM004",
        status: "Completed",
        paymentDate: "2024-03-19",
        remittanceAmount: "₹22,000",
        freightDeduction: "₹700",
        convenienceFee: "₹220",
        total: "₹21,080",
        paymentRef: "PAY123459"
    },
    {
        remittanceId: "REM005",
        status: "Pending",
        paymentDate: "2024-03-23",
        remittanceAmount: "₹9,500",
        freightDeduction: "₹300",
        convenienceFee: "₹95",
        total: "₹9,105",
        paymentRef: "PAY123460"
    }
];

const RemittanceTable = ({ data }: { data: RemittanceData[] }) => {
    
    const [sortConfig, setSortConfig] = useState<{
        key: keyof RemittanceData;
        direction: 'asc' | 'desc';
    } | null>(null);

    const sortedData = [...data].sort((a, b) => {
        if (!sortConfig) return 0;

        const { key, direction } = sortConfig;
        if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
        if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
        return 0;
    });

    const handleSort = (key: keyof RemittanceData) => {
        setSortConfig(current => ({
            key,
            direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc',
        }));
    };

    const handleDownload = () => {
        // Create a link element
        const link = document.createElement('a');
        link.href = '/docs/text.pdf';
        link.download = 'remittance-details.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Table>
            <TableHeader className="bg-[#F4F2FF] h-12">
                <TableRow className="hover:bg-[#F4F2FF]">
                    <TableHead onClick={() => handleSort('remittanceId')} className="cursor-pointer text-black min-w-[150px] whitespace-nowrap">
                        Remittance ID <ArrowUpDown className="inline h-4 w-4 ml-1" />
                    </TableHead>
                    <TableHead onClick={() => handleSort('status')} className="cursor-pointer text-black min-w-[120px] whitespace-nowrap">
                        Status <ArrowUpDown className="inline h-4 w-4 ml-1" />
                    </TableHead>
                    <TableHead onClick={() => handleSort('paymentDate')} className="cursor-pointer text-black min-w-[150px] whitespace-nowrap">
                        Payment Date <ArrowUpDown className="inline h-4 w-4 ml-1" />
                    </TableHead>
                    <TableHead onClick={() => handleSort('remittanceAmount')} className="cursor-pointer text-black min-w-[180px] whitespace-nowrap">
                        Remittance Amount <ArrowUpDown className="inline h-4 w-4 ml-1" />
                    </TableHead>
                    <TableHead onClick={() => handleSort('freightDeduction')} className="cursor-pointer text-black min-w-[180px] whitespace-nowrap">
                        Freight Deduction <ArrowUpDown className="inline h-4 w-4 ml-1" />
                    </TableHead>
                    <TableHead onClick={() => handleSort('convenienceFee')} className="cursor-pointer text-black min-w-[180px] whitespace-nowrap">
                        Convenience Fee <ArrowUpDown className="inline h-4 w-4 ml-1" />
                    </TableHead>
                    <TableHead onClick={() => handleSort('total')} className="cursor-pointer text-black min-w-[120px] whitespace-nowrap">
                        Total <ArrowUpDown className="inline h-4 w-4 ml-1" />
                    </TableHead>
                    <TableHead onClick={() => handleSort('paymentRef')} className="cursor-pointer text-black min-w-[150px] whitespace-nowrap">
                        Payment Ref <ArrowUpDown className="inline h-4 w-4 ml-1" />
                    </TableHead>
                    <TableHead className="text-black min-w-[100px] whitespace-nowrap">
                        Download
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {sortedData.map((row, index) => (
                    <TableRow key={index} className="h-12">
                        <TableCell className="font-medium">
                            {row.remittanceId}
                        </TableCell>
                        <TableCell>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${row.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                row.status === 'Failed' ? 'bg-red-100 text-red-800' :
                                    'bg-yellow-100 text-yellow-800'
                                }`}>
                                <div className={`size-1.5 mr-1 rounded-full ${row.status === 'Completed' ? 'bg-green-500' :
                                    row.status === 'Failed' ? 'bg-red-500' :
                                        'bg-yellow-500'
                                    }`} />
                                {row.status}
                            </span>
                        </TableCell>
                        <TableCell>{row.paymentDate}</TableCell>
                        <TableCell>{row.remittanceAmount}</TableCell>
                        <TableCell>{row.freightDeduction}</TableCell>
                        <TableCell>{row.convenienceFee}</TableCell>
                        <TableCell className="font-medium">{row.total}</TableCell>
                        <TableCell>{row.paymentRef}</TableCell>
                        <TableCell>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={handleDownload}
                            >
                                <Download className="h-4 w-4" />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

const SellerCODPage = () => {

    const [searchQuery, setSearchQuery] = useState<string>("");

    const stats = [
        { title: "Total COD", amount: "₹ 999" },
        { title: "Remitted till date", amount: "₹ 999" },
        { title: "Last Remittance", amount: "₹ 999" },
        { title: "Total Remittance Due", amount: "₹ 999" },
        { title: "Next Remittance", amount: "₹ 999" },
    ];

    return (
        <div className="space-y-8 overflow-hidden">
            <h1 className="text-xl lg:text-2xl font-semibold">
                COD Remittance
            </h1>

            <div className="space-y-4">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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

                {/* Search and Filter */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 py-2">
                    <div className="flex items-center gap-2 w-full">
                        <div className="relative flex-1 px-px">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                            <Input
                                placeholder="Search by Remittance ID or Payment Reference"
                                className="pl-9 w-full bg-[#F8F7FF]"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Table with Overflow Handling */}
                <div className="w-[calc(100vw-4rem)] lg:w-full -mr-4 lg:mr-0">
                    <div className="w-full overflow-x-auto">
                        <RemittanceTable data={remittanceData} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerCODPage; 