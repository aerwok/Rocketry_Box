import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const API_ENDPOINTS = [
    {
        name: "Create Order",
        endpoint: "/api/v1/orders",
        method: "POST",
        description: "Create a new shipping order",
    },
    {
        name: "Get Order Status",
        endpoint: "/api/v1/orders/{order_id}",
        method: "GET",
        description: "Get the current status of an order",
    },
    {
        name: "Track Shipment",
        endpoint: "/api/v1/shipments/{shipment_id}/track",
        method: "GET",
        description: "Track a shipment's location and status",
    },
    {
        name: "Generate Label",
        endpoint: "/api/v1/shipments/{shipment_id}/label",
        method: "GET",
        description: "Generate shipping label for a shipment",
    },
    {
        name: "Cancel Order",
        endpoint: "/api/v1/orders/{order_id}/cancel",
        method: "POST",
        description: "Cancel an existing order",
    },
];

const ApiSettingsPage = () => {
    const handleSave = () => {
        toast.success("API settings saved successfully");
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-xl lg:text-2xl font-semibold">
                    API Settings
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    Configure your API integration settings
                </p>
            </div>

            <div className="grid gap-6">
                {/* API Configuration */}
                <Card>
                    <CardHeader>
                        <CardTitle>API Configuration</CardTitle>
                        <CardDescription>
                            Set up your API credentials and preferences
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>API Key</Label>
                                <Input 
                                    type="password"
                                    placeholder="Enter your API key"
                                />
                                <p className="text-sm text-gray-500">
                                    Keep your API key secure and never share it publicly
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label>API Secret</Label>
                                <Input 
                                    type="password"
                                    placeholder="Enter your API secret"
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch id="enable-api" />
                                <Label htmlFor="enable-api">
                                    Enable API access
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch id="webhook" />
                                <Label htmlFor="webhook">
                                    Enable webhook notifications
                                </Label>
                            </div>
                            <div className="space-y-2">
                                <Label>Webhook URL</Label>
                                <Input 
                                    placeholder="Enter your webhook URL"
                                    disabled
                                />
                                <p className="text-sm text-gray-500">
                                    Configure your webhook URL to receive real-time updates
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* API Documentation */}
                <Card>
                    <CardHeader>
                        <CardTitle>API Documentation</CardTitle>
                        <CardDescription>
                            Available API endpoints and their usage
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {API_ENDPOINTS.map((endpoint) => (
                                <div key={endpoint.name} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-medium">{endpoint.name}</h3>
                                        <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                                            {endpoint.method}
                                        </span>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-md">
                                        <code className="text-sm">{endpoint.endpoint}</code>
                                    </div>
                                    <p className="text-sm text-gray-500">
                                        {endpoint.description}
                                    </p>
                                </div>
                            ))}
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

export default ApiSettingsPage; 