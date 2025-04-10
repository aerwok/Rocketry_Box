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
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";

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

interface RemittanceSummary {
    totalCOD: string;
    remittedTillDate: string;
    lastRemittance: string;
    totalRemittanceDue: string;
    nextRemittance: string;
}

// Fallback data in case API fails
const fallbackRemittanceData: RemittanceData[] = [
    {
        remittanceId: "REM23785",
        status: "Completed",
        paymentDate: "2024-06-15",
        remittanceAmount: "₹45,720.00",
        freightDeduction: "₹1,371.60",
        convenienceFee: "₹457.20",
        total: "₹43,891.20",
        paymentRef: "UTIB224536789"
    },
    // ... other fallback data items
];

const fallbackSummary: RemittanceSummary = {
    totalCOD: "₹ 3,56,280.00",
    remittedTillDate: "₹ 2,00,429.60",
    lastRemittance: "₹ 43,891.20",
    totalRemittanceDue: "₹ 1,15,420.80",
    nextRemittance: "₹ 36,720.00"
};

const SellerCODPage = () => {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [remittanceData, setRemittanceData] = useState<RemittanceData[]>([]);
    const [summary, setSummary] = useState<RemittanceSummary>(fallbackSummary);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [sortConfig, setSortConfig] = useState<{
        key: keyof RemittanceData;
        direction: 'asc' | 'desc';
    } | null>(null);

    useEffect(() => {
        const fetchRemittanceData = async () => {
            try {
                setLoading(true);
                
                // Fetch summary data
                const summaryResponse = await axios.get('/api/v2/seller/cod/summary', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                
                if (summaryResponse.data && summaryResponse.data.data) {
                    setSummary(summaryResponse.data.data);
                }
                
                // Fetch remittance history
                const historyResponse = await axios.get('/api/v2/seller/cod/remittance-history', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                
                if (historyResponse.data && historyResponse.data.data && historyResponse.data.data.remittances) {
                    setRemittanceData(historyResponse.data.data.remittances);
                }
                
                setError(null);
            } catch (err) {
                console.error('Error fetching COD data:', err);
                setError('Failed to load COD remittance data. Using fallback data.');
                toast.error('Failed to fetch remittance data. Showing sample data instead.');
                
                // Use fallback data if API fails
                setRemittanceData(fallbackRemittanceData);
            } finally {
                setLoading(false);
            }
        };
        
        fetchRemittanceData();
    }, []);

    // Filter data based on search query
    const filteredData = remittanceData.filter(item => {
        if (!searchQuery.trim()) return true;
        
        const query = searchQuery.toLowerCase();
        return (
            item.remittanceId.toLowerCase().includes(query) ||
            item.paymentRef.toLowerCase().includes(query)
        );
    });

    // Sort the filtered data
    const sortedData = [...filteredData].sort((a, b) => {
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

    const handleDownloadRemittance = async (remittanceId: string) => {
        try {
            const response = await axios.get(`/api/v2/seller/cod/export`, {
                params: { remittanceId, format: 'xlsx' },
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                responseType: 'blob'
            });
            
            // Create a download link and trigger download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `remittance-${remittanceId}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error('Error downloading remittance details:', err);
            toast.error('Failed to download remittance details');
        }
    };

    const stats = [
        { title: "Total COD", amount: summary.totalCOD },
        { title: "Remitted till date", amount: summary.remittedTillDate },
        { title: "Last Remittance", amount: summary.lastRemittance },
        { title: "Total Remittance Due", amount: summary.totalRemittanceDue },
        { title: "Next Remittance", amount: summary.nextRemittance },
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

                {/* Loading/Error States */}
                {loading && (
                    <div className="text-center py-8">
                        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p>Loading remittance data...</p>
                    </div>
                )}

                {error && !loading && (
                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded p-4 mb-4">
                        {error}
                    </div>
                )}

                {/* Table with Overflow Handling */}
                {!loading && (
                    <div className="w-[calc(100vw-4rem)] lg:w-full -mr-4 lg:mr-0">
                        <div className="w-full overflow-x-auto">
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
                                    {sortedData.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                                                No remittance records found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        sortedData.map((row, index) => (
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
                                                        onClick={() => handleDownloadRemittance(row.remittanceId)}
                                                    >
                                                        <Download className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SellerCODPage; 