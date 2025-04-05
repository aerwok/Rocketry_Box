import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
    ArrowLeftIcon,
    CopyIcon,
    Edit,
    Copy as Duplicate,
    Printer,
    FileText,
    X,
    Truck,
    RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Order details interface
interface OrderDetails {
    orderId: string;
    date: string;
    customer: string;
    contact: string;
    items: string;
    amount: string;
    payment: "COD" | "Prepaid";
    chanel: "MANUAL" | "EXCEL" | "SHOPIFY" | "WOOCOMMERCE" | "AMAZON" | "FLIPKART" | "OPENCART" | "API";
    shipmentType: "Forward" | "Reverse";
    weight: string;
    tags: string;
    action: string;
    whatsapp: string;
    status: "not-booked" | "processing" | "booked" | "cancelled" | "shipment-cancelled" | "error";
    customerDetails: {
        name: string;
        address1: string;
        address2: string;
        city: string;
        state: string;
        pincode: string;
        country: string;
        phone: string;
    };
    warehouseDetails: {
        name: string;
        address1: string;
        city: string;
        state: string;
        pincode: string;
        country: string;
        phone: string;
    };
    products: {
        name: string;
        sku: string;
        quantity: number;
        price: number;
        image: string;
    }[];
}

const SellerOrderDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isUpdateTrackingOpen, setIsUpdateTrackingOpen] = useState(false);
    const [trackingNumber, setTrackingNumber] = useState("");
    const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
    const [cancelReason, setCancelReason] = useState("");

    // Mock order details data
    const orderDetails: OrderDetails = {
        orderId: id || "ORD-2024-001",
        date: "2024-02-20",
        customer: "Rahul Sharma",
        contact: "9876543210",
        items: "4",
        amount: "97497.00",
        payment: "COD",
        chanel: "MANUAL",
        shipmentType: "Forward",
        weight: "2.5",
        tags: "Gaming",
        action: "Ship",
        whatsapp: "9876543210",
        status: "not-booked",
        customerDetails: {
            name: "Rahul Sharma",
            address1: "Flat 303, Tower B, Green Valley Apartments",
            address2: "Sector 62, Noida",
            city: "NOIDA",
            state: "UTTAR PRADESH",
            pincode: "201309",
            country: "India",
            phone: "9876543210"
        },
        warehouseDetails: {
            name: "RocketryBox Warehouse",
            address1: "Plot No. 123, Industrial Area",
            city: "PUNE",
            state: "MAHARASHTRA",
            pincode: "411014",
            country: "India",
            phone: "020-12345678"
        },
        products: [
            {
                name: "Gaming Laptop",
                sku: "LAP-GAM-001",
                quantity: 1,
                price: 89999.00,
                image: "/images/products/laptop.jpg"
            },
            {
                name: "Gaming Mouse",
                sku: "MOU-GAM-001",
                quantity: 2,
                price: 2499.00,
                image: "/images/products/mouse.jpg"
            },
            {
                name: "Gaming Headset",
                sku: "HEA-GAM-001",
                quantity: 1,
                price: 4999.00,
                image: "/images/products/headset.jpg"
            }
        ]
    };

    const handleEdit = () => {
        navigate(`/seller/dashboard/orders/edit/${id}`);
        toast.success("Navigating to edit order");
    };

    const handleDuplicate = () => {
        navigate('/seller/dashboard/new-order', {
            state: { duplicateFrom: orderDetails }
        });
        toast.success("Order duplicated. Create a new order with the same details.");
    };

    const handlePrintLabel = () => {
        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 2000)),
            {
                loading: 'Generating shipping label...',
                success: 'Shipping label generated successfully',
                error: 'Failed to generate shipping label'
            }
        );
    };

    const handlePrintInvoice = () => {
        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 2000)),
            {
                loading: 'Generating invoice...',
                success: 'Invoice generated successfully',
                error: 'Failed to generate invoice'
            }
        );
    };

    const handleCancelOrder = () => {
        setIsCancelDialogOpen(true);
    };

    const confirmCancelOrder = () => {
        if (!cancelReason.trim()) {
            toast.error("Please provide a reason for cancellation");
            return;
        }

        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 2000)),
            {
                loading: 'Cancelling order...',
                success: () => {
                    setIsCancelDialogOpen(false);
                    setCancelReason("");
                    navigate("/seller/dashboard/orders");
                    return 'Order cancelled successfully';
                },
                error: 'Failed to cancel order'
            }
        );
    };

    const handleMarkAsShipped = () => {
        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 2000)),
            {
                loading: 'Updating order status...',
                success: 'Order marked as shipped',
                error: 'Failed to update order status'
            }
        );
    };

    const handleUpdateTracking = () => {
        setIsUpdateTrackingOpen(true);
    };

    const confirmUpdateTracking = () => {
        if (!trackingNumber.trim()) {
            toast.error("Please provide a tracking number");
            return;
        }

        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 2000)),
            {
                loading: 'Updating tracking number...',
                success: () => {
                    setIsUpdateTrackingOpen(false);
                    setTrackingNumber("");
                    return 'Tracking number updated successfully';
                },
                error: 'Failed to update tracking number'
            }
        );
    };

    return (
        <div className="container mx-auto p-6 max-w-7xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Link
                        to="/seller/dashboard/orders"
                        className="flex items-center justify-center size-10 rounded-lg border hover:bg-accent"
                    >
                        <ArrowLeftIcon className="size-6" />
                    </Link>
                    <h1 className="text-2xl font-semibold">Order Details</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleEdit}>
                        <Edit className="size-4 mr-2" />
                        Edit
                    </Button>
                    <Button variant="outline" onClick={handleDuplicate}>
                        <Duplicate className="size-4 mr-2" />
                        Duplicate
                    </Button>
                    <Button variant="outline" onClick={handlePrintLabel}>
                        <Printer className="size-4 mr-2" />
                        Print Label
                    </Button>
                    <Button variant="outline" onClick={handlePrintInvoice}>
                        <FileText className="size-4 mr-2" />
                        Print Invoice
                    </Button>
                    <Button variant="destructive" onClick={handleCancelOrder}>
                        <X className="size-4 mr-2" />
                        Cancel Order
                    </Button>
                    <Button variant="outline" onClick={handleMarkAsShipped}>
                        <Truck className="size-4 mr-2" />
                        Mark as Shipped
                    </Button>
                    <Button variant="outline" onClick={handleUpdateTracking}>
                        <RefreshCw className="size-4 mr-2" />
                        Update Tracking
                    </Button>
                </div>
            </div>

            {/* Order Info */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Order Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div>
                            <p className="text-sm text-muted-foreground mb-2">Order ID</p>
                            <div className="flex items-center gap-2">
                                <p className="font-medium">#{orderDetails.orderId}</p>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => {
                                        navigator.clipboard.writeText(orderDetails.orderId);
                                        toast.success("Order ID copied to clipboard");
                                    }}
                                >
                                    <CopyIcon className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground mb-2">Order Date</p>
                            <p className="font-medium">{orderDetails.date}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground mb-2">Total Amount</p>
                            <p className="font-medium">₹{orderDetails.amount}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground mb-2">Payment Type</p>
                            <p className="font-medium">{orderDetails.payment}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground mb-2">Status</p>
                            <p className="font-medium">{orderDetails.status}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground mb-2">Order Creation Type</p>
                            <p className="font-medium">
                                {orderDetails.chanel === "MANUAL" ? "Single (Manual) Order" : 
                                 orderDetails.chanel === "EXCEL" ? "Multiple (Bulk) Order" : 
                                 orderDetails.chanel}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground mb-2">Shipment Type</p>
                            <p className="font-medium">{orderDetails.shipmentType} Shipment</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground mb-2">Weight</p>
                            <p className="font-medium">{orderDetails.weight} kg</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground mb-2">Tags</p>
                            <p className="font-medium">{orderDetails.tags}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Customer & Warehouse Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Customer Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Name</p>
                                <p className="font-medium">{orderDetails.customerDetails.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Address</p>
                                <p className="font-medium">{orderDetails.customerDetails.address1}</p>
                                <p className="font-medium">{orderDetails.customerDetails.address2}</p>
                                <p className="font-medium">
                                    {orderDetails.customerDetails.city}, {orderDetails.customerDetails.state} {orderDetails.customerDetails.pincode}
                                </p>
                                <p className="font-medium">{orderDetails.customerDetails.country}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Phone</p>
                                <p className="font-medium">{orderDetails.customerDetails.phone}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Warehouse Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Name</p>
                                <p className="font-medium">{orderDetails.warehouseDetails.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Address</p>
                                <p className="font-medium">{orderDetails.warehouseDetails.address1}</p>
                                <p className="font-medium">
                                    {orderDetails.warehouseDetails.city}, {orderDetails.warehouseDetails.state} {orderDetails.warehouseDetails.pincode}
                                </p>
                                <p className="font-medium">{orderDetails.warehouseDetails.country}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Phone</p>
                                <p className="font-medium">{orderDetails.warehouseDetails.phone}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Products */}
            <Card>
                <CardHeader>
                    <CardTitle>Products</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs uppercase bg-muted">
                                <tr>
                                    <th className="px-6 py-3">Product</th>
                                    <th className="px-6 py-3">SKU</th>
                                    <th className="px-6 py-3">Quantity</th>
                                    <th className="px-6 py-3">Price</th>
                                    <th className="px-6 py-3">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderDetails.products.map((product, index) => (
                                    <tr key={index} className="bg-white border-b">
                                        <td className="px-6 py-4 font-medium">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="size-12 rounded-lg object-cover"
                                                />
                                                <span>{product.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">{product.sku}</td>
                                        <td className="px-6 py-4">{product.quantity}</td>
                                        <td className="px-6 py-4">₹{product.price.toFixed(2)}</td>
                                        <td className="px-6 py-4">₹{(product.price * product.quantity).toFixed(2)}</td>
                                    </tr>
                                ))}
                                <tr className="bg-muted">
                                    <td colSpan={4} className="px-6 py-4 text-right font-medium">
                                        Total Amount:
                                    </td>
                                    <td className="px-6 py-4 font-medium">
                                        ₹{orderDetails.products.reduce((total, product) => total + (product.price * product.quantity), 0).toFixed(2)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Cancel Order Dialog */}
            <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cancel Order</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="reason">Reason for Cancellation</Label>
                            <Input
                                id="reason"
                                placeholder="Enter reason for cancellation"
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmCancelOrder}>
                            Confirm Cancellation
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Update Tracking Dialog */}
            <Dialog open={isUpdateTrackingOpen} onOpenChange={setIsUpdateTrackingOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Tracking Number</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="tracking">Tracking Number</Label>
                            <Input
                                id="tracking"
                                placeholder="Enter tracking number"
                                value={trackingNumber}
                                onChange={(e) => setTrackingNumber(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsUpdateTrackingOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={confirmUpdateTracking}>
                            Update Tracking
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default SellerOrderDetailsPage; 