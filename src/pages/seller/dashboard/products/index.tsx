import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, Plus, Edit2, Trash2, Package } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Product {
    id: string;
    name: string;
    sku: string;
    category: string;
    price: number;
    stock: number;
    status: "Active" | "Inactive";
    lastUpdated: string;
}

const mockProducts: Product[] = [
    {
        id: "1",
        name: "Premium Laptop",
        sku: "LAP001",
        category: "Electronics",
        price: 49999,
        stock: 50,
        status: "Active",
        lastUpdated: "2024-03-25"
    },
    {
        id: "2",
        name: "Wireless Mouse",
        sku: "MOU001",
        category: "Accessories",
        price: 1799,
        stock: 100,
        status: "Active",
        lastUpdated: "2024-03-25"
    },
    {
        id: "3",
        name: "Mechanical Keyboard",
        sku: "KEY001",
        category: "Accessories",
        price: 4999,
        stock: 30,
        status: "Inactive",
        lastUpdated: "2024-03-24"
    },
    {
        id: "4",
        name: "4K Monitor",
        sku: "MON001",
        category: "Electronics",
        price: 29999,
        stock: 20,
        status: "Active",
        lastUpdated: "2024-03-23"
    },
    {
        id: "5",
        name: "USB-C Hub",
        sku: "HUB001",
        category: "Accessories",
        price: 2499,
        stock: 75,
        status: "Active",
        lastUpdated: "2024-03-22"
    }
];

const SellerProductsPage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [sortConfig, setSortConfig] = useState<{
        key: keyof Product;
        direction: "asc" | "desc";
    } | null>(null);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleSort = (key: keyof Product) => {
        setSortConfig(current => ({
            key,
            direction: current?.key === key && current.direction === "asc" ? "desc" : "asc",
        }));
    };

    const handleEdit = (productId: string) => {
        console.log("Edit product:", productId);
        toast.info("Edit functionality coming soon!");
    };

    const handleDelete = (productId: string) => {
        console.log("Delete product:", productId);
        toast.info("Delete functionality coming soon!");
    };

    const filteredProducts = mockProducts.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (!sortConfig) return 0;
        const { key, direction } = sortConfig;
        if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
        if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
        return 0;
    });

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-xl lg:text-2xl font-semibold">
                    Products SKU
                </h1>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Package className="size-4" />
                    <span>Manage your product inventory</span>
                </div>
            </div>

            <div className="space-y-4">
                {/* Search and Actions */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-2 w-full lg:w-auto">
                        <div className="relative flex-1 lg:w-[300px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                            <Input
                                placeholder="Search products..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={handleSearch}
                            />
                        </div>
                    </div>
                    <Button className="w-full lg:w-auto">
                        <Plus className="size-4 mr-2" />
                        Add New Product
                    </Button>
                </div>

                {/* Products Table */}
                <div className="rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead
                                    className="cursor-pointer"
                                    onClick={() => handleSort("name")}
                                >
                                    Product Name
                                    {sortConfig?.key === "name" && (
                                        <span className="ml-1">
                                            {sortConfig.direction === "asc" ? "↑" : "↓"}
                                        </span>
                                    )}
                                </TableHead>
                                <TableHead
                                    className="cursor-pointer"
                                    onClick={() => handleSort("sku")}
                                >
                                    SKU
                                    {sortConfig?.key === "sku" && (
                                        <span className="ml-1">
                                            {sortConfig.direction === "asc" ? "↑" : "↓"}
                                        </span>
                                    )}
                                </TableHead>
                                <TableHead
                                    className="cursor-pointer"
                                    onClick={() => handleSort("category")}
                                >
                                    Category
                                    {sortConfig?.key === "category" && (
                                        <span className="ml-1">
                                            {sortConfig.direction === "asc" ? "↑" : "↓"}
                                        </span>
                                    )}
                                </TableHead>
                                <TableHead
                                    className="cursor-pointer"
                                    onClick={() => handleSort("price")}
                                >
                                    Price
                                    {sortConfig?.key === "price" && (
                                        <span className="ml-1">
                                            {sortConfig.direction === "asc" ? "↑" : "↓"}
                                        </span>
                                    )}
                                </TableHead>
                                <TableHead
                                    className="cursor-pointer"
                                    onClick={() => handleSort("stock")}
                                >
                                    Stock
                                    {sortConfig?.key === "stock" && (
                                        <span className="ml-1">
                                            {sortConfig.direction === "asc" ? "↑" : "↓"}
                                        </span>
                                    )}
                                </TableHead>
                                <TableHead
                                    className="cursor-pointer"
                                    onClick={() => handleSort("status")}
                                >
                                    Status
                                    {sortConfig?.key === "status" && (
                                        <span className="ml-1">
                                            {sortConfig.direction === "asc" ? "↑" : "↓"}
                                        </span>
                                    )}
                                </TableHead>
                                <TableHead
                                    className="cursor-pointer"
                                    onClick={() => handleSort("lastUpdated")}
                                >
                                    Last Updated
                                    {sortConfig?.key === "lastUpdated" && (
                                        <span className="ml-1">
                                            {sortConfig.direction === "asc" ? "↑" : "↓"}
                                        </span>
                                    )}
                                </TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedProducts.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                                        No products found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                sortedProducts.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell className="font-medium">{product.name}</TableCell>
                                        <TableCell>{product.sku}</TableCell>
                                        <TableCell>{product.category}</TableCell>
                                        <TableCell>₹{product.price.toLocaleString()}</TableCell>
                                        <TableCell>{product.stock}</TableCell>
                                        <TableCell>
                                            <span
                                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                    product.status === "Active"
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                }`}
                                            >
                                                {product.status}
                                            </span>
                                        </TableCell>
                                        <TableCell>{product.lastUpdated}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleEdit(product.id)}
                                                >
                                                    <Edit2 className="size-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(product.id)}
                                                >
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default SellerProductsPage; 