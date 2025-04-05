import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ArrowUpDown, Search, Tag, Trash, Edit, Download, Settings, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type ApiStatus = "active" | "inactive";
type SortField = "name" | "apiStatus" | "performanceScore" | "lastUpdated";
type SortOrder = "asc" | "desc";

interface Partner {
    id: string;
    name: string;
    apiStatus: ApiStatus;
    performanceScore: string;
    lastUpdated: string;
}

const PARTNERS_DATA: Partner[] = [];

const getStatusStyle = (status: ApiStatus) => {
    return {
        active: "bg-green-50 text-green-700",
        inactive: "bg-neutral-100 text-neutral-700",
    }[status];
};

const AdminPartnersPage = () => {

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [sortField, setSortField] = useState<SortField>("name");
    const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
    const [selectedPartners, setSelectedPartners] = useState<string[]>([]);

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
            setSelectedPartners(sortedData.map(partner => partner.id));
        } else {
            setSelectedPartners([]);
        }
    };

    const handleDelete = () => {
        if (selectedPartners.length === 0) {
            toast.error("Please select partners to delete");
            return;
        }
        toast.success(`${selectedPartners.length} partners deleted successfully`);
        setSelectedPartners([]);
    };

    const handleAddTag = () => {
        if (selectedPartners.length === 0) {
            toast.error("Please select partners to add tag");
            return;
        }
        toast.success("Tags added successfully");
        setSelectedPartners([]);
    };

    const handleRefreshAPI = () => {
        if (selectedPartners.length === 0) {
            toast.error("Please select partners to refresh API");
            return;
        }
        toast.success("API refreshed successfully");
        setSelectedPartners([]);
    };

    const sortedData = [...PARTNERS_DATA].sort((a, b) => {
        const aValue = String(a[sortField] ?? "");
        const bValue = String(b[sortField] ?? "");
        return sortOrder === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
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
                        Manage user accounts and permissions
                    </p>
                </div>
                {/* <Button variant="primary">
                    Create partner
                </Button> */}
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
                                    Performance Score
                                    <ArrowUpDown className="size-3" />
                                </div>
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
                        {sortedData.map((partner) => (
                            <TableRow key={partner.id} className="hover:bg-neutral-50">
                                <TableCell>
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300"
                                        checked={selectedPartners.includes(partner.id)}
                                        onChange={() => handleSelectPartner(partner.id)}
                                    />
                                </TableCell>
                                <TableCell>{partner.name}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <div className={cn(
                                            "w-2 h-2 rounded-full",
                                            partner.apiStatus === "active" ? "bg-green-500" : "bg-neutral-400"
                                        )} />
                                        <span className={cn(
                                            "px-2 py-1 rounded-md text-sm",
                                            getStatusStyle(partner.apiStatus)
                                        )}>
                                            {partner.apiStatus}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>{partner.performanceScore}</TableCell>
                                <TableCell>{partner.lastUpdated}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 w-8 p-0"
                                        >
                                            <Edit className="size-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 w-8 p-0"
                                        >
                                            <Settings className="size-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default AdminPartnersPage; 