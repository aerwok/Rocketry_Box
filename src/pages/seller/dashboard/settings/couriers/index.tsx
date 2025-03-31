import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

const COURIERS = [
    { id: 1, name: "Delhivery", code: "DEL", status: true, priority: 1 },
    { id: 2, name: "Blue Dart", code: "BLD", status: true, priority: 2 },
    { id: 3, name: "FedEx", code: "FED", status: true, priority: 3 },
    { id: 4, name: "DTDC", code: "DTD", status: false, priority: 4 },
    { id: 5, name: "XpressBees", code: "XBE", status: true, priority: 5 },
    { id: 6, name: "Ekart", code: "EKT", status: false, priority: 6 },
    { id: 7, name: "Shadowfax", code: "SFX", status: true, priority: 7 },
    { id: 8, name: "Gati", code: "GAT", status: false, priority: 8 },
];

const SHIPPING_MODES = [
    { value: "standard", label: "Standard Delivery" },
    { value: "express", label: "Express Delivery" },
    { value: "cod", label: "Cash on Delivery" },
];

const CouriersSettingsPage = () => {
    const handleSave = () => {
        toast.success("Courier settings saved successfully");
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-xl lg:text-2xl font-semibold">
                    Couriers Settings
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    Manage your courier partners and shipping preferences
                </p>
            </div>

            <div className="grid gap-6">
                {/* Courier Partners */}
                <Card>
                    <CardHeader>
                        <CardTitle>Courier Partners</CardTitle>
                        <CardDescription>
                            Enable or disable courier partners and set their priority
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Courier Name</TableHead>
                                    <TableHead>Code</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Priority</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {COURIERS.map((courier) => (
                                    <TableRow key={courier.id}>
                                        <TableCell>{courier.name}</TableCell>
                                        <TableCell>{courier.code}</TableCell>
                                        <TableCell>
                                            <Switch 
                                                checked={courier.status}
                                                onCheckedChange={() => {
                                                    toast.info("Status updated");
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input 
                                                type="number" 
                                                value={courier.priority}
                                                className="w-20"
                                                onChange={() => {
                                                    toast.info("Priority updated");
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="outline" size="sm">
                                                Configure
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Shipping Preferences */}
                <Card>
                    <CardHeader>
                        <CardTitle>Shipping Preferences</CardTitle>
                        <CardDescription>
                            Configure your default shipping preferences
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Default Shipping Mode</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select shipping mode" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {SHIPPING_MODES.map((mode) => (
                                            <SelectItem key={mode.value} value={mode.value}>
                                                {mode.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch id="auto-select" />
                                <Label htmlFor="auto-select">
                                    Automatically select best courier based on rate and delivery time
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch id="cod-available" />
                                <Label htmlFor="cod-available">
                                    Enable Cash on Delivery for all orders
                                </Label>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Save Button */}
                <div className="flex justify-end">
                    <Button onClick={handleSave}>
                        Save Changes
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CouriersSettingsPage; 