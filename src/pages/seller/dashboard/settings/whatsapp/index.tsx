import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const NOTIFICATION_TYPES = [
    {
        id: "order-confirmation",
        title: "Order Confirmation",
        description: "Send a confirmation message when an order is placed",
        enabled: true,
    },
    {
        id: "order-packed",
        title: "Order Packed",
        description: "Notify when the order is packed and ready for pickup",
        enabled: true,
    },
    {
        id: "out-for-delivery",
        title: "Out for Delivery",
        description: "Send notification when the order is out for delivery",
        enabled: true,
    },
    {
        id: "delivery-confirmation",
        title: "Delivery Confirmation",
        description: "Confirm when the order is delivered successfully",
        enabled: true,
    },
    {
        id: "delivery-failed",
        title: "Delivery Failed",
        description: "Notify when delivery attempt fails",
        enabled: true,
    },
    {
        id: "return-initiated",
        title: "Return Initiated",
        description: "Send notification when a return is initiated",
        enabled: true,
    },
    {
        id: "return-picked",
        title: "Return Picked",
        description: "Confirm when the return is picked up",
        enabled: true,
    },
    {
        id: "return-delivered",
        title: "Return Delivered",
        description: "Notify when the return is delivered back to you",
        enabled: true,
    },
];

const WhatsAppSettingsPage = () => {
    const handleSave = () => {
        toast.success("WhatsApp settings saved successfully");
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-xl lg:text-2xl font-semibold">
                    WhatsApp Settings
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    Configure WhatsApp notifications for order updates
                </p>
            </div>

            <div className="grid gap-6">
                {/* WhatsApp Integration */}
                <Card>
                    <CardHeader>
                        <CardTitle>WhatsApp Integration</CardTitle>
                        <CardDescription>
                            Set up your WhatsApp Business API integration
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>WhatsApp Business Number</Label>
                                <Input 
                                    placeholder="Enter your WhatsApp business number"
                                    type="tel"
                                />
                                <p className="text-sm text-gray-500">
                                    Include country code (e.g., +91 9876543210)
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label>API Key</Label>
                                <Input 
                                    type="password"
                                    placeholder="Enter your WhatsApp Business API key"
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch id="enable-whatsapp" />
                                <Label htmlFor="enable-whatsapp">
                                    Enable WhatsApp notifications
                                </Label>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Notification Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle>Notification Settings</CardTitle>
                        <CardDescription>
                            Choose which notifications to send via WhatsApp
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            {NOTIFICATION_TYPES.map((notification) => (
                                <div key={notification.id} className="flex items-start space-x-4">
                                    <div className="pt-1">
                                        <Switch 
                                            id={notification.id}
                                            checked={notification.enabled}
                                            onCheckedChange={() => {
                                                toast.info(`${notification.title} notification ${notification.enabled ? 'disabled' : 'enabled'}`);
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor={notification.id} className="text-base">
                                            {notification.title}
                                        </Label>
                                        <p className="text-sm text-gray-500">
                                            {notification.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Message Templates */}
                <Card>
                    <CardHeader>
                        <CardTitle>Message Templates</CardTitle>
                        <CardDescription>
                            Customize your WhatsApp message templates
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Order Confirmation Template</Label>
                                <Input 
                                    placeholder="Enter your order confirmation message template"
                                    className="h-20"
                                />
                                <p className="text-sm text-gray-500">
                                    Available variables: {"{order_number}"}, {"{customer_name}"}, {"{order_date}"}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label>Delivery Confirmation Template</Label>
                                <Input 
                                    placeholder="Enter your delivery confirmation message template"
                                    className="h-20"
                                />
                                <p className="text-sm text-gray-500">
                                    Available variables: {"{order_number}"}, {"{customer_name}"}, {"{delivery_date}"}
                                </p>
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

export default WhatsAppSettingsPage; 