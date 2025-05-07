# Rocketry Box Marketing API Documentation

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
    user: UserProfile;
}

interface RegisterRequest {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    acceptTerms: boolean;
}

// User Types
interface UserProfile {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: 'active' | 'inactive' | 'suspended';
    emailVerified: boolean;
    phoneVerified: boolean;
    createdAt: string;
    updatedAt: string;
    lastLogin?: string;
}

// Campaign Types
interface Campaign {
    id: string;
    name: string;
    description: string;
    type: CampaignType;
    status: CampaignStatus;
    startDate: string;
    endDate: string;
    budget: number;
    spent: number;
    targetAudience: TargetAudience;
    channels: MarketingChannel[];
    metrics: CampaignMetrics;
    createdAt: string;
    updatedAt: string;
}

type CampaignType = 'email' | 'sms' | 'push' | 'social' | 'display';
type CampaignStatus = 'draft' | 'scheduled' | 'active' | 'paused' | 'completed';

interface TargetAudience {
    segments: string[];
    demographics?: {
        ageRange?: [number, number];
        gender?: string[];
        location?: string[];
        interests?: string[];
    };
    customFilters?: Record<string, any>;
}

interface MarketingChannel {
    type: CampaignType;
    settings: ChannelSettings;
    status: 'active' | 'inactive';
}

interface ChannelSettings {
    template?: string;
    schedule?: ScheduleSettings;
    budget?: number;
    targeting?: Record<string, any>;
}

interface ScheduleSettings {
    startTime: string;
    endTime: string;
    timezone: string;
    frequency: 'once' | 'daily' | 'weekly' | 'monthly';
    daysOfWeek?: number[];
    daysOfMonth?: number[];
}

interface CampaignMetrics {
    impressions: number;
    clicks: number;
    conversions: number;
    spend: number;
    ctr: number;
    cpc: number;
    cpa: number;
    roi: number;
}

// Content Types
interface Content {
    id: string;
    title: string;
    type: ContentType;
    status: ContentStatus;
    content: string;
    metadata: ContentMetadata;
    seo: SEOData;
    analytics: ContentAnalytics;
    createdAt: string;
    updatedAt: string;
}

type ContentType = 'blog' | 'article' | 'landing-page' | 'email-template' | 'social-post';
type ContentStatus = 'draft' | 'review' | 'published' | 'archived';

interface ContentMetadata {
    author: string;
    category: string;
    tags: string[];
    featuredImage?: string;
    relatedContent?: string[];
    publishDate?: string;
}

interface SEOData {
    title: string;
    description: string;
    keywords: string[];
    canonicalUrl?: string;
    ogTags?: {
        title?: string;
        description?: string;
        image?: string;
    };
}

interface ContentAnalytics {
    views: number;
    uniqueViews: number;
    timeOnPage: number;
    bounceRate: number;
    conversionRate: number;
}

// Lead Types
interface Lead {
    id: string;
    source: LeadSource;
    status: LeadStatus;
    contact: ContactInfo;
    company?: CompanyInfo;
    interests: string[];
    score: number;
    lastActivity: string;
    createdAt: string;
    updatedAt: string;
}

type LeadSource = 'website' | 'social' | 'referral' | 'event' | 'manual';
type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';

interface ContactInfo {
    name: string;
    email: string;
    phone?: string;
    title?: string;
    address?: Address;
}

interface CompanyInfo {
    name: string;
    industry?: string;
    size?: string;
    website?: string;
    linkedin?: string;
}

// Event Types
interface Event {
    id: string;
    name: string;
    type: EventType;
    status: EventStatus;
    schedule: EventSchedule;
    location: EventLocation;
    capacity: number;
    registered: number;
    price?: number;
    description: string;
    agenda?: EventAgenda[];
    speakers?: EventSpeaker[];
    createdAt: string;
    updatedAt: string;
}

type EventType = 'webinar' | 'conference' | 'workshop' | 'meetup';
type EventStatus = 'draft' | 'scheduled' | 'live' | 'completed' | 'cancelled';

interface EventSchedule {
    startDate: string;
    endDate: string;
    timezone: string;
    duration: number;
    recurring?: {
        frequency: 'daily' | 'weekly' | 'monthly';
        interval: number;
        endDate?: string;
    };
}

interface EventLocation {
    type: 'online' | 'physical' | 'hybrid';
    address?: Address;
    platform?: string;
    meetingLink?: string;
}

interface EventAgenda {
    time: string;
    title: string;
    description: string;
    speaker?: string;
    duration: number;
}

interface EventSpeaker {
    name: string;
    title: string;
    company: string;
    bio: string;
    image?: string;
    social?: {
        linkedin?: string;
        twitter?: string;
        website?: string;
    };
}

// Survey Types
interface Survey {
    id: string;
    title: string;
    description: string;
    status: SurveyStatus;
    type: SurveyType;
    questions: SurveyQuestion[];
    settings: SurveySettings;
    analytics: SurveyAnalytics;
    createdAt: string;
    updatedAt: string;
}

type SurveyStatus = 'draft' | 'active' | 'closed';
type SurveyType = 'customer-feedback' | 'market-research' | 'lead-qualification';

interface SurveyQuestion {
    id: string;
    type: QuestionType;
    text: string;
    required: boolean;
    options?: string[];
    validation?: QuestionValidation;
}

type QuestionType = 'text' | 'multiple-choice' | 'rating' | 'date' | 'file';

interface QuestionValidation {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    minValue?: number;
    maxValue?: number;
}

interface SurveySettings {
    anonymous: boolean;
    allowComments: boolean;
    showProgress: boolean;
    timeLimit?: number;
    endDate?: string;
    redirectUrl?: string;
}

interface SurveyAnalytics {
    responses: number;
    completionRate: number;
    averageTime: number;
    questionStats: Record<string, QuestionStats>;
}

interface QuestionStats {
    responses: number;
    average?: number;
    distribution?: Record<string, number>;
}

// Analytics Types
interface MarketingAnalytics {
    overview: AnalyticsOverview;
    campaigns: CampaignAnalytics[];
    channels: ChannelAnalytics[];
    content: ContentAnalytics[];
    leads: LeadAnalytics;
    events: EventAnalytics;
    surveys: SurveyAnalytics;
}

interface AnalyticsOverview {
    totalLeads: number;
    conversionRate: number;
    totalRevenue: number;
    roi: number;
    topPerformingCampaigns: string[];
    topContent: string[];
}

interface CampaignAnalytics {
    campaignId: string;
    name: string;
    impressions: number;
    clicks: number;
    conversions: number;
    spend: number;
    revenue: number;
    roi: number;
}

interface ChannelAnalytics {
    channel: string;
    reach: number;
    engagement: number;
    conversions: number;
    cost: number;
    roi: number;
}

interface LeadAnalytics {
    total: number;
    bySource: Record<string, number>;
    byStatus: Record<string, number>;
    conversionRate: number;
    averageScore: number;
}

interface EventAnalytics {
    total: number;
    registered: number;
    attended: number;
    revenue: number;
    feedback: {
        average: number;
        distribution: Record<number, number>;
    };
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
    campaignId?: string;
    eventId?: string;
    surveyId?: string;
    priority: 'low' | 'medium' | 'high';
    retryCount: number;
    error?: string;
}

// Template Types
interface Template {
    id: string;
    name: string;
    type: TemplateType;
    category: string;
    content: string;
    variables: string[];
    metadata: TemplateMetadata;
    createdAt: string;
    updatedAt: string;
}

type TemplateType = 'email' | 'sms' | 'push' | 'landing-page' | 'social-post';

interface TemplateMetadata {
    description: string;
    tags: string[];
    preview?: string;
    version: number;
    status: 'draft' | 'active' | 'archived';
}

// Integration Types
interface Integration {
    id: string;
    name: string;
    type: IntegrationType;
    status: IntegrationStatus;
    config: IntegrationConfig;
    credentials: IntegrationCredentials;
    webhooks: WebhookConfig[];
    createdAt: string;
    updatedAt: string;
}

type IntegrationType = 'crm' | 'email' | 'analytics' | 'social' | 'payment';
type IntegrationStatus = 'active' | 'inactive' | 'error';

interface IntegrationConfig {
    apiVersion: string;
    endpoints: Record<string, string>;
    settings: Record<string, any>;
}

interface IntegrationCredentials {
    apiKey?: string;
    secret?: string;
    token?: string;
    expiresAt?: string;
}

interface WebhookConfig {
    url: string;
    events: string[];
    secret: string;
    status: 'active' | 'inactive';
}

### A/B Testing

#### Create A/B Test
```typescript
POST /api/v1/marketing/ab-tests
Content-Type: application/json

Request Body:
{
    name: string,
    type: ABTestType,
    variants: ABTestVariant[],
    targetAudience: TargetAudience,
    goals: ABTestGoal[],
    duration: number,
    trafficSplit: number
}

Response:
{
    success: true,
    data: {
        id: string,
        name: string,
        status: ABTestStatus,
        createdAt: string
    }
}
```

#### List A/B Tests
```typescript
GET /api/v1/marketing/ab-tests

Query Parameters:
{
    page?: number,
    limit?: number,
    status?: ABTestStatus,
    type?: ABTestType
}

Response:
{
    success: true,
    data: {
        tests: ABTest[],
        meta: PaginationMeta
    }
}
```

### Marketing Automation

#### Create Workflow
```typescript
POST /api/v1/marketing/automation/workflows
Content-Type: application/json

Request Body:
{
    name: string,
    trigger: WorkflowTrigger,
    conditions: WorkflowCondition[],
    actions: WorkflowAction[],
    schedule?: WorkflowSchedule
}

Response:
{
    success: true,
    data: {
        id: string,
        name: string,
        status: WorkflowStatus,
        createdAt: string
    }
}
```

#### List Workflows
```typescript
GET /api/v1/marketing/automation/workflows

Query Parameters:
{
    page?: number,
    limit?: number,
    status?: WorkflowStatus
}

Response:
{
    success: true,
    data: {
        workflows: Workflow[],
        meta: PaginationMeta
    }
}
```

### Social Media Integration

#### Create Social Post
```typescript
POST /api/v1/marketing/social/posts
Content-Type: application/json

Request Body:
{
    content: string,
    platforms: SocialPlatform[],
    media?: SocialMedia[],
    schedule?: PostSchedule,
    targeting?: SocialTargeting
}

Response:
{
    success: true,
    data: {
        id: string,
        status: PostStatus,
        createdAt: string
    }
}
```

#### List Social Posts
```typescript
GET /api/v1/marketing/social/posts

Query Parameters:
{
    page?: number,
    limit?: number,
    platform?: SocialPlatform,
    status?: PostStatus
}

Response:
{
    success: true,
    data: {
        posts: SocialPost[],
        meta: PaginationMeta
    }
}
```

### Email Templates

#### Create Email Template
```typescript
POST /api/v1/marketing/email/templates
Content-Type: application/json

Request Body:
{
    name: string,
    subject: string,
    content: string,
    variables: string[],
    category: string,
    metadata: TemplateMetadata
}

Response:
{
    success: true,
    data: {
        id: string,
        name: string,
        status: TemplateStatus,
        createdAt: string
    }
}
```

#### List Email Templates
```typescript
GET /api/v1/marketing/email/templates

Query Parameters:
{
    page?: number,
    limit?: number,
    category?: string,
    status?: TemplateStatus
}

Response:
{
    success: true,
    data: {
        templates: EmailTemplate[],
        meta: PaginationMeta
    }
}
```

### Marketing Calendar

#### Create Calendar Event
```typescript
POST /api/v1/marketing/calendar/events
Content-Type: application/json

Request Body:
{
    title: string,
    description: string,
    startDate: string,
    endDate: string,
    type: CalendarEventType,
    status: CalendarEventStatus,
    campaign?: string,
    content?: string,
    social?: string[]
}

Response:
{
    success: true,
    data: {
        id: string,
        title: string,
        status: CalendarEventStatus,
        createdAt: string
    }
}
```

#### List Calendar Events
```typescript
GET /api/v1/marketing/calendar/events

Query Parameters:
{
    page?: number,
    limit?: number,
    startDate?: string,
    endDate?: string,
    type?: CalendarEventType,
    status?: CalendarEventStatus
}

Response:
{
    success: true,
    data: {
        events: CalendarEvent[],
        meta: PaginationMeta
    }
}
```

// Add these types to the Data Models section
interface ABTest {
    id: string;
    name: string;
    type: ABTestType;
    variants: ABTestVariant[];
    targetAudience: TargetAudience;
    goals: ABTestGoal[];
    duration: number;
    trafficSplit: number;
    status: ABTestStatus;
    results?: ABTestResults;
    createdAt: string;
    updatedAt: string;
}

type ABTestType = 'email' | 'landing-page' | 'ad' | 'content';
type ABTestStatus = 'draft' | 'running' | 'completed' | 'paused';

interface ABTestVariant {
    name: string;
    content: string;
    weight: number;
    metrics: ABTestMetrics;
}

interface ABTestGoal {
    type: 'conversion' | 'click' | 'engagement';
    target: string;
    value: number;
}

interface ABTestResults {
    winner?: string;
    confidence: number;
    metrics: Record<string, ABTestMetrics>;
    insights: string[];
}

interface ABTestMetrics {
    impressions: number;
    clicks: number;
    conversions: number;
    revenue: number;
}

interface Workflow {
    id: string;
    name: string;
    trigger: WorkflowTrigger;
    conditions: WorkflowCondition[];
    actions: WorkflowAction[];
    schedule?: WorkflowSchedule;
    status: WorkflowStatus;
    stats: WorkflowStats;
    createdAt: string;
    updatedAt: string;
}

type WorkflowStatus = 'active' | 'paused' | 'archived';

interface WorkflowTrigger {
    type: 'event' | 'schedule' | 'condition';
    event?: string;
    schedule?: string;
    condition?: string;
}

interface WorkflowCondition {
    field: string;
    operator: 'equals' | 'contains' | 'greater' | 'less';
    value: any;
}

interface WorkflowAction {
    type: 'email' | 'sms' | 'notification' | 'webhook';
    config: Record<string, any>;
}

interface WorkflowSchedule {
    startDate?: string;
    endDate?: string;
    frequency: 'once' | 'daily' | 'weekly' | 'monthly';
    timezone: string;
}

interface WorkflowStats {
    total: number;
    active: number;
    completed: number;
    failed: number;
}

interface SocialPost {
    id: string;
    content: string;
    platforms: SocialPlatform[];
    media?: SocialMedia[];
    schedule?: PostSchedule;
    targeting?: SocialTargeting;
    status: PostStatus;
    analytics: SocialAnalytics;
    createdAt: string;
    updatedAt: string;
}

type SocialPlatform = 'facebook' | 'twitter' | 'instagram' | 'linkedin';
type PostStatus = 'draft' | 'scheduled' | 'published' | 'failed';

interface SocialMedia {
    type: 'image' | 'video' | 'link';
    url: string;
    thumbnail?: string;
}

interface PostSchedule {
    publishAt: string;
    timezone: string;
}

interface SocialTargeting {
    locations?: string[];
    interests?: string[];
    demographics?: {
        ageRange?: [number, number];
        gender?: string[];
    };
}

interface SocialAnalytics {
    reach: number;
    engagement: number;
    clicks: number;
    conversions: number;
    platformStats: Record<SocialPlatform, PlatformStats>;
}

interface PlatformStats {
    impressions: number;
    engagement: number;
    clicks: number;
}

interface EmailTemplate {
    id: string;
    name: string;
    subject: string;
    content: string;
    variables: string[];
    category: string;
    metadata: TemplateMetadata;
    status: TemplateStatus;
    analytics: TemplateAnalytics;
    createdAt: string;
    updatedAt: string;
}

type TemplateStatus = 'draft' | 'active' | 'archived';

interface TemplateAnalytics {
    sent: number;
    opened: number;
    clicked: number;
    bounced: number;
    unsubscribed: number;
}

interface CalendarEvent {
    id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    type: CalendarEventType;
    status: CalendarEventStatus;
    campaign?: string;
    content?: string;
    social?: string[];
    createdAt: string;
    updatedAt: string;
}

type CalendarEventType = 'campaign' | 'content' | 'social' | 'email';
type CalendarEventStatus = 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
```

## API Endpoints

### Authentication

#### Login
```typescript
POST /api/v1/marketing/auth/login
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
        user: UserProfile
    }
}
```

#### Register
```typescript
POST /api/v1/marketing/auth/register
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
        user: UserProfile
    }
}
```

### Campaigns

#### Create Campaign
```typescript
POST /api/v1/marketing/campaigns
Content-Type: application/json

Request Body:
{
    name: string,
    description: string,
    type: CampaignType,
    startDate: string,
    endDate: string,
    budget: number,
    targetAudience: TargetAudience,
    channels: MarketingChannel[]
}

Response:
{
    success: true,
    data: {
        id: string,
        name: string,
        status: CampaignStatus,
        createdAt: string
    }
}
```

#### List Campaigns
```typescript
GET /api/v1/marketing/campaigns

Query Parameters:
{
    page?: number,
    limit?: number,
    status?: CampaignStatus,
    type?: CampaignType,
    startDate?: string,
    endDate?: string
}

Response:
{
    success: true,
    data: {
        campaigns: Campaign[],
        meta: PaginationMeta
    }
}
```

### Content

#### Create Content
```typescript
POST /api/v1/marketing/content
Content-Type: application/json

Request Body:
{
    title: string,
    type: ContentType,
    content: string,
    metadata: ContentMetadata,
    seo: SEOData
}

Response:
{
    success: true,
    data: {
        id: string,
        title: string,
        status: ContentStatus,
        createdAt: string
    }
}
```

#### List Content
```typescript
GET /api/v1/marketing/content

Query Parameters:
{
    page?: number,
    limit?: number,
    type?: ContentType,
    status?: ContentStatus,
    category?: string,
    tag?: string
}

Response:
{
    success: true,
    data: {
        content: Content[],
        meta: PaginationMeta
    }
}
```

### Leads

#### Create Lead
```typescript
POST /api/v1/marketing/leads
Content-Type: application/json

Request Body:
{
    source: LeadSource,
    contact: ContactInfo,
    company?: CompanyInfo,
    interests: string[]
}

Response:
{
    success: true,
    data: {
        id: string,
        status: LeadStatus,
        createdAt: string
    }
}
```

#### List Leads
```typescript
GET /api/v1/marketing/leads

Query Parameters:
{
    page?: number,
    limit?: number,
    status?: LeadStatus,
    source?: LeadSource,
    score?: number
}

Response:
{
    success: true,
    data: {
        leads: Lead[],
        meta: PaginationMeta
    }
}
```

### Events

#### Create Event
```typescript
POST /api/v1/marketing/events
Content-Type: application/json

Request Body:
{
    name: string,
    type: EventType,
    schedule: EventSchedule,
    location: EventLocation,
    capacity: number,
    price?: number,
    description: string,
    agenda?: EventAgenda[],
    speakers?: EventSpeaker[]
}

Response:
{
    success: true,
    data: {
        id: string,
        name: string,
        status: EventStatus,
        createdAt: string
    }
}
```

#### List Events
```typescript
GET /api/v1/marketing/events

Query Parameters:
{
    page?: number,
    limit?: number,
    type?: EventType,
    status?: EventStatus,
    startDate?: string,
    endDate?: string
}

Response:
{
    success: true,
    data: {
        events: Event[],
        meta: PaginationMeta
    }
}
```

### Surveys

#### Create Survey
```typescript
POST /api/v1/marketing/surveys
Content-Type: application/json

Request Body:
{
    title: string,
    description: string,
    type: SurveyType,
    questions: SurveyQuestion[],
    settings: SurveySettings
}

Response:
{
    success: true,
    data: {
        id: string,
        title: string,
        status: SurveyStatus,
        createdAt: string
    }
}
```

#### List Surveys
```typescript
GET /api/v1/marketing/surveys

Query Parameters:
{
    page?: number,
    limit?: number,
    type?: SurveyType,
    status?: SurveyStatus
}

Response:
{
    success: true,
    data: {
        surveys: Survey[],
        meta: PaginationMeta
    }
}
```

### Analytics

#### Get Marketing Analytics
```typescript
GET /api/v1/marketing/analytics

Query Parameters:
{
    startDate: string,
    endDate: string,
    groupBy?: 'daily' | 'weekly' | 'monthly'
}

Response:
{
    success: true,
    data: MarketingAnalytics
}
```

### Templates

#### Create Template
```typescript
POST /api/v1/marketing/templates
Content-Type: application/json

Request Body:
{
    name: string,
    type: TemplateType,
    category: string,
    content: string,
    variables: string[],
    metadata: TemplateMetadata
}

Response:
{
    success: true,
    data: {
        id: string,
        name: string,
        status: string,
        createdAt: string
    }
}
```

#### List Templates
```typescript
GET /api/v1/marketing/templates

Query Parameters:
{
    page?: number,
    limit?: number,
    type?: TemplateType,
    category?: string,
    status?: string
}

Response:
{
    success: true,
    data: {
        templates: Template[],
        meta: PaginationMeta
    }
}
```

### Integrations

#### Create Integration
```typescript
POST /api/v1/marketing/integrations
Content-Type: application/json

Request Body:
{
    name: string,
    type: IntegrationType,
    config: IntegrationConfig,
    credentials: IntegrationCredentials,
    webhooks: WebhookConfig[]
}

Response:
{
    success: true,
    data: {
        id: string,
        name: string,
        status: IntegrationStatus,
        createdAt: string
    }
}
```

#### List Integrations
```typescript
GET /api/v1/marketing/integrations

Query Parameters:
{
    page?: number,
    limit?: number,
    type?: IntegrationType,
    status?: IntegrationStatus
}

Response:
{
    success: true,
    data: {
        integrations: Integration[],
        meta: PaginationMeta
    }
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
    url: /^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/
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
1. Set up MongoDB database
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