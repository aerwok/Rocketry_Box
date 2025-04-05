// Constants
export const MAX_RECHARGE_AMOUNT = 100000; // ₹1,00,000
export const MIN_RECHARGE_AMOUNT = 100; // ₹100
export const VALID_PAYMENT_METHODS = ['remittance', 'onlineBanking'] as const;

// Validation functions
export const validateTransactionId = (transactionId: string): boolean => {
    // UUID v4 format
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidPattern.test(transactionId);
};

// Error messages
export const ERROR_MESSAGES = {
    INVALID_AMOUNT: `Amount must be between ₹${MIN_RECHARGE_AMOUNT} and ₹${MAX_RECHARGE_AMOUNT}`,
    INVALID_PAYMENT_METHOD: 'Invalid payment method',
    INVALID_TRANSACTION_ID: 'Invalid transaction ID',
    INSUFFICIENT_BALANCE: 'Insufficient balance for this transaction',
    NETWORK_ERROR: 'Network error occurred',
    SERVER_ERROR: 'Server error occurred',
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Access forbidden',
    DOWNLOAD_ERROR: 'Failed to download file',
    FILE_PROCESSING_ERROR: 'Failed to process file'
} as const; 