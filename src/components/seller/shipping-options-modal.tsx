import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export interface ShippingOptionsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (options: {
        warehouse: string;
        rtoWarehouse: string;
        shippingMode: string;
        courier: string;
    }) => void;
    orderCount?: number;
    singleOrderId?: string | null;
}

export function ShippingOptionsModal({
    open,
    onOpenChange,
    onSubmit
}: ShippingOptionsModalProps) {
    const [selectedWarehouse, setSelectedWarehouse] = useState<string>("");
    const [selectedRTOWarehouse, setSelectedRTOWarehouse] = useState<string>("");
    const [selectedShippingMode, setSelectedShippingMode] = useState<string>("");
    const [selectedCourier, setSelectedCourier] = useState<string>("");

    const handleSubmit = () => {
        if (!selectedWarehouse || !selectedRTOWarehouse || !selectedShippingMode || !selectedCourier) {
            // Show error or handle validation
            return;
        }

        onSubmit({
            warehouse: selectedWarehouse,
            rtoWarehouse: selectedRTOWarehouse,
            shippingMode: selectedShippingMode,
            courier: selectedCourier,
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Shipping Options</DialogTitle>
                    <DialogDescription>
                        Select your preferred shipping options. These settings will be applied to your order.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Select
                            value={selectedWarehouse}
                            onValueChange={setSelectedWarehouse}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select warehouse" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="warehouse1">Warehouse 1</SelectItem>
                                <SelectItem value="warehouse2">Warehouse 2</SelectItem>
                                {/* Add more warehouses as needed */}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Select
                            value={selectedRTOWarehouse}
                            onValueChange={setSelectedRTOWarehouse}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select RTO warehouse" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="rto1">RTO Warehouse 1</SelectItem>
                                <SelectItem value="rto2">RTO Warehouse 2</SelectItem>
                                {/* Add more RTO warehouses as needed */}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Select
                            value={selectedShippingMode}
                            onValueChange={setSelectedShippingMode}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select shipping mode" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="surface">Surface</SelectItem>
                                <SelectItem value="air">Air</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Select
                            value={selectedCourier}
                            onValueChange={setSelectedCourier}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select courier" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="delhivery">Delhivery</SelectItem>
                                <SelectItem value="ekart">Ekart</SelectItem>
                                {/* Add more couriers as needed */}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit}>Save & Ship</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
} 