import { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { EyeIcon, DownloadIcon } from "lucide-react";

// Empty sellers array
const sellers: { id: string, name: string }[] = [];

// Sample transaction data
interface Transaction {
    id: string;
    type: string;
    date: string;
    sellerId: string;
    sellerName: string;
    amount: string;
    paymentType: string;
    status: string;
    excelFile?: string;
}

const InitiateRemittance = () => {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [formData, setFormData] = useState({
        transactionType: '',
        transactionId: '',
        sellerId: '',
        sellerName: '',
        amount: '',
        paymentType: '',
        paymentStatus: '',
        excelFile: null as File | null
    });

    // Load saved transactions from localStorage on component mount
    useEffect(() => {
        const savedTransactions = localStorage.getItem('remittanceTransactions');
        if (savedTransactions) {
            setTransactions(JSON.parse(savedTransactions));
        }
    }, []);

    const handleInputChange = (field: string, value: string) => {
        if (field === 'sellerId') {
            // Auto-fill seller name when seller ID is selected
            const seller = sellers.find(s => s.id === value);
            setFormData(prev => ({
                ...prev,
                [field]: value,
                sellerName: seller?.name || ''
            }));
        } else if (field === 'paymentType') {
            // Set payment status based on payment type
            setFormData(prev => ({
                ...prev,
                [field]: value,
                paymentStatus: value === 'wallet' ? 'paid' : prev.paymentStatus
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setFormData(prev => ({
            ...prev,
            excelFile: file
        }));
    };

    const generateTransactionId = () => {
        return `TRX${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate form
        if (!formData.transactionType || !formData.sellerId || !formData.amount || !formData.paymentType) {
            toast.error("Please fill all required fields");
            return;
        }

        // Create new transaction
        const newTransaction: Transaction = {
            id: formData.transactionId || generateTransactionId(),
            type: formData.transactionType,
            date: new Date().toISOString().slice(0, 10),
            sellerId: formData.sellerId,
            sellerName: formData.sellerName,
            amount: formData.amount.startsWith('₹') ? formData.amount : `₹${formData.amount}`,
            paymentType: formData.paymentType,
            status: formData.paymentStatus || (formData.paymentType === 'wallet' ? 'paid' : 'due'),
            excelFile: formData.excelFile ? formData.excelFile.name : undefined
        };

        // Add to transactions list
        const updatedTransactions = [...transactions, newTransaction];
        setTransactions(updatedTransactions);

        // Save to localStorage (simulating database storage)
        localStorage.setItem('remittanceTransactions', JSON.stringify(updatedTransactions));

        // Save to seller COD page (simulating database relation)
        const sellerTransactions = JSON.parse(localStorage.getItem(`seller_${formData.sellerId}_transactions`) || '[]');
        localStorage.setItem(`seller_${formData.sellerId}_transactions`, JSON.stringify([...sellerTransactions, newTransaction]));

        // Success message
        toast.success(`Transaction initiated successfully. ID: ${newTransaction.id}`);

        // Reset form
        setFormData({
            transactionType: '',
            transactionId: '',
            sellerId: '',
            sellerName: '',
            amount: '',
            paymentType: '',
            paymentStatus: '',
            excelFile: null
        });
    };

    const handleViewTransaction = (transaction: Transaction) => {
        // In a real application, this would navigate to transaction details
        toast.info(`Viewing transaction ${transaction.id}`);
    };

    const handleDownloadExcel = (transaction: Transaction) => {
        // In a real application, this would download the Excel file
        toast.info(`Downloading Excel for transaction ${transaction.id}`);
    };

    return (
        <div className="p-4">
            <h1 className="text-xl font-medium mb-6">Billing & Notes Management</h1>

            <div className="space-y-6">
                <div className="overflow-x-auto">
                    <Table className="border">
                        <TableHeader>
                            <TableRow className="bg-white">
                                <TableHead className="text-black font-medium">ID</TableHead>
                                <TableHead className="text-black font-medium">Type</TableHead>
                                <TableHead className="text-black font-medium">Date</TableHead>
                                <TableHead className="text-black font-medium">Seller</TableHead>
                                <TableHead className="text-black font-medium">Amount (₹)</TableHead>
                                <TableHead className="text-black font-medium">Payment/Reason</TableHead>
                                <TableHead className="text-black font-medium">Status</TableHead>
                                <TableHead className="text-black font-medium">Excel File</TableHead>
                                <TableHead className="text-black font-medium">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={9} className="text-center py-4 text-gray-500">
                                        No transactions found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                transactions.map((transaction) => (
                                    <TableRow key={transaction.id}>
                                        <TableCell>{transaction.id}</TableCell>
                                        <TableCell>{transaction.type}</TableCell>
                                        <TableCell>{transaction.date}</TableCell>
                                        <TableCell>{transaction.sellerName}</TableCell>
                                        <TableCell>{transaction.amount}</TableCell>
                                        <TableCell>{transaction.paymentType}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded text-xs ${
                                                transaction.status === 'paid' 
                                                    ? 'bg-green-100 text-green-700' 
                                                    : 'bg-orange-100 text-orange-700'
                                            }`}>
                                                {transaction.status}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            {transaction.excelFile ? (
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm"
                                                    onClick={() => handleDownloadExcel(transaction)}
                                                >
                                                    <DownloadIcon className="h-4 w-4" />
                                                </Button>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Button 
                                                variant="ghost" 
                                                size="sm"
                                                onClick={() => handleViewTransaction(transaction)}
                                            >
                                                <EyeIcon className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className="bg-white rounded-sm border p-4">
                    <h2 className="text-base font-medium mb-4">Add New Transaction</h2>
                    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
                        <div className="space-y-3">
                            <div>
                                <Label htmlFor="transactionType" className="text-sm font-normal">Transaction Type:</Label>
                                <Select
                                    value={formData.transactionType}
                                    onValueChange={(value) => handleInputChange('transactionType', value)}
                                >
                                    <SelectTrigger className="bg-white h-9">
                                        <SelectValue placeholder="Select transaction type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="invoice">Invoice</SelectItem>
                                        <SelectItem value="debit_note">Debit Note</SelectItem>
                                        <SelectItem value="credit_note">Credit Note</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="transactionId" className="text-sm font-normal">Transaction ID:</Label>
                                <Input
                                    id="transactionId"
                                    value={formData.transactionId}
                                    onChange={(e) => handleInputChange('transactionId', e.target.value)}
                                    placeholder="BRV/23/03/497"
                                    className="bg-white h-9"
                                />
                            </div>

                            <div>
                                <Label htmlFor="sellerId" className="text-sm font-normal">Seller ID:</Label>
                                <Select
                                    value={formData.sellerId}
                                    onValueChange={(value) => handleInputChange('sellerId', value)}
                                >
                                    <SelectTrigger className="bg-white h-9">
                                        <SelectValue placeholder="Select seller ID" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {sellers.map((seller) => (
                                            <SelectItem key={seller.id} value={seller.id}>
                                                {seller.id}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="sellerName" className="text-sm font-normal">Seller Name:</Label>
                                <Input
                                    id="sellerName"
                                    value={formData.sellerName}
                                    readOnly
                                    className="bg-gray-50 h-9"
                                />
                            </div>

                            <div>
                                <Label htmlFor="amount" className="text-sm font-normal">Amount (₹):</Label>
                                <Input
                                    id="amount"
                                    type="text"
                                    value={formData.amount}
                                    onChange={(e) => handleInputChange('amount', e.target.value)}
                                    placeholder="Enter Amount"
                                    className="bg-white h-9"
                                />
                            </div>

                            <div>
                                <Label htmlFor="paymentType" className="text-sm font-normal">Payment Type:</Label>
                                <Select
                                    value={formData.paymentType}
                                    onValueChange={(value) => handleInputChange('paymentType', value)}
                                >
                                    <SelectTrigger className="bg-white h-9">
                                        <SelectValue placeholder="Select payment type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="credit">Credit</SelectItem>
                                        <SelectItem value="wallet">Wallet</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="paymentStatus" className="text-sm font-normal">Payment Status:</Label>
                                <Select
                                    value={formData.paymentStatus}
                                    onValueChange={(value) => handleInputChange('paymentStatus', value)}
                                    disabled={formData.paymentType === 'wallet'}
                                >
                                    <SelectTrigger className={`h-9 ${formData.paymentType === 'wallet' ? 'bg-gray-50' : 'bg-white'}`}>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {formData.paymentType === 'credit' ? (
                                            <>
                                                <SelectItem value="due">Due</SelectItem>
                                                <SelectItem value="paid">Paid</SelectItem>
                                            </>
                                        ) : (
                                            <SelectItem value="paid">Paid</SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="excelFile" className="text-sm font-normal">Upload Excel:</Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        id="excelFile"
                                        type="file"
                                        accept=".xlsx,.xls"
                                        onChange={handleFileChange}
                                        className="bg-white h-9 cursor-pointer"
                                    />
                                    <span className="text-sm text-gray-500">
                                        {formData.excelFile ? formData.excelFile.name : 'No file chosen'}
                                    </span>
                                </div>
                            </div>

                            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white h-9">
                                Initiate
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default InitiateRemittance; 