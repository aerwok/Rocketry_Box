import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, Package, Truck, Building2, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface CourierRate {
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
    onShipSelected: (
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

    // Only apply COD charge if payment type is COD
    const codCharge = (isCod && paymentType === 'cod') ? 30 : 0;
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
        name: "Delhivery",
        image: "/delhivery.png",
        zones: ["METRO-METRO", "METRO-ROI", "ROI-METRO", "ROI-ROI", "METRO-CAPITAL", "CAPITAL-METRO"],
        modes: ["Surface", "Air"],
        cod: true
    },
    {
        name: "Blue Dart",
        image: "/bluedart.png",
        zones: ["METRO-METRO", "METRO-ROI", "ROI-METRO", "METRO-CAPITAL"],
        modes: ["Surface", "Air"],
        cod: true
    },
    {
        name: "FedEx",
        image: "/fedex.png",
        zones: ["METRO-METRO", "METRO-ROI", "ROI-METRO", "CAPITAL-CAPITAL"],
        modes: ["Surface", "Air"],
        cod: false
    },
    {
        name: "DHL",
        image: "/dhl.png",
        zones: ["METRO-METRO", "CAPITAL-CAPITAL", "METRO-CAPITAL", "CAPITAL-METRO"],
        modes: ["Air"],
        cod: false
    }
];

export default function ShippingOptionsModal({
    isOpen,
    onClose,
    orderNumber,
    weight,
    paymentType,
    onShipSelected,
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

    // Set zone automatically when modal opens
    useEffect(() => {
        if (isOpen && deliveryAddress && sellerAddress) {
            const zone = determineZone(sellerAddress.pincode, deliveryAddress.pincode);
            setSelectedZone(zone);
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

    const handleCourierSelect = (courier: string) => {
        setSelectedCouriers(prev =>
            prev.includes(courier)
                ? prev.filter(c => c !== courier)
                : [courier]
        );
    };

    const handleModeSelect = (mode: string) => {
        setSelectedModes(prev =>
            prev.includes(mode)
                ? prev.filter(m => m !== mode)
                : [mode]
        );
    };

    const handleShip = () => {
        if (selectedCouriers.length === 1 && warehouse) {
            const selectedRate = courierRates.find(rate => rate.courier === selectedCouriers[0]);
            if (selectedRate) {
                onShipSelected(
                    selectedRate.courier,
                    warehouse,
                    selectedRate.mode,
                    {
                        shipping: selectedRate.shipping,
                        cod: paymentType === 'cod' && selectedRate.cod ? 30 : 0,
                        gst: selectedRate.gst,
                        total: selectedRate.total
                    }
                );
            }
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Shipping Options</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Zone Display */}
                    <div className="space-y-2">
                        <Label>Shipping Zone</Label>
                        <div className="text-lg font-semibold text-purple-600">
                            {selectedZone}
                        </div>
                        <div className="text-sm text-gray-500">
                            From: {sellerAddress.city}, {sellerAddress.state} - {sellerAddress.pincode}
                        </div>
                        <div className="text-sm text-gray-500">
                            To: {deliveryAddress.city}, {deliveryAddress.state} - {deliveryAddress.pincode}
                        </div>
                    </div>

                    {/* Shipping Modes */}
                    <div className="space-y-2">
                        <Label>Shipping Modes</Label>
                        <div className="flex gap-4">
                            {["Surface", "Air"].map((mode) => (
                                <div key={mode} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={mode}
                                        checked={selectedModes.includes(mode)}
                                        onCheckedChange={() => handleModeSelect(mode)}
                                    />
                                    <Label htmlFor={mode}>{mode}</Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Warehouse Selection */}
                    <div className="space-y-2">
                        <Label>Warehouse Details</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                                <Label className="text-sm font-medium flex items-center mb-1">
                                Warehouse <span className="text-red-500">*</span>
                                </Label>
                            <Input
                                value={warehouse}
                                onChange={(e) => setWarehouse(e.target.value)}
                                className="mb-1"
                            />
                            {showAddress && (
                                <div className="text-xs text-gray-500 mb-1">
                                    twst [9000000000], tst, tzt, Noida, undefined-201307, GSTIN:
                                </div>
                            )}
                        </div>
                        <div>
                                <Label className="text-sm font-medium flex items-center mb-1">
                                RTO W/H <span className="text-red-500">*</span>
                                </Label>
                            <Input
                                value={rtoWarehouse}
                                onChange={(e) => setRtoWarehouse(e.target.value)}
                                className="mb-1"
                            />
                            {showAddress && (
                                <div className="text-xs text-gray-500 mb-1">
                                    twst [9000000000], tst, tzt, Noida, undefined-201307, GSTIN:
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center mt-2">
                        <Checkbox
                            id="show-address"
                            checked={showAddress}
                            onCheckedChange={() => setShowAddress(!showAddress)}
                        />
                            <Label htmlFor="show-address" className="text-sm ml-2 cursor-pointer">
                            Show Address
                            </Label>
                    </div>
                </div>

                    {/* Courier Rates Table */}
                    {selectedZone && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold">Available Couriers</h3>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleSort("courier")}
                                    >
                                        Courier
                                        {sortField === "courier" && (
                                            sortOrder === "asc" ? <ArrowUp className="ml-1 h-4 w-4" /> : <ArrowDown className="ml-1 h-4 w-4" />
                                        )}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleSort("shipping")}
                                    >
                                        Shipping
                                        {sortField === "shipping" && (
                                            sortOrder === "asc" ? <ArrowUp className="ml-1 h-4 w-4" /> : <ArrowDown className="ml-1 h-4 w-4" />
                                        )}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleSort("total")}
                                    >
                                        Total
                                        {sortField === "total" && (
                                            sortOrder === "asc" ? <ArrowUp className="ml-1 h-4 w-4" /> : <ArrowDown className="ml-1 h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                        </div>

                            <div className="border rounded-lg">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="p-4 text-left">Select</th>
                                            <th className="p-4 text-left">Courier</th>
                                            <th className="p-4 text-left">Mode</th>
                                            {paymentType === 'cod' && (
                                                <th className="p-4 text-left">COD</th>
                                            )}
                                            <th className="p-4 text-right">Shipping</th>
                                            <th className="p-4 text-right">GST</th>
                                            <th className="p-4 text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sortedRates.map((rate) => (
                                            <tr key={`${rate.courier}-${rate.mode}`} className="border-b">
                                                <td className="p-4">
                                                    <Checkbox
                                                        checked={selectedCouriers.includes(rate.courier)}
                                                        onCheckedChange={() => handleCourierSelect(rate.courier)}
                                                    />
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2">
                                                        <img
                                                            src={rate.image}
                                                            alt={rate.courier}
                                                            className="w-8 h-8 object-contain"
                                                        />
                                                        {rate.courier}
                                                    </div>
                                                </td>
                                                <td className="p-4">{rate.mode}</td>
                                                {paymentType === 'cod' && (
                                                    <td className="p-4">
                                                        {rate.cod ? "Yes" : "No"}
                                                </td>
                                                )}
                                                <td className="p-4 text-right">₹{rate.shipping.toFixed(2)}</td>
                                                <td className="p-4 text-right">₹{rate.gst.toFixed(2)}</td>
                                                <td className="p-4 text-right">₹{rate.total.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4">
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                    </Button>
                    <Button
                        variant="default"
                            onClick={handleShip}
                            disabled={selectedCouriers.length !== 1 || !warehouse}
                        >
                            Ship Order
                    </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
} 