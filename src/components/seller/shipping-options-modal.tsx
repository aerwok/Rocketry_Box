import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, Package, Truck, Building2, MapPin, X, Check, Home, RotateCcw, Plane } from "lucide-react";
import { cn } from "@/lib/utils";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ArrowRight } from "lucide-react";

interface CourierRate {
    id: string;
    courier: string;
    image: string;
    mode: string;
    cod: boolean;
    shipping: number;
    gst: number;
    total: number;
    zone: string;
}

type SortField = "courier" | "shipping" | "total";
type SortOrder = "asc" | "desc";

interface RateCalculation {
    shipping: number;
    cod: number;
    gst: number;
    total: number;
}

interface ShippingOptionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderNumber: string;
    weight: number;
    paymentType: 'cod' | 'paid';
    onCourierSelected: (
        courier: string,
        warehouse: string,
        mode: string,
        charges: {
            shipping: number;
            cod: number;
            gst: number;
            total: number;
        }
    ) => void;
    deliveryAddress: {
        pincode: string;
        city: string;
        state: string;
    };
    sellerAddress: {
        pincode: string;
        city: string;
        state: string;
    };
}

// Define metro cities and state capitals
const metroCities = {
    "DELHI": ["110001", "110096"],
    "MUMBAI": ["400001", "400107"],
    "KOLKATA": ["700001", "700156"],
    "CHENNAI": ["600001", "600096"],
    "BANGALORE": ["560001", "560103"],
    "HYDERABAD": ["500001", "500096"],
    "AHMEDABAD": ["380001", "380063"],
    "PUNE": ["411001", "411062"]
};

const stateCapitals = {
    "LUCKNOW": ["226001", "226031"],
    "JAIPUR": ["302001", "302033"],
    "BHOPAL": ["462001", "462051"],
    "PATNA": ["800001", "800023"],
    "CHANDIGARH": ["160001", "160047"],
    "GUWAHATI": ["781001", "781033"],
    "BHUBANESWAR": ["751001", "751031"],
    "THIRUVANANTHAPURAM": ["695001", "695043"]
};

// Define zones based on origin and destination
const zoneDefinitions = {
    "METRO": Object.keys(metroCities),
    "CAPITAL": Object.keys(stateCapitals),
    "ROI": [] // Rest of India - any location not in metro or capital
};

// Rate card for different weight slabs and zones
const weightSlabs = [
    { min: 0, max: 0.5 },
    { min: 0.5, max: 1 },
    { min: 1, max: 1.5 },
    { min: 1.5, max: 2 },
    { min: 2, max: 2.5 },
    { min: 2.5, max: 3 },
    { min: 3, max: 4 },
    { min: 4, max: 5 },
    { min: 5, max: 10 },
    { min: 10, max: 15 },
    { min: 15, max: 20 },
    { min: 20, max: 25 },
    { min: 25, max: 30 }
];

// Define rate card based on the image
const rateCard = {
    "METRO-METRO": {
        surface: {
            base: [30, 35, 40, 45, 50, 60, 70, 80, 120, 160, 200, 240, 280],
            additional: 40
        },
        air: {
            base: [40, 45, 50, 55, 60, 70, 80, 90, 140, 190, 240, 290, 340],
            additional: 50
        }
    },
    "METRO-CAPITAL": {
        surface: {
            base: [35, 40, 45, 50, 55, 65, 75, 85, 130, 175, 220, 265, 310],
            additional: 45
        },
        air: {
            base: [45, 50, 55, 60, 65, 75, 85, 95, 150, 205, 260, 315, 370],
            additional: 55
        }
    },
    "METRO-ROI": {
        surface: {
            base: [40, 45, 50, 55, 60, 70, 80, 90, 140, 190, 240, 290, 340],
            additional: 50
        },
        air: {
            base: [50, 55, 60, 65, 70, 80, 90, 100, 160, 220, 280, 340, 400],
            additional: 60
        }
    },
    "CAPITAL-METRO": {
        surface: {
            base: [35, 40, 45, 50, 55, 65, 75, 85, 130, 175, 220, 265, 310],
            additional: 45
        },
        air: {
            base: [45, 50, 55, 60, 65, 75, 85, 95, 150, 205, 260, 315, 370],
            additional: 55
        }
    },
    "CAPITAL-CAPITAL": {
        surface: {
            base: [40, 45, 50, 55, 60, 70, 80, 90, 140, 190, 240, 290, 340],
            additional: 50
        },
        air: {
            base: [50, 55, 60, 65, 70, 80, 90, 100, 160, 220, 280, 340, 400],
            additional: 60
        }
    },
    "CAPITAL-ROI": {
        surface: {
            base: [45, 50, 55, 60, 65, 75, 85, 95, 150, 205, 260, 315, 370],
            additional: 55
        },
        air: {
            base: [55, 60, 65, 70, 75, 85, 95, 105, 170, 235, 300, 365, 430],
            additional: 65
        }
    },
    "ROI-METRO": {
        surface: {
            base: [40, 45, 50, 55, 60, 70, 80, 90, 140, 190, 240, 290, 340],
            additional: 50
        },
        air: {
            base: [50, 55, 60, 65, 70, 80, 90, 100, 160, 220, 280, 340, 400],
            additional: 60
        }
    },
    "ROI-CAPITAL": {
        surface: {
            base: [45, 50, 55, 60, 65, 75, 85, 95, 150, 205, 260, 315, 370],
            additional: 55
        },
        air: {
            base: [55, 60, 65, 70, 75, 85, 95, 105, 170, 235, 300, 365, 430],
            additional: 65
        }
    },
    "ROI-ROI": {
        surface: {
            base: [50, 55, 60, 65, 70, 80, 90, 100, 160, 220, 280, 340, 400],
            additional: 60
        },
        air: {
            base: [60, 65, 70, 75, 80, 90, 100, 110, 180, 250, 320, 390, 460],
            additional: 70
        }
    }
};

// Function to determine city type (METRO/CAPITAL/ROI)
const determineCityType = (pincode: string): string => {
    // Check if it's a metro city
    for (const [city, range] of Object.entries(metroCities)) {
        if (pincode >= range[0] && pincode <= range[1]) {
            return "METRO";
        }
    }
    
    // Check if it's a state capital
    for (const [city, range] of Object.entries(stateCapitals)) {
        if (pincode >= range[0] && pincode <= range[1]) {
            return "CAPITAL";
        }
    }
    
    // If not metro or capital, it's ROI
    return "ROI";
};

// Function to determine zone based on origin and destination
const determineZone = (sellerPincode: string, deliveryPincode: string): string => {
    const originType = determineCityType(sellerPincode);
    const destinationType = determineCityType(deliveryPincode);
    return `${originType}-${destinationType}`;
};

// Function to calculate shipping rate
const calculateShippingRate = (
    zone: string,
    weight: number,
    mode: "surface" | "air",
    isCod: boolean = false,
    paymentType: 'cod' | 'paid' = 'paid'
): RateCalculation => {
    const zoneRates = rateCard[zone as keyof typeof rateCard];
    if (!zoneRates) {
        return {
            shipping: 0,
            cod: 0,
            gst: 0,
            total: 0
        };
    }

    let slabIndex = weightSlabs.findIndex(slab => weight > slab.min && weight <= slab.max);
    if (slabIndex === -1) {
        slabIndex = weightSlabs.length - 1;
    }

    const modeRates = zoneRates[mode];
    let baseCharge = modeRates.base[slabIndex];

    if (weight > weightSlabs[slabIndex].max) {
        const additionalWeight = Math.ceil(weight - weightSlabs[slabIndex].max);
        baseCharge += additionalWeight * modeRates.additional;
    }

    // Only apply COD charge if payment type is 'cod' and the courier supports COD
    const codCharge = (paymentType === 'cod' && isCod) ? 30 : 0;
    const fuelSurcharge = baseCharge * 0.15;
    const subtotal = baseCharge + codCharge + fuelSurcharge;
    const gst = subtotal * 0.18;
    const total = subtotal + gst;

    return {
        shipping: baseCharge + fuelSurcharge,
        cod: codCharge,
        gst,
        total
    };
};

// Delivery partner data
const deliveryPartners = [
    {
        name: "Bluedart",
        image: "/bluedart.png",
        zones: ["METRO-METRO", "METRO-ROI", "ROI-METRO", "METRO-CAPITAL"],
        modes: ["Surface", "Air"],
        cod: true
    },
    {
        name: "Delhivery Surface",
        image: "/delhivery.png",
        zones: ["METRO-METRO", "METRO-ROI", "ROI-METRO", "ROI-ROI", "METRO-CAPITAL", "CAPITAL-METRO"],
        modes: ["Surface"],
        cod: true
    },
    {
        name: "DTDC",
        image: "/dtdc.png",
        zones: ["METRO-METRO", "METRO-ROI", "ROI-METRO", "ROI-ROI", "METRO-CAPITAL", "CAPITAL-METRO"],
        modes: ["Surface", "Air"],
        cod: true
    },
    {
        name: "Ecom Express",
        image: "/ecom.png",
        zones: ["METRO-METRO", "METRO-ROI", "ROI-METRO", "ROI-ROI"],
        modes: ["Surface"],
        cod: true
    },
    {
        name: "Ekart",
        image: "/ekart.png",
        zones: ["METRO-METRO", "METRO-ROI", "ROI-METRO"],
        modes: ["Surface"],
        cod: true
    },
    {
        name: "Xpressbees",
        image: "/xpressbees.png",
        zones: ["METRO-METRO", "METRO-ROI", "ROI-METRO", "ROI-ROI"],
        modes: ["Surface", "Air"],
        cod: true
    },
    {
        name: "Shadowfax",
        image: "/shadowfax.png",
        zones: ["METRO-METRO", "METRO-ROI", "ROI-METRO"],
        modes: ["Surface", "Air"],
        cod: true
    }
];

export default function ShippingOptionsModal({
    isOpen,
    onClose,
    orderNumber,
    weight,
    paymentType,
    onCourierSelected,
    deliveryAddress,
    sellerAddress
}: ShippingOptionsModalProps) {
    const [sortField, setSortField] = useState<SortField>("total");
    const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
    const [selectedCouriers, setSelectedCouriers] = useState<string[]>([]);
    const [selectedModes, setSelectedModes] = useState<string[]>([]);
    const [warehouse, setWarehouse] = useState<string>("tes5");
    const [rtoWarehouse, setRtoWarehouse] = useState<string>("tes5");
    const [showAddress, setShowAddress] = useState<boolean>(false);
    const [selectedZone, setSelectedZone] = useState<string>("");
    const [activeTab, setActiveTab] = useState<"details" | "rates">("details");

    // Reset selections when modal opens
    useEffect(() => {
        if (isOpen) {
            setSelectedCouriers([]);
            if (deliveryAddress && sellerAddress) {
                const zone = determineZone(sellerAddress.pincode, deliveryAddress.pincode);
                setSelectedZone(zone);
            }
        }
    }, [isOpen, deliveryAddress, sellerAddress]);

    // Generate courier rates based on selected zone and modes
    const courierRates: CourierRate[] = selectedZone ? deliveryPartners
        .filter(partner => partner.zones.includes(selectedZone))
        .flatMap(partner => {
            const rates: CourierRate[] = [];
            partner.modes.forEach(mode => {
                if (selectedModes.length === 0 || selectedModes.includes(mode)) {
                    const rate = calculateShippingRate(
                        selectedZone,
                        weight,
                        mode.toLowerCase() as "surface" | "air",
                        paymentType === 'cod' && partner.cod,
                        paymentType
                    );
                    
                    if (rate.total > 0) {
                        rates.push({
                            id: `${partner.name}-${mode}`,
                            courier: partner.name,
                            image: partner.image,
                            mode,
                            cod: paymentType === 'cod' ? partner.cod : false,
                            shipping: rate.shipping,
                            gst: rate.gst,
                            total: rate.total,
                            zone: selectedZone
                        });
                    }
                }
            });
            return rates;
        }) : [];

    // Sort courier rates
    const sortedRates = [...courierRates].sort((a, b) => {
        const multiplier = sortOrder === "asc" ? 1 : -1;
        return (a[sortField] > b[sortField] ? 1 : -1) * multiplier;
    });

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortOrder("asc");
        }
    };

    const handleCourierSelect = (id: string) => {
        setSelectedCouriers([id]);
    };

    const handleModeSelect = (mode: string) => {
        setSelectedModes(prev =>
            prev.includes(mode)
                ? prev.filter(m => m !== mode)
                : [mode]
        );
    };

    const handleApplySelection = () => {
        if (selectedCouriers.length === 1 && warehouse) {
            const selectedRate = courierRates.find(rate => rate.id === selectedCouriers[0]);
            if (selectedRate) {
                // COD charge is only applied when payment type is 'cod' and the courier supports COD
                const codCharge = (paymentType === 'cod' && selectedRate.cod) ? 30 : 0;
                
                onCourierSelected(
                    selectedRate.courier,
                    warehouse,
                    selectedRate.mode,
                    {
                        shipping: selectedRate.shipping,
                        cod: codCharge,
                        gst: selectedRate.gst,
                        total: selectedRate.total
                    }
                );
                
                // Close the modal
                onClose();
            }
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl p-0 overflow-hidden" showCloseButton={false}>
                <div className="flex flex-col h-full">
                    {/* Header with order details */}
                    <div className="bg-gradient-to-r from-purple-900 to-violet-700 text-white p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-bold">Select Courier for Order #{orderNumber}</h2>
                                <p className="text-violet-200 mt-1">Weight: {weight} kg • Payment: {paymentType.toUpperCase()}</p>
                            </div>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-white hover:bg-white/20 rounded-full"
                                onClick={onClose}
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                        
                        {/* Shipping route visualization */}
                        <div className="flex items-center gap-2 mt-4 bg-white/10 p-3 rounded-lg">
                            <div className="text-center">
                                <div className="text-xs text-violet-200">From</div>
                                <div className="font-medium">{sellerAddress.city}</div>
                                <div className="text-xs">{sellerAddress.pincode}</div>
                            </div>
                            <div className="flex-1 flex items-center justify-center">
                                <div className="h-0.5 flex-1 bg-white/30"></div>
                                <Truck className="h-5 w-5 mx-2" />
                                <div className="h-0.5 flex-1 bg-white/30"></div>
                            </div>
                            <div className="text-center">
                                <div className="text-xs text-violet-200">To</div>
                                <div className="font-medium">{deliveryAddress.city}</div>
                                <div className="text-xs">{deliveryAddress.pincode}</div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Navigation tabs */}
                    <div className="border-b">
                        <div className="flex">
                            <button
                                className={`px-6 py-3 font-medium text-sm ${activeTab === "details" 
                                    ? "border-b-2 border-purple-600 text-purple-600" 
                                    : "text-gray-500 hover:text-gray-700"}`}
                                onClick={() => setActiveTab("details")}
                            >
                                Shipping Details
                            </button>
                            <button
                                className={`px-6 py-3 font-medium text-sm ${activeTab === "rates" 
                                    ? "border-b-2 border-purple-600 text-purple-600" 
                                    : "text-gray-500 hover:text-gray-700"}`}
                                onClick={() => setActiveTab("rates")}
                            >
                                Courier Rates
                            </button>
                        </div>
                    </div>
                    
                    {/* Content area */}
                    <div className="p-6 overflow-y-auto max-h-[calc(80vh-180px)]">
                        {activeTab === "details" && (
                            <div className="space-y-6">
                                {/* Zone Badge */}
                                <div className="bg-violet-50 border border-violet-200 rounded-lg p-4">
                                    <div className="flex items-center gap-2">
                                        <div className="bg-violet-200 text-violet-800 font-semibold px-3 py-1 rounded-full text-sm">
                                            {selectedZone} Zone
                                        </div>
                                        <span className="text-violet-700 text-sm">
                                            {determineCityType(sellerAddress.pincode)} to {determineCityType(deliveryAddress.pincode)}
                                        </span>
                                    </div>
                                </div>

                                {/* Shipping Modes as Filter */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-sm font-semibold text-gray-700">Filter by Shipping Mode</Label>
                                        {selectedModes.length > 0 && (
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                className="text-xs text-gray-500 h-7"
                                                onClick={() => setSelectedModes([])}
                                            >
                                                Clear filter
                                            </Button>
                                        )}
                                    </div>
                                    <div className="flex gap-3">
                                        {["Surface", "Air"].map((mode) => (
                                            <button
                                                key={mode}
                                                type="button"
                                                className={`px-4 py-2 border rounded-lg flex items-center gap-2 transition-all 
                                                ${selectedModes.includes(mode) 
                                                    ? "border-purple-600 bg-purple-50 text-purple-700" 
                                                    : "border-gray-200 hover:border-gray-300 text-gray-700"}`}
                                                onClick={() => handleModeSelect(mode)}
                                            >
                                                {mode === "Surface" ? 
                                                    <Truck className="h-4 w-4" /> : 
                                                    <Plane className="h-4 w-4" />
                                                }
                                                <span>{mode}</span>
                                            </button>
                                        ))}
                                    </div>
                                    <div className="text-xs text-gray-500 italic">
                                        Select a shipping mode to filter the available courier options
                                    </div>
                                </div>

                                {/* Warehouse Selection */}
                                <div className="space-y-3">
                                    <Label className="text-sm font-semibold text-gray-700">Warehouse Details</Label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <Label className="text-xs text-gray-500">Pickup Warehouse</Label>
                                            <div className="relative">
                                                <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <Input
                                                    value={warehouse}
                                                    onChange={(e) => setWarehouse(e.target.value)}
                                                    className="pl-10"
                                                    placeholder="Select pickup warehouse"
                                                />
                                            </div>
                                            {showAddress && (
                                                <div className="mt-1 p-2 bg-gray-50 text-xs text-gray-600 rounded border border-gray-100">
                                                    twst [9000000000], tst, tzt, Noida, undefined-201307, GSTIN:
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs text-gray-500">RTO Warehouse</Label>
                                            <div className="relative">
                                                <RotateCcw className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <Input
                                                    value={rtoWarehouse}
                                                    onChange={(e) => setRtoWarehouse(e.target.value)}
                                                    className="pl-10"
                                                    placeholder="Select return warehouse"
                                                />
                                            </div>
                                            {showAddress && (
                                                <div className="mt-1 p-2 bg-gray-50 text-xs text-gray-600 rounded border border-gray-100">
                                                    twst [9000000000], tst, tzt, Noida, undefined-201307, GSTIN:
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <Checkbox
                                            id="show-address"
                                            checked={showAddress}
                                            onCheckedChange={() => setShowAddress(!showAddress)}
                                        />
                                        <Label htmlFor="show-address" className="text-sm ml-2 cursor-pointer">
                                            Show warehouse details
                                        </Label>
                                    </div>
                                </div>
                                
                                <div className="pt-4">
                                    <Button
                                        variant="default"
                                        size="lg"
                                        className="w-full bg-purple-600 hover:bg-purple-700"
                                        onClick={() => setActiveTab("rates")}
                                    >
                                        Continue to Courier Selection
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                        
                        {activeTab === "rates" && (
                            <div className="space-y-6">
                                {/* Filter controls */}
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <h3 className="text-lg font-semibold">Available Courier Partners</h3>
                                        <div className="text-sm text-gray-500 flex items-center gap-2">
                                            <span>Filter:</span>
                                            {selectedModes.length > 0 ? (
                                                <div className="flex items-center gap-1">
                                                    <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full text-xs font-medium">
                                                        {selectedModes[0]}
                                                    </span>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm" 
                                                        className="h-6 w-6 p-0 rounded-full" 
                                                        onClick={() => setSelectedModes([])}
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-400">None</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Select defaultValue="total" onValueChange={(val) => handleSort(val as SortField)}>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Sort by" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="courier">Courier</SelectItem>
                                                <SelectItem value="shipping">Shipping Charges</SelectItem>
                                                <SelectItem value="total">Total Cost</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                                        >
                                            {sortOrder === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </div>
                                
                                {/* Courier cards */}
                                <div className="grid grid-cols-1 gap-4">
                                    {sortedRates.length === 0 ? (
                                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center text-gray-500">
                                            <Package className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                                            <p>No courier options available for the selected route and mode.</p>
                                            <p className="text-sm mt-1">Try changing the shipping mode filter or check warehouse details.</p>
                                            <div className="mt-4 flex justify-center gap-3">
                                                <Button 
                                                    variant="outline" 
                                                    onClick={() => setSelectedModes([])}
                                                    disabled={selectedModes.length === 0}
                                                >
                                                    Clear Filter
                                                </Button>
                                                <Button 
                                                    variant="default"
                                                    onClick={() => setActiveTab("details")}
                                                >
                                                    Back to Shipping Details
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="border rounded-lg overflow-hidden">
                                            <div className="bg-gray-50 px-4 py-3 border-b grid grid-cols-8 text-sm font-medium text-gray-500">
                                                <div className="col-span-1"></div>
                                                <div className="col-span-3">Courier Service</div>
                                                <div className="text-center">Mode</div>
                                                <div className="text-center">COD Charge</div>
                                                <div className="text-center">Shipping Charge</div>
                                                <div className="text-right">Total Price</div>
                                            </div>
                                            <div className="divide-y">
                                                {sortedRates.map((rate) => (
                                                    <div 
                                                        key={rate.id}
                                                        className={`p-4 transition-all cursor-pointer hover:bg-gray-50 ${
                                                            selectedCouriers.includes(rate.id)
                                                                ? "bg-purple-50"
                                                                : "bg-white"
                                                        }`}
                                                        onClick={() => handleCourierSelect(rate.id)}
                                                    >
                                                        <div className="grid grid-cols-8 items-center">
                                                            <div className="col-span-1 flex justify-center">
                                                                <div className={`w-5 h-5 flex items-center justify-center rounded-full border 
                                                                    ${selectedCouriers.includes(rate.id) 
                                                                        ? "border-purple-600 bg-purple-600 text-white" 
                                                                        : "border-gray-300 bg-white"}`}
                                                                >
                                                                    {selectedCouriers.includes(rate.id) && <Check className="h-3 w-3" />}
                                                                </div>
                                                            </div>
                                                            <div className="col-span-3 flex items-center gap-3">
                                                                <div className="w-14 h-10 flex items-center justify-center bg-gray-50 rounded p-1">
                                                                    <img
                                                                        src={rate.image || `/courier-logos/${rate.courier.toLowerCase().replace(/\s+/g, '-')}.png`}
                                                                        alt={rate.courier}
                                                                        className="w-12 h-8 object-contain"
                                                                        onError={(e) => {
                                                                            (e.target as HTMLImageElement).src = "/placeholder-logo.png";
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <div className="font-medium">{rate.courier}</div>
                                                                </div>
                                                            </div>
                                                            <div className="text-center">
                                                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                                    rate.mode === 'Surface' 
                                                                    ? 'bg-blue-100 text-blue-700' 
                                                                    : 'bg-amber-100 text-amber-700'
                                                                }`}>
                                                                    {rate.mode}
                                                                </span>
                                                            </div>
                                                            <div className="text-center">
                                                                {paymentType === 'cod' && rate.cod ? (
                                                                    <span className="font-medium">₹30.00</span>
                                                                ) : (
                                                                    <span className="text-gray-500">₹0.00</span>
                                                                )}
                                                            </div>
                                                            <div className="text-center">
                                                                <span className="font-medium">₹{rate.shipping.toFixed(2)}</span>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="text-lg font-bold text-purple-900">₹{rate.total.toFixed(2)}</div>
                                                                <div className="text-xs text-gray-500">
                                                                    GST: ₹{rate.gst.toFixed(2)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* Footer with action buttons */}
                    <div className="border-t p-4 flex items-center justify-between bg-gray-50">
                        <Button 
                            variant="outline" 
                            onClick={() => activeTab === "details" ? onClose() : setActiveTab("details")}
                        >
                            {activeTab === "details" ? "Cancel" : "Back"}
                        </Button>
                        {activeTab === "rates" && (
                            <div className="flex items-center gap-4">
                                <div className="text-sm">
                                    {selectedCouriers.length === 1 
                                        ? `Selected: ${selectedCouriers[0]}` 
                                        : "Select a courier to continue"
                                    }
                                </div>
                                <Button
                                    variant="default"
                                    className="bg-purple-600 hover:bg-purple-700"
                                    onClick={handleApplySelection}
                                    disabled={selectedCouriers.length !== 1 || !warehouse}
                                >
                                    Apply Selection
                                    <Check className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
} 