import axios, { InternalAxiosRequestConfig } from 'axios';
import ExcelJS from 'exceljs';

// Mock data for invoices
const mockInvoiceData = [
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

// Mock data for invoice summary
const mockInvoiceSummary = {
  totalInvoices: 5,
  pendingAmount: "₹8,000",
  overdueAmount: "₹7,500",
  totalPaid: "₹7,000",
  totalOutstanding: "₹15,500"
};

// Mock data for ledger transactions
const mockLedgerTransactions = [
  {
    id: "LD001",
    date: "2023-05-15",
    type: "Wallet Recharge",
    transactionBy: "Admin",
    credit: "₹10,000",
    debit: null,
    taxableAmount: null,
    igst: null,
    cgst: null,
    sgst: null,
    totalAmount: "₹10,000",
    closingBalance: "₹10,000",
    transactionNumber: "TR-2023051501",
    transactionAgainst: "Wallet",
    remark: "Initial wallet funding"
  },
  {
    id: "LD002",
    date: "2023-05-18",
    type: "Shipping Charge",
    transactionBy: "System",
    credit: null,
    debit: "₹850",
    taxableAmount: "₹720",
    igst: "₹130",
    cgst: null,
    sgst: null,
    totalAmount: "₹850",
    closingBalance: "₹9,150",
    transactionNumber: "TR-2023051802",
    transactionAgainst: "Order #12345",
    remark: "Express delivery charges"
  },
  {
    id: "LD003",
    date: "2023-05-25",
    type: "COD Charges",
    transactionBy: "System",
    credit: null,
    debit: "₹120",
    taxableAmount: "₹101.69",
    igst: null,
    cgst: "₹9.15",
    sgst: "₹9.15",
    totalAmount: "₹120",
    closingBalance: "₹9,030",
    transactionNumber: "TR-2023052503",
    transactionAgainst: "Order #12350",
    remark: "COD handling fee"
  },
  {
    id: "LD004",
    date: "2023-06-01",
    type: "Wallet Recharge",
    transactionBy: "Self",
    credit: "₹5,000",
    debit: null,
    taxableAmount: null,
    igst: null,
    cgst: null,
    sgst: null,
    totalAmount: "₹5,000",
    closingBalance: "₹14,030",
    transactionNumber: "TR-2023060104",
    transactionAgainst: "Wallet",
    remark: "Additional funds transfer"
  },
  {
    id: "LD005",
    date: "2023-06-10",
    type: "Shipping Charge",
    transactionBy: "System",
    credit: null,
    debit: "₹1,250",
    taxableAmount: "₹1,059.32",
    igst: "₹190.68",
    cgst: null,
    sgst: null,
    totalAmount: "₹1,250",
    closingBalance: "₹12,780",
    transactionNumber: "TR-2023061005",
    transactionAgainst: "Order #12480",
    remark: "Premium delivery charges"
  },
  {
    id: "LD006",
    date: "2023-06-15",
    type: "Refund",
    transactionBy: "Admin",
    credit: "₹350",
    debit: null,
    taxableAmount: "₹296.61",
    igst: "₹53.39",
    cgst: null,
    sgst: null,
    totalAmount: "₹350",
    closingBalance: "₹13,130",
    transactionNumber: "TR-2023061506",
    transactionAgainst: "Order #12380",
    remark: "Return shipping refund"
  }
];

// Mock data for ledger summary
const mockLedgerSummary = {
  totalRecharge: "₹15,000",
  totalDebit: "₹2,220",
  totalCredit: "₹15,350",
  closingBalance: "₹13,130"
};

// Helper function to generate shipment data
function generateMockShipments(invoice: any) {
  const periodParts = invoice.period.split(' - ');
  const startDate = new Date(periodParts[0]);
  const endDate = new Date(periodParts[1]);
  
  const shipments = [];
  
  const couriers = ['Delhivery', 'Ekart', 'DTDC', 'BlueDart', 'FedEx'];
  const pincodes = [
    { origin: '110001', destination: '400001', location: 'Delhi to Mumbai' },
    { origin: '560001', destination: '700001', location: 'Bangalore to Kolkata' },
    { origin: '600001', destination: '500001', location: 'Chennai to Hyderabad' },
    { origin: '380001', destination: '226001', location: 'Ahmedabad to Lucknow' },
    { origin: '411001', destination: '302001', location: 'Pune to Jaipur' }
  ];
  
  const totalAmountValue = parseFloat(invoice.amount.replace(/[₹,]/g, ''));
  const avgShipmentValue = totalAmountValue / invoice.shipments;
  
  for (let i = 0; i < invoice.shipments; i++) {
    const shipmentDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
    
    const courier = couriers[Math.floor(Math.random() * couriers.length)];
    const route = pincodes[Math.floor(Math.random() * pincodes.length)];
    
    const weight = (Math.random() * 4.5 + 0.5).toFixed(2);
    
    const variationFactor = 0.8 + (Math.random() * 0.4);
    const baseCharge = Math.round(avgShipmentValue * variationFactor * 0.7);
    
    const additionalCharge = Math.round(baseCharge * 0.1);
    const codCharge = Math.round(baseCharge * 0.02);
    const gst = Math.round(baseCharge * 0.18);
    const total = baseCharge + additionalCharge + codCharge + gst;
    
    const categories = ['Electronics', 'Clothing', 'Home Goods', 'Books', 'Food Items'];
    const category = categories[Math.floor(Math.random() * categories.length)];
    
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
      weight,
      category,
      courier,
      status,
      baseCharge,
      additionalCharge,
      codCharge,
      gst,
      total
    });
  }
  
  return shipments;
}

// Helper function to generate Excel file from shipments
async function generateExcelFile(invoice: any, shipments: any[]) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Shipments');
  
  // Add headers
  worksheet.columns = [
    { header: 'Shipment ID', key: 'id', width: 15 },
    { header: 'Date', key: 'date', width: 15 },
    { header: 'Tracking Number', key: 'trackingNumber', width: 20 },
    { header: 'Origin Pincode', key: 'origin', width: 15 },
    { header: 'Origin City', key: 'originCity', width: 15 },
    { header: 'Destination Pincode', key: 'destination', width: 15 },
    { header: 'Destination City', key: 'destinationCity', width: 15 },
    { header: 'Weight (kg)', key: 'weight', width: 12 },
    { header: 'Product Category', key: 'category', width: 18 },
    { header: 'Courier', key: 'courier', width: 15 },
    { header: 'Status', key: 'status', width: 15 },
    { header: 'Base Charge (₹)', key: 'baseCharge', width: 15 },
    { header: 'Additional Charge (₹)', key: 'additionalCharge', width: 18 },
    { header: 'COD Charge (₹)', key: 'codCharge', width: 15 },
    { header: 'GST (₹)', key: 'gst', width: 12 },
    { header: 'Total (₹)', key: 'total', width: 15 }
  ];
  
  // Style the header row
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'F4F2FF' }
  };
  
  // Add shipment data
  shipments.forEach(shipment => {
    worksheet.addRow(shipment);
  });
  
  // Add a blank row
  worksheet.addRow([]);
  
  // Add summary data
  const summaryRow = worksheet.addRow(['Invoice Summary', invoice.invoiceNumber, invoice.period]);
  summaryRow.font = { bold: true };
  
  // Add totals row
  const totalBaseCharge = shipments.reduce((sum, s) => sum + s.baseCharge, 0);
  const totalAdditionalCharge = shipments.reduce((sum, s) => sum + s.additionalCharge, 0);
  const totalCodCharge = shipments.reduce((sum, s) => sum + s.codCharge, 0);
  const totalGst = shipments.reduce((sum, s) => sum + s.gst, 0);
  const totalAmount = shipments.reduce((sum, s) => sum + s.total, 0);
  
  const totalsRow = worksheet.addRow([
    'Totals', '', '', '', '', '', '', '', '', '', '',
    totalBaseCharge,
    totalAdditionalCharge,
    totalCodCharge,
    totalGst,
    totalAmount
  ]);
  totalsRow.font = { bold: true };
  
  // Generate Excel buffer
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
}

// Helper function to generate CSV from shipments
function generateCsvContent(shipments: any[]) {
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
  ].join(',');
  
  const rows = shipments.map(s => [
    s.id,
    s.date,
    s.trackingNumber,
    s.origin,
    s.originCity,
    s.destination,
    s.destinationCity,
    s.weight,
    s.category,
    s.courier,
    s.status,
    s.baseCharge,
    s.additionalCharge,
    s.codCharge,
    s.gst,
    s.total
  ].join(','));
  
  return [headers, ...rows].join('\n');
}

// Setup axios mock interceptor for invoices endpoints
const setupMockInterceptors = () => {
  // Define a response handler for all intercepted requests
  const mockResponseHandler = async (config: InternalAxiosRequestConfig) => {
    const url = config.url || '';
    
    // Intercept GET /api/seller/billing/invoices
    if (url.match(/\/api\/seller\/billing\/invoices$/) && config.method === 'get') {
      console.log('[MOCK] Intercepted request to GET /api/seller/billing/invoices');
      
      // Get query parameters
      const params = new URLSearchParams(config.params);
      const fromDate = params.get('from');
      const toDate = params.get('to');
      
      // Filter invoices by date if parameters provided
      let invoices = [...mockInvoiceData];
      
      if (fromDate) {
        const fromDateObj = new Date(fromDate);
        invoices = invoices.filter(invoice => {
          const periodStart = new Date(invoice.period.split(' - ')[0]);
          return periodStart >= fromDateObj;
        });
      }
      
      if (toDate) {
        const toDateObj = new Date(toDate);
        invoices = invoices.filter(invoice => {
          const periodEnd = new Date(invoice.period.split(' - ')[1]);
          return periodEnd <= toDateObj;
        });
      }
      
      // Create mock response
      throw {
        response: {
          data: {
            success: true,
            invoices
          },
          status: 200,
          statusText: 'OK',
          headers: { 'content-type': 'application/json' },
          config
        }
      };
    }
    
    // Intercept GET /api/seller/billing/invoices/summary
    if (url.match(/\/api\/seller\/billing\/invoices\/summary$/) && config.method === 'get') {
      console.log('[MOCK] Intercepted request to GET /api/seller/billing/invoices/summary');
      
      // Create mock response
      throw {
        response: {
          data: {
            success: true,
            summary: mockInvoiceSummary
          },
          status: 200,
          statusText: 'OK',
          headers: { 'content-type': 'application/json' },
          config
        }
      };
    }
    
    // Intercept GET /api/seller/billing/invoices/:id/shipments
    if (url.match(/\/api\/seller\/billing\/invoices\/.*\/shipments/) && config.method === 'get') {
      console.log('[MOCK] Intercepted request to GET /api/seller/billing/invoices/:id/shipments');
      
      // Extract invoice ID from URL
      const invoiceId = url.split('/').pop()?.split('?')[0];
      
      // Get query parameters
      const params = new URLSearchParams(config.params);
      const format = params.get('format');
      
      // Find invoice
      const invoice = mockInvoiceData.find(inv => inv.id === invoiceId);
      
      if (!invoice) {
        throw {
          response: {
            data: { success: false, message: 'Invoice not found' },
            status: 404,
            statusText: 'Not Found',
            headers: { 'content-type': 'application/json' },
            config
          }
        };
      }
      
      // Generate shipment data
      const shipments = generateMockShipments(invoice);
      
      // Handle different response formats
      if (format === 'excel') {
        const fileName = `Invoice-${invoice.invoiceNumber}-Shipments.xlsx`;
        
        // Generate Excel file and create a blob URL
        const buffer = await generateExcelFile(invoice, shipments);
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(blob);
        
        // Create a download link and click it
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
        
        // Return empty success response
        throw {
          response: {
            data: { success: true },
            status: 200,
            statusText: 'OK',
            headers: { 'content-type': 'application/json' },
            config
          }
        };
      } else if (format === 'csv') {
        const fileName = `Invoice-${invoice.invoiceNumber}-Shipments.csv`;
        const csvContent = generateCsvContent(shipments);
        
        // Create a blob URL for the CSV
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        
        // Create a download link and click it
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
        
        // Return empty success response
        throw {
          response: {
            data: { success: true },
            status: 200,
            statusText: 'OK',
            headers: { 'content-type': 'application/json' },
            config
          }
        };
      }
      
      // Default: return JSON
      throw {
        response: {
          data: {
            success: true,
            invoice,
            shipments
          },
          status: 200,
          statusText: 'OK',
          headers: { 'content-type': 'application/json' },
          config
        }
      };
    }
    
    // Intercept GET /api/seller/billing/ledger
    if (url.match(/\/api\/seller\/billing\/ledger$/) && config.method === 'get') {
      console.log('[MOCK] Intercepted request to GET /api/seller/billing/ledger');
      
      // Get query parameters
      const params = new URLSearchParams(config.params);
      const fromDate = params.get('from');
      const toDate = params.get('to');
      const page = parseInt(params.get('page') || '1');
      const limit = parseInt(params.get('limit') || '50');
      
      // Filter transactions by date if parameters provided
      let transactions = [...mockLedgerTransactions];
      
      if (fromDate) {
        const fromDateObj = new Date(fromDate);
        transactions = transactions.filter(trx => new Date(trx.date) >= fromDateObj);
      }
      
      if (toDate) {
        const toDateObj = new Date(toDate);
        transactions = transactions.filter(trx => new Date(trx.date) <= toDateObj);
      }
      
      // Calculate pagination
      const totalEntries = transactions.length;
      const totalPages = Math.ceil(totalEntries / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const paginatedTransactions = transactions.slice(startIndex, endIndex);
      
      // Create mock response
      throw {
        response: {
          data: {
            success: true,
            transactions: paginatedTransactions,
            pagination: {
              totalEntries,
              totalPages,
              currentPage: page,
              pageSize: limit,
              hasMore: page < totalPages
            }
          },
          status: 200,
          statusText: 'OK',
          headers: { 'content-type': 'application/json' },
          config
        }
      };
    }
    
    // Intercept GET /api/seller/billing/ledger/summary
    if (url.match(/\/api\/seller\/billing\/ledger\/summary$/) && config.method === 'get') {
      console.log('[MOCK] Intercepted request to GET /api/seller/billing/ledger/summary');
      
      // Create mock response
      throw {
        response: {
          data: {
            success: true,
            summary: mockLedgerSummary
          },
          status: 200,
          statusText: 'OK',
          headers: { 'content-type': 'application/json' },
          config
        }
      };
    }
    
    // Let other requests pass through
    return config;
  };

  // Add a request interceptor
  const requestInterceptor = axios.interceptors.request.use(
    mockResponseHandler,
    error => Promise.reject(error)
  );
  
  // Add a response interceptor to catch the thrown mock responses
  const responseInterceptor = axios.interceptors.response.use(
    response => response,
    error => {
      // If this is one of our mock responses, return it as a successful response
      if (error.response && error.response.data && error.response.data.hasOwnProperty('success')) {
        return Promise.resolve(error.response);
      }
      // Otherwise, pass the error through
      return Promise.reject(error);
    }
  );
  
  // Return function to remove interceptors
  return () => {
    axios.interceptors.request.eject(requestInterceptor);
    axios.interceptors.response.eject(responseInterceptor);
  };
};

export { 
  setupMockInterceptors,
  mockInvoiceData,
  mockInvoiceSummary,
  mockLedgerTransactions,
  mockLedgerSummary
}; 