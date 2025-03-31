import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const LABEL_SIZES = [
    { value: "4x6", label: "4 x 6 inches" },
    { value: "6x4", label: "6 x 4 inches" },
    { value: "8x4", label: "8 x 4 inches" },
    { value: "10x4", label: "10 x 4 inches" },
];

const LABEL_FORMATS = [
    { value: "pdf", label: "PDF" },
    { value: "png", label: "PNG" },
    { value: "jpg", label: "JPG" },
];

const LabelSettingsPage = () => {
    const handleSave = () => {
        toast.success("Label settings saved successfully");
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-xl lg:text-2xl font-semibold">
                    Label Settings
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    Customize your shipping labels and branding
                </p>
            </div>

            <div className="grid gap-6">
                {/* Label Design */}
                <Card>
                    <CardHeader>
                        <CardTitle>Label Design</CardTitle>
                        <CardDescription>
                            Configure your shipping label appearance and format
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Label Size</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select label size" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {LABEL_SIZES.map((size) => (
                                            <SelectItem key={size.value} value={size.value}>
                                                {size.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Label Format</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select label format" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {LABEL_FORMATS.map((format) => (
                                            <SelectItem key={format.value} value={format.value}>
                                                {format.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Company Logo</Label>
                                <div className="flex items-center gap-4">
                                    <div className="w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center">
                                        <span className="text-sm text-gray-500">Upload logo</span>
                                    </div>
                                    <Button variant="outline">Upload</Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Label Content */}
                <Card>
                    <CardHeader>
                        <CardTitle>Label Content</CardTitle>
                        <CardDescription>
                            Customize the information displayed on your shipping labels
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <Switch id="show-logo" />
                                <Label htmlFor="show-logo">
                                    Show company logo on label
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch id="show-barcode" />
                                <Label htmlFor="show-barcode">
                                    Show tracking barcode
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch id="show-return" />
                                <Label htmlFor="show-return">
                                    Include return address
                                </Label>
                            </div>
                            <div className="space-y-2">
                                <Label>Additional Information</Label>
                                <Input 
                                    placeholder="Enter additional text to display on label"
                                    className="h-20"
                                />
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

export default LabelSettingsPage; 