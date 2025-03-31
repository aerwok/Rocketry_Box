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
import { ArrowUpDown, Filter, Search } from "lucide-react";
import { useState } from "react";
import BulkDisputeUploadModal from "@/components/seller/disputes/bulk-dispute-upload-modal";
import { Link } from "react-router-dom";

interface DisputeData {
    awbNumber: string;
    disputeDate: string;
    orderId: string;
    given: string;
    applied: string;
    revised: string;
    accepted: string;
    difference: string;
    status: "Active" | "Inactive";
}

const allData: DisputeData[] = [
    {
        awbNumber: "fffff",
        disputeDate: "11/11/11",
        orderId: "12345",
        given: "xyz",
        applied: "null",
        revised: "null",
        accepted: "null",
        difference: "xyz",
        status: "Active"
    },
    {
        awbNumber: "yyhhh",
        disputeDate: "11/11/11",
        orderId: "45679",
        given: "xyz",
        applied: "null",
        revised: "null",
        accepted: "null",
        difference: "xyz",
        status: "Active"
    },
    {
        awbNumber: "hvhvh",
        disputeDate: "11/11/11",
        orderId: "89646",
        given: "xyz",
        applied: "null",
        revised: "null",
        accepted: "null",
        difference: "xyz",
        status: "Active"
    },
    {
        awbNumber: "hvhjv",
        disputeDate: "11/11/11",
        orderId: "78996",
        given: "xyz",
        applied: "null",
        revised: "null",
        accepted: "null",
        difference: "xyz",
        status: "Inactive"
    },
    {
        awbNumber: "hvhv",
        disputeDate: "11/11/11",
        orderId: "78877",
        given: "xyz",
        applied: "null",
        revised: "null",
        accepted: "null",
        difference: "xyz",
        status: "Active"
    },
    {
        awbNumber: "hvjvj",
        disputeDate: "11/11/11",
        orderId: "23446",
        given: "xyz",
        applied: "null",
        revised: "null",
        accepted: "null",
        difference: "xyz",
        status: "Active"
    },
    {
        awbNumber: "hjvjvjv",
        disputeDate: "11/11/11",
        orderId: "67889",
        given: "xyz",
        applied: "null",
        revised: "null",
        accepted: "null",
        difference: "xyz",
        status: "Inactive"
    },
    {
        awbNumber: "jvjvjv",
        disputeDate: "11/11/11",
        orderId: "89976",
        given: "xyz",
        applied: "null",
        revised: "null",
        accepted: "null",
        difference: "xyz",
        status: "Active"
    },
    {
        awbNumber: "jvjvkvk",
        disputeDate: "11/11/11",
        orderId: "13353",
        given: "xyz",
        applied: "null",
        revised: "null",
        accepted: "null",
        difference: "xyz",
        status: "Active"
    },
    {
        awbNumber: "jkbkbkb",
        disputeDate: "11/11/11",
        orderId: "67890",
        given: "xyz",
        applied: "null",
        revised: "null",
        accepted: "null",
        difference: "xyz",
        status: "Inactive"
    },
    {
        awbNumber: "knkbk",
        disputeDate: "11/12/12",
        orderId: "67899",
        given: "xyz",
        applied: "null",
        revised: "null",
        accepted: "null",
        difference: "xyz",
        status: "Active"
    }
];

const actionRequiredData = allData.filter(item => item.status === "Active");
const actionRequestedData = allData.filter(item => item.status === "Inactive");

const openDisputeData: DisputeData[] = [
    {
        awbNumber: "OD12345",
        disputeDate: "21/03/24",
        orderId: "ORD789",
        given: "2.5kg",
        applied: "3.2kg",
        revised: "2.8kg",
        accepted: "pending",
        difference: "0.7kg",
        status: "Active"
    },
    {
        awbNumber: "OD67890",
        disputeDate: "20/03/24",
        orderId: "ORD456",
        given: "1.8kg",
        applied: "2.5kg",
        revised: "2.0kg",
        accepted: "pending",
        difference: "0.7kg",
        status: "Active"
    }
];

const closedDisputeData: DisputeData[] = [
    {
        awbNumber: "CD98765",
        disputeDate: "15/03/24",
        orderId: "ORD123",
        given: "3.0kg",
        applied: "4.2kg",
        revised: "3.5kg",
        accepted: "rejected",
        difference: "1.2kg",
        status: "Inactive"
    },
    {
        awbNumber: "CD43210",
        disputeDate: "14/03/24",
        orderId: "ORD987",
        given: "5.0kg",
        applied: "6.1kg",
        revised: "5.5kg",
        accepted: "rejected",
        difference: "1.1kg",
        status: "Inactive"
    }
];

const closedResolvedData: DisputeData[] = [
    {
        awbNumber: "CR11111",
        disputeDate: "10/03/24",
        orderId: "ORD111",
        given: "2.0kg",
        applied: "2.8kg",
        revised: "2.4kg",
        accepted: "accepted",
        difference: "0.8kg",
        status: "Inactive"
    },
    {
        awbNumber: "CR22222",
        disputeDate: "09/03/24",
        orderId: "ORD222",
        given: "4.2kg",
        applied: "5.0kg",
        revised: "4.5kg",
        accepted: "accepted",
        difference: "0.8kg",
        status: "Inactive"
    }
];

const DisputeTable = ({ data }: { data: DisputeData[] }) => {

    const [sortConfig, setSortConfig] = useState<{
        key: keyof DisputeData;
        direction: 'asc' | 'desc';
    } | null>(null);

    const sortedData = [...data].sort((a, b) => {
        if (!sortConfig) return 0;

        const { key, direction } = sortConfig;
        if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
        if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
        return 0;
    });

    const handleSort = (key: keyof DisputeData) => {
        setSortConfig(current => ({
            key,
            direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc',
        }));
    };

    return (
        <Table>
            <TableHeader className="bg-[#F4F2FF] h-12">
                <TableRow className="hover:bg-[#F4F2FF]">
                    <TableHead onClick={() => handleSort('awbNumber')} className="cursor-pointer text-black min-w-[120px] whitespace-nowrap">
                        AWB Number <ArrowUpDown className="inline h-4 w-4 ml-1" />
                    </TableHead>
                    <TableHead onClick={() => handleSort('disputeDate')} className="cursor-pointer text-black min-w-[120px] whitespace-nowrap">
                        Dispute Date <ArrowUpDown className="inline h-4 w-4 ml-1" />
                    </TableHead>
                    <TableHead onClick={() => handleSort('orderId')} className="cursor-pointer text-black min-w-[120px] whitespace-nowrap">
                        Order ID <ArrowUpDown className="inline h-4 w-4 ml-1" />
                    </TableHead>
                    <TableHead onClick={() => handleSort('given')} className="cursor-pointer text-black min-w-[100px] whitespace-nowrap">
                        Given <ArrowUpDown className="inline h-4 w-4 ml-1" />
                    </TableHead>
                    <TableHead onClick={() => handleSort('applied')} className="cursor-pointer text-black min-w-[100px] whitespace-nowrap">
                        Applied <ArrowUpDown className="inline h-4 w-4 ml-1" />
                    </TableHead>
                    <TableHead onClick={() => handleSort('revised')} className="cursor-pointer text-black min-w-[100px] whitespace-nowrap">
                        Revised <ArrowUpDown className="inline h-4 w-4 ml-1" />
                    </TableHead>
                    <TableHead onClick={() => handleSort('accepted')} className="cursor-pointer text-black min-w-[120px] whitespace-nowrap">
                        Accepted <ArrowUpDown className="inline h-4 w-4 ml-1" />
                    </TableHead>
                    <TableHead onClick={() => handleSort('difference')} className="cursor-pointer text-black min-w-[120px] whitespace-nowrap">
                        Difference <ArrowUpDown className="inline h-4 w-4 ml-1" />
                    </TableHead>
                    <TableHead onClick={() => handleSort('status')} className="cursor-pointer text-black min-w-[120px] whitespace-nowrap">
                        Status <ArrowUpDown className="inline h-4 w-4 ml-1" />
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {sortedData.map((row, index) => (
                    <TableRow key={index} className="h-12">
                        <TableCell className="whitespace-nowrap">
                            <Link
                                to={`/seller/dashboard/disputes/${row.awbNumber}`}
                                className="text-violet-600 hover:underline"
                            >
                                {row.awbNumber}
                            </Link>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                            {row.disputeDate}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                            <Link
                                to={`/seller/dashboard/disputes/${row.orderId}`}
                                className="text-violet-600 hover:underline"
                            >
                                {row.orderId}
                            </Link>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                            {row.given}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                            {row.applied}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                            {row.revised}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                            {row.accepted}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                            {row.difference}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                            <span className={cn(
                                "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                                row.status === 'Active'
                                    ? "bg-green-100 text-green-800"
                                    : "bg-neutral-100 text-neutral-800"
                            )}>
                                <div className={cn(
                                    "size-1.5 mr-1 rounded-full",
                                    row.status === 'Active'
                                        ? "bg-green-500"
                                        : "bg-neutral-500"
                                )} />
                                {row.status}
                            </span>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

const SellerDisputePage = () => {

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);

    return (
        <div className="space-y-8 overflow-hidden">
            <h1 className="text-xl lg:text-2xl font-semibold">
                Disputes
            </h1>

            <Tabs defaultValue="all" className="w-full">
                <div className="w-[calc(100vw-5rem)] lg:w-full -mr-4 lg:mr-0">
                    <div className="w-full overflow-x-auto scrollbar-hide">
                        <TabsList className="w-max min-w-full p-0 h-12 z-0 bg-white rounded-none relative">
                            <div className="absolute bottom-0 w-full h-px -z-10 bg-violet-200"></div>
                            <TabsTrigger
                                value="all"
                                className="flex-1 h-full data-[state=active]:bg-white rounded-none border-b-2 border-transparent data-[state=active]:border-black whitespace-nowrap px-4"
                            >
                                All
                            </TabsTrigger>
                            <TabsTrigger
                                value="action-required"
                                className="flex-1 h-full data-[state=active]:bg-white rounded-none border-b-2 border-transparent data-[state=active]:border-black whitespace-nowrap px-4"
                            >
                                Action Required
                            </TabsTrigger>
                            <TabsTrigger
                                value="action-requested"
                                className="flex-1 h-full data-[state=active]:bg-white rounded-none border-b-2 border-transparent data-[state=active]:border-black whitespace-nowrap px-4"
                            >
                                Action Requested
                            </TabsTrigger>
                            <TabsTrigger
                                value="open-dispute"
                                className="flex-1 h-full data-[state=active]:bg-white rounded-none border-b-2 border-transparent data-[state=active]:border-black whitespace-nowrap px-4"
                            >
                                Open Dispute
                            </TabsTrigger>
                            <TabsTrigger
                                value="closed-dispute"
                                className="flex-1 h-full data-[state=active]:bg-white rounded-none border-b-2 border-transparent data-[state=active]:border-black whitespace-nowrap px-4"
                            >
                                Closed Dispute
                            </TabsTrigger>
                            <TabsTrigger
                                value="closed-resolved"
                                className="flex-1 h-full data-[state=active]:bg-white rounded-none border-b-2 border-transparent data-[state=active]:border-black whitespace-nowrap px-4"
                            >
                                Closed Resolved
                            </TabsTrigger>
                        </TabsList>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 py-4 w-full">
                    <div className="flex items-center gap-2 w-full">
                        <div className="relative flex-1 px-px">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                            <Input
                                placeholder="Search Users by Name, Email or Date"
                                className="pl-9 w-full bg-[#F8F7FF]"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="purple"
                            className="text-xs md:text-sm"
                            onClick={() => setIsUploadModalOpen(true)}
                        >
                            UPLOAD DISPUTE
                        </Button>
                    </div>
                </div>

                <div className="w-[calc(100vw-4rem)] lg:w-full -mr-4 lg:mr-0">
                    <div className="w-full overflow-x-auto">
                        <TabsContent value="all" className="mt-2 min-w-full">
                            <DisputeTable data={allData} />
                        </TabsContent>

                        <TabsContent value="action-required" className="mt-2 min-w-full">
                            <DisputeTable data={actionRequiredData} />
                        </TabsContent>

                        <TabsContent value="action-requested" className="mt-2 min-w-full">
                            <DisputeTable data={actionRequestedData} />
                        </TabsContent>

                        <TabsContent value="open-dispute" className="mt-2 min-w-full">
                            <DisputeTable data={openDisputeData} />
                        </TabsContent>

                        <TabsContent value="closed-dispute" className="mt-2 min-w-full">
                            <DisputeTable data={closedDisputeData} />
                        </TabsContent>

                        <TabsContent value="closed-resolved" className="mt-2 min-w-full">
                            <DisputeTable data={closedResolvedData} />
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

export default SellerDisputePage; 