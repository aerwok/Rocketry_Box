import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { useState } from "react";

const USER_ROLES = [
    { value: "admin", label: "Administrator" },
    { value: "manager", label: "Manager" },
    { value: "operator", label: "Operator" },
    { value: "viewer", label: "Viewer" },
];

const MOCK_USERS = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "admin", status: "active" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "manager", status: "active" },
    { id: 3, name: "Mike Johnson", email: "mike@example.com", role: "operator", status: "inactive" },
    { id: 4, name: "Sarah Wilson", email: "sarah@example.com", role: "viewer", status: "active" },
];

const ManageUsersPage = () => {
    const [showAddUser, setShowAddUser] = useState(false);

    const handleAddUser = () => {
        toast.success("User added successfully");
        setShowAddUser(false);
    };

    const handleResetPassword = (userId: number) => {
        toast.success("Password reset email sent");
    };

    const handleDeleteUser = (userId: number) => {
        toast.success("User deleted successfully");
    };

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
                <Button onClick={() => setShowAddUser(true)}>
                    Add New User
                </Button>
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
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {MOCK_USERS.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <Select defaultValue={user.role}>
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {USER_ROLES.map((role) => (
                                                        <SelectItem key={role.value} value={role.value}>
                                                            {role.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
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
                                            <div className="flex gap-2">
                                                <Button 
                                                    variant="outline" 
                                                    size="sm"
                                                    onClick={() => handleResetPassword(user.id)}
                                                >
                                                    Reset Password
                                                </Button>
                                                <Button 
                                                    variant="destructive" 
                                                    size="sm"
                                                    onClick={() => handleDeleteUser(user.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Add User Modal */}
                {showAddUser && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Add New User</CardTitle>
                            <CardDescription>
                                Fill in the details to add a new user
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Full Name</Label>
                                    <Input placeholder="Enter full name" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input type="email" placeholder="Enter email address" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Role</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {USER_ROLES.map((role) => (
                                                <SelectItem key={role.value} value={role.value}>
                                                    {role.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="flex justify-end gap-4">
                                <Button variant="outline" onClick={() => setShowAddUser(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleAddUser}>
                                    Add User
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default ManageUsersPage; 