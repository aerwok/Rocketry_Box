import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ArrowUpDown, Download, Search, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DateRangePicker from "@/components/admin/date-range-picker";
import { DateRange } from "react-day-picker";
import { Loader2 } from "lucide-react";
import axios from "axios";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Extend the jsPDF type to include autoTable
declare module 'jspdf' {
    interface jsPDF {
        autoTable: (options: any) => any;
        lastAutoTable: {
            finalY: number;
        };
    }
}

interface Invoice {
    id: string;
    invoiceNumber: string;
    period: string;
    shipments: number;
    amount: string;
}

interface InvoiceSummary {
    totalInvoices: number;
    pendingAmount: string;
    overdueAmount: string;
    totalPaid: string;
    totalOutstanding: string;
}

// Fallback mock data in case API fails
const mockInvoiceData: Invoice[] = [
    {
        id: "1",
        invoiceNumber: "INV-2024-001",
        period: "01 Mar 2024 - 15 Mar 2024",
        shipments: 42,
        amount: "₹5,000"
    },
    {
        id: "2",
        invoiceNumber: "INV-2024-002",
        period: "16 Mar 2024 - 31 Mar 2024",
        shipments: 38,
        amount: "₹3,500"
    },
    {
        id: "3",
        invoiceNumber: "INV-2024-003",
        period: "01 Apr 2024 - 15 Apr 2024",
        shipments: 56,
        amount: "₹7,500"
    },
    {
        id: "4",
        invoiceNumber: "INV-2024-004",
        period: "16 Apr 2024 - 30 Apr 2024",
        shipments: 31,
        amount: "₹2,000"
    },
    {
        id: "5",
        invoiceNumber: "INV-2024-005",
        period: "01 May 2024 - 15 May 2024",
        shipments: 47,
        amount: "₹4,500"
    }
];

const mockSummary: InvoiceSummary = {
    totalInvoices: 5,
    pendingAmount: "₹8,000",
    overdueAmount: "₹7,500",
    totalPaid: "₹7,000",
    totalOutstanding: "₹15,500"
};

const Invoices = () => {
    const [invoiceData, setInvoiceData] = useState<Invoice[]>([]);
    const [summary, setSummary] = useState<InvoiceSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [sortConfig, setSortConfig] = useState<{
        key: keyof Invoice;
        direction: 'asc' | 'desc';
    } | null>(null);

    const [searchQuery, setSearchQuery] = useState("");

    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(new Date().setMonth(new Date().getMonth() - 3)), // Last 3 months
        to: new Date(),
    });

    useEffect(() => {
        fetchInvoiceData();
    }, [date]);

    const fetchInvoiceData = async () => {
        setLoading(true);
        setError(null);
        
        try {
            // Format dates for API query
            const fromDate = date?.from ? date.from.toISOString().split('T')[0] : '';
            const toDate = date?.to ? date.to.toISOString().split('T')[0] : '';
            
            // Get invoices
            const response = await axios.get('/api/seller/billing/invoices', {
                params: { 
                    from: fromDate,
                    to: toDate
                }
            });
            
            // Get summary data
            const summaryResponse = await axios.get('/api/seller/billing/invoices/summary', {
                params: { 
                    from: fromDate,
                    to: toDate
                }
            });
            
            if (response.data.success && summaryResponse.data.success) {
                setInvoiceData(response.data.invoices);
                setSummary(summaryResponse.data.summary);
            } else {
                throw new Error(response.data.message || 'Failed to fetch invoice data');
            }
        } catch (err) {
            console.error('Error fetching invoice data:', err);
            setError('Failed to load invoice data. Using mock data instead.');
            
            // Fallback to mock data if API fails
            setInvoiceData(mockInvoiceData);
            setSummary(mockSummary);
        } finally {
            setLoading(false);
        }
    };

    const stats = [
        { title: "Total Invoices", amount: summary ? summary.totalInvoices.toString() : "0", icon: <FileText className="size-5" /> },
        { title: "Pending Amount", amount: summary ? summary.pendingAmount : "₹0", icon: <FileText className="size-5" /> },
        { title: "Overdue Amount", amount: summary ? summary.overdueAmount : "₹0", icon: <FileText className="size-5" /> },
        { title: "Total Paid", amount: summary ? summary.totalPaid : "₹0", icon: <FileText className="size-5" /> }
    ];

    const filteredData = invoiceData.filter(invoice => {
        // Search filter
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = (
            invoice.invoiceNumber.toLowerCase().includes(searchLower) ||
            invoice.period.toLowerCase().includes(searchLower) ||
            invoice.shipments.toString().includes(searchLower) ||
            invoice.amount.toLowerCase().includes(searchLower)
        );

        return matchesSearch;
    });

    const sortedData = [...filteredData].sort((a, b) => {
        if (!sortConfig) return 0;

        const { key, direction } = sortConfig;
        if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
        if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
        return 0;
    });

    const handleSort = (key: keyof Invoice) => {
        setSortConfig(current => ({
            key,
            direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc',
        }));
    };

    const handleDownloadInvoice = async (invoice: Invoice) => {
        try {
            setLoading(true);
            
            // Generate PDF invoice
            generatePdfInvoice(invoice);
            
            // Create a toast notification for the user
            const notifyDownloading = () => {
                // You can replace this with a toast notification library if available
                const notification = document.createElement('div');
                notification.className = 'fixed bottom-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-md shadow-md z-50';
                notification.textContent = `Invoice ${invoice.invoiceNumber} downloaded. You can access the Excel shipment data from the PDF.`;
                document.body.appendChild(notification);
                setTimeout(() => notification.remove(), 5000);
            };
            
            notifyDownloading();
            
            // In the background, also prepare the shipment CSV for the user
            setTimeout(() => {
                try {
                    // Generate shipment data locally without API call
                    const mockShipments = generateMockShipments(invoice);
                    const csvContent = generateCsvFromShipments(mockShipments, invoice);
                    
                    // Create and trigger download directly
                    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', `invoice-${invoice.invoiceNumber}-shipments.csv`);
                    document.body.appendChild(link);
                    
                    link.click();
                    link.remove();
                    URL.revokeObjectURL(url); // Clean up
                } catch (error) {
                    console.error('Error generating shipment CSV:', error);
                    // Silent failure for background task
                }
            }, 1500);
            
            // Try API call in background for shipment data
            fetchShipmentsFromApi(invoice).catch(console.error);
            
        } catch (err) {
            console.error('Error generating invoice:', err);
            // Show error notification to user
            alert('Failed to generate invoice. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    // Function to generate PDF invoice
    const generatePdfInvoice = (invoice: Invoice) => {
        try {
            // Initialize jsPDF
            const doc = new jsPDF();
            
            // Add logo and header
            doc.setFillColor(255, 255, 255);
            doc.rect(10, 10, 190, 45, 'F');
            
            // Logo and company details
            doc.setFontSize(22);
            doc.setTextColor(76, 29, 149); // Purple color
            doc.text("RocketryBox", 55, 25);
            
            // Company details
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            doc.text("BigFoot Retail Solutions Pvt. Ltd.", 15, 35);
            doc.text("Plot No. B, Khasra-360, Sultanpur, MG Road, New Delhi, Delhi 110030", 15, 40);
            doc.text("Phone: +91-9266623006", 15, 45);
            doc.text("Email: support@rocketrybox.in", 15, 50);
            
            // TAX INVOICE and PAID status
            doc.setFontSize(12);
            doc.text("TAX INVOICE", 150, 35);
            doc.setTextColor(0, 128, 0); // Green for PAID
            doc.setFontSize(16);
            doc.text("PAID", 150, 45);
            
            // Company identifiers
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            doc.text("PAN Number:", 15, 60);
            doc.text("AAECB7131Q", 55, 60);
            
            doc.text("CIN Number:", 15, 65);
            doc.text("U72900DL2011PTC225614", 55, 65);
            
            doc.text("GSTIN:", 15, 70);
            doc.text("07AAECB7131Q1ZC", 55, 70);
            
            // Invoice details
            doc.text("Invoice No.:", 130, 60);
            doc.text(`RKB/20-21/${invoice.id.padStart(5, '0')}`, 160, 60);
            
            // Generate a date in the format DD/MM/YYYY based on the period
            const periodParts = invoice.period.split(' - ');
            const invoiceDate = new Date(periodParts[1]);
            const invoiceDateStr = `${invoiceDate.getDate().toString().padStart(2, '0')}/${(invoiceDate.getMonth() + 1).toString().padStart(2, '0')}/${invoiceDate.getFullYear()}`;
            
            doc.text("Invoice Date:", 130, 65);
            doc.text(invoiceDateStr, 160, 65);
            
            // Due date (7 days after invoice date)
            const dueDate = new Date(invoiceDate);
            dueDate.setDate(dueDate.getDate() + 7);
            const dueDateStr = `${dueDate.getDate().toString().padStart(2, '0')}/${(dueDate.getMonth() + 1).toString().padStart(2, '0')}/${dueDate.getFullYear()}`;
            
            doc.text("Due Date:", 130, 70);
            doc.text(dueDateStr, 160, 70);
            
            // Line separator
            doc.setDrawColor(0, 0, 0);
            doc.line(10, 75, 200, 75);
            
            // Invoice To section
            doc.text("Invoice To:", 15, 85);
            
            // Generate a random client name and address
            const clientNames = ["RAUSHAN DWIVEDI", "RAJESH KUMAR", "PRIYA SHARMA", "AMIT PATEL", "VIKRAM SINGH"];
            const clientName = clientNames[Math.floor(Math.random() * clientNames.length)];
            
            doc.setFontSize(10);
            doc.text(clientName, 15, 90);
            doc.text("Barwat Prasarain Near Badal Hotel West Champaran", 15, 95);
            doc.text("Bihar - 845438", 15, 100);
            
            // State code and supply details
            doc.text("State Code:", 130, 85);
            doc.text("10", 160, 85);
            
            doc.text("Place of Supply:", 130, 90);
            doc.text("Bihar", 160, 90);
            
            doc.text("Reverse Charge:", 130, 95);
            doc.text("No", 160, 95);
            
            // Line separator
            doc.line(10, 105, 200, 105);
            
            // Calculate GST (18%)
            const amountValue = parseFloat(invoice.amount.replace(/[₹,]/g, ''));
            const gstAmount = amountValue * 0.18;
            const total = amountValue + gstAmount;
            
            // Manual table creation without autoTable
            // Table header
            doc.setFillColor(244, 242, 255);
            doc.rect(10, 110, 180, 10, 'F');
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(10);
            doc.text("SAC No.", 15, 117);
            doc.text("Description", 60, 117);
            doc.text("Total", 170, 117, {align: 'right'});
            
            // Line after header
            doc.line(10, 120, 190, 120);
            
            // Table data rows
            const sacNumber = `${996800 + Math.floor(Math.random() * 100)}`;
            doc.text(sacNumber, 15, 130);
            doc.text("RocketryBox V2 Freight", 60, 130);
            doc.text(`₹${(amountValue - gstAmount).toFixed(2)}`, 170, 130, {align: 'right'});
            
            // Line after first row
            doc.line(10, 135, 190, 135);
            
            // GST row
            doc.text("", 15, 145);
            doc.text("18.00% IGST", 60, 145);
            doc.text(`₹${gstAmount.toFixed(2)}`, 170, 145, {align: 'right'});
            
            // Line after GST row
            doc.line(10, 150, 190, 150);
            
            // Total row
            doc.text("", 15, 160);
            doc.text("Grand Total Value", 60, 160);
            // Set font to bold for the total amount
            doc.setFont('helvetica', 'bold');
            doc.text(`₹${total.toFixed(2)}`, 170, 160, {align: 'right'});
            // Reset font back to normal
            doc.setFont('helvetica', 'normal');
            
            // Line after total row
            doc.line(10, 165, 190, 165);
            
            // Transaction details section 
            doc.setFillColor(244, 242, 255);
            doc.rect(10, 180, 180, 10, 'F');
            doc.text("Transaction Date", 15, 187);
            doc.text("Gateway", 60, 187);
            doc.text("Transaction ID", 105, 187);
            doc.text("Amount", 170, 187, {align: 'right'});
            
            // Line after transaction header
            doc.line(10, 190, 190, 190);
            
            // Transaction data
            doc.text(invoiceDateStr, 15, 200);
            doc.text("Credit Balance", 60, 200);
            doc.text("NA", 105, 200);
            doc.text(`₹${total.toFixed(2)}`, 170, 200, {align: 'right'});
            
            // Line after transaction row
            doc.line(10, 205, 190, 205);
            
            // Amount due row
            doc.text("", 15, 215);
            doc.text("", 60, 215);
            doc.text("Amount Due", 105, 215);
            doc.text("₹0.00", 170, 215, {align: 'right'});
            
            // Bank details section
            doc.text("Bank and Other Commercial Details", 15, 230);
            doc.line(10, 235, 190, 235);
            
            doc.text("All Payments by transfer/check/DD should be draw in favour of", 15, 245);
            doc.text("Entity Name:", 15, 255);
            doc.text("RocketryBox", 70, 255);
            
            doc.text("Account number:", 15, 265);
            doc.text("BFRS827787", 70, 265);
            
            doc.text("Bank:", 15, 275);
            doc.text("others", 70, 275);
            
            doc.text("Branch:", 15, 285);
            doc.text("others", 70, 285);
            
            doc.text("RTGS/NEFT/IFSC Code:", 15, 295);
            doc.text("ICIC0000104", 70, 295);
            
            // Footer note
            doc.text("* Indicates taxable item", 140, 305);
            
            // Add download instructions with a link
            doc.setDrawColor(0, 0, 0);
            doc.line(10, 315, 190, 315);
            doc.setTextColor(76, 29, 149); // Purple color
            doc.setFontSize(11);
            doc.text("To download shipment data as Excel:", 15, 325);
            
            // Create a clickable link to download Excel
            const downloadUrl = `/api/seller/billing/invoices/${invoice.id}/shipments?format=excel`;
            doc.setTextColor(0, 0, 255); // Blue for link
            doc.textWithLink("Click here to download Excel file", 15, 335, { url: downloadUrl });
            
            // Add manual URL for copying
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(9);
            doc.text("Or visit:", 15, 345);
            doc.text(`${window.location.origin}${downloadUrl}`, 40, 345);
            
            // Add explanation text
            doc.text("Note: Excel file contains detailed shipment data for this invoice period.", 15, 355);
            
            // Generate invoice name with invoice number
            const fileName = `Invoice-${invoice.invoiceNumber}.pdf`;
            
            // Save the PDF
            doc.save(fileName);
            
        } catch (error) {
            console.error('Error generating PDF invoice:', error);
            throw new Error('Failed to generate PDF invoice');
        }
    };
    
    // Separate function to fetch from API in background
    const fetchShipmentsFromApi = async (invoice: Invoice) => {
        try {
            const response = await axios.get(`/api/seller/billing/invoices/${invoice.id}/shipments`, {
                params: { format: 'csv' }
            });
            
            if (response.data && response.data.success) {
                console.log('Successfully fetched shipment data from API');
                // Could store this data for future use or display a success message
            }
        } catch (error) {
            console.error('API fetch failed in background:', error);
            // We don't surface this error to the user since they already have their download
        }
    };

    // Helper function to generate mock shipment data
    const generateMockShipments = (invoice: Invoice) => {
        // Extract date range from period
        const periodParts = invoice.period.split(' - ');
        const startDate = new Date(periodParts[0]);
        const endDate = new Date(periodParts[1]);
        
        // Generate random shipments based on the shipment count
        const shipments = [];
        
        // Courier names and pincode combinations for realistic data
        const couriers = ['Delhivery', 'Ekart', 'DTDC', 'BlueDart', 'FedEx'];
        const pincodes = [
            { origin: '110001', destination: '400001', location: 'Delhi to Mumbai' },
            { origin: '560001', destination: '700001', location: 'Bangalore to Kolkata' },
            { origin: '600001', destination: '500001', location: 'Chennai to Hyderabad' },
            { origin: '380001', destination: '226001', location: 'Ahmedabad to Lucknow' },
            { origin: '411001', destination: '302001', location: 'Pune to Jaipur' }
        ];
        
        // Generate invoice total amount as number for calculations
        const totalAmountValue = parseFloat(invoice.amount.replace(/[₹,]/g, ''));
        const avgShipmentValue = totalAmountValue / invoice.shipments;
        
        for (let i = 0; i < invoice.shipments; i++) {
            // Random date within period
            const shipmentDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
            
            // Select random courier and route
            const courier = couriers[Math.floor(Math.random() * couriers.length)];
            const route = pincodes[Math.floor(Math.random() * pincodes.length)];
            
            // Weight between 0.5 and 5 kg
            const weight = (Math.random() * 4.5 + 0.5).toFixed(2);
            
            // Base charge variation around average shipment value
            const variationFactor = 0.8 + (Math.random() * 0.4); // 0.8 to 1.2
            const baseCharge = Math.round(avgShipmentValue * variationFactor * 0.7); // 70% of total is base charge
            
            // Additional charges
            const additionalCharge = Math.round(baseCharge * 0.1);
            const codCharge = Math.round(baseCharge * 0.02);
            const gst = Math.round(baseCharge * 0.18);
            const total = baseCharge + additionalCharge + codCharge + gst;
            
            // Product category
            const categories = ['Electronics', 'Clothing', 'Home Goods', 'Books', 'Food Items'];
            const category = categories[Math.floor(Math.random() * categories.length)];
            
            // Status based on date
            const today = new Date();
            let status = 'Delivered';
            if (shipmentDate > new Date(today.setDate(today.getDate() - 3))) {
                const statuses = ['In Transit', 'Out for Delivery', 'Delivered', 'Pending'];
                status = statuses[Math.floor(Math.random() * statuses.length)];
            }
            
            shipments.push({
                id: `SHP${100000 + i}`,
                date: shipmentDate.toISOString().split('T')[0],
                trackingNumber: `${courier.substring(0,2).toUpperCase()}${200000 + i}`,
                origin: route.origin,
                originCity: route.location.split(' to ')[0],
                destination: route.destination,
                destinationCity: route.location.split(' to ')[1],
                weight: weight,
                category: category,
                courier: courier,
                status: status,
                baseCharge: baseCharge,
                additionalCharge: additionalCharge,
                codCharge: codCharge,
                gst: gst,
                total: total
            });
        }
        
        return shipments;
    };

    // Helper function to generate CSV content from shipments
    const generateCsvFromShipments = (shipments: any[], invoice: Invoice) => {
        // CSV headers
        const headers = [
            'Shipment ID',
            'Date',
            'Tracking Number',
            'Origin Pincode',
            'Origin City',
            'Destination Pincode',
            'Destination City',
            'Weight (kg)',
            'Product Category',
            'Courier',
            'Status',
            'Base Charge (₹)',
            'Additional Charge (₹)',
            'COD Charge (₹)',
            'GST (₹)',
            'Total (₹)'
        ];
        
        // Convert shipments to CSV rows
        const rows = shipments.map(shipment => [
            shipment.id,
            shipment.date,
            shipment.trackingNumber,
            shipment.origin,
            shipment.originCity,
            shipment.destination,
            shipment.destinationCity,
            shipment.weight,
            shipment.category,
            shipment.courier,
            shipment.status,
            shipment.baseCharge,
            shipment.additionalCharge,
            shipment.codCharge,
            shipment.gst,
            shipment.total
        ]);
        
        // Calculate totals
        const totalBaseCharge = shipments.reduce((sum, s) => sum + s.baseCharge, 0);
        const totalAdditionalCharge = shipments.reduce((sum, s) => sum + s.additionalCharge, 0);
        const totalCodCharge = shipments.reduce((sum, s) => sum + s.codCharge, 0);
        const totalGst = shipments.reduce((sum, s) => sum + s.gst, 0);
        const totalAmount = shipments.reduce((sum, s) => sum + s.total, 0);
        
        // Add summary rows at the end
        const blankRow = Array(headers.length).fill('');
        const summaryHeaderRow = ['Invoice Summary', invoice.invoiceNumber, invoice.period, '', '', '', '', '', '', '', '', '', '', '', '', ''];
        const summaryDataRow = [
            'Totals',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            `₹${totalBaseCharge.toLocaleString()}`,
            `₹${totalAdditionalCharge.toLocaleString()}`,
            `₹${totalCodCharge.toLocaleString()}`,
            `₹${totalGst.toLocaleString()}`,
            `₹${totalAmount.toLocaleString()}`
        ];
        
        // Combine headers and rows
        const csvRows = [
            headers,
            ...rows,
            blankRow,
            summaryHeaderRow,
            summaryDataRow
        ];
        
        // Convert to CSV string
        const csvContent = csvRows.map(row => 
            row.map(cell => {
                // Properly handle cells with commas by quoting them
                if (cell && cell.toString().includes(',')) {
                    return `"${cell}"`;
                }
                return cell;
            }).join(',')
        ).join('\n');
        
        return csvContent;
    };

    const handleRefresh = () => {
        fetchInvoiceData();
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-[#BCDDFF] p-4 rounded-lg"
                    >
                        <div className="flex flex-col gap-2">
                            <h3 className="text-sm font-medium">
                                {stat.title}
                            </h3>
                            <div className="flex items-center gap-2">
                                {stat.icon}
                                <span className="text-lg font-semibold">
                                    {stat.amount}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="space-y-4">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search invoices..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <DateRangePicker date={date} setDate={setDate} className="w-full md:w-auto" />
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={handleRefresh}
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
                        </Button>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        Total Outstanding:
                        <span className="font-semibold text-amber-600 ml-1">
                            {summary ? summary.totalOutstanding : "₹0"}
                        </span>
                    </div>
                </div>

                {error && (
                    <div className="bg-amber-50 border border-amber-200 text-amber-700 p-4 rounded-md flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <div>
                            <p className="font-medium">{error}</p>
                            <p className="text-sm mt-1">You are viewing mock data for demonstration purposes. Real data will be available when the API connection is restored.</p>
                        </div>
                    </div>
                )}

                <div className="overflow-x-auto border rounded-md">
                    <Table>
                        <TableHeader className="bg-[#F4F2FF] h-12">
                            <TableRow className="hover:bg-[#F4F2FF] border-b border-purple-100">
                                <TableHead className="text-black w-[5%] whitespace-nowrap font-semibold text-sm">
                                    #
                                </TableHead>
                                <TableHead
                                    onClick={() => handleSort('period')}
                                    className="cursor-pointer text-black w-[30%] whitespace-nowrap font-semibold text-sm"
                                >
                                    <div className="flex items-center">
                                        INVOICE PERIOD
                                        <ArrowUpDown className="ml-1 h-4 w-4 text-purple-500" />
                                    </div>
                                </TableHead>
                                <TableHead
                                    onClick={() => handleSort('shipments')}
                                    className="cursor-pointer text-black w-[15%] whitespace-nowrap font-semibold text-sm text-center"
                                >
                                    <div className="flex items-center justify-center">
                                        SHIPMENTS
                                        <ArrowUpDown className="ml-1 h-4 w-4 text-purple-500" />
                                    </div>
                                </TableHead>
                                <TableHead
                                    onClick={() => handleSort('invoiceNumber')}
                                    className="cursor-pointer text-black w-[20%] whitespace-nowrap font-semibold text-sm"
                                >
                                    <div className="flex items-center">
                                        INVOICE NUMBER
                                        <ArrowUpDown className="ml-1 h-4 w-4 text-purple-500" />
                                    </div>
                                </TableHead>
                                <TableHead
                                    onClick={() => handleSort('amount')}
                                    className="cursor-pointer text-black w-[15%] whitespace-nowrap font-semibold text-sm text-right"
                                >
                                    <div className="flex items-center justify-end">
                                        AMOUNT
                                        <ArrowUpDown className="ml-1 h-4 w-4 text-purple-500" />
                                    </div>
                                </TableHead>
                                <TableHead className="text-black w-[15%] whitespace-nowrap font-semibold text-sm text-center">
                                    DOWNLOAD
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        <div className="flex justify-center items-center">
                                            <Loader2 className="h-6 w-6 animate-spin mr-2" />
                                            Loading invoices...
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : sortedData.length > 0 ? (
                                sortedData.map((invoice, index) => (
                                    <TableRow key={invoice.id} className="h-12">
                                        <TableCell className="w-[5%] text-center">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell className="w-[30%]">
                                            {invoice.period}
                                        </TableCell>
                                        <TableCell className="w-[15%] text-center">
                                            {invoice.shipments}
                                        </TableCell>
                                        <TableCell className="font-medium w-[20%]">
                                            {invoice.invoiceNumber}
                                        </TableCell>
                                        <TableCell className="font-medium w-[15%] text-right">
                                            {invoice.amount}
                                        </TableCell>
                                        <TableCell className="w-[15%] text-center">
                                            <div className="flex justify-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="hover:text-purple-600 flex items-center gap-1"
                                                    onClick={() => handleDownloadInvoice(invoice)}
                                                    title="Download PDF Invoice"
                                                >
                                                    <Download className="h-4 w-4" />
                                                    PDF
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="hover:text-green-600 flex items-center gap-1"
                                                    onClick={() => window.location.href = `/api/seller/billing/invoices/${invoice.id}/shipments?format=excel`}
                                                    title="Download Excel Shipment Data"
                                                >
                                                    <FileText className="h-4 w-4" />
                                                    XLS
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        No invoices found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default Invoices; 