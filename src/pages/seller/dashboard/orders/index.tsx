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
import { ArrowUpDown, Download, Filter, Search, Tag, Truck, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast, Toaster } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import ShippingOptionsModal from "@/components/seller/shipping-options-modal";

interface OrderData {
    orderId: string;
    date: string;
    customer: string;
    contact: string;
    items: string;
    amount: string;
    payment: "COD" | "Prepaid";
    chanel: "Manual" | "WooCommerce" | "Shopify" | "Amazon";
    weight: string;
    tags: string;
    action: string;
    whatsapp: string;
}

const allData: OrderData[] = [
    {
        orderId: "fffff",
        date: "11/11/11",
        customer: "xyzzzz",
        contact: "1234566",
        items: "100",
        amount: "899",
        payment: "COD",
        chanel: "Manual",
        weight: "100",
        tags: "xyz",
        action: "xyz",
        whatsapp: "1234567"
    },
    {
        orderId: "yyhhh",
        date: "11/11/11",
        customer: "ahgsh",
        contact: "1234566",
        items: "100",
        amount: "899",
        payment: "COD",
        chanel: "Manual",
        weight: "100",
        tags: "xyz",
        action: "xyz",
        whatsapp: "1234567"
    },
    {
        orderId: "gffh",
        date: "11/11/11",
        customer: "ajajgs",
        contact: "1234566",
        items: "100",
        amount: "899",
        payment: "Prepaid",
        chanel: "WooCommerce",
        weight: "100",
        tags: "xyz",
        action: "xyz",
        whatsapp: "1234567"
    },
    {
        orderId: "hvhvh",
        date: "11/11/11",
        customer: "sjagg",
        contact: "1234566",
        items: "100",
        amount: "899",
        payment: "COD",
        chanel: "Shopify",
        weight: "100",
        tags: "xyz",
        action: "xyz",
        whatsapp: "1234567"
    },
    {
        orderId: "hvhjv",
        date: "11/11/11",
        customer: "ajagfg",
        contact: "1234566",
        items: "100",
        amount: "899",
        payment: "Prepaid",
        chanel: "Shopify",
        weight: "100",
        tags: "xyz",
        action: "xyz",
        whatsapp: "1234567"
    },
    {
        orderId: "hvhv",
        date: "11/11/11",
        customer: "ahgafa",
        contact: "1234566",
        items: "100",
        amount: "899",
        payment: "COD",
        chanel: "Amazon",
        weight: "100",
        tags: "xyz",
        action: "xyz",
        whatsapp: "1234567"
    },
    {
        orderId: "hvjvj",
        date: "11/11/11",
        customer: "ahgaf",
        contact: "1234566",
        items: "100",
        amount: "899",
        payment: "COD",
        chanel: "Amazon",
        weight: "100",
        tags: "xyz",
        action: "xyz",
        whatsapp: "1234567"
    },
    {
        orderId: "hjvjvjv",
        date: "11/11/11",
        customer: "ahhag",
        contact: "1234566",
        items: "100",
        amount: "899",
        payment: "COD",
        chanel: "Amazon",
        weight: "100",
        tags: "xyz",
        action: "xyz",
        whatsapp: "1234567"
    },
    {
        orderId: "jvjvjv",
        date: "11/11/11",
        customer: "ahgga",
        contact: "1234566",
        items: "100",
        amount: "899",
        payment: "Prepaid",
        chanel: "Amazon",
        weight: "100",
        tags: "xyz",
        action: "xyz",
        whatsapp: "1234567"
    },
    {
        orderId: "jvjvkvk",
        date: "11/11/11",
        customer: "ahaga",
        contact: "1234566",
        items: "100",
        amount: "899",
        payment: "Prepaid",
        chanel: "WooCommerce",
        weight: "100",
        tags: "xyz",
        action: "xyz",
        whatsapp: "1234567"
    },
    {
        orderId: "jkbkbkb",
        date: "11/11/11",
        customer: "ahgag",
        contact: "1234566",
        items: "100",
        amount: "6777",
        payment: "Prepaid",
        chanel: "Shopify",
        weight: "100",
        tags: "xyz",
        action: "xyz",
        whatsapp: "1234567"
    }
];

const notBookedData = allData.filter(item => item.payment === "COD");
const processingData = allData.filter(item => item.payment === "Prepaid");
const bookedData = allData.filter(item => item.chanel === "Manual");
const cancelledData = allData.filter(item => item.chanel === "WooCommerce");
const shipmentCancelledData = allData.filter(item => item.chanel === "Shopify");
const errorData = allData.filter(item => item.chanel === "Amazon");

const OrdersTable = ({ data }: { data: OrderData[] }) => {

    const [sortConfig, setSortConfig] = useState<{
        key: keyof OrderData;
        direction: 'asc' | 'desc';
    } | null>(null);

    const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
    const [shippingModalOpen, setShippingModalOpen] = useState(false);
    const [singleOrderId, setSingleOrderId] = useState<string | null>(null);

    const sortedData = [...data].sort((a, b) => {
        if (!sortConfig) return 0;

        const { key, direction } = sortConfig;

        const aValue = a[key] ?? '';
        const bValue = b[key] ?? '';

        if (aValue < bValue) return direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return direction === 'asc' ? 1 : -1;
        return 0;
    });

    const handleSort = (key: keyof OrderData) => {
        setSortConfig(current => ({
            key,
            direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc',
        }));
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

    const handleShipSelected = (courier: string, warehouse: string, mode: string) => {
        console.log("Shipping details:", { courier, warehouse, mode });
        toast.success("Orders shipped successfully");
        setShippingModalOpen(false);
        setSingleOrderId(null);
        setSelectedOrders([]);
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

    const handleExport = () => {
        if (selectedOrders.length === 0) {
            toast.error("Please select orders to export");
            return;
        }
        toast.success("Orders exported successfully");
        setSelectedOrders([]);
    };

    const handleShipSingle = (orderId: string) => {
        setSingleOrderId(orderId);
        setShippingModalOpen(true);
    };

    const ordersToShip = singleOrderId ? [singleOrderId] : selectedOrders;

    return (
        <>
            {selectedOrders.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-4">
                    <Button variant="outline">
                        {selectedOrders.length} selected
                    </Button>
                    <Button
                        variant="primary"
                        className="gap-2"
                        onClick={handleBook}
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
                        onClick={handleExport}
                    >
                        <Download className="size-4" />
                        Export
                    </Button>
                </div>
            )}
            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader className="bg-[#F4F2FF] h-12">
                        <TableRow className="hover:bg-[#F4F2FF]">
                            <TableHead className="w-[40px]">
                                <input
                                    type="checkbox"
                                    className="rounded border-gray-300"
                                    checked={selectedOrders.length === sortedData.length && sortedData.length > 0}
                                    onChange={handleSelectAll}
                                />
                            </TableHead>
                            <TableHead onClick={() => handleSort('orderId')} className="cursor-pointer text-black w-[90px] whitespace-nowrap">
                                Order Id <ArrowUpDown className="inline h-4 w-4 ml-1" />
                            </TableHead>
                            <TableHead onClick={() => handleSort('date')} className="cursor-pointer text-black w-[80px] whitespace-nowrap">
                                Date <ArrowUpDown className="inline h-4 w-4 ml-1" />
                            </TableHead>
                            <TableHead onClick={() => handleSort('customer')} className="cursor-pointer text-black w-[100px] whitespace-nowrap">
                                Customer <ArrowUpDown className="inline h-4 w-4 ml-1" />
                            </TableHead>
                            <TableHead onClick={() => handleSort('contact')} className="cursor-pointer text-black w-[90px] whitespace-nowrap">
                                Contact <ArrowUpDown className="inline h-4 w-4 ml-1" />
                            </TableHead>
                            <TableHead onClick={() => handleSort('items')} className="cursor-pointer text-black w-[60px] whitespace-nowrap">
                                Items <ArrowUpDown className="inline h-4 w-4 ml-1" />
                            </TableHead>
                            <TableHead onClick={() => handleSort('amount')} className="cursor-pointer text-black w-[80px] whitespace-nowrap">
                                Amount <ArrowUpDown className="inline h-4 w-4 ml-1" />
                            </TableHead>
                            <TableHead onClick={() => handleSort('payment')} className="cursor-pointer text-black w-[90px] whitespace-nowrap">
                                Payment <ArrowUpDown className="inline h-4 w-4 ml-1" />
                            </TableHead>
                            <TableHead onClick={() => handleSort('chanel')} className="cursor-pointer text-black w-[100px] whitespace-nowrap">
                                Chanel <ArrowUpDown className="inline h-4 w-4 ml-1" />
                            </TableHead>
                            <TableHead onClick={() => handleSort('weight')} className="cursor-pointer text-black w-[90px] whitespace-nowrap">
                                Weight (kg) <ArrowUpDown className="inline h-4 w-4 ml-1" />
                            </TableHead>
                            <TableHead onClick={() => handleSort('tags')} className="cursor-pointer text-black w-[80px] whitespace-nowrap">
                                Tags <ArrowUpDown className="inline h-4 w-4 ml-1" />
                            </TableHead>
                            <TableHead className="text-black w-[80px] whitespace-nowrap">
                                Action
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedData.map((row, index) => (
                            <TableRow key={index} className="h-12">
                                <TableCell>
                                    <input
                                        type="checkbox"
                                        checked={selectedOrders.includes(row.orderId)}
                                        onChange={() => handleSelectOrder(row.orderId)}
                                        className="rounded border-gray-300"
                                    />
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                    <Link
                                        to={`/seller/dashboard/orders/${row.orderId}`}
                                        className="text-violet-600 hover:underline"
                                    >
                                        {row.orderId}
                                    </Link>
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                    {row.date}
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                    {row.customer}
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                    {row.contact}
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                    {row.items}
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                    {row.amount}
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                    <span className={cn(
                                        "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                                        row.payment === 'COD'
                                            ? "bg-green-100 text-green-800"
                                            : "bg-blue-100 text-blue-800"
                                    )}>
                                        {row.payment}
                                    </span>
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                    <span className={cn(
                                        "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                                        {
                                            "bg-purple-100 text-purple-800": row.chanel === "Manual",
                                            "bg-orange-100 text-orange-800": row.chanel === "WooCommerce",
                                            "bg-green-100 text-green-800": row.chanel === "Shopify",
                                            "bg-blue-100 text-blue-800": row.chanel === "Amazon",
                                        }
                                    )}>
                                        {row.chanel}
                                    </span>
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                    {row.weight}
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                    {row.tags}
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                    {row.payment === "COD" ? (
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            className="h-9 gap-1 bg-purple-600 hover:bg-purple-700 text-white"
                                            onClick={() => handleShipSingle(row.orderId)}
                                        >
                                            <Truck className="size-4" />
                                            Ship
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-9 text-purple-800 border-purple-200"
                                        >
                                            Processing...
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {shippingModalOpen && (
                <ShippingOptionsModal
                    isOpen={shippingModalOpen}
                    onClose={() => {
                        setShippingModalOpen(false);
                        setSingleOrderId(null);
                    }}
                    orderNumber={singleOrderId || selectedOrders[0]}
                    weight={100}
                    paymentType="cod"
                    onShipSelected={handleShipSelected}
                    deliveryAddress={{
                        pincode: "201307",
                        city: "Noida",
                        state: "Uttar Pradesh"
                    }}
                    sellerAddress={{
                        pincode: "201307",
                        city: "Noida",
                        state: "Uttar Pradesh"
                    }}
                />
            )}
        </>
    );
};

const SellerOrdersPage = () => {

    const [searchQuery, setSearchQuery] = useState<string>("");

    return (
        <div className="space-y-8 overflow-hidden">
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
                                value="not-booked"
                                className="flex-1 h-full data-[state=active]:bg-white rounded-none border-b-2 border-transparent data-[state=active]:border-black whitespace-nowrap px-4"
                            >
                                Not-Booked
                            </TabsTrigger>
                            <TabsTrigger
                                value="processing"
                                className="flex-1 h-full data-[state=active]:bg-white rounded-none border-b-2 border-transparent data-[state=active]:border-black whitespace-nowrap px-4"
                            >
                                Processing
                            </TabsTrigger>
                            <TabsTrigger
                                value="booked"
                                className="flex-1 h-full data-[state=active]:bg-white rounded-none border-b-2 border-transparent data-[state=active]:border-black whitespace-nowrap px-4"
                            >
                                Booked
                            </TabsTrigger>
                            <TabsTrigger
                                value="cancelled"
                                className="flex-1 h-full data-[state=active]:bg-white rounded-none border-b-2 border-transparent data-[state=active]:border-black whitespace-nowrap px-4"
                            >
                                Cancelled Order
                            </TabsTrigger>
                            <TabsTrigger
                                value="shipment-cancelled"
                                className="flex-1 h-full data-[state=active]:bg-white rounded-none border-b-2 border-transparent data-[state=active]:border-black whitespace-nowrap px-4"
                            >
                                Shipment Cancelled
                            </TabsTrigger>
                            <TabsTrigger
                                value="error"
                                className="flex-1 h-full data-[state=active]:bg-white rounded-none border-b-2 border-transparent data-[state=active]:border-black whitespace-nowrap px-4"
                            >
                                Error
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
                </div>

                <div className="w-full overflow-x-auto">
                    <div className="min-w-full">
                        <TabsContent value="all" className="mt-2">
                            <OrdersTable data={allData} />
                        </TabsContent>

                        <TabsContent value="not-booked" className="mt-2">
                            <OrdersTable data={notBookedData} />
                        </TabsContent>

                        <TabsContent value="processing" className="mt-2">
                            <OrdersTable data={processingData} />
                        </TabsContent>

                        <TabsContent value="booked" className="mt-2">
                            <OrdersTable data={bookedData} />
                        </TabsContent>

                        <TabsContent value="cancelled" className="mt-2">
                            <OrdersTable data={cancelledData} />
                        </TabsContent>

                        <TabsContent value="shipment-cancelled" className="mt-2">
                            <OrdersTable data={shipmentCancelledData} />
                        </TabsContent>

                        <TabsContent value="error" className="mt-2">
                            <OrdersTable data={errorData} />
                        </TabsContent>
                    </div>
                </div>
            </Tabs>
        </div>
    );
};

export default SellerOrdersPage; 