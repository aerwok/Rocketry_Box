import { secureStorage } from '@/utils/secureStorage';
import { ERROR_MESSAGES } from '@/utils/validation';

export interface ApiResponse<T> {
    data: T;
    message?: string;
    status: number;
}

export interface ApiError {
    message: string;
    code: string;
    status: number;
    details?: unknown;
}

export class ApiService {
    protected static async handleRequest<T>(
        request: Promise<{ data: T }>
    ): Promise<ApiResponse<T>> {
        try {
            const response = await request;
            return {
                data: response.data,
                status: 200
            };
        } catch (error: any) {
            const apiError: ApiError = {
                message: error.response?.data?.message || ERROR_MESSAGES.SERVER_ERROR,
                code: error.response?.data?.code || 'UNKNOWN_ERROR',
                status: error.response?.status || 500,
                details: error.response?.data?.details
            };

            // Handle specific error cases
            if (apiError.status === 401) {
                secureStorage.removeItem('auth_token');
                secureStorage.removeItem('csrf_token');
                window.location.href = '/seller/login';
            }

            throw apiError;
        }
    }

    protected static getAuthHeader(): Record<string, string> {
        const token = secureStorage.getItem('auth_token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    }

    protected static getCsrfHeader(): Record<string, string> {
        const csrfToken = secureStorage.getItem('csrf_token');
        return csrfToken ? { 'X-CSRF-Token': csrfToken } : {};
    }
} 