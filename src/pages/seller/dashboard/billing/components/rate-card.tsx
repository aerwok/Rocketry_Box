import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import RateTable from "./rate-table";
import { toast } from "sonner";
import { ServiceFactory } from "@/services/service-factory";

const formSchema = z.object({
    pickupPincode: z.string().min(6, "Pincode must be 6 digits").max(6),
    deliveryPincode: z.string().min(6, "Pincode must be 6 digits").max(6),
    paymentType: z.string().min(1, "Payment type is required"),
    purchaseAmount: z.string().min(1, "Purchase amount is required"),
    packageLength: z.string().min(1, "Length is required"),
    packageWidth: z.string().min(1, "Width is required"),
    packageHeight: z.string().min(1, "Height is required"),
    packageWeight: z.string().min(1, "Weight is required"),
    acceptTerms: z.boolean().refine((val) => val === true, {
        message: "You must accept the terms and conditions",
    }),
});

type RateCardInput = z.infer<typeof formSchema>;

// Interface for courier rates
interface CourierRate {
    name: string;
    baseCharge: number;
    codCharge: number;
    rtoCharges?: number;
    gst: number;
    total: number;
    courier?: string;
    productName?: string;
    mode?: string;
    finalWeight?: string;
    weightMultiplier?: number;
}

interface CalculationResult {
    zone: string;
    weight: string;
    volumetricWeight: string;
    rates: CourierRate[];
}

const RateCard = () => {
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
    const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<string | null>(null);

    // Fetch seller-specific rates on component mount
    useEffect(() => {
        const loadRates = async () => {
            setIsLoading(true);
            try {
                const response = await ServiceFactory.seller.billing.getRateCard();
                if (response.success) {
                    setLastUpdated(response.data.lastUpdated);
                    
                    // Show toast if rates were recently updated (in the last hour)
                    if (response.data.lastUpdated && 
                        (Date.now() - new Date(response.data.lastUpdated).getTime() < 60 * 60 * 1000)) {
                        toast.info("Your rate card has been updated by the admin");
                    }
                } else {
                    throw new Error(response.message || 'Failed to load rate card');
                }
            } catch (error) {
                console.error("Failed to load rate data:", error);
                toast.error("Failed to load your rate card. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        loadRates();
        
        // Set up polling to check for rate updates (every 5 minutes)
        const pollingInterval = setInterval(loadRates, 5 * 60 * 1000);
        
        return () => clearInterval(pollingInterval);
    }, []);

    const form = useForm<RateCardInput>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            pickupPincode: "",
            deliveryPincode: "",
            paymentType: "",
            purchaseAmount: "",
            packageLength: "",
            packageWidth: "",
            packageHeight: "",
            packageWeight: "",
            acceptTerms: false,
        },
    });

    const onSubmit = async (data: RateCardInput) => {
        try {
            setIsLoading(true);
            
            // Calculate volumetric weight (L x W x H / 5000)
            const volWeight = (
                parseFloat(data.packageLength) * 
                parseFloat(data.packageWidth) * 
                parseFloat(data.packageHeight)
            ) / 5000;
            
            // Use the greater of actual or volumetric weight
            const chargableWeight = Math.max(parseFloat(data.packageWeight), volWeight);
            
            // Prepare request data with all required fields
            const requestData = {
                pickupPincode: data.pickupPincode,
                deliveryPincode: data.deliveryPincode,
                paymentType: data.paymentType,
                purchaseAmount: parseFloat(data.purchaseAmount),
                weight: parseFloat(data.packageWeight),
                packageLength: parseFloat(data.packageLength),
                packageWidth: parseFloat(data.packageWidth),
                packageHeight: parseFloat(data.packageHeight),
                includeRTO: data.paymentType.toLowerCase() === 'prepaid' // Include RTO for prepaid orders
            };
            
            // Use seller billing API that properly handles pincodes and the new calculation logic
            const response = await ServiceFactory.seller.billing.calculateRates(requestData);

            if (response.success) {
                setCalculationResult({
                    zone: response.data.zone,
                    weight: `${chargableWeight.toFixed(2)} kg (Billed: ${response.data.billedWeight} kg)`,
                    volumetricWeight: response.data.volumetricWeight,
                    rates: response.data.rates.map(rate => ({
                        name: rate.name,
                        baseCharge: rate.baseCharge,
                        codCharge: rate.codCharge,
                        rtoCharges: rate.rtoCharges || 0,
                        gst: rate.gst,
                        total: rate.total,
                        courier: rate.courier,
                        productName: rate.productName,
                        mode: rate.mode,
                        finalWeight: rate.finalWeight,
                        weightMultiplier: rate.weightMultiplier
                    }))
                });
                setShowConfirmation(true);
                toast.success(`Found ${response.data.rates.length} rates for zone: ${response.data.zone}`);
            } else {
                throw new Error(response.message || 'Failed to calculate rates');
            }
        } catch (error) {
            console.error("Error calculating rates:", error);
            toast.error("Failed to calculate shipping rates. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full">
            {/* Rate Card Update Notification */}
            {lastUpdated && (
                <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-md p-3 mb-6">
                    <p className="text-sm">Your rate card was last updated: <span className="font-medium">{lastUpdated}</span></p>
                </div>
            )}
            
            {isLoading ? (
                <div className="w-full py-10 text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                    <p className="mt-4 text-gray-600">Loading your rate card...</p>
                </div>
            ) : (
                <>
                    {/* Form Section */}
                    <div className="w-full max-w-5xl mx-auto md:px-4">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Left Column */}
                                    <div className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="pickupPincode"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Pickup Pincode *</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Enter pickup pincode"
                                                            className="bg-[#F8F7FF]"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="paymentType"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Payment Type *</FormLabel>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className="bg-[#F8F7FF]">
                                                                <SelectValue placeholder="Enter payment type" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="COD">COD</SelectItem>
                                                            <SelectItem value="Prepaid">Prepaid</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="packageLength"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Package Length (cm) *</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Enter length"
                                                            className="bg-[#F8F7FF]"
                                                            type="number"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="packageHeight"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Package Height (cm) *</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Enter height"
                                                            className="bg-[#F8F7FF]"
                                                            type="number"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* Right Column */}
                                    <div className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="deliveryPincode"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Delivery Pincode *</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Enter delivery pincode"
                                                            className="bg-[#F8F7FF]"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="purchaseAmount"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Purchase Amount *</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Enter amount"
                                                            className="bg-[#F8F7FF]"
                                                            type="number"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="packageWidth"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Package Width (cm) *</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Enter width"
                                                            className="bg-[#F8F7FF]"
                                                            type="number"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="packageWeight"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Package Weight (kg) *</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Enter weight"
                                                            className="bg-[#F8F7FF]"
                                                            type="number"
                                                            step="0.01"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                {/* Terms and Conditions Section */}
                                <div className="bg-[#F8F7FF] p-6 rounded-lg space-y-4">
                                    {/* Header */}
                                    <div className="flex flex-wrap justify-between items-center border-b pb-2">
                                        <h3 className="text-xl font-semibold text-gray-800">
                                            Terms & Conditions:
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            All prices quoted are exclusive of Goods and Services Tax (GST)
                                        </p>
                                    </div>

                                    {/* Bulleted List */}
                                    <div className="space-y-3 text-sm text-gray-700">
                                        <ul className="list-disc pl-5 space-y-2">
                                            <li>
                                                Your Max liability amount assured by Rocketry Box is 5000. In case of damaged/lost shipment you will be assured the Invoice value or Max liability amount of 5000 whichever is lesser.
                                            </li>
                                            <li>
                                                Please be aware that the pricing is subject to change, which may occur due to updates from courier companies or modifications in any commercial terms.
                                            </li>
                                            <li>
                                                Freight rates are determined based on the weight of the shipment, calculated using either the Dead/Dry weight or the volumetric weight, whichever is higher.
                                            </li>
                                            <li>
                                                Return charges as same as Forward for currier's where special RTO pricing is not shared.
                                            </li>
                                            <li>
                                                Rocketry Box will not assist in shipping goods that come under the category of prohibited, Dangerous Goods or Restricted Goods.
                                            </li>
                                            <li>
                                                No Claim would be entertained for Glassware, Fragile products, Concealed damages and improper packaging.
                                            </li>
                                            <li>
                                                Default dimensions for volumetric weight will be calculated on the basis of L*B*H/Divison Factor. (All L,B,H are in cm)
                                            </li>
                                            <li>
                                                Weight discrepancies arising from inaccurate weight declarations cannot be claimed.
                                            </li>
                                            <li>
                                                Fixed COD charge or COD % of the order value whichever is higher will be taken while calculating the COD fee.
                                            </li>
                                            <li>
                                                The Sender will be liable for any and all costs, Charges and fees incurred in returning, storing or disposing of an undelivered Shipment.
                                            </li>
                                            <li>
                                                For any queries a ticket has to be raised on support@rocketrybox.com
                                            </li>
                                            <li>
                                                Rate cards are exclusive of secure shipment charges.
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Checkbox */}
                                    <FormField
                                        control={form.control}
                                        name="acceptTerms"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-4 border-t">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <div className="space-y-1 leading-none">
                                                    <FormLabel>
                                                        I agree to all terms and conditions mentioned above
                                                    </FormLabel>
                                                    <FormMessage />
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="flex justify-center">
                                    <Button
                                        type="submit"
                                        variant="purple"
                                        size="lg"
                                        disabled={!form.watch("acceptTerms")}
                                    >
                                        Calculate Price
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>

                    {/* Rate Table Section */}
                    <div className="w-full mt-8 max-w-[calc(100vw-64px-2rem)] mx-auto">
                        <div className="overflow-auto">
                            <div className="min-w-[1200px] px-4">
                                <RateTable />
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Calculation Result Modal */}
            <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
                <DialogContent className="bg-white border border-gray-200 max-w-6xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-center text-2xl font-medium text-gray-800">
                            Shipping Rate Calculation Results
                        </DialogTitle>
                    </DialogHeader>
                    {calculationResult && (
                        <div className="py-4 space-y-4">
                            <div className="bg-[#F8F7FF] p-4 rounded-lg">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div>
                                        <div className="text-gray-500">Weight Used:</div>
                                        <div className="font-medium">{calculationResult.weight}</div>
                                    </div>
                                    
                                    <div>
                                        <div className="text-gray-500">Volumetric Weight:</div>
                                        <div className="font-medium">{calculationResult.volumetricWeight} kg</div>
                                    </div>
                                    
                                    <div>
                                        <div className="text-gray-500">Zone:</div>
                                        <div className="font-medium text-blue-600">{calculationResult.zone}</div>
                                    </div>
                                    
                                    <div>
                                        <div className="text-gray-500">Total Options:</div>
                                        <div className="font-medium text-green-600">{calculationResult.rates.length} couriers</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm border-collapse border border-gray-200">
                                    <thead>
                                        <tr className="bg-[#6D5BD0] text-white">
                                            <th className="p-3 text-left border border-gray-300">Courier</th>
                                            <th className="p-3 text-left border border-gray-300">Product</th>
                                            <th className="p-3 text-left border border-gray-300">Mode</th>
                                            <th className="p-3 text-right border border-gray-300">Final Weight</th>
                                            <th className="p-3 text-right border border-gray-300">Weight Units</th>
                                            <th className="p-3 text-right border border-gray-300">Base Charge</th>
                                            <th className="p-3 text-right border border-gray-300">COD Charge</th>
                                            <th className="p-3 text-right border border-gray-300">RTO Charge</th>
                                            <th className="p-3 text-right border border-gray-300">GST (18%)</th>
                                            <th className="p-3 text-right border border-gray-300 font-bold">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {calculationResult.rates.map((rate, index) => (
                                            <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                                                <td className="p-3 border border-gray-300 font-medium text-blue-600">
                                                    {rate.courier || rate.name.split(' ')[0]}
                                                </td>
                                                <td className="p-3 border border-gray-300">
                                                    {rate.productName || '-'}
                                                </td>
                                                <td className="p-3 border border-gray-300">
                                                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                                                        {rate.mode || 'Surface'}
                                                    </span>
                                                </td>
                                                <td className="p-3 border border-gray-300 text-right">
                                                    {rate.finalWeight || '-'} kg
                                                </td>
                                                <td className="p-3 border border-gray-300 text-right">
                                                    {rate.weightMultiplier || '-'} units
                                                </td>
                                                <td className="p-3 border border-gray-300 text-right">₹{rate.baseCharge.toFixed(2)}</td>
                                                <td className="p-3 border border-gray-300 text-right">₹{rate.codCharge.toFixed(2)}</td>
                                                <td className="p-3 border border-gray-300 text-right">₹{(rate.rtoCharges || 0).toFixed(2)}</td>
                                                <td className="p-3 border border-gray-300 text-right">₹{rate.gst.toFixed(2)}</td>
                                                <td className="p-3 border border-gray-300 text-right font-bold text-green-600">₹{rate.total.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-blue-800 mb-2">Calculation Notes:</h4>
                                <div className="text-sm text-blue-700 space-y-1">
                                    <p>• <strong>Weight Units:</strong> Calculated in 0.5 kg increments (minimum billable weight applies)</p>
                                    <p>• <strong>Volumetric Weight:</strong> (L × W × H) ÷ 5000, billed weight is higher of actual or volumetric</p>
                                    <p>• <strong>COD Charges:</strong> Higher of fixed amount or percentage of order value</p>
                                    <p>• <strong>RTO Charges:</strong> Return charges included for prepaid orders (if applicable)</p>
                                    <p>• <strong>GST:</strong> 18% applied on base charges + COD + RTO charges</p>
                                    <p>• <strong>Zone Logic:</strong> Based on pickup/delivery locations and special zone rules</p>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter className="flex justify-center gap-4">
                        <Button
                            variant="outline"
                            onClick={() => setShowConfirmation(false)}
                        >
                            Close
                        </Button>
                        <Button
                            variant="purple"
                            onClick={() => {
                                setShowConfirmation(false);
                                // Optionally scroll to rate table or other action
                            }}
                        >
                            View Rate Table
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default RateCard;