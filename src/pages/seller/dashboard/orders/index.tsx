import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { ArrowUpDown, Download, Filter, Search, Tag, Truck, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ShippingOptionsModal } from "@/components/seller/shipping-options-modal";
import { useOrderData } from "@/hooks/useOrderData";
import { Skeleton } from "@/components/ui/skeleton";
import DateRangePicker from "@/components/admin/date-range-picker";
import { DateRange } from "react-day-picker";
import { OrderData } from "@/services/seller-order.service";
import { utils as XLSXUtils, write as XLSXWrite } from 'xlsx';

const allData: OrderData[] = [
    {
        orderId: "ORD-2025-001",
        date: "2025-02-20",
        customer: "Rahul Sharma",
        contact: "9876543210",
        items: [{ name: "Gaming Laptop", sku: "GL001", quantity: 1, price: 97497.00 }],
        amount: "97497.00",
        payment: "COD",
        chanel: "MANUAL",
        weight: "2.5",
        tags: "Gaming",
        action: "Ship",
        whatsapp: "Message Delivered",
        status: "not-booked",
        awbNumber: undefined,
        pincode: "400001"
    },
    {
        orderId: "ORD-2025-002",
        date: "2025-02-19",
        customer: "Priya Patel",
        contact: "9876543211",
        items: [
            { name: "Wireless Mouse", sku: "WM001", quantity: 1, price: 7999.00 },
            { name: "Keyboard", sku: "KB001", quantity: 1, price: 8000.00 }
        ],
        amount: "15999.00",
        payment: "Prepaid",
        chanel: "EXCEL",
        weight: "1.2",
        tags: "Electronics",
        action: "Processing",
        whatsapp: "Message Read",
        status: "processing",
        awbNumber: "AWB123456",
        pincode: "400002"
    },
    {
        orderId: "ORD-2025-003",
        date: "2025-02-19",
        customer: "Amit Kumar",
        contact: "9876543212",
        items: [{ name: "Premium Headphones", sku: "PH001", quantity: 1, price: 49999.00 }],
        amount: "49999.00",
        payment: "COD",
        chanel: "SHOPIFY",
        weight: "3.5",
        tags: "Premium",
        action: "Pending",
        whatsapp: "Order Confirm",
        status: "booked",
        awbNumber: "AWB123457",
        pincode: "400003"
    },
    {
        orderId: "ORD-2025-004",
        date: "2025-02-18",
        customer: "Neha Singh",
        contact: "9876543213",
        items: [
            { name: "Phone Case", sku: "PC001", quantity: 2, price: 999.00 },
            { name: "Screen Guard", sku: "SG001", quantity: 1, price: 11001.00 }
        ],
        amount: "12999.00",
        payment: "Prepaid",
        chanel: "WOOCOMMERCE",
        weight: "1.8",
        tags: "Accessories",
        action: "Processing",
        whatsapp: "Message Read",
        status: "processing",
        awbNumber: "AWB123458",
        pincode: "400004"
    },
    {
        orderId: "ORD-2025-005",
        date: "2025-02-18",
        customer: "Vikram Verma",
        contact: "9876543214",
        items: [{ name: "Bluetooth Speaker", sku: "BS001", quantity: 1, price: 7999.00 }],
        amount: "7999.00",
        payment: "COD",
        chanel: "AMAZON",
        weight: "0.8",
        tags: "Electronics",
        action: "Cancelled",
        whatsapp: "Message Delivered",
        status: "shipment-cancelled",
        awbNumber: "AWB123459",
        pincode: "400005"
    },
    {
        orderId: "ORD-2025-006",
        date: "2025-02-17",
        customer: "Anjali Gupta",
        contact: "9876543215",
        items: [
            { name: "Gaming Mouse", sku: "GM001", quantity: 1, price: 12499.00 },
            { name: "Gaming Keyboard", sku: "GK001", quantity: 1, price: 12500.00 }
        ],
        amount: "24999.00",
        payment: "Prepaid",
        chanel: "FLIPKART",
        weight: "1.5",
        tags: "Gaming",
        action: "Error",
        whatsapp: "Message Read",
        status: "error",
        awbNumber: "AWB123460",
        pincode: "400006"
    },
    {
        orderId: "ORD-2025-007",
        date: "2025-02-17",
        customer: "Rajesh Kumar",
        contact: "9876543216",
        items: [{ name: "Premium Smartwatch", sku: "PS001", quantity: 1, price: 39999.00 }],
        amount: "39999.00",
        payment: "COD",
        chanel: "OPENCART",
        weight: "2.2",
        tags: "Premium",
        action: "In Transit",
        whatsapp: "Order Confirm",
        status: "not-booked",
        awbNumber: undefined,
        pincode: "400007"
    },
    {
        orderId: "ORD-2025-008",
        date: "2025-02-16",
        customer: "Meera Shah",
        contact: "9876543217",
        items: [
            { name: "Power Bank", sku: "PB001", quantity: 1, price: 3999.00 },
            { name: "USB Cable", sku: "UC001", quantity: 1, price: 5000.00 }
        ],
        amount: "8999.00",
        payment: "Prepaid",
        chanel: "API",
        weight: "1.0",
        tags: "Accessories",
        action: "Processing",
        whatsapp: "Order Cancelled",
        status: "processing",
        awbNumber: "AWB123461",
        pincode: "400008"
    },
    {
        orderId: "ORD-2025-009",
        date: "2025-02-16",
        customer: "Arun Reddy",
        contact: "9876543218",
        items: [{ name: "Wireless Earbuds", sku: "WE001", quantity: 1, price: 15999.00 }],
        amount: "15999.00",
        payment: "COD",
        chanel: "MANUAL",
        weight: "1.3",
        tags: "Electronics",
        action: "Pending",
        whatsapp: "Message Delivered",
        status: "booked",
        awbNumber: "AWB123462",
        pincode: "400009"
    },
    {
        orderId: "ORD-2025-010",
        date: "2025-02-15",
        customer: "Pooja Sharma",
        contact: "9876543219",
        items: [
            { name: "Gaming Console", sku: "GC001", quantity: 1, price: 29999.00 },
            { name: "Game Controller", sku: "GCT001", quantity: 2, price: 0.00 }
        ],
        amount: "29999.00",
        payment: "Prepaid",
        chanel: "EXCEL",
        weight: "2.0",
        tags: "Gaming",
        action: "Cancelled",
        whatsapp: "Message Read",
        status: "cancelled",
        awbNumber: "AWB123463",
        pincode: "400010"
    }
];

const notBookedData = allData.filter(item => item.status === "not-booked");
const processingData = allData.filter(item => item.status === "processing");
const bookedData = allData.filter(item => item.status === "booked");
const cancelledData = allData.filter(item => item.status === "cancelled");
const shipmentCancelledData = allData.filter(item => item.status === "shipment-cancelled");
const errorData = allData.filter(item => item.status === "error");

const OrdersTable = ({ data, onStatusUpdate, onBulkStatusUpdate, dateRange }: { 
    data: OrderData[], 
    onStatusUpdate: (orderId: string, status: OrderData['status']) => void,
    onBulkStatusUpdate: (orderIds: string[], status: OrderData['status']) => void,
    dateRange?: DateRange
}) => {
    const navigate = useNavigate();
    const [sortConfig, setSortConfig] = useState<{
        key: keyof typeof data[0];
        direction: 'asc' | 'desc';
    } | null>(null);
    const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
    const [shippingModalOpen, setShippingModalOpen] = useState(false);
    const [addTagModalOpen, setAddTagModalOpen] = useState(false);
    const [tagInput, setTagInput] = useState('');
    const [singleOrderId, setSingleOrderId] = useState<string | null>(null);
    const [hoveredOrderId, setHoveredOrderId] = useState<string | null>(null);
    const [displayData, setDisplayData] = useState<typeof data>(data);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterDialogOpen, setFilterDialogOpen] = useState(false);
    const [filters, setFilters] = useState({
        orderDate: "",
        orderId: "",
        productName: "",
        sku: "",
        channel: "",
        stores: "",
        paymentType: "",
        orderTag: "",
        warehouse: "",
        contact: "",
        pincode: "",
        whatsappStatus: "",
        duplicate: ""
    });

    // Update displayData when main data changes
    useEffect(() => {
        setDisplayData(data);
    }, [data]);

    // Filter data based on AWB number search and date range
    const filteredData = displayData.filter(order => {
        // First filter by date range if exists
        if (dateRange?.from && dateRange?.to) {
            try {
                // Parse dates in YYYY-MM-DD format
                const [orderYear, orderMonth, orderDay] = order.date.split('-').map(Number);
                const orderDate = new Date(orderYear, orderMonth - 1, orderDay);
                
                const fromDate = dateRange.from;
                const toDate = dateRange.to;

                // Set hours for proper comparison
                orderDate.setHours(0, 0, 0, 0);
                fromDate.setHours(0, 0, 0, 0);
                toDate.setHours(23, 59, 59, 999);

                if (!(orderDate >= fromDate && orderDate <= toDate)) {
                    return false;
                }
            } catch (error) {
                console.error('Date parsing error:', error, order.date);
                return false;
            }
        }

        // Then filter by search query if exists
        if (searchQuery) {
            const searchLower = searchQuery.toLowerCase();
            const awbMatch = order.awbNumber?.toLowerCase().includes(searchLower);
            const orderIdMatch = order.orderId.toLowerCase().includes(searchLower);
            const customerMatch = order.customer.toLowerCase().includes(searchLower);
            const contactMatch = order.contact.toLowerCase().includes(searchLower);
            
            return awbMatch || orderIdMatch || customerMatch || contactMatch;
        }

        return true;
    });

    // Subscribe to navbar search changes
    useEffect(() => {
        const handleNavbarSearch = (event: CustomEvent) => {
            setSearchQuery(event.detail?.query || '');
        };

        window.addEventListener('navbarSearch', handleNavbarSearch as EventListener);
        return () => {
            window.removeEventListener('navbarSearch', handleNavbarSearch as EventListener);
        };
    }, []);

    // Sort data
    const sortedData = [...filteredData].sort((a, b) => {
        if (!sortConfig) return 0;

        const { key, direction } = sortConfig;

        const aValue = a[key] ?? '';
        const bValue = b[key] ?? '';

        if (aValue < bValue) return direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return direction === 'asc' ? 1 : -1;
        return 0;
    });

    const handleSort = (key: keyof typeof data[0]) => {
        setSortConfig(prevConfig => {
            if (prevConfig?.key === key) {
                if (prevConfig.direction === 'asc') {
                    return { key, direction: 'desc' };
                } else if (prevConfig.direction === 'desc') {
                    return null;
                }
            }
            return { key, direction: 'asc' };
        });
    };

    const handleStatusUpdate = (orderId: string, status: OrderData['status']) => {
        onStatusUpdate(orderId, status);
    };

    const handleBulkStatusUpdate = (status: OrderData['status']) => {
        if (selectedOrders.length === 0) {
            toast.error('No orders selected');
            return;
        }
        onBulkStatusUpdate(selectedOrders, status);
        setSelectedOrders([]);
    };

    const handleSelectOrder = (orderId: string) => {
        setSelectedOrders(prev => {
            if (prev.includes(orderId)) {
                return prev.filter(id => id !== orderId);
            }
            return [...prev, orderId];
        });
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedOrders(sortedData.map(order => order.orderId));
        } else {
            setSelectedOrders([]);
        }
    };

    const handleShipSelected = (options: {
        warehouse: string;
        rtoWarehouse: string;
        shippingMode: string;
        courier: string;
    }) => {
        // Update shipping details for selected orders
        const updatedOrders = data.map(order => {
            if (selectedOrders.includes(order.orderId)) {
                return {
                    ...order,
                    courier: options.courier,
                    warehouse: options.warehouse,
                    rtoWarehouse: options.rtoWarehouse,
                    shippingMode: options.shippingMode
                };
            }
            return order;
        });
        setDisplayData(updatedOrders);
        setShippingModalOpen(false);
        toast.success(`Shipping options applied to ${selectedOrders.length} orders`);
    };

    const handleBook = () => {
        if (selectedOrders.length === 0) {
            toast.error("Please select orders to book");
            return;
        }
        setShippingModalOpen(true);
    };

    const handleCancel = () => {
        if (selectedOrders.length === 0) {
            toast.error("Please select orders to cancel");
            return;
        }
        onBulkStatusUpdate(selectedOrders, 'cancelled');
        toast.success("Orders cancelled successfully");
        setSelectedOrders([]);
    };

    const handleExport = () => {
        // Prepare data for Excel
        const headers = ["Order ID", "AWB Number", "Date", "Customer", "Contact", "Items", "Amount", "Payment", "Channel", "Weight", "Tags", "Action", "WhatsApp"];
        const data = sortedData.map(order => [
            order.orderId,
            order.awbNumber || '',
            order.date,
            order.customer,
            order.contact,
            order.items.map(item => item.name).join(', '),
            order.amount,
            order.payment,
            order.chanel,
            order.weight,
            order.tags,
            order.action,
            order.whatsapp
        ]);

        // Create worksheet
        const ws = XLSXUtils.aoa_to_sheet([headers, ...data]);

        // Set column widths
        const colWidths = [
            { wch: 15 },  // Order ID
            { wch: 15 },  // AWB Number
            { wch: 12 },  // Date
            { wch: 20 },  // Customer
            { wch: 15 },  // Contact
            { wch: 30 },  // Items
            { wch: 12 },  // Amount
            { wch: 10 },  // Payment
            { wch: 10 },  // Channel
            { wch: 10 },  // Weight
            { wch: 15 },  // Tags
            { wch: 15 },  // Action
            { wch: 15 },  // WhatsApp
        ];
        ws['!cols'] = colWidths;

        // Create workbook
        const wb = { Sheets: { 'Orders': ws }, SheetNames: ['Orders'] };

        // Generate Excel file
        const excelBuffer = XLSXWrite(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        
        // Download file
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `orders_export_${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success("Orders exported successfully");
    };

    const handleShow = () => {
        setFilterDialogOpen(true);
    };

    const handleApplyFilters = () => {
        // Apply the filters to the data
        const filteredData = data.filter(order => {
            let matches = true;
            
            // Order ID filter
            if (filters.orderId) {
                matches = matches && order.orderId.toLowerCase().includes(filters.orderId.toLowerCase());
            }

            // Product Name filter
            if (filters.productName) {
                matches = matches && order.items.some(item => 
                    item.name.toLowerCase().includes(filters.productName.toLowerCase())
                );
            }

            // SKU filter
            if (filters.sku) {
                matches = matches && order.items.some(item => 
                    item.sku.toLowerCase().includes(filters.sku.toLowerCase())
                );
            }

            // Channel filter
            if (filters.channel) {
                matches = matches && order.chanel === filters.channel;
            }

            // Payment Type filter
            if (filters.paymentType) {
                matches = matches && order.payment.toLowerCase() === filters.paymentType.toLowerCase();
            }

            // Order Tag filter
            if (filters.orderTag) {
                matches = matches && order.tags.toLowerCase().includes(filters.orderTag.toLowerCase());
            }

            // Contact filter
            if (filters.contact) {
                matches = matches && order.contact.includes(filters.contact);
            }

            // WhatsApp Status filter
            if (filters.whatsappStatus) {
                matches = matches && order.whatsapp === filters.whatsappStatus;
            }

            // Date filter
            if (filters.orderDate) {
                matches = matches && order.date === filters.orderDate;
            }

            // Pincode filter (if pincode is added to the order data)
            if (filters.pincode) {
                // Note: This assumes pincode is added to the order data
                // matches = matches && order.pincode?.includes(filters.pincode);
            }

            // Duplicate filter
            if (filters.duplicate) {
                switch (filters.duplicate) {
                    case "by-pincode":
                        // Check for duplicate pincodes
                        matches = matches && data.filter(o => o !== order && o.pincode === order.pincode).length > 0;
                        break;
                    case "by-contact":
                        // Check for duplicate contacts
                        matches = matches && data.filter(o => o !== order && o.contact === order.contact).length > 0;
                        break;
                    case "by-contact-pincode":
                        // Check for duplicate contact and pincode combinations
                        matches = matches && data.filter(o => o !== order && o.contact === order.contact && o.pincode === order.pincode).length > 0;
                        break;
                }
            }

            return matches;
        });

        setDisplayData(filteredData);
        setFilterDialogOpen(false);
        toast.success("Filters applied successfully");
    };

    const handleClearFilters = () => {
        setFilters({
            orderDate: "",
            orderId: "",
            productName: "",
            sku: "",
            channel: "",
            stores: "",
            paymentType: "",
            orderTag: "",
            warehouse: "",
            contact: "",
            pincode: "",
            whatsappStatus: "",
            duplicate: ""
        });
        setDisplayData(data);
        setFilterDialogOpen(false);
        toast.success("Filters cleared");
    };

    const handleAddTag = () => {
        if (selectedOrders.length === 0) {
            toast.error("Please select orders to add tag");
            return;
        }
        setAddTagModalOpen(true);
    };

    const handleShipSingle = (orderId: string) => {
        setSingleOrderId(orderId);
        setShippingModalOpen(true);
    };

    const handleExportSelected = () => {
        if (selectedOrders.length === 0) {
            toast.error("Please select orders to export");
            return;
        }

        // Prepare data for Excel
        const headers = ["Order ID", "AWB Number", "Date", "Customer", "Contact", "Items", "Amount", "Payment", "Channel", "Weight", "Tags", "Action", "WhatsApp"];
        const data = sortedData
            .filter(order => selectedOrders.includes(order.orderId))
            .map(order => [
                order.orderId,
                order.awbNumber || '',
                order.date,
                order.customer,
                order.contact,
                order.items.map(item => item.name).join(', '),
                order.amount,
                order.payment,
                order.chanel,
                order.weight,
                order.tags,
                order.action,
                order.whatsapp
            ]);

        // Create worksheet
        const ws = XLSXUtils.aoa_to_sheet([headers, ...data]);

        // Set column widths
        const colWidths = [
            { wch: 15 },  // Order ID
            { wch: 15 },  // AWB Number
            { wch: 12 },  // Date
            { wch: 20 },  // Customer
            { wch: 15 },  // Contact
            { wch: 30 },  // Items
            { wch: 12 },  // Amount
            { wch: 10 },  // Payment
            { wch: 10 },  // Channel
            { wch: 10 },  // Weight
            { wch: 15 },  // Tags
            { wch: 15 },  // Action
            { wch: 15 },  // WhatsApp
        ];
        ws['!cols'] = colWidths;

        // Create workbook
        const wb = { Sheets: { 'Orders': ws }, SheetNames: ['Orders'] };

        // Generate Excel file
        const excelBuffer = XLSXWrite(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        
        // Download file
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `selected_orders_export_${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success(`${selectedOrders.length} orders exported successfully`);
    };

    // Format date for display
    const formatDate = (dateString: string) => {
        try {
            const [year, month, day] = dateString.split('-').map(Number);
            const date = new Date(year, month - 1, day);
            return date.toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            console.error('Date formatting error:', error);
            return dateString;
        }
    };

    return (
        <div className="space-y-4">
            {selectedOrders.length > 0 && (
                <div className="flex items-center gap-2 py-2 px-4 bg-white rounded-lg shadow-sm">
                    <span className="text-sm font-medium">
                        {selectedOrders.length} Selected
                    </span>
                    <div className="flex items-center gap-2 ml-4">
                    <Button
                        onClick={handleBook}
                            className="bg-[#7352FF] hover:bg-[#5e3dd3] text-white h-9 px-4 py-2 rounded-md text-sm"
                    >
                        Book
                    </Button>
                    <Button
                        onClick={handleCancel}
                            className="bg-[#FF5252] hover:bg-[#d14444] text-white h-9 px-4 py-2 rounded-md text-sm"
                    >
                        Cancel
                    </Button>
                    <Button
                            onClick={() => setAddTagModalOpen(true)}
                            className="bg-[#4CAF50] hover:bg-[#3d8c40] text-white h-9 px-4 py-2 rounded-md text-sm"
                    >
                        Add Tag
                    </Button>
                    <Button
                            onClick={handleExportSelected}
                            className="bg-[#2196F3] hover:bg-[#1976d2] text-white h-9 px-4 py-2 rounded-md text-sm flex items-center gap-2"
                    >
                            <Download className="h-4 w-4" />
                            Export Selected
                    </Button>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Button
                        onClick={() => navigate('/seller/dashboard/new-order')}
                        className="bg-[#7352FF] hover:bg-[#5e3dd3] text-white h-9 px-4 py-2 rounded-md text-sm"
                    >
                        New Order
                    </Button>
                    <Button
                        onClick={handleExport}
                        className="bg-[#2196F3] hover:bg-[#1976d2] text-white h-9 px-4 py-2 rounded-md text-sm flex items-center gap-2"
                    >
                        <Download className="h-4 w-4" />
                        Export All
                    </Button>
                    <Button
                        onClick={handleShow}
                        className="bg-[#7352FF] hover:bg-[#5e3dd3] text-white h-9 px-4 py-2 rounded-md text-sm"
                    >
                        Show
                    </Button>
                </div>
            </div>

            {/* Add Tag Modal */}
            <Dialog open={addTagModalOpen} onOpenChange={setAddTagModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Tag to Selected Orders</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="tag">Tag</Label>
                            <Input
                                id="tag"
                                placeholder="Enter tag..."
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setAddTagModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={() => {
                            // Handle adding tag
                            toast.success('Tag added successfully');
                            setAddTagModalOpen(false);
                            setTagInput('');
                            setSelectedOrders([]);
                        }}>
                            Add Tag
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Shipping Options Modal */}
            <ShippingOptionsModal 
                open={shippingModalOpen}
                onOpenChange={setShippingModalOpen}
                onSubmit={handleShipSelected}
                orderCount={selectedOrders.length}
                singleOrderId={singleOrderId}
            />

            {/* Filter Dialog */}
            <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Filter Orders</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-3 gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="orderDate">Dates</Label>
                            <Input
                                id="orderDate"
                                placeholder="Order Date"
                                value={filters.orderDate}
                                onChange={(e) => setFilters(prev => ({ ...prev, orderDate: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="orderId">Order ID's</Label>
                            <Input
                                id="orderId"
                                placeholder="Order Id"
                                value={filters.orderId}
                                onChange={(e) => setFilters(prev => ({ ...prev, orderId: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="productName">Product Name</Label>
                            <Input
                                id="productName"
                                placeholder="Product Name"
                                value={filters.productName}
                                onChange={(e) => setFilters(prev => ({ ...prev, productName: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="sku">SKU</Label>
                            <Input
                                id="sku"
                                placeholder="SKU"
                                value={filters.sku}
                                onChange={(e) => setFilters(prev => ({ ...prev, sku: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="channel">Channel</Label>
                            <Select
                                value={filters.channel}
                                onValueChange={(value) => setFilters(prev => ({ ...prev, channel: value }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Channels" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="MANUAL">MANUAL</SelectItem>
                                    <SelectItem value="EXCEL">EXCEL</SelectItem>
                                    <SelectItem value="SHOPIFY">SHOPIFY</SelectItem>
                                    <SelectItem value="WOOCOMMERCE">WOOCOMMERCE</SelectItem>
                                    <SelectItem value="AMAZON">AMAZON</SelectItem>
                                    <SelectItem value="FLIPKART">FLIPKART</SelectItem>
                                    <SelectItem value="OPENCART">OPENCART</SelectItem>
                                    <SelectItem value="API">API</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="stores">Stores</Label>
                            <Select
                                value={filters.stores}
                                onValueChange={(value) => setFilters(prev => ({ ...prev, stores: value }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Stores" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="store1">Store 1</SelectItem>
                                    <SelectItem value="store2">Store 2</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="paymentType">Payment Type</Label>
                            <Select
                                value={filters.paymentType}
                                onValueChange={(value) => setFilters(prev => ({ ...prev, paymentType: value }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Order Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="cod">COD</SelectItem>
                                    <SelectItem value="prepaid">Prepaid</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="orderTag">Order Tag</Label>
                            <Input
                                id="orderTag"
                                placeholder="Order Tag"
                                value={filters.orderTag}
                                onChange={(e) => setFilters(prev => ({ ...prev, orderTag: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="warehouse">Warehouse</Label>
                            <Input
                                id="warehouse"
                                placeholder="Warehouses"
                                value={filters.warehouse}
                                onChange={(e) => setFilters(prev => ({ ...prev, warehouse: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contact">Contact</Label>
                            <Input
                                id="contact"
                                placeholder="Contact"
                                value={filters.contact}
                                onChange={(e) => setFilters(prev => ({ ...prev, contact: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="pincode">Pincode</Label>
                            <Input
                                id="pincode"
                                placeholder="Pincode"
                                value={filters.pincode}
                                onChange={(e) => setFilters(prev => ({ ...prev, pincode: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="whatsappStatus">WhatsApp Status</Label>
                            <Select
                                value={filters.whatsappStatus}
                                onValueChange={(value) => setFilters(prev => ({ ...prev, whatsappStatus: value }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Whatsapp Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Message Delivered">Message Delivered</SelectItem>
                                    <SelectItem value="Message Read">Message Read</SelectItem>
                                    <SelectItem value="Order Confirm">Order Confirm</SelectItem>
                                    <SelectItem value="Order Cancelled">Order Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="duplicate">Duplicate</Label>
                            <Select
                                value={filters.duplicate}
                                onValueChange={(value) => setFilters(prev => ({ ...prev, duplicate: value }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="-duplicate-" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="-duplicate-">- Duplicate -</SelectItem>
                                    <SelectItem value="by-pincode">By Pincode</SelectItem>
                                    <SelectItem value="by-contact">By Contact</SelectItem>
                                    <SelectItem value="by-contact-pincode">By Contact & Pincode</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter className="flex justify-between">
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={handleClearFilters}>
                                Clear
                            </Button>
                            <Button onClick={handleApplyFilters} className="bg-[#7352FF] hover:bg-[#5e3dd3] text-white">
                                Filter
                            </Button>
                        </div>
                        <Button variant="outline" onClick={() => setFilterDialogOpen(false)}>
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="rounded-lg border">
                <Table>
                    <TableHeader className="bg-[#F4F2FF] h-12">
                        <TableRow className="hover:bg-[#F4F2FF]">
                            <TableHead className="w-[50px]">
                                <input
                                    type="checkbox"
                                    className="rounded border-gray-300"
                                    onChange={handleSelectAll}
                                    checked={selectedOrders.length === sortedData.length}
                                />
                            </TableHead>
                            <TableHead onClick={() => handleSort('orderId')} className="cursor-pointer text-black min-w-[120px] whitespace-nowrap">
                                Order ID <ArrowUpDown className="inline h-4 w-4 ml-1" />
                            </TableHead>
                            <TableHead onClick={() => handleSort('awbNumber')} className="cursor-pointer text-black min-w-[100px] whitespace-nowrap">
                                AWB Number <ArrowUpDown className="inline h-4 w-4 ml-1" />
                            </TableHead>
                            <TableHead onClick={() => handleSort('date')} className="cursor-pointer text-black min-w-[100px] whitespace-nowrap">
                                Date <ArrowUpDown className="inline h-4 w-4 ml-1" />
                            </TableHead>
                            <TableHead onClick={() => handleSort('customer')} className="cursor-pointer text-black min-w-[120px] whitespace-nowrap">
                                Customer <ArrowUpDown className="inline h-4 w-4 ml-1" />
                            </TableHead>
                            <TableHead onClick={() => handleSort('contact')} className="cursor-pointer text-black min-w-[100px] whitespace-nowrap">
                                Contact <ArrowUpDown className="inline h-4 w-4 ml-1" />
                            </TableHead>
                            <TableHead onClick={() => handleSort('items')} className="cursor-pointer text-black min-w-[80px] whitespace-nowrap">
                                Items <ArrowUpDown className="inline h-4 w-4 ml-1" />
                            </TableHead>
                            <TableHead onClick={() => handleSort('amount')} className="cursor-pointer text-black min-w-[100px] whitespace-nowrap">
                                Amount <ArrowUpDown className="inline h-4 w-4 ml-1" />
                            </TableHead>
                            <TableHead onClick={() => handleSort('payment')} className="cursor-pointer text-black min-w-[100px] whitespace-nowrap">
                                Payment <ArrowUpDown className="inline h-4 w-4 ml-1" />
                            </TableHead>
                            <TableHead onClick={() => handleSort('chanel')} className="cursor-pointer text-black min-w-[120px] whitespace-nowrap">
                                Channel <ArrowUpDown className="inline h-4 w-4 ml-1" />
                            </TableHead>
                            <TableHead onClick={() => handleSort('weight')} className="cursor-pointer text-black min-w-[80px] whitespace-nowrap">
                                Weight <ArrowUpDown className="inline h-4 w-4 ml-1" />
                            </TableHead>
                            <TableHead onClick={() => handleSort('tags')} className="cursor-pointer text-black min-w-[100px] whitespace-nowrap">
                                Tags <ArrowUpDown className="inline h-4 w-4 ml-1" />
                            </TableHead>
                            <TableHead onClick={() => handleSort('action')} className="cursor-pointer text-black min-w-[100px] whitespace-nowrap">
                                Action <ArrowUpDown className="inline h-4 w-4 ml-1" />
                            </TableHead>
                            <TableHead onClick={() => handleSort('whatsapp')} className="cursor-pointer text-black min-w-[100px] whitespace-nowrap">
                                WhatsApp <ArrowUpDown className="inline h-4 w-4 ml-1" />
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedData.map((order) => (
                            <TableRow key={order.orderId} className="h-12">
                                <TableCell>
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300"
                                        checked={selectedOrders.includes(order.orderId)}
                                        onChange={(e) => handleSelectOrder(order.orderId)}
                                    />
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                    <Link to={`/seller/dashboard/orders/${order.orderId}`} className="text-blue-600 hover:underline">
                                        {order.orderId}
                                    </Link>
                                </TableCell>
                                <TableCell className="whitespace-nowrap">{order.awbNumber || '-'}</TableCell>
                                <TableCell className="whitespace-nowrap">{formatDate(order.date)}</TableCell>
                                <TableCell className="whitespace-nowrap">{order.customer}</TableCell>
                                <TableCell className="whitespace-nowrap">{order.contact}</TableCell>
                                <TableCell className="whitespace-nowrap">
                                    <div
                                        className="relative"
                                        onMouseEnter={() => setHoveredOrderId(order.orderId)}
                                        onMouseLeave={() => setHoveredOrderId(null)}
                                    >
                                        <span className="cursor-pointer">
                                            {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                                    </span>
                                        {hoveredOrderId === order.orderId && (
                                            <div className="absolute z-10 bg-white border rounded-md shadow-lg p-2 min-w-[200px]">
                                                <div className="space-y-1">
                                                    {order.items.map((item, index) => (
                                                        <div key={index} className="text-sm">
                                                            <div className="font-medium">{item.name}</div>
                                                            <div className="text-gray-500">
                                                                SKU: {item.sku} | Qty: {item.quantity} | ₹{item.price.toFixed(2)}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="whitespace-nowrap">{order.amount}</TableCell>
                                <TableCell className="whitespace-nowrap">{order.payment}</TableCell>
                                <TableCell className="whitespace-nowrap">{order.chanel}</TableCell>
                                <TableCell className="whitespace-nowrap">{order.weight} kg</TableCell>
                                <TableCell className="whitespace-nowrap">{order.tags}</TableCell>
                                <TableCell className="whitespace-nowrap">
                                    {order.action === "Ship" ? (
                                        <Button
                                            variant="secondary"
                                            className="bg-[#7352FF] hover:bg-[#5e3dd3] text-white h-8 px-3 py-1 rounded-md text-sm"
                                            onClick={() => handleShipSingle(order.orderId)}
                                        >
                                            <Truck className="h-4 w-4 mr-2" />
                                            Ship
                                        </Button>
                                    ) : (
                                        <span className={cn(
                                            "px-2 py-1 text-sm",
                                            {
                                                "text-red-500": order.action === "Cancelled",
                                                "text-[#7352FF]": order.action === "Processing",
                                                "text-gray-500": !["Cancelled", "Processing"].includes(order.action)
                                            }
                                        )}>
                                            {order.action === "Processing" ? "Processing..." : order.action}
                                        </span>
                                    )}
                                </TableCell>
                                <TableCell className="whitespace-nowrap">{order.whatsapp}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

const SellerOrdersPage = () => {
    const {
        loading,
        error,
        orders,
        stats,
        updateFilters,
        updateOrderStatus,
        bulkUpdateOrderStatus,
        getFilteredOrders,
        refresh
    } = useOrderData();

    const [dateRange, setDateRange] = useState<DateRange | undefined>();

    // Use mock data for testing
    const getMockFilteredOrders = (status?: OrderData['status']) => {
        if (!status) return allData;
        return allData.filter(order => order.status === status);
    };

    if (loading && !orders) {
    return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-10 w-[300px]" />
                    </div>
                <Skeleton className="h-[600px]" />
                </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[600px]">
                <div className="text-red-500 text-xl mb-4">
                    {error}
                        </div>
                <Button onClick={refresh}>Retry</Button>
                    </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Orders</h1>
                <DateRangePicker 
                    date={dateRange}
                    setDate={setDateRange}
                />
                </div>

            <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-7">
                    <TabsTrigger value="all">All ({allData.length})</TabsTrigger>
                    <TabsTrigger value="not-booked">Not Booked ({notBookedData.length})</TabsTrigger>
                    <TabsTrigger value="processing">Processing ({processingData.length})</TabsTrigger>
                    <TabsTrigger value="booked">Booked ({bookedData.length})</TabsTrigger>
                    <TabsTrigger value="cancelled">Cancelled ({cancelledData.length})</TabsTrigger>
                    <TabsTrigger value="shipment-cancelled">Shipment Cancelled ({shipmentCancelledData.length})</TabsTrigger>
                    <TabsTrigger value="error">Error ({errorData.length})</TabsTrigger>
                </TabsList>

                <div className="w-full overflow-x-auto">
                    <div className="min-w-full">
                        <TabsContent value="all" className="mt-2">
                            <OrdersTable 
                                data={allData} 
                                onStatusUpdate={updateOrderStatus}
                                onBulkStatusUpdate={bulkUpdateOrderStatus}
                                dateRange={dateRange}
                            />
                        </TabsContent>

                        <TabsContent value="not-booked" className="mt-2">
                            <OrdersTable 
                                data={getMockFilteredOrders("not-booked")} 
                                onStatusUpdate={updateOrderStatus}
                                onBulkStatusUpdate={bulkUpdateOrderStatus}
                                dateRange={dateRange}
                            />
                        </TabsContent>

                        <TabsContent value="processing" className="mt-2">
                            <OrdersTable 
                                data={getMockFilteredOrders("processing")} 
                                onStatusUpdate={updateOrderStatus}
                                onBulkStatusUpdate={bulkUpdateOrderStatus}
                                dateRange={dateRange}
                            />
                        </TabsContent>

                        <TabsContent value="booked" className="mt-2">
                            <OrdersTable 
                                data={getMockFilteredOrders("booked")} 
                                onStatusUpdate={updateOrderStatus}
                                onBulkStatusUpdate={bulkUpdateOrderStatus}
                                dateRange={dateRange}
                            />
                        </TabsContent>

                        <TabsContent value="cancelled" className="mt-2">
                            <OrdersTable 
                                data={getMockFilteredOrders("cancelled")} 
                                onStatusUpdate={updateOrderStatus}
                                onBulkStatusUpdate={bulkUpdateOrderStatus}
                                dateRange={dateRange}
                            />
                        </TabsContent>

                        <TabsContent value="shipment-cancelled" className="mt-2">
                            <OrdersTable 
                                data={getMockFilteredOrders("shipment-cancelled")} 
                                onStatusUpdate={updateOrderStatus}
                                onBulkStatusUpdate={bulkUpdateOrderStatus}
                                dateRange={dateRange}
                            />
                        </TabsContent>

                        <TabsContent value="error" className="mt-2">
                            <OrdersTable 
                                data={getMockFilteredOrders("error")} 
                                onStatusUpdate={updateOrderStatus}
                                onBulkStatusUpdate={bulkUpdateOrderStatus}
                                dateRange={dateRange}
                            />
                        </TabsContent>
                    </div>
                </div>
            </Tabs>
        </div>
    );
};

export default SellerOrdersPage; 