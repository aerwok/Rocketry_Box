# Rocketry Box Seller API Documentation

## Table of Contents
1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Authentication](#authentication)
4. [API Endpoints](#api-endpoints)
5. [Data Models](#data-models)
6. [Webhooks](#webhooks)
7. [File Management](#file-management)
8. [Payment Processing](#payment-processing)
9. [Notifications](#notifications)
10. [Performance & Caching](#performance--caching)
11. [Background Processing](#background-processing)
12. [Security](#security)
13. [Error Handling](#error-handling)
14. [Deployment](#deployment)

## Data Models

### Core Types

```typescript
// Common Types
interface Address {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    contactName?: string;
    contactPhone?: string;
}

interface Dimensions {
    length: number;
    width: number;
    height: number;
    weight: number;
}

interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    pages: number;
}

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
        details?: Record<string, string[]>;
    };
    meta?: PaginationMeta;
}

// Authentication Types
interface LoginRequest {
    email: string;
    password: string;
    otp?: string;
}

interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    seller: SellerProfile;
}

interface RegisterRequest {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    businessName: string;
    businessType: string;
    gstin?: string;
    address: Address;
    documents: {
        panCard: string;
        bankStatement: string;
        businessProof: string;
    };
    acceptTerms: boolean;
}

// Seller Types
interface SellerProfile {
    id: string;
    name: string;
    email: string;
    phone: string;
    businessName: string;
    businessType: string;
    gstin?: string;
    status: 'pending' | 'active' | 'suspended';
    emailVerified: boolean;
    phoneVerified: boolean;
    createdAt: string;
    updatedAt: string;
    lastLogin?: string;
}

// Order Types
interface Order {
    id: string;
    trackingId: string;
    status: OrderStatus;
    createdAt: string;
    updatedAt: string;
    customer: CustomerInfo;
    deliveryAddress: Address;
    package: PackageInfo;
    timeline: OrderTimeline[];
    payment: PaymentInfo;
    serviceType: ServiceType;
    estimatedDelivery: string;
    shippingLabel?: ShippingLabel;
}

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
type ServiceType = 'standard' | 'express' | 'cod';

interface CustomerInfo {
    name: string;
    email: string;
    phone: string;
}

interface PackageInfo {
    weight: number;
    dimensions: Dimensions;
    items: PackageItem[];
    totalValue: number;
}

interface PackageItem {
    name: string;
    quantity: number;
    value: number;
}

interface OrderTimeline {
    status: OrderStatus;
    location: string;
    timestamp: string;
    description: string;
}

interface PaymentInfo {
    status: PaymentStatus;
    method: PaymentMethod;
    amount: number;
    currency: string;
    transactionId?: string;
    paidAt?: string;
}

type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
type PaymentMethod = 'cod' | 'online' | 'wallet';

interface ShippingLabel {
    url: string;
    expiresAt: string;
}

// Product Types
interface Product {
    id: string;
    name: string;
    sku: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    status: ProductStatus;
    images: ProductImage[];
    dimensions: Dimensions;
    createdAt: string;
    updatedAt: string;
}

type ProductStatus = 'active' | 'inactive';

interface ProductImage {
    url: string;
    isPrimary: boolean;
}

// Settings Types
interface SellerSettings {
    autoFetch: boolean;
    autoCreate: boolean;
    autoNotify: boolean;
    defaultShippingMode: ServiceType;
    autoSelectCourier: boolean;
    codAvailable: boolean;
    courierSettings: CourierSetting[];
    labelSettings: LabelSettings;
    whatsappSettings: WhatsappSettings;
    apiSettings: ApiSettings;
}

interface CourierSetting {
    courierId: number;
    enabled: boolean;
    priority: number;
}

interface LabelSettings {
    size: string;
    format: string;
    logo?: string;
    showLogo: boolean;
    showBarcode: boolean;
    showReturn: boolean;
    additionalText: string;
}

interface WhatsappSettings {
    enabled: boolean;
    businessNumber?: string;
    apiKey?: string;
    notifications: NotificationSettings;
    templates?: NotificationTemplates;
}

interface NotificationSettings {
    orderConfirmation: boolean;
    orderPacked: boolean;
    outForDelivery: boolean;
    deliveryConfirmation: boolean;
    deliveryFailed: boolean;
    returnInitiated: boolean;
    returnPicked: boolean;
    returnDelivered: boolean;
}

interface NotificationTemplates {
    orderConfirmation?: string;
    deliveryConfirmation?: string;
}

interface ApiSettings {
    apiKey: string;
    apiSecret: string;
    enabled: boolean;
    webhookEnabled: boolean;
    webhookUrl: string;
}

// Analytics Types
interface SalesAnalytics {
    totalSales: number;
    totalOrders: number;
    averageOrderValue: number;
    salesByPeriod: SalesPeriod[];
    topProducts: TopProduct[];
    salesByCategory: CategorySales[];
}

interface SalesPeriod {
    period: string;
    sales: number;
    orders: number;
}

interface TopProduct {
    id: string;
    name: string;
    quantity: number;
    revenue: number;
}

interface CategorySales {
    category: string;
    sales: number;
    percentage: number;
}

// Billing Types
interface BillingSummary {
    totalAmount: number;
    pendingAmount: number;
    paidAmount: number;
    upcomingPayments: UpcomingPayment[];
    paymentHistory: PaymentHistory[];
}

interface UpcomingPayment {
    id: string;
    amount: number;
    dueDate: string;
    status: 'pending' | 'paid' | 'overdue';
}

interface PaymentHistory {
    id: string;
    amount: number;
    date: string;
    status: string;
    transactionId: string;
}

// NDR Types
interface NDR {
    id: string;
    orderId: string;
    trackingId: string;
    reason: string;
    status: NDRStatus;
    createdAt: string;
    updatedAt: string;
    customer: CustomerInfo;
    deliveryAddress: Address;
    attempts: NDRAttempt[];
}

type NDRStatus = 'pending' | 'resolved' | 'failed';

interface NDRAttempt {
    date: string;
    status: string;
    remarks: string;
}

// Weight Dispute Types
interface WeightDispute {
    id: string;
    orderId: string;
    trackingId: string;
    claimedWeight: number;
    actualWeight: number;
    difference: number;
    status: DisputeStatus;
    createdAt: string;
    updatedAt: string;
    evidence?: DisputeEvidence;
}

type DisputeStatus = 'pending' | 'resolved' | 'rejected';

interface DisputeEvidence {
    images: string[];
    documents: string[];
}

// Wallet Types
interface WalletBalance {
    balance: number;
    currency: string;
    lastUpdated: string;
    pendingAmount: number;
    availableAmount: number;
}

interface WalletTransaction {
    id: string;
    type: 'credit' | 'debit';
    amount: number;
    balance: number;
    description: string;
    referenceId: string;
    createdAt: string;
}

// COD Types
interface CODSummary {
    totalAmount: number;
    pendingAmount: number;
    collectedAmount: number;
    orders: CODOrderCounts;
    collectionByDate: CODCollection[];
}

interface CODOrderCounts {
    total: number;
    pending: number;
    collected: number;
}

interface CODCollection {
    date: string;
    amount: number;
    orders: number;
}

// Warehouse Types
interface Warehouse {
    id: string;
    name: string;
    address: Address;
    contactPerson: string;
    contactPhone: string;
    isDefault: boolean;
    operatingHours: {
        start: string;
        end: string;
        timezone: string;
    };
    createdAt: string;
    updatedAt: string;
}

// Team Member Types
interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: TeamRole;
    status: TeamStatus;
    lastActive: string;
    permissions: string[];
}

type TeamRole = 'admin' | 'manager' | 'operator';
type TeamStatus = 'active' | 'inactive';

// Rate Card Types
interface RateCard {
    id: string;
    name: string;
    courier: string;
    serviceType: ServiceType;
    weightSlabs: WeightSlab[];
    zones: Zone[];
    isDefault: boolean;
    createdAt: string;
    updatedAt: string;
}

interface WeightSlab {
    min: number;
    max: number;
    rate: number;
}

interface Zone {
    name: string;
    pincodes: string[];
    rate: number;
}

// Service Check Types
interface ServiceCheckRequest {
    pickupPincode: string;
    deliveryPincode: string;
    weight: number;
    codAmount?: number;
}

interface ServiceCheckResponse {
    available: boolean;
    services: ServiceOption[];
}

interface ServiceOption {
    courierId: number;
    courierName: string;
    serviceType: string;
    estimatedDelivery: string;
    rate: number;
    codAvailable: boolean;
    codCharge: number;
}

// Support Ticket Types
interface SupportTicket {
    id: string;
    subject: string;
    description: string;
    priority: TicketPriority;
    category: TicketCategory;
    status: TicketStatus;
    createdAt: string;
    lastUpdated: string;
    messages: number;
    attachments?: TicketAttachment[];
}

type TicketPriority = 'low' | 'medium' | 'high';
type TicketCategory = 'technical' | 'billing' | 'shipping' | 'other';
type TicketStatus = 'open' | 'in-progress' | 'resolved' | 'closed';

interface TicketAttachment {
    name: string;
    url: string;
}

// Bulk Order Types
interface BulkOrderUpload {
    total: number;
    processed: number;
    success: number;
    failed: number;
    errors?: BulkOrderError[];
    downloadUrl?: string;
}

interface BulkOrderError {
    row: number;
    error: string;
}

interface BulkOrderStatus {
    batchId: string;
    status: 'processing' | 'completed' | 'failed';
    progress: number;
    total: number;
    processed: number;
    success: number;
    failed: number;
    errors?: BulkOrderError[];
    downloadUrl?: string;
}

// Return Types
interface Return {
    id: string;
    orderId: string;
    customerId: string;
    status: ReturnStatus;
    reason: string;
    items: ReturnItem[];
    refund: RefundInfo;
    timeline: ReturnTimeline[];
    createdAt: string;
    updatedAt: string;
}

type ReturnStatus = 'requested' | 'approved' | 'rejected' | 'picked' | 'received' | 'refunded';

interface ReturnItem {
    productId: string;
    quantity: number;
    reason: string;
    condition: 'new' | 'used' | 'damaged';
}

interface ReturnTimeline {
    status: ReturnStatus;
    timestamp: string;
    notes?: string;
}

interface RefundInfo {
    amount: number;
    method: string;
    transactionId?: string;
    paidAt?: string;
}

// Service Availability Types
interface ServiceAvailability {
    courier: string;
    serviceType: ServiceType;
    rate: number;
    estimatedDelivery: string;
    isAvailable: boolean;
}
```

## Overview

The Rocketry Box Seller API provides endpoints for managing seller operations, including order management, inventory, shipping labels, and analytics. This documentation covers all seller-specific endpoints and functionality.

### Base URL
```
Production: https://api.rocketrybox.com/v1/seller
Staging: https://staging-api.rocketrybox.com/v1/seller
```

### API Versioning
The API uses URL versioning. The current version is v1. All endpoints are prefixed with `/api/v1/seller/`.

### Response Format
All responses are in JSON format and follow this structure:
```typescript
interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
        details?: Record<string, string[]>;
    };
    meta?: {
        page?: number;
        limit?: number;
        total?: number;
    };
}
```

## Getting Started

### Prerequisites
- Node.js 16.x or higher
- PostgreSQL 13.x or higher
- Redis 6.x or higher
- AWS S3 account (for file storage)
- Razorpay account (for payments)

### Installation
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see [Environment Variables](#environment-variables))
4. Run database migrations: `npm run migrate`
5. Start the server: `npm run start`

### SDK Support
Official SDKs are available for:
- Node.js
- Python
- Java
- PHP

## Authentication

### JWT Authentication
All API requests require authentication using JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <your_access_token>
```

### Token Structure
```typescript
interface JWTPayload {
    sub: string;        // seller id
    role: 'seller',     // fixed role
    email: string,      // seller email
    iat: number,        // issued at
    exp: number,        // expiration time
    jti: string;        // unique token id
}
```

### Authentication Endpoints

#### Login
```typescript
POST /api/v1/seller/auth/login
Content-Type: application/json

Request Body:
{
    email: string,      // valid email format
    password: string,   // required
    otp?: string       // 6 digits (for 2FA)
}

Response:
{
    success: true,
    data: {
        accessToken: string,
        refreshToken: string,
        seller: {
            id: string,
            name: string,
            email: string,
            phone: string,
            businessName: string,
            status: string
        }
    }
}
```

#### Registration
```typescript
POST /api/v1/seller/auth/register
Content-Type: application/json

Request Body:
{
    name: string,          // min 2 characters
    email: string,         // valid email format
    phone: string,         // exactly 10 digits
    password: string,      // see password rules
    confirmPassword: string,// must match password
    businessName: string,  // required
    businessType: string,  // required
    gstin?: string,       // optional
    address: {
        street: string,
        city: string,
        state: string,
        pincode: string,
        country: string
    },
    documents: {
        panCard: string,   // base64 encoded
        bankStatement: string, // base64 encoded
        businessProof: string  // base64 encoded
    },
    acceptTerms: boolean   // must be true
}

Password Rules:
- Minimum length: 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character
```

#### Password Reset
```typescript
POST /api/v1/seller/auth/password/reset
Content-Type: application/json

Request Body:
{
    email: string
}

Response:
{
    success: true,
    data: {
        message: string,
        expiresAt: string
    }
}
```

#### Verify Email
```typescript
POST /api/v1/seller/auth/email/verify
Content-Type: application/json

Request Body:
{
    token: string
}

Response:
{
    success: true,
    data: {
        message: string
    }
}
```

#### Verify Phone
```typescript
POST /api/v1/seller/auth/phone/verify
Content-Type: application/json

Request Body:
{
    phone: string,
    otp: string
}

Response:
{
    success: true,
    data: {
        message: string
    }
}
```

## API Endpoints

### Dashboard

#### Get Dashboard Summary
```typescript
GET /api/v1/seller/dashboard/summary

Response:
{
    success: true,
    data: {
        totalOrders: number,
        pendingOrders: number,
        processingOrders: number,
        deliveredOrders: number,
        totalRevenue: number,
        recentOrders: Array<{
            id: string,
            trackingId: string,
            status: string,
            amount: number,
            customerName: string,
            createdAt: string
        }>,
        topProducts: Array<{
            id: string,
            name: string,
            quantity: number,
            revenue: number
        }>,
        analytics: {
            dailyOrders: Array<{
                date: string,
                count: number,
                revenue: number
            }>,
            monthlyRevenue: Array<{
                month: string,
                revenue: number
            }>
        }
    }
}
```

#### Get Recent Activities
```typescript
GET /api/v1/seller/dashboard/activities

Query Parameters:
{
    limit?: number,     // default: 10, max: 50
    type?: 'order' | 'product' | 'payment' | 'all'
}

Response:
{
    success: true,
    data: {
        activities: Array<{
            id: string,
            type: string,
            description: string,
            timestamp: string,
            metadata: Record<string, any>
        }>
    }
}
```

#### Get Performance Metrics
```typescript
GET /api/v1/seller/dashboard/performance

Query Parameters:
{
    period: 'daily' | 'weekly' | 'monthly'
}

Response:
{
    success: true,
    data: {
        metrics: {
            orderFulfillmentRate: number,
            averageResponseTime: number,
            customerSatisfaction: number,
            returnRate: number,
            onTimeDelivery: number
        },
        trends: {
            orderFulfillment: Array<{
                date: string,
                rate: number
            }>,
            responseTime: Array<{
                date: string,
                time: number
            }>
        }
    }
}
```

### Orders

#### List Orders
```typescript
GET /api/v1/seller/orders

Query Parameters:
{
    page?: number,      // default: 1
    limit?: number,     // default: 10, max: 50
    status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled',
    startDate?: string, // ISO date string
    endDate?: string,   // ISO date string
    search?: string     // search by tracking ID or customer name
}

Response:
{
    success: true,
    data: {
        orders: Array<{
            id: string,
            trackingId: string,
            status: string,
            createdAt: string,
            updatedAt: string,
            customer: {
                name: string,
                email: string,
                phone: string
            },
            deliveryAddress: {
                street: string,
                city: string,
                state: string,
                pincode: string,
                country: string,
                contactName: string,
                contactPhone: string
            },
            package: {
                weight: number,
                dimensions: {
                    length: number,
                    width: number,
                    height: number
                },
                items: Array<{
                    name: string,
                    quantity: number,
                    value: number
                }>,
                totalValue: number
            },
            payment: {
                status: string,
                method: string,
                amount: number,
                currency: string
            },
            serviceType: string,
            estimatedDelivery: string
        }>,
        meta: {
            page: number,
            limit: number,
            total: number,
            pages: number
        }
    }
}
```

#### Order Details
```typescript
GET /api/v1/seller/orders/:orderId

Response:
{
    success: true,
    data: {
        id: string,
        trackingId: string,
        status: string,
        createdAt: string,
        updatedAt: string,
        customer: {
            name: string,
            email: string,
            phone: string
        },
        deliveryAddress: {
            street: string,
            city: string,
            state: string,
            pincode: string,
            country: string,
            contactName: string,
            contactPhone: string
        },
        package: {
            weight: number,
            dimensions: {
                length: number,
                width: number,
                height: number
            },
            items: Array<{
                name: string,
                quantity: number,
                value: number
            }>,
            totalValue: number
        },
        timeline: Array<{
            status: string,
            location: string,
            timestamp: string,
            description: string
        }>,
        payment: {
            status: string,
            method: string,
            amount: number,
            currency: string,
            transactionId?: string,
            paidAt?: string
        },
        serviceType: string,
        estimatedDelivery: string,
        shippingLabel?: {
            url: string,
            expiresAt: string
        }
    }
}
```

#### Update Order Status
```typescript
PUT /api/v1/seller/orders/:orderId/status
Content-Type: application/json

Request Body:
{
    status: 'processing' | 'shipped' | 'delivered' | 'cancelled',
    location?: string,
    description?: string
}

Response:
{
    success: true,
    data: {
        message: string,
        order: {
            id: string,
            status: string,
            updatedAt: string
        }
    }
}
```

#### Generate Shipping Label
```typescript
POST /api/v1/seller/orders/:orderId/shipping-label
Content-Type: application/json

Request Body:
{
    labelType: 'thermal' | 'standard',
    format: 'pdf' | 'png'
}

Response:
{
    success: true,
    data: {
        labelUrl: string,
        expiresAt: string,
        trackingId: string
    }
}
```

#### Bulk Order Update
```typescript
PUT /api/v1/seller/orders/bulk
Content-Type: application/json

Request Body:
{
    orderIds: string[],
    status: 'processing' | 'shipped' | 'delivered' | 'cancelled',
    location?: string,
    description?: string
}

Response:
{
    success: true,
    data: {
        updated: number,
        failed: number,
        errors?: Array<{
            orderId: string,
            error: string
        }>
    }
}
```

#### Export Orders
```typescript
GET /api/v1/seller/orders/export

Query Parameters:
{
    format: 'csv' | 'excel',
    startDate?: string,
    endDate?: string,
    status?: string,
    includeFields?: string[]
}

Response:
{
    success: true,
    data: {
        downloadUrl: string,
        expiresAt: string
    }
}
```

#### Order History
```typescript
GET /api/v1/seller/orders/:orderId/history

Response:
{
    success: true,
    data: {
        history: Array<{
            status: string,
            timestamp: string,
            updatedBy: string,
            location?: string,
            description?: string,
            metadata?: Record<string, any>
        }>
    }
}
```

### Products

#### List Products
```typescript
GET /api/v1/seller/products

Query Parameters:
{
    page?: number,      // default: 1
    limit?: number,     // default: 10, max: 50
    search?: string,    // search by name or SKU
    category?: string,
    status?: 'active' | 'inactive'
}

Response:
{
    success: true,
    data: {
        products: Array<{
            id: string,
            name: string,
            sku: string,
            description: string,
            price: number,
            stock: number,
            category: string,
            status: string,
            images: Array<{
                url: string,
                isPrimary: boolean
            }>,
            dimensions: {
                length: number,
                width: number,
                height: number,
                weight: number
            },
            createdAt: string,
            updatedAt: string
        }>,
        meta: {
            page: number,
            limit: number,
            total: number,
            pages: number
        }
    }
}
```

#### Create Product
```typescript
POST /api/v1/seller/products
Content-Type: application/json

Request Body:
{
    name: string,
    sku: string,
    description: string,
    price: number,
    stock: number,
    category: string,
    images: Array<{
        url: string,
        isPrimary: boolean
    }>,
    dimensions: {
        length: number,
        width: number,
        height: number,
        weight: number
    }
}

Response:
{
    success: true,
    data: {
        id: string,
        name: string,
        sku: string,
        createdAt: string
    }
}
```

#### Update Product
```typescript
PUT /api/v1/seller/products/:productId
Content-Type: application/json

Request Body:
{
    name?: string,
    description?: string,
    price?: number,
    stock?: number,
    category?: string,
    status?: 'active' | 'inactive',
    images?: Array<{
        url: string,
        isPrimary: boolean
    }>,
    dimensions?: {
        length: number,
        width: number,
        height: number,
        weight: number
    }
}

Response:
{
    success: true,
    data: {
        message: string,
        product: {
            id: string,
            name: string,
            sku: string,
            updatedAt: string
        }
    }
}
```

#### Delete Product
```typescript
DELETE /api/v1/seller/products/:productId

Response:
{
    success: true,
    data: {
        message: string
    }
}
```

#### Bulk Product Update
```typescript
PUT /api/v1/seller/products/bulk
Content-Type: application/json

Request Body:
{
    products: Array<{
        id: string,
        updates: {
            price?: number,
            stock?: number,
            status?: 'active' | 'inactive'
        }
    }>
}

Response:
{
    success: true,
    data: {
        updated: number,
        failed: number,
        errors?: Array<{
            productId: string,
            error: string
        }>
    }
}
```

#### Product Categories
```typescript
GET /api/v1/seller/products/categories

Response:
{
    success: true,
    data: {
        categories: Array<{
            id: string,
            name: string,
            parentId?: string,
            productCount: number
        }>
    }
}
```

#### Import Products
```typescript
POST /api/v1/seller/products/import
Content-Type: multipart/form-data

Request Body:
{
    file: File,
    format: 'csv' | 'excel',
    options?: {
        updateExisting?: boolean,
        skipInvalid?: boolean
    }
}

Response:
{
    success: true,
    data: {
        total: number,
        imported: number,
        failed: number,
        errors?: Array<{
            row: number,
            error: string
        }>
    }
}
```

#### Export Products
```typescript
GET /api/v1/seller/products/export

Query Parameters:
{
    format: 'csv' | 'excel',
    category?: string,
    status?: string,
    includeFields?: string[]
}

Response:
{
    success: true,
    data: {
        downloadUrl: string,
        expiresAt: string
    }
}
```

### Settings

#### Get Settings
```typescript
GET /api/v1/seller/settings

Response:
{
    success: true,
    data: {
        autoFetch: boolean,
        autoCreate: boolean,
        autoNotify: boolean,
        defaultShippingMode: 'standard' | 'express' | 'cod',
        autoSelectCourier: boolean,
        codAvailable: boolean,
        courierSettings: Array<{
            courierId: number,
            enabled: boolean,
            priority: number
        }>,
        labelSettings: {
            size: string,
            format: string,
            logo?: string,
            showLogo: boolean,
            showBarcode: boolean,
            showReturn: boolean,
            additionalText: string
        },
        whatsappSettings: {
            enabled: boolean,
            businessNumber?: string,
            apiKey?: string,
            notifications: {
                orderConfirmation: boolean,
                orderPacked: boolean,
                outForDelivery: boolean,
                deliveryConfirmation: boolean,
                deliveryFailed: boolean,
                returnInitiated: boolean,
                returnPicked: boolean,
                returnDelivered: boolean
            },
            templates?: {
                orderConfirmation?: string,
                deliveryConfirmation?: string
            }
        },
        apiSettings: {
            apiKey: string,
            apiSecret: string,
            enabled: boolean,
            webhookEnabled: boolean,
            webhookUrl: string
        }
    }
}
```

#### Update Settings
```typescript
PUT /api/v1/seller/settings
Content-Type: application/json

Request Body:
{
    autoFetch?: boolean,
    autoCreate?: boolean,
    autoNotify?: boolean,
    defaultShippingMode?: 'standard' | 'express' | 'cod',
    autoSelectCourier?: boolean,
    codAvailable?: boolean,
    courierSettings?: Array<{
        courierId: number,
        enabled: boolean,
        priority: number
    }>,
    labelSettings?: {
        size?: string,
        format?: string,
        logo?: string,
        showLogo?: boolean,
        showBarcode?: boolean,
        showReturn?: boolean,
        additionalText?: string
    },
    whatsappSettings?: {
        enabled?: boolean,
        businessNumber?: string,
        apiKey?: string,
        notifications?: {
            orderConfirmation?: boolean,
            orderPacked?: boolean,
            outForDelivery?: boolean,
            deliveryConfirmation?: boolean,
            deliveryFailed?: boolean,
            returnInitiated?: boolean,
            returnPicked?: boolean,
            returnDelivered?: boolean
        },
        templates?: {
            orderConfirmation?: string,
            deliveryConfirmation?: string
        }
    },
    apiSettings?: {
        enabled?: boolean,
        webhookEnabled?: boolean,
        webhookUrl?: string
    }
}

Response:
{
    success: true,
    data: {
        message: string,
        settings: {
            updatedAt: string
        }
    }
}
```

#### Generate API Keys
```typescript
POST /api/v1/seller/settings/api/keys

Response:
{
    success: true,
    data: {
        apiKey: string,
        apiSecret: string,
        expiresAt: string
    }
}
```

#### Get API Usage
```typescript
GET /api/v1/seller/settings/api/usage

Query Parameters:
{
    startDate?: string,
    endDate?: string
}

Response:
{
    success: true,
    data: {
        totalRequests: number,
        requestsByEndpoint: Array<{
            endpoint: string,
            count: number
        }>,
        requestsByDate: Array<{
            date: string,
            count: number
        }>,
        rateLimitUsage: {
            current: number,
            limit: number,
            resetAt: string
        }
    }
}
```

#### Get Webhook Logs
```typescript
GET /api/v1/seller/settings/webhook/logs

Query Parameters:
{
    page?: number,
    limit?: number,
    status?: 'success' | 'failed',
    startDate?: string,
    endDate?: string
}

Response:
{
    success: true,
    data: {
        logs: Array<{
            id: string,
            event: string,
            status: string,
            timestamp: string,
            responseCode?: number,
            responseBody?: string,
            error?: string
        }>,
        meta: {
            page: number,
            limit: number,
            total: number
        }
    }
}
```

### Analytics

#### Get Sales Analytics
```typescript
GET /api/v1/seller/analytics/sales

Query Parameters:
{
    period: 'daily' | 'weekly' | 'monthly' | 'yearly',
    startDate: string,  // ISO date string
    endDate: string     // ISO date string
}

Response:
{
    success: true,
    data: {
        totalSales: number,
        totalOrders: number,
        averageOrderValue: number,
        salesByPeriod: Array<{
            period: string,
            sales: number,
            orders: number
        }>,
        topProducts: Array<{
            id: string,
            name: string,
            quantity: number,
            revenue: number
        }>,
        salesByCategory: Array<{
            category: string,
            sales: number,
            percentage: number
        }>
    }
}
```

#### Get Shipping Analytics
```typescript
GET /api/v1/seller/analytics/shipping

Query Parameters:
{
    period: 'daily' | 'weekly' | 'monthly' | 'yearly',
    startDate: string,  // ISO date string
    endDate: string     // ISO date string
}

Response:
{
    success: true,
    data: {
        totalShipments: number,
        deliveredShipments: number,
        averageDeliveryTime: number,
        shipmentsByStatus: {
            pending: number,
            processing: number,
            shipped: number,
            delivered: number,
            cancelled: number
        },
        shipmentsByService: {
            express: number,
            standard: number
        },
        deliveryTimeByRegion: Array<{
            region: string,
            averageTime: number,
            totalShipments: number
        }>
    }
}
```

#### Get Customer Analytics
```typescript
GET /api/v1/seller/analytics/customers

Query Parameters:
{
    period: 'daily' | 'weekly' | 'monthly' | 'yearly',
    startDate: string,
    endDate: string
}

Response:
{
    success: true,
    data: {
        totalCustomers: number,
        newCustomers: number,
        repeatCustomers: number,
        customerRetentionRate: number,
        averageOrderValue: number,
        customersByRegion: Array<{
            region: string,
            count: number,
            percentage: number
        }>,
        topCustomers: Array<{
            id: string,
            name: string,
            orders: number,
            totalSpent: number
        }>
    }
}
```

#### Get Product Performance
```typescript
GET /api/v1/seller/analytics/products/performance

Query Parameters:
{
    period: 'daily' | 'weekly' | 'monthly' | 'yearly',
    startDate: string,
    endDate: string
}

Response:
{
    success: true,
    data: {
        totalProducts: number,
        activeProducts: number,
        lowStockProducts: number,
        topPerformingProducts: Array<{
            id: string,
            name: string,
            sales: number,
            revenue: number,
            profit: number
        }>,
        productCategories: Array<{
            category: string,
            products: number,
            sales: number,
            revenue: number
        }>,
        stockLevels: Array<{
            productId: string,
            name: string,
            currentStock: number,
            reorderPoint: number,
            status: 'healthy' | 'low' | 'out'
        }>
    }
}
```

#### Get Financial Reports
```typescript
GET /api/v1/seller/analytics/financial

Query Parameters:
{
    period: 'daily' | 'weekly' | 'monthly' | 'yearly',
    startDate: string,
    endDate: string
}

Response:
{
    success: true,
    data: {
        totalRevenue: number,
        totalOrders: number,
        averageOrderValue: number,
        netProfit: number,
        expenses: {
            shipping: number,
            packaging: number,
            platform: number,
            other: number
        },
        revenueByPeriod: Array<{
            period: string,
            revenue: number,
            orders: number
        }>,
        paymentMethods: Array<{
            method: string,
            count: number,
            amount: number
        }>,
        refunds: {
            total: number,
            count: number,
            byReason: Array<{
                reason: string,
                count: number,
                amount: number
            }>
        }
    }
}
```

## Webhooks

### Webhook Events
```typescript
type WebhookEvent = 
    | 'order.created'
    | 'order.updated'
    | 'order.cancelled'
    | 'payment.success'
    | 'payment.failed'
    | 'shipment.tracked'
    | 'shipment.delivered'
    | 'product.created'
    | 'product.updated'
    | 'product.deleted';
```

### Webhook Payload Structure
```typescript
interface WebhookPayload {
    event: WebhookEvent;
    timestamp: string;
    data: any;
    signature: string;
}
```

### Webhook Security
```typescript
// Webhook Signature Generation
const generateWebhookSignature = (payload: string, secret: string): string => {
    return crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');
};

// Webhook Signature Verification
const verifyWebhookSignature = (
    payload: string,
    signature: string,
    secret: string
): boolean => {
    const expectedSignature = generateWebhookSignature(payload, secret);
    return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
    );
};
```

## File Management

### Upload Configuration
```typescript
const UPLOAD_CONFIG = {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: [
        'image/jpeg',
        'image/png',
        'image/gif',
        'application/pdf'
    ],
    storage: {
        provider: 'aws-s3',
        bucket: process.env.AWS_S3_BUCKET,
        region: process.env.AWS_REGION
    }
};
```

### File Upload Endpoint
```typescript
POST /api/v1/seller/upload
Content-Type: multipart/form-data

Request Body:
{
    file: File,
    type: 'product' | 'document' | 'evidence',
    metadata?: {
        productId?: string,
        documentType?: string
    }
}

Response:
{
    success: true,
    data: {
        url: string,
        filename: string,
        mimeType: string,
        size: number
    }
}
```

## Notifications

### Notification Templates
```typescript
const NOTIFICATION_TEMPLATES = {
    orderReceived: {
        email: {
            subject: 'New Order Received - {orderId}',
            template: 'order-received.html'
        },
        sms: {
            template: 'New order {orderId} received. Amount: {amount}'
        }
    },
    orderStatusUpdate: {
        email: {
            subject: 'Order Status Updated - {orderId}',
            template: 'order-status-update.html'
        },
        sms: {
            template: 'Order {orderId} status updated to {status}'
        }
    },
    lowStock: {
        email: {
            subject: 'Low Stock Alert - {productName}',
            template: 'low-stock.html'
        },
        sms: {
            template: 'Low stock alert for {productName}. Current stock: {stock}'
        }
    }
};
```

### Notification Triggers
```typescript
const NOTIFICATION_TRIGGERS = {
    'order.created': ['orderReceived'],
    'order.status.updated': ['orderStatusUpdate'],
    'product.stock.low': ['lowStock'],
    'payment.success': ['paymentSuccess'],
    'payment.failed': ['paymentFailed']
};
```

## Performance & Caching

### Cache Configuration
```typescript
const CACHE_CONFIG = {
    redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD
    },
    ttl: {
        sellerProfile: 3600,        // 1 hour
        productDetails: 1800,       // 30 minutes
        orderDetails: 1800,         // 30 minutes
        analytics: 300,             // 5 minutes
        rateLimits: 60             // 1 minute
    }
};
```

### Cache Keys
```typescript
const CACHE_KEYS = {
    sellerProfile: (sellerId: string) => `seller:${sellerId}:profile`,
    productDetails: (productId: string) => `product:${productId}:details`,
    orderDetails: (orderId: string) => `order:${orderId}:details`,
    analytics: (type: string, period: string) => `analytics:${type}:${period}`,
    rateLimit: (key: string) => `ratelimit:${key}`
};
```

## Background Processing

### Job Queue Configuration
```typescript
const JOB_QUEUE_CONFIG = {
    redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD
    },
    queues: {
        default: {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 1000
            }
        },
        high: {
            attempts: 5,
            backoff: {
                type: 'exponential',
                delay: 500
            }
        }
    }
};
```

### Job Types
```typescript
type JobType = 
    | 'sendEmail'
    | 'sendSMS'
    | 'generateLabel'
    | 'updateInventory'
    | 'processOrder'
    | 'generateReport'
    | 'cleanupFiles';

interface JobData {
    type: JobType;
    payload: any;
    priority?: 'default' | 'high';
    delay?: number;
}
```

## Security

### Rate Limiting
```typescript
const RATE_LIMIT_CONFIG = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: {
        auth: 5,        // 5 requests per window
        api: 100,       // 100 requests per window
        webhook: 1000   // 1000 requests per window
    }
};
```

### Input Validation
```typescript
const VALIDATION_RULES = {
    phone: /^[0-9]{10}$/,
    pincode: /^[0-9]{6}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    gstin: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
    sku: /^[A-Z0-9-]{3,50}$/
};
```

## Error Handling

### Error Codes
| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input parameters |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

### Error Response Format
```typescript
interface ErrorResponse {
    success: false;
    error: {
        code: string;
        message: string;
        details?: Record<string, string[]>;
    };
}
```

## Deployment

### Environment Variables
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/rocketry_box

# Authentication
JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret

# Storage
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=your-bucket
AWS_REGION=your-region

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email
SMTP_PASSWORD=your-password

# SMS
SMS_PROVIDER=twilio
TWILIO_ACCOUNT_SID=your-sid
TWILIO_AUTH_TOKEN=your-token
TWILIO_PHONE_NUMBER=your-phone
```

### Deployment Checklist
1. Set up PostgreSQL database
2. Configure Redis for caching and job queues
3. Set up AWS S3 for file storage
4. Configure email and SMS services
5. Configure environment variables
6. Run database migrations
7. Deploy the application
8. Set up monitoring and logging
9. Configure SSL certificates
10. Set up CI/CD pipeline
11. Configure backup strategy

### Billing

#### Get Billing Summary
```typescript
GET /api/v1/seller/billing/summary

Query Parameters:
{
    startDate: string,  // ISO date string
    endDate: string     // ISO date string
}

Response:
{
    success: true,
    data: {
        totalAmount: number,
        pendingAmount: number,
        paidAmount: number,
        upcomingPayments: Array<{
            id: string,
            amount: number,
            dueDate: string,
            status: 'pending' | 'paid' | 'overdue'
        }>,
        paymentHistory: Array<{
            id: string,
            amount: number,
            date: string,
            status: string,
            transactionId: string
        }>
    }
}
```

#### Get Invoice Details
```typescript
GET /api/v1/seller/billing/invoices/:invoiceId

Response:
{
    success: true,
    data: {
        id: string,
        amount: number,
        status: string,
        dueDate: string,
        items: Array<{
            description: string,
            quantity: number,
            rate: number,
            amount: number
        }>,
        paymentDetails?: {
            transactionId: string,
            paidAt: string,
            method: string
        }
    }
}
```

#### Download Invoice
```typescript
GET /api/v1/seller/billing/invoices/:invoiceId/download

Response:
{
    success: true,
    data: {
        downloadUrl: string,
        expiresAt: string
    }
}
```

### NDR (Non-Delivery Report)

#### List NDRs
```typescript
GET /api/v1/seller/ndr

Query Parameters:
{
    page?: number,
    limit?: number,
    status?: 'pending' | 'resolved' | 'failed',
    startDate?: string,
    endDate?: string
}

Response:
{
    success: true,
    data: {
        ndrs: Array<{
            id: string,
            orderId: string,
            trackingId: string,
            reason: string,
            status: string,
            createdAt: string,
            updatedAt: string,
            customer: {
                name: string,
                phone: string
            },
            deliveryAddress: {
                street: string,
                city: string,
                state: string,
                pincode: string
            },
            attempts: Array<{
                date: string,
                status: string,
                remarks: string
            }>
        }>,
        meta: {
            page: number,
            limit: number,
            total: number
        }
    }
}
```

#### Update NDR Status
```typescript
PUT /api/v1/seller/ndr/:ndrId
Content-Type: application/json

Request Body:
{
    status: 'resolved' | 'failed',
    remarks: string,
    action: 'redeliver' | 'return' | 'cancel'
}

Response:
{
    success: true,
    data: {
        message: string,
        ndr: {
            id: string,
            status: string,
            updatedAt: string
        }
    }
}
```

### Weight Dispute

#### List Weight Disputes
```typescript
GET /api/v1/seller/weight-disputes

Query Parameters:
{
    page?: number,
    limit?: number,
    status?: 'pending' | 'resolved' | 'rejected',
    startDate?: string,
    endDate?: string
}

Response:
{
    success: true,
    data: {
        disputes: Array<{
            id: string,
            orderId: string,
            trackingId: string,
            claimedWeight: number,
            actualWeight: number,
            difference: number,
            status: string,
            createdAt: string,
            updatedAt: string,
            evidence?: {
                images: string[],
                documents: string[]
            }
        }>,
        meta: {
            page: number,
            limit: number,
            total: number
        }
    }
}
```

#### Submit Weight Dispute
```typescript
POST /api/v1/seller/weight-disputes
Content-Type: application/json

Request Body:
{
    orderId: string,
    claimedWeight: number,
    evidence: {
        images: string[],  // base64 encoded
        documents: string[] // base64 encoded
    },
    remarks: string
}

Response:
{
    success: true,
    data: {
        id: string,
        status: string,
        createdAt: string
    }
}
```

#### Update Weight Dispute
```typescript
PUT /api/v1/seller/weight-disputes/:disputeId
Content-Type: application/json

Request Body:
{
    status: 'resolved' | 'rejected',
    remarks: string,
    resolution: {
        acceptedWeight: number,
        adjustment: number
    }
}

Response:
{
    success: true,
    data: {
        message: string,
        dispute: {
            id: string,
            status: string,
            updatedAt: string
        }
    }
}
```

### Wallet

#### Get Wallet Balance
```typescript
GET /api/v1/seller/wallet/balance

Response:
{
    success: true,
    data: {
        balance: number,
        currency: string,
        lastUpdated: string,
        pendingAmount: number,
        availableAmount: number
    }
}
```

#### Get Wallet Transactions
```typescript
GET /api/v1/seller/wallet/transactions

Query Parameters:
{
    page?: number,
    limit?: number,
    type?: 'credit' | 'debit',
    startDate?: string,
    endDate?: string
}

Response:
{
    success: true,
    data: {
        transactions: Array<{
            id: string,
            type: string,
            amount: number,
            balance: number,
            description: string,
            referenceId: string,
            createdAt: string
        }>,
        meta: {
            page: number,
            limit: number,
            total: number
        }
    }
}
```

#### Request Withdrawal
```typescript
POST /api/v1/seller/wallet/withdraw
Content-Type: application/json

Request Body:
{
    amount: number,
    bankDetails: {
        accountNumber: string,
        ifscCode: string,
        accountHolderName: string
    }
}

Response:
{
    success: true,
    data: {
        id: string,
        amount: number,
        status: string,
        estimatedProcessingTime: string
    }
}
```

### COD (Cash on Delivery)

#### Get COD Summary
```typescript
GET /api/v1/seller/cod/summary

Query Parameters:
{
    startDate: string,
    endDate: string
}

Response:
{
    success: true,
    data: {
        totalAmount: number,
        pendingAmount: number,
        collectedAmount: number,
        orders: {
            total: number,
            pending: number,
            collected: number
        },
        collectionByDate: Array<{
            date: string,
            amount: number,
            orders: number
        }>
    }
}
```

#### List COD Orders
```typescript
GET /api/v1/seller/cod/orders

Query Parameters:
{
    page?: number,
    limit?: number,
    status?: 'pending' | 'collected' | 'failed',
    startDate?: string,
    endDate?: string
}

Response:
{
    success: true,
    data: {
        orders: Array<{
            id: string,
            trackingId: string,
            amount: number,
            status: string,
            createdAt: string,
            collectedAt?: string,
            customer: {
                name: string,
                phone: string
            },
            deliveryAddress: {
                street: string,
                city: string,
                state: string,
                pincode: string
            }
        }>,
        meta: {
            page: number,
            limit: number,
            total: number
        }
    }
}
```

#### Update COD Status
```typescript
PUT /api/v1/seller/cod/orders/:orderId
Content-Type: application/json

Request Body:
{
    status: 'collected' | 'failed',
    remarks: string,
    collectionDetails?: {
        amount: number,
        collectedAt: string,
        collectedBy: string
    }
}

Response:
{
    success: true,
    data: {
        message: string,
        order: {
            id: string,
            status: string,
            updatedAt: string
        }
    }
}
```

### Rate Card

#### Get Rate Card
```typescript
GET /api/v1/seller/rate-card

Response:
{
    success: true,
    data: {
        rateBand: string,
        lastUpdated: string,
        couriers: Array<{
            name: string,
            rates: {
                withinCity: number,
                withinState: number,
                metroToMetro: number,
                restOfIndia: number,
                northEastJK: number
            },
            codCharge: number,
            codPercent: number
        }>
    }
}
```

### Order Statistics

#### Get Order Stats
```typescript
GET /api/v1/seller/orders/stats

Query Parameters:
{
    from?: string,    // ISO date string
    to?: string,      // ISO date string
    status?: string
}

Response:
{
    success: true,
    data: {
        total: number,
        notBooked: number,
        processing: number,
        booked: number,
        cancelled: number,
        shipmentCancelled: number,
        error: number
    }
}
```

### Seller Settings

#### Get Settings
```typescript
GET /api/v1/seller/settings

Response:
{
    success: true,
    data: {
        autoFetch: boolean,
        autoCreate: boolean,
        autoNotify: boolean,
        defaultShippingMode: 'standard' | 'express' | 'cod',
        autoSelectCourier: boolean,
        codAvailable: boolean,
        courierSettings: Array<{
            courierId: number,
            enabled: boolean,
            priority: number
        }>,
        labelSettings: {
            size: string,
            format: string,
            logo?: string,
            showLogo: boolean,
            showBarcode: boolean,
            showReturn: boolean,
            additionalText: string
        },
        whatsappSettings: {
            enabled: boolean,
            businessNumber?: string,
            apiKey?: string,
            notifications: {
                orderConfirmation: boolean,
                orderPacked: boolean,
                outForDelivery: boolean,
                deliveryConfirmation: boolean,
                deliveryFailed: boolean,
                returnInitiated: boolean,
                returnPicked: boolean,
                returnDelivered: boolean
            },
            templates?: {
                orderConfirmation?: string,
                deliveryConfirmation?: string
            }
        },
        apiSettings: {
            apiKey: string,
            apiSecret: string,
            enabled: boolean,
            webhookEnabled: boolean,
            webhookUrl: string
        }
    }
}
```

#### Update Settings
```typescript
PUT /api/v1/seller/settings
Content-Type: application/json

Request Body:
{
    autoFetch?: boolean,
    autoCreate?: boolean,
    autoNotify?: boolean,
    defaultShippingMode?: 'standard' | 'express' | 'cod',
    autoSelectCourier?: boolean,
    codAvailable?: boolean,
    courierSettings?: Array<{
        courierId: number,
        enabled: boolean,
        priority: number
    }>,
    labelSettings?: {
        size?: string,
        format?: string,
        logo?: string,
        showLogo?: boolean,
        showBarcode?: boolean,
        showReturn?: boolean,
        additionalText?: string
    },
    whatsappSettings?: {
        enabled?: boolean,
        businessNumber?: string,
        apiKey?: string,
        notifications?: {
            orderConfirmation?: boolean,
            orderPacked?: boolean,
            outForDelivery?: boolean,
            deliveryConfirmation?: boolean,
            deliveryFailed?: boolean,
            returnInitiated?: boolean,
            returnPicked?: boolean,
            returnDelivered?: boolean
        },
        templates?: {
            orderConfirmation?: string,
            deliveryConfirmation?: string
        }
    },
    apiSettings?: {
        enabled?: boolean,
        webhookEnabled?: boolean,
        webhookUrl?: string
    }
}

Response:
{
    success: true,
    data: {
        message: string,
        settings: {
            updatedAt: string
        }
    }
}
```

### Service Check

#### Check Service Availability
```typescript
POST /api/v1/seller/service-check
Content-Type: application/json

Request Body:
{
    pickupPincode: string,
    deliveryPincode: string,
    weight: number,
    codAmount?: number
}

Response:
{
    success: true,
    data: {
        available: boolean,
        services: Array<{
            courierId: number,
            courierName: string,
            serviceType: string,
            estimatedDelivery: string,
            rate: number,
            codAvailable: boolean,
            codCharge: number
        }>
    }
}
```

### Warehouse Management

#### List Warehouses
```typescript
GET /api/v1/seller/warehouses

Response:
{
    success: true,
    data: {
        warehouses: Warehouse[],
        meta: PaginationMeta
    }
}
```

#### Create Warehouse
```typescript
POST /api/v1/seller/warehouses
Content-Type: application/json

Request Body:
{
    name: string,
    address: Address,
    contactPerson: string,
    contactPhone: string,
    isDefault: boolean,
    operatingHours: {
        start: string,
        end: string,
        timezone: string
    }
}

Response:
{
    success: true,
    data: {
        message: string,
        warehouse: Warehouse
    }
}
```

#### Update Warehouse
```typescript
PUT /api/v1/seller/warehouses/:warehouseId
Content-Type: application/json

Request Body:
{
    name?: string,
    address?: Address,
    contactPerson?: string,
    contactPhone?: string,
    isDefault?: boolean,
    operatingHours?: {
        start: string,
        end: string,
        timezone: string
    }
}

Response:
{
    success: true,
    data: {
        message: string,
        warehouse: Warehouse
    }
}
```

#### Delete Warehouse
```typescript
DELETE /api/v1/seller/warehouses/:warehouseId

Response:
{
    success: true,
    data: {
        message: string
    }
}
```

### Return Management

#### List Returns
```typescript
GET /api/v1/seller/returns

Query Parameters:
{
    page?: number,
    limit?: number,
    status?: ReturnStatus,
    startDate?: string,
    endDate?: string
}

Response:
{
    success: true,
    data: {
        returns: Return[],
        meta: PaginationMeta
    }
}
```

#### Get Return Details
```typescript
GET /api/v1/seller/returns/:returnId

Response:
{
    success: true,
    data: Return
}
```

#### Update Return Status
```typescript
PUT /api/v1/seller/returns/:returnId/status
Content-Type: application/json

Request Body:
{
    status: ReturnStatus,
    reason?: string,
    notes?: string
}

Response:
{
    success: true,
    data: {
        message: string,
        return: Return
    }
}
```

### Shipping Rate Cards

#### List Rate Cards
```typescript
GET /api/v1/seller/rate-cards

Response:
{
    success: true,
    data: {
        rateCards: RateCard[],
        meta: PaginationMeta
    }
}
```

#### Create Rate Card
```typescript
POST /api/v1/seller/rate-cards
Content-Type: application/json

Request Body:
{
    name: string,
    courier: string,
    serviceType: ServiceType,
    weightSlabs: WeightSlab[],
    zones: Zone[],
    isDefault: boolean
}

Response:
{
    success: true,
    data: {
        message: string,
        rateCard: RateCard
    }
}
```

#### Update Rate Card
```typescript
PUT /api/v1/seller/rate-cards/:rateCardId
Content-Type: application/json

Request Body:
{
    name?: string,
    weightSlabs?: WeightSlab[],
    zones?: Zone[],
    isDefault?: boolean
}

Response:
{
    success: true,
    data: {
        message: string,
        rateCard: RateCard
    }
}
```

### Service Availability Check

#### Check Service Availability
```typescript
POST /api/v1/seller/service-check
Content-Type: application/json

Request Body:
{
    sourcePincode: string,
    destinationPincode: string,
    weight: number,
    dimensions: Dimensions,
    serviceType?: ServiceType
}

Response:
{
    success: true,
    data: {
        available: boolean,
        services: ServiceAvailability[],
        estimatedDelivery: string
    }
}
```

### Bulk Operations

#### Bulk Product Update
```typescript
POST /api/v1/seller/products/bulk-update
Content-Type: application/json

Request Body:
{
    products: {
        id: string,
        price?: number,
        stock?: number,
        status?: ProductStatus
    }[]
}

Response:
{
    success: true,
    data: {
        message: string,
        updated: number,
        failed: number,
        errors?: Record<string, string>
    }
}
```

#### Bulk Order Processing
```typescript
POST /api/v1/seller/orders/bulk-process
Content-Type: application/json

Request Body:
{
    orders: {
        id: string,
        status: OrderStatus,
        trackingId?: string,
        courier?: string
    }[]
}

Response:
{
    success: true,
    data: {
        message: string,
        processed: number,
        failed: number,
        errors?: Record<string, string>
    }
}
```

#### Bulk Inventory Update
```typescript
POST /api/v1/seller/inventory/bulk-update
Content-Type: application/json

Request Body:
{
    inventory: {
        productId: string,
        warehouseId: string,
        quantity: number,
        type: 'add' | 'remove'
    }[]
}

Response:
{
    success: true,
    data: {
        message: string,
        updated: number,
        failed: number,
        errors?: Record<string, string>
    }
}
```

### User Management

#### List Team Members
```typescript
GET /api/v1/seller/team

Response:
{
    success: true,
    data: {
        members: Array<{
            id: string,
            name: string,
            email: string,
            role: 'admin' | 'manager' | 'operator',
            status: 'active' | 'inactive',
            lastActive: string,
            permissions: Array<string>
        }>
    }
}
```

#### Add Team Member
```typescript
POST /api/v1/seller/team
Content-Type: application/json

Request Body:
{
    name: string,
    email: string,
    role: 'admin' | 'manager' | 'operator',
    permissions: Array<string>
}

Response:
{
    success: true,
    data: {
        id: string,
        name: string,
        email: string,
        role: string,
        status: string,
        createdAt: string
    }
}
```

#### Update Team Member
```typescript
PUT /api/v1/seller/team/:memberId
Content-Type: application/json

Request Body:
{
    name?: string,
    role?: 'admin' | 'manager' | 'operator',
    permissions?: Array<string>,
    status?: 'active' | 'inactive'
}

Response:
{
    success: true,
    data: {
        message: string,
        member: {
            id: string,
            name: string,
            email: string,
            role: string,
            status: string,
            updatedAt: string
        }
    }
}
```

#### Remove Team Member
```typescript
DELETE /api/v1/seller/team/:memberId

Response:
{
    success: true,
    data: {
        message: string
    }
} 