# Rocketry Box Customer API Documentation

## Table of Contents
1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Authentication](#authentication)
4. [API Endpoints](#api-endpoints)
5. [Data Models](#data-models)
6. [Webhooks](#webhooks)
7. [File Management](#file-management)
8. [Notifications](#notifications)
9. [Performance & Caching](#performance--caching)
10. [Security](#security)
11. [Error Handling](#error-handling)
12. [Deployment](#deployment)

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
    user: CustomerProfile;
}

interface RegisterRequest {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    acceptTerms: boolean;
}

// Customer Types
interface CustomerProfile {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: 'active' | 'inactive' | 'suspended';
    emailVerified: boolean;
    phoneVerified: boolean;
    addresses: Address[];
    preferences: CustomerPreferences;
    createdAt: string;
    updatedAt: string;
    lastLogin?: string;
}

interface CustomerPreferences {
    language: string;
    currency: string;
    notifications: NotificationPreferences;
    marketingConsent: boolean;
    theme: 'light' | 'dark' | 'system';
}

interface NotificationPreferences {
    email: boolean;
    sms: boolean;
    push: boolean;
    orderUpdates: boolean;
    promotions: boolean;
    newsletters: boolean;
}

// Order Types
interface Order {
    id: string;
    trackingId: string;
    status: OrderStatus;
    customer: CustomerInfo;
    deliveryAddress: Address;
    package: PackageInfo;
    timeline: OrderTimeline[];
    payment: PaymentInfo;
    serviceType: ServiceType;
    estimatedDelivery: string;
    shippingLabel?: ShippingLabel;
    createdAt: string;
    updatedAt: string;
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

interface Dimensions {
    length: number;
    width: number;
    height: number;
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

// Cart Types
interface Cart {
    id: string;
    items: CartItem[];
    total: number;
    currency: string;
    createdAt: string;
    updatedAt: string;
}

interface CartItem {
    productId: string;
    quantity: number;
    price: number;
    name: string;
    image?: string;
}

// Wishlist Types
interface Wishlist {
    id: string;
    items: WishlistItem[];
    createdAt: string;
    updatedAt: string;
}

interface WishlistItem {
    productId: string;
    addedAt: string;
    product: Product;
}

// Review Types
interface Review {
    id: string;
    productId: string;
    customerId: string;
    rating: number;
    title: string;
    comment: string;
    images?: string[];
    helpful: number;
    status: ReviewStatus;
    createdAt: string;
    updatedAt: string;
}

type ReviewStatus = 'pending' | 'approved' | 'rejected';

// Support Types
interface SupportTicket {
    id: string;
    subject: string;
    description: string;
    priority: TicketPriority;
    category: TicketCategory;
    status: TicketStatus;
    messages: TicketMessage[];
    attachments?: TicketAttachment[];
    createdAt: string;
    lastUpdated: string;
}

type TicketPriority = 'low' | 'medium' | 'high';
type TicketCategory = 'technical' | 'billing' | 'shipping' | 'other';
type TicketStatus = 'open' | 'in-progress' | 'resolved' | 'closed';

interface TicketMessage {
    id: string;
    sender: 'customer' | 'support';
    content: string;
    attachments?: TicketAttachment[];
    createdAt: string;
}

interface TicketAttachment {
    name: string;
    url: string;
    type: string;
    size: number;
}

// Notification Types
interface Notification {
    id: string;
    type: NotificationType;
    status: NotificationStatus;
    recipient: string;
    content: NotificationContent;
    metadata: NotificationMetadata;
    createdAt: string;
    sentAt?: string;
}

type NotificationType = 'email' | 'sms' | 'push' | 'in-app';
type NotificationStatus = 'pending' | 'sent' | 'delivered' | 'failed';

interface NotificationContent {
    subject?: string;
    body: string;
    template?: string;
    variables?: Record<string, string>;
}

interface NotificationMetadata {
    orderId?: string;
    ticketId?: string;
    priority: 'low' | 'medium' | 'high';
    retryCount: number;
    error?: string;
}

// Payment Types
interface Payment {
    id: string;
    orderId: string;
    amount: number;
    currency: string;
    status: PaymentStatus;
    method: PaymentMethod;
    details: PaymentDetails;
    createdAt: string;
    updatedAt: string;
}

interface PaymentDetails {
    transactionId?: string;
    gateway?: string;
    cardDetails?: CardDetails;
    bankDetails?: BankDetails;
    upiDetails?: UpiDetails;
}

interface CardDetails {
    last4: string;
    brand: string;
    expiryMonth: number;
    expiryYear: number;
}

interface BankDetails {
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
}

interface UpiDetails {
    upiId: string;
    provider: string;
}

// Refund Types
interface Refund {
    id: string;
    orderId: string;
    paymentId: string;
    amount: number;
    reason: string;
    status: RefundStatus;
    processedAt?: string;
    createdAt: string;
    updatedAt: string;
}

type RefundStatus = 'pending' | 'processing' | 'completed' | 'failed';

// Coupon Types
interface Coupon {
    id: string;
    code: string;
    type: CouponType;
    value: number;
    minOrderValue?: number;
    maxDiscount?: number;
    startDate: string;
    endDate: string;
    usageLimit?: number;
    usedCount: number;
    status: CouponStatus;
    createdAt: string;
    updatedAt: string;
}

type CouponType = 'percentage' | 'fixed';
type CouponStatus = 'active' | 'inactive' | 'expired';

// Analytics Types
interface CustomerAnalytics {
    orders: OrderAnalytics;
    products: ProductAnalytics;
    payments: PaymentAnalytics;
    activity: ActivityAnalytics;
}

interface OrderAnalytics {
    total: number;
    totalSpent: number;
    averageOrderValue: number;
    lastOrderDate?: string;
    orderHistory: OrderHistory[];
}

interface OrderHistory {
    date: string;
    count: number;
    amount: number;
}

interface ProductAnalytics {
    viewed: number;
    purchased: number;
    wishlisted: number;
    categories: CategoryAnalytics[];
}

interface CategoryAnalytics {
    category: string;
    count: number;
    amount: number;
}

interface PaymentAnalytics {
    totalSpent: number;
    paymentMethods: PaymentMethodAnalytics[];
    refunds: RefundAnalytics;
}

interface PaymentMethodAnalytics {
    method: PaymentMethod;
    count: number;
    amount: number;
}

interface RefundAnalytics {
    total: number;
    count: number;
    reasons: Record<string, number>;
}

interface ActivityAnalytics {
    lastLogin: string;
    loginCount: number;
    reviewCount: number;
    supportTickets: number;
}
```

## API Endpoints

### Authentication

#### Login
```typescript
POST /api/v1/customer/auth/login
Content-Type: application/json

Request Body:
{
    email: string,
    password: string,
    otp?: string
}

Response:
{
    success: true,
    data: {
        accessToken: string,
        refreshToken: string,
        user: CustomerProfile
    }
}
```

#### Register
```typescript
POST /api/v1/customer/auth/register
Content-Type: application/json

Request Body:
{
    name: string,
    email: string,
    phone: string,
    password: string,
    confirmPassword: string,
    acceptTerms: boolean
}

Response:
{
    success: true,
    data: {
        message: string,
        user: CustomerProfile
    }
}
```

### Profile

#### Get Profile
```typescript
GET /api/v1/customer/profile

Response:
{
    success: true,
    data: CustomerProfile
}
```

#### Update Profile
```typescript
PUT /api/v1/customer/profile
Content-Type: application/json

Request Body:
{
    name?: string,
    phone?: string,
    preferences?: CustomerPreferences
}

Response:
{
    success: true,
    data: {
        message: string,
        profile: CustomerProfile
    }
}
```

### Addresses

#### List Addresses
```typescript
GET /api/v1/customer/addresses

Response:
{
    success: true,
    data: {
        addresses: Address[]
    }
}
```

#### Add Address
```typescript
POST /api/v1/customer/addresses
Content-Type: application/json

Request Body:
{
    street: string,
    city: string,
    state: string,
    pincode: string,
    country: string,
    contactName?: string,
    contactPhone?: string
}

Response:
{
    success: true,
    data: {
        message: string,
        address: Address
    }
}
```

### Orders

#### List Orders
```typescript
GET /api/v1/customer/orders

Query Parameters:
{
    page?: number,
    limit?: number,
    status?: OrderStatus,
    startDate?: string,
    endDate?: string
}

Response:
{
    success: true,
    data: {
        orders: Order[],
        meta: PaginationMeta
    }
}
```

#### Get Order Details
```typescript
GET /api/v1/customer/orders/:orderId

Response:
{
    success: true,
    data: Order
}
```

#### Get Order Tracking
```typescript
GET /api/v1/customer/orders/:orderId/tracking

Response:
{
    success: true,
    data: {
        orderId: string,
        trackingId: string,
        status: OrderStatus,
        currentLocation: string,
        estimatedDelivery: string,
        timeline: TrackingTimeline[],
        courier: {
            name: string,
            trackingUrl: string,
            phone: string
        }
    }
}
```

#### Subscribe to Tracking Updates
```typescript
POST /api/v1/customer/orders/:orderId/tracking/subscribe
Content-Type: application/json

Request Body:
{
    channels: NotificationChannel[],
    frequency: 'realtime' | 'daily' | 'status-change'
}

Response:
{
    success: true,
    data: {
        message: string,
        subscription: TrackingSubscription
    }
}
```

### Cart

#### Get Cart
```typescript
GET /api/v1/customer/cart

Response:
{
    success: true,
    data: Cart
}
```

#### Add to Cart
```typescript
POST /api/v1/customer/cart/items
Content-Type: application/json

Request Body:
{
    productId: string,
    quantity: number
}

Response:
{
    success: true,
    data: {
        message: string,
        cart: Cart
    }
}
```

### Wishlist

#### Get Wishlist
```typescript
GET /api/v1/customer/wishlist

Response:
{
    success: true,
    data: Wishlist
}
```

#### Add to Wishlist
```typescript
POST /api/v1/customer/wishlist/items
Content-Type: application/json

Request Body:
{
    productId: string
}

Response:
{
    success: true,
    data: {
        message: string,
        wishlist: Wishlist
    }
}
```

### Reviews

#### List Reviews
```typescript
GET /api/v1/customer/reviews

Query Parameters:
{
    page?: number,
    limit?: number,
    productId?: string
}

Response:
{
    success: true,
    data: {
        reviews: Review[],
        meta: PaginationMeta
    }
}
```

#### Create Review
```typescript
POST /api/v1/customer/reviews
Content-Type: application/json

Request Body:
{
    productId: string,
    rating: number,
    title: string,
    comment: string,
    images?: string[]
}

Response:
{
    success: true,
    data: {
        message: string,
        review: Review
    }
}
```

### Support

#### List Tickets
```typescript
GET /api/v1/customer/support/tickets

Query Parameters:
{
    page?: number,
    limit?: number,
    status?: TicketStatus
}

Response:
{
    success: true,
    data: {
        tickets: SupportTicket[],
        meta: PaginationMeta
    }
}
```

#### Create Ticket
```typescript
POST /api/v1/customer/support/tickets
Content-Type: application/json

Request Body:
{
    subject: string,
    description: string,
    priority: TicketPriority,
    category: TicketCategory,
    attachments?: File[]
}

Response:
{
    success: true,
    data: {
        message: string,
        ticket: SupportTicket
    }
}
```

### Payments

#### List Payments
```typescript
GET /api/v1/customer/payments

Query Parameters:
{
    page?: number,
    limit?: number,
    status?: PaymentStatus
}

Response:
{
    success: true,
    data: {
        payments: Payment[],
        meta: PaginationMeta
    }
}
```

#### Request Refund
```typescript
POST /api/v1/customer/payments/:paymentId/refund
Content-Type: application/json

Request Body:
{
    reason: string,
    amount: number
}

Response:
{
    success: true,
    data: {
        message: string,
        refund: Refund
    }
}
```

#### List Payment Methods
```typescript
GET /api/v1/customer/payment-methods

Response:
{
    success: true,
    data: {
        methods: PaymentMethod[],
        defaultMethod?: string
    }
}
```

#### Add Payment Method
```typescript
POST /api/v1/customer/payment-methods
Content-Type: application/json

Request Body:
{
    type: PaymentMethodType,
    details: CardDetails | BankDetails | UpiDetails,
    isDefault?: boolean
}

Response:
{
    success: true,
    data: {
        message: string,
        method: PaymentMethod
    }
}
```

#### Update Payment Method
```typescript
PUT /api/v1/customer/payment-methods/:methodId
Content-Type: application/json

Request Body:
{
    isDefault?: boolean,
    details?: CardDetails | BankDetails | UpiDetails
}

Response:
{
    success: true,
    data: {
        message: string,
        method: PaymentMethod
    }
}
```

#### Delete Payment Method
```typescript
DELETE /api/v1/customer/payment-methods/:methodId

Response:
{
    success: true,
    data: {
        message: string
    }
}
```

### Coupons

#### List Available Coupons
```typescript
GET /api/v1/customer/coupons

Query Parameters:
{
    page?: number,
    limit?: number
}

Response:
{
    success: true,
    data: {
        coupons: Coupon[],
        meta: PaginationMeta
    }
}
```

#### Apply Coupon
```typescript
POST /api/v1/customer/cart/apply-coupon
Content-Type: application/json

Request Body:
{
    code: string
}

Response:
{
    success: true,
    data: {
        message: string,
        cart: Cart
    }
}
```

### Analytics

#### Get Customer Analytics
```typescript
GET /api/v1/customer/analytics

Response:
{
    success: true,
    data: CustomerAnalytics
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
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^[0-9]{10}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    pincode: /^[0-9]{6}$/
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
2. Configure Redis for caching
3. Set up AWS S3 for file storage
4. Configure email and SMS services
5. Configure environment variables
6. Run database migrations
7. Deploy the application
8. Set up monitoring and logging
9. Configure SSL certificates
10. Set up CI/CD pipeline
11. Configure backup strategy 

### Subscription Management

#### List Subscriptions
```typescript
GET /api/v1/customer/subscriptions

Query Parameters:
{
    page?: number,
    limit?: number,
    status?: SubscriptionStatus
}

Response:
{
    success: true,
    data: {
        subscriptions: Subscription[],
        meta: PaginationMeta
    }
}
```

#### Create Subscription
```typescript
POST /api/v1/customer/subscriptions
Content-Type: application/json

Request Body:
{
    productId: string,
    quantity: number,
    frequency: SubscriptionFrequency,
    startDate: string,
    paymentMethod: string,
    shippingAddress: string,
    preferences: SubscriptionPreferences
}

Response:
{
    success: true,
    data: {
        message: string,
        subscription: Subscription
    }
}
```

#### Update Subscription
```typescript
PUT /api/v1/customer/subscriptions/:subscriptionId
Content-Type: application/json

Request Body:
{
    quantity?: number,
    frequency?: SubscriptionFrequency,
    paymentMethod?: string,
    shippingAddress?: string,
    preferences?: SubscriptionPreferences,
    status?: SubscriptionStatus
}

Response:
{
    success: true,
    data: {
        message: string,
        subscription: Subscription
    }
}
```

### Gift Cards

#### List Gift Cards
```typescript
GET /api/v1/customer/gift-cards

Query Parameters:
{
    page?: number,
    limit?: number,
    status?: GiftCardStatus
}

Response:
{
    success: true,
    data: {
        giftCards: GiftCard[],
        meta: PaginationMeta
    }
}
```

#### Purchase Gift Card
```typescript
POST /api/v1/customer/gift-cards
Content-Type: application/json

Request Body:
{
    amount: number,
    quantity: number,
    message?: string,
    recipientEmail?: string,
    paymentMethod: string
}

Response:
{
    success: true,
    data: {
        message: string,
        giftCards: GiftCard[]
    }
}
```

#### Redeem Gift Card
```typescript
POST /api/v1/customer/gift-cards/redeem
Content-Type: application/json

Request Body:
{
    code: string
}

Response:
{
    success: true,
    data: {
        message: string,
        balance: number
    }
}
```

### Loyalty Program

#### Get Loyalty Status
```typescript
GET /api/v1/customer/loyalty

Response:
{
    success: true,
    data: {
        points: number,
        tier: LoyaltyTier,
        nextTier: {
            name: string,
            pointsRequired: number,
            pointsNeeded: number
        },
        benefits: LoyaltyBenefit[]
    }
}
```

#### Get Loyalty History
```typescript
GET /api/v1/customer/loyalty/history

Query Parameters:
{
    page?: number,
    limit?: number,
    type?: 'earn' | 'redeem'
}

Response:
{
    success: true,
    data: {
        history: LoyaltyTransaction[],
        meta: PaginationMeta
    }
}
```

#### Redeem Loyalty Points
```typescript
POST /api/v1/customer/loyalty/redeem
Content-Type: application/json

Request Body:
{
    points: number,
    type: 'discount' | 'product' | 'service'
}

Response:
{
    success: true,
    data: {
        message: string,
        redemption: LoyaltyRedemption
    }
}
```

// Add these types to the Data Models section
interface TrackingTimeline {
    status: OrderStatus;
    location: string;
    timestamp: string;
    description: string;
}

interface TrackingSubscription {
    id: string;
    orderId: string;
    channels: NotificationChannel[];
    frequency: 'realtime' | 'daily' | 'status-change';
    status: 'active' | 'paused' | 'cancelled';
    createdAt: string;
    updatedAt: string;
}

type NotificationChannel = 'email' | 'sms' | 'push';

interface PaymentMethod {
    id: string;
    type: PaymentMethodType;
    details: CardDetails | BankDetails | UpiDetails;
    isDefault: boolean;
    status: 'active' | 'inactive';
    createdAt: string;
    updatedAt: string;
}

type PaymentMethodType = 'card' | 'bank' | 'upi';

interface Subscription {
    id: string;
    productId: string;
    quantity: number;
    frequency: SubscriptionFrequency;
    startDate: string;
    nextDelivery: string;
    paymentMethod: string;
    shippingAddress: string;
    preferences: SubscriptionPreferences;
    status: SubscriptionStatus;
    createdAt: string;
    updatedAt: string;
}

type SubscriptionFrequency = 'weekly' | 'biweekly' | 'monthly' | 'quarterly';
type SubscriptionStatus = 'active' | 'paused' | 'cancelled';

interface SubscriptionPreferences {
    deliveryDay?: number;
    deliveryTime?: string;
    skipNext?: boolean;
    pauseUntil?: string;
}

interface GiftCard {
    id: string;
    code: string;
    amount: number;
    balance: number;
    status: GiftCardStatus;
    issuedAt: string;
    expiresAt?: string;
    redeemedAt?: string;
    message?: string;
    sender?: string;
    recipient?: string;
}

type GiftCardStatus = 'active' | 'redeemed' | 'expired';

interface LoyaltyTier {
    name: string;
    level: number;
    pointsRequired: number;
    benefits: LoyaltyBenefit[];
}

interface LoyaltyBenefit {
    type: string;
    description: string;
    value: number;
}

interface LoyaltyTransaction {
    id: string;
    type: 'earn' | 'redeem';
    points: number;
    description: string;
    orderId?: string;
    createdAt: string;
}

interface LoyaltyRedemption {
    id: string;
    points: number;
    type: 'discount' | 'product' | 'service';
    value: number;
    status: 'pending' | 'completed' | 'failed';
    createdAt: string;
} 