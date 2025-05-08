# Rocketry Box Admin API Documentation

## Table of Contents
1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Authentication](#authentication)
4. [API Endpoints](#api-endpoints)
5. [Data Models](#data-models)
6. [Webhooks](#webhooks)
7. [WebSocket Events](#web-socket-events)
8. [File Management](#file-management)
9. [Notifications](#notifications)
10. [Performance & Caching](#performance--caching)
11. [Security](#security)
12. [Error Handling](#error-handling)
13. [Deployment](#deployment)
14. [Rate Band Management](#rate-band-management)
15. [Remittance Management](#remittance-management)
16. [Backup and Recovery](#backup-and-recovery)
17. [Audit Logging](#audit-logging)
18. [API Versioning](#api-versioning)

## Overview

The Admin API provides a comprehensive set of endpoints for managing the Rocketry Box shipping aggregator platform. This API serves as the central control system for platform administrators, enabling complete oversight and management of all platform operations.

### Key Features
- **User Management**: Complete control over user accounts, roles, and permissions
- **Order Management**: End-to-end order tracking and management
- **Shipping Partner Management**: Integration and management of shipping partners
- **System Administration**: Platform configuration and monitoring
- **Analytics & Reporting**: Comprehensive business intelligence
- **Security & Compliance**: Advanced security features and audit logging

### API Versioning
- Current Version: v2
- Base URL: `https://api.rocketrybox.com/api/v2/admin`
- All endpoints are prefixed with `/api/v2/admin`

### Rate Limiting
- Standard Rate Limit: 100 requests per 15-minute window
- Burst Rate Limit: 200 requests per minute
- Rate limit headers are included in all responses

### Response Format
All API responses follow a standard format:
```typescript
{
    success: boolean;
    data?: any;
    error?: {
        code: string;
        message: string;
        details?: Record<string, string[]>;
    };
    meta?: {
        page?: number;
        limit?: number;
        total?: number;
        pages?: number;
    };
}
```

### Authentication

The Admin API uses JWT (JSON Web Token) based authentication. All API requests must include a valid authentication token in the Authorization header.

### Authentication Methods

#### 1. Bearer Token Authentication
```typescript
// Request Header
Authorization: Bearer ${token}

// Token Format
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ
```

#### 2. API Key Authentication (for specific endpoints)
```typescript
// Request Header
X-API-Key: ${apiKey}
```

### Authentication Endpoints

#### Login
```typescript
POST /api/v2/admin/auth/login

Request Body:
{
    email: string;
    password: string;
    otp?: string;  // Required if 2FA is enabled
    deviceInfo?: {
        deviceId: string;
        deviceType: string;
        os: string;
        browser: string;
    }
}

Response:
{
    data: {
        accessToken: string;
        refreshToken: string;
        expiresIn: number;  // Token expiration in seconds
        tokenType: "Bearer";
        admin: {
            id: string;
            name: string;
            email: string;
            role: string;
            permissions: string[];
        }
    }
}
```

#### Refresh Token
```typescript
POST /api/v2/admin/auth/refresh

Request Body:
{
    refreshToken: string;
}

Response:
{
    data: {
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
        tokenType: "Bearer";
        admin: {
            id: string;
            name: string;
            email: string;
            role: string;
            permissions: string[];
        }
    }
}
```

#### Logout
```typescript
POST /api/v2/admin/auth/logout

Response:
{
    data: {
        success: boolean;
        message: string;
    }
}
```

### Security Features

#### 1. Token Security
- Access tokens expire after 1 hour
- Refresh tokens expire after 7 days
- Tokens are signed using RS256 algorithm
- Tokens include standard JWT claims (iss, sub, exp, iat)

#### 2. Two-Factor Authentication (2FA)
```typescript
// Enable 2FA
POST /api/v2/admin/auth/2fa/enable

// Verify 2FA
POST /api/v2/admin/auth/2fa/verify

// Disable 2FA
POST /api/v2/admin/auth/2fa/disable
```

#### 3. Session Management
```typescript
// Get Active Sessions
GET /api/v2/admin/auth/sessions

// Revoke Session
DELETE /api/v2/admin/auth/sessions/:sessionId

// Revoke All Sessions
DELETE /api/v2/admin/auth/sessions
```

### Error Responses

#### Invalid Token
```typescript
{
    error: {
        code: "INVALID_TOKEN",
        message: "Invalid or expired token",
        status: 401
    }
}
```

#### Insufficient Permissions
```typescript
{
    error: {
        code: "INSUFFICIENT_PERMISSIONS",
        message: "You don't have permission to access this resource",
        status: 403
    }
}
```

#### Rate Limit Exceeded
```typescript
{
    error: {
        code: "RATE_LIMIT_EXCEEDED",
        message: "Too many authentication attempts",
        status: 429,
        details: {
            retryAfter: number;  // Seconds to wait before retrying
        }
    }
}
```

### Best Practices

1. **Token Storage**
   - Store tokens securely
   - Never expose tokens in client-side code
   - Use secure HTTP-only cookies when possible

2. **Token Refresh**
   - Implement automatic token refresh
   - Refresh tokens before they expire
   - Handle refresh token expiration

3. **Error Handling**
   - Handle 401 and 403 responses
   - Implement proper logout on authentication errors
   - Clear tokens on logout

4. **Security**
   - Use HTTPS for all requests
   - Implement rate limiting
   - Monitor for suspicious activity
   - Log authentication attempts

5. **Session Management**
   - Track active sessions
   - Allow session revocation
   - Implement session timeout
   - Handle concurrent logins

### Getting Started
1. Register for API access
2. Generate API credentials
3. Review API documentation
4. Test in sandbox environment
5. Implement in production

## API Endpoints

### User Management

#### Get Users
```typescript
GET /api/v2/admin/users

Query Parameters:
{
    role?: "customer" | "seller" | "admin" | "super-admin" | "support" | "operations" | "finance",
    search?: string,
    status?: "active" | "inactive" | "suspended" | "pending",
    department?: string,
    from?: string (ISO date),
    to?: string (ISO date),
    sortBy?: "name" | "email" | "createdAt" | "lastLogin",
    sortOrder?: "asc" | "desc",
    page?: number,
    limit?: number
}

Response:
{
    data: Array<{
        id: string,
        name: string,
        email: string,
        phone: string,
        role: string,
        department?: string,
        designation?: string,
        status: string,
        lastLogin: string,
        createdAt: string,
        verificationStatus: {
            email: boolean,
            phone: boolean,
            documents: boolean
        }
    }>,
    pagination: {
        total: number,
        page: number,
        limit: number,
        pages: number
    }
}
```

#### Verify User Documents
```typescript
POST /api/v2/admin/users/:userId/verify-documents

Request Body:
{
    documentType: "pan" | "gst" | "identity" | "bankDetails",
    status: "verified" | "rejected",
    remarks?: string,
    verifiedBy: string,
    notifyUser?: boolean
}

Response:
{
    data: {
        id: string,
        documentType: string,
        status: string,
        verifiedAt: string,
        verifiedBy: string,
        message: string,
        notificationSent?: boolean
    }
}
```

#### Export User Data
```typescript
GET /api/v2/admin/users/export

Query Parameters:
{
    format: "csv" | "xlsx",
    filters?: {
        role?: string[],
        status?: string[],
        department?: string[],
        from?: string (ISO date),
        to?: string (ISO date)
    }
}

Response: Blob (file download)
```

### Order Management

#### Get Orders
```typescript
GET /api/v2/admin/orders

Query Parameters:
{
    status?: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "returned",
    from?: string (ISO date),
    to?: string (ISO date),
    search?: string,
    customerId?: string,
    sellerId?: string,
    courierId?: string,
    paymentStatus?: "pending" | "paid" | "failed" | "refunded",
    sortBy?: "createdAt" | "updatedAt" | "amount" | "status",
    sortOrder?: "asc" | "desc",
    page?: number,
    limit?: number
}

Response:
{
    data: Array<{
        id: string,
        orderNumber: string,
        trackingNumber?: string,
        status: string,
        createdAt: string,
        updatedAt: string,
        customer: {
            id: string,
            name: string,
            email: string,
            phone: string
        },
        seller: {
            id: string,
            name: string,
            email: string,
            phone: string
        },
        items: Array<{
            id: string,
            name: string,
            quantity: number,
            price: number,
            total: number,
            sku: string,
            image?: string
        }>,
        shipping: {
            address: {
                street: string,
                city: string,
                state: string,
                pincode: string,
                country: string
            },
            method: string,
            cost: number,
            courier?: {
                id: string,
                name: string,
                trackingNumber?: string
            }
        },
        payment: {
            method: string,
            status: string,
            amount: number,
            transactionId?: string,
            paidAt?: string
        },
        total: number,
        notes?: Array<{
            id: string,
            note: string,
            createdAt: string,
            createdBy: string
        }>
    }>,
    pagination: {
        total: number,
        page: number,
        limit: number,
        pages: number
    }
}
```

#### Get Order Details
```typescript
GET /api/v2/admin/orders/:orderId

Response:
{
    data: {
        id: string,
        orderNumber: string,
        trackingNumber?: string,
        status: string,
        createdAt: string,
        updatedAt: string,
        customer: {
            id: string,
            name: string,
            email: string,
            phone: string,
            address: {
                street: string,
                city: string,
                state: string,
                pincode: string,
                country: string
            }
        },
        seller: {
            id: string,
            name: string,
            email: string,
            phone: string,
            address: {
                street: string,
                city: string,
                state: string,
                pincode: string,
                country: string
            }
        },
        items: Array<{
            id: string,
            name: string,
            description?: string,
            quantity: number,
            price: number,
            total: number,
            sku: string,
            image?: string,
            weight?: number,
            dimensions?: {
                length: number,
                width: number,
                height: number
            }
        }>,
        shipping: {
            address: {
                street: string,
                city: string,
                state: string,
                pincode: string,
                country: string
            },
            method: string,
            cost: number,
            courier?: {
                id: string,
                name: string,
                trackingNumber?: string,
                status?: string,
                estimatedDelivery?: string
            },
            trackingHistory?: Array<{
                status: string,
                location: string,
                timestamp: string,
                description: string
            }>
        },
        payment: {
            method: string,
            status: string,
            amount: number,
            transactionId?: string,
            paidAt?: string,
            refundDetails?: {
                amount: number,
                reason: string,
                processedAt: string,
                processedBy: string
            }
        },
        total: number,
        subtotal: number,
        tax: number,
        discount?: {
            type: string,
            amount: number,
            code?: string
        },
        notes?: Array<{
            id: string,
            note: string,
            type: "general" | "warning" | "important",
            createdAt: string,
            createdBy: {
                id: string,
                name: string,
                role: string
            }
        }>,
        history: Array<{
            status: string,
            timestamp: string,
            updatedBy: string,
            notes?: string
        }>
    }
}
```

#### Update Order Status
```typescript
PATCH /api/v2/admin/orders/:orderId/status

Request Body:
{
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "returned",
    notes?: string,
    notifyCustomer?: boolean,
    notifySeller?: boolean,
    trackingNumber?: string,
    courierId?: string
}

Response:
{
    data: {
        id: string,
        status: string,
        message: string,
        updatedAt: string,
        notificationsSent: {
            customer: boolean,
            seller: boolean
        }
    }
}
```

#### Add Order Notes
```typescript
POST /api/v2/admin/orders/:orderId/notes

Request Body:
{
    note: string,
    type?: "general" | "warning" | "important",
    visibility?: "private" | "team" | "all",
    notifyCustomer?: boolean,
    notifySeller?: boolean
}

Response:
{
    data: {
        id: string,
        note: string,
        type: string,
        visibility: string,
        createdAt: string,
        createdBy: {
            id: string,
            name: string,
            role: string
        },
        notificationsSent: {
            customer: boolean,
            seller: boolean
        }
    }
}
```

#### Process Refund
```typescript
POST /api/v2/admin/orders/:orderId/refund

Request Body:
{
    amount: number,
    reason: string,
    refundMethod: "original" | "wallet" | "bank",
    bankDetails?: {
        accountNumber: string,
        ifscCode: string,
        accountHolderName: string
    },
    notifyCustomer?: boolean
}

Response:
{
    data: {
        id: string,
        orderId: string,
        amount: number,
        status: "processing" | "completed" | "failed",
        reason: string,
        refundMethod: string,
        processedAt: string,
        processedBy: string,
        transactionId?: string,
        notificationSent: boolean
    }
}
```

#### Export Orders
```typescript
GET /api/v2/admin/orders/export

Query Parameters:
{
    format: "csv" | "xlsx",
    filters?: {
        status?: string[],
        from?: string (ISO date),
        to?: string (ISO date),
        customerId?: string,
        sellerId?: string,
        paymentStatus?: string[]
    }
}

Response: Blob (file download)
```

#### Get Order Statistics
```typescript
GET /api/v2/admin/orders/statistics

Query Parameters:
{
    from?: string (ISO date),
    to?: string (ISO date),
    groupBy?: "day" | "week" | "month" | "year"
}

Response:
{
    data: {
        total: number,
        totalAmount: number,
        averageOrderValue: number,
        statusBreakdown: {
            pending: number,
            processing: number,
            shipped: number,
            delivered: number,
            cancelled: number,
            returned: number
        },
        paymentBreakdown: {
            pending: number,
            paid: number,
            failed: number,
            refunded: number
        },
        timeSeries: Array<{
            period: string,
            count: number,
            amount: number
        }>,
        topSellers: Array<{
            id: string,
            name: string,
            orderCount: number,
            totalAmount: number
        }>,
        topProducts: Array<{
            id: string,
            name: string,
            quantity: number,
            totalAmount: number
        }>
    }
}
```

### Dashboard

#### Get Dashboard Statistics
```typescript
GET /api/v2/admin/dashboard/stats

Query Parameters:
{
    from?: string (ISO date),
    to?: string (ISO date),
    groupBy?: "day" | "week" | "month" | "year"
}

Response:
{
    data: {
        overview: {
            totalOrders: number,
            totalRevenue: number,
            averageOrderValue: number,
            totalCustomers: number,
            totalSellers: number,
            activeUsers: number
        },
        revenue: {
            total: number,
            byPaymentMethod: {
                cod: number,
                online: number,
                wallet: number
            },
            byCategory: Array<{
                category: string,
                amount: number,
                percentage: number
            }>,
            timeSeries: Array<{
                period: string,
                amount: number,
                orders: number
            }>
        },
        orders: {
            total: number,
            byStatus: {
                pending: number,
                processing: number,
                shipped: number,
                delivered: number,
                cancelled: number,
                returned: number
            },
            byPriority: {
                high: number,
                medium: number,
                low: number
            },
            timeSeries: Array<{
                period: string,
                count: number,
                amount: number
            }>
        },
        users: {
            total: number,
            byRole: {
                customer: number,
                seller: number,
                admin: number
            },
            byStatus: {
                active: number,
                inactive: number,
                suspended: number
            },
            newUsers: {
                today: number,
                thisWeek: number,
                thisMonth: number
            },
            timeSeries: Array<{
                period: string,
                count: number,
                byRole: {
                    customer: number,
                    seller: number,
                    admin: number
                }
            }>
        },
        performance: {
            averageResponseTime: number,
            successRate: number,
            errorRate: number,
            activeSessions: number,
            systemLoad: {
                cpu: number,
                memory: number,
                disk: number
            }
        }
    }
}
```

#### Get Order Trends
```typescript
GET /api/v2/admin/dashboard/order-trends

Query Parameters:
{
    from?: string (ISO date),
    to?: string (ISO date),
    groupBy?: "hour" | "day" | "week" | "month",
    category?: string,
    sellerId?: string
}

Response:
{
    data: {
        trends: Array<{
            period: string,
            orders: number,
            revenue: number,
            averageOrderValue: number,
            byStatus: {
                pending: number,
                processing: number,
                shipped: number,
                delivered: number,
                cancelled: number,
                returned: number
            },
            byPaymentMethod: {
                cod: number,
                online: number,
                wallet: number
            }
        }>,
        comparison: {
            previousPeriod: {
                orders: number,
                revenue: number,
                averageOrderValue: number
            },
            growth: {
                orders: number,
                revenue: number,
                averageOrderValue: number
            }
        },
        topProducts: Array<{
            id: string,
            name: string,
            quantity: number,
            revenue: number,
            growth: number
        }>,
        topCategories: Array<{
            id: string,
            name: string,
            orders: number,
            revenue: number,
            growth: number
        }>
    }
}
```

#### Get System Health
```typescript
GET /api/v2/admin/dashboard/system-health

Response:
{
    data: {
        status: "healthy" | "warning" | "critical",
        lastChecked: string,
        components: {
            api: {
                status: "up" | "down",
                responseTime: number,
                errorRate: number,
                requestsPerMinute: number
            },
            database: {
                status: "up" | "down",
                connections: number,
                queryTime: number,
                size: number
            },
            cache: {
                status: "up" | "down",
                hitRate: number,
                memoryUsage: number,
                keys: number
            },
            storage: {
                status: "up" | "down",
                used: number,
                free: number,
                total: number
            }
        },
        resources: {
            cpu: {
                usage: number,
                cores: number,
                load: number
            },
            memory: {
                used: number,
                free: number,
                total: number
            },
            disk: {
                used: number,
                free: number,
                total: number
            },
            network: {
                bytesIn: number,
                bytesOut: number,
                connections: number
            }
        },
        alerts: Array<{
            id: string,
            type: "error" | "warning" | "info",
            component: string,
            message: string,
            timestamp: string,
            status: "active" | "resolved"
        }>,
        logs: Array<{
            level: "error" | "warning" | "info",
            message: string,
            timestamp: string,
            component: string
        }>
    }
}
```

#### Get User Analytics
```typescript
GET /api/v2/admin/dashboard/user-analytics

Query Parameters:
{
    from?: string (ISO date),
    to?: string (ISO date),
    groupBy?: "day" | "week" | "month"
}

Response:
{
    data: {
        overview: {
            totalUsers: number,
            activeUsers: number,
            newUsers: number,
            returningUsers: number
        },
        byRole: {
            customer: {
                total: number,
                active: number,
                new: number
            },
            seller: {
                total: number,
                active: number,
                new: number,
                verified: number
            },
            admin: {
                total: number,
                active: number
            }
        },
        engagement: {
            averageSessionDuration: number,
            pagesPerSession: number,
            bounceRate: number,
            timeSeries: Array<{
                period: string,
                activeUsers: number,
                newUsers: number,
                returningUsers: number
            }>
        },
        demographics: {
            byLocation: Array<{
                country: string,
                state: string,
                users: number,
                percentage: number
            }>,
            byDevice: {
                mobile: number,
                desktop: number,
                tablet: number
            },
            byBrowser: Array<{
                name: string,
                users: number,
                percentage: number
            }>
        },
        retention: {
            daily: number,
            weekly: number,
            monthly: number,
            byCohort: Array<{
                cohort: string,
                size: number,
                retention: Array<{
                    period: number,
                    rate: number
                }>
            }>
        }
    }
}
```

#### Get Financial Analytics
```typescript
GET /api/v2/admin/dashboard/financial-analytics

Query Parameters:
{
    from?: string (ISO date),
    to?: string (ISO date),
    groupBy?: "day" | "week" | "month" | "year"
}

Response:
{
    data: {
        revenue: {
            total: number,
            byPaymentMethod: {
                cod: number,
                online: number,
                wallet: number
            },
            byCategory: Array<{
                category: string,
                amount: number,
                percentage: number
            }>,
            timeSeries: Array<{
                period: string,
                amount: number,
                orders: number
            }>
        },
        expenses: {
            total: number,
            byType: {
                shipping: number,
                refunds: number,
                commissions: number,
                operational: number
            },
            timeSeries: Array<{
                period: string,
                amount: number,
                byType: {
                    shipping: number,
                    refunds: number,
                    commissions: number,
                    operational: number
                }
            }>
        },
        profit: {
            total: number,
            margin: number,
            timeSeries: Array<{
                period: string,
                amount: number,
                margin: number
            }>
        },
        transactions: {
            total: number,
            successful: number,
            failed: number,
            refunded: number,
            timeSeries: Array<{
                period: string,
                count: number,
                amount: number,
                byStatus: {
                    successful: number,
                    failed: number,
                    refunded: number
                }
            }>
        },
        payouts: {
            total: number,
            pending: number,
            processed: number,
            failed: number,
            timeSeries: Array<{
                period: string,
                count: number,
                amount: number,
                byStatus: {
                    pending: number,
                    processed: number,
                    failed: number
                }
            }>
        }
    }
}
```

### Partner Management

#### Get Partners
```typescript
GET /api/v2/admin/partners

Query Parameters:
{
    type?: "courier" | "payment" | "warehouse" | "insurance",
    status?: "active" | "inactive" | "suspended" | "pending",
    search?: string,
    from?: string (ISO date),
    to?: string (ISO date),
    sortBy?: "name" | "type" | "status" | "createdAt",
    sortOrder?: "asc" | "desc",
    page?: number,
    limit?: number
}

Response:
{
    data: Array<{
        id: string,
        name: string,
        type: string,
        status: string,
        apiKey?: string,
        apiSecret?: string,
        webhookUrl?: string,
        credentials: {
            username?: string,
            password?: string,
            token?: string,
            expiresAt?: string
        },
        settings: {
            enabled: boolean,
            priority: number,
            timeout: number,
            retryCount: number,
            webhookEnabled: boolean
        },
        performance: {
            successRate: number,
            averageResponseTime: number,
            totalRequests: number,
            lastChecked: string
        },
        createdAt: string,
        updatedAt: string
    }>,
    pagination: {
        total: number,
        page: number,
        limit: number,
        pages: number
    }
}
```

#### Get Partner Details
```typescript
GET /api/v2/admin/partners/:partnerId

Response:
{
    data: {
        id: string,
        name: string,
        type: string,
        status: string,
        description?: string,
        website?: string,
        contact: {
            name: string,
            email: string,
            phone: string,
            address?: {
                street: string,
                city: string,
                state: string,
                pincode: string,
                country: string
            }
        },
        api: {
            key?: string,
            secret?: string,
            webhookUrl?: string,
            endpoints: Array<{
                name: string,
                url: string,
                method: string,
                description: string
            }>,
            credentials: {
                username?: string,
                password?: string,
                token?: string,
                expiresAt?: string
            }
        },
        settings: {
            enabled: boolean,
            priority: number,
            timeout: number,
            retryCount: number,
            webhookEnabled: boolean,
            rateLimit: {
                requests: number,
                period: number
            },
            fallback: {
                enabled: boolean,
                partnerId?: string
            }
        },
        performance: {
            successRate: number,
            averageResponseTime: number,
            totalRequests: number,
            lastChecked: string,
            metrics: {
                daily: Array<{
                    date: string,
                    requests: number,
                    success: number,
                    failed: number,
                    averageTime: number
                }>,
                hourly: Array<{
                    hour: string,
                    requests: number,
                    success: number,
                    failed: number,
                    averageTime: number
                }>
            }
        },
        logs: Array<{
            id: string,
            level: "info" | "warning" | "error",
            message: string,
            timestamp: string,
            details?: Record<string, any>
        }>,
        createdAt: string,
        updatedAt: string
    }
}
```

#### Create Partner
```typescript
POST /api/v2/admin/partners

Request Body:
{
    name: string,
    type: "courier" | "payment" | "warehouse" | "insurance",
    description?: string,
    website?: string,
    contact: {
        name: string,
        email: string,
        phone: string,
        address?: {
            street: string,
            city: string,
            state: string,
            pincode: string,
            country: string
        }
    },
    api: {
        webhookUrl?: string,
        endpoints: Array<{
            name: string,
            url: string,
            method: string,
            description: string
        }>,
        credentials: {
            username?: string,
            password?: string
        }
    },
    settings: {
        enabled: boolean,
        priority: number,
        timeout: number,
        retryCount: number,
        webhookEnabled: boolean,
        rateLimit: {
            requests: number,
            period: number
        },
        fallback: {
            enabled: boolean,
            partnerId?: string
        }
    }
}

Response:
{
    data: {
        id: string,
        name: string,
        type: string,
        status: "pending",
        apiKey: string,
        apiSecret: string,
        message: string,
        createdAt: string
    }
}
```

#### Update Partner
```typescript
PUT /api/v2/admin/partners/:partnerId

Request Body:
{
    name?: string,
    description?: string,
    website?: string,
    contact?: {
        name?: string,
        email?: string,
        phone?: string,
        address?: {
            street?: string,
            city?: string,
            state?: string,
            pincode?: string,
            country?: string
        }
    },
    api?: {
        webhookUrl?: string,
        endpoints?: Array<{
            name: string,
            url: string,
            method: string,
            description: string
        }>,
        credentials?: {
            username?: string,
            password?: string
        }
    },
    settings?: {
        enabled?: boolean,
        priority?: number,
        timeout?: number,
        retryCount?: number,
        webhookEnabled?: boolean,
        rateLimit?: {
            requests: number,
            period: number
        },
        fallback?: {
            enabled: boolean,
            partnerId?: string
        }
    }
}

Response:
{
    data: {
        id: string,
        name: string,
        type: string,
        status: string,
        message: string,
        updatedAt: string
    }
}
```

#### Update Partner Status
```typescript
PATCH /api/v2/admin/partners/:partnerId/status

Request Body:
{
    status: "active" | "inactive" | "suspended",
    reason?: string,
    notifyPartner?: boolean
}

Response:
{
    data: {
        id: string,
        status: string,
        message: string,
        updatedAt: string,
        notificationSent: boolean
    }
}
```

#### Refresh Partner API
```typescript
POST /api/v2/admin/partners/:partnerId/refresh-api

Request Body:
{
    generateNewKeys?: boolean,
    notifyPartner?: boolean
}

Response:
{
    data: {
        id: string,
        apiKey: string,
        apiSecret: string,
        message: string,
        updatedAt: string,
        notificationSent: boolean
    }
}
```

#### Get Partner Logs
```typescript
GET /api/v2/admin/partners/:partnerId/logs

Query Parameters:
{
    level?: "info" | "warning" | "error",
    from?: string (ISO date),
    to?: string (ISO date),
    page?: number,
    limit?: number
}

Response:
{
    data: Array<{
        id: string,
        level: string,
        message: string,
        timestamp: string,
        details?: Record<string, any>
    }>,
    pagination: {
        total: number,
        page: number,
        limit: number,
        pages: number
    }
}
```

#### Test Partner Integration
```typescript
POST /api/v2/admin/partners/:partnerId/test

Request Body:
{
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE",
    payload?: Record<string, any>,
    validateResponse?: boolean
}

Response:
{
    data: {
        success: boolean,
        response: {
            status: number,
            headers: Record<string, string>,
            body: any
        },
        metrics: {
            responseTime: number,
            timestamp: string
        },
        validation?: {
            passed: boolean,
            errors?: Array<{
                field: string,
                message: string
            }>
        }
    }
}
```

#### Get Partner Statistics
```typescript
GET /api/v2/admin/partners/statistics

Query Parameters:
{
    from?: string (ISO date),
    to?: string (ISO date),
    type?: "courier" | "payment" | "warehouse" | "insurance"
}

Response:
{
    data: {
        overview: {
            total: number,
            active: number,
            inactive: number,
            suspended: number
        },
        byType: {
            courier: {
                total: number,
                active: number,
                successRate: number
            },
            payment: {
                total: number,
                active: number,
                successRate: number
            },
            warehouse: {
                total: number,
                active: number,
                successRate: number
            },
            insurance: {
                total: number,
                active: number,
                successRate: number
            }
        },
        performance: {
            averageResponseTime: number,
            successRate: number,
            errorRate: number,
            timeSeries: Array<{
                period: string,
                requests: number,
                success: number,
                failed: number,
                averageTime: number
            }>
        },
        topPartners: Array<{
            id: string,
            name: string,
            type: string,
            requests: number,
            successRate: number,
            averageTime: number
        }>
    }
}
```

### Notifications

#### Get Notifications
```typescript
GET /api/v2/admin/notifications

Query Parameters:
{
    type?: "system" | "order" | "user" | "partner" | "alert",
    status?: "unread" | "read" | "archived",
    priority?: "high" | "medium" | "low",
    from?: string (ISO date),
    to?: string (ISO date),
    search?: string,
    sortBy?: "createdAt" | "priority" | "type",
    sortOrder?: "asc" | "desc",
    page?: number,
    limit?: number
}

Response:
{
    data: Array<{
        id: string,
        type: string,
        title: string,
        message: string,
        priority: string,
        status: string,
        metadata?: {
            orderId?: string,
            userId?: string,
            partnerId?: string,
            action?: string,
            details?: Record<string, any>
        },
        createdAt: string,
        readAt?: string,
        archivedAt?: string
    }>,
    pagination: {
        total: number,
        page: number,
        limit: number,
        pages: number
    }
}
```

#### Get Notification Details
```typescript
GET /api/v2/admin/notifications/:notificationId

Response:
{
    data: {
        id: string,
        type: string,
        title: string,
        message: string,
        priority: string,
        status: string,
        metadata?: {
            orderId?: string,
            userId?: string,
            partnerId?: string,
            action?: string,
            details?: Record<string, any>
        },
        createdAt: string,
        readAt?: string,
        archivedAt?: string,
        actions?: Array<{
            id: string,
            label: string,
            type: string,
            url?: string,
            method?: string,
            payload?: Record<string, any>
        }>,
        relatedNotifications?: Array<{
            id: string,
            type: string,
            title: string,
            createdAt: string,
            status: string
        }>
    }
}
```

#### Mark Notification as Read
```typescript
PATCH /api/v2/admin/notifications/:notificationId/read

Response:
{
    data: {
        id: string,
        status: "read",
        readAt: string,
        message: string
    }
}
```

#### Mark All Notifications as Read
```typescript
PATCH /api/v2/admin/notifications/read-all

Request Body:
{
    type?: string,
    from?: string (ISO date),
    to?: string (ISO date)
}

Response:
{
    data: {
        count: number,
        message: string,
        updatedAt: string
    }
}
```

#### Archive Notification
```typescript
PATCH /api/v2/admin/notifications/:notificationId/archive

Response:
{
    data: {
        id: string,
        status: "archived",
        archivedAt: string,
        message: string
    }
}
```

#### Delete Notification
```typescript
DELETE /api/v2/admin/notifications/:notificationId

Response:
{
    data: {
        id: string,
        message: string,
        deletedAt: string
    }
}
```

#### Get Unread Count
```typescript
GET /api/v2/admin/notifications/unread-count

Query Parameters:
{
    type?: string,
    priority?: string
}

Response:
{
    data: {
        total: number,
        byType: {
            system: number,
            order: number,
            user: number,
            partner: number,
            alert: number
        },
        byPriority: {
            high: number,
            medium: number,
            low: number
        }
    }
}
```

#### Get Notification Settings
```typescript
GET /api/v2/admin/notifications/settings

Response:
{
    data: {
        email: {
            enabled: boolean,
            templates: Array<{
                id: string,
                name: string,
                subject: string,
                body: string,
                variables: string[],
                status: "active" | "inactive"
            }>,
            recipients: Array<{
                id: string,
                email: string,
                name: string,
                types: string[]
            }>
        },
        sms: {
            enabled: boolean,
            templates: Array<{
                id: string,
                name: string,
                content: string,
                variables: string[],
                status: "active" | "inactive"
            }>,
            recipients: Array<{
                id: string,
                phone: string,
                name: string,
                types: string[]
            }>
        },
        push: {
            enabled: boolean,
            templates: Array<{
                id: string,
                name: string,
                title: string,
                body: string,
                variables: string[],
                status: "active" | "inactive"
            }>,
            channels: Array<{
                id: string,
                name: string,
                type: string,
                status: "active" | "inactive"
            }>
        },
        webhook: {
            enabled: boolean,
            endpoints: Array<{
                id: string,
                url: string,
                types: string[],
                status: "active" | "inactive",
                headers?: Record<string, string>
            }>
        }
    }
}
```

#### Update Notification Settings
```typescript
PUT /api/v2/admin/notifications/settings

Request Body:
{
    email?: {
        enabled?: boolean,
        templates?: Array<{
            id?: string,
            name: string,
            subject: string,
            body: string,
            variables: string[],
            status: "active" | "inactive"
        }>,
        recipients?: Array<{
            id?: string,
            email: string,
            name: string,
            types: string[]
        }>
    },
    sms?: {
        enabled?: boolean,
        templates?: Array<{
            id?: string,
            name: string,
            content: string,
            variables: string[],
            status: "active" | "inactive"
        }>,
        recipients?: Array<{
            id?: string,
            phone: string,
            name: string,
            types: string[]
        }>
    },
    push?: {
        enabled?: boolean,
        templates?: Array<{
            id?: string,
            name: string,
            title: string,
            body: string,
            variables: string[],
            status: "active" | "inactive"
        }>,
        channels?: Array<{
            id?: string,
            name: string,
            type: string,
            status: "active" | "inactive"
        }>
    },
    webhook?: {
        enabled?: boolean,
        endpoints?: Array<{
            id?: string,
            url: string,
            types: string[],
            status: "active" | "inactive",
            headers?: Record<string, string>
        }>
    }
}

Response:
{
    data: {
        message: string,
        updatedAt: string
    }
}
```

#### Test Notification
```typescript
POST /api/v2/admin/notifications/test

Request Body:
{
    type: "email" | "sms" | "push" | "webhook",
    templateId: string,
    recipient: {
        email?: string,
        phone?: string,
        deviceId?: string
    },
    variables?: Record<string, any>
}

Response:
{
    data: {
        success: boolean,
        message: string,
        details?: {
            sentAt: string,
            deliveryStatus?: string,
            error?: string
        }
    }
}
```

#### Get Notification Statistics
```typescript
GET /api/v2/admin/notifications/statistics

Query Parameters:
{
    from?: string (ISO date),
    to?: string (ISO date),
    type?: string
}

Response:
{
    data: {
        overview: {
            total: number,
            unread: number,
            read: number,
            archived: number
        },
        byType: {
            system: {
                total: number,
                unread: number
            },
            order: {
                total: number,
                unread: number
            },
            user: {
                total: number,
                unread: number
            },
            partner: {
                total: number,
                unread: number
            },
            alert: {
                total: number,
                unread: number
            }
        },
        byPriority: {
            high: {
                total: number,
                unread: number
            },
            medium: {
                total: number,
                unread: number
            },
            low: {
                total: number,
                unread: number
            }
        },
        timeSeries: Array<{
            period: string,
            total: number,
            unread: number,
            byType: {
                system: number,
                order: number,
                user: number,
                partner: number,
                alert: number
            }
        }>
    }
}
```

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
    admin: AdminProfile;
}

// Admin Types
interface AdminProfile {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: AdminRole;
    permissions: string[];
    status: 'active' | 'inactive' | 'suspended';
    lastLogin?: string;
    createdAt: string;
    updatedAt: string;
}

type AdminRole = 'super_admin' | 'admin' | 'manager' | 'support';

// User Management Types
interface User {
    id: string;
    type: 'customer' | 'seller';
    profile: CustomerProfile | SellerProfile;
    status: 'active' | 'inactive' | 'suspended';
    createdAt: string;
    updatedAt: string;
}

// System Settings Types
interface SystemSettings {
    general: GeneralSettings;
    security: SecuritySettings;
    notifications: NotificationSettings;
    payment: PaymentSettings;
    shipping: ShippingSettings;
    integration: IntegrationSettings;
}

interface GeneralSettings {
    siteName: string;
    siteUrl: string;
    contactEmail: string;
    supportPhone: string;
    timezone: string;
    currency: string;
    languages: string[];
    maintenance: boolean;
}

interface SecuritySettings {
    passwordPolicy: PasswordPolicy;
    sessionTimeout: number;
    maxLoginAttempts: number;
    twoFactorAuth: boolean;
    ipWhitelist: string[];
}

interface PasswordPolicy {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    expiryDays: number;
}

interface NotificationSettings {
    email: EmailSettings;
    sms: SMSSettings;
    push: PushSettings;
}

interface EmailSettings {
    provider: string;
    fromAddress: string;
    replyTo: string;
    templates: Record<string, string>;
}

interface SMSSettings {
    provider: string;
    senderId: string;
    templates: Record<string, string>;
}

interface PushSettings {
    provider: string;
    apiKey: string;
    templates: Record<string, string>;
}

interface PaymentSettings {
    gateways: PaymentGateway[];
    defaultGateway: string;
    currencies: string[];
    minimumAmount: number;
    maximumAmount: number;
}

interface PaymentGateway {
    name: string;
    type: string;
    status: 'active' | 'inactive';
    credentials: Record<string, string>;
    settings: Record<string, any>;
}

interface ShippingSettings {
    providers: ShippingProvider[];
    defaultProvider: string;
    weightUnit: 'kg' | 'lb';
    dimensionUnit: 'cm' | 'inch';
}

interface ShippingProvider {
    name: string;
    type: string;
    status: 'active' | 'inactive';
    credentials: Record<string, string>;
    settings: Record<string, any>;
}

interface IntegrationSettings {
    analytics: AnalyticsSettings;
    crm: CRMSettings;
    marketing: MarketingSettings;
}

interface AnalyticsSettings {
    provider: string;
    trackingId: string;
    events: string[];
}

interface CRMSettings {
    provider: string;
    apiKey: string;
    webhookUrl: string;
}

interface MarketingSettings {
    provider: string;
    apiKey: string;
    lists: string[];
}

// Audit Log Types
interface AuditLog {
    id: string;
    action: string;
    entity: string;
    entityId: string;
    userId: string;
    userType: 'admin' | 'system';
    changes: Record<string, any>;
    metadata: Record<string, any>;
    ipAddress: string;
    userAgent: string;
    createdAt: string;
}

// System Health Types
interface SystemHealth {
    status: 'healthy' | 'degraded' | 'critical';
    components: ComponentHealth[];
    metrics: SystemMetrics;
    lastChecked: string;
}

interface ComponentHealth {
    name: string;
    status: 'up' | 'down' | 'degraded';
    responseTime: number;
    error?: string;
}

interface SystemMetrics {
    cpu: {
        usage: number;
        load: number[];
    };
    memory: {
        total: number;
        used: number;
        free: number;
    };
    disk: {
        total: number;
        used: number;
        free: number;
    };
    network: {
        bytesIn: number;
        bytesOut: number;
        connections: number;
    };
}

// Backup Types
interface Backup {
    id: string;
    type: 'full' | 'incremental';
    status: 'pending' | 'in-progress' | 'completed' | 'failed';
    size: number;
    path: string;
    startedAt: string;
    completedAt?: string;
    error?: string;
}

// Report Types
interface Report {
    id: string;
    type: ReportType;
    parameters: Record<string, any>;
    status: 'pending' | 'generating' | 'completed' | 'failed';
    format: 'pdf' | 'excel' | 'csv';
    url?: string;
    createdAt: string;
    completedAt?: string;
    error?: string;
}

type ReportType = 
    | 'sales'
    | 'inventory'
    | 'users'
    | 'orders'
    | 'payments'
    | 'custom';

// Dashboard Types
interface DashboardStats {
    users: UserStats;
    orders: OrderStats;
    revenue: RevenueStats;
    inventory: InventoryStats;
    performance: PerformanceStats;
}

interface UserStats {
    total: number;
    active: number;
    new: number;
    byType: Record<string, number>;
}

interface OrderStats {
    total: number;
    pending: number;
    processing: number;
    completed: number;
    cancelled: number;
    averageValue: number;
}

interface RevenueStats {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
    byPaymentMethod: Record<string, number>;
}

interface InventoryStats {
    total: number;
    lowStock: number;
    outOfStock: number;
    byCategory: Record<string, number>;
}

interface PerformanceStats {
    responseTime: number;
    uptime: number;
    errorRate: number;
    activeUsers: number;
}

// Admin Types
interface Admin extends BaseUser {
    department: string;
    designation: string;
    permissions: string[];
    notes?: string;
}

interface AdminRegisterInput {
    fullName: string;
    email: string;
    role: "Admin" | "Manager" | "Support" | "Agent";
    department: string;
    phoneNumber: string;
    address: string;
    dateOfJoining: string;
    employeeId: string;
    isSuperAdmin: boolean;
    remarks?: string;
    password: string;
    confirmPassword: string;
    profileImage?: File;
}

interface AdminLoginInput {
    email: string;
    password: string;
    rememberMe: boolean;
}

// Validation Rules
interface ValidationRule {
    field: string;
    required: boolean;
    type: string;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    enum?: string[];
}

// Company Details
interface CompanyDetailsInput {
    companyCategory: string;
    companyName: string;
    sellerName: string;
    email: string;
    contactNumber: string;
}

// Documents
interface DocumentsInput {
    panNumber: string;
    panImage?: File;
    gstNumber?: string;
    gstDocument?: File;
    documentType: string;
    documentNumber: string;
    identityDocumentImage?: File;
}

// Bank Details
interface BankDetailsInput {
    bankName: string;
    accountName: string;
    accountNumber: string;
    branchName: string;
    ifscCode: string;
    cancelledChequeImage?: File;
}

// Payment Type
interface PaymentTypeInput {
    paymentMode: string;
    rateBand: string;
}

// Document Approval
interface DocumentApprovalInput {
    status: "approved" | "rejected";
    remarks?: string;
}

// Shop Details
interface ShopDetailsInput {
    shopName: string;
    shopDescription: string;
    gstNumber: string;
    gstCertificate?: File;
    shopAddress: string;
    city: string;
    state: string;
    pincode: string;
    shopCategory: string;
    websiteUrl?: string;
    amazonStoreUrl?: string;
    shopifyStoreUrl?: string;
    openCartStoreUrl?: string;
}

// Partner Management
interface PartnerUpdateInput {
    name?: string;
    logoUrl?: string;
    apiStatus?: "active" | "inactive" | "maintenance";
    supportContact?: string;
    supportEmail?: string;
    apiKey?: string;
    apiEndpoint?: string;
    serviceTypes?: string[];
    serviceAreas?: string[];
    weightLimits?: {
        min: number;
        max: number;
    };
    dimensionLimits?: {
        maxLength: number;
        maxWidth: number;
        maxHeight: number;
        maxSum: number;
    };
    rates?: {
        baseRate: number;
        weightRate: number;
        dimensionalFactor: number;
    };
    zones?: Array<{
        name: string;
        baseRate: number;
        additionalRate: number;
    }>;
    trackingUrl?: string;
    notes?: string;
}

// Invoice
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
```

## Error Handling

### Error Response Format
```typescript
interface ApiError {
    message: string;
    code: string;
    status: number;
    details?: any;
}
```

### Common Error Codes
| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input parameters |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 422 | Unprocessable Entity - Validation failed |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

### Error Handling Example
```typescript
try {
    const response = await apiService.get('/admin/users');
    return response.data;
} catch (error) {
    if (error.response) {
        const apiError: ApiError = {
            message: error.response.data.message || 'An error occurred',
            code: error.response.data.code || 'SERVER_ERROR',
            status: error.response.status,
            details: error.response.data.details,
        };
        throw apiError;
    }
    throw error;
}
```

## Rate Limiting

### Rate Limit Configuration
```typescript
const RATE_LIMITS = {
    authenticated: 100,    // 100 requests per window
    unauthenticated: 20,  // 20 requests per window
    windowMs: 15 * 60 * 1000  // 15 minutes
} as const;
```

### Rate Limit Headers
```typescript
interface RateLimitHeaders {
    'X-RateLimit-Limit': number;     // Total requests allowed per window
    'X-RateLimit-Remaining': number; // Remaining requests in current window
    'X-RateLimit-Reset': number;     // Time when the rate limit resets (Unix timestamp)
}
```

### Rate Limit Response
```typescript
{
    error: {
        message: "Rate limit exceeded. Please try again after {resetTime}",
        code: "RATE_LIMIT_EXCEEDED",
        status: 429,
        details: {
            resetTime: string,
            limit: number,
            remaining: number
        }
    }
}
```

## Pagination, Sorting & Filtering

### Pagination Parameters
```typescript
interface PaginationParams {
    page?: number;      // Page number (default: 1)
    limit?: number;     // Items per page (default: 10)
    sortBy?: string;    // Field to sort by
    sortOrder?: 'asc' | 'desc';  // Sort direction
}
```

### Paginated Response
```typescript
interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        total: number;   // Total number of items
        page: number;    // Current page
        limit: number;   // Items per page
        pages: number;   // Total number of pages
    };
}
```

### Filtering Examples

#### User Management
```typescript
GET /api/v2/admin/users

Query Parameters:
{
    role?: UserRole;
    search?: string;
    status?: UserStatus;
    sortBy?: 'name' | 'email' | 'createdAt' | 'lastLogin';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}
```

#### Order Management
```typescript
GET /api/v2/admin/orders

Query Parameters:
{
    from?: string;
    to?: string;
    status?: string | string[];
    sellerId?: string;
    customerId?: string;
    paymentType?: 'COD' | 'Prepaid';
    priority?: 'High' | 'Medium' | 'Low';
    courier?: string;
    awbNumber?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}
```

#### Partner Management
```typescript
GET /api/v2/admin/partners

Query Parameters:
{
    search?: string;
    status?: ApiStatus;
    sortBy?: 'name' | 'status' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}
```

### Validation Rules

#### Admin Registration
```typescript
const adminRegisterSchema = {
    fullName: {
        required: true,
        type: 'string',
        minLength: 2,
        maxLength: 50
    },
    email: {
        required: true,
        type: 'string',
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    role: {
        required: true,
        type: 'string',
        enum: ['Admin', 'Manager', 'Support', 'Agent']
    },
    department: {
        required: true,
        type: 'string'
    },
    phoneNumber: {
        required: true,
        type: 'string',
        pattern: /^[0-9]{10}$/
    },
    address: {
        required: true,
        type: 'string'
    },
    dateOfJoining: {
        required: true,
        type: 'string',
        format: 'date'
    },
    employeeId: {
        required: true,
        type: 'string'
    },
    isSuperAdmin: {
        required: true,
        type: 'boolean'
    },
    password: {
        required: true,
        type: 'string',
        minLength: 8,
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    },
    confirmPassword: {
        required: true,
        type: 'string',
        validate: 'matches:password'
    }
};
```

#### Admin Login
```typescript
const adminLoginSchema = {
    email: {
        required: true,
        type: 'string',
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: {
        required: true,
        type: 'string'
    },
    rememberMe: {
        required: false,
        type: 'boolean',
        default: false
    }
};
```

## System Health Monitoring

### Get System Health
```typescript
GET /api/v2/admin/system/health

Response:
{
    data: {
        status: 'healthy' | 'degraded' | 'critical',
        components: Array<{
            name: string,
            status: 'up' | 'down' | 'degraded',
            responseTime: number,
            error?: string
        }>,
        metrics: {
            cpu: {
                usage: number,
                load: number[]
            },
            memory: {
                total: number,
                used: number,
                free: number
            },
            disk: {
                total: number,
                used: number,
                free: number
            },
            network: {
                bytesIn: number,
                bytesOut: number,
                connections: number
            }
        },
        lastChecked: string
    }
}
```

### Get Service Status
```typescript
GET /api/v2/admin/system/services

Response:
{
    data: {
        apiStatus: 'operational' | 'degraded' | 'maintenance',
        serverLoad: number,
        responseTime: number,
        databaseStatus: 'healthy' | 'degraded' | 'critical',
        serviceStatus: {
            payment: 'operational' | 'degraded' | 'down',
            email: 'operational' | 'degraded' | 'down',
            sms: 'operational' | 'degraded' | 'down',
            tracking: 'operational' | 'degraded' | 'down'
        },
        errors: {
            count: number,
            recentErrors: Array<{
                timestamp: string,
                endpoint: string,
                errorType: string,
                count: number
            }>
        }
    }
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

### Seller Management

#### Get Seller Details
```typescript
GET /api/v2/admin/sellers/:sellerId

Response:
{
  success: boolean,
  data: {
    id: string,
    userId: string,
    name: string,
    email: string,
    phone: string,
    status: "Active" | "Inactive" | "Pending" | "Suspended",
    registrationDate: string,
    lastActive: string,
    companyName: string,
    companyCategory: string,
    paymentType: "wallet" | "credit",
    rateBand: string,
    creditLimit?: number,
    creditPeriod?: number,
    kycStatus: "Pending" | "Verified" | "Rejected",
    documentApprovals: {
      pan: "Pending" | "Verified" | "Rejected",
      gst: "Pending" | "Verified" | "Rejected",
      identity: "Pending" | "Verified" | "Rejected",
      bankDetails: "Pending" | "Verified" | "Rejected"
    },
    settings: {
      autoFetch: boolean,
      autoCreate: boolean,
      autoNotify: boolean,
      defaultShippingMode: ServiceType,
      autoSelectCourier: boolean,
      codAvailable: boolean,
      courierSettings: CourierSetting[],
      labelSettings: LabelSettings,
      whatsappSettings: WhatsappSettings,
      apiSettings: ApiSettings
    }
  }
}
```

#### Update Seller Settings
```typescript
PATCH /api/v2/admin/sellers/:sellerId/settings
Content-Type: application/json

Request Body:
{
  autoFetch?: boolean,
  autoCreate?: boolean,
  autoNotify?: boolean,
  defaultShippingMode?: ServiceType,
  autoSelectCourier?: boolean,
  codAvailable?: boolean,
  courierSettings?: CourierSetting[],
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
    apiKey?: string,
    apiSecret?: string,
    enabled?: boolean,
    webhookEnabled?: boolean,
    webhookUrl?: string
  }
}

Response:
{
  success: boolean,
  data: {
    id: string,
    message: string,
    updatedAt: string
  }
}
```

### Analytics & Reporting

#### Get Sales Analytics
```typescript
GET /api/v2/admin/analytics/sales

Query Parameters:
{
  from?: string (ISO date)
  to?: string (ISO date)
  sellerId?: string
  groupBy?: "day" | "week" | "month"
}

Response:
{
  success: boolean,
  data: {
    totalSales: number,
    totalOrders: number,
    averageOrderValue: number,
    salesByPeriod: [
      {
        period: string,
        sales: number,
        orders: number
      }
    ],
    topProducts: [
      {
        id: string,
        name: string,
        quantity: number,
        revenue: number
      }
    ],
    salesByCategory: [
      {
        category: string,
        sales: number,
        percentage: number
      }
    ]
  }
}
```

#### Get Billing Summary
```typescript
GET /api/v2/admin/billing/summary

Query Parameters:
{
  sellerId?: string
  from?: string (ISO date)
  to?: string (ISO date)
}

Response:
{
  success: boolean,
  data: {
    totalAmount: number,
    pendingAmount: number,
    paidAmount: number,
    upcomingPayments: [
      {
        id: string,
        amount: number,
        dueDate: string,
        status: "pending" | "paid" | "overdue"
      }
    ],
    paymentHistory: [
      {
        id: string,
        amount: number,
        date: string,
        status: string,
        transactionId: string
      }
    ]
  }
}
```

### NDR Management

#### Get NDR List
```typescript
GET /api/v2/admin/ndr

Query Parameters:
{
  status?: "pending" | "resolved" | "failed"
  from?: string (ISO date)
  to?: string (ISO date)
  sellerId?: string
  page?: number
  limit?: number
}

Response:
{
  success: boolean,
  data: {
    data: [
      {
        id: string,
        orderId: string,
        trackingId: string,
        reason: string,
        status: "pending" | "resolved" | "failed",
        createdAt: string,
        updatedAt: string,
        customer: {
          name: string,
          phone: string,
          email: string
        },
        deliveryAddress: Address,
        attempts: [
          {
            date: string,
            status: string,
            remarks: string
          }
        ]
      }
    ],
    pagination: {
      total: number,
      page: number,
      limit: number,
      pages: number
    }
  }
}
```

### Weight Dispute Management

#### Get Weight Disputes
```typescript
GET /api/v2/admin/weight-disputes

Query Parameters:
{
  status?: "pending" | "resolved" | "rejected"
  from?: string (ISO date)
  to?: string (ISO date)
  sellerId?: string
  page?: number
  limit?: number
}

Response:
{
  success: boolean,
  data: {
    data: [
      {
        id: string,
        orderId: string,
        trackingId: string,
        claimedWeight: number,
        actualWeight: number,
        difference: number,
        status: "pending" | "resolved" | "rejected",
        createdAt: string,
        updatedAt: string,
        evidence?: {
          images: string[],
          documents: string[]
        }
      }
    ],
    pagination: {
      total: number,
      page: number,
      limit: number,
      pages: number
    }
  }
}
```

### Warehouse Management

#### Get Warehouses
```typescript
GET /api/v2/admin/warehouses

Query Parameters:
{
  search?: string
  page?: number
  limit?: number
}

Response:
{
  success: boolean,
  data: {
    data: [
      {
        id: string,
        name: string,
        address: Address,
        contactPerson: string,
        contactPhone: string,
        isDefault: boolean,
        operatingHours: {
          start: string,
          end: string,
          timezone: string
        },
        createdAt: string,
        updatedAt: string
      }
    ],
    pagination: {
      total: number,
      page: number,
      limit: number,
      pages: number
    }
  }
}
```

### Team Management

#### Get Team Members
```typescript
GET /api/v2/admin/team

Query Parameters:
{
  role?: "admin" | "manager" | "operator"
  status?: "active" | "inactive"
  search?: string
  page?: number
  limit?: number
}

Response:
{
  success: boolean,
  data: {
    data: [
      {
        id: string,
        name: string,
        email: string,
        role: "admin" | "manager" | "operator",
        status: "active" | "inactive",
        lastActive: string,
        permissions: string[]
      }
    ],
    pagination: {
      total: number,
      page: number,
      limit: number,
      pages: number
    }
  }
}
```

### Custom Rate Management

#### Get Custom Seller Rates
```typescript
GET /api/v2/admin/users/:userId/custom-rates

Response:
{
  success: boolean,
  data: {
    userId: string,
    userName: string,
    rates: [
      {
        courier: string,
        rates: {
          withinCity: number,
          withinState: number,
          metroToMetro: number,
          restOfIndia: number,
          northEastJK: number
        },
        codCharge: number,
        codPercent: number,
        weightSlabs: [
          {
            from: number,
            to: number,
            price: number
          }
        ]
      }
    ],
    lastUpdated: string
  }
}
```

#### Update Custom Seller Rates
```typescript
PUT /api/v2/admin/users/:userId/custom-rates
Content-Type: application/json

Request Body:
{
  rates: [
    {
      courier: string,
      rates: {
        withinCity: number,
        withinState: number,
        metroToMetro: number,
        restOfIndia: number,
        northEastJK: number
      },
      codCharge: number,
      codPercent: number,
      weightSlabs: [
        {
          from: number,
          to: number,
          price: number
        }
      ]
    }
  ]
}

Response:
{
  success: boolean,
  data: {
    userId: string,
    message: string,
    lastUpdated: string
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

### Get Webhook Logs
```typescript
GET /api/v2/admin/webhooks/logs

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

## WebSocket Events

### Real-time Updates
```typescript
// Connection
const ws = new WebSocket('wss://api.rocketrybox.com/ws');

// Event Types
type WebSocketEvent = 
    | 'order.created'
    | 'order.updated'
    | 'order.cancelled'
    | 'shipment.tracked'
    | 'shipment.delivered'
    | 'payment.success'
    | 'payment.failed'
    | 'system.alert'
    | 'user.activity';

// Event Payload
interface WebSocketPayload {
    event: WebSocketEvent;
    timestamp: string;
    data: any;
}

// Authentication
ws.onopen = () => {
    ws.send(JSON.stringify({
        type: 'auth',
        token: 'your-auth-token'
    }));
};

// Event Handling
ws.onmessage = (event) => {
    const payload: WebSocketPayload = JSON.parse(event.data);
    switch (payload.event) {
        case 'order.created':
            // Handle new order
            break;
        case 'shipment.tracked':
            // Handle shipment update
            break;
        // ... handle other events
    }
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

### Upload File
```typescript
POST /api/v2/admin/upload

Request Body:
{
    file: File,
    type: 'invoice' | 'evidence' | 'profile' | 'product' | 'document',
    metadata?: {
        orderId?: string,
        documentType?: string
    }
}

Response:
{
    data: {
        url: string,
        filename: string,
        mimeType: string,
        size: number,
        uploadedAt: string
    }
}
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
        adminProfile: 3600,        // 1 hour
        orderDetails: 1800,        // 30 minutes
        analytics: 300,            // 5 minutes
        rateLimits: 60            // 1 minute
    }
};
```

### Get API Performance Metrics
```typescript
GET /api/v2/admin/performance/metrics

Response:
{
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

## Security

### API Status
```typescript
GET /api/v2/admin/status

Response:
{
    data: {
        status: "operational" | "maintenance" | "partial_outage" | "major_outage",
        version: string,
        uptime: string,
        timestamp: string
    }
}
```

### System Configuration
```typescript
GET /api/v2/admin/settings/system

Response:
{
    data: {
        timezone: string,
        currency: string,
        displayPreferences: {
            dateFormat: string,
            timeFormat: string,
            numberFormat: string
        },
        maintenanceMode: boolean,
        maintenanceMessage?: string
    }
}
```

### Update System Configuration
```typescript
PUT /api/v2/admin/settings/system

Request Body:
{
    timezone?: string,
    currency?: string,
    displayPreferences?: {
        dateFormat?: string,
        timeFormat?: string,
        numberFormat?: string
    },
    maintenanceMode?: boolean,
    maintenanceMessage?: string
}

Response:
{
    data: {
        success: boolean,
        message: string,
        updatedAt: string
    }
}
```

### Notification Settings
```typescript
GET /api/v2/admin/settings/notifications

Response:
{
    data: {
        email: {
            method: "php" | "smtp" | "sendgrid" | "mailjet",
            enabled: boolean,
            settings?: {
                host?: string,
                port?: number,
                username?: string,
                password?: string,
                encryption?: string
            }
        },
        sms: {
            method: "nexmo" | "Clickatell" | "Message Brid" | "Infobip",
            enabled: boolean,
            settings?: {
                apiKey?: string,
                apiSecret?: string
            }
        },
        templates: Array<{
            name: string,
            subject: string,
            type: "email" | "sms"
        }>
    }
}
```

### Update Notification Settings
```typescript
PUT /api/v2/admin/settings/notifications

Request Body:
{
    email?: {
        method?: "php" | "smtp" | "sendgrid" | "mailjet",
        enabled?: boolean,
        settings?: {
            host?: string,
            port?: number,
            username?: string,
            password?: string,
            encryption?: string
        }
    },
    sms?: {
        method?: "nexmo" | "Clickatell" | "Message Brid" | "Infobip",
        enabled?: boolean,
        settings?: {
            apiKey?: string,
            apiSecret?: string
        }
    }
}

Response:
{
    data: {
        success: boolean,
        message: string,
        updatedAt: string
    }
}
```

### Test Notification
```typescript
POST /api/v2/admin/settings/notifications/test

Request Body:
{
    type: "email" | "sms",
    recipient: string,
    template: string
}

Response:
{
    data: {
        success: boolean,
        message: string
    }
}
```

## Rate Band Management

### Get Rate Bands
```typescript
GET /api/v2/admin/rate-bands

Query Parameters:
{
    search?: string,
    isDefault?: boolean,
    page?: number,
    limit?: number
}

Response:
{
    data: Array<{
        id: string,
        name: string,
        description: string,
        isDefault: boolean,
        sellerCount: number,
        createdAt: string,
        updatedAt: string
    }>,
    pagination: {
        total: number,
        page: number,
        limit: number,
        pages: number
    }
}
```

### Create Rate Band
```typescript
POST /api/v2/admin/rate-bands

Request Body:
{
    name: string,
    description: string,
    isDefault: boolean,
    copyFromId?: string  // Optional - copy rates from existing band
}

Response:
{
    data: {
        id: string,
        name: string,
        description: string,
        isDefault: boolean,
        createdAt: string,
        updatedAt: string
    }
}
```

### Get Rate Band Details
```typescript
GET /api/v2/admin/rate-bands/:bandId

Response:
{
    data: {
        id: string,
        name: string,
        description: string,
        isDefault: boolean,
        rates: {
            withinCity: number,
            withinState: number,
            metroToMetro: number,
            restOfIndia: number,
            northEastJK: number
        },
        weightSlabs: Array<{
            from: number,
            to: number,
            price: number
        }>,
        codCharge: number,
        codPercent: number,
        sellerCount: number,
        createdAt: string,
        updatedAt: string
    }
}
```

## Remittance Management

### Get Remittance List
```typescript
GET /api/v2/admin/remittances

Query Parameters:
{
    sellerId?: string,
    status?: 'pending' | 'processing' | 'completed' | 'failed',
    from?: string (ISO date),
    to?: string (ISO date),
    page?: number,
    limit?: number
}

Response:
{
    data: Array<{
        id: string,
        sellerId: string,
        sellerName: string,
        amount: number,
        status: 'pending' | 'processing' | 'completed' | 'failed',
        paymentMethod: string,
        transactionId?: string,
        createdAt: string,
        completedAt?: string,
        notes?: string
    }>,
    pagination: {
        total: number,
        page: number,
        limit: number,
        pages: number
    }
}
```

### Process Remittance
```typescript
POST /api/v2/admin/remittances/:remittanceId/process

Request Body:
{
    transactionId: string,
    notes?: string
}

Response:
{
    data: {
        id: string,
        status: string,
        message: string,
        updatedAt: string
    }
}
```

### Export Remittance Report
```typescript
GET /api/v2/admin/remittances/export

Query Parameters:
{
    sellerId?: string,
    remittanceId?: string,
    format: 'xlsx' | 'csv',
    from?: string (YYYY-MM-DD),
    to?: string (YYYY-MM-DD)
}

Response: Blob (file download)
```

## Backup and Recovery

### Get Backup List
```typescript
GET /api/v2/admin/backups

Query Parameters:
{
    type?: 'full' | 'incremental',
    status?: 'pending' | 'in-progress' | 'completed' | 'failed',
    page?: number,
    limit?: number
}

Response:
{
    data: Array<{
        id: string,
        type: 'full' | 'incremental',
        status: 'pending' | 'in-progress' | 'completed' | 'failed',
        size: number,
        path: string,
        startedAt: string,
        completedAt?: string,
        error?: string
    }>,
    pagination: {
        total: number,
        page: number,
        limit: number,
        pages: number
    }
}
```

### Create Backup
```typescript
POST /api/v2/admin/backups

Request Body:
{
    type: 'full' | 'incremental',
    description?: string
}

Response:
{
    data: {
        id: string,
        type: string,
        status: string,
        startedAt: string
    }
}
```

### Restore Backup
```typescript
POST /api/v2/admin/backups/:backupId/restore

Response:
{
    data: {
        id: string,
        status: string,
        message: string,
        startedAt: string
    }
}
```

## Audit Logging

### Get Audit Logs
```typescript
GET /api/v2/admin/audit-logs

Query Parameters:
{
    action?: string,
    entity?: string,
    entityId?: string,
    userId?: string,
    userType?: 'admin' | 'system',
    from?: string (ISO date),
    to?: string (ISO date),
    page?: number,
    limit?: number
}

Response:
{
    data: Array<{
        id: string,
        action: string,
        entity: string,
        entityId: string,
        userId: string,
        userType: 'admin' | 'system',
        changes: Record<string, any>,
        metadata: Record<string, any>,
        ipAddress: string,
        userAgent: string,
        createdAt: string
    }>,
    pagination: {
        total: number,
        page: number,
        limit: number,
        pages: number
    }
}
```

## API Versioning

### Version Information
```typescript
GET /api/v2/admin/version

Response:
{
    data: {
        version: string,
        buildNumber: string,
        releaseDate: string,
        changelog: string[],
        deprecated: boolean,
        sunsetDate?: string,
        migrationGuide?: string
    }
}
``` 

### Settings

#### Get System Settings
```typescript
GET /api/v2/admin/settings

Response:
{
    data: {
        general: {
            siteName: string,
            siteUrl: string,
            timezone: string,
            dateFormat: string,
            timeFormat: string,
            currency: {
                code: string,
                symbol: string,
                position: "before" | "after",
                decimalPlaces: number
            },
            language: {
                default: string,
                available: string[]
            }
        },
        security: {
            passwordPolicy: {
                minLength: number,
                requireUppercase: boolean,
                requireLowercase: boolean,
                requireNumbers: boolean,
                requireSpecialChars: boolean,
                expiryDays: number
            },
            session: {
                timeout: number,
                maxConcurrent: number,
                requireIpMatch: boolean
            },
            twoFactor: {
                enabled: boolean,
                methods: string[],
                requiredFor: string[]
            },
            api: {
                rateLimit: {
                    enabled: boolean,
                    requests: number,
                    period: number
                },
                ipWhitelist: string[],
                requireHttps: boolean
            }
        },
        email: {
            provider: string,
            from: {
                name: string,
                email: string
            },
            smtp: {
                host: string,
                port: number,
                secure: boolean,
                auth: {
                    user: string,
                    pass: string
                }
            },
            templates: {
                path: string,
                defaultLocale: string
            }
        },
        sms: {
            provider: string,
            credentials: Record<string, string>,
            templates: {
                path: string,
                defaultLocale: string
            }
        },
        storage: {
            provider: string,
            bucket: string,
            region: string,
            credentials: Record<string, string>,
            cdn: {
                enabled: boolean,
                url: string
            }
        },
        cache: {
            provider: string,
            ttl: number,
            prefix: string,
            credentials: Record<string, string>
        },
        logging: {
            level: string,
            format: string,
            destination: string,
            retention: number,
            alerts: {
                enabled: boolean,
                channels: string[]
            }
        },
        backup: {
            enabled: boolean,
            schedule: string,
            retention: number,
            storage: {
                provider: string,
                path: string
            },
            include: string[],
            exclude: string[]
        }
    }
}
```

#### Update System Settings
```typescript
PUT /api/v2/admin/settings

Request Body:
{
    general?: {
        siteName?: string,
        siteUrl?: string,
        timezone?: string,
        dateFormat?: string,
        timeFormat?: string,
        currency?: {
            code: string,
            symbol: string,
            position: "before" | "after",
            decimalPlaces: number
        },
        language?: {
            default: string,
            available: string[]
        }
    },
    security?: {
        passwordPolicy?: {
            minLength: number,
            requireUppercase: boolean,
            requireLowercase: boolean,
            requireNumbers: boolean,
            requireSpecialChars: boolean,
            expiryDays: number
        },
        session?: {
            timeout: number,
            maxConcurrent: number,
            requireIpMatch: boolean
        },
        twoFactor?: {
            enabled: boolean,
            methods: string[],
            requiredFor: string[]
        },
        api?: {
            rateLimit: {
                enabled: boolean,
                requests: number,
                period: number
            },
            ipWhitelist: string[],
            requireHttps: boolean
        }
    },
    email?: {
        provider?: string,
        from?: {
            name: string,
            email: string
        },
        smtp?: {
            host: string,
            port: number,
            secure: boolean,
            auth: {
                user: string,
                pass: string
            }
        },
        templates?: {
            path: string,
            defaultLocale: string
        }
    },
    sms?: {
        provider?: string,
        credentials?: Record<string, string>,
        templates?: {
            path: string,
            defaultLocale: string
        }
    },
    storage?: {
        provider?: string,
        bucket?: string,
        region?: string,
        credentials?: Record<string, string>,
        cdn?: {
            enabled: boolean,
            url: string
        }
    },
    cache?: {
        provider?: string,
        ttl?: number,
        prefix?: string,
        credentials?: Record<string, string>
    },
    logging?: {
        level?: string,
        format?: string,
        destination?: string,
        retention?: number,
        alerts?: {
            enabled: boolean,
            channels: string[]
        }
    },
    backup?: {
        enabled?: boolean,
        schedule?: string,
        retention?: number,
        storage?: {
            provider: string,
            path: string
        },
        include?: string[],
        exclude?: string[]
    }
}

Response:
{
    data: {
        message: string,
        updatedAt: string,
        requiresRestart: boolean
    }
}
```

#### Test Email Settings
```typescript
POST /api/v2/admin/settings/test-email

Request Body:
{
    to: string,
    subject: string,
    body: string
}

Response:
{
    data: {
        success: boolean,
        message: string,
        details?: {
            sentAt: string,
            deliveryStatus?: string,
            error?: string
        }
    }
}
```

#### Test SMS Settings
```typescript
POST /api/v2/admin/settings/test-sms

Request Body:
{
    to: string,
    message: string
}

Response:
{
    data: {
        success: boolean,
        message: string,
        details?: {
            sentAt: string,
            deliveryStatus?: string,
            error?: string
        }
    }
}
```

#### Test Storage Settings
```typescript
POST /api/v2/admin/settings/test-storage

Request Body:
{
    file: File,
    path: string
}

Response:
{
    data: {
        success: boolean,
        message: string,
        details?: {
            url: string,
            size: number,
            mimeType: string,
            error?: string
        }
    }
}
```

#### Get System Health
```typescript
GET /api/v2/admin/settings/health

Response:
{
    data: {
        status: "healthy" | "warning" | "critical",
        lastChecked: string,
        components: {
            database: {
                status: "up" | "down",
                latency: number,
                size: number,
                connections: number
            },
            cache: {
                status: "up" | "down",
                latency: number,
                memory: number,
                keys: number
            },
            storage: {
                status: "up" | "down",
                latency: number,
                space: {
                    used: number,
                    free: number,
                    total: number
                }
            },
            email: {
                status: "up" | "down",
                lastSent: string,
                queueSize: number
            },
            sms: {
                status: "up" | "down",
                lastSent: string,
                queueSize: number
            }
        },
        resources: {
            cpu: {
                usage: number,
                cores: number,
                load: number
            },
            memory: {
                used: number,
                free: number,
                total: number
            },
            disk: {
                used: number,
                free: number,
                total: number
            },
            network: {
                bytesIn: number,
                bytesOut: number,
                connections: number
            }
        },
        alerts: Array<{
            id: string,
            type: "error" | "warning" | "info",
            component: string,
            message: string,
            timestamp: string,
            status: "active" | "resolved"
        }>
    }
}
```

#### Get System Logs
```typescript
GET /api/v2/admin/settings/logs

Query Parameters:
{
    level?: "error" | "warning" | "info" | "debug",
    component?: string,
    from?: string (ISO date),
    to?: string (ISO date),
    search?: string,
    page?: number,
    limit?: number
}

Response:
{
    data: Array<{
        id: string,
        level: string,
        component: string,
        message: string,
        timestamp: string,
        metadata?: Record<string, any>
    }>,
    pagination: {
        total: number,
        page: number,
        limit: number,
        pages: number
    }
}
```

#### Get Backup Status
```typescript
GET /api/v2/admin/settings/backup

Response:
{
    data: {
        lastBackup: {
            timestamp: string,
            size: number,
            status: "success" | "failed",
            error?: string
        },
        nextBackup: string,
        schedule: string,
        retention: number,
        storage: {
            provider: string,
            path: string,
            space: {
                used: number,
                free: number,
                total: number
            }
        },
        history: Array<{
            timestamp: string,
            size: number,
            status: "success" | "failed",
            error?: string
        }>
    }
}
```

#### Trigger Backup
```typescript
POST /api/v2/admin/settings/backup

Request Body:
{
    type: "full" | "incremental",
    notifyOnComplete?: boolean
}

Response:
{
    data: {
        id: string,
        type: string,
        status: "queued" | "in-progress" | "completed" | "failed",
        message: string,
        startedAt: string,
        estimatedCompletion?: string
    }
}
```

// ... existing code ...