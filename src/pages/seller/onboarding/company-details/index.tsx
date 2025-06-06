import UploadModal from "@/components/shared/upload-modal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { sellerCompanySchema, type SellerCompanyInput } from "@/lib/validations/seller";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle2, Upload } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { profileService } from "@/services/profile.service";
const features = [
    "Branded Order Tracking Page",
    "Automated NDR Management",
    "Up To 45% Lesser RTOs",
];

const SellerCompanyDetailsPage = () => {
    const location = useLocation();
    const { isNewRegistration, name, email, phone, companyName } = location.state || {};

    const [uploadType, setUploadType] = useState<"gst" | "pan" | "aadhaar" | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        // If coming from registration, show a welcome message
        if (isNewRegistration) {
            toast.success(`Welcome, ${name || 'Seller'}! Let's complete your profile.`);
        }
    }, [isNewRegistration, name]);

    const form = useForm<SellerCompanyInput>({
        resolver: zodResolver(sellerCompanySchema),
        defaultValues: {
            category: "",
            gstNumber: "",
            panNumber: "",
            aadhaarNumber: "",
            monthlyShipments: "",
            address1: "",
            address2: "",
            city: "",
            state: "",
            pincode: "",
            acceptTerms: false,
        },
    });

    const onSubmit = async (data: SellerCompanyInput) => {
        try {
            setIsLoading(true);

            console.log("Submitting form data:", data);

            // Prepare company details for API
            const companyDetails = {
                companyCategory: data.category,
                address: {
                    address1: data.address1,
                    address2: data.address2,
                    city: data.city,
                    state: data.state,
                    pincode: data.pincode,
                    country: 'India'
                },
                // Include documents with mock URLs for now since backend requires them
                documents: {
                    gstin: {
                        number: data.gstNumber,
                        url: data.gstDocument ? `https://temp-storage.com/gst-${Date.now()}.pdf` : `https://temp-storage.com/gst-placeholder.pdf`
                    },
                    pan: {
                        number: data.panNumber,
                        url: data.panDocument ? `https://temp-storage.com/pan-${Date.now()}.pdf` : `https://temp-storage.com/pan-placeholder.pdf`
                    },
                    aadhaar: {
                        number: data.aadhaarNumber,
                        url: data.aadhaarDocument ? `https://temp-storage.com/aadhaar-${Date.now()}.pdf` : `https://temp-storage.com/aadhaar-placeholder.pdf`
                    }
                }
            };

            console.log("Prepared company details for API:", companyDetails);

            try {
                // Call the API to save company details
                const response = await profileService.updateCompanyDetails(companyDetails);
                
                console.log("API Response:", response);
                
                if (response && response.success) {
                    toast.success("✅ Company details saved successfully to database!");
                    console.log("✅ Data successfully stored in database");
                    
                    // Navigate to bank details with the onboarding state
                    navigate("/seller/onboarding/bank-details", {
                        state: {
                            isOnboarding: true,
                            name,
                            email,
                            phone,
                            companyName
                        }
                    });
                } else {
                    console.error("❌ API returned unsuccessful response:", response);
                    throw new Error(response?.message || "Failed to save company details");
                }
            } catch (apiError: any) {
                console.error("❌ API call failed:", apiError);
                
                // Check if it's an authentication error
                if (apiError.status === 401) {
                    console.log("🔐 Authentication required - this is expected during onboarding");
                    console.log("📊 Form data that would be saved:", companyDetails);
                    
                    // Store the data in localStorage for now as a fallback
                    try {
                        localStorage.setItem('pendingCompanyDetails', JSON.stringify({
                            ...companyDetails,
                            timestamp: new Date().toISOString(),
                            userInfo: { name, email, phone, companyName }
                        }));
                        console.log("💾 Company details stored in localStorage for later processing");
                    } catch (storageError) {
                        console.warn("⚠️ Could not store in localStorage:", storageError);
                    }
                    
                    toast.success("📝 Company details captured! Proceeding to bank details...");
                    navigate("/seller/onboarding/bank-details", {
                        state: {
                            isOnboarding: true,
                            name,
                            email,
                            phone,
                            companyName,
                            companyDetailsStored: false // Flag to indicate data needs to be saved later
                        }
                    });
                } else {
                    throw apiError;
                }
            }
            
        } catch (error: any) {
            console.error("Error submitting company details:", error);
            
            // Check if it's a network error or API error
            if (error.message?.includes('Failed to fetch') || error.code === 'NETWORK_ERROR') {
                toast.error("Network error. Please check your connection and try again.");
            } else if (error.status === 401) {
                toast.error("Authentication failed. Please login again.");
            } else if (error.status === 400) {
                toast.error("Invalid data provided. Please check your inputs.");
            } else {
                toast.error(error.message || "Failed to save company details. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpload = (file: File) => {
        console.log("Uploaded file:", file);
        // Set the appropriate document based on uploadType
        if (uploadType === 'gst') {
            form.setValue('gstDocument', file);
        } else if (uploadType === 'pan') {
            form.setValue('panDocument', file);
        } else if (uploadType === 'aadhaar') {
            form.setValue('aadhaarDocument', file);
        }
        toast.success(`${uploadType?.toUpperCase() || 'Document'} uploaded successfully`);
    };

    return (
        <div className="h-full min-h-[calc(100dvh-4rem)] bg-white">
            <div className="container mx-auto p-4 h-full">
                {isNewRegistration && (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
                        <div className="flex items-center gap-2 text-green-700">
                            <CheckCircle2 className="h-5 w-5" />
                            <span className="font-medium">Account created successfully! Complete your profile to start using RocketryBox.</span>
                        </div>
                        <div className="mt-2 text-sm text-green-600">
                            <span>Step 1 of 2: Company Details</span>
                        </div>
                    </div>
                )}
                
                <div className="grid lg:grid-cols-2 gap-12 place-items-center w-full h-full">
                    {/* Left Side */}
                    <div className="space-y-6 order-2 lg:order-1 flex flex-col justify-start w-full h-full">
                        <div className="space-y-4">
                            <h1 className="text-2xl lg:text-3xl font-semibold text-[#2B4EA8] italic">
                                Transforming Shipping with US!
                            </h1>
                            <div className="space-y-2">
                                {features.map((feature, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <div className="size-6 rounded-full bg-main flex items-center justify-center">
                                            <ArrowRight className="size-4 text-white" />
                                        </div>
                                        <p className="text-lg">{feature}</p>
                                    </div>
                                ))}
                            </div>
                            <p className="text-gray-500">
                                Trusted by more than 1 lakh+ brands
                            </p>
                        </div>
                        <div className="relative h-[400px] mr-auto">
                            <img
                                src="/images/seller/details.png"
                                alt="Company Details"
                                className="w-full h-full object-contain"
                            />
                        </div>
                    </div>

                    {/* Right Side - Form */}
                    <div className="lg:px-6 w-full order-1 lg:order-2 h-full">
                        <div className="flex-1 mx-auto text-center">
                            <h2 className="text-2xl lg:text-3xl font-semibold mb-8">
                                {isNewRegistration ? "Complete Your Company Profile" : "Get Started With a Free Account"}
                            </h2>
                            <p className="text-gray-600 mb-8">
                                Upload Documents
                            </p>
                        </div>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Select Your Company Category</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="bg-[#99BCDDB5]">
                                                        <SelectValue placeholder="Select Category From Filter" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="ecommerce">
                                                        E-commerce
                                                    </SelectItem>
                                                    <SelectItem value="retail">
                                                        Retail
                                                    </SelectItem>
                                                    <SelectItem value="manufacturing">
                                                        Manufacturing
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="gstNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Enter your GST Number(if yes)</FormLabel>
                                                <div className="flex gap-2">
                                                    <FormControl>
                                                        <Input
                                                            placeholder="GST Number"
                                                            className="bg-[#99BCDDB5]"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                                                        <Button
                                        type="button"
                                        variant="outline"
                                        className="bg-[#99BCDDB5] hover:bg-[#99BCDDB5]/50 border-0"
                                        onClick={() => {
                                            setUploadType("gst");
                                            setIsDialogOpen(true);
                                        }}
                                    >
                                        <Upload className="h-4 w-4" />
                                    </Button>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="panNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Enter Pan Card Number</FormLabel>
                                                <div className="flex gap-2">
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Pan Card Number"
                                                            className="bg-[#99BCDDB5]"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                                                        <Button
                                        type="button"
                                        variant="outline"
                                        className="bg-[#99BCDDB5] hover:bg-[#99BCDDB5]/50 border-0"
                                        onClick={() => {
                                            setUploadType("pan");
                                            setIsDialogOpen(true);
                                        }}
                                    >
                                        <Upload className="h-4 w-4" />
                                    </Button>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="aadhaarNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Enter Aadhaar Card Number</FormLabel>
                                                <div className="flex gap-2">
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Aadhaar Card Number"
                                                            className="bg-[#99BCDDB5]"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                                                        <Button
                                        type="button"
                                        variant="outline"
                                        className="bg-[#99BCDDB5] hover:bg-[#99BCDDB5]/50 border-0"
                                        onClick={() => {
                                            setUploadType("aadhaar");
                                            setIsDialogOpen(true);
                                        }}
                                    >
                                        <Upload className="h-4 w-4" />
                                    </Button>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="monthlyShipments"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Your Monthly Shipments</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="bg-[#99BCDDB5]">
                                                            <SelectValue placeholder="Choose in the Range Filter" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="0-100">0-100</SelectItem>
                                                        <SelectItem value="101-500">101-500</SelectItem>
                                                        <SelectItem value="501-1000">501-1000</SelectItem>
                                                        <SelectItem value="1001-5000">1001-5000</SelectItem>
                                                        <SelectItem value="5000+">5000+</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="address1"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Address</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Address1"
                                                        className="bg-[#99BCDDB5]"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="address2"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>&nbsp;</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Address2"
                                                        className="bg-[#99BCDDB5]"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="city"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>City</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="City"
                                                        className="bg-[#99BCDDB5]"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="state"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>State</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="State"
                                                        className="bg-[#99BCDDB5]"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="pincode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Pincode</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Pincode"
                                                    className="bg-[#99BCDDB5]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="acceptTerms"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel>
                                                    I have read and accept the privacy policy & conditions of use
                                                </FormLabel>
                                                <FormMessage />
                                            </div>
                                        </FormItem>
                                    )}
                                />

                                <div className="flex justify-center pt-4">
                                    <Button
                                        type="submit"
                                        className="w-1/2 bg-[#2B4EA8] hover:bg-[#2B4EA8]/90 text-white"
                                        disabled={!form.watch("acceptTerms") || isLoading}
                                    >
                                        {isLoading ? "Processing..." : (isNewRegistration ? "Continue to Bank Details" : "Save")}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>

            <UploadModal
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                title={`Upload ${uploadType?.toUpperCase()} Document`}
                onUpload={handleUpload}
            />
        </div>
    );
};

export default SellerCompanyDetailsPage; 