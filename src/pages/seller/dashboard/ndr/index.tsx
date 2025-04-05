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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ArrowUpDown, Search, MoreVertical } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import BulkNDRUploadModal from "@/components/seller/ndr/bulk-ndr-upload-modal";
import ExcelJS from "exceljs";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ReturnOrderModal from "@/components/seller/return-order-modal";
import ReattemptOrderModal from "@/components/seller/reattempt-order-modal";

interface NDRData {
    awb: string;
    orderDate: string;
    courier: string;
    customer: string;
    attempts: number;
    lastAttemptDate: string;
    status: string;
    reason: string;
    action: string;
    address?: {
        fullName: string;
        contactNumber: string;
        addressLine1: string;
        addressLine2?: string;
        landmark?: string;
        pincode: string;
        city: string;
        state: string;
    };
}

const NDRTable = ({ data, showActions = false }: { data: NDRData[], showActions?: boolean }) => {

    const [sortConfig, setSortConfig] = useState<{
        key: keyof NDRData;
        direction: 'asc' | 'desc';
    } | null>(null);

    const [selectedAwb, setSelectedAwb] = useState<string>("");
    const [isReturnModalOpen, setIsReturnModalOpen] = useState<boolean>(false);
    const [isReattemptModalOpen, setIsReattemptModalOpen] = useState<boolean>(false);
    const [selectedNDR, setSelectedNDR] = useState<NDRData | null>(null);

    const sortedData = [...data].sort((a, b) => {
        if (!sortConfig) return 0;

        const { key, direction } = sortConfig;

        // Handle potentially undefined values safely
        const aValue = a[key] ?? '';
        const bValue = b[key] ?? '';

        if (aValue < bValue) return direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return direction === 'asc' ? 1 : -1;
        return 0;
    });

    const handleSort = (key: keyof NDRData) => {
        setSortConfig(current => ({
            key,
            direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc',
        }));
    };

    const handleReturnClick = (ndr: NDRData) => {
        setSelectedAwb(ndr.awb);
        setSelectedNDR(ndr);
        setIsReturnModalOpen(true);
    };

    const handleReattemptClick = (ndr: NDRData) => {
        setSelectedAwb(ndr.awb);
        setSelectedNDR(ndr);
        setIsReattemptModalOpen(true);
    };

    return (
        <>
            <Table>
                <TableHeader className="bg-[#F4F2FF] h-12">
                    <TableRow className="hover:bg-[#F4F2FF]">
                        <TableHead onClick={() => handleSort('awb')} className="cursor-pointer text-black min-w-[120px] whitespace-nowrap">
                            AWB <ArrowUpDown className="inline h-4 w-4 ml-1" />
                        </TableHead>
                        <TableHead onClick={() => handleSort('orderDate')} className="cursor-pointer text-black min-w-[120px] whitespace-nowrap">
                            Order Date <ArrowUpDown className="inline h-4 w-4 ml-1" />
                        </TableHead>
                        <TableHead onClick={() => handleSort('courier')} className="cursor-pointer text-black min-w-[140px] whitespace-nowrap">
                            Courier <ArrowUpDown className="inline h-4 w-4 ml-1" />
                        </TableHead>
                        <TableHead onClick={() => handleSort('customer')} className="cursor-pointer text-black min-w-[140px] whitespace-nowrap">
                            Customer <ArrowUpDown className="inline h-4 w-4 ml-1" />
                        </TableHead>
                        <TableHead onClick={() => handleSort('status')} className="cursor-pointer text-black min-w-[120px] whitespace-nowrap">
                            Status <ArrowUpDown className="inline h-4 w-4 ml-1" />
                        </TableHead>
                        <TableHead onClick={() => handleSort('reason')} className="cursor-pointer text-black min-w-[160px] whitespace-nowrap">
                            Reason <ArrowUpDown className="inline h-4 w-4 ml-1" />
                        </TableHead>
                        {showActions && (
                            <TableHead className="text-black min-w-[80px] whitespace-nowrap text-right">
                                Actions
                            </TableHead>
                        )}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedData.map((row, index) => (
                        <TableRow key={index} className="h-12">
                            <TableCell className="whitespace-nowrap">
                                <Link
                                    to={`/seller/dashboard/ndr/${row.awb}`}
                                    className="text-violet-600 hover:underline"
                                >
                                    {row.awb}
                                </Link>
                            </TableCell>
                            <TableCell className="whitespace-nowrap">{row.orderDate}</TableCell>
                            <TableCell className="whitespace-nowrap">{row.courier}</TableCell>
                            <TableCell className="whitespace-nowrap">{row.customer}</TableCell>
                            <TableCell className="whitespace-nowrap">
                                <span className={cn(
                                    "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                                    {
                                        "bg-red-100 text-red-800": row.status === "Action Required",
                                        "bg-orange-100 text-orange-800": row.status === "Action Requested",
                                        "bg-blue-100 text-blue-800": row.status === "In Transit",
                                        "bg-purple-100 text-purple-800": row.status === "Out for Delivery",
                                        "bg-green-100 text-green-800": row.status === "Delivered",
                                    }
                                )}>
                                    {row.status}
                                </span>
                            </TableCell>
                            <TableCell className="whitespace-nowrap">{row.reason}</TableCell>
                            {showActions && (
                                <TableCell className="whitespace-nowrap text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleReturnClick(row)}>
                                                Return
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleReattemptClick(row)}>
                                                Reattempt
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Return Order Modal */}
            <ReturnOrderModal
                isOpen={isReturnModalOpen}
                onClose={() => setIsReturnModalOpen(false)}
                orderId={selectedAwb}
            />

            {/* Reattempt Order Modal */}
            <ReattemptOrderModal
                isOpen={isReattemptModalOpen}
                onClose={() => setIsReattemptModalOpen(false)}
                orderId={selectedAwb}
                currentAddress={selectedNDR?.address || null}
            />
        </>
    );
};

const mapToNDRData = (data: any[]): NDRData[] => {
    return data.map(item => ({
        awb: item.awb,
        orderDate: item.orderDate,
        courier: item.courier,
        customer: item.customer,
        attempts: item.attempts,
        lastAttemptDate: item.lastAttemptDate,
        status: item.status,
        reason: item.reason,
        action: item.action,
        address: item.address,
    }));
};

const SellerNDRPage = () => {

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);

    const allData = [
        {
            awb: "123456789",
            orderDate: "2024-03-15",
            courier: "Blue Dart",
            customer: "John Doe",
            attempts: 2,
            lastAttemptDate: "2024-03-18",
            status: "Action Required",
            reason: "Customer not available",
            action: "Call customer",
        },
        {
            awb: "987654321",
            orderDate: "2024-03-14",
            courier: "DTDC",
            customer: "Jane Smith",
            attempts: 1,
            lastAttemptDate: "2024-03-17",
            status: "Action Requested",
            reason: "Address not found",
            action: "Verify address",
        },
    ];

    const actionRequiredData = [
        {
            awb: "123456789",
            orderDate: "2024-03-15",
            courier: "Blue Dart",
            customer: "John Doe",
            attempts: 2,
            lastAttemptDate: "2024-03-18",
            status: "Action Required",
            reason: "Customer not available",
            action: "Call customer",
        },
        {
            awb: "456789123",
            orderDate: "2024-03-16",
            courier: "FedEx",
            customer: "Alice Johnson",
            attempts: 3,
            lastAttemptDate: "2024-03-19",
            status: "Action Required",
            reason: "Wrong address",
            action: "Update address",
        },
    ];

    const actionRequestedData = [
        {
            awb: "987654321",
            orderDate: "2024-03-14",
            courier: "DTDC",
            customer: "Jane Smith",
            attempts: 1,
            lastAttemptDate: "2024-03-17",
            status: "Action Requested",
            reason: "Address not found",
            action: "Verify address",
        },
        {
            awb: "654321987",
            orderDate: "2024-03-13",
            courier: "DHL",
            customer: "Bob Wilson",
            attempts: 2,
            lastAttemptDate: "2024-03-16",
            status: "Action Requested",
            reason: "Phone not reachable",
            action: "Update phone",
        },
    ];

    const inTransitData = [
        {
            awb: "246813579",
            orderDate: "2024-03-20",
            courier: "Delhivery",
            customer: "Michael Brown",
            attempts: 0,
            lastAttemptDate: "-",
            status: "In Transit",
            reason: "Package in transit",
            action: "Monitor status",
        },
        {
            awb: "135792468",
            orderDate: "2024-03-19",
            courier: "Ekart",
            customer: "Sarah Davis",
            attempts: 0,
            lastAttemptDate: "-",
            status: "In Transit",
            reason: "Out for delivery",
            action: "Track package",
        },
        {
            awb: "975310864",
            orderDate: "2024-03-18",
            courier: "Blue Dart",
            customer: "David Miller",
            attempts: 0,
            lastAttemptDate: "-",
            status: "In Transit",
            reason: "Hub transfer",
            action: "Monitor status",
        },
    ];

    const ofdData = [
        {
            awb: "864209753",
            orderDate: "2024-03-21",
            courier: "FedEx",
            customer: "Emma Wilson",
            attempts: 1,
            lastAttemptDate: "2024-03-21",
            status: "Out for Delivery",
            reason: "First attempt",
            action: "Delivery expected",
        },
        {
            awb: "753951852",
            orderDate: "2024-03-21",
            courier: "DHL",
            customer: "Chris Taylor",
            attempts: 1,
            lastAttemptDate: "2024-03-21",
            status: "Out for Delivery",
            reason: "Second attempt",
            action: "Delivery expected",
        },
        {
            awb: "159357852",
            orderDate: "2024-03-21",
            courier: "DTDC",
            customer: "Linda Anderson",
            attempts: 2,
            lastAttemptDate: "2024-03-21",
            status: "Out for Delivery",
            reason: "Final attempt",
            action: "Priority delivery",
        },
    ];

    const deliveredData = [
        {
            awb: "951753852",
            orderDate: "2024-03-17",
            courier: "Blue Dart",
            customer: "Peter Parker",
            attempts: 1,
            lastAttemptDate: "2024-03-20",
            status: "Delivered",
            reason: "Successfully delivered",
            action: "Completed",
        },
        {
            awb: "357159852",
            orderDate: "2024-03-16",
            courier: "Delhivery",
            customer: "Mary Jane",
            attempts: 2,
            lastAttemptDate: "2024-03-19",
            status: "Delivered",
            reason: "Successfully delivered",
            action: "Completed",
        },
        {
            awb: "258147369",
            orderDate: "2024-03-15",
            courier: "Ekart",
            customer: "Harry Osborn",
            attempts: 1,
            lastAttemptDate: "2024-03-18",
            status: "Delivered",
            reason: "Successfully delivered",
            action: "Completed",
        },
        {
            awb: "741852963",
            orderDate: "2024-03-14",
            courier: "FedEx",
            customer: "Gwen Stacy",
            attempts: 3,
            lastAttemptDate: "2024-03-17",
            status: "Delivered",
            reason: "Successfully delivered",
            action: "Completed",
        },
    ];

    const handleDownloadNDR = async () => {
        // Generate a unique ID (you might want to use a proper ID generation method)
        const uniqueId = Date.now();

        // Create a workbook
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('NDR Data');

        // Add headers
        worksheet.columns = [
            { header: 'AWB', key: 'awb' },
            { header: 'Order Date', key: 'orderDate' },
            { header: 'Courier', key: 'courier' },
            { header: 'Customer', key: 'customer' },
            { header: 'Attempts', key: 'attempts' },
            { header: 'Last Attempt Date', key: 'lastAttemptDate' },
            { header: 'Status', key: 'status' },
            { header: 'Reason', key: 'reason' },
            { header: 'Action', key: 'action' },
        ];

        // Add data
        worksheet.addRows(allData);

        // Generate and download file
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ndr-${uniqueId}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-8 overflow-hidden">
            <h1 className="text-xl lg:text-2xl font-semibold">
                NDR
            </h1>

            <Tabs defaultValue="all" className="w-full">
                <div className="w-[calc(100vw-5rem)] lg:w-full -mr-4 lg:mr-0">
                    <div className="w-full overflow-x-auto scrollbar-hide">
                        <TabsList className="w-max min-w-full p-0 h-12 z-0 bg-white rounded-none relative">
                            <div className="absolute bottom-0 w-full h-px -z-10 bg-violet-200"></div>
                            <TabsTrigger
                                value="all"
                                className="flex-1 h-full data-[state=active]:bg-white rounded-none border-b-2 border-transparent data-[state=active]:border-black whitespace-nowrap px-4"
                            >
                                All
                            </TabsTrigger>
                            <TabsTrigger
                                value="action-required"
                                className="flex-1 h-full data-[state=active]:bg-white rounded-none border-b-2 border-transparent data-[state=active]:border-black whitespace-nowrap px-4"
                            >
                                Action Required
                            </TabsTrigger>
                            <TabsTrigger
                                value="action-requested"
                                className="flex-1 h-full data-[state=active]:bg-white rounded-none border-b-2 border-transparent data-[state=active]:border-black whitespace-nowrap px-4"
                            >
                                Action Requested
                            </TabsTrigger>
                            <TabsTrigger
                                value="in-transit"
                                className="flex-1 h-full data-[state=active]:bg-white rounded-none border-b-2 border-transparent data-[state=active]:border-black whitespace-nowrap px-4"
                            >
                                In Transit
                            </TabsTrigger>
                            <TabsTrigger
                                value="ofd"
                                className="flex-1 h-full data-[state=active]:bg-white rounded-none border-b-2 border-transparent data-[state=active]:border-black whitespace-nowrap px-4"
                            >
                                OFD
                            </TabsTrigger>
                            <TabsTrigger
                                value="delivered"
                                className="flex-1 h-full data-[state=active]:bg-white rounded-none border-b-2 border-transparent data-[state=active]:border-black whitespace-nowrap px-4"
                            >
                                Delivered
                            </TabsTrigger>
                        </TabsList>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 py-4 w-full">
                    <div className="flex items-center gap-2 w-full">
                        <div className="relative flex-1 px-px">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                            <Input
                                placeholder="Search Users by Name, Email or Date"
                                className="pl-9 w-full bg-[#F8F7FF]"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="purple"
                            className="text-xs md:text-sm"
                            onClick={handleDownloadNDR}
                        >
                            NDR REPORT
                        </Button>
                        <Button
                            variant="purple"
                            className="text-xs md:text-sm"
                            onClick={() => setIsUploadModalOpen(true)}
                        >
                            UPLOAD NDR
                        </Button>
                    </div>
                </div>

                <div className="w-[calc(100vw-4rem)] lg:w-full -mr-4 lg:mr-0">
                    <div className="w-full overflow-x-auto">
                        <TabsContent value="all" className="mt-2 min-w-full">
                            <NDRTable data={mapToNDRData(allData)} />
                        </TabsContent>

                        <TabsContent value="action-required" className="mt-2 min-w-full">
                            <NDRTable data={mapToNDRData(actionRequiredData)} showActions={true} />
                        </TabsContent>

                        <TabsContent value="action-requested" className="mt-2 min-w-full">
                            <NDRTable data={mapToNDRData(actionRequestedData)} />
                        </TabsContent>

                        <TabsContent value="in-transit" className="mt-2 min-w-full">
                            <NDRTable data={mapToNDRData(inTransitData)} />
                        </TabsContent>

                        <TabsContent value="ofd" className="mt-2 min-w-full">
                            <NDRTable data={mapToNDRData(ofdData)} />
                        </TabsContent>

                        <TabsContent value="delivered" className="mt-2 min-w-full">
                            <NDRTable data={mapToNDRData(deliveredData)} />
                        </TabsContent>
                    </div>
                </div>
            </Tabs>

            <BulkNDRUploadModal
                open={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
            />
        </div>
    );
};

export default SellerNDRPage; 