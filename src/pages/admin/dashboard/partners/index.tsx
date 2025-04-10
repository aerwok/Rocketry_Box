import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ArrowUpDown, Search, Tag, Trash, Edit, Download, Settings, RefreshCw, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ServiceFactory } from "@/services/service-factory";
import { Partner, ApiStatus } from "@/services/partners.service";

type SortField = "name" | "apiStatus" | "performanceScore" | "lastUpdated" | "shipmentCount";
type SortOrder = "asc" | "desc";

const getStatusStyle = (status: ApiStatus) => {
    return {
        active: "bg-green-50 text-green-700",
        inactive: "bg-neutral-100 text-neutral-700",
        maintenance: "bg-yellow-50 text-yellow-700",
    }[status];
};

const getStatusColor = (status: ApiStatus) => {
    return {
        active: "bg-green-500",
        inactive: "bg-neutral-400",
        maintenance: "bg-yellow-500",
    }[status];
};

const AdminPartnersPage = () => {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [sortField, setSortField] = useState<SortField>("name");
    const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
    const [selectedPartners, setSelectedPartners] = useState<string[]>([]);
    const [showAddPartnerModal, setShowAddPartnerModal] = useState(false);
    const [showPartnerDetailsModal, setShowPartnerDetailsModal] = useState(false);
    const [currentPartner, setCurrentPartner] = useState<Partner | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [filteredStatus, setFilteredStatus] = useState<ApiStatus | "all">("all");
    const [partners, setPartners] = useState<Partner[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch partners on component mount and when filter changes
    useEffect(() => {
        const fetchPartners = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const filters = filteredStatus !== "all" ? { status: filteredStatus } : undefined;
                const response = await ServiceFactory.partners.getPartners(filters);
                setPartners(response.data);
            } catch (err) {
                console.error("Error fetching partners:", err);
                setError("Failed to load partners. Please try again.");
                toast.error("Failed to load partners");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPartners();
    }, [filteredStatus]);

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortOrder("asc");
        }
    };

    const handleSelectPartner = (partnerId: string) => {
        setSelectedPartners(prev => {
            if (prev.includes(partnerId)) {
                return prev.filter(id => id !== partnerId);
            }
            return [...prev, partnerId];
        });
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedPartners(filteredData.map(partner => partner.id));
        } else {
            setSelectedPartners([]);
        }
    };

    const handleDelete = async () => {
        if (selectedPartners.length === 0) {
            toast.error("Please select partners to delete");
            return;
        }

        try {
            await ServiceFactory.partners.deleteManyPartners(selectedPartners);
            toast.success(`${selectedPartners.length} partners deleted successfully`);
            
            // Refresh the partners list
            const filters = filteredStatus !== "all" ? { status: filteredStatus } : undefined;
            const response = await ServiceFactory.partners.getPartners(filters);
            setPartners(response.data);
            
            setSelectedPartners([]);
        } catch (error) {
            console.error("Error deleting partners:", error);
            toast.error("Failed to delete partners");
        }
    };

    const handleAddTag = () => {
        if (selectedPartners.length === 0) {
            toast.error("Please select partners to add tag");
            return;
        }
        toast.success("Tags added successfully");
        setSelectedPartners([]);
    };

    const handleRefreshAPI = async () => {
        if (selectedPartners.length === 0) {
            toast.error("Please select partners to refresh API");
            return;
        }

        try {
            const response = await ServiceFactory.partners.refreshPartnerAPIs(selectedPartners);
            const { successful, failed } = response.data;
            
            if (successful.length > 0) {
                toast.success(`${successful.length} APIs refreshed successfully`);
            }
            
            if (failed.length > 0) {
                toast.error(`${failed.length} APIs failed to refresh`);
            }
            
            // Refresh the partners list
            const filters = filteredStatus !== "all" ? { status: filteredStatus } : undefined;
            const refreshedPartnersResponse = await ServiceFactory.partners.getPartners(filters);
            setPartners(refreshedPartnersResponse.data);
            
            setSelectedPartners([]);
        } catch (error) {
            console.error("Error refreshing partner APIs:", error);
            toast.error("Failed to refresh partner APIs");
        }
    };
    
    const handleViewPartner = async (partner: Partner) => {
        try {
            // Get fresh data for the partner
            const response = await ServiceFactory.partners.getPartnerById(partner.id);
            setCurrentPartner(response.data);
            setIsEditing(false);
            setShowPartnerDetailsModal(true);
        } catch (error) {
            console.error(`Error fetching partner details for ${partner.id}:`, error);
            toast.error("Failed to load partner details");
        }
    };
    
    const handleEditPartner = async (partner: Partner) => {
        try {
            // Get fresh data for the partner
            const response = await ServiceFactory.partners.getPartnerById(partner.id);
            setCurrentPartner(response.data);
            setIsEditing(true);
            setShowPartnerDetailsModal(true);
        } catch (error) {
            console.error(`Error fetching partner details for ${partner.id}:`, error);
            toast.error("Failed to load partner details");
        }
    };
    
    const handleAddPartner = () => {
        setCurrentPartner(null);
        setShowAddPartnerModal(true);
    };
    
    const handleSavePartner = async () => {
        try {
            if (isEditing && currentPartner) {
                await ServiceFactory.partners.updatePartner(currentPartner.id, currentPartner);
                toast.success(`Partner ${currentPartner.name} updated successfully`);
            } else if (currentPartner) {
                await ServiceFactory.partners.createPartner(currentPartner);
                toast.success("New partner added successfully");
            }
            
            // Refresh the partners list
            const filters = filteredStatus !== "all" ? { status: filteredStatus } : undefined;
            const response = await ServiceFactory.partners.getPartners(filters);
            setPartners(response.data);
            
            setShowPartnerDetailsModal(false);
            setShowAddPartnerModal(false);
        } catch (error) {
            console.error("Error saving partner:", error);
            toast.error("Failed to save partner");
        }
    };
    
    const handleFilterByStatus = (status: ApiStatus | "all") => {
        setFilteredStatus(status);
    };

    // Filter partners based on search query
    const filteredData = partners.filter(partner => {
        const matchesSearch = 
            partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            partner.supportEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
            partner.id.toLowerCase().includes(searchQuery.toLowerCase());
            
        return matchesSearch;
    });

    // Sort filtered partners
    const sortedData = [...filteredData].sort((a, b) => {
        const aValue = typeof a[sortField] === 'string' 
            ? String(a[sortField]).toLowerCase() 
            : Number(a[sortField]);
        const bValue = typeof b[sortField] === 'string'
            ? String(b[sortField]).toLowerCase()
            : Number(b[sortField]);
            
        if (typeof aValue === 'number' && typeof bValue === 'number') {
            return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
        }
        
        return sortOrder === "asc"
            ? String(aValue).localeCompare(String(bValue))
            : String(bValue).localeCompare(String(aValue));
    });

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl lg:text-2xl font-semibold">
                        Shipping Partners Management
                    </h1>
                    <p className="text-base lg:text-lg text-muted-foreground mt-1">
                        Manage courier partners, API integrations, and service rates
                    </p>
                </div>
                <Button variant="primary" onClick={handleAddPartner}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Partner
                </Button>
            </div>

            {/* Search and Filter Section */}
            <div className="flex flex-wrap items-start lg:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="relative flex-1 max-w-lg">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                            placeholder="Search partners"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 bg-gray-100/50"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Button 
                            variant={filteredStatus === "all" ? "default" : "outline"} 
                            size="sm"
                            onClick={() => handleFilterByStatus("all")}
                        >
                            All
                        </Button>
                        <Button 
                            variant={filteredStatus === "active" ? "default" : "outline"} 
                            size="sm"
                            onClick={() => handleFilterByStatus("active")}
                            className={filteredStatus === "active" ? "bg-green-500 hover:bg-green-600" : ""}
                        >
                            Active
                        </Button>
                        <Button 
                            variant={filteredStatus === "inactive" ? "default" : "outline"} 
                            size="sm"
                            onClick={() => handleFilterByStatus("inactive")}
                            className={filteredStatus === "inactive" ? "bg-neutral-500 hover:bg-neutral-600" : ""}
                        >
                            Inactive
                        </Button>
                        <Button 
                            variant={filteredStatus === "maintenance" ? "default" : "outline"} 
                            size="sm"
                            onClick={() => handleFilterByStatus("maintenance")}
                            className={filteredStatus === "maintenance" ? "bg-yellow-500 hover:bg-yellow-600" : ""}
                        >
                            Maintenance
                        </Button>
                    </div>
                    <Button variant="outline" className="whitespace-nowrap">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                </div>
                {/* Action Buttons Section */}
                {selectedPartners.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                        <Button variant="outline">
                            {selectedPartners.length} selected
                        </Button>
                        <Button
                            variant="outline"
                            className="gap-2 bg-red-500 hover:bg-red-600 text-white hover:text-white"
                            onClick={handleDelete}
                        >
                            <Trash className="size-4" />
                            Delete
                        </Button>
                        <Button
                            variant="outline"
                            className="gap-2 bg-green-500 hover:bg-green-600 text-white hover:text-white"
                            onClick={handleAddTag}
                        >
                            <Tag className="size-4" />
                            Add Tag
                        </Button>
                        <Button
                            variant="primary"
                            className="gap-2"
                            onClick={handleRefreshAPI}
                        >
                            <RefreshCw className="size-4" />
                            Refresh API
                        </Button>
                    </div>
                )}
            </div>

            {/* Partners Table */}
            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader className="bg-[#F8F0FF]">
                        <TableRow>
                            <TableHead className="w-[50px]">
                                <input
                                    type="checkbox"
                                    className="rounded border-gray-300"
                                    checked={selectedPartners.length === sortedData.length && sortedData.length > 0}
                                    onChange={handleSelectAll}
                                />
                            </TableHead>
                            <TableHead>
                                <div
                                    className="flex items-center gap-1 cursor-pointer"
                                    onClick={() => handleSort("name")}
                                >
                                    Partner Name
                                    <ArrowUpDown className="size-3" />
                                </div>
                            </TableHead>
                            <TableHead>
                                <div
                                    className="flex items-center gap-1 cursor-pointer"
                                    onClick={() => handleSort("apiStatus")}
                                >
                                    API Status
                                    <ArrowUpDown className="size-3" />
                                </div>
                            </TableHead>
                            <TableHead>
                                <div
                                    className="flex items-center gap-1 cursor-pointer"
                                    onClick={() => handleSort("performanceScore")}
                                >
                                    Performance
                                    <ArrowUpDown className="size-3" />
                                </div>
                            </TableHead>
                            <TableHead>
                                <div
                                    className="flex items-center gap-1 cursor-pointer"
                                    onClick={() => handleSort("shipmentCount")}
                                >
                                    Shipments
                                    <ArrowUpDown className="size-3" />
                                </div>
                            </TableHead>
                            <TableHead>
                                Service Types
                            </TableHead>
                            <TableHead>
                                <div
                                    className="flex items-center gap-1 cursor-pointer"
                                    onClick={() => handleSort("lastUpdated")}
                                >
                                    Last Updated
                                    <ArrowUpDown className="size-3" />
                                </div>
                            </TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                                    Loading partners...
                                </TableCell>
                            </TableRow>
                        ) : error ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-8 text-red-500">
                                    {error}
                                </TableCell>
                            </TableRow>
                        ) : sortedData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                                    {searchQuery || filteredStatus !== "all" 
                                        ? "No shipping partners found matching your criteria"
                                        : "No shipping partners available. Click 'Add Partner' to add one."}
                                </TableCell>
                            </TableRow>
                        ) : (
                            sortedData.map((partner) => (
                                <TableRow key={partner.id} className="hover:bg-neutral-50">
                                    <TableCell>
                                        <input
                                            type="checkbox"
                                            className="rounded border-gray-300"
                                            checked={selectedPartners.includes(partner.id)}
                                            onChange={() => handleSelectPartner(partner.id)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">{partner.name}</div>
                                        <div className="text-sm text-gray-500">{partner.supportEmail}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className={cn(
                                                "w-2 h-2 rounded-full",
                                                getStatusColor(partner.apiStatus)
                                            )} />
                                            <span className={cn(
                                                "px-2 py-1 rounded-md text-sm",
                                                getStatusStyle(partner.apiStatus)
                                            )}>
                                                {partner.apiStatus}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className={cn(
                                                "w-16 h-1.5 rounded-full bg-gray-200"
                                            )}>
                                                <div
                                                    className={cn(
                                                        "h-full rounded-full",
                                                        parseInt(partner.performanceScore) >= 95 ? "bg-green-500" :
                                                        parseInt(partner.performanceScore) >= 85 ? "bg-yellow-500" :
                                                        "bg-red-500"
                                                    )}
                                                    style={{ width: partner.performanceScore }}
                                                />
                                            </div>
                                            <span>{partner.performanceScore}</span>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            Success: {partner.deliverySuccess}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {partner.shipmentCount.toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {partner.serviceTypes.map(type => (
                                                <Badge key={type} variant="outline" className="text-xs">
                                                    {type}
                                                </Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>{partner.lastUpdated}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleViewPartner(partner)}
                                            >
                                                View
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEditPartner(partner)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setCurrentPartner(partner);
                                                    toast.info("API settings modal would open here");
                                                }}
                                            >
                                                <Settings className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Partner Details Modal */}
            <Dialog open={showPartnerDetailsModal} onOpenChange={setShowPartnerDetailsModal}>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {isEditing ? "Edit Partner: " : "Partner Details: "}
                            {currentPartner?.name}
                        </DialogTitle>
                    </DialogHeader>
                    
                    {currentPartner && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Partner Information</h3>
                                        <div className="mt-2 space-y-2">
                                            <div>
                                                <span className="text-sm font-medium">Name:</span>
                                                <span className="ml-2">{currentPartner.name}</span>
                                            </div>
                                            <div>
                                                <span className="text-sm font-medium">Status:</span>
                                                <span className={cn(
                                                    "ml-2 px-2 py-1 rounded-md text-xs",
                                                    getStatusStyle(currentPartner.apiStatus)
                                                )}>
                                                    {currentPartner.apiStatus}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-sm font-medium">Support Contact:</span>
                                                <span className="ml-2">{currentPartner.supportContact}</span>
                                            </div>
                                            <div>
                                                <span className="text-sm font-medium">Support Email:</span>
                                                <span className="ml-2">{currentPartner.supportEmail}</span>
                                            </div>
                                            <div>
                                                <span className="text-sm font-medium">Integration Date:</span>
                                                <span className="ml-2">{currentPartner.integrationDate}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">API Details</h3>
                                        <div className="mt-2 space-y-2">
                                            <div>
                                                <span className="text-sm font-medium">API Endpoint:</span>
                                                <span className="ml-2">{currentPartner.apiEndpoint}</span>
                                            </div>
                                            <div>
                                                <span className="text-sm font-medium">API Key:</span>
                                                <span className="ml-2">
                                                    {currentPartner.apiKey ? "••••••••••••" : "Not set"}
                                                    <Button variant="outline" size="sm" className="ml-2">
                                                        Reveal
                                                    </Button>
                                                    <Button variant="outline" size="sm" className="ml-2">
                                                        Regenerate
                                                    </Button>
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-sm font-medium">Tracking URL:</span>
                                                <span className="ml-2">{currentPartner.trackingUrl}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Service Details</h3>
                                        <div className="mt-2 space-y-2">
                                            <div>
                                                <span className="text-sm font-medium">Service Types:</span>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {currentPartner.serviceTypes.map(type => (
                                                        <Badge key={type} variant="outline" className="text-xs">
                                                            {type}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-sm font-medium">Service Areas:</span>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {currentPartner.serviceAreas.map(area => (
                                                        <Badge key={area} variant="outline" className="text-xs">
                                                            {area}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-sm font-medium">Weight Limits:</span>
                                                <span className="ml-2">
                                                    {currentPartner.weightLimits.min} kg - {currentPartner.weightLimits.max} kg
                                                </span>
                                            </div>
                                            {currentPartner.dimensionLimits && (
                                                <div>
                                                    <span className="text-sm font-medium">Dimension Limits:</span>
                                                    <div className="ml-2">
                                                        <div>Max Length: {currentPartner.dimensionLimits.maxLength} cm</div>
                                                        <div>Max Width: {currentPartner.dimensionLimits.maxWidth} cm</div>
                                                        <div>Max Height: {currentPartner.dimensionLimits.maxHeight} cm</div>
                                                        <div>Max Sum (L+W+H): {currentPartner.dimensionLimits.maxSum} cm</div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Rate Information</h3>
                                        <div className="mt-2 space-y-2">
                                            <div>
                                                <span className="text-sm font-medium">Base Rate:</span>
                                                <span className="ml-2">₹{currentPartner.rates.baseRate}</span>
                                            </div>
                                            <div>
                                                <span className="text-sm font-medium">Weight Rate:</span>
                                                <span className="ml-2">₹{currentPartner.rates.weightRate}/kg</span>
                                            </div>
                                            <div>
                                                <span className="text-sm font-medium">Dimensional Factor:</span>
                                                <span className="ml-2">{currentPartner.rates.dimensionalFactor}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Performance Metrics</h3>
                                        <div className="mt-2 space-y-2">
                                            <div>
                                                <span className="text-sm font-medium">Shipment Count:</span>
                                                <span className="ml-2">{currentPartner.shipmentCount.toLocaleString()}</span>
                                            </div>
                                            <div>
                                                <span className="text-sm font-medium">Performance Score:</span>
                                                <span className="ml-2">{currentPartner.performanceScore}</span>
                                            </div>
                                            <div>
                                                <span className="text-sm font-medium">Delivery Success Rate:</span>
                                                <span className="ml-2">{currentPartner.deliverySuccess}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {currentPartner.notes && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                                    <p className="mt-1">{currentPartner.notes}</p>
                                </div>
                            )}
                            
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setShowPartnerDetailsModal(false)}>
                                    {isEditing ? "Cancel" : "Close"}
                                </Button>
                                {isEditing && (
                                    <Button variant="primary" onClick={handleSavePartner}>
                                        Save Changes
                                    </Button>
                                )}
                            </DialogFooter>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Add Partner Modal */}
            <Dialog open={showAddPartnerModal} onOpenChange={setShowAddPartnerModal}>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>Add New Shipping Partner</DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                        <p className="text-sm text-gray-500">
                            This would typically include a form to add a new shipping partner. 
                            For brevity, we've omitted the full form implementation.
                        </p>
                        
                        <div className="bg-yellow-50 p-4 rounded-md">
                            <p className="text-sm text-yellow-700">
                                In a real implementation, this would include fields for:
                            </p>
                            <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside">
                                <li>Partner name and contact information</li>
                                <li>API integration details</li>
                                <li>Service coverage and types</li>
                                <li>Rate card configuration</li>
                                <li>Weight and dimension limits</li>
                                <li>Tracking URL format</li>
                            </ul>
                        </div>
                    </div>
                    
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowAddPartnerModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleSavePartner}>
                            Add Partner
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminPartnersPage; 