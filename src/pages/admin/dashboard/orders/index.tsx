import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ArrowUpDown, Download, Filter, Search, Tag, Truck, X, ArrowLeft, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { WarehouseBookingValues, warehouseBookingSchema } from "@/lib/validations/order";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import AdminShippingOptionsModal from "@/components/admin/shipping-options-modal";
import DateRangePicker from "@/components/admin/date-range-picker";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

type OrderStatus = "Active" | "Inactive";
type TabType = "seller" | "customer";
type SortField = "id" | "name" | "email" | "status" | "registrationDate" | "transactionAmount" | "senderName" | "orderId";
type SortOrder = "asc" | "desc";

interface Order {
    id: string;
    orderId: string;
    name: string;
    email: string;
    status: OrderStatus;
    registrationDate: string;
    transactionAmount: string;
    senderName: string;
}

interface ExportHistory {
    fileName: string;
    startDate: string;
    endDate: string;
    filterApplied: string;
    exportDate: string;
    exportCount: string;
    generatedBy: string;
    status: string;
}

const SELLER_ORDERS_DATA: Order[] = [];

const CUSTOMER_ORDERS_DATA: Order[] = [];

const EXPORT_HISTORY: ExportHistory[] = [];

const getStatusStyle = (status: OrderStatus) => {
    return {
        Active: "bg-green-50 text-green-700",
        Inactive: "bg-neutral-100 text-neutral-700",
    }[status];
};

const getPaymentStatusStyle = (status: string) => {
    const styles = {
        "Paid": "bg-green-100 text-green-800",
        "Pending": "bg-yellow-100 text-yellow-800",
        "Failed": "bg-red-100 text-red-800"
    };
    return styles[status as keyof typeof styles] || "bg-gray-100 text-gray-800";
};

type SortConfig = {
    key: keyof Order | null;
    direction: "asc" | "desc" | null;
};

const AdminOrdersPage = () => {

    const [activeTab, setActiveTab] = useState<TabType>("seller");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [sortField, setSortField] = useState<SortField>("id");
    const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
    const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
    const [bookingModalOpen, setBookingModalOpen] = useState(false);
    const [exportHistoryOpen, setExportHistoryOpen] = useState(false);
    const [shippingModalOpen, setShippingModalOpen] = useState(false);
    const [selectedOrderForShipping, setSelectedOrderForShipping] = useState<string>("");
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    const form = useForm<WarehouseBookingValues>({
        resolver: zodResolver(warehouseBookingSchema),
        defaultValues: {
            warehouse: "",
            rtoWarehouse: "",
            shippingMode: "",
            courier: "",
        },
    });

    const onSubmit = (data: WarehouseBookingValues) => {
        console.log(data);
        toast.success("Orders booked successfully");
        setBookingModalOpen(false);
        setSelectedOrders([]);
        form.reset();
    };

    const currentData = activeTab === "seller" ? SELLER_ORDERS_DATA : CUSTOMER_ORDERS_DATA;

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortOrder("asc");
        }
    };

    const handleSelectOrder = (orderId: string) => {
        setSelectedOrders(prev => {
            if (prev.includes(orderId)) {
                return prev.filter(id => id !== orderId);
            }
            return [...prev, orderId];
        });
    };

    const handleCancel = () => {
        if (selectedOrders.length === 0) {
            toast.error("Please select orders to cancel");
            return;
        }
        toast.success("Orders cancelled successfully");
        setSelectedOrders([]);
    };

    const handleAddTag = () => {
        if (selectedOrders.length === 0) {
            toast.error("Please select orders to add tag");
            return;
        }
        toast.success("Tags added successfully");
        setSelectedOrders([]);
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedOrders(currentData.map(order => order.id));
        } else {
            setSelectedOrders([]);
        }
    };

    const sortedData = [...currentData].sort((a, b) => {
        const aValue = String(a[sortField] ?? "");
        const bValue = String(b[sortField] ?? "");
        return sortOrder === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
    });

    const handleShipOrder = (orderId: string) => {
        setSelectedOrderForShipping(orderId);
        setShippingModalOpen(true);
    };

    const handleShipSelected = (courier: string, warehouse: string, mode: string) => {
        toast.success("Order shipped successfully");
        setShippingModalOpen(false);
        setSelectedOrderForShipping("");
    };

    const handlePreviousPage = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNextPage = () => {
        if (page < totalItems / pageSize) setPage(page + 1);
    };

    const handleFilter = () => {
        // Implement filter functionality
    };

    const handleExport = () => {
        toast.success("Export started. Your file will be ready soon.");
        // Implement export functionality
    };

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                // Replace with actual API endpoint
                // const response = await fetch(`/api/orders?page=${page}&pageSize=${pageSize}`);
                // if (!response.ok) throw new Error('Failed to fetch orders');
                // const data = await response.json();
                // setTotalItems(data.totalCount);
                
                // Simulating API response while backend is not ready
                setTimeout(() => {
                    // setTotalItems(data.totalCount);
                    setLoading(false);
                }, 1000);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error occurred');
                toast.error("Failed to load orders data");
                setLoading(false);
            }
        };
        
        fetchOrders();
    }, [page, pageSize]);

    const displayedOrders = sortedData.slice((page - 1) * pageSize, page * pageSize);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500 p-4 text-center border rounded-lg shadow-sm">
                <p>Error loading orders: {error}</p>
                <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => window.location.reload()}
                >
                    Retry
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl lg:text-2xl font-semibold">
                        Order Management
                    </h1>
                    <p className="text-base lg:text-lg text-muted-foreground mt-1">
                        Manage order accounts and permissions
                    </p>
                </div>
                <Button variant="primary">
                    Create order
                </Button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex gap-4">
                    <button
                        onClick={() => setActiveTab("seller")}
                        className={cn(
                            "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                            activeTab === "seller"
                                ? "bg-neutral-200"
                                : "hover:bg-neutral-100"
                        )}
                    >
                        Seller
                    </button>
                    <button
                        onClick={() => setActiveTab("customer")}
                        className={cn(
                            "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                            activeTab === "customer"
                                ? "bg-neutral-200"
                                : "hover:bg-neutral-100"
                        )}
                    >
                        Customer
                    </button>
                </div>

                {selectedOrders.length > 0 && (
                    <div className="flex items-center gap-2">
                        <Button variant="outline">
                            {selectedOrders.length} selected
                        </Button>
                        <Button
                            variant="primary"
                            className="gap-2"
                            onClick={() => setBookingModalOpen(true)}
                        >
                            <Truck className="size-4" />
                            Book
                        </Button>
                        <Button
                            variant="outline"
                            className="gap-2 bg-red-500 hover:bg-red-600 text-white hover:text-white"
                            onClick={handleCancel}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="outline"
                            className="gap-2 bg-green-500 hover:bg-green-600 text-white hover:text-white"
                            onClick={handleAddTag}
                        >
                            <Tag className="size-4" />
                            Add Tag
                        </Button>
                        <Button
                            variant="outline"
                            className="gap-2"
                            onClick={() => setExportHistoryOpen(true)}
                        >
                            <Download className="size-4" />
                            Export
                        </Button>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-lg">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                        placeholder="Search orders"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 bg-gray-100/50"
                    />
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full md:w-auto">
                <DateRangePicker
                    date={dateRange}
                    setDate={setDateRange}
                />
                
                <Button variant="outline" className="flex items-center gap-2" onClick={handleFilter}>
                    <Filter className="h-4 w-4" />
                    Filter
                </Button>
                
                <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={handleExport}
                >
                    <Download className="h-4 w-4" />
                    Export
                </Button>
            </div>

            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader className="bg-[#F8F0FF]">
                        <TableRow>
                            <TableHead className="w-[50px]">
                                <input
                                    type="checkbox"
                                    className="rounded border-gray-300"
                                    checked={selectedOrders.length === sortedData.length && sortedData.length > 0}
                                    onChange={handleSelectAll}
                                />
                            </TableHead>
                            <TableHead>
                                <div
                                    className="flex items-center gap-1 cursor-pointer"
                                    onClick={() => handleSort("id")}
                                >
                                    User ID
                                    <ArrowUpDown className="size-3" />
                                </div>
                            </TableHead>
                            <TableHead>
                                <div
                                    className="flex items-center gap-1 cursor-pointer"
                                    onClick={() => handleSort("orderId")}
                                >
                                    Order ID
                                    <ArrowUpDown className="size-3" />
                                </div>
                            </TableHead>
                            <TableHead>
                                <div
                                    className="flex items-center gap-1 cursor-pointer"
                                    onClick={() => handleSort("name")}
                                >
                                    Name
                                    <ArrowUpDown className="size-3" />
                                </div>
                            </TableHead>
                            <TableHead>
                                <div
                                    className="flex items-center gap-1 cursor-pointer"
                                    onClick={() => handleSort("email")}
                                >
                                    Email
                                    <ArrowUpDown className="size-3" />
                                </div>
                            </TableHead>
                            <TableHead>
                                <div
                                    className="flex items-center gap-1 cursor-pointer"
                                    onClick={() => handleSort("senderName")}
                                >
                                    Sender's Name
                                    <ArrowUpDown className="size-3" />
                                </div>
                            </TableHead>
                            <TableHead>
                                <div
                                    className="flex items-center gap-1 cursor-pointer"
                                    onClick={() => handleSort("status")}
                                >
                                    Status
                                    <ArrowUpDown className="size-3" />
                                </div>
                            </TableHead>
                            <TableHead>
                                <div
                                    className="flex items-center gap-1 cursor-pointer"
                                    onClick={() => handleSort("registrationDate")}
                                >
                                    Registration Date
                                    <ArrowUpDown className="size-3" />
                                </div>
                            </TableHead>
                            <TableHead>
                                <div
                                    className="flex items-center gap-1 cursor-pointer"
                                    onClick={() => handleSort("transactionAmount")}
                                >
                                    Transaction Amount
                                    <ArrowUpDown className="size-3" />
                                </div>
                            </TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {displayedOrders.map((order) => (
                            <TableRow key={order.id} className="hover:bg-neutral-50">
                                <TableCell>
                                    <input
                                        type="checkbox"
                                        checked={selectedOrders.includes(order.id)}
                                        onChange={() => handleSelectOrder(order.id)}
                                        className="rounded border-gray-300"
                                    />
                                </TableCell>
                                <TableCell>
                                    {order.id}
                                </TableCell>
                                <TableCell>
                                    <Link
                                        to={`/admin/dashboard/orders/${order.orderId}`}
                                        className="text-purple-600 hover:underline font-medium"
                                    >
                                        {order.orderId}
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    {order.name}
                                </TableCell>
                                <TableCell>
                                    {order.email}
                                </TableCell>
                                <TableCell>
                                    {order.senderName}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <div className={cn(
                                            "w-2 h-2 rounded-full",
                                            order.status === "Active" ? "bg-green-500" : "bg-neutral-400"
                                        )} />
                                        <span className={cn(
                                            "px-2 py-1 rounded-md text-sm",
                                            getStatusStyle(order.status)
                                        )}>
                                            {order.status}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {order.registrationDate}
                                </TableCell>
                                <TableCell>
                                    {order.transactionAmount}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-2"
                                        onClick={() => handleShipOrder(order.orderId)}
                                    >
                                        <Truck className="size-4" />
                                        Ship
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {totalItems > 0 && (
                <div className="flex items-center justify-between py-4">
                    <div className="text-sm text-muted-foreground">
                        Showing {Math.min((page - 1) * pageSize + 1, totalItems)} to {Math.min(page * pageSize, totalItems)} of {totalItems} orders
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={handlePreviousPage}
                            disabled={page === 1}
                            className="flex items-center gap-1"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Previous
                        </Button>
                        
                        <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(totalItems / pageSize, 5) }, (_, i) => {
                                let pageNum = i + 1;
                                
                                if (totalItems / pageSize > 5 && page > 3) {
                                    pageNum = page - 3 + i;
                                }
                                
                                if (pageNum <= totalItems / pageSize) {
                                    return (
                                        <Button
                                            key={pageNum}
                                            variant={pageNum === page ? "default" : "outline"}
                                            size="sm"
                                            className="w-9 h-9"
                                            onClick={() => setPage(pageNum)}
                                        >
                                            {pageNum}
                                        </Button>
                                    );
                                }
                                return null;
                            })}
                        </div>
                        
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={handleNextPage}
                            disabled={page >= totalItems / pageSize}
                            className="flex items-center gap-1"
                        >
                            Next
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}

            <Dialog open={bookingModalOpen} onOpenChange={setBookingModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Warehouse & Shipping Mode</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="warehouse"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Warehouse</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select warehouse" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="tes5">tes5</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="rtoWarehouse"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>RTO Warehouse</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select RTO warehouse" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="tes5">tes5</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="shippingMode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Shipping Mode</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select shipping mode" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="standard">Standard</SelectItem>
                                                <SelectItem value="express">Express</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="courier"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Courier (Optional)</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select courier" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="fedex">FedEx</SelectItem>
                                                <SelectItem value="dhl">DHL</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-end gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setBookingModalOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" variant="primary">
                                    Save & Ship
                                </Button>
                            </div>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            <Dialog open={exportHistoryOpen} onOpenChange={setExportHistoryOpen}>
                <DialogContent showCloseButton={false} className="max-w-4xl">
                    <DialogHeader className="flex flex-row items-center justify-between pr-0">
                        <DialogTitle>Export History</DialogTitle>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-auto p-2"
                            onClick={() => setExportHistoryOpen(false)}
                        >
                            <X className="size-4" />
                        </Button>
                    </DialogHeader>
                    <div className="max-h-[400px] overflow-auto">
                        <Table>
                            <TableHeader className="sticky top-0 bg-[#F8F0FF]">
                                <TableRow>
                                    <TableHead>File Name</TableHead>
                                    <TableHead>Start Date</TableHead>
                                    <TableHead>End Date</TableHead>
                                    <TableHead>Filter Applied</TableHead>
                                    <TableHead>Export Date</TableHead>
                                    <TableHead>Export Count</TableHead>
                                    <TableHead>Generated By</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {EXPORT_HISTORY.map((item) => (
                                    <TableRow key={item.fileName}>
                                        <TableCell>{item.fileName}</TableCell>
                                        <TableCell>{item.startDate}</TableCell>
                                        <TableCell>{item.endDate}</TableCell>
                                        <TableCell>{item.filterApplied}</TableCell>
                                        <TableCell>{item.exportDate}</TableCell>
                                        <TableCell>{item.exportCount}</TableCell>
                                        <TableCell>{item.generatedBy}</TableCell>
                                        <TableCell>
                                            <span className="px-2 py-1 rounded-md text-sm bg-green-50 text-green-700">
                                                {item.status}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </DialogContent>
            </Dialog>

            <AdminShippingOptionsModal
                isOpen={shippingModalOpen}
                onClose={() => setShippingModalOpen(false)}
                orderNumber={selectedOrderForShipping}
                weight={1}
                onShipSelected={handleShipSelected}
            />
        </div>
    );
};

export default AdminOrdersPage; 