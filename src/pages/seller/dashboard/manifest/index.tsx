import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown, Search } from "lucide-react";
import { useState } from "react";

const manifestData = [
    {
        manifestId: "MF123456",
        date: "2024-03-15",
        courier: "Blue Dart",
        orders: "5",
        pickupStatus: "Pending",
        warehouse: "Mumbai Central",
        status: "Processing"
    },
    {
        manifestId: "MF123457",
        date: "2024-03-15",
        courier: "DTDC",
        orders: "3",
        pickupStatus: "Completed",
        warehouse: "Delhi Hub",
        status: "Completed"
    },
    {
        manifestId: "MF123458",
        date: "2024-03-14",
        courier: "Delhivery",
        orders: "7",
        pickupStatus: "In Progress",
        warehouse: "Bangalore Main",
        status: "Processing"
    },
    {
        manifestId: "MF123459",
        date: "2024-03-14",
        courier: "Blue Dart",
        orders: "4",
        pickupStatus: "Scheduled",
        warehouse: "Chennai Central",
        status: "Scheduled"
    },
    {
        manifestId: "MF123460",
        date: "2024-03-13",
        courier: "DTDC",
        orders: "6",
        pickupStatus: "Completed",
        warehouse: "Pune Hub",
        status: "Completed"
    }
];

type SortConfig = {
    key: keyof typeof manifestData[0] | null;
    direction: 'asc' | 'desc' | null;
};

const getStatusStyle = (status: string) => {
    switch (status) {
        case "Completed":
            return "bg-green-100 text-green-800";
        case "Processing":
            return "bg-yellow-100 text-yellow-800";
        case "Scheduled":
            return "bg-blue-100 text-blue-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
};

const getPickupStatusStyle = (status: string) => {
    switch (status) {
        case "Completed":
            return "bg-green-100 text-green-800";
        case "In Progress":
            return "bg-yellow-100 text-yellow-800";
        case "Pending":
            return "bg-red-100 text-red-800";
        case "Scheduled":
            return "bg-blue-100 text-blue-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
};

const ManifestTable = ({ data }: { data: typeof manifestData }) => {

    const [sortConfig, setSortConfig] = useState<SortConfig>({
        key: null,
        direction: null,
    });

    const handleSort = (key: keyof typeof manifestData[0]) => {
        let direction: 'asc' | 'desc' | null = 'asc';

        if (sortConfig.key === key) {
            if (sortConfig.direction === 'asc') {
                direction = 'desc';
            } else if (sortConfig.direction === 'desc') {
                direction = null;
            }
        }

        setSortConfig({ key, direction });
    };

    const getSortedData = () => {
        if (!sortConfig.key || !sortConfig.direction) return data;

        return [...data].sort((a, b) => {
            if (a[sortConfig.key!] < b[sortConfig.key!]) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (a[sortConfig.key!] > b[sortConfig.key!]) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    };

    const getSortIcon = (key: keyof typeof manifestData[0]) => {
        if (sortConfig.key !== key) {
            return <ArrowUpDown className="size-3" />;
        }
        return <ArrowUpDown className="size-3" />;
    };

    const sortedData = getSortedData();

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow className="bg-[#F4F2FF] hover:bg-[#F4F2FF]">
                        <TableHead className="min-w-[120px] whitespace-nowrap text-black">
                            <div
                                className="flex items-center gap-1 cursor-pointer"
                                onClick={() => handleSort('manifestId')}
                            >
                                MANIFEST ID
                                {getSortIcon('manifestId')}
                            </div>
                        </TableHead>
                        <TableHead className="min-w-[100px] whitespace-nowrap text-black">
                            <div
                                className="flex items-center gap-1 cursor-pointer"
                                onClick={() => handleSort('date')}
                            >
                                DATE
                                {getSortIcon('date')}
                            </div>
                        </TableHead>
                        <TableHead className="min-w-[120px] whitespace-nowrap text-black">
                            <div
                                className="flex items-center gap-1 cursor-pointer"
                                onClick={() => handleSort('courier')}
                            >
                                COURIER
                                {getSortIcon('courier')}
                            </div>
                        </TableHead>
                        <TableHead className="min-w-[100px] whitespace-nowrap text-black">
                            <div
                                className="flex items-center gap-1 cursor-pointer"
                                onClick={() => handleSort('orders')}
                            >
                                ORDERS
                                {getSortIcon('orders')}
                            </div>
                        </TableHead>
                        <TableHead className="min-w-[140px] whitespace-nowrap text-black">
                            <div
                                className="flex items-center gap-1 cursor-pointer"
                                onClick={() => handleSort('pickupStatus')}
                            >
                                PICKUP STATUS
                                {getSortIcon('pickupStatus')}
                            </div>
                        </TableHead>
                        <TableHead className="min-w-[140px] whitespace-nowrap text-black">
                            <div
                                className="flex items-center gap-1 cursor-pointer"
                                onClick={() => handleSort('warehouse')}
                            >
                                WAREHOUSE
                                {getSortIcon('warehouse')}
                            </div>
                        </TableHead>
                        <TableHead className="min-w-[100px] whitespace-nowrap text-black">
                            <div
                                className="flex items-center gap-1 cursor-pointer"
                                onClick={() => handleSort('status')}
                            >
                                STATUS
                                {getSortIcon('status')}
                            </div>
                        </TableHead>
                        <TableHead className="min-w-[50px] whitespace-nowrap text-black text-center">
                            #
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedData.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={8} className="text-center py-10">
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <Search className="h-10 w-10 text-gray-400" />
                                    <h3 className="font-semibold text-xl">Sorry! No Result Found</h3>
                                    <p className="text-gray-500">We've searched more than 150+ Orders We did not find any orders for you search.</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        sortedData.map((manifest) => (
                            <TableRow key={manifest.manifestId}>
                                <TableCell className="font-medium">
                                    {manifest.manifestId}
                                </TableCell>
                                <TableCell>
                                    {manifest.date}
                                </TableCell>
                                <TableCell>
                                    {manifest.courier}
                                </TableCell>
                                <TableCell>
                                    {manifest.orders}
                                </TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPickupStatusStyle(manifest.pickupStatus)}`}>
                                        {manifest.pickupStatus}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    {manifest.warehouse}
                                </TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(manifest.status)}`}>
                                        {manifest.status}
                                    </span>
                                </TableCell>
                                <TableCell className="text-center">
                                    <Button variant="ghost" size="sm" className="h-auto p-0">
                                        •••
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

const SellerManifestPage = () => {

    const [searchQuery, setSearchQuery] = useState<string>("");

    return (
        <div className="space-y-8">
            <h1 className="text-xl lg:text-2xl font-semibold">
                Manifest
            </h1>

            <div className="overflow-hidden">
                <div className="space-y-8">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pt-px">
                        <div className="flex items-center gap-2 w-full">
                            <div className="relative flex-1 px-px">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                <Input
                                    placeholder="Search by Manifest ID, Courier..."
                                    className="pl-9 w-full bg-[#F8F7FF]"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="w-[calc(100vw-4rem)] lg:w-full -mr-4 lg:mr-0">
                        <div className="w-full overflow-x-auto">
                            <ManifestTable data={manifestData} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerManifestPage; 