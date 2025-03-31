// Encryption key (in production, this should be handled securely)
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'your-secure-key';

// Simple encryption/decryption functions (replace with proper encryption in production)
const encrypt = (data: string): string => {
    try {
        return btoa(data); // Replace with proper encryption
    } catch (error) {
        console.error('Encryption error:', error);
        return '';
    }
};

const decrypt = (data: string): string => {
    try {
        return atob(data); // Replace with proper decryption
    } catch (error) {
        console.error('Decryption error:', error);
        return '';
    }
};

export const secureStorage = {
    setItem: (key: string, value: string): void => {
        try {
            const encryptedValue = encrypt(value);
            localStorage.setItem(key, encryptedValue);
        } catch (error) {
            console.error('Error storing data:', error);
        }
    },

    getItem: (key: string): string | null => {
        try {
            const encryptedValue = localStorage.getItem(key);
            return encryptedValue ? decrypt(encryptedValue) : null;
        } catch (error) {
            console.error('Error retrieving data:', error);
            return null;
        }
    },

    removeItem: (key: string): void => {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing data:', error);
        }
    },

    clear: (): void => {
        try {
            localStorage.clear();
        } catch (error) {
            console.error('Error clearing storage:', error);
        }
    }
}; 