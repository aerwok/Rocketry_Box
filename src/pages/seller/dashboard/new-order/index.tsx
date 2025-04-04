import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { NewOrderInput, newOrderSchema } from "@/lib/validations/new-order";
import { zodResolver } from "@hookform/resolvers/zod";
import { BoxesIcon, Info, MinusIcon, PlusIcon, Save, Truck, Package, CreditCard, MapPin, User, Calculator, Printer, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { ShippingOptionsModal } from "@/components/seller/shipping-options-modal";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

const SellerNewOrderPage = () => {
    const navigate = useNavigate();
    const [sameAsShipping, setSameAsShipping] = useState<boolean>(false);
    const [isDifferentAmount, setIsDifferentAmount] = useState<boolean>(false);
    const [file, setFile] = useState<File | null>(null);
    const [shippingModalOpen, setShippingModalOpen] = useState<boolean>(false);
    const [calculatedWeight, setCalculatedWeight] = useState<number>(0);
    const [volumetricWeight, setVolumetricWeight] = useState<number>(0);
    const [actualWeight, setActualWeight] = useState<number>(0);
    const [selectedShipping, setSelectedShipping] = useState<{
        courier: string;
        mode: string;
        charges: {
            shipping: number;
            cod: number;
            gst: number;
            total: number;
        };
    } | null>(null);
    const [sellerAddress, setSellerAddress] = useState({
        pincode: "201307", // Default seller pincode
        city: "Noida",
        state: "Uttar Pradesh"
    });
    const [orderId, setOrderId] = useState<string | null>(null);

    const form = useForm<NewOrderInput>({
        resolver: zodResolver(newOrderSchema),
        mode: "onChange",
        criteriaMode: "all",
        defaultValues: {
            orderNumber: "",
            shipmentType: "FORWARD",
            paymentType: "COD",
            fullName: "",
            contactNumber: "",
            email: "",
            addressLine1: "",
            addressLine2: "",
            landmark: "",
            pincode: "",
            city: "",
            state: "",
            sku: "",
            itemName: "",
            quantity: 1,
            itemWeight: undefined,
            itemPrice: undefined,
            collectibleAmount: undefined,
            shippingCharge: 0,
            codCharge: 0,
            taxAmount: 0,
            discount: 0,
            length: undefined,
            width: undefined,
            height: undefined,
            weight: undefined,
            totalAmount: 0,
            courier: "",
            warehouse: "",
            rtoWarehouse: "",
            shippingMode: "",
        },
    });

    // Calculate volumetric weight when dimensions or actual weight change
    useEffect(() => {
        const length = form.getValues('length');
        const width = form.getValues('width');
        const height = form.getValues('height');
        const quantity = form.getValues('quantity');
        const itemWeight = form.getValues('itemWeight');

        // Calculate volumetric weight only if all dimensions are provided
        if (length && width && height) {
            const newVolumetricWeight = ((length * width * height) / 5000) * quantity;
            setVolumetricWeight(newVolumetricWeight);
        } else {
            setVolumetricWeight(0);
        }

        // Set actual weight
        const newActualWeight = (itemWeight || 0) * quantity;
        setActualWeight(newActualWeight);

        // Use the higher weight for shipping calculations
        const finalWeight = Math.max(
            volumetricWeight || 0,
            newActualWeight || 0
        );
        setCalculatedWeight(finalWeight);
        form.setValue('weight', finalWeight);

    }, [form.watch(['length', 'width', 'height', 'quantity', 'itemWeight'])]);

    const onSubmit = async (data: NewOrderInput) => {
        try {
            // In a real application, this would be an API call to save the order
            console.log("Form submitted successfully:", data);
            
            // Simulate API call delay and set a dummy order ID
            setTimeout(() => {
                const dummyOrderId = `ORD-${Date.now().toString().slice(-6)}`;
                setOrderId(dummyOrderId);
                toast.success(`Order saved successfully with ID: ${dummyOrderId}`);
            }, 1000);
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error("Failed to save order");
        }
    };

    const handlePriceChange = (type: 'increase' | 'decrease') => {
        const currentPrice = form.getValues('itemPrice') || 0;
        const newPrice = type === 'increase' ? currentPrice + 100 : Math.max(0, currentPrice - 100);
        form.setValue('itemPrice', newPrice);
        
        // If payment type is COD and collectible amount is not set, update it too
        const paymentType = form.getValues('paymentType');
        const collectibleAmount = form.getValues('collectibleAmount');
        
        if (paymentType === 'COD' && (collectibleAmount === undefined || collectibleAmount === 0)) {
            form.setValue('collectibleAmount', newPrice);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFile(event.target.files[0]);
        }
    };

    const handleCheckRates = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        // Check if dimensions and weight are filled
        const length = form.getValues('length');
        const width = form.getValues('width');
        const height = form.getValues('height');
        const itemWeight = form.getValues('itemWeight');
        const itemPrice = form.getValues('itemPrice');
        const pincode = form.getValues('pincode');
        const city = form.getValues('city');
        const state = form.getValues('state');

        // Validate all required fields
        let missingFields = [];

        if (!length || length <= 0) missingFields.push("length");
        if (!width || width <= 0) missingFields.push("width");
        if (!height || height <= 0) missingFields.push("height");
        if (!itemWeight || itemWeight <= 0) missingFields.push("item weight");
        if (!itemPrice || itemPrice <= 0) missingFields.push("item price");
        
        if (missingFields.length > 0) {
            toast.error(`Please enter valid ${missingFields.join(", ")} values`);
            return;
        }

        if (!pincode || !city || !state) {
            toast.error("Please fill in all delivery address details");
            return;
        }

        try {
            const result = await form.trigger(['pincode', 'city', 'state']);

            if (result) {
                setShippingModalOpen(true);
            } else {
                const errors = form.formState.errors;
                const errorFields = Object.keys(errors);

                if (errorFields.length > 0) {
                    const firstError = errors[errorFields[0] as keyof typeof errors];
                    const errorMessage = firstError?.message ? String(firstError.message) : "Please fill delivery address details";
                    toast.error(errorMessage);
                } else {
                    toast.error("Please fill delivery address details");
                }
            }
        } catch (error) {
            console.error("Validation error:", error);
            toast.error("An error occurred during validation");
        }
    };

    const handleShipSelected = (options: {
        warehouse: string;
        rtoWarehouse: string;
        shippingMode: string;
        courier: string;
    }) => {
        setSelectedShipping({
            courier: options.courier,
            mode: options.shippingMode,
            charges: {
                shipping: 0,
                cod: 0,
                gst: 0,
                total: 0
            }
        });
        setShippingModalOpen(false);
    };

    const handleShipOrder = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (!selectedShipping) {
            toast.error("Please select shipping rates first");
            return;
        }

        // Ensure item price is set
        const itemPrice = form.getValues('itemPrice');
        if (!itemPrice || itemPrice <= 0) {
            toast.error("Please set a valid item price");
            return;
        }

        try {
            const orderData = form.getValues();
            const shipmentData = {
                ...orderData,
                courier: selectedShipping.courier,
                shippingMode: selectedShipping.mode,
                weight: calculatedWeight,
                sellerAddress,
                orderStatus: "SHIPPED"
            };

            // Make API call to create shipment
            // const response = await createShipment(shipmentData);
            
            toast.success(`Order shipped with ${selectedShipping.courier}`);
            navigate('/seller/dashboard/orders');
        } catch (error) {
            console.error("Error creating shipment:", error);
            toast.error("Failed to create shipment");
        }
    };

    const handlePrintInvoice = async () => {
        if (!orderId) {
            toast.error("Please save the order first");
            return;
        }

        try {
            // In a real application, this would be an API call to generate and download the invoice
            // For now, we'll simulate the download with a timeout
            toast.info("Generating invoice...");
            
            // Simulate API call delay
            setTimeout(() => {
                // Create a dummy PDF blob (in a real app, this would come from the server)
                const dummyPdfBlob = new Blob(["This is a dummy invoice PDF"], { type: "application/pdf" });
                const url = URL.createObjectURL(dummyPdfBlob);
                
                // Create a temporary link and trigger download
                const link = document.createElement("a");
                link.href = url;
                link.download = `invoice-${orderId}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                
                toast.success("Invoice downloaded successfully");
            }, 1500);
        } catch (error) {
            console.error("Error downloading invoice:", error);
            toast.error("Failed to download invoice");
        }
    };

    const handlePrintLabel = async () => {
        if (!orderId) {
            toast.error("Please save the order first");
            return;
        }

        try {
            // In a real application, this would be an API call to generate and download the shipping label
            // For now, we'll simulate the download with a timeout
            toast.info("Generating shipping label...");
            
            // Simulate API call delay
            setTimeout(() => {
                // Create a dummy PDF blob (in a real app, this would come from the server)
                const dummyPdfBlob = new Blob(["This is a dummy shipping label PDF"], { type: "application/pdf" });
                const url = URL.createObjectURL(dummyPdfBlob);
                
                // Create a temporary link and trigger download
                const link = document.createElement("a");
                link.href = url;
                link.download = `shipping-label-${orderId}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                
                toast.success("Shipping label downloaded successfully");
            }, 1500);
        } catch (error) {
            console.error("Error downloading shipping label:", error);
            toast.error("Failed to download shipping label");
        }
    };

    return (
        <div className="w-full flex flex-col gap-y-6">
            {/* Header Section */}
            <div className="flex items-center justify-between w-full bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center gap-2">
                    <h1 className="text-xl lg:text-2xl font-semibold text-gray-800">
                        Create New Order
                    </h1>
                </div>
                <Button variant="primary" onClick={() => navigate('/seller/dashboard/bulk-orders')}>
                    <BoxesIcon className="w-4 h-4 mr-2" />
                    Bulk Order
                </Button>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Order Details Section */}
                    <div className="bg-white border rounded-lg shadow-sm">
                        <div className="p-4 border-b">
                            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <CreditCard className="w-5 h-5" />
                                Order Details
                            </h2>
                        </div>
                        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <FormField
                                control={form.control}
                                name="orderNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium">
                                            Order Number *
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter order number" {...field} className="mt-1" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Read-only Order Creation Type field */}
                            <FormItem>
                                <FormLabel className="text-sm font-medium">
                                    Order Creation Type
                                </FormLabel>
                                <FormControl>
                                    <Input 
                                        value="Single (Manual) Order"
                                        disabled
                                        className="mt-1 bg-gray-100"
                                    />
                                </FormControl>
                                <FormDescription className="text-xs text-gray-500">
                                    For multiple orders, use Bulk Order upload
                                </FormDescription>
                            </FormItem>

                            <FormField
                                control={form.control}
                                name="shipmentType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium">
                                            Shipment Type *
                                        </FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue placeholder="Select shipment type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="FORWARD">Forward Shipment</SelectItem>
                                                <SelectItem value="REVERSE">Reverse Shipment</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="paymentType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium">
                                            Payment Type *
                                        </FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue placeholder="Select payment type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="COD">COD</SelectItem>
                                                <SelectItem value="PAID">Paid</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {/* Shipping Details Section */}
                    <div className="bg-white border rounded-lg shadow-sm">
                        <div className="p-4 border-b">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                    <MapPin className="w-5 h-5" />
                                    Shipping Details
                                </h2>
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="sameAsShipping"
                                        checked={sameAsShipping}
                                        onCheckedChange={(checked) => setSameAsShipping(checked as boolean)}
                                    />
                                    <label htmlFor="sameAsShipping" className="text-sm text-gray-600">
                                        Same as shipping address
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 space-y-6">
                            {/* Customer Information */}
                            <div className="grid md:grid-cols-3 gap-6">
                                <FormField
                                    control={form.control}
                                    name="fullName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium">
                                                Full Name *
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="Full Name" {...field} className="mt-1" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="contactNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium">
                                                Contact Number *
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="Contact Number" {...field} className="mt-1" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium">
                                                Email
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="Email" type="email" {...field} className="mt-1" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Address Fields */}
                            <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-6">
                                <FormField
                                    control={form.control}
                                    name="addressLine1"
                                    render={({ field }) => (
                                        <FormItem className="lg:col-span-4">
                                            <FormLabel className="text-sm font-medium">
                                                Address Line 1 *
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="Address Line 1" {...field} className="mt-1" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="addressLine2"
                                    render={({ field }) => (
                                        <FormItem className="lg:col-span-4">
                                            <FormLabel className="text-sm font-medium">
                                                Address Line 2
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="Address Line 2" {...field} className="mt-1" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="landmark"
                                    render={({ field }) => (
                                        <FormItem className="lg:col-span-2">
                                            <FormLabel className="text-sm font-medium">
                                                Landmark
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="Landmark" {...field} className="mt-1" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="pincode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium">
                                                Pincode *
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="Pincode" {...field} className="mt-1" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="city"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium">
                                                City *
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="City" {...field} className="mt-1" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="state"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium">
                                                State *
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="State" {...field} className="mt-1" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Item Details Section */}
                    <div className="bg-white border rounded-lg shadow-sm">
                        <div className="p-4 border-b">
                            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <Package className="w-5 h-5" />
                                Item Details
                            </h2>
                        </div>
                        <div className="p-4 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                                <FormField
                                    control={form.control}
                                    name="sku"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium">
                                                SKU
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter SKU" {...field} className="mt-1" />
                                            </FormControl>
                                            <FormDescription className="text-xs text-gray-500">
                                                Autofill if exists
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="itemName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium">
                                                Item Name *
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter item name" {...field} className="mt-1" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="quantity"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium">
                                                Quantity *
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="Enter quantity"
                                                    {...field}
                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                    className="mt-1"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="itemWeight"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium">
                                                Item Weight (kg) *
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="Enter item weight"
                                                    {...field}
                                                    value={field.value || ''}
                                                    onChange={(e) => {
                                                        const value = e.target.value === '' ? undefined : Number(e.target.value);
                                                        field.onChange(value);
                                                    }}
                                                    className="mt-1"
                                                />
                                            </FormControl>
                                            <FormDescription className="text-xs text-gray-500">
                                                Weight of a single item in kg
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="itemPrice"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium">
                                                Item Price (₹) *
                                            </FormLabel>
                                            <div className="flex items-center gap-2 mt-1">
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="Enter price"
                                                        {...field}
                                                        value={field.value || ''}
                                                        onChange={(e) => {
                                                            const value = e.target.value === '' ? undefined : Number(e.target.value);
                                                            field.onChange(value);
                                                        }}
                                                    />
                                                </FormControl>
                                                <div className="flex gap-1">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="icon"
                                                        className="bg-red-500 text-white hover:bg-red-400 border-none hover:text-white"
                                                        onClick={() => handlePriceChange('decrease')}
                                                    >
                                                        <MinusIcon className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="icon"
                                                        className="bg-green-500 text-white hover:bg-green-400 border-none hover:text-white"
                                                        onClick={() => handlePriceChange('increase')}
                                                    >
                                                        <PlusIcon className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Collectible Amount Section */}
                            {form.watch("paymentType") === "COD" && (
                                <div className="border-t pt-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="collectibleAmount"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-medium flex items-center gap-1">
                                                        Collectible Amount (₹)
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger>
                                                                    <Info className="h-3 w-3 text-muted-foreground" />
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p className="text-xs">Amount to be collected from the customer at the time of delivery</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="Enter collectible amount"
                                                            {...field}
                                                            value={field.value || ''}
                                                            onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                                                            className="mt-1"
                                                        />
                                                    </FormControl>
                                                    <FormDescription className="text-xs text-muted-foreground">
                                                        For COD orders, leave empty to use the item price
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Charges and Dimensions Section */}
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Package Dimensions Section */}
                        <div className="lg:w-[40%] bg-white border rounded-lg shadow-sm">
                            <div className="p-4 border-b">
                                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                    <Package className="w-5 h-5" />
                                    Package Dimensions
                                </h2>
                            </div>
                            <div className="p-4">
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="length"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium">
                                                    Length (cm) *
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        step="0.1"
                                                        placeholder="Enter length"
                                                        {...field}
                                                        value={field.value || ''}
                                                        onChange={(e) => {
                                                            const value = e.target.value === '' ? undefined : Number(e.target.value);
                                                            field.onChange(value);
                                                        }}
                                                        className="mt-1"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="width"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium">
                                                    Width (cm) *
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        step="0.1"
                                                        placeholder="Enter width"
                                                        {...field}
                                                        value={field.value || ''}
                                                        onChange={(e) => {
                                                            const value = e.target.value === '' ? undefined : Number(e.target.value);
                                                            field.onChange(value);
                                                        }}
                                                        className="mt-1"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="height"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium">
                                                    Height (cm) *
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        step="0.1"
                                                        placeholder="Enter height"
                                                        {...field}
                                                        value={field.value || ''}
                                                        onChange={(e) => {
                                                            const value = e.target.value === '' ? undefined : Number(e.target.value);
                                                            field.onChange(value);
                                                        }}
                                                        className="mt-1"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="mt-6 space-y-4">
                                    <div className="flex flex-col gap-2">
                                        <Label className="text-sm font-medium">Weight Details</Label>
                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="grid grid-cols-1 gap-4 p-4 bg-gray-50 rounded-lg">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-gray-600">Volumetric Weight:</span>
                                                    <span className="font-medium">{volumetricWeight ? volumetricWeight.toFixed(2) : '-'} {volumetricWeight ? 'kg' : ''}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-gray-600">Item Weight:</span>
                                                    <span className="font-medium">{actualWeight ? actualWeight.toFixed(2) : '-'} {actualWeight ? 'kg' : ''}</span>
                                                </div>
                                                <div className="flex justify-between items-center pt-2 border-t">
                                                    <span className="text-sm font-medium text-gray-900">Chargeable Weight:</span>
                                                    <span className="font-semibold text-purple-600">{calculatedWeight ? calculatedWeight.toFixed(2) : '-'} {calculatedWeight ? 'kg' : ''}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Calculator className="w-4 h-4 text-gray-400" />
                                                <span className="text-xs text-gray-500">
                                                    Volumetric weight = (L × W × H) / 5000
                                                </span>
                                            </div>

                                            <Button
                                                type="button"
                                                variant="default"
                                                onClick={handleCheckRates}
                                                className="w-full bg-purple-600 hover:bg-purple-700 text-white mt-2"
                                            >
                                                <Truck className="w-4 h-4 mr-2" />
                                                Check Shipping Rates
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Charges Section */}
                        <div className="lg:w-[60%] bg-white border rounded-lg shadow-sm">
                            <div className="p-4 border-b">
                                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                    <CreditCard className="w-5 h-5" />
                                    Charges
                                </h2>
                            </div>
                            <div className="p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="shippingCharge"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Shipping Charge</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="number"
                                                        disabled
                                                        value={field.value || 0}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="codCharge"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>COD Charge</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="number"
                                                        disabled
                                                        value={field.value || 0}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="taxAmount"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tax Amount</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="number"
                                                        disabled
                                                        value={field.value || 0}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="totalAmount"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Total Amount</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="number"
                                                        disabled
                                                        value={field.value || 0}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Add read-only Order Creation Type field */}
                    <FormItem>
                        <FormLabel className="text-sm font-medium">
                            Order Creation Type
                        </FormLabel>
                        <FormControl>
                            <Input 
                                value="Single (Manual) Order"
                                disabled
                                className="mt-1 bg-gray-100"
                            />
                        </FormControl>
                        <FormDescription className="text-xs text-gray-500">
                            For multiple orders, use Bulk Order upload
                        </FormDescription>
                    </FormItem>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate('/seller/dashboard/orders')}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="default"
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            Save Order
                        </Button>
                        <Button
                            type="button"
                            variant="default"
                            onClick={handlePrintInvoice}
                            disabled={!orderId}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            <FileText className="w-4 h-4 mr-2" />
                            Print Invoice
                        </Button>
                        <Button
                            type="button"
                            variant="default"
                            onClick={handlePrintLabel}
                            disabled={!orderId}
                            className="bg-orange-600 hover:bg-orange-700 text-white"
                        >
                            <Printer className="w-4 h-4 mr-2" />
                            Print Label
                        </Button>
                        <Button
                            type="button"
                            variant="default"
                            onClick={handleShipOrder}
                            disabled={!selectedShipping}
                            className="bg-green-600 hover:bg-green-700 text-white"
                        >
                            <Truck className="w-4 h-4 mr-2" />
                            Ship Order
                        </Button>
                    </div>

                    <ShippingOptionsModal
                        open={shippingModalOpen}
                        onOpenChange={(open) => setShippingModalOpen(open)}
                        onSubmit={handleShipSelected}
                        orderCount={1}
                        singleOrderId={null}
                    />
                </form>
            </Form>
        </div>
    );
};

export default SellerNewOrderPage; 