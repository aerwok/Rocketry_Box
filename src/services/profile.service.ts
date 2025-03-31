import { ApiService } from "./api.service";
import { toast } from "sonner";
import api from '@/config/api.config';

export interface ProfileData {
    id: string;
    name: string;
    email: string;
    phone: string;
    companyName: string;
    companyCategory: string;
    brandName?: string;
    website?: string;
    supportContact?: string;
    supportEmail?: string;
    operationsEmail?: string;
    financeEmail?: string;
    rechargeType?: string;
    profileImage?: string;
    storeLinks?: {
        website?: string;
        amazon?: string;
        shopify?: string;
        opencart?: string;
    };
    address?: {
        street: string;
        city: string;
        state: string;
        country: string;
        postalCode: string;
        landmark?: string;
    };
    documents?: {
        gstin?: string;
        pan?: string;
        cin?: string;
        tradeLicense?: string;
        msmeRegistration?: string;
        aadhaar?: string;
        documents: {
            name: string;
            type: string;
            url: string;
            status: 'verified' | 'pending' | 'rejected';
        }[];
    };
    bankDetails?: {
        accountName: string;
        accountNumber: string;
        bankName: string;
        branch: string;
        ifscCode: string;
        swiftCode?: string;
        accountType: string;
        isDefault: boolean;
        cancelledCheque?: {
            url: string;
            status: 'verified' | 'pending';
        };
    }[];
}

export interface ProfileUpdateResponse {
    success: boolean;
    message: string;
    data?: ProfileData;
}

// Mock data for frontend development
const MOCK_PROFILE_DATA: ProfileData = {
    id: "SELLER123",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 98765 43210",
    companyName: "Tech Solutions Pvt Ltd",
    companyCategory: "Electronics",
    brandName: "TechPro",
    website: "https://techpro.com",
    supportContact: "+91 98765 43211",
    supportEmail: "support@techpro.com",
    operationsEmail: "operations@techpro.com",
    financeEmail: "finance@techpro.com",
    rechargeType: "Prepaid",
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    storeLinks: {
        website: "https://techpro.com",
        amazon: "https://amazon.com/techpro",
        shopify: "https://techpro.myshopify.com",
        opencart: "https://techpro.opencart.com"
    },
    address: {
        street: "123 Business Park, Sector 62",
        city: "Noida",
        state: "Uttar Pradesh",
        country: "India",
        postalCode: "201309",
        landmark: "Near Metro Station"
    },
    documents: {
        gstin: "09AABCT1234A1Z5",
        pan: "AABCT1234A",
        aadhaar: "1234 5678 9012",
        documents: [
            {
                name: "GST Certificate",
                type: "PDF",
                url: "https://example.com/documents/gst.pdf",
                status: "verified"
            },
            {
                name: "PAN Card",
                type: "PDF",
                url: "https://example.com/documents/pan.pdf",
                status: "verified"
            },
            {
                name: "Aadhaar Card",
                type: "PDF",
                url: "https://example.com/documents/aadhaar.pdf",
                status: "verified"
            }
        ]
    },
    bankDetails: [
        {
            accountName: "Tech Solutions Pvt Ltd",
            accountNumber: "12345678901234",
            bankName: "HDFC Bank",
            branch: "Noida Sector 62",
            ifscCode: "HDFC0001234",
            accountType: "Current",
            isDefault: true,
            cancelledCheque: {
                url: "https://example.com/documents/cancelled-cheque.pdf",
                status: "verified"
            }
        }
    ]
};

class ProfileService extends ApiService {
    private static instance: ProfileService;
    private readonly BASE_URL = "/api/v1/seller/profile";

    private constructor() {
        super();
    }

    public static getInstance(): ProfileService {
        if (!ProfileService.instance) {
            ProfileService.instance = new ProfileService();
        }
        return ProfileService.instance;
    }

    public async getProfile(): Promise<ProfileData> {
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Return mock data
            return MOCK_PROFILE_DATA;
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    public async updateProfile(data: Partial<ProfileData>): Promise<ProfileUpdateResponse> {
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Return mock success response
            return {
                success: true,
                message: "Profile updated successfully",
                data: { ...MOCK_PROFILE_DATA, ...data }
            };
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    public async updateProfileImage(file: File): Promise<{ imageUrl: string }> {
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Return mock image URL
            return {
                imageUrl: "https://ui-avatars.com/api/?name=John+Doe&background=random"
            };
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    public async updateStoreLinks(links: ProfileData["storeLinks"]): Promise<ProfileUpdateResponse> {
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Return mock success response
            return {
                success: true,
                message: "Store links updated successfully",
                data: { ...MOCK_PROFILE_DATA, storeLinks: links }
            };
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    private handleError(error: any): void {
        if (error.response) {
            const message = error.response.data?.message || "An error occurred";
            toast.error(message);
        } else if (error.request) {
            toast.error("Network error. Please check your connection.");
        } else {
            toast.error("An unexpected error occurred.");
        }
    }
}

export const profileService = ProfileService.getInstance(); 