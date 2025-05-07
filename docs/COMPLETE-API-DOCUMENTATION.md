# Rocketry Box API Documentation

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

## Overview

The Rocketry Box API provides a comprehensive set of endpoints for managing shipping and logistics operations. This documentation covers both the marketing and customer sections of the platform.

### Base URL
```
Production: https://api.rocketrybox.com/v1
Staging: https://staging-api.rocketrybox.com/v1
```

### API Versioning
The API uses URL versioning. The current version is v1. All endpoints are prefixed with `/api/v1/`.

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
    sub: string;        // user id
    role: string;       // user role
    email: string;      // user email
    iat: number;        // issued at
    exp: number;        // expiration time
    jti: string;        // unique token id
}
```

### Token Configuration
```typescript
const JWT_CONFIG = {
    accessToken: {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: '15m',
        algorithm: 'HS256'
    },
    refreshToken: {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
        algorithm: 'HS256'
    }
};
```

### Authentication Endpoints

#### Login
```typescript
POST /api/v1/auth/login
Content-Type: application/json

Request Body:
{
    phoneOrEmail: string,    // email or 10-digit phone
    password: string,        // required
    otp?: string,           // 6 digits (for forgot password)
    rememberMe: boolean     // optional, defaults to false
}

Response:
{
    success: true,
    data: {
        accessToken: string,
        refreshToken: string,
        user: {
            id: string,
            name: string,
            email: string,
            phone: string,
            role: 'customer'
        }
    }
}
```

#### Registration
```typescript
POST /api/v1/auth/register
Content-Type: application/json

Request Body:
{
    name: string,          // min 2 characters
    mobile: string,        // exactly 10 digits
    mobileOtp: string,     // exactly 6 digits
    email: string,         // valid email format
    emailOtp: string,      // exactly 6 digits
    password: string,      // see password rules
    confirmPassword: string,// must match password
    address1: string,      // required
    address2?: string,     // optional
    city: string,         // required
    state: string,        // required
    pincode: string,      // exactly 6 digits
    acceptTerms: boolean   // must be true
}

Password Rules:
- Minimum length: 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character
```

#### Refresh Token
```typescript
POST /api/v1/auth/refresh
Content-Type: application/json

Request Body:
{
    refreshToken: string
}

Response:
{
    success: true,
    data: {
        accessToken: string,
        refreshToken: string
    }
}
```

## API Endpoints

### Marketing Section

#### Contact Form
```typescript
POST /api/v1/contact
Content-Type: application/json

Request Body:
{
    name: string,      // min: 2, max: 50 characters
    email: string,     // valid email format
    subject: string,   // min: 5, max: 100 characters
    message: string,   // min: 10, max: 1000 characters
    companyName?: string  // optional
}

Response:
{
    success: true,
    data: {
        id: string,
        message: string,
        createdAt: string
    }
}
```

#### Shipment Tracking
```typescript
GET /api/v1/shipments/track/:trackingId

Parameters:
- trackingId: string (format: RB-XXXXX-XXXXX)

Response:
{
    success: true,
    data: {
        trackingId: string,
        status: string,
        currentLocation: string,
        estimatedDelivery: string,
        timeline: Array<{
            status: string,
            location: string,
            timestamp: string,
            description: string
        }>,
        package: {
            weight: number,
            dimensions: {
                length: number,
                width: number,
                height: number
            }
        }
    }
}
```

### Customer Section

#### Orders

##### Create Order
```typescript
POST /api/v1/customer/orders
Content-Type: application/json

Request Body:
{
    pickupAddress: {
        street: string,
        city: string,
        state: string,
        pincode: string,
        country: string,
        contactName: string,
        contactPhone: string
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
        weight: number,  // in kg
        length: number,  // in cm
        width: number,   // in cm
        height: number,  // in cm
        items: Array<{
            name: string,
            quantity: number,
            value: number
        }>,
        totalValue: number
    },
    serviceType: 'express' | 'standard',
    paymentMethod: 'prepaid' | 'cod'
}

Response:
{
    success: true,
    data: {
        orderId: string,
        trackingId: string,
        status: string,
        paymentUrl?: string,
        amount: number,
        currency: string,
        estimatedDelivery: string
    }
}
```

##### List Orders
```typescript
GET /api/v1/customer/orders

Query Parameters:
{
    page?: number,      // default: 1
    limit?: number,     // default: 10, max: 50
    status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled',
    startDate?: string, // ISO date string
    endDate?: string    // ISO date string
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
            pickupAddress: {
                street: string,
                city: string,
                state: string,
                pincode: string,
                country: string,
                contactName: string,
                contactPhone: string
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

##### Order Details
```typescript
GET /api/v1/customer/orders/:orderId

Response:
{
    success: true,
    data: {
        id: string,
        trackingId: string,
        status: string,
        createdAt: string,
        updatedAt: string,
        pickupAddress: {
            street: string,
            city: string,
            state: string,
            pincode: string,
            country: string,
            contactName: string,
            contactPhone: string
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
        estimatedDelivery: string
    }
}
```

#### Profile Management
```typescript
// Get Profile
GET /api/v1/customer/profile

Response:
{
    success: true,
    data: {
        id: string,
        name: string,
        email: string,
        phone: string,
        addresses: Array<{
            id: string,
            street: string,
            city: string,
            state: string,
            pincode: string,
            country: string,
            contactName: string,
            contactPhone: string,
            isDefault: boolean,
            addressType: 'pickup' | 'delivery'
        }>,
        preferences: {
            notifications: {
                email: boolean,
                sms: boolean
            }
        },
        createdAt: string,
        updatedAt: string
    }
}

// Update Profile
PUT /api/v1/customer/profile
Content-Type: application/json

Request Body:
{
    name?: string,
    phone?: string,
    address?: {
        street: string,
        city: string,
        state: string,
        pincode: string,
        country: string,
        contactName: string,
        contactPhone: string,
        isDefault?: boolean,
        addressType?: 'pickup' | 'delivery'
    },
    email?: string,
    password?: {
        current: string,
        new: string
    },
    preferences?: {
        notifications: {
            email: boolean,
            sms: boolean
        }
    }
}

Response:
{
    success: true,
    data: {
        message: string,
        profile: {
            id: string,
            name: string,
            email: string,
            phone: string,
            updatedAt: string
        }
    }
}
```

## Data Models

### Database Schema

#### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('customer', 'seller', 'admin')),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role ON users(role);
```

#### Addresses Table
```sql
CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    street VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    country VARCHAR(100) NOT NULL,
    contact_name VARCHAR(100),
    contact_phone VARCHAR(15),
    is_default BOOLEAN DEFAULT FALSE,
    address_type VARCHAR(20) CHECK (address_type IN ('pickup', 'delivery')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_addresses_user_id ON addresses(user_id);
```

#### Orders Table
```sql
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    tracking_id VARCHAR(20) UNIQUE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    pickup_address_id UUID REFERENCES addresses(id),
    delivery_address_id UUID REFERENCES addresses(id),
    package_weight DECIMAL(10,2) NOT NULL,
    package_length DECIMAL(10,2) NOT NULL,
    package_width DECIMAL(10,2) NOT NULL,
    package_height DECIMAL(10,2) NOT NULL,
    declared_value DECIMAL(10,2) NOT NULL,
    service_type VARCHAR(20) NOT NULL CHECK (service_type IN ('express', 'standard')),
    payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('prepaid', 'cod')),
    payment_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_tracking_id ON orders(tracking_id);
CREATE INDEX idx_orders_status ON orders(status);
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
    | 'shipment.delivered';
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
POST /api/v1/upload
Content-Type: multipart/form-data

Request Body:
{
    file: File,
    type: 'profile' | 'document' | 'evidence',
    metadata?: {
        orderId?: string,
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

## Payment Processing

### Payment Gateway Configuration
```typescript
const PAYMENT_CONFIG = {
    provider: 'razorpay',
    keyId: process.env.RAZORPAY_KEY_ID,
    keySecret: process.env.RAZORPAY_KEY_SECRET,
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET
};
```

### Payment Endpoints

#### Initiate Payment
```typescript
POST /api/v1/payments/initiate
Content-Type: application/json

Request Body:
{
    orderId: string,
    amount: number,
    currency: string,
    paymentMethod: 'card' | 'upi' | 'netbanking',
    returnUrl: string,  // URL to redirect after payment
    cancelUrl: string   // URL to redirect if payment is cancelled
}

Response:
{
    success: true,
    data: {
        paymentId: string,
        orderId: string,
        amount: number,
        currency: string,
        paymentUrl: string,
        expiresAt: string
    }
}
```

#### Payment Status Webhook
```typescript
POST /api/v1/payments/webhook
Content-Type: application/json

Request Body:
{
    event: string,
    payload: {
        payment_id: string,
        order_id: string,
        status: 'success' | 'failed' | 'pending',
        amount: number,
        currency: string,
        signature: string,
        transaction_id?: string,
        error_code?: string,
        error_message?: string
    }
}

Response:
{
    success: true,
    data: {
        message: string,
        orderStatus: string,
        paymentStatus: string
    }
}
```

## Notifications

### Notification Templates
```typescript
const NOTIFICATION_TEMPLATES = {
    orderConfirmation: {
        email: {
            subject: 'Order Confirmation - {orderId}',
            template: 'order-confirmation.html'
        },
        sms: {
            template: 'Your order {orderId} has been confirmed. Track your shipment at {trackingUrl}'
        }
    },
    orderShipped: {
        email: {
            subject: 'Your Order is Shipped - {orderId}',
            template: 'order-shipped.html'
        },
        sms: {
            template: 'Your order {orderId} has been shipped. Track at {trackingUrl}'
        }
    }
};
```

### Notification Triggers
```typescript
const NOTIFICATION_TRIGGERS = {
    'order.created': ['orderConfirmation'],
    'order.shipped': ['orderShipped'],
    'order.delivered': ['orderDelivered'],
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
        userProfile: 3600,        // 1 hour
        orderDetails: 1800,       // 30 minutes
        trackingInfo: 300,        // 5 minutes
        rateLimits: 60           // 1 minute
    }
};
```

### Cache Keys
```typescript
const CACHE_KEYS = {
    userProfile: (userId: string) => `user:${userId}:profile`,
    orderDetails: (orderId: string) => `order:${orderId}:details`,
    trackingInfo: (trackingId: string) => `tracking:${trackingId}:info`,
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
    | 'processPayment'
    | 'generateLabel'
    | 'updateTracking'
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
    trackingId: /^RB-[A-Z0-9]{5}-[A-Z0-9]{5}$/
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

# Payment
RAZORPAY_KEY_ID=your-key-id
RAZORPAY_KEY_SECRET=your-key-secret
RAZORPAY_WEBHOOK_SECRET=your-webhook-secret

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
4. Configure Razorpay for payments
5. Set up email and SMS services
6. Configure environment variables
7. Run database migrations
8. Deploy the application
9. Set up monitoring and logging
10. Configure SSL certificates
11. Set up CI/CD pipeline
12. Configure backup strategy 