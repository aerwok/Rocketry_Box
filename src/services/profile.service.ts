import { toast } from 'sonner';
import { Seller, ApiResponse } from '../types/api';
import { ApiService } from './api.service';
import { ApiError } from '@/types/api';

// Mock data for frontend development
const mockProfileData: Seller = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    role: 'seller',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    companyName: 'Example Company',
    companyCategory: 'Retail',
    brandName: 'Example Brand',
    website: 'https://example.com',
    supportContact: '+1234567890',
    supportEmail: 'support@example.com',
    operationsEmail: 'operations@example.com',
    financeEmail: 'finance@example.com',
    rechargeType: 'Prepaid',
    profileImage: 'https://example.com/profile.jpg',
    storeLinks: {
        website: 'https://example.com',
        amazon: 'https://amazon.com/shop/example',
        shopify: 'https://example.myshopify.com',
        opencart: 'https://example.com/opencart'
    },
    address: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        postalCode: '10001',
        landmark: 'Near Central Park'
    },
    documents: {
        gstin: 'GST123456789',
        pan: 'PAN123456789',
        cin: 'CIN123456789',
        tradeLicense: 'TL123456789',
        msmeRegistration: 'MSME123456789',
        aadhaar: 'AADHAAR123456789',
        documents: [
            {
                name: 'GST Certificate',
                type: 'pdf',
                url: 'https://example.com/documents/gst.pdf',
                status: 'verified'
            }
        ]
    },
    bankDetails: [
        {
            accountName: 'Example Company',
            accountNumber: '1234567890',
            bankName: 'Example Bank',
            branch: 'Main Branch',
            ifscCode: 'EXMP1234567',
            swiftCode: 'EXMPUS123',
            accountType: 'Current',
            isDefault: true,
            cancelledCheque: {
                url: 'https://example.com/documents/cheque.pdf',
                status: 'verified'
            }
        }
    ]
};

export class ProfileService {
    private apiService: ApiService;

    constructor() {
        this.apiService = new ApiService();
    }

    async getProfile(): Promise<ApiResponse<Seller>> {
        try {
            return await this.apiService.get('/profile');
        } catch (error) {
            const apiError = error as ApiError;
            toast.error(apiError.message || 'Failed to fetch profile');
            throw error;
        }
    }

    async updateProfile(profileData: Partial<Seller>): Promise<ApiResponse<Seller>> {
        try {
            return await this.apiService.put('/profile', profileData);
        } catch (error) {
            const apiError = error as ApiError;
            toast.error(apiError.message || 'Failed to update profile');
            throw error;
        }
    }

    async updateProfileImage(file: File): Promise<ApiResponse<{ imageUrl: string }>> {
        try {
            const formData = new FormData();
            formData.append('file', file);
            return await this.apiService.post('/profile/image', formData);
        } catch (error) {
            const apiError = error as ApiError;
            toast.error(apiError.message || 'Failed to update profile image');
            throw error;
        }
    }

    async updateStoreLinks(links: Seller['storeLinks']): Promise<ApiResponse<Seller>> {
        try {
            // TODO: Replace with actual API call
            // const response = await this.apiService.put<ApiResponse<Seller>>('/profile/store-links', { storeLinks: links });
            // return response.data;
            
            // Mock response for development
            const updatedProfile = { ...mockProfileData, storeLinks: links };
            return {
                data: updatedProfile,
                message: 'Store links updated successfully',
                status: 200,
                success: true
            };
        } catch (error) {
            toast.error('Failed to update store links');
            throw error;
        }
    }
}

export const profileService = new ProfileService(); 