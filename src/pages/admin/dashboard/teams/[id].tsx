import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {  
    Mail, 
    Phone, 
    Calendar, 
    ClipboardList, 
    ShieldCheck, 
    User2, 
    Briefcase,
    IdCard,
    UserCog,
    Save,
    Pencil,
    X,
    FileText,
    CreditCard,
    Building,
    UploadCloud,
    Download,
    Plus,
    Loader2,
    AlertCircle,
    RefreshCw
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye } from "lucide-react";
import { toast } from "sonner";

// Define interface for orders
interface Order {
    id: string;
    date: string;
    status: string;
    amount: string;
}

// Define user data interface
interface AdminUser {
    id: string;
    employeeId: string;
    fullName: string;
    email: string;
    phone: string;
    address: string;
    status: "Active" | "Inactive" | "On Leave";
    joinDate: string;
    lastActive: string;
    role: "Admin" | "Manager" | "Support" | "Agent";
    isSuperAdmin: boolean;
    remarks: string;
    profileImage?: string;
    transactions: {
        total: number;
        successful: number;
        failed: number;
    };
    recentOrders: Order[];
}

// Demo admin user data
const ADMIN_USERS: AdminUser[] = [
    {
        id: "ADMIN001",
        employeeId: "EMP-001",
        fullName: "John Doe",
        email: "john.doe@rocketrybox.com",
        phone: "+91 9876543210",
        address: "123 Main Street, Bangalore, Karnataka, India",
        status: "Active",
        joinDate: "February 15, 2023",
        lastActive: "Today, 10:30 AM",
        role: "Admin",
        isSuperAdmin: true,
        remarks: "Lead administrator responsible for platform oversight",
        profileImage: "/images/avatars/john.jpg",
        transactions: {
            total: 157,
            successful: 152,
            failed: 5
        },
        recentOrders: [
            { id: "ORD-9876", date: "June 12, 2023", status: "Completed", amount: "₹5,200" },
            { id: "ORD-9754", date: "June 8, 2023", status: "Completed", amount: "₹3,600" },
            { id: "ORD-9621", date: "May 29, 2023", status: "Cancelled", amount: "₹1,800" }
        ]
    },
    {
        id: "ADMIN002",
        employeeId: "EMP-002",
        fullName: "Jane Smith",
        email: "jane.smith@rocketrybox.com",
        phone: "+91 9876543211",
        address: "456 Park Avenue, Mumbai, Maharashtra, India",
        status: "Active",
        joinDate: "March 22, 2023",
        lastActive: "Yesterday, 4:15 PM",
        role: "Manager",
        isSuperAdmin: false,
        remarks: "Manages all financial transactions and approvals",
        transactions: {
            total: 98,
            successful: 95,
            failed: 3
        },
        recentOrders: [
            { id: "ORD-8765", date: "June 10, 2023", status: "Completed", amount: "₹7,800" },
            { id: "ORD-8654", date: "June 5, 2023", status: "Processing", amount: "₹2,400" }
        ]
    },
    {
        id: "ADMIN003",
        employeeId: "EMP-003",
        fullName: "Robert Johnson",
        email: "robert.j@rocketrybox.com",
        phone: "+91 9876543212",
        address: "789 Tech Park, Hyderabad, Telangana, India",
        status: "Inactive",
        joinDate: "April 10, 2023",
        lastActive: "June 15, 2023, 2:30 PM",
        role: "Support",
        isSuperAdmin: false,
        remarks: "Primary support agent for priority tickets",
        transactions: {
            total: 64,
            successful: 58,
            failed: 6
        },
        recentOrders: [
            { id: "ORD-7543", date: "June 14, 2023", status: "Completed", amount: "₹3,200" },
            { id: "ORD-7432", date: "June 1, 2023", status: "Cancelled", amount: "₹1,900" }
        ]
    },
    {
        id: "ADMIN004",
        employeeId: "EMP-004",
        fullName: "Emily Davis",
        email: "emily.d@rocketrybox.com",
        phone: "+91 9876543213",
        address: "321 Business Hub, Delhi, India",
        status: "On Leave",
        joinDate: "May 5, 2023",
        lastActive: "June 20, 2023, 9:45 AM",
        role: "Agent",
        isSuperAdmin: false,
        remarks: "Handles merchant onboarding for north region",
        transactions: {
            total: 42,
            successful: 39,
            failed: 3
        },
        recentOrders: [
            { id: "ORD-6543", date: "June 18, 2023", status: "Completed", amount: "₹4,100" }
        ]
    },
    {
        id: "ADMIN005",
        employeeId: "EMP-005",
        fullName: "Michael Wilson",
        email: "michael.w@rocketrybox.com",
        phone: "+91 9876543214",
        address: "567 Tech Square, Pune, Maharashtra, India",
        status: "Active",
        joinDate: "June 18, 2023",
        lastActive: "Today, 11:20 AM",
        role: "Admin",
        isSuperAdmin: false,
        remarks: "Technical administrator for system maintenance",
        transactions: {
            total: 87,
            successful: 83,
            failed: 4
        },
        recentOrders: [
            { id: "ORD-5432", date: "June 20, 2023", status: "Processing", amount: "₹6,300" },
            { id: "ORD-5321", date: "June 17, 2023", status: "Completed", amount: "₹2,800" }
        ]
    }
];

// Function to get admin user data by ID
const getAdminUserById = (id: string): AdminUser => {
    const user = ADMIN_USERS.find(user => user.id.toLowerCase() === id.toLowerCase());
    
    if (user) {
        return user;
    }
    
    // Return default empty data if user not found
    return {
        id: id || "",
        employeeId: "",
        fullName: "User Not Found",
        email: "",
        phone: "",
        address: "",
        status: "Inactive",
        joinDate: "",
        lastActive: "",
        role: "Admin",
        isSuperAdmin: false,
        remarks: "",
        transactions: {
            total: 0,
            successful: 0,
            failed: 0
        },
        recentOrders: []
    };
};

// API functions for future implementation
// --------------------------------------
// async function fetchAdminUserById(id: string): Promise<AdminUser> {
//   try {
//     const response = await fetch(`/api/admin/team/${id}`);
//     if (!response.ok) throw new Error('Failed to fetch admin data');
//     
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error('Error fetching admin data:', error);
//     throw error;
//   }
// }
//
// async function updateAdminUser(id: string, userData: Partial<AdminUser>): Promise<AdminUser> {
//   try {
//     const response = await fetch(`/api/admin/team/${id}`, {
//       method: 'PATCH',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(userData)
//     });
//     
//     if (!response.ok) throw new Error('Failed to update admin data');
//     
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error('Error updating admin data:', error);
//     throw error;
//   }
// }
//
// async function updateAdminPermissions(id: string, permissions: Record<string, boolean>): Promise<void> {
//   try {
//     const response = await fetch(`/api/admin/team/${id}/permissions`, {
//       method: 'PATCH',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(permissions)
//     });
//     
//     if (!response.ok) throw new Error('Failed to update admin permissions');
//   } catch (error) {
//     console.error('Error updating admin permissions:', error);
//     throw error;
//   }
// }
// --------------------------------------

const AdminTeamProfilePage = () => {
    const { id } = useParams();
    const [userData, setUserData] = useState<AdminUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    
    // State for edit mode
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        fullName: "",
        employeeId: "",
        email: "",
        phone: "",
        address: "",
        role: "Admin" as "Admin" | "Manager" | "Support" | "Agent",
        status: "Active" as "Active" | "Inactive" | "On Leave",
        remarks: ""
    });
    
    // Permission state
    const [permissions, setPermissions] = useState({
        dashboardAccess: true, // Everyone has this by default
        userManagement: false,
        teamManagement: false,
        ordersShipping: false,
        financialOperations: false,
        systemConfig: false,
        sellerManagement: false,
        supportTickets: false,
        reportsAnalytics: false,
        marketingPromotions: false
    });

    const [permissionsChanged, setPermissionsChanged] = useState(false);
    
    // Simulate a current logged-in admin (for demo purposes)
    const currentAdmin = ADMIN_USERS[0]; // Assume first admin (super admin) is logged in
    
    // Document upload state
    const [documents, setDocuments] = useState({
        idProof: null as null | { name: string; url: string },
        employmentContract: null as null | { name: string; url: string },
    });
    const idProofInputRef = useRef<HTMLInputElement>(null);
    const employmentContractInputRef = useRef<HTMLInputElement>(null);

    // Fetch user data
    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            
            try {
                setLoading(true);
                setError(null);
                
                // For development we'll use the local data
                // When API is ready, this would be:
                // const data = await fetchAdminUserById(id);
                
                // Simulate API call delay
                await new Promise(resolve => setTimeout(resolve, 800));
                
                const data = getAdminUserById(id);
                
                // Check if user was found
                if (data.fullName === "User Not Found") {
                    setError("Admin user not found. Please check the ID and try again.");
                } else {
                    setUserData(data);
                    
                    // Initialize edit data
                    setEditData({
                        fullName: data.fullName,
                        employeeId: data.employeeId,
                        email: data.email,
                        phone: data.phone,
                        address: data.address,
                        role: data.role,
                        status: data.status,
                        remarks: data.remarks || ""
                    });
                    
                    // Initialize permissions
                    setPermissions({
                        dashboardAccess: true, // Everyone has this by default
                        userManagement: data.isSuperAdmin,
                        teamManagement: data.isSuperAdmin,
                        ordersShipping: data.isSuperAdmin,
                        financialOperations: data.isSuperAdmin,
                        systemConfig: data.isSuperAdmin,
                        sellerManagement: data.isSuperAdmin,
                        supportTickets: data.isSuperAdmin,
                        reportsAnalytics: data.isSuperAdmin,
                        marketingPromotions: data.isSuperAdmin
                    });
                }
            } catch (err) {
                console.error("Error fetching admin user:", err);
                setError("Failed to load admin data. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, [id]);
    
    // Determine if current user can edit
    const canEdit = currentAdmin.isSuperAdmin || (userData && currentAdmin.id === userData.id);

    const handleInputChange = (field: string, value: string) => {
        setEditData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSaveChanges = async () => {
        try {
            setSaving(true);
            
            // When API is ready, this would be:
            // await updateAdminUser(id!, {
            //     fullName: editData.fullName,
            //     employeeId: editData.employeeId,
            //     email: editData.email,
            //     phone: editData.phone,
            //     address: editData.address,
            //     role: editData.role,
            //     status: editData.status,
            //     remarks: editData.remarks
            // });
            
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Update local state
            if (userData) {
                const updatedUser = {
                    ...userData,
                    fullName: editData.fullName,
                    employeeId: editData.employeeId,
                    email: editData.email,
                    phone: editData.phone, 
                    address: editData.address,
                    role: editData.role,
                    status: editData.status,
                    remarks: editData.remarks
                };
                
                setUserData(updatedUser);
            }
            
            toast.success("Profile updated successfully");
            setIsEditing(false);
        } catch (err) {
            console.error("Error saving changes:", err);
            toast.error("Failed to update profile. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const handlePermissionChange = (permission: string, value: boolean) => {
        setPermissions(prev => ({
            ...prev,
            [permission]: value
        }));
        
        setPermissionsChanged(true);
    };

    const handleSavePermissions = async () => {
        try {
            setSaving(true);
            
            // When API is ready, this would be:
            // await updateAdminPermissions(id!, permissions);
            
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 800));
            
            toast.success("Permissions updated successfully");
            setPermissionsChanged(false);
        } catch (err) {
            console.error("Error saving permissions:", err);
            toast.error("Failed to update permissions. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    // Determine if current user can manage permissions
    const canManagePermissions = currentAdmin.isSuperAdmin;

    const handleUploadClick = (docType: 'idProof' | 'employmentContract') => {
        if (docType === "idProof") idProofInputRef.current?.click();
        if (docType === "employmentContract") employmentContractInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, docType: 'idProof' | 'employmentContract') => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setDocuments((prev) => ({
                ...prev,
                [docType]: { name: file.name, url },
            }));
            // TODO: Upload to backend here if needed
        }
    };

    const handleViewDocument = (docType: 'idProof' | 'employmentContract') => {
        const doc = documents[docType];
        if (doc && doc.url) {
            window.open(doc.url, "_blank");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="flex flex-col items-center">
                    <Loader2 className="h-12 w-12 animate-spin text-purple-600 mb-4" />
                    <p className="text-lg text-muted-foreground">Loading admin profile...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
                    <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-red-700 mb-2">Error Loading Profile</h3>
                    <p className="text-red-600 mb-4">{error}</p>
                    <Button 
                        variant="outline" 
                        onClick={() => window.location.reload()}
                        className="mx-auto"
                    >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <p className="text-lg text-muted-foreground">No admin user data available</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-semibold">
                        Admin Profile
                    </h1>
                    <p className="text-base lg:text-lg text-muted-foreground mt-1">
                        View and manage administrator details
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button 
                        variant="outline"
                        onClick={() => toast.success("Password reset link sent to admin's email")}
                        disabled={saving}
                    >
                        Reset Password
                    </Button>
                    {canEdit && (
                        isEditing ? (
                            <div className="flex gap-2">
                                <Button 
                                    variant="outline" 
                                    onClick={() => setIsEditing(false)}
                                    disabled={saving}
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    Cancel
                                </Button>
                                <Button 
                                    variant="purple" 
                                    onClick={handleSaveChanges}
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Save Changes
                                        </>
                                    )}
                                </Button>
                            </div>
                        ) : (
                            <Button 
                                variant="purple" 
                                onClick={() => setIsEditing(true)}
                                disabled={saving}
                            >
                                <Pencil className="w-4 h-4 mr-2" />
                                Edit Profile
                            </Button>
                        )
                    )}
                </div>
            </div>

            {/* User Info Card */}
            <Card className="shadow-none overflow-hidden">
                <div className="h-24 bg-gradient-to-r from-purple-600 to-indigo-600"></div>
                <CardContent className="p-6 -mt-12">
                    <div className="flex flex-col sm:flex-row items-start gap-6">
                        <div className="h-24 w-24 rounded-full bg-white p-1 shadow-md">
                            {userData.profileImage ? (
                                <img 
                                    src={userData.profileImage} 
                                    alt={userData.fullName} 
                                    className="w-full h-full rounded-full object-cover"
                                />
                            ) : (
                                <div className="h-full w-full rounded-full bg-purple-100 flex items-center justify-center">
                            <span className="text-2xl font-semibold text-purple-600">
                                        {userData.fullName.charAt(0)}
                            </span>
                                </div>
                            )}
                        </div>
                        <div className="space-y-2 mt-4 sm:mt-8">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                <h2 className="text-2xl font-semibold">
                                    {isEditing ? (
                                        <Input 
                                            value={editData.fullName}
                                            onChange={(e) => handleInputChange('fullName', e.target.value)}
                                            className="w-64 font-semibold"
                                        />
                                    ) : (
                                        userData.fullName
                                    )}
                                </h2>
                                <div className="flex gap-2">
                                    {isEditing ? (
                                        <Select 
                                            value={editData.status} 
                                            onValueChange={(value) => handleInputChange('status', value as "Active" | "Inactive" | "On Leave")}
                                        >
                                            <SelectTrigger className="w-32">
                                                <SelectValue placeholder="Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Active">Active</SelectItem>
                                                <SelectItem value="Inactive">Inactive</SelectItem>
                                                <SelectItem value="On Leave">On Leave</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                <Badge variant={userData.status === "Active" ? "secondary" : "outline"}>
                                    {userData.status}
                                </Badge>
                                    )}
                                    {userData.isSuperAdmin && (
                                        <Badge variant="default" className="bg-purple-600">
                                            Super Admin
                                        </Badge>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-1 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    {isEditing ? (
                                        <Input 
                                            value={editData.email}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                            className="w-64 text-sm h-8"
                                        />
                                    ) : (
                                        userData.email
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4" />
                                    {isEditing ? (
                                        <Input 
                                            value={editData.phone}
                                            onChange={(e) => handleInputChange('phone', e.target.value)}
                                            className="w-64 text-sm h-8"
                                        />
                                    ) : (
                                        userData.phone
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <IdCard className="w-4 h-4" />
                                    {isEditing ? (
                                        <Input 
                                            value={editData.employeeId}
                                            onChange={(e) => handleInputChange('employeeId', e.target.value)}
                                            className="w-64 text-sm h-8"
                                        />
                                    ) : (
                                        userData.employeeId
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tabs Section */}
            <Tabs defaultValue="details" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="details">
                        <User2 className="w-4 h-4 mr-2" />
                        Personal Details
                    </TabsTrigger>
                    <TabsTrigger value="role">
                        <UserCog className="w-4 h-4 mr-2" />
                        Role & Access
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4">
                    <Card className="shadow-none">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User2 className="w-5 h-5" />
                                Personal Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
                                <div>
                                    <label className="text-sm text-muted-foreground">
                                        Full Name
                                    </label>
                                    <div className="font-medium mt-1">
                                        {isEditing ? (
                                            <Input 
                                                value={editData.fullName}
                                                onChange={(e) => handleInputChange('fullName', e.target.value)}
                                                className="w-full"
                                            />
                                        ) : (
                                            userData.fullName
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground">
                                        Employee ID
                                    </label>
                                    <div className="font-medium mt-1">
                                        {isEditing ? (
                                            <Input 
                                                value={editData.employeeId}
                                                onChange={(e) => handleInputChange('employeeId', e.target.value)}
                                                className="w-full"
                                            />
                                        ) : (
                                            userData.employeeId
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground">
                                        Email Address
                                    </label>
                                    <div className="font-medium mt-1">
                                        {isEditing ? (
                                            <Input 
                                                value={editData.email}
                                                onChange={(e) => handleInputChange('email', e.target.value)}
                                                className="w-full"
                                            />
                                        ) : (
                                            userData.email
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground">
                                        Phone Number
                                    </label>
                                    <div className="font-medium mt-1">
                                        {isEditing ? (
                                            <Input 
                                                value={editData.phone}
                                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                                className="w-full"
                                            />
                                        ) : (
                                            userData.phone
                                        )}
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-sm text-muted-foreground">
                                        Address
                                    </label>
                                    <div className="font-medium mt-1">
                                        {isEditing ? (
                                            <Textarea 
                                                value={editData.address}
                                                onChange={(e) => handleInputChange('address', e.target.value)}
                                                className="w-full"
                                                rows={2}
                                            />
                                        ) : (
                                            userData.address
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground">
                                        Join Date
                                    </label>
                                    <div className="flex items-center gap-2 mt-1 font-medium">
                                        <Calendar className="w-4 h-4 text-purple-600" />
                                        {userData.joinDate} {/* Join date is not editable */}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground">
                                        Last Active
                                    </label>
                                    <div className="flex items-center gap-2 mt-1 font-medium">
                                        <Calendar className="w-4 h-4 text-green-600" />
                                        {userData.lastActive} {/* Last active is not editable */}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-none">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="w-5 h-5" />
                                Documents
                            </CardTitle>
                            {canEdit && isEditing && (
                                <Button variant="outline" size="sm" className="text-xs h-8">
                                    <Plus className="h-3 w-3 mr-1" />
                                    Add Document
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 border rounded-md">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-blue-100 p-2 rounded-md">
                                            <FileText className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium">ID Proof</h3>
                                            <p className="text-sm text-muted-foreground">Aadhar Card, PAN Card or Voter ID</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" className="text-xs h-8" onClick={() => handleViewDocument('idProof')} disabled={!documents.idProof}>
                                            <Download className="h-3 w-3 mr-1" />
                                            View
                                        </Button>
                                        {canEdit && isEditing && (
                                            <>
                                                <input
                                                    type="file"
                                                    ref={idProofInputRef}
                                                    style={{ display: "none" }}
                                                    onChange={(e) => handleFileChange(e, "idProof")}
                                                    accept=".pdf,.jpg,.jpeg,.png"
                                                />
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-xs h-8 text-purple-600 border-purple-200 hover:bg-purple-50"
                                                    onClick={() => handleUploadClick("idProof")}
                                                >
                                                    <UploadCloud className="h-3 w-3 mr-1" />
                                                    Upload
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between p-3 border rounded-md">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-green-100 p-2 rounded-md">
                                            <FileText className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium">Employment Contract</h3>
                                            <p className="text-sm text-muted-foreground">Signed employment agreement</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" className="text-xs h-8" onClick={() => handleViewDocument('employmentContract')} disabled={!documents.employmentContract}>
                                            <Download className="h-3 w-3 mr-1" />
                                            View
                                        </Button>
                                        {canEdit && isEditing && (
                                            <>
                                                <input
                                                    type="file"
                                                    ref={employmentContractInputRef}
                                                    style={{ display: "none" }}
                                                    onChange={(e) => handleFileChange(e, "employmentContract")}
                                                    accept=".pdf,.jpg,.jpeg,.png"
                                                />
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-xs h-8 text-purple-600 border-purple-200 hover:bg-purple-50"
                                                    onClick={() => handleUploadClick("employmentContract")}
                                                >
                                                    <UploadCloud className="h-3 w-3 mr-1" />
                                                    Upload
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Upload prompt only shown when in edit mode */}
                                {canEdit && isEditing && (
                                    <div className="flex flex-col items-center justify-center p-6 border border-dashed rounded-md bg-gray-50">
                                        <UploadCloud className="h-10 w-10 text-muted-foreground mb-2" />
                                        <h3 className="font-medium">Upload Additional Documents</h3>
                                        <p className="text-sm text-muted-foreground text-center mt-1 mb-4">
                                            Drag & drop files here, or click to browse
                                        </p>
                                        <Button variant="purple" size="sm">
                                            <UploadCloud className="h-4 w-4 mr-2" />
                                            Browse Files
                                        </Button>
                                        <p className="text-xs text-muted-foreground mt-3">
                                            Supported formats: PDF, JPG, PNG (Max: 5MB)
                                        </p>
                                    </div>
                                )}
                                
                                {!isEditing && (
                                    <div className="text-sm text-muted-foreground mt-4">
                                        <p>
                                            <strong>Note:</strong> Document uploads and updates require admin approval. Edit profile to upload or update documents.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-none">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="w-5 h-5" />
                                Salary Account Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
                                <div>
                                    <label className="text-sm text-muted-foreground">
                                        Bank Name
                                    </label>
                                    <div className="font-medium mt-1">
                                        HDFC Bank Ltd.
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground">
                                        Account Holder Name
                                    </label>
                                    <div className="font-medium mt-1">
                                        {userData.fullName}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground">
                                        Account Number
                                    </label>
                                    <div className="font-medium mt-1">
                                        <span>XXXX XXXX 5678</span>
                                        {canEdit && (
                                            <Button variant="ghost" size="sm" className="ml-2 h-6 text-xs text-muted-foreground">
                                                <Eye className="h-3 w-3 mr-1" />
                                                View
                                            </Button>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground">
                                        IFSC Code
                                    </label>
                                    <div className="font-medium mt-1">
                                        HDFC0001234
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground">
                                        Account Type
                                    </label>
                                    <div className="font-medium mt-1">
                                        Salary Account
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground">
                                        Branch
                                    </label>
                                    <div className="font-medium mt-1">
                                        <Building className="w-4 h-4 inline-block mr-1 text-blue-600" />
                                        Bangalore Main Branch
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t">
                                <p className="text-sm text-muted-foreground">
                                    <strong>Note:</strong> For security reasons, account details can only be updated by HR or Finance department.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-none">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ClipboardList className="w-5 h-5" />
                                Remarks
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isEditing ? (
                                <Textarea 
                                    value={editData.remarks}
                                    onChange={(e) => handleInputChange('remarks', e.target.value)}
                                    className="w-full"
                                    rows={3}
                                    placeholder="Add any remarks about this admin user"
                                />
                            ) : (
                                <p>{userData.remarks || "No remarks available."}</p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="role" className="space-y-4">
                    <Card className="shadow-none">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Briefcase className="w-5 h-5" />
                                Role Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
                                <div>
                                    <label className="text-sm text-muted-foreground">
                                        Role
                                    </label>
                                    <div className="flex items-center gap-2 mt-1">
                                        {isEditing ? (
                                            <Select 
                                                value={editData.role} 
                                                onValueChange={(value) => handleInputChange('role', value as "Admin" | "Manager" | "Support" | "Agent")}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Role" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Admin">Admin</SelectItem>
                                                    <SelectItem value="Manager">Manager</SelectItem>
                                                    <SelectItem value="Support">Support</SelectItem>
                                                    <SelectItem value="Agent">Agent</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <Badge className="font-medium">
                                                {userData.role}
                                            </Badge>
                                        )}
                                            </div>
                                        </div>
                                <div>
                                    <label className="text-sm text-muted-foreground">
                                        Admin Status
                                    </label>
                                    <div className="flex items-center gap-2 mt-1">
                                        {isEditing ? (
                                            <Select 
                                                value={editData.status} 
                                                onValueChange={(value) => handleInputChange('status', value as "Active" | "Inactive" | "On Leave")}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Active">Active</SelectItem>
                                                    <SelectItem value="Inactive">Inactive</SelectItem>
                                                    <SelectItem value="On Leave">On Leave</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <Badge variant={userData.status === "Active" ? "secondary" : "outline"}>
                                                {userData.status}
                                            </Badge>
                                        )}
                                            </div>
                                        </div>
                                <div>
                                    <label className="text-sm text-muted-foreground">
                                        Admin Type
                                    </label>
                                    <div className="flex items-center gap-2 mt-1">
                                        {userData.isSuperAdmin ? (
                                            <Badge className="bg-purple-600">Super Admin</Badge>
                                        ) : (
                                            <Badge variant="outline">Regular Admin</Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-none">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5" />
                                Access & Permissions
                            </CardTitle>
                            {canManagePermissions && (
                                <p className="text-sm text-muted-foreground">Toggle switches to update permissions</p>
                            )}
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 border rounded-md">
                                    <div>
                                        <h3 className="font-medium">Dashboard Access</h3>
                                        <p className="text-sm text-muted-foreground">View analytics and performance reports</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {canManagePermissions ? (
                                            <Switch
                                                checked={permissions.dashboardAccess}
                                                onCheckedChange={(value) => handlePermissionChange('dashboardAccess', value)}
                                                className="data-[state=checked]:bg-purple-600"
                                            />
                                        ) : (
                                            <Badge variant={permissions.dashboardAccess ? "secondary" : "outline"}>
                                                {permissions.dashboardAccess ? "Granted" : "Restricted"}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between p-3 border rounded-md">
                                    <div>
                                        <h3 className="font-medium">User Management</h3>
                                        <p className="text-sm text-muted-foreground">View and manage customer accounts</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {canManagePermissions ? (
                                            <Switch
                                                checked={permissions.userManagement}
                                                onCheckedChange={(value) => handlePermissionChange('userManagement', value)}
                                                className="data-[state=checked]:bg-purple-600"
                                            />
                                        ) : (
                                            <Badge variant={permissions.userManagement ? "secondary" : "outline"}>
                                                {permissions.userManagement ? "Granted" : "Restricted"}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between p-3 border rounded-md">
                                    <div>
                                        <h3 className="font-medium">Team Management</h3>
                                        <p className="text-sm text-muted-foreground">Add, edit and remove team members</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {canManagePermissions ? (
                                            <Switch
                                                checked={permissions.teamManagement}
                                                onCheckedChange={(value) => handlePermissionChange('teamManagement', value)}
                                                className="data-[state=checked]:bg-purple-600"
                                            />
                                        ) : (
                                            <Badge variant={permissions.teamManagement ? "secondary" : "outline"}>
                                                {permissions.teamManagement ? "Granted" : "Restricted"}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between p-3 border rounded-md">
                                    <div>
                                        <h3 className="font-medium">Orders & Shipping</h3>
                                        <p className="text-sm text-muted-foreground">Manage orders and shipping processes</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {canManagePermissions ? (
                                            <Switch
                                                checked={permissions.ordersShipping}
                                                onCheckedChange={(value) => handlePermissionChange('ordersShipping', value)}
                                                className="data-[state=checked]:bg-purple-600"
                                            />
                                        ) : (
                                            <Badge variant={permissions.ordersShipping ? "secondary" : "outline"}>
                                                {permissions.ordersShipping ? "Granted" : "Restricted"}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between p-3 border rounded-md">
                                    <div>
                                        <h3 className="font-medium">Financial Operations</h3>
                                        <p className="text-sm text-muted-foreground">Process refunds, payments and transactions</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {canManagePermissions ? (
                                            <Switch
                                                checked={permissions.financialOperations}
                                                onCheckedChange={(value) => handlePermissionChange('financialOperations', value)}
                                                className="data-[state=checked]:bg-purple-600"
                                            />
                                        ) : (
                                            <Badge variant={permissions.financialOperations ? "secondary" : "outline"}>
                                                {permissions.financialOperations ? "Granted" : "Restricted"}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between p-3 border rounded-md">
                                    <div>
                                        <h3 className="font-medium">System Configuration</h3>
                                        <p className="text-sm text-muted-foreground">Modify system settings and configurations</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {canManagePermissions ? (
                                            <Switch
                                                checked={permissions.systemConfig}
                                                onCheckedChange={(value) => handlePermissionChange('systemConfig', value)}
                                                className="data-[state=checked]:bg-purple-600"
                                            />
                                        ) : (
                                            <Badge variant={permissions.systemConfig ? "secondary" : "outline"}>
                                                {permissions.systemConfig ? "Granted" : "Restricted"}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between p-3 border rounded-md">
                                    <div>
                                        <h3 className="font-medium">Seller Management</h3>
                                        <p className="text-sm text-muted-foreground">Onboard and manage seller profiles</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {canManagePermissions ? (
                                            <Switch
                                                checked={permissions.sellerManagement}
                                                onCheckedChange={(value) => handlePermissionChange('sellerManagement', value)}
                                                className="data-[state=checked]:bg-purple-600"
                                            />
                                        ) : (
                                            <Badge variant={permissions.sellerManagement ? "secondary" : "outline"}>
                                                {permissions.sellerManagement ? "Granted" : "Restricted"}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between p-3 border rounded-md">
                                    <div>
                                        <h3 className="font-medium">Support Tickets</h3>
                                        <p className="text-sm text-muted-foreground">Handle customer support requests</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {canManagePermissions ? (
                                            <Switch
                                                checked={permissions.supportTickets}
                                                onCheckedChange={(value) => handlePermissionChange('supportTickets', value)}
                                                className="data-[state=checked]:bg-purple-600"
                                            />
                                        ) : (
                                            <Badge variant={permissions.supportTickets ? "secondary" : "outline"}>
                                                {permissions.supportTickets ? "Granted" : "Restricted"}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between p-3 border rounded-md">
                                    <div>
                                        <h3 className="font-medium">Reports & Analytics</h3>
                                        <p className="text-sm text-muted-foreground">Generate and export detailed reports</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {canManagePermissions ? (
                                            <Switch
                                                checked={permissions.reportsAnalytics}
                                                onCheckedChange={(value) => handlePermissionChange('reportsAnalytics', value)}
                                                className="data-[state=checked]:bg-purple-600"
                                            />
                                        ) : (
                                            <Badge variant={permissions.reportsAnalytics ? "secondary" : "outline"}>
                                                {permissions.reportsAnalytics ? "Granted" : "Restricted"}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between p-3 border rounded-md">
                                    <div>
                                        <h3 className="font-medium">Marketing & Promotions</h3>
                                        <p className="text-sm text-muted-foreground">Manage campaigns and promotional offers</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {canManagePermissions ? (
                                            <Switch
                                                checked={permissions.marketingPromotions}
                                                onCheckedChange={(value) => handlePermissionChange('marketingPromotions', value)}
                                                className="data-[state=checked]:bg-purple-600"
                                            />
                                        ) : (
                                            <Badge variant={permissions.marketingPromotions ? "secondary" : "outline"}>
                                                {permissions.marketingPromotions ? "Granted" : "Restricted"}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                
                                {canManagePermissions && permissionsChanged && (
                                    <div className="flex justify-end mt-6">
                                        <Button 
                                            variant="purple" 
                                            onClick={handleSavePermissions}
                                            className="gap-2"
                                        >
                                            <Save className="w-4 h-4" />
                                            Save Permission Changes
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AdminTeamProfilePage;