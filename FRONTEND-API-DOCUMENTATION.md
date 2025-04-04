# Rocketry Box - Frontend API Documentation

## Table of Contents
1. [API Overview](#api-overview)
2. [Authentication](#authentication)
3. [API Endpoints](#api-endpoints)
   - [Customer Endpoints](#customer-endpoints)
   - [Seller Endpoints](#seller-endpoints)
   - [Admin Endpoints](#admin-endpoints)
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
    "weight": number,
    "dimensions": {
      "length": number,
      "width": number,
      "height": number
    },
    "declaredValue": number,
    "description": string
  },
  "payment": {
    "mode": "COD" | "Prepaid",
    "amount": number
  }
}

// Get Orders
GET /api/v1/customer/orders
Query Parameters:
  status?: "pending" | "processing" | "delivered" | "cancelled"
  page?: number
  limit?: number

Response:
{
  "orders": [
    {
      "id": string,
      "trackingNumber": string,
      "status": "pending" | "processing" | "delivered" | "cancelled",
      "createdAt": string,
      "updatedAt": string,
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
        "dimensions": {
          "length": number,
          "width": number,
          "height": number
        },
        "declaredValue": number,
        "description": string
      },
      "payment": {
        "mode": "COD" | "Prepaid",
        "amount": number,
        "status": "pending" | "paid" | "failed"
      }
    }
  ],
  "pagination": {
    "total": number,
    "page": number,
    "limit": number,
    "pages": number
  }
}

// Get Order Details
GET /api/v1/customer/orders/:orderId

Response:
{
  "id": string,
  "trackingNumber": string,
  "status": "pending" | "processing" | "delivered" | "cancelled",
  "createdAt": string,
  "updatedAt": string,
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
    "dimensions": {
      "length": number,
      "width": number,
      "height": number
    },
    "declaredValue": number,
    "description": string
  },
  "payment": {
    "mode": "COD" | "Prepaid",
    "amount": number,
    "status": "pending" | "paid" | "failed"
  },
  "tracking": [
    {
      "status": string,
      "location": string,
      "timestamp": string,
      "description": string
    }
  ]
}

// Cancel Order
POST /api/v1/customer/orders/:orderId/cancel
{
  "reason": string
}
```

### Seller Endpoints

#### Profile Management
```typescript
// Get Seller Profile
GET /api/v1/seller/profile

Response:
{
  "id": string,
  "name": string,
  "email": string,
  "phone": string,
  "businessName": string,
  "gstin": string,
  "address": {
    "street": string,
    "city": string,
    "state": string,
    "pincode": string,
    "country": string
  },
  "bankDetails": {
    "accountNumber": string,
    "ifscCode": string,
    "accountHolderName": string
  }
}

// Update Seller Profile
PUT /api/v1/seller/profile
{
  "name": string,
  "phone": string,
  "businessName": string,
  "gstin": string,
  "address": {
    "street": string,
    "city": string,
    "state": string,
    "pincode": string,
    "country": string
  },
  "bankDetails": {
    "accountNumber": string,
    "ifscCode": string,
    "accountHolderName": string
  }
}
```

#### Orders Management
```typescript
// Get Orders
GET /api/v1/seller/orders
Query Parameters:
  from?: string (ISO date)
  to?: string (ISO date)
  status?: "not-booked" | "processing" | "booked" | "cancelled" | "shipment-cancelled" | "error"
  search?: string
  page?: number
  limit?: number

Response:
{
  "data": [
    {
      "orderId": string,
      "date": string,
      "customer": string,
      "contact": string,
      "items": [
        {
          "name": string,
          "sku": string,
          "quantity": number,
          "price": number
        }
      ],
      "amount": string,
      "payment": "COD" | "Prepaid",
      "chanel": "MANUAL" | "EXCEL" | "SHOPIFY" | "WOOCOMMERCE" | "AMAZON" | "FLIPKART" | "OPENCART" | "API",
      "weight": string,
      "tags": string,
      "action": "Ship" | "Processing" | "In Transit" | "Cancelled" | "Error" | "Pending",
      "whatsapp": "Message Delivered" | "Message Read" | "Order Confirm" | "Order Cancelled",
      "status": "not-booked" | "processing" | "booked" | "cancelled" | "shipment-cancelled" | "error",
      "awbNumber": string,
      "pincode": string
    }
  ],
  "pagination": {
    "total": number,
    "page": number,
    "limit": number,
    "pages": number
  }
}

// Get Order Stats
GET /api/v1/seller/orders/stats
Query Parameters:
  from?: string (ISO date)
  to?: string (ISO date)
  status?: "not-booked" | "processing" | "booked" | "cancelled" | "shipment-cancelled" | "error"

Response:
{
  "data": {
    "total": number,
    "notBooked": number,
    "processing": number,
    "booked": number,
    "cancelled": number,
    "shipmentCancelled": number,
    "error": number
  }
}

// Update Order Status
PATCH /api/v1/seller/orders/:orderId/status
{
  "status": "not-booked" | "processing" | "booked" | "cancelled" | "shipment-cancelled" | "error"
}

// Bulk Update Order Status
PATCH /api/v1/seller/orders/bulk-status
{
  "orderIds": string[],
  "status": "not-booked" | "processing" | "booked" | "cancelled" | "shipment-cancelled" | "error"
}

// Process Shipping
POST /api/v1/seller/orders/ship
{
  "orderIds": string[],
  "shippingOptions": {
    "warehouse": string,
    "rtoWarehouse": string,
    "shippingMode": "surface" | "air",
    "courier": string
  }
}

// Get Shipping Options
GET /api/v1/seller/shipping-options

Response:
{
  "data": {
    "warehouses": [
      {
        "id": string,
        "name": string,
        "address": string
      }
    ],
    "rtoWarehouses": [
      {
        "id": string,
        "name": string,
        "address": string
      }
    ],
    "shippingModes": [
      {
        "id": string,
        "name": string,
        "description": string
      }
    ],
    "couriers": [
      {
        "id": string,
        "name": string,
        "description": string
      }
    ]
  }
}
```

#### Inventory Management
```typescript
// Get Inventory
GET /api/v1/seller/inventory
Query Parameters:
  search?: string
  category?: string
  page?: number
  limit?: number

Response:
{
  "data": [
    {
      "id": string,
      "name": string,
      "sku": string,
      "category": string,
      "price": number,
      "stock": number,
      "images": string[]
    }
  ],
  "pagination": {
    "total": number,
    "page": number,
    "limit": number,
    "pages": number
  }
}

// Add Inventory Item
POST /api/v1/seller/inventory
{
  "name": string,
  "sku": string,
  "category": string,
  "price": number,
  "stock": number,
  "images": string[]
}

// Update Inventory Item
PUT /api/v1/seller/inventory/:itemId
{
  "name": string,
  "sku": string,
  "category": string,
  "price": number,
  "stock": number,
  "images": string[]
}

// Delete Inventory Item
DELETE /api/v1/seller/inventory/:itemId
```

#### Analytics
```typescript
// Get Sales Analytics
GET /api/v1/seller/analytics/sales
Query Parameters:
  from?: string (ISO date)
  to?: string (ISO date)
  groupBy?: "day" | "week" | "month"

Response:
{
  "data": {
    "totalSales": number,
    "totalOrders": number,
    "averageOrderValue": number,
    "salesByPeriod": [
      {
        "period": string,
        "sales": number,
        "orders": number
      }
    ]
  }
}

// Get Product Analytics
GET /api/v1/seller/analytics/products
Query Parameters:
  from?: string (ISO date)
  to?: string (ISO date)
  limit?: number

Response:
{
  "data": {
    "topProducts": [
      {
        "id": string,
        "name": string,
        "sku": string,
        "sales": number,
        "revenue": number
      }
    ],
    "lowStockProducts": [
      {
        "id": string,
        "name": string,
        "sku": string,
        "stock": number,
        "threshold": number
      }
    ]
  }
}
```

### Admin Endpoints

#### User Management
```typescript
// Get Users
GET /api/v1/admin/users
Query Parameters:
  role?: "customer" | "seller" | "admin"
  search?: string
  page?: number
  limit?: number

Response:
{
  "data": [
    {
      "id": string,
      "name": string,
      "email": string,
      "phone": string,
      "role": "customer" | "seller" | "admin",
      "status": "active" | "inactive" | "suspended",
      "createdAt": string
    }
  ],
  "pagination": {
    "total": number,
    "page": number,
    "limit": number,
    "pages": number
  }
}

// Update User Status
PATCH /api/v1/admin/users/:userId/status
{
  "status": "active" | "inactive" | "suspended"
}
```

#### Order Management
```typescript
// Get All Orders
GET /api/v1/admin/orders
Query Parameters:
  from?: string (ISO date)
  to?: string (ISO date)
  status?: string
  sellerId?: string
  customerId?: string
  page?: number
  limit?: number

Response:
{
  "data": [
    {
      "id": string,
      "orderId": string,
      "sellerId": string,
      "customerId": string,
      "status": string,
      "createdAt": string,
      "updatedAt": string,
      "details": object
    }
  ],
  "pagination": {
    "total": number,
    "page": number,
    "limit": number,
    "pages": number
  }
}

// Update Order
PATCH /api/v1/admin/orders/:orderId
{
  "status": string,
  "notes": string
}
```

## Data Models

### OrderData
```typescript
interface OrderItem {
  name: string;
  sku: string;
  quantity: number;
  price: number;
}

interface OrderData {
  orderId: string;
  date: string;
  customer: string;
  contact: string;
  items: OrderItem[];
  amount: string;
  payment: "COD" | "Prepaid";
  chanel: "MANUAL" | "EXCEL" | "SHOPIFY" | "WOOCOMMERCE" | "AMAZON" | "FLIPKART" | "OPENCART" | "API";
  weight: string;
  tags: string;
  action: "Ship" | "Processing" | "In Transit" | "Cancelled" | "Error" | "Pending";
  whatsapp: "Message Delivered" | "Message Read" | "Order Confirm" | "Order Cancelled";
  status: "not-booked" | "processing" | "booked" | "cancelled" | "shipment-cancelled" | "error";
  awbNumber?: string;
  pincode?: string;
}
```

### OrderFilters
```typescript
interface OrderFilters {
  dateRange?: {
    from: Date;
    to: Date;
  };
  status?: OrderData['status'];
  search?: string;
}
```

### OrderStats
```typescript
interface OrderStats {
  total: number;
  notBooked: number;
  processing: number;
  booked: number;
  cancelled: number;
  shipmentCancelled: number;
  error: number;
}
```

### ShippingOptions
```typescript
interface ShippingOptions {
  warehouse: string;
  rtoWarehouse: string;
  shippingMode: string;
  courier: string;
}
```

## Error Handling

All API responses follow a standard format:

```typescript
// Success Response
{
  "data": T,
  "message": string,
  "status": number
}

// Error Response
{
  "message": string,
  "code": string,
  "status": number,
  "details": unknown
}
```

Common error codes:
- `UNAUTHORIZED`: Authentication required or token expired
- `FORBIDDEN`: User doesn't have permission
- `NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Request validation failed
- `SERVER_ERROR`: Internal server error

## Rate Limiting

API requests are limited to:
- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1620000000
```

## WebSocket Events

WebSocket connection: `ws://api.rocketrybox.com/ws`

### Events

#### Order Status Update
```json
{
  "event": "order_status_update",
  "data": {
    "orderId": "string",
    "status": "string",
    "timestamp": "string"
  }
}
```

#### New Order
```json
{
  "event": "new_order",
  "data": {
    "orderId": "string",
    "customer": "string",
    "amount": "string",
    "timestamp": "string"
  }
}
```

## File Upload

### Upload File
```typescript
POST /api/v1/upload
Content-Type: multipart/form-data

Form Data:
file: File

Response:
{
  "data": {
    "url": string,
    "filename": string,
    "mimeType": string,
    "size": number
  }
}
```

## Testing

### Test Environment
```
Base URL: https://test-api.rocketrybox.com
```

### Test Credentials
```
Customer: customer@test.com / Test123!
Seller: seller@test.com / Test123!
Admin: admin@test.com / Test123!
``` 