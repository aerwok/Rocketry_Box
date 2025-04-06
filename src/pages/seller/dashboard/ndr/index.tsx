import { Button } from "@/components/ui/button";
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
import { useState, useEffect } from "react";
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
            {data.length === 0 ? (
                <div className="py-12 text-center">
                    <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Search className="h-6 w-6 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No results found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Try adjusting your search query to find what you're looking for.
                    </p>
                </div>
            ) : (
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
            )}

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
        orderDate: item.orderDate || item.order_date,
        courier: item.courier || item.courier_name,
        customer: item.customer || item.customer_name,
        attempts: item.attempts || 0,
        lastAttemptDate: item.lastAttemptDate || item.last_attempt_date || "-",
        status: item.status,
        reason: item.reason || item.ndr_reason,
        action: item.action || item.recommended_action || "",
        address: item.address || item.delivery_address,
    }));
};

// Mock data for testing - keep this when integrating with backend
const mockNDRData = {
    all: [
        {
            awb: "123456789",
            order_date: "2024-03-15",
            courier_name: "Blue Dart",
            customer_name: "John Doe",
            attempts: 2,
            last_attempt_date: "2024-03-18",
            status: "Action Required",
            ndr_reason: "Customer not available",
            recommended_action: "Call customer",
            id: "ndr_123",
            delivery_address: {
                fullName: "John Doe",
                contactNumber: "9876543210",
                addressLine1: "123 Main Street",
                addressLine2: "Apartment 4B",
                pincode: "110001",
                city: "New Delhi",
                state: "Delhi"
            }
        },
        {
            awb: "987654321",
            order_date: "2024-03-14",
            courier_name: "DTDC",
            customer_name: "Jane Smith",
            attempts: 1,
            last_attempt_date: "2024-03-17",
            status: "Action Requested",
            ndr_reason: "Address not found",
            recommended_action: "Verify address",
            id: "ndr_456",
            delivery_address: {
                fullName: "Jane Smith",
                contactNumber: "8765432109",
                addressLine1: "456 Oak Avenue",
                pincode: "400001",
                city: "Mumbai",
                state: "Maharashtra"
            }
        },
    ],
    "action-required": [
        {
            awb: "123456789",
            order_date: "2024-03-15",
            courier_name: "Blue Dart",
            customer_name: "John Doe",
            attempts: 2,
            last_attempt_date: "2024-03-18",
            status: "Action Required",
            ndr_reason: "Customer not available",
            recommended_action: "Call customer",
            id: "ndr_123",
            delivery_address: {
                fullName: "John Doe",
                contactNumber: "9876543210",
                addressLine1: "123 Main Street",
                addressLine2: "Apartment 4B",
                pincode: "110001",
                city: "New Delhi",
                state: "Delhi"
            }
        },
        {
            awb: "456789123",
            order_date: "2024-03-16",
            courier_name: "FedEx",
            customer_name: "Alice Johnson",
            attempts: 3,
            last_attempt_date: "2024-03-19",
            status: "Action Required",
            ndr_reason: "Wrong address",
            recommended_action: "Update address",
            id: "ndr_789",
            delivery_address: {
                fullName: "Alice Johnson",
                contactNumber: "7654321098",
                addressLine1: "789 Pine Street",
                pincode: "500001",
                city: "Hyderabad",
                state: "Telangana"
            }
        },
    ],
    "action-requested": [
        {
            awb: "987654321",
            order_date: "2024-03-14",
            courier_name: "DTDC",
            customer_name: "Jane Smith",
            attempts: 1,
            last_attempt_date: "2024-03-17",
            status: "Action Requested",
            ndr_reason: "Address not found",
            recommended_action: "Verify address",
            id: "ndr_456",
            delivery_address: {
                fullName: "Jane Smith",
                contactNumber: "8765432109",
                addressLine1: "456 Oak Avenue",
                pincode: "400001",
                city: "Mumbai",
                state: "Maharashtra"
            }
        },
        {
            awb: "654321987",
            order_date: "2024-03-13",
            courier_name: "DHL",
            customer_name: "Bob Wilson",
            attempts: 2,
            last_attempt_date: "2024-03-16",
            status: "Action Requested",
            ndr_reason: "Phone not reachable",
            recommended_action: "Update phone",
            id: "ndr_321",
            delivery_address: {
                fullName: "Bob Wilson",
                contactNumber: "6543210987",
                addressLine1: "321 Elm Street",
                landmark: "Near City Park",
                pincode: "600001",
                city: "Chennai",
                state: "Tamil Nadu"
            }
        },
    ],
    "in-transit": [
        {
            awb: "246813579",
            order_date: "2024-03-20",
            courier_name: "Delhivery",
            customer_name: "Michael Brown",
            attempts: 0,
            last_attempt_date: "-",
            status: "In Transit",
            ndr_reason: "Package in transit",
            recommended_action: "Monitor status",
            id: "ndr_246"
        },
        {
            awb: "135792468",
            order_date: "2024-03-19",
            courier_name: "Ekart",
            customer_name: "Sarah Davis",
            attempts: 0,
            last_attempt_date: "-",
            status: "In Transit",
            ndr_reason: "Out for delivery",
            recommended_action: "Track package",
            id: "ndr_135"
        },
        {
            awb: "975310864",
            order_date: "2024-03-18",
            courier_name: "Blue Dart",
            customer_name: "David Miller",
            attempts: 0,
            last_attempt_date: "-",
            status: "In Transit",
            ndr_reason: "Hub transfer",
            recommended_action: "Monitor status",
            id: "ndr_975"
        },
    ],
    "ofd": [
        {
            awb: "864209753",
            order_date: "2024-03-21",
            courier_name: "FedEx",
            customer_name: "Emma Wilson",
            attempts: 1,
            last_attempt_date: "2024-03-21",
            status: "Out for Delivery",
            ndr_reason: "First attempt",
            recommended_action: "Delivery expected",
            id: "ndr_864"
        },
        {
            awb: "753951852",
            order_date: "2024-03-21",
            courier_name: "DHL",
            customer_name: "Chris Taylor",
            attempts: 1,
            last_attempt_date: "2024-03-21",
            status: "Out for Delivery",
            ndr_reason: "Second attempt",
            recommended_action: "Delivery expected",
            id: "ndr_753"
        },
        {
            awb: "159357852",
            order_date: "2024-03-21",
            courier_name: "DTDC",
            customer_name: "Linda Anderson",
            attempts: 2,
            last_attempt_date: "2024-03-21",
            status: "Out for Delivery",
            ndr_reason: "Final attempt",
            recommended_action: "Priority delivery",
            id: "ndr_159"
        },
    ],
    "delivered": [
        {
            awb: "951753852",
            order_date: "2024-03-17",
            courier_name: "Blue Dart",
            customer_name: "Peter Parker",
            attempts: 1,
            last_attempt_date: "2024-03-20",
            status: "Delivered",
            ndr_reason: "Successfully delivered",
            recommended_action: "Completed",
            id: "ndr_951"
        },
        {
            awb: "357159852",
            order_date: "2024-03-16",
            courier_name: "Delhivery",
            customer_name: "Mary Jane",
            attempts: 2,
            last_attempt_date: "2024-03-19",
            status: "Delivered",
            ndr_reason: "Successfully delivered",
            recommended_action: "Completed",
            id: "ndr_357"
        },
        {
            awb: "258147369",
            order_date: "2024-03-15",
            courier_name: "Ekart",
            customer_name: "Harry Osborn",
            attempts: 1,
            last_attempt_date: "2024-03-18",
            status: "Delivered",
            ndr_reason: "Successfully delivered",
            recommended_action: "Completed",
            id: "ndr_258"
        },
        {
            awb: "741852963",
            order_date: "2024-03-14",
            courier_name: "FedEx",
            customer_name: "Gwen Stacy",
            attempts: 3,
            last_attempt_date: "2024-03-17",
            status: "Delivered",
            ndr_reason: "Successfully delivered",
            recommended_action: "Completed",
            id: "ndr_741"
        },
    ]
};

// API service functions for backend integration
const fetchNDRData = async (status?: string) => {
    // When ready for backend integration, uncomment this code and remove the mock data
    try {
        // Toggle between API and mock data with USE_MOCK_DATA
        const USE_MOCK_DATA = true;
        
        if (USE_MOCK_DATA) {
            // Return mock data with a slight delay to simulate network request
            return new Promise(resolve => {
                setTimeout(() => {
                    if (status && status !== 'all') {
                        resolve(mockNDRData[status as keyof typeof mockNDRData] || []);
                    } else {
                        resolve(mockNDRData.all);
                    }
                }, 300);
            });
        }
        
        // Real API call
        const endpoint = status && status !== 'all' 
            ? `/api/v1/seller/ndr?status=${status}` 
            : '/api/v1/seller/ndr';
            
        const response = await fetch(endpoint, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('seller_token')}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch NDR data');
        }
        
        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error('Error fetching NDR data:', error);
        throw error;
    }
};

const SellerNDRPage = () => {

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<string>("all");
    const [ndrData, setNdrData] = useState<Record<string, any[]>>({
        all: [],
        "action-required": [],
        "action-requested": [],
        "in-transit": [],
        "ofd": [],
        "delivered": []
    });
    const [loading, setLoading] = useState<Record<string, boolean>>({
        all: false,
        "action-required": false,
        "action-requested": false,
        "in-transit": false,
        "ofd": false,
        "delivered": false
    });
    const [error, setError] = useState<Record<string, string | null>>({
        all: null,
        "action-required": null,
        "action-requested": null,
        "in-transit": null,
        "ofd": null,
        "delivered": null
    });
    
    // Listen for navbar search events
    useEffect(() => {
        const handleNavbarSearch = (event: CustomEvent<{query: string}>) => {
            setSearchQuery(event.detail.query);
        };
        
        // Add event listener for custom navbar search event
        window.addEventListener('navbarSearch', handleNavbarSearch as EventListener);
        
        // Cleanup
        return () => {
            window.removeEventListener('navbarSearch', handleNavbarSearch as EventListener);
        };
    }, []);

    // Function to load NDR data for a specific tab
    const loadNDRData = async (tabId: string) => {
        if (ndrData[tabId].length > 0 && !error[tabId]) {
            return; // Data already loaded
        }
        
        setLoading(prev => ({ ...prev, [tabId]: true }));
        setError(prev => ({ ...prev, [tabId]: null }));
        
        try {
            const data = await fetchNDRData(tabId);
            setNdrData(prev => ({ ...prev, [tabId]: data as any[] }));
        } catch (err) {
            setError(prev => ({ 
                ...prev, 
                [tabId]: err instanceof Error ? err.message : 'An error occurred' 
            }));
        } finally {
            setLoading(prev => ({ ...prev, [tabId]: false }));
        }
    };
    
    // Load initial data when component mounts
    useEffect(() => {
        loadNDRData('all');
    }, []);
    
    // Load data when tab changes
    const handleTabChange = (value: string) => {
        setActiveTab(value);
        loadNDRData(value);
    };
    
    const filterDataBySearch = (data: any[]) => {
        if (!searchQuery.trim()) return data;
        
        const query = searchQuery.toLowerCase().trim();
        return data.filter(item => 
            (item.awb?.toLowerCase() || '').includes(query) ||
            (item.customer?.toLowerCase() || item.customer_name?.toLowerCase() || '').includes(query) ||
            (item.courier?.toLowerCase() || item.courier_name?.toLowerCase() || '').includes(query) ||
            (item.reason?.toLowerCase() || item.ndr_reason?.toLowerCase() || '').includes(query)
        );
    };

    const handleDownloadNDR = async () => {
        // Generate a unique ID (you might want to use a proper ID generation method)
        const uniqueId = Date.now();

        // Create a workbook
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('NDR Data');

        // Add headers
        worksheet.columns = [
            { header: 'AWB', key: 'awb' },
            { header: 'Order Date', key: 'order_date' },
            { header: 'Courier', key: 'courier_name' },
            { header: 'Customer', key: 'customer_name' },
            { header: 'Attempts', key: 'attempts' },
            { header: 'Last Attempt Date', key: 'last_attempt_date' },
            { header: 'Status', key: 'status' },
            { header: 'Reason', key: 'ndr_reason' },
            { header: 'Action', key: 'recommended_action' },
        ];

        try {
            // When integrating with backend, fetch data from API instead of using mock
            // const data = await fetchNDRData(activeTab);
            const data = ndrData[activeTab];
            
            // Add data
            worksheet.addRows(data);
            
            // Generate and download file
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ndr-export-${uniqueId}.xlsx`;
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error exporting NDR data:', error);
            // Here you would typically show a toast or alert to the user
        }
    };

    // Helper to render tab content with loading and error states
    const renderTabContent = (tabId: string, showActions = false) => {
        if (loading[tabId]) {
            return (
                <div className="w-full py-12 text-center">
                    <div className="inline-block animate-spin h-8 w-8 border-4 border-violet-200 rounded-full border-t-violet-600"></div>
                    <p className="mt-4 text-gray-600">Loading NDR data...</p>
                </div>
            );
        }
        
        if (error[tabId]) {
            return (
                <div className="w-full py-12 text-center">
                    <div className="bg-red-100 text-red-800 p-4 rounded-md inline-flex flex-col items-center">
                        <p className="font-medium">Failed to load NDR data</p>
                        <p className="text-sm mt-1">{error[tabId]}</p>
                        <Button 
                            variant="outline" 
                            className="mt-3"
                            onClick={() => loadNDRData(tabId)}
                        >
                            Retry
                        </Button>
                    </div>
                </div>
            );
        }
        
        return (
            <NDRTable 
                data={mapToNDRData(filterDataBySearch(ndrData[tabId]))} 
                showActions={showActions} 
            />
        );
    };

    return (
        <div className="space-y-8 overflow-hidden">
            <h1 className="text-xl lg:text-2xl font-semibold">
                NDR
            </h1>

            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
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
                    <div className="flex-1">
                        {searchQuery.trim() && (
                            <div className="bg-violet-100 text-violet-800 px-3 py-1.5 rounded-md inline-flex items-center gap-2">
                                <Search className="h-4 w-4" />
                                <span className="text-sm">
                                    Showing results for "{searchQuery}"
                                    <button 
                                        className="ml-2 underline text-violet-600 hover:text-violet-900"
                                        onClick={() => setSearchQuery("")}
                                    >
                                        Clear
                                    </button>
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="purple"
                            className="text-xs md:text-sm"
                            onClick={handleDownloadNDR}
                            disabled={loading[activeTab] || !!error[activeTab] || ndrData[activeTab].length === 0}
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
                            {renderTabContent('all')}
                        </TabsContent>

                        <TabsContent value="action-required" className="mt-2 min-w-full">
                            {renderTabContent('action-required', true)}
                        </TabsContent>

                        <TabsContent value="action-requested" className="mt-2 min-w-full">
                            {renderTabContent('action-requested')}
                        </TabsContent>

                        <TabsContent value="in-transit" className="mt-2 min-w-full">
                            {renderTabContent('in-transit')}
                        </TabsContent>

                        <TabsContent value="ofd" className="mt-2 min-w-full">
                            {renderTabContent('ofd')}
                        </TabsContent>

                        <TabsContent value="delivered" className="mt-2 min-w-full">
                            {renderTabContent('delivered')}
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