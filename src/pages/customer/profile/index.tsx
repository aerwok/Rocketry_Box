import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, MailIcon, PhoneIcon, Plus, User2Icon, UserIcon, Loader2, AlertCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formSchema, type ProfileFormValues } from "@/lib/validations/profile";
import AddressModal from "@/components/customer/address-modal";
import { toast } from "sonner";

interface Address {
    id: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
}

// API functions for future implementation
// --------------------------------------
// async function fetchProfileData(): Promise<{
//   fullName: string;
//   email: string;
//   phone: string;
//   profileImage?: string;
//   addresses: Address[];
// }> {
//   try {
//     const response = await fetch('/api/customer/profile');
//     if (!response.ok) throw new Error('Failed to fetch profile data');
//     
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error('Error fetching profile data:', error);
//     throw error;
//   }
// }
//
// async function updateProfileData(profileData: ProfileFormValues): Promise<void> {
//   try {
//     const response = await fetch('/api/customer/profile', {
//       method: 'PATCH',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(profileData)
//     });
//     
//     if (!response.ok) throw new Error('Failed to update profile');
//   } catch (error) {
//     console.error('Error updating profile:', error);
//     throw error;
//   }
// }
//
// async function uploadProfileImage(file: File): Promise<string> {
//   try {
//     const formData = new FormData();
//     formData.append('profileImage', file);
//     
//     const response = await fetch('/api/customer/profile/image', {
//       method: 'POST',
//       body: formData
//     });
//     
//     if (!response.ok) throw new Error('Failed to upload profile image');
//     
//     const data = await response.json();
//     return data.imageUrl;
//   } catch (error) {
//     console.error('Error uploading profile image:', error);
//     throw error;
//   }
// }
//
// async function addAddress(address: Omit<Address, "id">): Promise<Address> {
//   try {
//     const response = await fetch('/api/customer/addresses', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(address)
//     });
//     
//     if (!response.ok) throw new Error('Failed to add address');
//     
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error('Error adding address:', error);
//     throw error;
//   }
// }
//
// async function deleteAddress(addressId: string): Promise<void> {
//   try {
//     const response = await fetch(`/api/customer/addresses/${addressId}`, {
//       method: 'DELETE'
//     });
//     
//     if (!response.ok) throw new Error('Failed to delete address');
//   } catch (error) {
//     console.error('Error deleting address:', error);
//     throw error;
//   }
// }
// --------------------------------------

// Dummy addresses for development
const DUMMY_ADDRESSES: Address[] = [
    {
        id: "1",
        address1: "Darjeling",
        city: "Siliguri",
        state: "WestBengal",
        pincode: "736049",
        phone: "1234567890"
    },
    {
        id: "2",
        address1: "Salbari Bajar",
        address2: "Near Twelve Saloon",
        city: "Siliguri",
        state: "WestBengal",
        pincode: "736049",
        phone: "9876543210"
    }
];

const CustomerProfilePage = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [deletingAddressId, setDeletingAddressId] = useState<string | null>(null);

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: "",
            email: "",
            phone: "",
        },
    });

    // Fetch profile data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // When API is ready, this would be:
                // const data = await fetchProfileData();
                // form.reset({
                //   fullName: data.fullName,
                //   email: data.email,
                //   phone: data.phone,
                // });
                // setProfileImage(data.profileImage || null);
                // setAddresses(data.addresses);
                
                // Simulate API call delay
                await new Promise(resolve => setTimeout(resolve, 800));
                
                // Use dummy data for development
                form.reset({
                    fullName: "John Doe",
                    email: "john.doe@example.com",
                    phone: "1234567890",
                });
                setAddresses(DUMMY_ADDRESSES);
            } catch (err) {
                console.error("Error fetching profile:", err);
                setError("Failed to load profile. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, [form]);

    const onSubmit = async (data: ProfileFormValues) => {
        try {
            setSaving(true);
            setError(null);
            
            // When API is ready, this would be:
            // await updateProfileData(data);
            
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            console.log("Profile data submitted:", data);
            toast.success("Profile updated successfully");
        } catch (err) {
            console.error("Error updating profile:", err);
            setError("Failed to update profile. Please try again.");
            toast.error("Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        
        try {
            setUploadingImage(true);
            setError(null);
            
            // When API is ready, this would be:
            // const imageUrl = await uploadProfileImage(file);
            // setProfileImage(imageUrl);
            
            // For development, just show the selected image
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result as string);
            };
            reader.readAsDataURL(file);
            
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            toast.success("Profile picture updated successfully");
        } catch (err) {
            console.error("Error uploading image:", err);
            toast.error("Failed to upload profile picture");
        } finally {
            setUploadingImage(false);
        }
    };

    const handleAddAddress = async (data: Omit<Address, "id">) => {
        try {
            setError(null);
            
            // When API is ready, this would be:
            // const newAddress = await addAddress(data);
            // setAddresses(prev => [...prev, newAddress]);
            
            // For development, generate a random ID
            const newAddress: Address = {
                ...data,
                id: (addresses.length + 1).toString(),
            };
            
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 500));
            
            setAddresses([...addresses, newAddress]);
            setIsAddressModalOpen(false);
            toast.success("Address added successfully");
        } catch (err) {
            console.error("Error adding address:", err);
            toast.error("Failed to add address");
        }
    };

    const handleDeleteAddress = async (id: string) => {
        try {
            setDeletingAddressId(id);
            setError(null);
            
            // When API is ready, this would be:
            // await deleteAddress(id);
            
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 500));
            
            setAddresses(addresses.filter(address => address.id !== id));
            toast.success("Address deleted successfully");
        } catch (err) {
            console.error("Error deleting address:", err);
            toast.error("Failed to delete address");
        } finally {
            setDeletingAddressId(null);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.5,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="flex flex-col items-center">
                    <Loader2 className="h-12 w-12 animate-spin text-[#412A5F] mb-4" />
                    <p className="text-lg text-muted-foreground">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="container mx-auto px-4 py-8"
        >
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700 flex items-center justify-between"
                >
                    <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" />
                        <span>{error}</span>
                    </div>
                    <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setError(null)}
                        className="border-red-300 hover:bg-red-100"
                    >
                        Dismiss
                    </Button>
                </motion.div>
            )}
            
            <div className="grid lg:grid-cols-2 gap-8 items-center">
                {/* Left Side - Image */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="relative h-96 lg:h-[500px]"
                >
                    <motion.img
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                        src="/images/customer/profile.png"
                        alt="Profile"
                        className="w-full h-full object-contain"
                    />
                </motion.div>

                {/* Right Side - Profile Form */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="bg-[#99BCDD] rounded-lg lg:rounded-2xl p-4 lg:p-8"
                >
                    <motion.div
                        variants={itemVariants}
                        className="text-center space-y-2 text-[#412A5F]"
                    >
                        <h2 className="text-2xl font-semibold">
                            Profile
                        </h2>
                        <p className="font-normal">
                            Your profile information
                        </p>
                    </motion.div>

                    {/* Profile Image Upload */}
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col items-center justify-center pt-6"
                    >
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative size-20 lg:size-28 rounded-full bg-neutral-200 cursor-pointer overflow-visible"
                            onClick={handleImageClick}
                        >
                            <AnimatePresence mode="wait">
                                {uploadingImage ? (
                                    <motion.div
                                        key="loading"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex items-center justify-center h-full"
                                    >
                                        <Loader2 className="h-8 w-8 animate-spin text-[#412A5F]" />
                                    </motion.div>
                                ) : profileImage ? (
                                    <motion.img
                                        key="profile-image"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        src={profileImage}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <motion.div
                                        key="default-image"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex flex-col items-center justify-center h-full relative"
                                    >
                                        <UserIcon strokeWidth={1.3} className="size-12 lg:size-20 text-[#412A5F]" />
                                        <motion.span
                                            whileHover={{ scale: 1.1 }}
                                            className="absolute right-0 bottom-0 size-8 flex items-center justify-center bg-[#412A5F] rounded-full"
                                        >
                                            <Camera className="size-5 text-[#412A5F] fill-white" />
                                        </motion.span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                        <motion.span
                            variants={itemVariants}
                            className="text-sm text-center text-blue-500 mt-2"
                        >
                            Click the camera icon to update your photo
                        </motion.span>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageChange}
                            disabled={uploadingImage}
                        />
                    </motion.div>

                    {/* Profile Form */}
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
                            <motion.div variants={itemVariants} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="fullName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[#412A5F]">
                                                Full Name
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        {...field}
                                                        placeholder="Enter your full name"
                                                        className="pl-10 bg-white/80"
                                                    />
                                                    <User2Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#412A5F] size-5" />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[#412A5F]">
                                                Email
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        {...field}
                                                        placeholder="Enter your email"
                                                        className="pl-10 bg-white/80"
                                                    />
                                                    <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#412A5F] size-5" />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[#412A5F]">
                                                Phone
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        {...field}
                                                        placeholder="Enter your phone number"
                                                        className="pl-10 bg-white/80"
                                                    />
                                                    <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#412A5F] size-5" />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </motion.div>

                            <motion.div variants={itemVariants} className="pt-2">
                                <Button 
                                    type="submit" 
                                    className="w-full bg-[#412A5F] hover:bg-[#412A5F]/90"
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        "Save Changes"
                                    )}
                                </Button>
                            </motion.div>
                        </form>
                    </Form>
                </motion.div>
            </div>

            {/* Saved Addresses Section */}
            <motion.div
                variants={itemVariants}
                className="mt-12 space-y-6"
            >
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-[#412A5F]">
                        Your Saved Addresses
                    </h2>
                    <Button
                        variant="outline"
                        onClick={() => setIsAddressModalOpen(true)}
                        className="border-[#412A5F] text-[#412A5F] hover:bg-[#412A5F] hover:text-white"
                    >
                        <Plus className="size-4 mr-2" />
                        Add New Address
                    </Button>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {addresses.length === 0 ? (
                        <div className="col-span-full text-center py-8 border-2 border-dashed rounded-lg">
                            <p className="text-muted-foreground">No saved addresses</p>
                            <Button
                                variant="outline"
                                onClick={() => setIsAddressModalOpen(true)}
                                className="mt-4"
                            >
                                Add Your First Address
                            </Button>
                        </div>
                    ) : (
                        addresses.map((address) => (
                            <motion.div
                                key={address.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white border rounded-lg p-4 shadow-sm relative"
                            >
                                <div className="absolute top-2 right-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="size-8 p-0 text-red-500 hover:text-red-700 border-red-200"
                                        onClick={() => handleDeleteAddress(address.id)}
                                        disabled={deletingAddressId === address.id}
                                    >
                                        {deletingAddressId === address.id ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <X className="size-4" />
                                        )}
                                    </Button>
                                </div>
                                <div className="text-main font-medium mb-1">Address {address.id}</div>
                                <div className="space-y-1 text-sm">
                                    <p>{address.address1}</p>
                                    {address.address2 && <p>{address.address2}</p>}
                                    <p>{address.city}, {address.state} - {address.pincode}</p>
                                    <p className="font-medium">Phone: {address.phone}</p>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </motion.div>

            {/* Address Modal */}
            <AddressModal
                isOpen={isAddressModalOpen}
                onClose={() => setIsAddressModalOpen(false)}
                onSubmit={handleAddAddress}
            />
        </motion.div>
    );
};

export default CustomerProfilePage; 