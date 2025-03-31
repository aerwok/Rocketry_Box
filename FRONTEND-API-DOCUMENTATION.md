# Rocketry Box - Frontend API Documentation

## Table of Contents
1. [API Overview](#api-overview)
2. [Authentication](#authentication)
3. [API Endpoints](#api-endpoints)
4. [Data Models](#data-models)
5. [Error Handling](#error-handling)
6. [Rate Limiting](#rate-limiting)
7. [WebSocket Events](#websocket-events)
8. [File Upload](#file-upload)
9. [Testing](#testing)

## API Overview

### Base URL
```
Development: http://localhost:8000
Production: https://api.rocketrybox.com
```

### API Version
All endpoints are prefixed with `/api/v1/`

### Content Type
All requests and responses use `application/json`

### Authentication
All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

## Authentication

### Login
```typescript
POST /api/v1/auth/login
Content-Type: application/json

Request Body:
{
  "emailOrPhone": string,    // Email or 10-digit phone number
  "password": string,        // Password
  "otp": string,            // Optional, required for forgot password
  "rememberMe": boolean     // Optional, defaults to false
}

Response:
{
  "token": string,
  "user": {
    "id": string,
    "name": string,
    "email": string,
    "phone": string,
    "role": "customer" | "seller" | "admin"
  }
}
```

### Register
```typescript
POST /api/v1/auth/register
Content-Type: application/json

Request Body:
{
  "name": string,          // min 2 characters
  "mobile": string,        // exactly 10 digits
  "mobileOtp": string,     // exactly 6 digits
  "email": string,         // valid email format
  "emailOtp": string,      // exactly 6 digits
  "password": string,      // see password rules below
  "confirmPassword": string,// must match password
  "address1": string,      // required
  "address2": string,      // optional
  "city": string,         // required
  "state": string,        // required
  "pincode": string,      // exactly 6 digits
  "acceptTerms": boolean   // must be true
}

Response:
{
  "token": string,
  "user": {
    "id": string,
    "name": string,
    "email": string,
    "phone": string,
    "role": "customer" | "seller" | "admin"
  }
}
```

### Password Rules
```typescript
{
  minLength: 8,
  requirements: [
    "At least one uppercase letter",
    "At least one lowercase letter",
    "At least one number",
    "At least one special character"
  ]
}
```

### OTP Endpoints
```typescript
// Send Mobile OTP
POST /api/v1/auth/send-mobile-otp
{
  "mobile": string
}

// Send Email OTP
POST /api/v1/auth/send-email-otp
{
  "email": string
}

// Verify OTP
POST /api/v1/auth/verify-otp
{
  "phoneOrEmail": string,
  "otp": string,      // 6 digits
  "type": "mobile" | "email"
}
```

## API Endpoints

### Customer Endpoints

#### Profile Management
```typescript
// Get Profile
GET /api/v1/customer/profile

Response:
{
  "id": string,
  "name": string,
  "email": string,
  "phone": string,
  "address": {
    "street": string,
    "city": string,
    "state": string,
    "pincode": string,
    "country": string
  }
}

// Update Profile
PUT /api/v1/customer/profile
{
  "name": string,
  "phone": string,
  "address": {
    "street": string,
    "city": string,
    "state": string,
    "pincode": string,
    "country": string
  },
  "email": string,
  "password": {
    "current": string,
    "new": string
  }
}
```

#### Orders
```typescript
// Create Order
POST /api/v1/customer/orders
{
  "pickupAddress": {
    "street": string,
    "city": string,
    "state": string,
    "pincode": string,
    "country": string,
    "contactName": string,
    "contactPhone": string
  },
  "deliveryAddress": {
    "street": string,
    "city": string,
    "state": string,
    "pincode": string,
    "country": string,
    "contactName": string,
    "contactPhone": string
  },
  "package": {
    "weight": number,  // in kg
    "length": number,  // in cm
    "width": number,   // in cm
    "height": number,  // in cm
    "items": Array<{
      "name": string,
      "quantity": number,
      "value": number
    }>,
    "totalValue": number
  },
  "serviceType": "express" | "standard",
  "paymentMethod": "prepaid" | "cod"
}

// List Orders
GET /api/v1/customer/orders
Query Parameters:
{
  "page": number,
  "limit": number,
  "status": "pending" | "processing" | "shipped" | "delivered" | "cancelled"
}

// Order Details
GET /api/v1/customer/orders/:orderId
```

### Seller Endpoints

#### Profile Management
```typescript
// Get Profile
GET /api/v1/seller/profile

Response:
{
  "id": string,
  "name": string,
  "email": string,
  "phone": string,
  "companyName": string,
  "companyCategory": string,
  "brandName": string,
  "website": string,
  "supportContact": string,
  "supportEmail": string,
  "operationsEmail": string,
  "financeEmail": string,
  "rechargeType": string,
  "profileImage": string,
  "storeLinks": {
    "website": string,
    "amazon": string,
    "shopify": string,
    "opencart": string
  },
  "address": {
    "street": string,
    "city": string,
    "state": string,
    "country": string,
    "postalCode": string,
    "landmark": string
  },
  "documents": {
    "gstin": string,
    "pan": string,
    "cin": string,
    "tradeLicense": string,
    "msmeRegistration": string,
    "aadhaar": string,
    "documents": Array<{
      "name": string,
      "type": string,
      "url": string,
      "status": "verified" | "pending" | "rejected"
    }>
  },
  "bankDetails": Array<{
    "accountName": string,
    "accountNumber": string,
    "bankName": string,
    "branch": string,
    "ifscCode": string,
    "swiftCode": string,
    "accountType": string,
    "isDefault": boolean,
    "cancelledCheque": {
      "url": string,
      "status": "verified" | "pending"
    }
  }>
}

// Update Profile
PUT /api/v1/seller/profile
{
  "name": string,
  "phone": string,
  "companyName": string,
  "companyCategory": string,
  "brandName": string,
  "website": string,
  "supportContact": string,
  "supportEmail": string,
  "operationsEmail": string,
  "financeEmail": string,
  "rechargeType": string,
  "address": {
    "street": string,
    "city": string,
    "state": string,
    "country": string,
    "postalCode": string,
    "landmark": string
  }
}

// Update Profile Image
POST /api/v1/seller/profile/image
Content-Type: multipart/form-data
{
  "image": File
}

// Update Store Links
PUT /api/v1/seller/profile/store-links
{
  "website": string,
  "amazon": string,
  "shopify": string,
  "opencart": string
}
```

### Admin Endpoints

#### User Management
```typescript
// List Users
GET /api/v1/admin/users
Query Parameters:
{
  "page": number,
  "limit": number,
  "role": "customer" | "seller" | "admin",
  "status": "active" | "inactive" | "suspended"
}

// User Details
GET /api/v1/admin/users/:userId

// Update User Status
PUT /api/v1/admin/users/:userId/status
{
  "status": "active" | "inactive" | "suspended",
  "reason": string
}
```

#### Order Management
```typescript
// List Orders
GET /api/v1/admin/orders
Query Parameters:
{
  "page": number,
  "limit": number,
  "status": "pending" | "processing" | "shipped" | "delivered" | "cancelled",
  "dateRange": {
    "start": string,  // ISO date
    "end": string     // ISO date
  }
}

// Order Details
GET /api/v1/admin/orders/:orderId

// Update Order Status
PUT /api/v1/admin/orders/:orderId/status
{
  "status": "processing" | "shipped" | "delivered" | "cancelled",
  "location": string,
  "notes": string
}
```

## Data Models

### User Model
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "customer" | "seller" | "admin";
  status: "active" | "inactive" | "suspended";
  createdAt: string;
  updatedAt: string;
}
```

### Order Model
```typescript
interface Order {
  id: string;
  trackingId: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  updatedAt: string;
  pickupAddress: Address;
  deliveryAddress: Address;
  package: PackageDetails;
  timeline: Array<{
    status: string;
    location: string;
    timestamp: string;
    description: string;
  }>;
  payment: {
    status: string;
    method: string;
    amount: number;
  };
}

interface Address {
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  contactName: string;
  contactPhone: string;
}

interface PackageDetails {
  weight: number;
  length: number;
  width: number;
  height: number;
  items: Array<{
    name: string;
    quantity: number;
    value: number;
  }>;
  totalValue: number;
}
```

## Error Handling

### Error Response Format
```typescript
{
  "status": number,
  "message": string,
  "errors": {
    [key: string]: string[]
  }
}
```

### Common Error Codes
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 422: Validation Error
- 429: Too Many Requests
- 500: Internal Server Error

### Validation Error Example
```typescript
{
  "status": 422,
  "message": "Validation failed",
  "errors": {
    "email": ["Invalid email format"],
    "password": ["Password must be at least 8 characters"]
  }
}
```

## Rate Limiting

### Rate Limits
- 100 requests per minute per IP
- 1000 requests per hour per user
- 10,000 requests per day per user

### Rate Limit Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1623456789
```

## WebSocket Events

### Connection
```typescript
// Connect
ws://api.rocketrybox.com/ws
Headers:
{
  "Authorization": "Bearer <token>"
}
```

### Events
```typescript
// Order Status Update
{
  "type": "order_status_update",
  "data": {
    "orderId": string,
    "status": string,
    "location": string,
    "timestamp": string
  }
}

// Notification
{
  "type": "notification",
  "data": {
    "id": string,
    "title": string,
    "message": string,
    "type": "info" | "success" | "warning" | "error",
    "timestamp": string
  }
}
```

## File Upload

### Upload Endpoint
```typescript
POST /api/v1/upload
Content-Type: multipart/form-data

Request:
{
  "file": File
}

Response:
{
  "url": string,
  "filename": string,
  "size": number,
  "mimeType": string
}
```

### Supported File Types
- Images: jpg, jpeg, png, gif
- Documents: pdf, doc, docx
- Maximum Size: 10MB

## Testing

### Test Environment
```
Development: http://localhost:8000
Staging: https://staging-api.rocketrybox.com
```

### Test Credentials
```typescript
// Admin
{
  "email": "admin@test.com",
  "password": "Test@123"
}

// Seller
{
  "email": "seller@test.com",
  "password": "Test@123"
}

// Customer
{
  "email": "customer@test.com",
  "password": "Test@123"
}
```

### Test Data
- Test orders
- Test users
- Test documents
- Test addresses

## Additional Notes

### CORS
- Allowed Origins: 
  - http://localhost:3000
  - https://rocketrybox.com
  - https://seller.rocketrybox.com
  - https://admin.rocketrybox.com

### Cache Control
- GET requests: Cache-Control: public, max-age=300
- POST/PUT/DELETE: Cache-Control: no-cache

### Pagination
- Default limit: 20
- Maximum limit: 100
- Page parameter: 1-based index

### Sorting
- Default sort: createdAt DESC
- Supported fields: createdAt, updatedAt, status
- Format: ?sort=field:asc|desc

### Filtering
- Supported operators: eq, ne, gt, lt, gte, lte, in, nin
- Format: ?filter[field]=value
- Example: ?filter[status]=active&filter[createdAt][gte]=2024-01-01 

### Marketing Endpoints

#### Contact Form
```typescript
// Submit Contact Form
POST /api/v1/marketing/contact
{
  "name": string,      // min: 2, max: 50 characters
  "email": string,     // valid email format
  "subject": string,   // min: 5, max: 100 characters
  "message": string,   // min: 10, max: 1000 characters
  "companyName": string // optional
}

Response:
{
  "success": boolean,
  "message": string
}
```

#### Newsletter Subscription
```typescript
// Subscribe to Newsletter
POST /api/v1/marketing/newsletter
{
  "email": string,     // valid email format
  "name": string,      // optional
  "preferences": {     // optional
    "updates": boolean,
    "promotions": boolean,
    "blog": boolean
  }
}

Response:
{
  "success": boolean,
  "message": string
}
```

### Bulk Order Endpoints

#### Create Bulk Order
```typescript
// Create Bulk Order
POST /api/v1/seller/bulk-orders
{
  "orders": Array<{
    "pickupAddress": {
      "street": string,
      "city": string,
      "state": string,
      "pincode": string,
      "country": string,
      "contactName": string,
      "contactPhone": string
    },
    "deliveryAddress": {
      "street": string,
      "city": string,
      "state": string,
      "pincode": string,
      "country": string,
      "contactName": string,
      "contactPhone": string
    },
    "package": {
      "weight": number,
      "length": number,
      "width": number,
      "height": number,
      "items": Array<{
        "name": string,
        "quantity": number,
        "value": number
      }>,
      "totalValue": number
    },
    "serviceType": "express" | "standard",
    "paymentMethod": "prepaid" | "cod"
  }>,
  "template": {
    "name": string,
    "description": string,
    "isDefault": boolean
  }
}

Response:
{
  "success": boolean,
  "message": string,
  "data": {
    "templateId": string,
    "orders": Array<{
      "id": string,
      "trackingId": string,
      "status": string
    }>
  }
}
```

#### Bulk Order Templates
```typescript
// List Templates
GET /api/v1/seller/bulk-orders/templates

// Create Template
POST /api/v1/seller/bulk-orders/templates
{
  "name": string,
  "description": string,
  "isDefault": boolean,
  "template": {
    "pickupAddress": Address,
    "deliveryAddress": Address,
    "package": PackageDetails,
    "serviceType": "express" | "standard",
    "paymentMethod": "prepaid" | "cod"
  }
}

// Update Template
PUT /api/v1/seller/bulk-orders/templates/:templateId
{
  "name": string,
  "description": string,
  "isDefault": boolean,
  "template": {
    "pickupAddress": Address,
    "deliveryAddress": Address,
    "package": PackageDetails,
    "serviceType": "express" | "standard",
    "paymentMethod": "prepaid" | "cod"
  }
}

// Delete Template
DELETE /api/v1/seller/bulk-orders/templates/:templateId
```

### Wallet Service Endpoints

#### Wallet Management
```typescript
// Get Wallet Balance
GET /api/v1/wallet/balance

Response:
{
  "balance": number,
  "currency": string,
  "lastUpdated": string
}

// Get Wallet Transactions
GET /api/v1/wallet/transactions
Query Parameters:
{
  "page": number,
  "limit": number,
  "type": "credit" | "debit",
  "dateRange": {
    "start": string,
    "end": string
  }
}

Response:
{
  "transactions": Array<{
    "id": string,
    "type": "credit" | "debit",
    "amount": number,
    "description": string,
    "timestamp": string,
    "status": "completed" | "pending" | "failed",
    "reference": string
  }>,
  "total": number,
  "page": number,
  "limit": number
}
```

#### Wallet Operations
```typescript
// Add Money
POST /api/v1/wallet/add-money
{
  "amount": number,
  "paymentMethod": "card" | "upi" | "netbanking",
  "paymentDetails": {
    "cardNumber": string,    // for card
    "upiId": string,        // for upi
    "bankCode": string      // for netbanking
  }
}

// Withdraw Money
POST /api/v1/wallet/withdraw
{
  "amount": number,
  "bankDetails": {
    "accountNumber": string,
    "ifscCode": string,
    "accountName": string
  }
}

// Transfer Money
POST /api/v1/wallet/transfer
{
  "amount": number,
  "recipientId": string,
  "recipientType": "seller" | "customer",
  "note": string
}
```

### Common Response Types

#### Pagination Response
```typescript
interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
```

#### Success Response
```typescript
interface SuccessResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}
```

### Order Tracking

#### Track Order
```typescript
// Track Order
GET /api/v1/orders/track/:trackingId

Response:
{
  "trackingId": string,
  "status": "pending" | "processing" | "shipped" | "delivered" | "cancelled",
  "currentLocation": string,
  "estimatedDelivery": string,
  "timeline": Array<{
    "status": string,
    "location": string,
    "timestamp": string,
    "description": string
  }>,
  "package": {
    "weight": number,
    "dimensions": {
      "length": number,
      "width": number,
      "height": number
    }
  },
  "addresses": {
    "pickup": Address,
    "delivery": Address
  }
}
```

### Document Verification

#### Upload Document
```typescript
// Upload Document
POST /api/v1/documents/upload
Content-Type: multipart/form-data

Request:
{
  "file": File,
  "type": "gstin" | "pan" | "cin" | "tradeLicense" | "msmeRegistration" | "aadhaar",
  "description": string
}

Response:
{
  "id": string,
  "name": string,
  "type": string,
  "url": string,
  "status": "pending",
  "uploadedAt": string
}
```

#### Get Document Status
```typescript
// Get Document Status
GET /api/v1/documents/:documentId/status

Response:
{
  "id": string,
  "name": string,
  "type": string,
  "url": string,
  "status": "verified" | "pending" | "rejected",
  "verifiedAt": string,
  "rejectionReason": string,
  "verifiedBy": string
}
```

### Support Tickets

#### Create Ticket
```typescript
// Create Support Ticket
POST /api/v1/support/tickets
{
  "subject": string,
  "description": string,
  "priority": "low" | "medium" | "high",
  "category": "order" | "payment" | "technical" | "other",
  "orderId": string,  // optional
  "attachments": Array<{
    "name": string,
    "url": string,
    "type": string
  }>
}

Response:
{
  "id": string,
  "ticketNumber": string,
  "status": "open" | "in_progress" | "resolved" | "closed",
  "createdAt": string,
  "updatedAt": string
}
```

#### List Tickets
```typescript
// List Support Tickets
GET /api/v1/support/tickets
Query Parameters:
{
  "page": number,
  "limit": number,
  "status": "open" | "in_progress" | "resolved" | "closed",
  "priority": "low" | "medium" | "high",
  "category": "order" | "payment" | "technical" | "other"
}

Response: PaginatedResponse<Ticket>
```

### Analytics

#### Dashboard Analytics
```typescript
// Get Dashboard Analytics
GET /api/v1/analytics/dashboard
Query Parameters:
{
  "startDate": string,  // ISO date
  "endDate": string     // ISO date
}

Response:
{
  "orders": {
    "total": number,
    "pending": number,
    "processing": number,
    "shipped": number,
    "delivered": number,
    "cancelled": number,
    "revenue": number
  },
  "shipments": {
    "total": number,
    "byStatus": {
      "pending": number,
      "processing": number,
      "shipped": number,
      "delivered": number,
      "cancelled": number
    },
    "byService": {
      "express": number,
      "standard": number
    }
  },
  "revenue": {
    "total": number,
    "byPaymentMethod": {
      "prepaid": number,
      "cod": number
    },
    "byService": {
      "express": number,
      "standard": number
    }
  }
}
```

### Additional Data Models

#### Support Ticket Model
```typescript
interface Ticket {
  id: string;
  ticketNumber: string;
  subject: string;
  description: string;
  priority: "low" | "medium" | "high";
  category: "order" | "payment" | "technical" | "other";
  status: "open" | "in_progress" | "resolved" | "closed";
  orderId?: string;
  attachments: Array<{
    name: string;
    url: string;
    type: string;
  }>;
  messages: Array<{
    id: string;
    content: string;
    sender: {
      id: string;
      name: string;
      role: "customer" | "seller" | "admin";
    };
    timestamp: string;
    attachments?: Array<{
      name: string;
      url: string;
      type: string;
    }>;
  }>;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  closedAt?: string;
}
```

#### Document Verification Model
```typescript
interface Document {
  id: string;
  name: string;
  type: "gstin" | "pan" | "cin" | "tradeLicense" | "msmeRegistration" | "aadhaar";
  url: string;
  status: "verified" | "pending" | "rejected";
  description?: string;
  uploadedAt: string;
  verifiedAt?: string;
  rejectionReason?: string;
  verifiedBy?: string;
  metadata?: {
    [key: string]: any;
  };
}
```

#### Analytics Model
```typescript
interface Analytics {
  orders: {
    total: number;
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
    revenue: number;
  };
  shipments: {
    total: number;
    byStatus: {
      pending: number;
      processing: number;
      shipped: number;
      delivered: number;
      cancelled: number;
    };
    byService: {
      express: number;
      standard: number;
    };
  };
  revenue: {
    total: number;
    byPaymentMethod: {
      prepaid: number;
      cod: number;
    };
    byService: {
      express: number;
      standard: number;
    };
  };
  trends: {
    daily: Array<{
      date: string;
      orders: number;
      revenue: number;
    }>;
    weekly: Array<{
      week: string;
      orders: number;
      revenue: number;
    }>;
    monthly: Array<{
      month: string;
      orders: number;
      revenue: number;
    }>;
  };
}
```

### Profile Service Endpoints

#### Update Profile Settings
```typescript
// Update Profile Settings
PUT /api/v1/profile/settings
{
  "notifications": {
    "email": {
      "orderUpdates": boolean,
      "promotions": boolean,
      "newsletter": boolean
    },
    "sms": {
      "orderUpdates": boolean,
      "promotions": boolean
    },
    "push": {
      "orderUpdates": boolean,
      "promotions": boolean
    }
  },
  "preferences": {
    "language": "en" | "hi",
    "currency": "INR" | "USD",
    "timezone": string,
    "theme": "light" | "dark" | "system"
  }
}

Response:
{
  "success": boolean,
  "message": string,
  "data": {
    "notifications": {
      "email": {
        "orderUpdates": boolean,
        "promotions": boolean,
        "newsletter": boolean
      },
      "sms": {
        "orderUpdates": boolean,
        "promotions": boolean
      },
      "push": {
        "orderUpdates": boolean,
        "promotions": boolean
      }
    },
    "preferences": {
      "language": string,
      "currency": string,
      "timezone": string,
      "theme": string
    }
  }
}
```

#### Get Profile Settings
```typescript
// Get Profile Settings
GET /api/v1/profile/settings

Response:
{
  "success": boolean,
  "data": {
    "notifications": {
      "email": {
        "orderUpdates": boolean,
        "promotions": boolean,
        "newsletter": boolean
      },
      "sms": {
        "orderUpdates": boolean,
        "promotions": boolean
      },
      "push": {
        "orderUpdates": boolean,
        "promotions": boolean
      }
    },
    "preferences": {
      "language": string,
      "currency": string,
      "timezone": string,
      "theme": string
    }
  }
}
```

### Notification Endpoints

#### Get Notifications
```typescript
// Get Notifications
GET /api/v1/notifications
Query Parameters:
{
  "page": number,
  "limit": number,
  "type": "order" | "system" | "promotion",
  "read": boolean
}

Response: PaginatedResponse<Notification>
```

#### Mark Notifications as Read
```typescript
// Mark Notifications as Read
PUT /api/v1/notifications/read
{
  "notificationIds": string[]  // Array of notification IDs to mark as read
}

Response:
{
  "success": boolean,
  "message": string,
  "data": {
    "markedAsRead": number  // Number of notifications marked as read
  }
}
```

#### Delete Notifications
```typescript
// Delete Notifications
DELETE /api/v1/notifications
{
  "notificationIds": string[]  // Array of notification IDs to delete
}

Response:
{
  "success": boolean,
  "message": string,
  "data": {
    "deleted": number  // Number of notifications deleted
  }
}
```

### Additional Data Models

#### Notification Model
```typescript
interface Notification {
  id: string;
  type: "order" | "system" | "promotion";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  data?: {
    orderId?: string;
    trackingId?: string;
    status?: string;
    [key: string]: any;
  };
  action?: {
    type: "view_order" | "track_shipment" | "view_promotion";
    data: {
      [key: string]: any;
    };
  };
}
```

#### Profile Settings Model
```typescript
interface ProfileSettings {
  notifications: {
    email: {
      orderUpdates: boolean;
      promotions: boolean;
      newsletter: boolean;
    };
    sms: {
      orderUpdates: boolean;
      promotions: boolean;
    };
    push: {
      orderUpdates: boolean;
      promotions: boolean;
    };
  };
  preferences: {
    language: "en" | "hi";
    currency: "INR" | "USD";
    timezone: string;
    theme: "light" | "dark" | "system";
  };
}

### System Management Endpoints

#### Maintenance Mode
```typescript
// Get Maintenance Status
GET /api/v1/system/maintenance

Response:
{
  "isMaintenanceMode": boolean,
  "message": string,
  "startTime": string,
  "endTime": string,
  "affectedServices": string[]
}

// Update Maintenance Mode
PUT /api/v1/system/maintenance
{
  "isMaintenanceMode": boolean,
  "message": string,
  "startTime": string,
  "endTime": string,
  "affectedServices": string[]
}

Response:
{
  "success": boolean,
  "message": string,
  "data": {
    "isMaintenanceMode": boolean,
    "message": string,
    "startTime": string,
    "endTime": string,
    "affectedServices": string[]
  }
}
```

#### Policy Management
```typescript
// Get Policies
GET /api/v1/system/policies
Query Parameters:
{
  "type": "privacy" | "terms" | "shipping" | "refund",
  "version": string
}

Response:
{
  "success": boolean,
  "data": {
    "id": string,
    "type": string,
    "version": string,
    "content": string,
    "lastUpdated": string,
    "effectiveFrom": string
  }
}

// Update Policy
PUT /api/v1/system/policies/:policyId
{
  "content": string,
  "effectiveFrom": string
}

Response:
{
  "success": boolean,
  "message": string,
  "data": {
    "id": string,
    "type": string,
    "version": string,
    "content": string,
    "lastUpdated": string,
    "effectiveFrom": string
  }
}
```

#### System Settings
```typescript
// Get System Settings
GET /api/v1/system/settings

Response:
{
  "success": boolean,
  "data": {
    "general": {
      "siteName": string,
      "siteDescription": string,
      "contactEmail": string,
      "supportPhone": string,
      "timezone": string,
      "currency": string
    },
    "shipping": {
      "defaultWeightUnit": "kg",
      "defaultDimensionUnit": "cm",
      "maxWeight": number,
      "maxDimension": number,
      "restrictedItems": string[]
    },
    "payment": {
      "supportedMethods": string[],
      "minAmount": number,
      "maxAmount": number,
      "codEnabled": boolean,
      "codMinAmount": number,
      "codMaxAmount": number
    },
    "notifications": {
      "emailEnabled": boolean,
      "smsEnabled": boolean,
      "pushEnabled": boolean,
      "defaultTemplates": {
        "orderConfirmation": string,
        "orderUpdate": string,
        "paymentConfirmation": string
      }
    }
  }
}

// Update System Settings
PUT /api/v1/system/settings
{
  "general": {
    "siteName": string,
    "siteDescription": string,
    "contactEmail": string,
    "supportPhone": string,
    "timezone": string,
    "currency": string
  },
  "shipping": {
    "defaultWeightUnit": "kg",
    "defaultDimensionUnit": "cm",
    "maxWeight": number,
    "maxDimension": number,
    "restrictedItems": string[]
  },
  "payment": {
    "supportedMethods": string[],
    "minAmount": number,
    "maxAmount": number,
    "codEnabled": boolean,
    "codMinAmount": number,
    "codMaxAmount": number
  },
  "notifications": {
    "emailEnabled": boolean,
    "smsEnabled": boolean,
    "pushEnabled": boolean,
    "defaultTemplates": {
      "orderConfirmation": string,
      "orderUpdate": string,
      "paymentConfirmation": string
    }
  }
}
```

### Agreement Management

#### Get Agreements
```typescript
// Get Agreements
GET /api/v1/agreements
Query Parameters:
{
  "type": "seller" | "customer",
  "version": string
}

Response:
{
  "success": boolean,
  "data": {
    "id": string,
    "type": string,
    "version": string,
    "content": string,
    "lastUpdated": string,
    "effectiveFrom": string,
    "isActive": boolean
  }
}

// Update Agreement
PUT /api/v1/agreements/:agreementId
{
  "content": string,
  "effectiveFrom": string,
  "isActive": boolean
}

Response:
{
  "success": boolean,
  "message": string,
  "data": {
    "id": string,
    "type": string,
    "version": string,
    "content": string,
    "lastUpdated": string,
    "effectiveFrom": string,
    "isActive": boolean
  }
}
```

### Order Actions

#### Order Status Updates
```typescript
// Update Order Status
PUT /api/v1/orders/:orderId/status
{
  "status": "processing" | "shipped" | "delivered" | "cancelled",
  "location": string,
  "notes": string,
  "attachments": Array<{
    "name": string,
    "url": string,
    "type": string
  }>
}

Response:
{
  "success": boolean,
  "message": string,
  "data": {
    "orderId": string,
    "status": string,
    "location": string,
    "notes": string,
    "attachments": Array<{
      "name": string,
      "url": string,
      "type": string
    }>,
    "updatedAt": string
  }
}
```

#### Order Notes
```typescript
// Add Order Note
POST /api/v1/orders/:orderId/notes
{
  "content": string,
  "type": "internal" | "customer",
  "attachments": Array<{
    "name": string,
    "url": string,
    "type": string
  }>
}

Response:
{
  "success": boolean,
  "message": string,
  "data": {
    "id": string,
    "orderId": string,
    "content": string,
    "type": string,
    "attachments": Array<{
      "name": string,
      "url": string,
      "type": string
    }>,
    "createdBy": {
      "id": string,
      "name": string,
      "role": string
    },
    "createdAt": string
  }
}
```

### Additional Data Models

#### Maintenance Mode Model
```typescript
interface MaintenanceMode {
  isMaintenanceMode: boolean;
  message: string;
  startTime: string;
  endTime: string;
  affectedServices: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: string;
    name: string;
    role: string;
  };
}
```

#### Policy Model
```typescript
interface Policy {
  id: string;
  type: "privacy" | "terms" | "shipping" | "refund";
  version: string;
  content: string;
  lastUpdated: string;
  effectiveFrom: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: string;
    name: string;
    role: string;
  };
}
```

#### System Settings Model
```typescript
interface SystemSettings {
  general: {
    siteName: string;
    siteDescription: string;
    contactEmail: string;
    supportPhone: string;
    timezone: string;
    currency: string;
  };
  shipping: {
    defaultWeightUnit: "kg";
    defaultDimensionUnit: "cm";
    maxWeight: number;
    maxDimension: number;
    restrictedItems: string[];
  };
  payment: {
    supportedMethods: string[];
    minAmount: number;
    maxAmount: number;
    codEnabled: boolean;
    codMinAmount: number;
    codMaxAmount: number;
  };
  notifications: {
    emailEnabled: boolean;
    smsEnabled: boolean;
    pushEnabled: boolean;
    defaultTemplates: {
      orderConfirmation: string;
      orderUpdate: string;
      paymentConfirmation: string;
    };
  };
}
```

#### Agreement Model
```typescript
interface Agreement {
  id: string;
  type: "seller" | "customer";
  version: string;
  content: string;
  lastUpdated: string;
  effectiveFrom: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: string;
    name: string;
    role: string;
  };
}
```

#### Order Note Model
```typescript
interface OrderNote {
  id: string;
  orderId: string;
  content: string;
  type: "internal" | "customer";
  attachments: Array<{
    name: string;
    url: string;
    type: string;
  }>;
  createdBy: {
    id: string;
    name: string;
    role: string;
  };
  createdAt: string;
  updatedAt: string;
}
```

## Routing Configuration

### Route Structure
```typescript
// routes/index.tsx
import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicRoute />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />,
      },
      {
        path: '/contact',
        element: <Contact />,
      }
    ]
  },
  {
    path: '/dashboard',
    element: <ProtectedRoute />,
    children: [
      {
        path: '',
        element: <Dashboard />,
      },
      {
        path: 'orders',
        element: <Orders />,
      },
      {
        path: 'profile',
        element: <Profile />,
      }
    ]
  },
  {
    path: '/seller',
    element: <ProtectedRoute allowedRoles={['seller']} />,
    children: [
      {
        path: '',
        element: <SellerDashboard />,
      },
      {
        path: 'products',
        element: <Products />,
      },
      {
        path: 'orders',
        element: <SellerOrders />,
      }
    ]
  },
  {
    path: '/admin',
    element: <ProtectedRoute allowedRoles={['admin']} />,
    children: [
      {
        path: '',
        element: <AdminDashboard />,
      },
      {
        path: 'users',
        element: <UserManagement />,
      },
      {
        path: 'settings',
        element: <SystemSettings />,
      }
    ]
  }
]);
```

### Route Guards
```typescript
// routes/ProtectedRoute.tsx
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <>{children}</>;
};

// routes/PublicRoute.tsx
export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};
```

## Data Fetching Patterns

### React Query Setup
```typescript
// lib/react-query.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 30 * 60 * 1000, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false
    }
  }
});

// App.tsx
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
```

### Custom Query Hooks
```typescript
// hooks/queries/useOrders.ts
export function useOrders(params: OrderQueryParams) {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => orderService.getOrders(params),
    select: (data) => ({
      orders: data.data,
      pagination: data.meta
    })
  });
}

// hooks/queries/useOrder.ts
export function useOrder(orderId: string) {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => orderService.getOrder(orderId),
    enabled: !!orderId
  });
}

// hooks/mutations/useCreateOrder.ts
export function useCreateOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: orderService.createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    }
  });
}
```

### Infinite Queries
```typescript
// hooks/queries/useInfiniteOrders.ts
export function useInfiniteOrders(params: OrderQueryParams) {
  return useInfiniteQuery({
    queryKey: ['infinite-orders', params],
    queryFn: ({ pageParam = 1 }) => 
      orderService.getOrders({ ...params, page: pageParam }),
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.page < lastPage.meta.totalPages) {
        return lastPage.meta.page + 1;
      }
      return undefined;
    }
  });
}

// Usage in component
function OrdersList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteOrders({ status: 'active' });
  
  return (
    <div>
      {data?.pages.map((page) => (
        <div key={page.meta.page}>
          {page.orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      ))}
      
      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
}
```

## API Service Layer

### Base API Service
```typescript
// services/api.service.ts
export class ApiService {
  private static instance: ApiService;
  private baseURL: string;
  private headers: Record<string, string>;
  
  private constructor() {
    this.baseURL = import.meta.env.VITE_API_URL;
    this.headers = {
      'Content-Type': 'application/json'
    };
  }
  
  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }
  
  setToken(token: string) {
    this.headers['Authorization'] = `Bearer ${token}`;
  }
  
  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        ...this.headers,
        ...options.headers
      }
    });
    
    if (!response.ok) {
      throw new ApiError(response);
    }
    
    return response.json();
  }
  
  get<T>(endpoint: string) {
    return this.request<T>(endpoint);
  }
  
  post<T>(endpoint: string, data: any) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
  
  put<T>(endpoint: string, data: any) {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }
  
  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, {
      method: 'DELETE'
    });
  }
}
```

### Feature Services
```typescript
// services/order.service.ts
export class OrderService {
  private api: ApiService;
  
  constructor() {
    this.api = ApiService.getInstance();
  }
  
  async getOrders(params: OrderQueryParams) {
    return this.api.get<PaginatedResponse<Order>>('/orders', { params });
  }
  
  async getOrder(orderId: string) {
    return this.api.get<Order>(`/orders/${orderId}`);
  }
  
  async createOrder(data: CreateOrderData) {
    return this.api.post<Order>('/orders', data);
  }
  
  async updateOrder(orderId: string, data: UpdateOrderData) {
    return this.api.put<Order>(`/orders/${orderId}`, data);
  }
  
  async deleteOrder(orderId: string) {
    return this.api.delete<void>(`/orders/${orderId}`);
  }
}

// services/profile.service.ts
export class ProfileService {
  private api: ApiService;
  
  constructor() {
    this.api = ApiService.getInstance();
  }
  
  async getProfile() {
    return this.api.get<User>('/profile');
  }
  
  async updateProfile(data: UpdateProfileData) {
    return this.api.put<User>('/profile', data);
  }
  
  async updateSettings(data: UpdateSettingsData) {
    return this.api.put<ProfileSettings>('/profile/settings', data);
  }
}
```

## State Management Integration

### Zustand Store Integration
```typescript
// store/auth.store.ts
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  login: (user, token) => set({ user, token, isAuthenticated: true }),
  logout: () => set({ user: null, token: null, isAuthenticated: false }),
  updateUser: (user) => set((state) => ({ 
    user: state.user ? { ...state.user, ...user } : null 
  }))
}));

// store/ui.store.ts
interface UIState {
  theme: 'light' | 'dark' | 'system';
  sidebarOpen: boolean;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  theme: 'system',
  sidebarOpen: true,
  setTheme: (theme) => set({ theme }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen }))
}));
```

### Store Persistence
```typescript
// store/persist.ts
import { persist } from 'zustand/middleware';

export const persistConfig = persist(
  (set) => ({
    // Store configuration
  }),
  {
    name: 'app-storage',
    storage: createJSONStorage(() => localStorage),
    partialize: (state) => ({
      // Only persist specific state
      user: state.user,
      token: state.token,
      theme: state.theme
    })
  }
);

// Usage
export const usePersistedStore = create(persistConfig);
```

### Store Integration with React Query
```typescript
// hooks/useAuth.ts
export function useAuth() {
  const { user, token, isAuthenticated, login, logout, updateUser } = useAuthStore();
  const queryClient = useQueryClient();
  
  const { mutate: loginMutation } = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      login(data.user, data.token);
      queryClient.invalidateQueries({ queryKey: ['user'] });
    }
  });
  
  const { mutate: logoutMutation } = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      logout();
      queryClient.clear();
    }
  });
  
  return {
    user,
    token,
    isAuthenticated,
    login: loginMutation,
    logout: logoutMutation,
    updateUser
  };
}
```

### Store Integration with Components
```typescript
// components/ThemeToggle.tsx
export function ThemeToggle() {
  const { theme, setTheme } = useUIStore();
  
  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800"
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}

// components/Sidebar.tsx
export function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useUIStore();
  
  return (
    <aside
      className={`
        fixed top-0 left-0 h-full bg-white dark:bg-gray-900
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      {/* Sidebar content */}
    </aside>
  );
}
``` 