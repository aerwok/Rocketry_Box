import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Search, Filter, ArrowUp, ArrowDown, ArrowUpDown, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Order {
    date: string;
    awb: string;
    consigne: string;
    product: string;
    courier: string;
    amount: number;
    label: string;
    status: string;
    edd: string;
    pdfUrl: string;
}
// TODO: Show buttons for awb number and print label which will dowload pdf and for awb number show button to track order modal popup
const orders: Order[] = [
    {
        date: "18/12/2024",
        awb: "1023213433",
        consigne: "Shivam Gupta",
        product: "Book",
        courier: "Blur dirt air",
        amount: 200,
        label: "Print",
        status: "Booked",
        edd: "23/12/2024",
        pdfUrl: "/docs/text.pdf",
    },
    {
        date: "17/12/2024",
        awb: "1023213434",
        consigne: "Rahul Kumar",
        product: "Electronics",
        courier: "Blur dirt air",
        amount: 1500,
        label: "Print",
        status: "Booked",
        edd: "22/12/2024",
        pdfUrl: "/docs/text.pdf",
    },
    {
        date: "16/12/2024",
        awb: "1023213435",
        consigne: "Priya Sharma",
        product: "Clothing",
        courier: "Blur dirt air",
        amount: 800,
        label: "Print",
        status: "Delivered",
        edd: "21/12/2024",
        pdfUrl: "/docs/text.pdf",
    },
    {
        date: "15/12/2024",
        awb: "1023213436",
        consigne: "Amit Patel",
        product: "Mobile",
        courier: "Blur dirt air",
        amount: 12000,
        label: "Print",
        status: "In Transit",
        edd: "20/12/2024",
        pdfUrl: "/docs/text.pdf",
    },
    {
        date: "14/12/2024",
        awb: "1023213437",
        consigne: "Neha Singh",
        product: "Laptop",
        courier: "Blur dirt air",
        amount: 45000,
        label: "Print",
        status: "Delivered",
        edd: "19/12/2024",
        pdfUrl: "/docs/text.pdf",
    },
    {
        date: "13/12/2024",
        awb: "1023213438",
        consigne: "Rajesh Kumar",
        product: "Furniture",
        courier: "Blur dirt air",
        amount: 25000,
        label: "Print",
        status: "Processing",
        edd: "18/12/2024",
        pdfUrl: "/docs/text.pdf",
    },
    {
        date: "12/12/2024",
        awb: "1023213439",
        consigne: "Meera Reddy",
        product: "Cosmetics",
        courier: "Blur dirt air",
        amount: 1800,
        label: "Print",
        status: "Delivered",
        edd: "17/12/2024",
        pdfUrl: "/docs/text.pdf",
    },
    {
        date: "11/12/2024",
        awb: "1023213440",
        consigne: "Vikram Singh",
        product: "Sports Equipment",
        courier: "Blur dirt air",
        amount: 3500,
        label: "Print",
        status: "In Transit",
        edd: "16/12/2024",
        pdfUrl: "/docs/text.pdf",
    },
    {
        date: "10/12/2024",
        awb: "1023213441",
        consigne: "Anita Desai",
        product: "Kitchen Appliance",
        courier: "Blur dirt air",
        amount: 5000,
        label: "Print",
        status: "Booked",
        edd: "15/12/2024",
        pdfUrl: "/docs/text.pdf",
    },
    {
        date: "09/12/2024",
        awb: "1023213442",
        consigne: "Suresh Menon",
        product: "Camera",
        courier: "Blur dirt air",
        amount: 28000,
        label: "Print",
        status: "Delivered",
        edd: "14/12/2024",
        pdfUrl: "/docs/text.pdf",
    },
    {
        date: "08/12/2024",
        awb: "1023213443",
        consigne: "Kavita Sharma",
        product: "Watch",
        courier: "Blur dirt air",
        amount: 15000,
        label: "Print",
        status: "Processing",
        edd: "13/12/2024",
        pdfUrl: "/docs/text.pdf",
    },
    {
        date: "07/12/2024",
        awb: "1023213444",
        consigne: "Deepak Verma",
        product: "Headphones",
        courier: "Blur dirt air",
        amount: 2000,
        label: "Print",
        status: "Booked",
        edd: "12/12/2024",
        pdfUrl: "/docs/text.pdf",
    },
];

// API functions for future implementation
// --------------------------------------
// async function fetchOrders(page: number, limit: number, searchQuery: string, sortField: string, sortDirection: string): Promise<{orders: Order[], total: number}> {
//   try {
//     const queryParams = new URLSearchParams({
//       page: page.toString(),
//       limit: limit.toString(),
//       query: searchQuery,
//       sortField: sortField || '',
//       sortDirection: sortDirection || ''
//     });
//     
//     const response = await fetch(`/api/customer/orders?${queryParams}`);
//     if (!response.ok) throw new Error('Failed to fetch orders');
//     
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error('Error fetching orders:', error);
//     throw error;
//   }
// }
//
// async function downloadOrderLabel(awb: string): Promise<Blob> {
//   try {
//     const response = await fetch(`/api/customer/orders/${awb}/label`);
//     if (!response.ok) throw new Error('Failed to download label');
//     
//     const blob = await response.blob();
//     return blob;
//   } catch (error) {
//     console.error('Error downloading label:', error);
//     throw error;
//   }
// }
// --------------------------------------

const ITEMS_PER_PAGE = 10;

const CustomerOrdersPage = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortConfig, setSortConfig] = useState<{ key: string | null; direction: 'asc' | 'desc' | null }>({
        key: null,
        direction: null
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [orderData, setOrderData] = useState<Order[]>([]);
    const [totalOrders, setTotalOrders] = useState(0);
    const [downloadingLabel, setDownloadingLabel] = useState<string | null>(null);

    // Fetch orders data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // For development we'll use the dummy data
                // When API is ready, this section will be replaced with:
                // const data = await fetchOrders(
                //   currentPage, 
                //   ITEMS_PER_PAGE, 
                //   searchQuery, 
                //   sortConfig.key || '', 
                //   sortConfig.direction || ''
                // );
                // setOrderData(data.orders);
                // setTotalOrders(data.total);
                
                // Simulate API call delay
                await new Promise(resolve => setTimeout(resolve, 800));
                
                // Filter orders based on search query
                const filteredOrders = orders.filter(order =>
                    order.awb.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    order.consigne.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    order.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    order.courier.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    order.status.toLowerCase().includes(searchQuery.toLowerCase())
                );
                
                // Sort orders based on sort config
                let sortedOrders = [...filteredOrders];
                if (sortConfig.key && sortConfig.direction) {
                    sortedOrders.sort((a, b) => {
                        if (a[sortConfig.key as keyof typeof a] < b[sortConfig.key as keyof typeof b]) {
                            return sortConfig.direction === 'asc' ? -1 : 1;
                        }
                        if (a[sortConfig.key as keyof typeof a] > b[sortConfig.key as keyof typeof b]) {
                            return sortConfig.direction === 'asc' ? 1 : -1;
                        }
                        return 0;
                    });
                }
                
                // Calculate pagination
                const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
                const paginatedOrders = sortedOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE);
                
                setOrderData(paginatedOrders);
                setTotalOrders(filteredOrders.length);
            } catch (err) {
                console.error("Error fetching orders:", err);
                setError("Failed to load orders. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, [currentPage, searchQuery, sortConfig]);

    const handleSort = (key: string) => {
        setSortConfig(prevConfig => {
            if (prevConfig.key === key) {
                if (prevConfig.direction === 'asc') {
                    return { key, direction: 'desc' };
                } else if (prevConfig.direction === 'desc') {
                    return { key: null, direction: null };
                }
            }
            return { key, direction: 'asc' };
        });
    };

    const getSortIcon = (key: string) => {
        if (sortConfig.key !== key) return <ArrowUpDown className="h-4 w-4" />;
        return sortConfig.direction === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
    };

    const handleDownloadPDF = async (pdfUrl: string, awb: string) => {
        try {
            setDownloadingLabel(awb);
            
            // When API is ready, this will be replaced with:
            // const blob = await downloadOrderLabel(awb);
            
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // For development, we'll just open the dummy PDF in a new tab
            window.open(pdfUrl, '_blank');
            
            toast.success("Label downloaded successfully");
        } catch (err) {
            console.error("Error downloading label:", err);
            toast.error("Failed to download label. Please try again.");
        } finally {
            setDownloadingLabel(null);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1); // Reset to first page when searching
    };

    // Calculate total pages
    const totalPages = Math.ceil(totalOrders / ITEMS_PER_PAGE);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <h1 className="text-2xl lg:text-3xl font-semibold">Orders History</h1>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Link to="/customer/create-order">
                            <Button className="bg-main text-white hover:bg-main/90">Create New Order</Button>
                        </Link>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between gap-4">
                    <form onSubmit={handleSearch} className="relative w-full md:max-w-xs">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                            placeholder="Search by AWB, name, product..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>
                    
                    {error && (
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.location.reload()}
                            className="text-red-600 border-red-300 hover:bg-red-50"
                        >
                            <RefreshCw className="h-4 w-4 mr-1" />
                            Retry Loading
                        </Button>
                    )}
                </div>
                
                {/* Error display */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5" />
                            <span>{error}</span>
                        </div>
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setError(null)}
                            className="border-red-300 hover:bg-red-100"
                        >
                            Dismiss
                        </Button>
                    </div>
                )}

                {/* Orders Table */}
                <div className="border rounded-lg overflow-hidden">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-[400px]">
                            <Loader2 className="h-8 w-8 animate-spin text-main mb-4" />
                            <p className="text-muted-foreground">Loading orders...</p>
                        </div>
                    ) : orderData.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[400px]">
                            <p className="text-muted-foreground mb-4">No orders found</p>
                            {searchQuery && (
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="mt-2"
                                    onClick={() => setSearchQuery("")}
                                >
                                    Clear search
                                </Button>
                            )}
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead onClick={() => handleSort("date")} className="cursor-pointer">
                                        Date {getSortIcon("date")}
                                    </TableHead>
                                    <TableHead onClick={() => handleSort("awb")} className="cursor-pointer">
                                        AWB Number {getSortIcon("awb")}
                                    </TableHead>
                                    <TableHead onClick={() => handleSort("consigne")} className="cursor-pointer">
                                        Consigne {getSortIcon("consigne")}
                                    </TableHead>
                                    <TableHead onClick={() => handleSort("product")} className="cursor-pointer hidden md:table-cell">
                                        Product {getSortIcon("product")}
                                    </TableHead>
                                    <TableHead onClick={() => handleSort("courier")} className="cursor-pointer hidden md:table-cell">
                                        Courier {getSortIcon("courier")}
                                    </TableHead>
                                    <TableHead onClick={() => handleSort("amount")} className="cursor-pointer hidden lg:table-cell">
                                        Amount {getSortIcon("amount")}
                                    </TableHead>
                                    <TableHead>Label</TableHead>
                                    <TableHead onClick={() => handleSort("status")} className="cursor-pointer">
                                        Status {getSortIcon("status")}
                                    </TableHead>
                                    <TableHead onClick={() => handleSort("edd")} className="cursor-pointer hidden lg:table-cell">
                                        EDD {getSortIcon("edd")}
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orderData.map((order) => (
                                    <TableRow key={order.awb}>
                                        <TableCell className="whitespace-nowrap">{order.date}</TableCell>
                                        <TableCell>
                                            <Link to={`/customer/orders/${order.awb}`} className="text-main hover:underline">
                                                {order.awb}
                                            </Link>
                                        </TableCell>
                                        <TableCell>{order.consigne}</TableCell>
                                        <TableCell className="hidden md:table-cell">{order.product}</TableCell>
                                        <TableCell className="hidden md:table-cell">{order.courier}</TableCell>
                                        <TableCell className="hidden lg:table-cell">₹{order.amount}</TableCell>
                                        <TableCell>
                                            <button 
                                                className="text-main hover:underline"
                                                onClick={() => handleDownloadPDF(order.pdfUrl, order.awb)}
                                                disabled={downloadingLabel === order.awb}
                                            >
                                                {downloadingLabel === order.awb ? (
                                                    <span className="flex items-center">
                                                        <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                                        Downloading...
                                                    </span>
                                                ) : (
                                                    order.label
                                                )}
                                            </button>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                order.status === "Delivered" ? "bg-green-100 text-green-700" :
                                                order.status === "Booked" ? "bg-blue-100 text-blue-700" :
                                                order.status === "In Transit" ? "bg-yellow-100 text-yellow-700" :
                                                order.status === "Processing" ? "bg-purple-100 text-purple-700" :
                                                "bg-gray-100 text-gray-700"
                                            }`}>
                                                {order.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="hidden lg:table-cell">{order.edd}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>
                
                {/* Pagination */}
                {!loading && orderData.length > 0 && (
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, totalOrders)} of {totalOrders} orders
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                                disabled={currentPage === 1 || loading}
                            >
                                Previous
                            </Button>
                            <span className="text-sm">
                                Page {currentPage} of {totalPages || 1}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
                                disabled={currentPage >= totalPages || loading}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerOrdersPage; 