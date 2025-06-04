import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { 
    fetchTeamMembers, 
    addTeamMember, 
    deleteTeamMember, 
    resetTeamMemberPassword, 
    updateTeamMember,
    SellerTeamMember,
    JobRole,
    getRolePermissions,
    getAvailableJobRoles
} from "@/lib/api/seller-users";
import { Loader2, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePermissions } from "@/hooks/usePermissions";

// Permission categories and their options
const PERMISSIONS = [
    {
        category: "Dashboard",
        icon: "dashboard",
        options: ["Dashboard access"]
    },
    {
        category: "Order",
        icon: "order",
        options: ["Order", "Shipments", "Manifest", "Received", "New Order"]
    },
    {
        category: "NDR",
        icon: "ndr",
        options: ["NDR List", "Weight Dispute"]
    },
    {
        category: "Billing",
        icon: "billing",
        options: ["Fright", "Wallet", "Invoice", "Ledger"]
    },
    {
        category: "COD",
        icon: "cod",
        options: ["COD Remittance"]
    },
    {
        category: "Warehouse & Support",
        icon: "warehouse",
        options: ["Support", "Warehouse", "Service", "Items & SKU"]
    },
    {
        category: "Settings",
        icon: "settings",
        options: ["Stores", "Priority", "Label"]
    }
];

const ManageUsersPage = () => {
    const { hasPermission, canAccess } = usePermissions();
    const [showAddUser, setShowAddUser] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [users, setUsers] = useState<SellerTeamMember[]>([]);
    const [searchParams] = useSearchParams();
    const [editingUser, setEditingUser] = useState<SellerTeamMember | null>(null);
    const [userPermissions, setUserPermissions] = useState<Record<string, boolean>>({});
    
    // Form state for adding new user
    const [newUser, setNewUser] = useState({
        name: "",
        email: "",
        contactNumber: "",
        password: "",
        jobRole: "" as JobRole | "",
        permissions: {} as Record<string, boolean>
    });

    // Load users on component mount
    useEffect(() => {
        const loadUsers = async () => {
            try {
                setLoading(true);
                setError(null);
                const teamMembers = await fetchTeamMembers();
                setUsers(teamMembers);
            } catch (err) {
                setError("Failed to load users. Please try again.");
                console.error("Error loading users:", err);
            } finally {
                setLoading(false);
            }
        };
        
        loadUsers();
    }, []);

    // Handle job role change and apply role-based permissions
    const handleJobRoleChange = (role: JobRole) => {
        const rolePermissions = getRolePermissions(role);
        const permissionsMap: Record<string, boolean> = {};
        
        // Set all permissions to false first
        PERMISSIONS.forEach(section => {
            section.options.forEach(option => {
                permissionsMap[option] = false;
            });
        });
        
        // Set role-based permissions to true
        rolePermissions.forEach(permission => {
            permissionsMap[permission] = true;
        });
        
        setNewUser(prev => ({
            ...prev,
            jobRole: role,
            permissions: permissionsMap
        }));
    };

    const handleAddUser = async () => {
        try {
            if (!newUser.name || !newUser.email || !newUser.contactNumber || !newUser.password || !newUser.jobRole) {
                toast.error("Please fill in all required fields including job role");
                return;
            }
            
            setLoading(true);
            
            // Convert permissions object to array of permission strings
            const permissionsList = Object.entries(newUser.permissions)
                .filter(([_, isSelected]) => isSelected)
                .map(([permission]) => permission);
            
            const addedUser = await addTeamMember({
                name: newUser.name,
                email: newUser.email,
                contactNumber: newUser.contactNumber,
                password: newUser.password,
                jobRole: newUser.jobRole as JobRole,
                permissions: permissionsList,
                status: "active"
            });
            
            setUsers(prev => [...prev, addedUser]);
            toast.success("User added successfully");
            setShowAddUser(false);
            
            // Reset form
            setNewUser({
                name: "",
                email: "",
                contactNumber: "",
                password: "",
                jobRole: "",
                permissions: {}
            });
        } catch (err) {
            toast.error("Failed to add user. Please try again.");
            console.error("Error adding user:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (userId: string) => {
        if (!hasPermission("Manage Users")) {
            toast.error("You don't have permission to reset passwords");
            return;
        }
        
        try {
            setLoading(true);
            await resetTeamMemberPassword(userId);
            toast.success("Password reset email sent");
        } catch (err) {
            toast.error("Failed to reset password. Please try again.");
            console.error("Error resetting password:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!hasPermission("Manage Users")) {
            toast.error("You don't have permission to delete users");
            return;
        }
        
        try {
            setLoading(true);
            await deleteTeamMember(userId);
            setUsers(prev => prev.filter(user => user.id !== userId));
            toast.success("User deleted successfully");
        } catch (err) {
            toast.error("Failed to delete user. Please try again.");
            console.error("Error deleting user:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateUser = async (userId: string, updates: Partial<SellerTeamMember>) => {
        if (!hasPermission("Manage Users")) {
            toast.error("You don't have permission to update users");
            return;
        }
        
        try {
            setLoading(true);
            await updateTeamMember(userId, updates);
            setUsers(prev => prev.map(user => 
                user.id === userId 
                    ? { ...user, ...updates } 
                    : user
            ));
            toast.success("User updated successfully");
            setEditingUser(null);
        } catch (err) {
            toast.error("Failed to update user. Please try again.");
            console.error("Error updating user:", err);
        } finally {
            setLoading(false);
        }
    };

    const handlePermissionChange = (permission: string, checked: boolean) => {
        setNewUser(prev => ({
            ...prev,
            permissions: {
                ...prev.permissions,
                [permission]: checked
            }
        }));
    };

    // Helper function to format date 
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric'
        });
    };

    // Filter users based on search query from URL parameters
    const searchQuery = searchParams.get("search") || "";
    const filteredUsers = users.filter(user => {
        if (!searchQuery.trim()) return true;
        
        const query = searchQuery.toLowerCase();
        return (
            user.name.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query) ||
            user.jobRole.toLowerCase().includes(query)
        );
    });

    // Count permissions for display purposes
    const countPermissions = (user: SellerTeamMember) => {
        return user.permissions?.length || 0;
    };

    // Open permissions dialog for editing
    const openPermissionsDialog = (user: SellerTeamMember) => {
        if (!hasPermission("Manage Users")) {
            toast.error("You don't have permission to edit user permissions");
            return;
        }
        
        const permissionsMap: Record<string, boolean> = {};
        PERMISSIONS.forEach(section => {
            section.options.forEach(option => {
                permissionsMap[option] = user.permissions.includes(option);
            });
        });
        setUserPermissions(permissionsMap);
        setEditingUser(user);
    };

    // Handle role change for editing user
    const handleEditUserRoleChange = (role: JobRole) => {
        if (!editingUser) return;
        
        const rolePermissions = getRolePermissions(role);
        const permissionsMap: Record<string, boolean> = {};
        
        // Set all permissions to false first
        PERMISSIONS.forEach(section => {
            section.options.forEach(option => {
                permissionsMap[option] = false;
            });
        });
        
        // Set role-based permissions to true
        rolePermissions.forEach(permission => {
            permissionsMap[permission] = true;
        });
        
        setUserPermissions(permissionsMap);
        setEditingUser(prev => prev ? { ...prev, jobRole: role } : null);
    };

    // Save updated permissions and role
    const savePermissions = () => {
        if (!editingUser) return;
        
        const permissionsList = Object.entries(userPermissions)
            .filter(([_, isSelected]) => isSelected)
            .map(([permission]) => permission);
            
        handleUpdateUser(editingUser.id, {
            jobRole: editingUser.jobRole,
            permissions: permissionsList
        });
    };

    // Check if current user can manage users
    const canManageUsers = canAccess('users');

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-xl lg:text-2xl font-semibold">
                        Manage Users
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Add and manage users for your account
                    </p>
                </div>
                {canManageUsers && (
                    <Button onClick={() => setShowAddUser(true)} disabled={loading}>
                        Add New User
                    </Button>
                )}
            </div>

            <div className="grid gap-6">
                {/* Users Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Users</CardTitle>
                        <CardDescription>
                            View and manage all users associated with your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading && users.length === 0 ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                            </div>
                        ) : error ? (
                            <div className="text-center py-8 text-red-500">
                                {error}
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Job Role</TableHead>
                                        <TableHead>Permissions</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Created On</TableHead>
                                        {canManageUsers && <TableHead>Actions</TableHead>}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredUsers.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={canManageUsers ? 7 : 6} className="text-center py-8 text-gray-500">
                                                {searchQuery ? "No matching users found" : "No sub-users found. Add your first team member to get started."}
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredUsers.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell className="font-medium">{user.name}</TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>
                                                    <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                                        {user.jobRole}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm"
                                                        onClick={() => openPermissionsDialog(user)}
                                                        disabled={!canManageUsers}
                                                    >
                                                        {countPermissions(user)} permissions
                                                    </Button>
                                                </TableCell>
                                                <TableCell>
                                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                                        user.status === "active" 
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-red-100 text-red-800"
                                                    }`}>
                                                        {user.status}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    {formatDate(user.createdAt)}
                                                </TableCell>
                                                {canManageUsers && (
                                                    <TableCell>
                                                        <div className="flex gap-2">
                                                            <Button 
                                                                variant="outline" 
                                                                size="sm"
                                                                onClick={() => handleResetPassword(user.id)}
                                                                disabled={loading}
                                                            >
                                                                Reset Password
                                                            </Button>
                                                            <Button 
                                                                variant="destructive" 
                                                                size="sm"
                                                                onClick={() => handleDeleteUser(user.id)}
                                                                disabled={loading}
                                                            >
                                                                Delete
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                )}
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>

                {/* Add User Modal */}
                <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" showCloseButton={false}>
                        <DialogHeader>
                            <div className="flex justify-between items-center">
                                <DialogTitle>New Employee Access</DialogTitle>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => setShowAddUser(false)}
                                    className="h-6 w-6"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                            <DialogDescription>
                                Enter the details to add a new team member
                            </DialogDescription>
                        </DialogHeader>
                        
                        <div className="grid grid-cols-2 gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name*</Label>
                                <Input 
                                    id="name"
                                    placeholder="Enter full name" 
                                    value={newUser.name}
                                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                    disabled={loading}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email*</Label>
                                <Input 
                                    id="email"
                                    type="email" 
                                    placeholder="Enter email address" 
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                    disabled={loading}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="contactNumber">Contact Number*</Label>
                                <Input 
                                    id="contactNumber"
                                    placeholder="Enter contact number" 
                                    value={newUser.contactNumber}
                                    onChange={(e) => setNewUser({ ...newUser, contactNumber: e.target.value })}
                                    disabled={loading}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password*</Label>
                                <Input 
                                    id="password"
                                    type="password" 
                                    placeholder="Enter password" 
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="jobRole">Job Role*</Label>
                                <Select
                                    value={newUser.jobRole}
                                    onValueChange={handleJobRoleChange}
                                    disabled={loading}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select job role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {getAvailableJobRoles().map((role) => (
                                            <SelectItem key={role} value={role}>
                                                {role}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-gray-500">
                                    Selecting a job role will automatically assign appropriate permissions
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4 mt-2">
                            <div className="bg-gray-50 rounded-md p-4">
                                <h3 className="text-lg font-semibold text-center mb-2">
                                    Permissions
                                    <span className="text-sm font-normal text-gray-500 ml-2">( Customize permissions as needed )</span>
                                </h3>
                                
                                <div className="space-y-4 mt-4">
                                    {PERMISSIONS.map((section) => (
                                        <div key={section.category} className="border rounded-md p-2">
                                            <div className="flex items-center gap-2 mb-2">
                                                {section.icon === "dashboard" && <div className="text-blue-500">📊</div>}
                                                {section.icon === "order" && <div className="text-blue-500">📦</div>}
                                                {section.icon === "ndr" && <div className="text-blue-500">🔄</div>}
                                                {section.icon === "billing" && <div className="text-blue-500">💰</div>}
                                                {section.icon === "cod" && <div className="text-blue-500">💵</div>}
                                                {section.icon === "warehouse" && <div className="text-blue-500">🏭</div>}
                                                {section.icon === "settings" && <div className="text-blue-500">⚙️</div>}
                                                <span className="font-medium">{section.category}</span>
                                            </div>
                                            
                                            <div className="grid grid-cols-3 gap-2 pl-6">
                                                {section.options.map((option) => (
                                                    <div key={option} className="flex items-center space-x-2">
                                                        <Checkbox 
                                                            id={option}
                                                            checked={newUser.permissions[option] || false}
                                                            onCheckedChange={(checked) => 
                                                                handlePermissionChange(option, checked === true)
                                                            }
                                                        />
                                                        <Label 
                                                            htmlFor={option}
                                                            className="text-sm font-normal cursor-pointer"
                                                        >
                                                            {option}
                                                        </Label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="flex justify-end gap-4 mt-4">
                                <Button 
                                    onClick={handleAddUser}
                                    disabled={loading}
                                    className="bg-purple-500 hover:bg-purple-600"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Adding...
                                        </>
                                    ) : "Add User"}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Edit Permissions Modal */}
                <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" showCloseButton={false}>
                        <DialogHeader>
                            <div className="flex justify-between items-center">
                                <DialogTitle>Edit User Permissions</DialogTitle>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => setEditingUser(null)}
                                    className="h-6 w-6"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                            <DialogDescription>
                                {editingUser && `Manage role and permissions for ${editingUser.name}`}
                            </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="editJobRole">Job Role</Label>
                                <Select
                                    value={editingUser?.jobRole || ""}
                                    onValueChange={handleEditUserRoleChange}
                                    disabled={loading}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select job role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {getAvailableJobRoles().map((role) => (
                                            <SelectItem key={role} value={role}>
                                                {role}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-gray-500">
                                    Changing the job role will reset permissions to role defaults
                                </p>
                            </div>
                        </div>
                        
                        <div className="space-y-4 mt-2">
                            <div className="bg-gray-50 rounded-md p-4">
                                <h3 className="text-lg font-semibold text-center mb-2">
                                    Permissions
                                </h3>
                                
                                <div className="space-y-4 mt-4">
                                    {PERMISSIONS.map((section) => (
                                        <div key={section.category} className="border rounded-md p-2">
                                            <div className="flex items-center gap-2 mb-2">
                                                {section.icon === "dashboard" && <div className="text-blue-500">📊</div>}
                                                {section.icon === "order" && <div className="text-blue-500">📦</div>}
                                                {section.icon === "ndr" && <div className="text-blue-500">🔄</div>}
                                                {section.icon === "billing" && <div className="text-blue-500">💰</div>}
                                                {section.icon === "cod" && <div className="text-blue-500">💵</div>}
                                                {section.icon === "warehouse" && <div className="text-blue-500">🏭</div>}
                                                {section.icon === "settings" && <div className="text-blue-500">⚙️</div>}
                                                <span className="font-medium">{section.category}</span>
                                            </div>
                                            
                                            <div className="grid grid-cols-3 gap-2 pl-6">
                                                {section.options.map((option) => (
                                                    <div key={option} className="flex items-center space-x-2">
                                                        <Checkbox 
                                                            id={`edit-${option}`}
                                                            checked={userPermissions[option] || false}
                                                            onCheckedChange={(checked) => 
                                                                setUserPermissions(prev => ({
                                                                    ...prev,
                                                                    [option]: checked === true
                                                                }))
                                                            }
                                                        />
                                                        <Label 
                                                            htmlFor={`edit-${option}`}
                                                            className="text-sm font-normal cursor-pointer"
                                                        >
                                                            {option}
                                                        </Label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="flex justify-end gap-4 mt-4">
                                <Button 
                                    onClick={savePermissions}
                                    disabled={loading}
                                    className="bg-purple-500 hover:bg-purple-600"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : "Save Changes"}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default ManageUsersPage; 