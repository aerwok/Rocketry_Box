import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronsUpDownIcon, X, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface CourierRate {
    courier: string;
    image: string;
    mode: string;
    cod: string;
    shipping: number;
    gst: number;
    total: number;
}

type SortField = "courier" | "mode" | "shipping" | "cod" | "gst" | "total";
type SortOrder = "asc" | "desc";
type ShippingMode = "All" | "Air" | "Surface" | "Express" | "0.5Kg" | "1Kg" | "2Kg" | "Heavy";

interface AdminShippingOptionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderNumber: string;
    weight: number;
    onShipSelected: (courier: string, warehouse: string, mode: string) => void;
}

const AdminShippingOptionsModal = ({ isOpen, onClose, orderNumber, weight, onShipSelected }: AdminShippingOptionsModalProps) => {
    
    const [sortField, setSortField] = useState<SortField>("total");
    const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
    const [selectedCourier, setSelectedCourier] = useState<string>("");
    const [selectedMode, setSelectedMode] = useState<string>("");
    const [warehouse, setWarehouse] = useState<string>("tes5");
    const [rtoWarehouse, setRtoWarehouse] = useState<string>("tes5");
    const [zone] = useState<string>("REST OF INDIA");
    const [showAddress, setShowAddress] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<ShippingMode>("All");

    const courierRates: CourierRate[] = [
        {
            courier: "BLUE DART",
            image: "/images/company2.png",
            mode: "air-0.50kg",
            cod: "₹35",
            shipping: 1129866,
            gst: 203382.18,
            total: 1333283.18
        },
        {
            courier: "BLUE DART",
            image: "/images/company2.png",
            mode: "express-0.50kg",
            cod: "₹35",
            shipping: 719005,
            gst: 129427.2,
            total: 848467.2
        },
        {
            courier: "BLUE DART",
            image: "/images/company3.png",
            mode: "express-1.00kg",
            cod: "₹35",
            shipping: 708768,
            gst: 127584.54,
            total: 836387.54
        },
        {
            courier: "DELHIVERY",
            image: "/images/company2.png",
            mode: "surface-0.50kg",
            cod: "₹35",
            shipping: 944981,
            gst: 170102.88,
            total: 1115118.88
        },
        {
            courier: "DELHIVERY",
            image: "/images/company2.png",
            mode: "surface-10.00kg",
            cod: "₹35",
            shipping: 338959,
            gst: 61018.92,
            total: 400012.92
        },
        {
            courier: "DTDC",
            image: "/images/company4.png",
            mode: "air-0.50kg",
            cod: "₹27",
            shipping: 1006607,
            gst: 181194.12,
            total: 1187828.12
        },
        {
            courier: "DTDC",
            image: "/images/company4.png",
            mode: "surface-0.50kg",
            cod: "₹27",
            shipping: 801177,
            gst: 144216.72,
            total: 945420.72
        },
        {
            courier: "ECOM EXPRESS",
            image: "/images/company1.png",
            mode: "surface-0.50kg",
            cod: "₹30",
            shipping: 821724,
            gst: 147915.72,
            total: 969669.72
        },
        {
            courier: "EKART",
            image: "/images/company7.png",
            mode: "surface-0.50kg",
            cod: "₹30",
            shipping: 801179,
            gst: 144217.62,
            total: 945426.62
        },
        {
            courier: "XPRESSBEES",
            image: "/images/company5.png",
            mode: "surface-0.50kg",
            cod: "₹30",
            shipping: 785000,
            gst: 141300.00,
            total: 926300.00
        },
        {
            courier: "XPRESSBEES",
            image: "/images/company5.png",
            mode: "surface-1.00kg",
            cod: "₹30",
            shipping: 835000,
            gst: 150300.00,
            total: 985300.00
        },
        {
            courier: "XPRESSBEES",
            image: "/images/company5.png",
            mode: "surface-2.00kg",
            cod: "₹30",
            shipping: 885000,
            gst: 159300.00,
            total: 1044300.00
        }
    ];

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortOrder("asc");
        }
    };

    const filteredRates = courierRates.filter(rate => {
        if (activeTab === "All") return true;
        if (activeTab === "Air") return rate.mode.includes("air");
        if (activeTab === "Surface") return rate.mode.includes("surface");
        if (activeTab === "Express") return rate.mode.includes("express");
        if (activeTab === "0.5Kg") return rate.mode.includes("0.50kg");
        if (activeTab === "1Kg") return rate.mode.includes("1.00kg");
        if (activeTab === "2Kg") return rate.mode.includes("2.00kg");
        if (activeTab === "Heavy") return rate.mode.includes("10.00kg");
        return true;
    });

    const sortedRates = [...filteredRates].sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];

        if (typeof aValue === "string" && typeof bValue === "string") {
            return sortOrder === "asc"
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        }

        return sortOrder === "asc"
            ? Number(aValue) - Number(bValue)
            : Number(bValue) - Number(aValue);
    });

    const handleShipSelected = () => {
        if (selectedCourier && selectedMode) {
            onShipSelected(selectedCourier, warehouse, selectedMode);
            onClose();
        }
    };

    const handleCourierSelect = (courierId: string, mode: string) => {
        setSelectedCourier(courierId);
        setSelectedMode(mode);
    };

    const SortableHeader = ({ field, label }: { field: SortField; label: string }) => (
        <th
            className="p-2 text-left font-medium cursor-pointer text-sm"
            onClick={() => handleSort(field)}
        >
            <div className="flex items-center gap-1">
                {label}
                <ChevronsUpDownIcon
                    className={`size-3 transition-colors ${sortField === field
                        ? "text-purple-600"
                        : "text-gray-400"
                        }`}
                />
            </div>
        </th>
    );

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent showCloseButton={false} className="max-w-5xl w-[95vw] h-[90vh] p-0 overflow-hidden flex flex-col">
                <DialogHeader className="flex flex-row items-center justify-between p-4 border-b shrink-0">
                    <DialogTitle className="text-lg">
                        Shipping Options
                    </DialogTitle>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="size-4" />
                    </Button>
                </DialogHeader>

                <div className="px-4 py-2 border-b shrink-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium flex items-center mb-1">
                                Warehouse <span className="text-red-500">*</span>
                            </label>
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
                            <label className="text-sm font-medium flex items-center mb-1">
                                RTO W/H <span className="text-red-500">*</span>
                            </label>
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
                        <label htmlFor="show-address" className="text-sm ml-2 cursor-pointer">
                            Show Address
                        </label>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border-b shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-md flex items-center justify-center">
                            <Package className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                            <div className="text-sm font-medium">
                                {orderNumber}
                            </div>
                            <div className="text-xs text-gray-500">
                                Order ID
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <div className="text-xs text-gray-500">
                            Weight
                        </div>
                        <div className="text-sm font-medium">
                            {weight || 0} kg
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <div className="text-xs text-gray-500">
                            Zone
                        </div>
                        <div className="text-sm font-medium">
                            {zone}
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <div className="text-xs text-gray-500">
                            Volumetric Wt
                        </div>
                        <div className="text-sm font-medium">
                            {weight || 0} kg
                        </div>
                    </div>
                </div>

                <div className="flex-1 min-h-0 relative">
                    <div className="absolute inset-0 flex">
                        <div className="w-[200px] bg-gray-50 border-r overflow-y-auto scrollbar-hide pl-4 shrink-0">
                            <button
                                className={cn(
                                    "w-full text-left p-3 transition-colors hover:bg-gray-100 rounded-l-md",
                                    activeTab === "All" ? "bg-purple-100 font-medium" : ""
                                )}
                                onClick={() => setActiveTab("All")}
                            >
                                All
                            </button>
                            <button
                                className={cn(
                                    "w-full text-left p-3 transition-colors hover:bg-gray-100",
                                    activeTab === "Air" ? "bg-purple-100 font-medium" : ""
                                )}
                                onClick={() => setActiveTab("Air")}
                            >
                                Air
                            </button>
                            <button
                                className={cn(
                                    "w-full text-left p-3 transition-colors hover:bg-gray-100",
                                    activeTab === "Surface" ? "bg-purple-100 font-medium" : ""
                                )}
                                onClick={() => setActiveTab("Surface")}
                            >
                                Surface
                            </button>
                            <button
                                className={cn(
                                    "w-full text-left p-3 transition-colors hover:bg-gray-100",
                                    activeTab === "Express" ? "bg-purple-100 font-medium" : ""
                                )}
                                onClick={() => setActiveTab("Express")}
                            >
                                Express
                            </button>
                            <button
                                className={cn(
                                    "w-full text-left p-3 transition-colors hover:bg-gray-100",
                                    activeTab === "0.5Kg" ? "bg-purple-100 font-medium" : ""
                                )}
                                onClick={() => setActiveTab("0.5Kg")}
                            >
                                0.5Kg
                            </button>
                            <button
                                className={cn(
                                    "w-full text-left p-3 transition-colors hover:bg-gray-100",
                                    activeTab === "1Kg" ? "bg-purple-100 font-medium" : ""
                                )}
                                onClick={() => setActiveTab("1Kg")}
                            >
                                1Kg
                            </button>
                            <button
                                className={cn(
                                    "w-full text-left p-3 transition-colors hover:bg-gray-100",
                                    activeTab === "2Kg" ? "bg-purple-100 font-medium" : ""
                                )}
                                onClick={() => setActiveTab("2Kg")}
                            >
                                2Kg
                            </button>
                            <button
                                className={cn(
                                    "w-full text-left p-3 transition-colors hover:bg-gray-100",
                                    activeTab === "Heavy" ? "bg-purple-100 font-medium" : ""
                                )}
                                onClick={() => setActiveTab("Heavy")}
                            >
                                Heavy
                            </button>
                        </div>

                        <div className="flex-1 overflow-auto scrollbar-hide">
                            {sortedRates.length > 0 ? (
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="p-2 text-left text-sm font-medium">
                                                Courier
                                            </th>
                                            <SortableHeader field="mode" label="Mode" />
                                            <SortableHeader field="shipping" label="Shipping" />
                                            <SortableHeader field="cod" label="COD" />
                                            <SortableHeader field="gst" label="GST(18%)" />
                                            <SortableHeader field="total" label="Total" />
                                            <th className="p-2 text-right text-sm font-medium w-[60px]">
                                                #
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {sortedRates.map((rate, index) => (
                                            <tr
                                                key={`${rate.courier}-${rate.mode}-${index}`}
                                                className={`hover:bg-gray-50 ${selectedCourier === rate.courier && selectedMode === rate.mode ? 'bg-purple-50' : ''}`}
                                                onClick={() => handleCourierSelect(rate.courier, rate.mode)}
                                            >
                                                <td className="p-2 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <img
                                                            src={rate.image}
                                                            alt={rate.courier}
                                                            className="h-auto w-14 object-cover"
                                                        />
                                                        <span className="text-sm">{rate.courier}</span>
                                                    </div>
                                                </td>
                                                <td className="p-2 whitespace-nowrap text-sm">
                                                    {rate.mode}
                                                </td>
                                                <td className="p-2 whitespace-nowrap text-sm">
                                                    ₹{rate.shipping.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                                                </td>
                                                <td className="p-2 whitespace-nowrap text-sm">
                                                    {rate.cod}
                                                </td>
                                                <td className="p-2 whitespace-nowrap text-sm">
                                                    ₹{rate.gst.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                                                </td>
                                                <td className="p-2 whitespace-nowrap text-sm">
                                                    ₹{rate.total.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                                                </td>
                                                <td className="p-2 whitespace-nowrap text-sm text-right">
                                                    <input
                                                        type="radio"
                                                        name="courier"
                                                        checked={selectedCourier === rate.courier && selectedMode === rate.mode}
                                                        onChange={() => handleCourierSelect(rate.courier, rate.mode)}
                                                        className="rounded-full"
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-500">
                                    No data available in table
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 p-4 border-t bg-white shrink-0">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="bg-red-500 hover:bg-red-600 text-white hover:text-white min-w-[80px]"
                        size="sm"
                    >
                        Close
                    </Button>
                    <Button
                        variant="default"
                        className="bg-purple-600 hover:bg-purple-700 text-white min-w-[120px]"
                        onClick={handleShipSelected}
                        disabled={!selectedCourier || !selectedMode}
                        size="sm"
                    >
                        Ship Selected
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AdminShippingOptionsModal; 