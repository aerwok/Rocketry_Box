import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ArrowUpDown, Filter, Info, Search, UploadCloud } from "lucide-react";
import { useState } from "react";
import BulkDisputeUploadModal from "@/components/seller/disputes/bulk-dispute-upload-modal";
import { Link } from "react-router-dom";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface WeightDisputeData {
    awbNumber: string;
    disputeDate: string;
    orderId: string;
    givenWeight: string;
    appliedWeight: string;
    revisedWeight: string;
    status: "Pending" | "Accepted" | "Rejected";
    remarks: string;
}

const disputeData: WeightDisputeData[] = [
    {
        awbNumber: "WD12345",
        disputeDate: "21/03/24",
        orderId: "ORD789",
        givenWeight: "2.5kg",
        appliedWeight: "3.2kg",
        revisedWeight: "2.8kg",
        status: "Pending",
        remarks: "Weight dispute raised for incorrect weight measurement"
    },
    {
        awbNumber: "WD67890",
        disputeDate: "20/03/24",
        orderId: "ORD456",
        givenWeight: "1.8kg",
        appliedWeight: "2.5kg",
        revisedWeight: "2.0kg",
        status: "Pending",
        remarks: "Charged for higher weight than actual"
    },
    {
        awbNumber: "WD24680",
        disputeDate: "19/03/24",
        orderId: "ORD246",
        givenWeight: "3.0kg",
        appliedWeight: "4.2kg",
        revisedWeight: "3.8kg",
        status: "Accepted",
        remarks: "Revised weight accepted"
    },
    {
        awbNumber: "WD13579",
        disputeDate: "18/03/24",
        orderId: "ORD135",
        givenWeight: "5.0kg",
        appliedWeight: "6.1kg",
        revisedWeight: "5.0kg",
        status: "Rejected",
        remarks: "Weight dispute rejected due to lack of evidence"
    }
];

const pendingDisputeData = disputeData.filter(item => item.status === "Pending");
const acceptedDisputeData = disputeData.filter(item => item.status === "Accepted");
const rejectedDisputeData = disputeData.filter(item => item.status === "Rejected");

interface DisputeTableProps {
    data: WeightDisputeData[];
}

const DisputeTable = ({ data }: DisputeTableProps) => {
    return (
        <div className="rounded-md border overflow-hidden w-full">
            <Table>
                <TableHeader className="bg-muted/30">
                    <TableRow>
                        <TableHead className="w-[15%] whitespace-nowrap">
                            <div className="flex items-center gap-1">
                                AWB Number
                                <Button variant="ghost" size="icon" className="h-5 w-5">
                                    <ArrowUpDown className="h-3 w-3" />
                                </Button>
                            </div>
                        </TableHead>
                        <TableHead className="w-[12%] whitespace-nowrap">Order ID</TableHead>
                        <TableHead className="w-[10%] whitespace-nowrap">Dispute Date</TableHead>
                        <TableHead className="w-[10%] whitespace-nowrap">Given Weight</TableHead>
                        <TableHead className="w-[10%] whitespace-nowrap">Applied Weight</TableHead>
                        <TableHead className="w-[10%] whitespace-nowrap">Revised Weight</TableHead>
                        <TableHead className="w-[10%] whitespace-nowrap">Status</TableHead>
                        <TableHead className="w-[18%] whitespace-nowrap">Remarks</TableHead>
                        <TableHead className="w-[5%] whitespace-nowrap text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={9} className="h-32 text-center">
                                No disputes found
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((item) => (
                            <TableRow key={item.awbNumber}>
                                <TableCell className="font-medium">
                                    {item.awbNumber}
                                </TableCell>
                                <TableCell>
                                    <Link
                                        to={`/seller/dashboard/orders/${item.orderId}`}
                                        className="text-purple-600 hover:underline"
                                    >
                                        {item.orderId}
                                    </Link>
                                </TableCell>
                                <TableCell>{item.disputeDate}</TableCell>
                                <TableCell>{item.givenWeight}</TableCell>
                                <TableCell>{item.appliedWeight}</TableCell>
                                <TableCell>{item.revisedWeight}</TableCell>
                                <TableCell>
                                    <span
                                        className={cn(
                                            "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                                            {
                                                "bg-yellow-100 text-yellow-800": item.status === "Pending",
                                                "bg-green-100 text-green-800": item.status === "Accepted",
                                                "bg-red-100 text-red-800": item.status === "Rejected",
                                            }
                                        )}
                                    >
                                        {item.status}
                                    </span>
                                </TableCell>
                                <TableCell className="text-sm text-gray-600 truncate max-w-[200px]">
                                    {item.remarks}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Link
                                        to={`/seller/dashboard/disputes/${item.awbNumber}`}
                                        className="text-purple-600 hover:underline"
                                    >
                                        View
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

const SellerWeightDisputePage = () => {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);

    return (
        <div className="space-y-8 overflow-hidden">
            <h1 className="text-xl lg:text-2xl font-semibold">
                Weight Disputes
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-medium">Weight Dispute Guide</CardTitle>
                        <CardDescription>How to raise weight disputes</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 text-sm">
                            <p>Weight disputes can be raised for orders where you believe the charged weight is higher than the actual weight.</p>
                            <ol className="list-decimal pl-4 space-y-1">
                                <li>Download the sample template</li>
                                <li>Fill in the required details</li>
                                <li>Upload the file using the "Upload Dispute" button</li>
                            </ol>
                            <p className="text-xs text-muted-foreground mt-2">
                                Disputes must be raised within 7 days of shipment delivery
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-medium">Pending Disputes</CardTitle>
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100">
                                <span className="text-sm font-medium text-yellow-800">{pendingDisputeData.length}</span>
                            </div>
                        </div>
                        <CardDescription>Awaiting review by the team</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {pendingDisputeData.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No pending disputes</p>
                            ) : (
                                pendingDisputeData.slice(0, 2).map((item) => (
                                    <div key={item.awbNumber} className="border-b pb-2 last:border-b-0 last:pb-0">
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium text-sm">{item.awbNumber}</span>
                                            <span className="text-xs">{item.disputeDate}</span>
                                        </div>
                                        <div className="flex justify-between text-xs mt-1">
                                            <span className="text-muted-foreground">Dispute: {item.givenWeight} vs {item.appliedWeight}</span>
                                            <Link to={`/seller/dashboard/disputes/${item.awbNumber}`} className="text-purple-600">View</Link>
                                        </div>
                                    </div>
                                ))
                            )}
                            {pendingDisputeData.length > 2 && (
                                <div className="text-center pt-1">
                                    <Button variant="link" size="sm" className="text-xs text-purple-600 p-0 h-auto">
                                        View all {pendingDisputeData.length} pending disputes
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-medium flex items-center gap-2">
                            Volumetric Weight Calculator
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Info className="h-4 w-4 text-muted-foreground" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="max-w-xs">
                                            Volumetric weight = (L × W × H) / 5000
                                            <br />
                                            Higher of actual vs volumetric weight is charged.
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </CardTitle>
                        <CardDescription>Calculate chargeable weight</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-3 gap-2 mb-4">
                            <div>
                                <label className="text-xs font-medium mb-1 block">Length (cm)</label>
                                <Input type="number" placeholder="L" className="h-8" />
                            </div>
                            <div>
                                <label className="text-xs font-medium mb-1 block">Width (cm)</label>
                                <Input type="number" placeholder="W" className="h-8" />
                            </div>
                            <div>
                                <label className="text-xs font-medium mb-1 block">Height (cm)</label>
                                <Input type="number" placeholder="H" className="h-8" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mb-4">
                            <div>
                                <label className="text-xs font-medium mb-1 block">Actual Weight (kg)</label>
                                <Input type="number" placeholder="Weight" className="h-8" />
                            </div>
                            <div className="flex items-end">
                                <Button variant="outline" className="h-8 w-full">Calculate</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="all" className="w-full">
                <div className="w-full lg:w-full">
                    <div className="w-full overflow-x-auto scrollbar-hide">
                        <TabsList className="w-max min-w-full p-0 h-12 z-0 bg-white rounded-none relative">
                            <div className="absolute bottom-0 w-full h-px -z-10 bg-violet-200"></div>
                            <TabsTrigger
                                value="all"
                                className="flex-1 h-full data-[state=active]:bg-white rounded-none border-b-2 border-transparent data-[state=active]:border-black whitespace-nowrap px-4"
                            >
                                All Disputes
                            </TabsTrigger>
                            <TabsTrigger
                                value="pending"
                                className="flex-1 h-full data-[state=active]:bg-white rounded-none border-b-2 border-transparent data-[state=active]:border-black whitespace-nowrap px-4"
                            >
                                Pending
                            </TabsTrigger>
                            <TabsTrigger
                                value="accepted"
                                className="flex-1 h-full data-[state=active]:bg-white rounded-none border-b-2 border-transparent data-[state=active]:border-black whitespace-nowrap px-4"
                            >
                                Accepted
                            </TabsTrigger>
                            <TabsTrigger
                                value="rejected"
                                className="flex-1 h-full data-[state=active]:bg-white rounded-none border-b-2 border-transparent data-[state=active]:border-black whitespace-nowrap px-4"
                            >
                                Rejected
                            </TabsTrigger>
                        </TabsList>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 py-4 w-full">
                    <div className="flex items-center gap-2 w-full">
                        <div className="relative flex-1 px-px">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                            <Input
                                placeholder="Search by AWB Number or Order ID"
                                className="pl-9 w-full bg-[#F8F7FF]"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" size="icon" className="shrink-0">
                            <Filter className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="purple"
                            className="text-xs md:text-sm flex items-center gap-2"
                            onClick={() => setIsUploadModalOpen(true)}
                        >
                            <UploadCloud className="h-4 w-4" />
                            UPLOAD DISPUTE
                        </Button>
                    </div>
                </div>

                <div className="w-full">
                    <div className="w-full overflow-x-auto">
                        <TabsContent value="all" className="mt-2 min-w-full">
                            <DisputeTable data={disputeData} />
                        </TabsContent>

                        <TabsContent value="pending" className="mt-2 min-w-full">
                            <DisputeTable data={pendingDisputeData} />
                        </TabsContent>

                        <TabsContent value="accepted" className="mt-2 min-w-full">
                            <DisputeTable data={acceptedDisputeData} />
                        </TabsContent>

                        <TabsContent value="rejected" className="mt-2 min-w-full">
                            <DisputeTable data={rejectedDisputeData} />
                        </TabsContent>
                    </div>
                </div>
            </Tabs>

            <BulkDisputeUploadModal
                open={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
            />
        </div>
    );
};

export default SellerWeightDisputePage; 