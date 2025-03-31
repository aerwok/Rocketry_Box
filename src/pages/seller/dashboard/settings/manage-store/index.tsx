import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const STORE_TYPES = [
    { value: "amazon", label: "Amazon" },
    { value: "shopify", label: "Shopify" },
    { value: "flipkart", label: "Flipkart" },
    { value: "meesho", label: "Meesho" },
    { value: "myntra", label: "Myntra" },
    { value: "ajio", label: "AJIO" },
    { value: "nykaa", label: "Nykaa" },
    { value: "custom", label: "Custom Store" },
];

const ManageStorePage = () => {
    const handleSave = () => {
        toast.success("Store settings saved successfully");
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-xl lg:text-2xl font-semibold">
                    Manage Store
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    Configure your store settings and integrate with ecommerce platforms
                </p>
            </div>

            <div className="grid gap-6">
                {/* Store Integration */}
                <Card>
                    <CardHeader>
                        <CardTitle>Store Integration</CardTitle>
                        <CardDescription>
                            Connect your ecommerce store to automatically fetch orders
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <Label>Store Type</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select store type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {STORE_TYPES.map((type) => (
                                                <SelectItem key={type.value} value={type.value}>
                                                    {type.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Store URL</Label>
                                    <Input placeholder="Enter your store URL" />
                                </div>
                                <div className="space-y-2">
                                    <Label>API Key</Label>
                                    <Input type="password" placeholder="Enter your API key" />
                                </div>
                                <div className="space-y-2">
                                    <Label>API Secret</Label>
                                    <Input type="password" placeholder="Enter your API secret" />
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch id="auto-fetch" />
                                <Label htmlFor="auto-fetch">
                                    Automatically fetch orders
                                </Label>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Order Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle>Order Settings</CardTitle>
                        <CardDescription>
                            Configure how orders are processed and managed
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <Switch id="auto-create" />
                                <Label htmlFor="auto-create">
                                    Automatically create shipping orders
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch id="auto-notify" />
                                <Label htmlFor="auto-notify">
                                    Send automatic notifications to customers
                                </Label>
                            </div>
                            <div className="space-y-2">
                                <Label>Default Shipping Mode</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select shipping mode" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="standard">Standard Delivery</SelectItem>
                                        <SelectItem value="express">Express Delivery</SelectItem>
                                        <SelectItem value="cod">Cash on Delivery</SelectItem>
                                    </SelectContent>
                                </Select>
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

export default ManageStorePage; 