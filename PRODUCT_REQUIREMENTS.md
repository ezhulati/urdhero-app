# URDHËRO - PRODUCT REQUIREMENTS DOCUMENT

---

## OFFICIAL PROJECT DOCUMENTATION

**Document Type:** Product Requirements Document (PRD)  
**Project Name:** Urdhëro - Albanian Restaurant Ordering Platform  
**Version:** 1.0  
**Date:** January 2025  
**Classification:** Internal Use Only  

---

## DOCUMENT CONTROL

| Version | Date | Author | Description |
|---------|------|--------|-------------|
| 1.0 | January 2025 | Urdhëro Product Team | Initial Release |

**Document Owner:** Product Management Team  
**Engineering Lead:** Ardit Xhanaj  
**Product Lead:** Enri  
**Next Review Date:** March 2025  

---

## EXECUTIVE APPROVAL

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Chief Technology Officer | _____________ | _____________ | _____ |
| Product Manager | _____________ | _____________ | _____ |
| Engineering Lead | _____________ | _____________ | _____ |
| Quality Assurance Lead | _____________ | _____________ | _____ |

---

## TABLE OF CONTENTS

1. **PRODUCT OVERVIEW** ........................................................ 4
2. **PRODUCT ARCHITECTURE** .................................................... 6
3. **FEATURE SPECIFICATIONS** .................................................. 9
   - 3.1 Customer Experience Features ........................................... 9
   - 3.2 Restaurant Management Features ........................................ 18
   - 3.3 Advanced Features .................................................... 26
   - 3.4 Platform Features .................................................... 30
4. **TECHNICAL SPECIFICATIONS** ................................................ 35
   - 4.1 Frontend Architecture ................................................ 35
   - 4.2 Backend Architecture ................................................. 37
5. **USER INTERFACE SPECIFICATIONS** ........................................... 39
   - 5.1 Design System ....................................................... 39
   - 5.2 Responsive Design ................................................... 42
   - 5.3 Accessibility Specifications ........................................ 43
6. **API SPECIFICATIONS** ..................................................... 45
   - 6.1 REST API Endpoints .................................................. 45
   - 6.2 Real-Time Events .................................................... 47
   - 6.3 API Response Formats ................................................ 48
7. **DATABASE SCHEMA** ........................................................ 50
   - 7.1 Core Collections .................................................... 50
   - 7.2 Data Relationships .................................................. 53
   - 7.3 Indexing Strategy ................................................... 54
8. **SECURITY SPECIFICATIONS** ................................................ 56
   - 8.1 Authentication Security ............................................. 56
   - 8.2 Data Protection .................................................... 57
   - 8.3 Input Validation ................................................... 58
9. **PERFORMANCE SPECIFICATIONS** ............................................. 59
   - 9.1 Response Time Requirements .......................................... 59
   - 9.2 Scalability Targets ................................................ 60
   - 9.3 Performance Monitoring ............................................. 61
10. **INTEGRATION SPECIFICATIONS** ............................................ 62
    - 10.1 Payment Gateway Integration ....................................... 62
    - 10.2 Third-Party Service Integration .................................. 63
    - 10.3 Analytics Integration ............................................ 64
11. **QUALITY ASSURANCE REQUIREMENTS** ........................................ 65
    - 11.1 Testing Strategy ................................................. 65
    - 11.2 Quality Gates ................................................... 66
    - 11.3 Performance Testing ............................................. 67
12. **DEPLOYMENT AND DEVOPS** ................................................ 68
    - 12.1 CI/CD Pipeline .................................................. 68
    - 12.2 Infrastructure Requirements ..................................... 70
13. **ANALYTICS AND MONITORING** ............................................. 71
    - 13.1 Business Metrics ................................................ 71
    - 13.2 Technical Monitoring ............................................ 73
14. **MAINTENANCE AND SUPPORT** .............................................. 74
    - 14.1 Support Channels ................................................ 74
    - 14.2 Maintenance Procedures .......................................... 75
15. **RISK MANAGEMENT** ..................................................... 76
16. **SUCCESS CRITERIA** .................................................... 77
17. **IMPLEMENTATION ROADMAP** ............................................... 79
18. **APPENDICES** .......................................................... 82

---

# 1. PRODUCT OVERVIEW

## 1.1 Product Vision

Urdhëro is a comprehensive restaurant ordering platform that transforms the dining experience in Albania through innovative QR code technology, real-time order management, and data-driven business intelligence.

## 1.2 Product Mission

To empower restaurants with cutting-edge technology while providing customers with the fastest, most intuitive ordering experience in the Albanian hospitality market.

## 1.3 Product Positioning

### Market Position
- **Primary Market**: Albanian restaurants, bars, cafes, and hospitality venues
- **Competitive Advantage**: Mobile-first design, Albanian language support, offline capability  
- **Value Proposition**: Instant ordering, zero wait times, comprehensive analytics

### Target Segments

| Segment | Description | Key Value |
|---------|-------------|-----------|
| **Beach Restaurants** | High-volume seasonal venues | Handle peak capacity efficiently |
| **Urban Cafes** | Fast-paced city locations | Quick turnover optimization |
| **Traditional Restaurants** | Family-owned establishments | Easy-to-use technology |
| **Hotel Restaurants** | Tourist-focused venues | Multi-language support |
| **Bars & Nightclubs** | Late-night venues | Real-time order tracking |

## 1.4 Product Goals

### Year 1 Goals
1. **Customer Acquisition**: 50,000+ monthly active users
2. **Restaurant Adoption**: 150+ partner restaurants in Albania  
3. **Order Volume**: 1 million+ orders processed
4. **Platform Stability**: 99.9% uptime achieved

### Year 2 Goals
1. **Revenue Growth**: €500K ARR achieved
2. **Market Leadership**: 30% market share captured
3. **Feature Expansion**: AI and loyalty features launched
4. **Team Growth**: 20+ person team established

### Year 3 Goals
1. **International Expansion**: Regional market entry
2. **Enterprise Solutions**: White-label offerings
3. **Platform Evolution**: Become hospitality OS
4. **Exit Readiness**: Acquisition or Series A ready

---

# 2. PRODUCT ARCHITECTURE

## 2.1 High-Level System Architecture

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER INTERFACES                              │
├─────────────────┬──────────────────┬────────────────────────────────┤
│  Customer PWA   │ Restaurant Web   │    Admin Panel                 │
│  (React)        │ Dashboard        │    (React)                     │
│  - QR Scanning  │ - Order Mgmt     │ - System Config                │
│  - Menu Browse  │ - Menu Editor    │ - User Management              │
│  - Ordering     │ - Analytics      │ - Platform Analytics           │
│  - Tracking     │ - Staff Mgmt     │ - Support Tools                │
└─────────────────┴──────────────────┴────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      FIREBASE PLATFORM                               │
├─────────────────┬──────────────────┬────────────────────────────────┤
│ Authentication  │ Cloud Firestore  │ Cloud Functions                │
│ - Email/Pass    │ - NoSQL DB       │ - Business Logic               │
│ - Social Login  │ - Real-time Sync │ - API Endpoints                │
│ - MFA           │ - Offline Cache  │ - Webhooks                     │
├─────────────────┼──────────────────┼────────────────────────────────┤
│ Cloud Storage   │ Firebase Hosting │ Analytics & Monitoring         │
│ - Images        │ - PWA Hosting    │ - Google Analytics             │
│ - QR Codes      │ - CDN            │ - Performance Mon              │
│ - Documents     │ - SSL            │ - Error Tracking               │
└─────────────────┴──────────────────┴────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                                 │
├─────────────────┬──────────────────┬────────────────────────────────┤
│ Stripe          │ SMS Service      │ Email Service                  │
│ - Payments      │ - Twilio         │ - SendGrid                     │
│ - Invoicing     │ - Local Provider │ - Transactional                │
│ - Webhooks      │ - Notifications  │ - Marketing                    │
└─────────────────┴──────────────────┴────────────────────────────────┘
```

## 2.2 Technology Stack

### Frontend Technologies

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| **Framework** | React | 18.3+ | UI components and state |
| **Language** | TypeScript | 5.5+ | Type safety |
| **Styling** | Tailwind CSS | 3.4+ | Utility-first CSS |
| **Animation** | Framer Motion | 10+ | Smooth animations |
| **State** | React Context | - | Global state management |
| **Routing** | React Router | 6.20+ | Navigation |
| **Forms** | React Hook Form | 7.48+ | Form handling |
| **Validation** | Zod | 3.22+ | Schema validation |
| **Build** | Vite | 5+ | Fast development |
| **PWA** | Workbox | 7+ | Offline support |

### Backend Technologies

| Service | Technology | Purpose |
|---------|------------|---------|
| **Platform** | Firebase | Complete backend solution |
| **Database** | Cloud Firestore | NoSQL document database |
| **Auth** | Firebase Auth | User authentication |
| **Functions** | Cloud Functions | Serverless computing |
| **Storage** | Cloud Storage | File storage |
| **Hosting** | Firebase Hosting | Static hosting with CDN |
| **Runtime** | Node.js 18 | JavaScript runtime |
| **Language** | TypeScript | Type-safe backend code |

### Third-Party Services

| Service | Provider | Purpose |
|---------|----------|---------|
| **Payments** | Stripe | Payment processing |
| **SMS** | Twilio | SMS notifications |
| **Email** | SendGrid | Email delivery |
| **Analytics** | Google Analytics 4 | User analytics |
| **Monitoring** | Sentry | Error tracking |
| **Maps** | Google Maps | Location services |

## 2.3 System Components

### Customer Application (PWA)
- **Technology**: React PWA with TypeScript
- **Features**: QR scanning, menu browsing, ordering, tracking
- **Offline**: Service worker for offline functionality
- **Performance**: <2s load time on 3G

### Restaurant Dashboard
- **Technology**: React SPA with real-time updates
- **Features**: Order management, menu editing, analytics
- **Real-time**: WebSocket for live updates
- **Responsive**: Works on tablets and desktops

### Admin Panel
- **Technology**: React with advanced permissions
- **Features**: System monitoring, user management, support tools
- **Security**: Role-based access control
- **Analytics**: Platform-wide metrics

### API Layer
- **Technology**: Firebase Cloud Functions
- **Architecture**: RESTful APIs with consistent patterns
- **Security**: JWT authentication, input validation
- **Performance**: <500ms response time target

### Database Layer
- **Technology**: Cloud Firestore
- **Structure**: Document-based NoSQL
- **Features**: Real-time sync, offline support
- **Security**: Row-level security rules

---

# 3. FEATURE SPECIFICATIONS

## 3.1 Customer Experience Features

### 3.1.1 QR Code Scanning System

**Feature ID**: CX-001  
**Priority**: P0 (Critical)  
**Effort**: 8 story points  
**Dependencies**: Camera permissions, QR library

#### Product Specification

The QR code scanning system is the primary entry point for customers. It must provide a seamless, fast, and reliable scanning experience across all devices and lighting conditions.

**Core Functionality:**
- Native browser camera integration
- Multiple QR format support (URL, JSON, custom)
- Intelligent error handling and recovery
- Offline validation capability

**Technical Requirements:**

```typescript
interface QRScannerConfig {
  preferredCamera: 'environment' | 'user';
  scanFrequency: number; // scans per second
  highlightTarget: boolean;
  hapticFeedback: boolean;
  offlineMode: boolean;
}

interface QRScanResult {
  format: 'url' | 'json' | 'custom';
  restaurantSlug: string;
  tableCode: string;
  timestamp: Date;
  confidence: number;
}

class QRScanner {
  async startScanning(config: QRScannerConfig): Promise<void>;
  async stopScanning(): Promise<void>;
  onScanSuccess(callback: (result: QRScanResult) => void): void;
  onScanError(callback: (error: QRScanError) => void): void;
}
```

**User Experience Flow:**

```
1. Customer sits at table
   ↓
2. Opens phone camera or Urdhëro app
   ↓
3. Points at QR code on table
   ↓
4. Automatic detection (no button press)
   ↓
5. Haptic feedback on successful scan
   ↓
6. Redirect to restaurant menu
   ↓
7. Table automatically selected
```

**Acceptance Criteria:**
- [ ] Scanner initializes in <2 seconds
- [ ] QR detection works from 10cm to 1m distance
- [ ] Supports damaged QR codes (up to 30% damage)
- [ ] Works in low light with phone flash
- [ ] Provides clear error messages
- [ ] Fallback to manual code entry
- [ ] Works without app installation
- [ ] Remembers camera permissions

**Error Handling:**

| Error Type | User Message | Recovery Action |
|------------|--------------|-----------------|
| Camera Permission Denied | "Please allow camera access to scan QR codes" | Show manual entry |
| Invalid QR Format | "This QR code is not valid for Urdhëro" | Retry scanning |
| Network Error | "Connection issue. Menu will load when online" | Use cached data |
| Restaurant Not Found | "Restaurant not found. Please check with staff" | Contact support |

**Performance Metrics:**
- Scanner ready time: <2 seconds
- Detection time: <1 second
- Success rate: >95% in normal conditions
- Offline capability: 100% for validation

---

### 3.1.2 Progressive Web App (PWA)

**Feature ID**: CX-002  
**Priority**: P0 (Critical)  
**Effort**: 13 story points  
**Dependencies**: Service Worker API, Web App Manifest

#### Product Specification

The PWA implementation ensures Urdhëro works like a native app while being accessible through web browsers, providing offline functionality and engagement features.

**Core Features:**
- **Install Prompts**: Smart prompting after user engagement
- **Offline Mode**: Critical features work without internet
- **Push Notifications**: Real-time order updates
- **Background Sync**: Queue actions when offline
- **App-like Experience**: Fullscreen, no browser UI

**Service Worker Strategy:**

```typescript
interface CacheStrategy {
  // Static assets - Cache First
  static: {
    patterns: string[];
    maxAge: number;
    maxEntries: number;
  };
  
  // API calls - Network First with Cache Fallback
  api: {
    patterns: string[];
    timeout: number;
    maxAge: number;
  };
  
  // Images - Stale While Revalidate
  images: {
    patterns: string[];
    maxEntries: number;
    maxSize: number;
  };
}

const cacheConfig: CacheStrategy = {
  static: {
    patterns: ['/js/*.js', '/css/*.css'],
    maxAge: 31536000, // 1 year
    maxEntries: 50
  },
  api: {
    patterns: ['/api/menu/*', '/api/restaurant/*'],
    timeout: 5000,
    maxAge: 300 // 5 minutes
  },
  images: {
    patterns: ['/images/*', '*.jpg', '*.png'],
    maxEntries: 100,
    maxSize: 5 * 1024 * 1024 // 5MB per image
  }
};
```

**Offline Functionality Matrix:**

| Feature | Offline Support | Data Source | Sync Strategy |
|---------|----------------|-------------|---------------|
| Menu Browsing | ✅ Full | Cached data | Background sync |
| Add to Cart | ✅ Full | Local storage | Immediate |
| Place Order | ⚠️ Queued | Queue + sync | When online |
| Order Tracking | ⚠️ Limited | Last known state | Poll when online |
| Payment | ❌ None | Requires network | Not supported |

**Web App Manifest:**

```json
{
  "name": "Urdhëro - Restaurant Ordering",
  "short_name": "Urdhëro",
  "description": "Order food instantly at Albanian restaurants",
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait",
  "theme_color": "#ea580c",
  "background_color": "#ffffff",
  "categories": ["food", "restaurant", "ordering"],
  "lang": "sq-AL",
  "dir": "ltr",
  "prefer_related_applications": false,
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "screenshots": [
    {
      "src": "/screenshots/menu.png",
      "sizes": "1080x1920",
      "type": "image/png",
      "label": "Browse restaurant menus"
    },
    {
      "src": "/screenshots/order.png",
      "sizes": "1080x1920",
      "type": "image/png",
      "label": "Track your orders"
    }
  ],
  "shortcuts": [
    {
      "name": "Scan QR Code",
      "url": "/scan",
      "icons": [{"src": "/icons/scan.png", "sizes": "96x96"}]
    },
    {
      "name": "Order History",
      "url": "/orders",
      "icons": [{"src": "/icons/history.png", "sizes": "96x96"}]
    }
  ]
}
```

**Push Notification Events:**

```typescript
enum NotificationType {
  ORDER_ACCEPTED = 'order.accepted',
  ORDER_READY = 'order.ready',
  ORDER_COMPLETE = 'order.complete',
  PROMOTION = 'promotion.new',
  LOYALTY_REWARD = 'loyalty.reward'
}

interface PushNotification {
  type: NotificationType;
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: {
    orderId?: string;
    promotionId?: string;
    deepLink?: string;
  };
  actions?: NotificationAction[];
}
```

**Installation Metrics:**
- Install prompt acceptance rate: >30%
- PWA usage vs web: Track engagement difference
- Push notification opt-in: >60% target
- Offline usage: Monitor feature usage offline

---

### 3.1.3 Multi-Language Support

**Feature ID**: CX-003  
**Priority**: P1 (High)  
**Effort**: 21 story points  
**Dependencies**: Translation service, Language detection

#### Product Specification

Multi-language support ensures Urdhëro serves Albania's diverse population and tourist market with native language experiences.

**Supported Languages:**

| Language | Code | Status | Completion | RTL |
|----------|------|--------|------------|-----|
| Albanian | sq | Primary | 100% | No |
| English | en | Complete | 100% | No |
| Italian | it | Complete | 100% | No |
| German | de | Phase 2 | 0% | No |
| French | fr | Phase 2 | 0% | No |
| Spanish | es | Phase 2 | 0% | No |

**Translation Architecture:**

```typescript
type TranslationKey = string; // e.g., 'menu.addToCart'
type LanguageCode = 'sq' | 'en' | 'it' | 'de' | 'fr' | 'es';

interface TranslationSystem {
  // Core translation function
  t: (key: TranslationKey, params?: Record<string, any>) => string;
  
  // Change language
  setLanguage: (lang: LanguageCode) => Promise<void>;
  
  // Get current language
  getCurrentLanguage: () => LanguageCode;
  
  // Detect user language
  detectLanguage: () => LanguageCode;
  
  // Preload language pack
  preloadLanguage: (lang: LanguageCode) => Promise<void>;
}

// Translation file structure
interface TranslationFile {
  [key: string]: string | TranslationFile;
}

// Example translation file (Albanian)
const sq: TranslationFile = {
  common: {
    welcome: "Mirëserdhe",
    menu: "Menu",
    cart: "Shporta",
    order: "Porosit"
  },
  menu: {
    addToCart: "Shto në shportë",
    price: "Çmimi: {{amount}} {{currency}}",
    unavailable: "Jo në dispozicion",
    special: "Ofertë speciale"
  },
  order: {
    confirm: "Konfirmo porosinë",
    total: "Totali: {{amount}} {{currency}}",
    status: {
      new: "E re",
      preparing: "Duke u përgatitur",
      ready: "Gati",
      served: "Shërbyer"
    }
  }
};
```

**Language Switching UX:**

```
┌─────────────────────────────────┐
│  Select Language / Zgjidh Gjuhën │
├─────────────────────────────────┤
│  🇦🇱 Shqip (Albanian)          │
│  🇬🇧 English                   │
│  🇮🇹 Italiano                  │
│  🇩🇪 Deutsch (Coming Soon)     │
│  🇫🇷 Français (Coming Soon)    │
│  🇪🇸 Español (Coming Soon)     │
└─────────────────────────────────┘
```

**Dynamic Content Translation:**

```typescript
interface MenuItemTranslation {
  itemId: string;
  translations: {
    [lang: LanguageCode]: {
      name: string;
      description: string;
      allergenInfo?: string;
    };
  };
}

// Restaurant-provided translations
interface RestaurantContent {
  autoTranslate: boolean; // Use AI translation
  manualTranslations: MenuItemTranslation[];
  defaultLanguage: LanguageCode;
  supportedLanguages: LanguageCode[];
}
```

**Implementation Requirements:**
- [ ] Language detection from browser/device
- [ ] Persistent language preference
- [ ] Lazy load language packs
- [ ] Fallback to English if translation missing
- [ ] Restaurant content in multiple languages
- [ ] Currency formatting per locale
- [ ] Date/time formatting per locale
- [ ] Pluralization rules per language
- [ ] Text direction support (future RTL)

---

### 3.1.4 Real-Time Order Tracking

**Feature ID**: CX-004  
**Priority**: P0 (Critical)  
**Effort**: 13 story points  
**Dependencies**: WebSocket, Push Notifications

#### Product Specification

Real-time order tracking provides customers with live updates on their order status, reducing anxiety and improving satisfaction.

**Order Status Flow:**

```
NEW → ACCEPTED → PREPARING → READY → SERVED → COMPLETED
 ↓        ↓          ↓         ↓        ↓
 └────────────── CANCELLED ──────────────┘
```

**Real-Time Architecture:**

```typescript
interface OrderTracking {
  orderId: string;
  orderNumber: string;
  status: OrderStatus;
  progress: number; // 0-100
  timestamps: {
    placed: Date;
    accepted?: Date;
    preparingStarted?: Date;
    ready?: Date;
    served?: Date;
    completed?: Date;
  };
  estimatedTime: {
    total: number; // minutes
    remaining: number; // minutes
  };
  items: TrackedItem[];
}

interface TrackedItem {
  name: string;
  quantity: number;
  status: 'waiting' | 'preparing' | 'ready';
  specialInstructions?: string;
}

class OrderTracker {
  // Subscribe to order updates
  subscribe(orderId: string, callback: (update: OrderTracking) => void): () => void;
  
  // Get current order status
  getStatus(orderId: string): Promise<OrderTracking>;
  
  // Enable push notifications
  enableNotifications(orderId: string): Promise<void>;
}
```

**Tracking UI Components:**

```
┌─────────────────────────────────────┐
│  ORDER #TN-042                      │
│  Beach Bar Durrës - Table A15       │
├─────────────────────────────────────┤
│  Status: PREPARING                   │
│  ████████████░░░░░░ 60%            │
│                                     │
│  ⏱️ Estimated time: 12 minutes      │
├─────────────────────────────────────┤
│  Timeline:                          │
│  ✅ Order Placed        14:32      │
│  ✅ Order Accepted      14:33      │
│  ⏳ Preparing           14:35      │
│  ⏸️ Ready              --:--      │
│  ⏸️ Served             --:--      │
├─────────────────────────────────────┤
│  Your Items:                        │
│  • Aperol Spritz (2)    Preparing   │
│  • Greek Salad (1)      Ready       │
│  • Pizza Margherita     Waiting     │
├─────────────────────────────────────┤
│  [📞 Call Waiter]  [❌ Cancel Order]│
└─────────────────────────────────────┘
```

**Push Notification Strategy:**

| Event | Notification Text | Action |
|-------|------------------|--------|
| Order Accepted | "Your order has been accepted! Preparation starting soon." | View Order |
| Preparing Started | "Your order is now being prepared 👨‍🍳" | Track Progress |
| Order Ready | "Your order is ready! 🎉" | View Details |
| Partial Ready | "Some items are ready. Others coming soon." | View Items |
| Delay Alert | "Your order is taking longer than expected. New estimate: X min" | Contact Restaurant |

**Performance Requirements:**
- Status updates: <1 second propagation
- Progress calculation: Real-time based on historical data
- Notification delivery: <5 seconds
- Offline tracking: Show last known status

---

### 3.1.5 Customer Loyalty Program

**Feature ID**: CX-005  
**Priority**: P2 (Medium)  
**Effort**: 34 story points  
**Dependencies**: User accounts, Analytics

#### Product Specification

The loyalty program incentivizes repeat visits and increases customer lifetime value through points, rewards, and gamification.

**Loyalty Tiers:**

| Tier | Points Required | Benefits | Multiplier |
|------|----------------|----------|------------|
| 🥉 Bronze | 0 | Basic rewards | 1.0x |
| 🥈 Silver | 500 | 10% more points, exclusive offers | 1.1x |
| 🥇 Gold | 2,000 | 20% more points, priority service | 1.2x |
| 💎 Platinum | 5,000 | 50% more points, VIP perks | 1.5x |
| ⭐ VIP | 10,000 | Double points, exclusive events | 2.0x |

**Points System:**

```typescript
interface LoyaltyPoints {
  // Earning Rules
  earning: {
    baseRate: 1; // 1 point per €1 spent
    categoryMultipliers: {
      drinks: 1.5;
      desserts: 2.0;
      specialItems: 3.0;
    };
    bonusEvents: {
      firstOrder: 100;
      birthday: 500;
      referral: 250;
      review: 50;
    };
  };
  
  // Redemption Options
  redemption: {
    discounts: [
      { points: 100, value: '10% off' },
      { points: 250, value: '€5 off' },
      { points: 500, value: '20% off' },
      { points: 1000, value: '€20 off' }
    ];
    freeItems: [
      { points: 150, item: 'Free Dessert' },
      { points: 300, item: 'Free Appetizer' },
      { points: 750, item: 'Free Main Course' }
    ];
    experiences: [
      { points: 2000, item: 'Chef Table Experience' },
      { points: 5000, item: 'Private Event' }
    ];
  };
}
```

**Gamification Elements:**

```typescript
interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  criteria: AchievementCriteria;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const achievements: Achievement[] = [
  {
    id: 'first_order',
    name: 'Welcome to Urdhëro!',
    description: 'Place your first order',
    icon: '🎉',
    points: 100,
    criteria: { orders: 1 },
    rarity: 'common'
  },
  {
    id: 'early_bird',
    name: 'Early Bird',
    description: 'Order breakfast before 9 AM',
    icon: '🌅',
    points: 200,
    criteria: { orderTime: { before: '09:00' } },
    rarity: 'rare'
  },
  {
    id: 'loyal_customer',
    name: 'Regular',
    description: 'Order 10 times from same restaurant',
    icon: '❤️',
    points: 500,
    criteria: { ordersPerRestaurant: 10 },
    rarity: 'epic'
  }
];
```

**Loyalty Dashboard UI:**

```
┌─────────────────────────────────────┐
│  🥇 GOLD MEMBER                     │
│  2,847 points                       │
│  ████████████████░░ 85% to Platinum│
├─────────────────────────────────────┤
│  Your Rewards:                      │
│  • 10% off next order (100 pts)    │
│  • Free Dessert (150 pts)          │
│  • €20 voucher (1000 pts)          │
├─────────────────────────────────────┤
│  Recent Achievements:               │
│  🍕 Pizza Lover - 200 pts           │
│  🌅 Early Bird - 200 pts            │
│  📍 Explorer - 300 pts              │
├─────────────────────────────────────┤
│  Streak: 🔥 7 days                  │
│  Next reward in 3 more days!        │
└─────────────────────────────────────┘
```

**Implementation Requirements:**
- [ ] Points calculation engine
- [ ] Tier progression system
- [ ] Achievement tracking
- [ ] Reward redemption flow
- [ ] Points expiration (12 months)
- [ ] Transfer points between accounts
- [ ] Referral tracking system
- [ ] Birthday bonus automation
- [ ] Streak tracking
- [ ] Leaderboards (optional)

---

## 3.2 Restaurant Management Features

### 3.2.1 Order Management Dashboard

**Feature ID**: RM-001  
**Priority**: P0 (Critical)  
**Effort**: 21 story points  
**Dependencies**: Real-time updates, Authentication

#### Product Specification

The order management dashboard is the command center for restaurant operations, providing real-time visibility and control over all orders.

**Dashboard Layout:**

```
┌─────────────────────────────────────────────────────────────┐
│  📊 ORDER DASHBOARD          Beach Bar Durrës    🔄 Live    │
├─────────────────────────────────────────────────────────────┤
│  Summary: 45 orders today | €1,847 revenue | 18 min avg    │
├─────────────────────────────────────────────────────────────┤
│  🔴 NEW ORDERS (3)                                          │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ #TN-042 | Table A15 | 2 min ago              €25.50  │ │
│  │ 2x Aperol Spritz, 1x Greek Salad                     │ │
│  │ 📝 "Extra ice, no onions"                            │ │
│  │ [✅ ACCEPT] [❌ REJECT] [👁️ DETAILS]                │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  🟡 PREPARING (5)                                           │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ #TN-041 | Table B8 | ⏱️ 8 min               €18.00   │ │
│  │ 1x Pizza Margherita, 1x Caesar Salad                 │ │
│  │ [✅ READY] [⏸️ PAUSE] [❌ CANCEL]                   │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  🟢 READY FOR PICKUP (2)                                    │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ #TN-040 | Table C3 | ⏱️ Ready!              €32.00   │ │
│  │ 4x Beer, 2x French Fries                             │ │
│  │ [✅ SERVED] [📞 NOTIFY]                              │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**Order Management Features:**

```typescript
interface OrderDashboard {
  // Real-time order stream
  orders: LiveOrderFeed;
  
  // Filtering and sorting
  filters: {
    status: OrderStatus[];
    timeRange: 'today' | 'last_hour' | 'custom';
    tables: string[];
    paymentMethod: PaymentMethod[];
  };
  
  // Quick actions
  actions: {
    acceptOrder: (orderId: string) => Promise<void>;
    rejectOrder: (orderId: string, reason: string) => Promise<void>;
    updateStatus: (orderId: string, status: OrderStatus) => Promise<void>;
    printOrder: (orderId: string) => Promise<void>;
    notifyCustomer: (orderId: string, message: string) => Promise<void>;
  };
  
  // Statistics
  stats: {
    ordersToday: number;
    revenueToday: number;
    averagePreparationTime: number;
    pendingOrders: number;
    tableOccupancy: number;
  };
}
```

**Real-Time Updates:**

```typescript
class OrderStream {
  // Subscribe to order updates
  subscribe(callback: (event: OrderEvent) => void): () => void;
  
  // Order events
  events: {
    ORDER_CREATED: 'order.created';
    ORDER_UPDATED: 'order.updated';
    ORDER_CANCELLED: 'order.cancelled';
    PAYMENT_RECEIVED: 'payment.received';
  };
  
  // Sound alerts
  alerts: {
    newOrder: AudioAlert;
    urgentOrder: AudioAlert;
    orderReady: AudioAlert;
  };
}
```

**Order Card States:**

| Status | Color | Actions | Timer |
|--------|-------|---------|-------|
| New | Red | Accept, Reject, Details | Time since order |
| Accepted | Orange | Start Preparing, Cancel | Countdown to SLA |
| Preparing | Yellow | Mark Ready, Pause, Cancel | Preparation timer |
| Ready | Green | Mark Served, Notify | Time waiting |
| Served | Gray | Complete, Issue Refund | - |

**Performance Requirements:**
- Order appears in <2 seconds of placement
- Status updates propagate in <1 second
- Dashboard handles 100+ concurrent orders
- Auto-refresh every 10 seconds minimum
- Offline queue for status updates

---

### 3.2.2 Menu Management System

**Feature ID**: RM-002  
**Priority**: P0 (Critical)  
**Effort**: 34 story points  
**Dependencies**: Image upload, Rich text editor

#### Product Specification

The menu management system allows restaurants to create, organize, and maintain their digital menu with rich media and real-time availability updates.

**Menu Editor Interface:**

```
┌─────────────────────────────────────────────────────────────┐
│  📋 MENU MANAGEMENT                          [SAVE] [PREVIEW]│
├─────────────────────────────────────────────────────────────┤
│  Categories: [+]                                            │
│  ┌─────────┬──────────┬───────────┬────────────┬─────────┐│
│  │Starters │Main Dishes│  Pizza   │ Beverages  │ Desserts││
│  └─────────┴──────────┴───────────┴────────────┴─────────┘│
├─────────────────────────────────────────────────────────────┤
│  🍕 Pizza (12 items)                    [+ Add Item]       │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ [📷]  Margherita                              €8.50   │ │
│  │       Classic pizza with tomato and mozzarella        │ │
│  │       🕒 15 min | 🌱 Vegetarian | ✅ Available      │ │
│  │       [Edit] [Duplicate] [Delete] [↑] [↓]            │ │
│  ├───────────────────────────────────────────────────────┤ │
│  │ [📷]  Quattro Stagioni                        €11.00  │ │
│  │       Four seasons pizza with artichokes & mushrooms  │ │
│  │       🕒 18 min | 🍖 Contains meat | ❌ Unavailable │ │
│  │       [Edit] [Duplicate] [Delete] [↑] [↓]            │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**Menu Item Editor:**

```typescript
interface MenuItemEditor {
  // Basic Information
  basic: {
    name: string;
    description: string;
    category: string;
    subcategory?: string;
    price: number;
    currency: 'ALL' | 'EUR';
  };
  
  // Rich Media
  media: {
    images: MenuImage[];
    primaryImage: string;
    thumbnailGeneration: boolean;
  };
  
  // Dietary Information
  dietary: {
    vegetarian: boolean;
    vegan: boolean;
    glutenFree: boolean;
    lactoseFree: boolean;
    allergens: Allergen[];
    calories?: number;
  };
  
  // Availability
  availability: {
    isAvailable: boolean;
    schedules?: AvailabilitySchedule[];
    stockTracking?: boolean;
    maxOrdersPerDay?: number;
  };
  
  // Preparation
  preparation: {
    estimatedTime: number; // minutes
    kitchenStation: string;
    specialInstructions?: string;
  };
  
  // Modifiers
  modifiers: {
    sizes?: SizeOption[];
    addons?: AddonOption[];
    removableIngredients?: string[];
  };
}
```

**Bulk Operations:**

```typescript
interface BulkOperations {
  // Select multiple items
  selection: Set<string>;
  
  // Bulk actions
  actions: {
    updateAvailability: (itemIds: string[], available: boolean) => Promise<void>;
    updateCategory: (itemIds: string[], category: string) => Promise<void>;
    updatePrice: (itemIds: string[], adjustment: PriceAdjustment) => Promise<void>;
    delete: (itemIds: string[]) => Promise<void>;
    duplicate: (itemIds: string[]) => Promise<void>;
    export: (itemIds: string[], format: 'csv' | 'pdf') => Promise<Blob>;
  };
}

interface PriceAdjustment {
  type: 'fixed' | 'percentage';
  value: number;
  round: 'up' | 'down' | 'nearest';
}
```

**Category Management:**

```
┌─────────────────────────────────────┐
│  MANAGE CATEGORIES                  │
├─────────────────────────────────────┤
│  [≡] Starters         (12 items)   │
│  [≡] Main Dishes      (24 items)   │
│  [≡] Pizza            (15 items)   │
│  [≡] Pasta            (18 items)   │
│  [≡] Beverages        (45 items)   │
│  [≡] Desserts         (8 items)    │
│                                     │
│  [+ Add Category]                   │
└─────────────────────────────────────┘

Drag to reorder categories
```

**Implementation Requirements:**
- [ ] WYSIWYG editor for descriptions
- [ ] Drag-drop image upload
- [ ] Automatic image optimization
- [ ] Real-time preview
- [ ] Version history (last 10 changes)
- [ ] Import/export functionality
- [ ] Nutritional information fields
- [ ] Multi-language support
- [ ] SEO optimization
- [ ] QR code menu preview

---

### 3.2.3 Kitchen Display System

**Feature ID**: RM-003  
**Priority**: P0 (Critical)  
**Effort**: 21 story points  
**Dependencies**: Large screen optimization, Touch support

#### Product Specification

The Kitchen Display System (KDS) replaces paper tickets with a digital interface optimized for kitchen operations, improving efficiency and order accuracy.

**Kitchen Display Layout:**

```
┌─────────────────────────────────────────────────────────────┐
│  KITCHEN DISPLAY          🕐 14:45      👨‍🍳 Station: GRILL │
├─────────────────────────────┬───────────────────────────────┤
│  NEW ORDERS                 │  IN PROGRESS                  │
│  ┌─────────────────────┐    │  ┌─────────────────────┐     │
│  │ #042  A15  🔴 2min │    │  │ #041  B8   🟡 8min │     │
│  │ ─────────────────  │    │  │ ─────────────────  │     │
│  │ 2x BURGER          │    │  │ 1x STEAK MED-RARE │     │
│  │    - No onions     │    │  │ 1x SALMON         │     │
│  │ 1x FRIES           │    │  │ 2x VEGETABLES     │     │
│  │                    │    │  │                   │     │
│  │    [START] [BUMP]  │    │  │  [READY] [RECALL] │     │
│  └─────────────────────┘    │  └─────────────────────┘     │
│  ┌─────────────────────┐    │  ┌─────────────────────┐     │
│  │ #043  C5   🔴 1min │    │  │ #040  A2  🟡 12min│     │
│  │ ─────────────────  │    │  │ ─────────────────  │     │
│  │ 1x CHICKEN WINGS   │    │  │ 3x RIBS           │     │
│  │ 1x CAESAR SALAD    │    │  │ 1x COLESLAW       │     │
│  │                    │    │  │                   │     │
│  │    [START] [BUMP]  │    │  │  [READY] [RECALL] │     │
│  └─────────────────────┘    │  └─────────────────────┘     │
├─────────────────────────────┴───────────────────────────────┤
│  STATS: 15 orders/hour | Avg time: 14 min | On time: 89%  │
└─────────────────────────────────────────────────────────────┘
```

**Order Priority System:**

```typescript
interface KitchenOrder {
  // Order identification
  orderNumber: string;
  tableCode: string;
  
  // Timing
  orderTime: Date;
  targetTime: Date;
  elapsedTime: number; // minutes
  
  // Priority calculation
  priority: {
    score: number; // 0-100
    factors: {
      waitTime: number;
      tableType: 'regular' | 'vip' | 'large_party';
      courseSync: boolean; // Multiple items same table
      allergyAlert: boolean;
    };
    color: 'green' | 'yellow' | 'red' | 'purple'; // Visual indicator
  };
  
  // Items
  items: KitchenItem[];
  
  // Station routing
  stations: KitchenStation[];
}

interface KitchenItem {
  name: string;
  quantity: number;
  modifiers: string[];
  specialInstructions: string;
  allergens: string[];
  station: KitchenStation;
  status: 'pending' | 'cooking' | 'ready';
  cookTime: number; // minutes
}
```

**Touch Interactions:**

| Gesture | Action | Visual Feedback |
|---------|--------|-----------------|
| Tap | Select order | Highlight border |
| Double Tap | Start cooking | Color change |
| Swipe Right | Mark ready | Slide animation |
| Swipe Left | Recall order | Slide back |
| Long Press | View details | Modal popup |
| Pinch | Zoom view | Scale animation |

**Kitchen Metrics Display:**

```
┌─────────────────────────────────────┐
│  PERFORMANCE METRICS                │
├─────────────────────────────────────┤
│  Orders/Hour:    23  ▲ +15%        │
│  Avg Cook Time:  14m ▼ -2m         │
│  On-Time Rate:   89% ▲ +5%         │
│  Active Orders:  8                  │
│  Longest Wait:   18m (#039)         │
└─────────────────────────────────────┘
```

**Configuration Options:**

```typescript
interface KDSConfiguration {
  // Display settings
  display: {
    layout: 'grid' | 'list' | 'stations';
    columns: 2 | 3 | 4;
    fontSize: 'small' | 'medium' | 'large' | 'xl';
    colorScheme: 'light' | 'dark' | 'high-contrast';
  };
  
  // Operational settings
  operations: {
    autoAccept: boolean;
    alertThreshold: number; // minutes before alert
    courseGrouping: boolean;
    stationFiltering: boolean;
  };
  
  // Audio alerts
  audio: {
    enabled: boolean;
    volume: number; // 0-100
    alerts: {
      newOrder: AudioFile;
      urgentOrder: AudioFile;
      reminder: AudioFile;
    };
  };
}
```

**Implementation Requirements:**
- [ ] Touch-optimized interface (44px minimum targets)
- [ ] Works on 15"+ displays
- [ ] Offline operation capability
- [ ] Print backup for each order
- [ ] Speed of service tracking
- [ ] Multi-station support
- [ ] Allergen highlighting
- [ ] Course timing synchronization
- [ ] Bump bar integration (optional)
- [ ] Voice alerts (optional)

---

### 3.2.4 QR Code Management

**Feature ID**: RM-004  
**Priority**: P1 (High)  
**Effort**: 13 story points  
**Dependencies**: QR generation library, Print formatting

#### Product Specification

The QR Code Management system enables restaurants to create, customize, and track QR codes for their tables with branding and analytics.

**QR Code Generator Interface:**

```
┌─────────────────────────────────────────────────────────────┐
│  QR CODE MANAGEMENT                                         │
├─────────────────────────────────────────────────────────────┤
│  Generate QR Codes:                                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Table Selection:                                     │   │
│  │ ☑ All Tables (24)                                  │   │
│  │ ☐ Indoor Tables (12)                               │   │
│  │ ☐ Outdoor Tables (8)                               │   │
│  │ ☐ Beach Tables (4)                                 │   │
│  │                                                     │   │
│  │ Design Options:                                     │   │
│  │ Logo: [Upload Logo]                                 │   │
│  │ Colors: Foreground [■] Background [□]              │   │
│  │ Style: ● Classic ○ Rounded ○ Dots                  │   │
│  │ Size: ● Small ○ Medium ○ Large                     │   │
│  │                                                     │   │
│  │ Frame Text: "Scan to Order"                         │   │
│  │ Include: ☑ Restaurant Name ☑ Table Number          │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Preview:                                                   │
│  ┌─────────────────────┐  ┌─────────────────────┐         │
│  │                     │  │  BEACH BAR DURRËS   │         │
│  │    [QR CODE]       │  │                     │         │
│  │                     │  │    [QR CODE]       │         │
│  │  Scan to Order     │  │                     │         │
│  │    Table A15       │  │   Scan to Order    │         │
│  └─────────────────────┘  │     Table A15      │         │
│                           └─────────────────────┘         │
│                                                             │
│  [GENERATE ALL] [DOWNLOAD ZIP] [PRINT]                      │
└─────────────────────────────────────────────────────────────┘
```

**QR Code Data Structure:**

```typescript
interface QRCodeData {
  // Encoded data
  payload: {
    version: '1.0';
    restaurantId: string;
    restaurantSlug: string;
    tableId: string;
    tableCode: string;
    timestamp: number;
    signature: string; // Security signature
  };
  
  // Visual design
  design: {
    logo?: {
      url: string;
      size: number; // percentage of QR code
      padding: number;
    };
    colors: {
      foreground: string;
      background: string;
    };
    style: 'square' | 'rounded' | 'dots';
    errorCorrection: 'L' | 'M' | 'Q' | 'H';
  };
  
  // Metadata
  metadata: {
    generatedAt: Date;
    generatedBy: string;
    printCount: number;
    lastPrinted?: Date;
  };
}
```

**Print Templates:**

```
┌─────────────────────────────────────┐
│  SELECT PRINT TEMPLATE              │
├─────────────────────────────────────┤
│  ○ Table Tent (4x6")               │
│  ● Sticker (3x3")                  │
│  ○ Menu Insert (2x3")              │
│  ○ Wall Poster (8.5x11")           │
│  ○ Custom Size: [___] x [___]      │
├─────────────────────────────────────┤
│  Material:                          │
│  ● Waterproof Vinyl                │
│  ○ Standard Paper                  │
│  ○ Laminated Card                  │
├─────────────────────────────────────┤
│  Quantity per code: [1]            │
│  Include instructions: ☑            │
│                                     │
│  [GENERATE PDF] [SEND TO PRINTER]   │
└─────────────────────────────────────┘
```

**QR Code Analytics:**

```typescript
interface QRAnalytics {
  // Scan metrics
  scans: {
    total: number;
    unique: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
  
  // Conversion funnel
  funnel: {
    scanned: number;
    viewedMenu: number;
    addedToCart: number;
    placedOrder: number;
    conversionRate: number; // percentage
  };
  
  // Time analysis
  patterns: {
    hourlyDistribution: Map<number, number>;
    dailyDistribution: Map<string, number>;
    peakHours: string[];
    averageTimeToOrder: number; // seconds
  };
  
  // Device analysis
  devices: {
    ios: number;
    android: number;
    other: number;
  };
}
```

**Bulk Operations:**

```typescript
interface BulkQROperations {
  // Generate multiple codes
  generateBulk: (tables: Table[]) => Promise<QRBatch>;
  
  // Download formats
  downloadAs: {
    format: 'pdf' | 'png' | 'svg' | 'zip';
    layout: 'individual' | 'sheet' | 'book';
    includeInstructions: boolean;
  };
  
  // Update existing codes
  regenerate: (tableIds: string[]) => Promise<void>;
  
  // Deactivate codes
  deactivate: (tableIds: string[]) => Promise<void>;
}
```

**Implementation Requirements:**
- [ ] QR code generation < 1 second per code
- [ ] Custom branding without breaking scans
- [ ] Error correction for damaged codes
- [ ] Unique URL shortener integration
- [ ] Analytics tracking per QR code
- [ ] Bulk generation up to 1000 codes
- [ ] Print-ready PDF generation
- [ ] Template library
- [ ] A/B testing different designs
- [ ] Security signatures to prevent tampering

---

### 3.2.5 Business Analytics Dashboard

**Feature ID**: RM-005  
**Priority**: P1 (High)  
**Effort**: 55 story points  
**Dependencies**: Data aggregation, Charting library

#### Product Specification

The Business Analytics Dashboard provides comprehensive insights into restaurant performance, customer behavior, and operational efficiency.

**Analytics Dashboard Overview:**

```
┌─────────────────────────────────────────────────────────────┐
│  📊 BUSINESS ANALYTICS       Beach Bar Durrës   [Export]    │
├─────────────────────────────────────────────────────────────┤
│  Period: [Last 30 Days ▼]  Compare to: [Previous Period ▼] │
├─────────────────────────────────────────────────────────────┤
│  KEY METRICS                                                │
│  ┌────────────┬────────────┬────────────┬────────────────┐│
│  │  REVENUE   │   ORDERS   │    AOV     │  CUSTOMERS     ││
│  │  €48,750   │   2,145    │   €22.73   │    1,823       ││
│  │  ↑ 15.3%   │  ↑ 12.1%   │  ↑ 2.8%    │   ↑ 18.5%     ││
│  └────────────┴────────────┴────────────┴────────────────┘│
├─────────────────────────────────────────────────────────────┤
│  REVENUE TREND                                              │
│  [Line chart showing daily revenue over 30 days]           │
│                                                             │
│  POPULAR ITEMS                    PEAK HOURS                │
│  1. Aperol Spritz (342)          [Heat map of orders       │
│  2. Pizza Margherita (298)        by hour and day]         │
│  3. Greek Salad (276)                                       │
│  4. Beer (264)                                              │
│  5. Burger & Fries (198)                                    │
├─────────────────────────────────────────────────────────────┤
│  CUSTOMER INSIGHTS               OPERATIONAL METRICS        │
│  New vs Returning: [Pie chart]  Avg Prep Time: 16.5 min   │
│  Order Frequency: 2.3x/month    Table Turnover: 2.8x       │
│  Lifetime Value: €67.40         Staff Efficiency: 89%       │
└─────────────────────────────────────────────────────────────┘
```

**Analytics Modules:**

```typescript
interface AnalyticsModules {
  // Revenue Analytics
  revenue: {
    total: number;
    growth: GrowthMetric;
    breakdown: {
      byCategory: Map<string, number>;
      byPaymentMethod: Map<PaymentMethod, number>;
      byTimeOfDay: Map<number, number>;
      byDayOfWeek: Map<string, number>;
    };
    projections: RevenueProjection;
  };
  
  // Customer Analytics
  customers: {
    total: number;
    new: number;
    returning: number;
    retention: RetentionCohort[];
    segmentation: CustomerSegment[];
    lifetime: {
      value: number;
      orders: number;
      avgFrequency: number;
    };
  };
  
  // Product Analytics
  products: {
    topSelling: ProductMetric[];
    growth: ProductMetric[];
    declining: ProductMetric[];
    profitability: Map<string, ProfitData>;
    recommendations: MenuOptimization[];
  };
  
  // Operational Analytics
  operations: {
    orderVolume: TimeSeriesData;
    preparationTime: {
      average: number;
      byCategory: Map<string, number>;
      distribution: number[];
    };
    tableUtilization: {
      turnover: number;
      occupancy: number;
      avgDuration: number;
    };
    staffPerformance: StaffMetric[];
  };
}
```

**Custom Reports Builder:**

```
┌─────────────────────────────────────────────────────────────┐
│  BUILD CUSTOM REPORT                                        │
├─────────────────────────────────────────────────────────────┤
│  Report Name: [Weekend Performance Analysis]                │
│                                                             │
│  Metrics to Include:                                        │
│  ☑ Revenue          ☑ Orders         ☐ Customers           │
│  ☑ Popular Items    ☐ Staff Metrics  ☑ Peak Hours         │
│                                                             │
│  Filters:                                                   │
│  Days: ☑ Friday ☑ Saturday ☑ Sunday                       │
│  Time: From [18:00] To [02:00]                            │
│  Categories: ☑ All                                         │
│                                                             │
│  Grouping: ● By Hour ○ By Day ○ By Week                   │
│                                                             │
│  Schedule: ○ One-time ● Weekly (Every Monday)              │
│  Send to: [manager@beachbar.al]                            │
│                                                             │
│  [PREVIEW REPORT] [SAVE & SCHEDULE]                         │
└─────────────────────────────────────────────────────────────┘
```

**Predictive Analytics:**

```typescript
interface PredictiveAnalytics {
  // Demand Forecasting
  demandForecast: {
    nextDay: HourlyForecast[];
    nextWeek: DailyForecast[];
    accuracy: number; // Historical accuracy percentage
    factors: {
      weather: boolean;
      events: boolean;
      seasonality: boolean;
      trends: boolean;
    };
  };
  
  // Revenue Projections
  revenueProjection: {
    scenarios: {
      conservative: ProjectionData;
      moderate: ProjectionData;
      optimistic: ProjectionData;
    };
    recommendations: string[];
  };
  
  // Customer Churn Prediction
  churnRisk: {
    atRisk: CustomerRisk[];
    churnProbability: Map<string, number>;
    preventionActions: Action[];
  };
  
  // Menu Optimization
  menuOptimization: {
    underperforming: MenuItem[];
    priceElasticity: Map<string, ElasticityData>;
    bundleRecommendations: Bundle[];
    removalCandidates: MenuItem[];
  };
}
```

**Data Export Options:**

```typescript
interface ExportOptions {
  formats: {
    pdf: {
      template: 'executive' | 'detailed' | 'custom';
      branding: boolean;
      charts: boolean;
    };
    excel: {
      rawData: boolean;
      formattedSheets: boolean;
      pivotTables: boolean;
    };
    csv: {
      delimiter: ',' | ';' | '\t';
      encoding: 'utf8' | 'utf16';
    };
  };
  
  scheduling: {
    frequency: 'daily' | 'weekly' | 'monthly';
    recipients: string[];
    includeInsights: boolean;
  };
  
  api: {
    endpoint: string;
    authentication: string;
    format: 'json' | 'xml';
  };
}
```

**Implementation Requirements:**
- [ ] Real-time data processing pipeline
- [ ] Sub-second query performance
- [ ] Interactive charts with drill-down
- [ ] Custom date range selection
- [ ] Comparative analysis tools
- [ ] Automated insight generation
- [ ] Export in multiple formats
- [ ] API for third-party integration
- [ ] Mobile-responsive analytics
- [ ] Role-based data access

---

## 3.3 Advanced Features

### 3.3.1 AI Menu Assistant

**Feature ID**: AF-001  
**Priority**: P2 (Medium)  
**Effort**: 55 story points  
**Dependencies**: AI service integration, Image recognition API

#### Product Specification

The AI Menu Assistant leverages artificial intelligence to help restaurants optimize their menus through intelligent content generation, pricing analysis, and performance predictions.

**AI Assistant Interface:**

```
┌─────────────────────────────────────────────────────────────┐
│  🤖 AI MENU ASSISTANT                    [Settings] [Help]  │
├─────────────────────────────────────────────────────────────┤
│  How can I help you optimize your menu today?              │
│                                                             │
│  Quick Actions:                                             │
│  ┌─────────────────┬─────────────────┬──────────────────┐ │
│  │ ✍️ Generate     │ 💰 Analyze      │ 📸 Recognize     │ │
│  │   Descriptions  │    Pricing      │    Dishes       │ │
│  ├─────────────────┼─────────────────┼──────────────────┤ │
│  │ 📊 Predict      │ 🎯 Optimize     │ 🌐 Translate    │ │
│  │   Performance   │    Menu         │    Content      │ │
│  └─────────────────┴─────────────────┴──────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  Current Task: Generating descriptions for 5 items...       │
│  ████████████████░░░░░░ 75% Complete                       │
└─────────────────────────────────────────────────────────────┘
```

**AI Capabilities:**

```typescript
interface AIMenuAssistant {
  // Content Generation
  content: {
    generateDescription: (
      itemName: string,
      cuisine: string,
      style: 'casual' | 'formal' | 'enticing'
    ) => Promise<GeneratedContent>;
    
    enhanceDescription: (
      currentDescription: string,
      targetLength: 'short' | 'medium' | 'long'
    ) => Promise<string>;
    
    generateTags: (
      item: MenuItem
    ) => Promise<string[]>;
    
    suggestNames: (
      ingredients: string[],
      cuisine: string
    ) => Promise<NameSuggestion[]>;
  };
  
  // Pricing Intelligence
  pricing: {
    analyzePricing: (
      item: MenuItem,
      marketData: MarketContext
    ) => Promise<PricingAnalysis>;
    
    optimizePrices: (
      menu: MenuItem[],
      strategy: 'profit' | 'volume' | 'balanced'
    ) => Promise<PriceOptimization>;
    
    competitorAnalysis: (
      location: GeoLocation,
      radius: number
    ) => Promise<CompetitorPricing>;
  };
  
  // Visual Recognition
  recognition: {
    analyzeImage: (
      imageUrl: string
    ) => Promise<DishRecognition>;
    
    suggestCategory: (
      imageAnalysis: DishRecognition
    ) => Promise<string>;
    
    assessQuality: (
      imageUrl: string
    ) => Promise<ImageQualityScore>;
  };
  
  // Performance Prediction
  prediction: {
    predictSales: (
      item: MenuItem,
      historicalData: SalesHistory
    ) => Promise<SalesPrediction>;
    
    identifyTrends: (
      menu: MenuItem[],
      timeframe: TimeRange
    ) => Promise<TrendAnalysis>;
    
    seasonalAnalysis: (
      category: string
    ) => Promise<SeasonalPattern>;
  };
}
```

**AI-Generated Descriptions Example:**

```
┌─────────────────────────────────────────────────────────────┐
│  DESCRIPTION GENERATOR                                      │
├─────────────────────────────────────────────────────────────┤
│  Item: Grilled Salmon                                       │
│  Cuisine: Mediterranean                                     │
│  Style: [Enticing ▼]                                       │
│                                                             │
│  Generated Descriptions:                                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Option 1 (Recommended)                              │   │
│  │ "Perfectly grilled Atlantic salmon, kissed with    │   │
│  │ Mediterranean herbs and finished with a delicate   │   │
│  │ lemon butter sauce. Served alongside seasonal      │   │
│  │ vegetables for a healthy, flavorful experience."   │   │
│  │                                                     │   │
│  │ Sentiment: 92% positive | Reading level: 8th      │   │
│  │ [USE THIS] [REGENERATE] [EDIT]                     │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Option 2                                            │   │
│  │ "Fresh Atlantic salmon grilled to perfection and   │   │
│  │ seasoned with aromatic herbs. A light, healthy     │   │
│  │ choice that doesn't compromise on flavor."         │   │
│  │                                                     │   │
│  │ Sentiment: 88% positive | Reading level: 6th      │   │
│  │ [USE THIS] [REGENERATE] [EDIT]                     │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

**Pricing Analysis Dashboard:**

```
┌─────────────────────────────────────────────────────────────┐
│  PRICING ANALYSIS - Margherita Pizza                       │
├─────────────────────────────────────────────────────────────┤
│  Current Price: €8.50                                       │
│  Market Analysis:                                           │
│  • Competitor Average: €9.20 (±€1.50)                      │
│  • Your Position: 8% below market                          │
│  • Price Elasticity: -1.2 (moderate sensitivity)          │
│                                                             │
│  Optimization Suggestions:                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Scenario 1: Increase to €9.00                       │   │
│  │ • Projected Orders: -5%                             │   │
│  │ • Projected Revenue: +3.8%                          │   │
│  │ • Profit Impact: +€125/month                        │   │
│  │ Confidence: 85%                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Scenario 2: Bundle with drink for €12.00           │   │
│  │ • Projected Orders: +15%                            │   │
│  │ • Projected Revenue: +22%                           │   │
│  │ • Profit Impact: +€340/month                        │   │
│  │ Confidence: 78%                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  [APPLY SCENARIO 1] [APPLY SCENARIO 2] [MORE OPTIONS]      │
└─────────────────────────────────────────────────────────────┘
```

**Menu Optimization Matrix:**

```
┌─────────────────────────────────────────────────────────────┐
│  MENU ENGINEERING MATRIX                                    │
├─────────────────────────────────────────────────────────────┤
│                    High Profitability                       │
│     ┌─────────────────────┬─────────────────────┐         │
│     │     STARS ⭐        │   PUZZLES 🧩       │         │
│     │ • Aperol Spritz     │ • Lobster Risotto  │         │
│     │ • Margherita Pizza  │ • Filet Mignon     │         │
│     │ • Caesar Salad      │ • Wine Selection   │         │
│ Low │─────────────────────┼─────────────────────│ High    │
│ Pop │   WORKHORSES 🐴    │    DOGS 🐕         │ Pop     │
│     │ • French Fries      │ • Vegan Burger     │         │
│     │ • Coca Cola         │ • Quinoa Bowl      │         │
│     │ • House Wine        │ • Fruit Salad      │         │
│     └─────────────────────┴─────────────────────┘         │
│                    Low Profitability                        │
│                                                             │
│  AI Recommendations:                                        │
│  • Promote STARS with featured placement                   │
│  • Reposition PUZZLES with better descriptions            │
│  • Bundle WORKHORSES with high-margin items               │
│  • Consider removing or reimagining DOGS                   │
└─────────────────────────────────────────────────────────────┘
```

**Implementation Requirements:**
- [ ] GPT-4 API integration for content
- [ ] Computer vision API for images
- [ ] Market data aggregation service
- [ ] A/B testing framework
- [ ] Multilingual generation support
- [ ] Sentiment analysis for descriptions
- [ ] Competitive pricing database
- [ ] Performance tracking system
- [ ] Cost monitoring for API usage
- [ ] Human review workflow

---

### 3.3.2 Inventory Management System

**Feature ID**: AF-002  
**Priority**: P3 (Low)  
**Effort**: 89 story points  
**Dependencies**: Supplier APIs, Barcode scanning

#### Product Specification

The Inventory Management System provides comprehensive stock control, automated reordering, and waste reduction tools to optimize restaurant operations and profitability.

**Inventory Dashboard:**

```
┌─────────────────────────────────────────────────────────────┐
│  📦 INVENTORY MANAGEMENT            [Add Item] [Import CSV] │
├─────────────────────────────────────────────────────────────┤
│  Quick Stats: 156 items | €12,450 value | 3 low stock     │
├─────────────────────────────────────────────────────────────┤
│  ⚠️ LOW STOCK ALERTS                                       │
│  • Mozzarella Cheese: 2.5kg left (1 day supply)           │
│  • Aperol: 3 bottles (2 days)                             │
│  • Pizza Flour: 5kg (1.5 days)                            │
├─────────────────────────────────────────────────────────────┤
│  INVENTORY ITEMS                    [Search] [Filter ▼]     │
│  ┌──────────────────┬────────┬────────┬────────┬────────┐│
│  │ Item             │ Stock  │ Unit   │ Value  │ Status ││
│  ├──────────────────┼────────┼────────┼────────┼────────┤│
│  │ Mozzarella       │ 2.5    │ kg     │ €45    │ 🔴 Low ││
│  │ Tomato Sauce     │ 15     │ L      │ €120   │ 🟢 OK  ││
│  │ Olive Oil        │ 8      │ L      │ €160   │ 🟢 OK  ││
│  │ Aperol           │ 3      │ bottles│ €75    │ 🔴 Low ││
│  │ Prosecco         │ 24     │ bottles│ €480   │ 🟢 OK  ││
│  └──────────────────┴────────┴────────┴────────┴────────┘│
│                                                             │
│  [UPDATE STOCK] [GENERATE ORDER] [WASTE REPORT]            │
└─────────────────────────────────────────────────────────────┘
```

**Stock Management Features:**

```typescript
interface InventoryManagement {
  // Stock Tracking
  stock: {
    // Manual stock update
    updateStock: (
      itemId: string,
      quantity: number,
      operation: StockOperation
    ) => Promise<void>;
    
    // Automatic deduction from orders
    deductFromOrder: (
      order: Order
    ) => Promise<StockDeduction[]>;
    
    // Stock count/audit
    performStockCount: (
      items: StockCountItem[]
    ) => Promise<StockDiscrepancy[]>;
    
    // Par level management
    setParLevels: (
      itemId: string,
      levels: ParLevels
    ) => Promise<void>;
  };
  
  // Purchase Orders
  purchasing: {
    // Generate purchase order
    generatePO: (
      supplier: Supplier,
      items: POItem[]
    ) => Promise<PurchaseOrder>;
    
    // Auto-reorder based on par levels
    autoReorder: (
      rules: ReorderRules
    ) => Promise<PurchaseOrder[]>;
    
    // Receive shipment
    receiveShipment: (
      poId: string,
      receivedItems: ReceivedItem[]
    ) => Promise<void>;
    
    // Track order status
    trackPO: (
      poId: string
    ) => Promise<POStatus>;
  };
  
  // Waste Management
  waste: {
    // Record waste
    recordWaste: (
      waste: WasteRecord
    ) => Promise<void>;
    
    // Analyze waste patterns
    analyzeWaste: (
      timeframe: TimeRange
    ) => Promise<WasteAnalysis>;
    
    // Generate waste report
    wasteReport: (
      period: ReportPeriod
    ) => Promise<WasteReport>;
  };
  
  // Recipe Management
  recipes: {
    // Define recipe ingredients
    createRecipe: (
      recipe: Recipe
    ) => Promise<void>;
    
    // Calculate recipe cost
    calculateCost: (
      recipeId: string
    ) => Promise<RecipeCost>;
    
    // Update costs when prices change
    updateRecipeCosts: () => Promise<void>;
  };
}
```

**Supplier Management:**

```
┌─────────────────────────────────────────────────────────────┐
│  SUPPLIER MANAGEMENT                                        │
├─────────────────────────────────────────────────────────────┤
│  Active Suppliers: 12                   [Add Supplier]      │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Fresh Produce Albania                               │   │
│  │ Contact: +355 69 123 4567                          │   │
│  │ Email: orders@freshproduce.al                      │   │
│  │ Delivery: Mon, Wed, Fri                            │   │
│  │ Payment Terms: Net 30                              │   │
│  │ Last Order: 2 days ago                             │   │
│  │                                                     │   │
│  │ Products: Vegetables, Fruits, Herbs                 │   │
│  │ Avg Delivery Time: 98% on-time                     │   │
│  │ Quality Rating: ⭐⭐⭐⭐⭐ (4.8)                  │   │
│  │                                                     │   │
│  │ [VIEW CATALOG] [PLACE ORDER] [HISTORY]              │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

**Automated Reordering System:**

```typescript
interface AutoReorderSystem {
  // Reorder Rules
  rules: {
    // Minimum stock level triggering reorder
    reorderPoint: number;
    
    // Target stock level after reorder
    reorderQuantity: number;
    
    // Lead time from supplier (days)
    leadTime: number;
    
    // Safety stock calculation
    safetyStock: {
      method: 'fixed' | 'percentage' | 'statistical';
      value: number;
    };
  };
  
  // Intelligent Reordering
  intelligence: {
    // Demand forecasting
    forecast: {
      method: 'moving_average' | 'exponential' | 'ai_based';
      horizon: number; // days
      seasonality: boolean;
    };
    
    // Order optimization
    optimization: {
      combineOrders: boolean; // Combine to meet minimum
      considerPromotions: boolean;
      optimizeDeliveryDays: boolean;
    };
  };
  
  // Approval Workflow
  workflow: {
    // Approval thresholds
    autoApprove: {
      maxAmount: number;
      trustedSuppliers: string[];
    };
    
    // Notification settings
    notifications: {
      lowStockAlert: NotificationRule;
      orderPlaced: NotificationRule;
      deliveryReminder: NotificationRule;
    };
  };
}
```

**Waste Tracking Interface:**

```
┌─────────────────────────────────────────────────────────────┐
│  RECORD WASTE                                               │
├─────────────────────────────────────────────────────────────┤
│  Date: [Today ▼]  Time: [14:30]                           │
│                                                             │
│  Item: [Select Item ▼]                                     │
│  Quantity: [___] [kg ▼]                                   │
│  Reason: ○ Expired ● Damaged ○ Preparation ○ Customer     │
│  Notes: [Dropped during service]                           │
│                                                             │
│  📸 Add Photo (Optional)                                   │
│  [Take Photo] [Upload]                                     │
│                                                             │
│  Recorded by: John Smith                                   │
│                                                             │
│  [CANCEL] [SAVE WASTE RECORD]                              │
├─────────────────────────────────────────────────────────────┤
│  Recent Waste Entries:                                      │
│  • 2kg Tomatoes - Expired - Yesterday                      │
│  • 500g Mozzarella - Prep waste - Today 10:30             │
│  • 1L Milk - Expired - 2 days ago                         │
└─────────────────────────────────────────────────────────────┘
```

**Cost Analysis Dashboard:**

```
┌─────────────────────────────────────────────────────────────┐
│  COST ANALYSIS                                              │
├─────────────────────────────────────────────────────────────┤
│  Food Cost %: 28.5% ↓ 1.2%     Target: <30%               │
│  Waste %: 4.2% ↑ 0.5%          Target: <3%                │
├─────────────────────────────────────────────────────────────┤
│  TOP COST ITEMS                 HIGHEST WASTE              │
│  1. Beef (18%)                 1. Vegetables (35%)        │
│  2. Seafood (15%)              2. Dairy (22%)             │
│  3. Cheese (12%)               3. Bread (18%)             │
│  4. Alcohol (10%)              4. Sauces (15%)            │
│  5. Vegetables (8%)            5. Meat (10%)              │
├─────────────────────────────────────────────────────────────┤
│  RECIPE PROFITABILITY                                       │
│  ┌──────────────────┬─────────┬─────────┬───────────────┐│
│  │ Menu Item        │ Cost    │ Price   │ Profit Margin ││
│  ├──────────────────┼─────────┼─────────┼───────────────┤│
│  │ Margherita Pizza │ €2.85   │ €9.00   │ 68.3% ✅     ││
│  │ Caesar Salad     │ €3.20   │ €8.50   │ 62.4% ✅     ││
│  │ Ribeye Steak     │ €12.50  │ €28.00  │ 55.4% ✅     ││
│  │ Lobster Pasta    │ €15.00  │ €32.00  │ 53.1% ⚠️     ││
│  └──────────────────┴─────────┴─────────┴───────────────┘│
└─────────────────────────────────────────────────────────────┘
```

**Implementation Requirements:**
- [ ] Real-time stock level tracking
- [ ] Barcode/QR scanning support
- [ ] Recipe costing engine
- [ ] Par level automation
- [ ] Multi-supplier management
- [ ] Purchase order generation
- [ ] Delivery tracking
- [ ] Waste photo documentation
- [ ] Cost analysis reporting
- [ ] Integration with POS systems
- [ ] Predictive reordering AI
- [ ] Mobile app for stock counts
- [ ] Expiration date tracking
- [ ] Batch/lot tracking
- [ ] Allergen tracking

---

## 3.4 Platform Features

### 3.4.1 Authentication and Authorization

**Feature ID**: PF-001  
**Priority**: P0 (Critical)  
**Effort**: 21 story points  
**Dependencies**: Firebase Auth, Security rules

#### Product Specification

The authentication system provides secure, flexible access control for customers, restaurant staff, and platform administrators with role-based permissions.

**Authentication Methods:**

```
┌─────────────────────────────────────────────────────────────┐
│  WELCOME TO URDHËRO                                         │
├─────────────────────────────────────────────────────────────┤
│  Customer Access:                                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Continue with Google                                │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Continue with Facebook                              │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Continue with Email                                 │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Continue as Guest                                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ─────────────────── OR ───────────────────                │
│                                                             │
│  Restaurant Staff? [Login Here]                            │
└─────────────────────────────────────────────────────────────┘
```

**Role-Based Access Control (RBAC):**

```typescript
enum UserRole {
  // Customer roles
  GUEST = 'guest',
  CUSTOMER = 'customer',
  VIP_CUSTOMER = 'vip_customer',
  
  // Restaurant roles
  WAITER = 'waiter',
  KITCHEN_STAFF = 'kitchen_staff',
  MANAGER = 'manager',
  OWNER = 'owner',
  
  // Platform roles
  SUPPORT = 'support',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}

interface Permission {
  resource: string;
  actions: ('create' | 'read' | 'update' | 'delete')[];
  conditions?: PermissionCondition[];
}

interface RolePermissions {
  [UserRole.GUEST]: Permission[];
  [UserRole.CUSTOMER]: Permission[];
  [UserRole.WAITER]: Permission[];
  [UserRole.KITCHEN_STAFF]: Permission[];
  [UserRole.MANAGER]: Permission[];
  [UserRole.OWNER]: Permission[];
  // ... other roles
}

// Example permissions
const permissions: RolePermissions = {
  [UserRole.WAITER]: [
    {
      resource: 'orders',
      actions: ['read', 'update'],
      conditions: [{ field: 'restaurantId', operator: 'equals', value: 'user.restaurantId' }]
    },
    {
      resource: 'tables',
      actions: ['read', 'update'],
      conditions: [{ field: 'restaurantId', operator: 'equals', value: 'user.restaurantId' }]
    }
  ],
  [UserRole.MANAGER]: [
    {
      resource: 'orders',
      actions: ['create', 'read', 'update', 'delete'],
      conditions: [{ field: 'restaurantId', operator: 'equals', value: 'user.restaurantId' }]
    },
    {
      resource: 'menu',
      actions: ['create', 'read', 'update', 'delete'],
      conditions: [{ field: 'restaurantId', operator: 'equals', value: 'user.restaurantId' }]
    },
    {
      resource: 'staff',
      actions: ['create', 'read', 'update'],
      conditions: [{ field: 'restaurantId', operator: 'equals', value: 'user.restaurantId' }]
    }
  ]
};
```

**Restaurant Staff Login:**

```
┌─────────────────────────────────────────────────────────────┐
│  RESTAURANT STAFF LOGIN                                     │
├─────────────────────────────────────────────────────────────┤
│  Restaurant: [Select Restaurant ▼]                          │
│  Email: [____________________________]                      │
│  Password: [_________________________]                     │
│  PIN (Optional): [____]                                     │
│                                                             │
│  ☐ Remember me on this device                              │
│  ☐ Enable quick PIN access                                 │
│                                                             │
│  [FORGOT PASSWORD?]                    [LOGIN]              │
├─────────────────────────────────────────────────────────────┤
│  Security Features:                                         │
│  • Two-factor authentication available                      │
│  • Session timeout after 8 hours                           │
│  • Device tracking and alerts                              │
└─────────────────────────────────────────────────────────────┘
```

**Multi-Factor Authentication (MFA):**

```typescript
interface MFAConfiguration {
  // MFA methods
  methods: {
    sms: {
      enabled: boolean;
      phoneNumber: string;
      verified: boolean;
    };
    authenticator: {
      enabled: boolean;
      secret: string;
      qrCode: string;
    };
    email: {
      enabled: boolean;
      address: string;
      verified: boolean;
    };
  };
  
  // MFA rules
  rules: {
    // Require MFA for roles
    requiredForRoles: UserRole[];
    
    // Require MFA for actions
    requiredForActions: string[];
    
    // Grace period for enrollment
    enrollmentGracePeriod: number; // days
    
    // Remember device option
    trustedDevices: {
      enabled: boolean;
      duration: number; // days
    };
  };
  
  // Recovery options
  recovery: {
    backupCodes: string[];
    recoveryEmail: string;
    securityQuestions: SecurityQuestion[];
  };
}
```

**Session Management:**

```typescript
interface SessionConfig {
  // Session duration
  duration: {
    customer: number; // 24 hours
    staff: number; // 8 hours
    kitchen: number; // 12 hours
    remember: number; // 30 days
  };
  
  // Concurrent sessions
  concurrent: {
    maxPerUser: number;
    maxPerDevice: number;
    kickOutOldest: boolean;
  };
  
  // Activity tracking
  tracking: {
    lastActivity: Date;
    ipAddress: string;
    userAgent: string;
    deviceFingerprint: string;
    location?: GeoLocation;
  };
  
  // Security
  security: {
    rotateTokens: boolean;
    csrfProtection: boolean;
    sameSiteCookies: 'strict' | 'lax' | 'none';
    secureOnly: boolean;
  };
}
```

**Quick Staff Access (PIN):**

```
┌─────────────────────────────────────────────────────────────┐
│  QUICK ACCESS - Beach Bar Durrës                           │
├─────────────────────────────────────────────────────────────┤
│  Select Staff Member:                                       │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐         │
│  │   👤    │ │   👤    │ │   👤    │ │   👤    │         │
│  │  John   │ │  Maria  │ │  Ardit  │ │  Elena  │         │
│  │ Manager │ │ Waiter  │ │Kitchen  │ │ Waiter  │         │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘         │
│                                                             │
│  Enter PIN:                                                 │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐                                 │
│  │ * │ │ * │ │   │ │   │                                 │
│  └───┘ └───┘ └───┘ └───┘                                 │
│                                                             │
│  [BACK TO LOGIN]                                           │
└─────────────────────────────────────────────────────────────┘
```

**Implementation Requirements:**
- [ ] Firebase Auth integration
- [ ] Social login providers (Google, Facebook)
- [ ] Email/password with verification
- [ ] Guest checkout functionality
- [ ] Role-based permissions system
- [ ] Multi-factor authentication
- [ ] Session management
- [ ] Device fingerprinting
- [ ] PIN access for staff
- [ ] Audit logging
- [ ] Password policies
- [ ] Account lockout protection
- [ ] GDPR compliance
- [ ] Security headers
- [ ] CSRF protection

---

### 3.4.2 Payment Processing

**Feature ID**: PF-002  
**Priority**: P0 (Critical)  
**Effort**: 34 story points  
**Dependencies**: Stripe integration, PCI compliance

#### Product Specification

The payment processing system handles multiple payment methods securely while maintaining PCI compliance and supporting both Albanian Lek and Euro currencies.

**Payment Methods Interface:**

```
┌─────────────────────────────────────────────────────────────┐
│  PAYMENT METHOD                         Total: €25.85       │
├─────────────────────────────────────────────────────────────┤
│  How would you like to pay?                                │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 💵 Cash                                             │   │
│  │    Pay at the table when served                     │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 💳 Credit/Debit Card                                │   │
│  │    Secure payment powered by Stripe                 │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 📱 Digital Wallet                                   │   │
│  │    Apple Pay, Google Pay                            │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Currency: [EUR ▼] (2,965 ALL)                            │
│                                                             │
│  ☐ Save payment method for next time                       │
└─────────────────────────────────────────────────────────────┘
```

**Card Payment Flow:**

```typescript
interface PaymentProcessor {
  // Initialize payment
  createPaymentIntent: (
    amount: number,
    currency: 'EUR' | 'ALL',
    metadata: PaymentMetadata
  ) => Promise<PaymentIntent>;
  
  // Process payment
  processPayment: (
    paymentMethod: PaymentMethod,
    paymentIntent: PaymentIntent
  ) => Promise<PaymentResult>;
  
  // Handle 3D Secure
  handle3DSecure: (
    paymentIntent: PaymentIntent
  ) => Promise<Secure3DResult>;
  
  // Refund management
  refundPayment: (
    paymentId: string,
    amount?: number,
    reason?: RefundReason
  ) => Promise<RefundResult>;
  
  // Webhook handling
  handleWebhook: (
    payload: string,
    signature: string
  ) => Promise<WebhookResult>;
}

interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  clientSecret: string;
  metadata: {
    orderId: string;
    restaurantId: string;
    tableId: string;
  };
}

enum PaymentStatus {
  REQUIRES_PAYMENT_METHOD = 'requires_payment_method',
  REQUIRES_CONFIRMATION = 'requires_confirmation',
  REQUIRES_ACTION = 'requires_action', // 3D Secure
  PROCESSING = 'processing',
  SUCCEEDED = 'succeeded',
  CANCELED = 'canceled',
  FAILED = 'failed'
}
```

**Stripe Elements Integration:**

```
┌─────────────────────────────────────────────────────────────┐
│  SECURE CARD PAYMENT                                        │
├─────────────────────────────────────────────────────────────┤
│  Card Information:                                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 4242 4242 4242 4242                   MM/YY  CVC   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Cardholder Name:                                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ John Smith                                          │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Billing Country:                                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Albania ▼                                           │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  🔒 Your payment info is secure and encrypted              │
│                                                             │
│  [CANCEL]                          [PAY €25.85]            │
└─────────────────────────────────────────────────────────────┘
```

**Digital Wallet Support:**

```typescript
interface DigitalWallet {
  // Apple Pay
  applePay: {
    available: boolean;
    configure: (config: ApplePayConfig) => Promise<void>;
    requestPayment: (request: PaymentRequest) => Promise<ApplePayResult>;
  };
  
  // Google Pay
  googlePay: {
    available: boolean;
    configure: (config: GooglePayConfig) => Promise<void>;
    requestPayment: (request: PaymentRequest) => Promise<GooglePayResult>;
  };
  
  // PayPal (future)
  paypal?: {
    available: boolean;
    configure: (config: PayPalConfig) => Promise<void>;
    requestPayment: (request: PaymentRequest) => Promise<PayPalResult>;
  };
}

interface PaymentRequest {
  total: {
    label: string;
    amount: number;
    currency: string;
  };
  displayItems: {
    label: string;
    amount: number;
  }[];
  shippingOptions: never; // Not applicable for restaurant
  requestPayerName: boolean;
  requestPayerEmail: boolean;
  requestPayerPhone: boolean;
}
```

**Multi-Currency Support:**

```typescript
interface CurrencyManager {
  // Exchange rates
  rates: {
    base: 'EUR';
    rates: {
      ALL: number; // e.g., 115.23
      USD: number; // e.g., 1.08
    };
    lastUpdated: Date;
  };
  
  // Conversion
  convert: (
    amount: number,
    from: Currency,
    to: Currency
  ) => number;
  
  // Formatting
  format: (
    amount: number,
    currency: Currency,
    locale?: string
  ) => string;
  
  // Rounding rules
  round: (
    amount: number,
    currency: Currency
  ) => number;
}

// Currency display
const formatters = {
  EUR: new Intl.NumberFormat('sq-AL', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
  }),
  ALL: new Intl.NumberFormat('sq-AL', {
    style: 'currency',
    currency: 'ALL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })
};
```

**Payment Receipt:**

```
┌─────────────────────────────────────────────────────────────┐
│  PAYMENT SUCCESSFUL ✅                                      │
├─────────────────────────────────────────────────────────────┤
│  Beach Bar Durrës                                          │
│  Order #TN-042                                             │
│  Table A15                                                 │
│                                                             │
│  Items:                                                     │
│  2x Aperol Spritz                            €17.00        │
│  1x Greek Salad                               €6.50        │
│  ─────────────────────────────────────────────────         │
│  Subtotal:                                   €23.50        │
│  Service (10%):                               €2.35        │
│  TOTAL PAID:                                 €25.85        │
│                                                             │
│  Payment Method: •••• 4242                                 │
│  Transaction ID: ch_3O1kN2H0XqD3Nf1N0aBcDeFg              │
│  Date: January 15, 2025 14:35                             │
│                                                             │
│  [DOWNLOAD RECEIPT] [EMAIL RECEIPT]                        │
└─────────────────────────────────────────────────────────────┘
```

**Payment Settings (Restaurant):**

```typescript
interface RestaurantPaymentSettings {
  // Accepted methods
  methods: {
    cash: {
      enabled: boolean;
      requiresChange: boolean;
    };
    card: {
      enabled: boolean;
      minimumAmount?: number;
      processingFee?: number;
    };
    digitalWallet: {
      enabled: boolean;
      supportedWallets: ('apple_pay' | 'google_pay')[];
    };
  };
  
  // Currency settings
  currency: {
    primary: 'EUR' | 'ALL';
    accepted: ('EUR' | 'ALL')[];
    autoConvert: boolean;
    displayBoth: boolean;
  };
  
  // Fee configuration
  fees: {
    serviceCharge: {
      enabled: boolean;
      percentage: number;
      automatic: boolean;
    };
    processingFee: {
      enabled: boolean;
      percentage: number;
      fixedAmount: number;
    };
  };
  
  // Tipping
  tipping: {
    enabled: boolean;
    suggestions: number[]; // [10, 15, 20]
    custom: boolean;
    splitBetweenStaff: boolean;
  };
}
```

**Implementation Requirements:**
- [ ] Stripe integration (SDK v13+)
- [ ] PCI DSS compliance
- [ ] 3D Secure 2 support
- [ ] Digital wallet integration
- [ ] Multi-currency support
- [ ] Exchange rate updates
- [ ] Payment method storage
- [ ] Refund processing
- [ ] Webhook handling
- [ ] Receipt generation
- [ ] Transaction logging
- [ ] Fraud detection
- [ ] Chargeback handling
- [ ] Settlement reports
- [ ] Tax calculation

---

### 3.4.3 Performance Monitoring

**Feature ID**: PF-003  
**Priority**: P2 (Medium)  
**Effort**: 21 story points  
**Dependencies**: Analytics services, Monitoring tools

#### Product Specification

The performance monitoring system tracks application performance, user experience metrics, and business KPIs to ensure optimal platform operation.

**Performance Dashboard:**

```
┌─────────────────────────────────────────────────────────────┐
│  🚀 PERFORMANCE MONITORING          Last 24 Hours   [Live] │
├─────────────────────────────────────────────────────────────┤
│  CORE WEB VITALS                                           │
│  ┌────────────┬────────────┬────────────┬────────────────┐│
│  │    LCP     │    FID     │    CLS     │   SCORE        ││
│  │   1.8s     │   75ms     │   0.05     │    92/100      ││
│  │  🟢 Good   │  🟢 Good   │  🟢 Good   │   🟢 Good      ││
│  └────────────┴────────────┴────────────┴────────────────┘│
├─────────────────────────────────────────────────────────────┤
│  REAL USER MONITORING                                       │
│  • Page Load Time: 2.3s (P75) ↓ 0.2s                      │
│  • Time to Interactive: 3.1s ↓ 0.5s                       │
│  • First Contentful Paint: 1.2s → No change               │
│  • API Response Time: 245ms (P95) ↑ 12ms                  │
├─────────────────────────────────────────────────────────────┤
│  ERROR TRACKING            Last 24h    Last 7d   Change   │
│  JavaScript Errors:           23        142      ↓ 18%    │
│  API Errors (5xx):            2         18       ↓ 45%    │
│  Failed Payments:             5         31       ↓ 12%    │
│  Crash Rate:                0.02%      0.03%    ↓ 33%    │
├─────────────────────────────────────────────────────────────┤
│  TOP ISSUES                                  Users Affected │
│  1. Slow menu loading on 3G                         1,234 │
│  2. Cart update timeout                               456 │
│  3. Image loading errors                              234 │
└─────────────────────────────────────────────────────────────┘
```

**Web Vitals Tracking:**

```typescript
interface WebVitalsTracking {
  // Core Web Vitals
  metrics: {
    LCP: { // Largest Contentful Paint
      value: number;
      rating: 'good' | 'needs-improvement' | 'poor';
      threshold: { good: 2500, poor: 4000 };
    };
    FID: { // First Input Delay
      value: number;
      rating: 'good' | 'needs-improvement' | 'poor';
      threshold: { good: 100, poor: 300 };
    };
    CLS: { // Cumulative Layout Shift
      value: number;
      rating: 'good' | 'needs-improvement' | 'poor';
      threshold: { good: 0.1, poor: 0.25 };
    };
  };
  
  // Additional metrics
  additional: {
    TTFB: number; // Time to First Byte
    FCP: number; // First Contentful Paint
    TTI: number; // Time to Interactive
    TBT: number; // Total Blocking Time
    INP: number; // Interaction to Next Paint
  };
  
  // Tracking configuration
  config: {
    sampleRate: number; // 0-1
    reportingEndpoint: string;
    reportingInterval: number; // ms
    debug: boolean;
  };
}

// Implementation
import { getCLS, getFID, getLCP } from 'web-vitals';

function trackWebVitals() {
  getCLS(metric => {
    analytics.track('Web Vitals', {
      metric: 'CLS',
      value: metric.value,
      rating: metric.rating
    });
  });
  
  getFID(metric => {
    analytics.track('Web Vitals', {
      metric: 'FID',
      value: metric.value,
      rating: metric.rating
    });
  });
  
  getLCP(metric => {
    analytics.track('Web Vitals', {
      metric: 'LCP',
      value: metric.value,
      rating: metric.rating
    });
  });
}
```

**User Journey Analytics:**

```
┌─────────────────────────────────────────────────────────────┐
│  USER JOURNEY FUNNEL                                        │
├─────────────────────────────────────────────────────────────┤
│  QR Code Scanned          ████████████████████ 100% (5,234)│
│                                    ↓ 92%                    │
│  Menu Viewed              ███████████████████  92% (4,815) │
│                                    ↓ 78%                    │
│  Item Added to Cart       ████████████        72% (3,768)  │
│                                    ↓ 85%                    │
│  Proceeded to Checkout    ██████████          61% (3,193)  │
│                                    ↓ 94%                    │
│  Order Placed             ██████████          57% (2,983)  │
│                                    ↓ 98%                    │
│  Order Completed          █████████           56% (2,923)  │
├─────────────────────────────────────────────────────────────┤
│  Drop-off Analysis:                                         │
│  • Menu → Cart: 20% (Loading time, confusion)              │
│  • Cart → Checkout: 13% (Price concerns, complexity)       │
│  • Checkout → Order: 6% (Payment issues, validation)       │
└─────────────────────────────────────────────────────────────┘
```

**Error Monitoring:**

```typescript
interface ErrorMonitoring {
  // Error capture
  capture: {
    // JavaScript errors
    javascript: {
      message: string;
      stack: string;
      source: string;
      line: number;
      column: number;
      userAgent: string;
      url: string;
    };
    
    // API errors
    api: {
      endpoint: string;
      method: string;
      statusCode: number;
      responseTime: number;
      errorMessage: string;
      requestId: string;
    };
    
    // Business logic errors
    business: {
      type: string;
      context: any;
      userId?: string;
      restaurantId?: string;
    };
  };
  
  // Error grouping
  grouping: {
    fingerprint: string; // Unique error signature
    occurrences: number;
    firstSeen: Date;
    lastSeen: Date;
    affectedUsers: number;
  };
  
  // Alerting
  alerts: {
    rules: AlertRule[];
    channels: ('email' | 'sms' | 'slack')[];
    escalation: EscalationPolicy;
  };
}

interface AlertRule {
  name: string;
  condition: {
    metric: string;
    operator: '>' | '<' | '=' | '!=' | 'contains';
    value: any;
    window: number; // minutes
  };
  severity: 'info' | 'warning' | 'error' | 'critical';
  cooldown: number; // minutes
}
```

**Performance Budget:**

```
┌─────────────────────────────────────────────────────────────┐
│  PERFORMANCE BUDGET STATUS                                  │
├─────────────────────────────────────────────────────────────┤
│  Metric               Budget    Current   Status   Trend   │
│  ─────────────────────────────────────────────────────────  │
│  JS Bundle Size       300KB     287KB     ✅      ↓ 2KB   │
│  CSS Bundle Size      50KB      48KB      ✅      → 0KB   │
│  Image Size (avg)     100KB     112KB     ⚠️      ↑ 5KB   │
│  Total Page Weight    1.5MB     1.4MB     ✅      ↓ 50KB  │
│  ─────────────────────────────────────────────────────────  │
│  Time to Interactive  3.0s      3.1s      ⚠️      ↑ 0.1s  │
│  API Response (P95)   500ms     485ms     ✅      ↓ 15ms  │
│  ─────────────────────────────────────────────────────────  │
│  Lighthouse Score     90        92        ✅      ↑ 2     │
│                                                             │
│  ⚠️ 2 metrics exceeding budget                             │
│  [VIEW DETAILS] [UPDATE BUDGETS] [EXPORT REPORT]           │
└─────────────────────────────────────────────────────────────┘
```

**Business Metrics Tracking:**

```typescript
interface BusinessMetrics {
  // Conversion metrics
  conversion: {
    qrToOrder: number; // percentage
    cartAbandonment: number;
    averageOrderValue: number;
    repeatOrderRate: number;
  };
  
  // Performance impact
  impact: {
    // Revenue impact of performance
    revenueImpact: {
      loadTimeCorrelation: number;
      optimalLoadTime: number; // ms
      revenuePerMs: number; // € lost per ms slower
    };
    
    // User satisfaction
    satisfaction: {
      npsScore: number;
      performanceComplaints: number;
      appRating: number;
    };
  };
  
  // A/B testing
  experiments: {
    name: string;
    variant: string;
    metrics: {
      conversion: number;
      performance: WebVitalsMetrics;
      revenue: number;
    };
  }[];
}
```

**Implementation Requirements:**
- [ ] Web Vitals monitoring library
- [ ] Custom performance metrics
- [ ] Real User Monitoring (RUM)
- [ ] Synthetic monitoring
- [ ] Error tracking (Sentry)
- [ ] APM integration
- [ ] Custom dashboards
- [ ] Alert configuration
- [ ] Performance budgets
- [ ] A/B testing framework
- [ ] Business metric correlation
- [ ] Automated reporting
- [ ] API monitoring
- [ ] Database query monitoring
- [ ] Cost tracking per service

---

## 4. TECHNICAL SPECIFICATIONS

### 4.1 Frontend Architecture

#### 4.1.1 Component Architecture

```typescript
// Component structure following Atomic Design principles
src/
├── components/
│   ├── atoms/           // Basic building blocks
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Icon/
│   │   └── Badge/
│   ├── molecules/       // Combinations of atoms
│   │   ├── MenuItem/
│   │   ├── OrderCard/
│   │   ├── SearchBar/
│   │   └── PriceDisplay/
│   ├── organisms/       // Complex components
│   │   ├── MenuGrid/
│   │   ├── CartSummary/
│   │   ├── OrderTracker/
│   │   └── RestaurantHeader/
│   ├── templates/       // Page templates
│   │   ├── CustomerLayout/
│   │   ├── DashboardLayout/
│   │   └── AuthLayout/
│   └── pages/          // Actual pages
│       ├── customer/
│       ├── restaurant/
│       └── admin/
```

#### 4.1.2 State Management Architecture

```typescript
// Context-based state management with custom hooks
interface AppState {
  auth: AuthState;
  cart: CartState;
  orders: OrderState;
  restaurant: RestaurantState;
  ui: UIState;
}

// Auth Context
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  permissions: Permission[];
}

// Cart Context
interface CartState {
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  restaurant: Restaurant | null;
  table: Table | null;
}

// Custom Hooks
function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

// State persistence
function usePersistentState<T>(
  key: string,
  defaultValue: T,
  storage: Storage = localStorage
): [T, (value: T) => void] {
  const [state, setState] = useState<T>(() => {
    try {
      const item = storage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    storage.setItem(key, JSON.stringify(state));
  }, [key, state, storage]);

  return [state, setState];
}
```

#### 4.1.3 Performance Optimization Strategy

```typescript
// Code splitting configuration
const MenuPage = lazy(() => 
  import(/* webpackChunkName: "menu" */ './pages/customer/MenuPage')
);

const DashboardPage = lazy(() => 
  import(/* webpackChunkName: "dashboard" */ './pages/restaurant/DashboardPage')
);

// Image optimization
interface ImageOptimization {
  formats: ['webp', 'jpg'];
  sizes: {
    thumbnail: 150;
    card: 300;
    hero: 1200;
  };
  lazy: boolean;
  placeholder: 'blur' | 'empty' | 'tracedSVG';
}

// Bundle optimization
const bundleConfig = {
  vendor: {
    react: ['react', 'react-dom', 'react-router-dom'],
    ui: ['framer-motion', '@headlessui/react'],
    utils: ['date-fns', 'zod', 'clsx']
  },
  chunks: {
    maxSize: 244000, // 244KB
    minSize: 20000,  // 20KB
    cacheGroups: {
      common: {
        minChunks: 2,
        priority: -10,
        reuseExistingChunk: true
      }
    }
  }
};
```

### 4.2 Backend Architecture

#### 4.2.1 Cloud Functions Structure

```typescript
// Function organization by domain
functions/
├── src/
│   ├── auth/
│   │   ├── onCreate.ts      // New user setup
│   │   ├── onDelete.ts      // Cleanup on deletion
│   │   └── customClaims.ts  // Role management
│   ├── orders/
│   │   ├── create.ts        // Order creation
│   │   ├── update.ts        // Status updates
│   │   ├── cancel.ts        // Cancellation logic
│   │   └── analytics.ts     // Order analytics
│   ├── payments/
│   │   ├── createIntent.ts  // Payment initialization
│   │   ├── webhook.ts       // Stripe webhooks
│   │   └── refund.ts        // Refund processing
│   ├── restaurants/
│   │   ├── onboard.ts       // Restaurant setup
│   │   ├── menu.ts          // Menu management
│   │   └── analytics.ts     // Business analytics
│   └── shared/
│       ├── middleware/      // Common middleware
│       ├── utils/           // Utility functions
│       └── types/           // TypeScript types
```

#### 4.2.2 Database Design Patterns

```typescript
// Firestore data modeling patterns

// 1. Denormalization for read performance
interface Order {
  // Order data
  id: string;
  orderNumber: string;
  
  // Denormalized restaurant data
  restaurant: {
    id: string;
    name: string;
    slug: string;
  };
  
  // Denormalized customer data
  customer: {
    id?: string;
    name: string;
    phone?: string;
  };
  
  // Subcollection reference
  items: SubCollection<OrderItem>;
}

// 2. Aggregation patterns
interface RestaurantStats {
  ordersToday: number;
  revenueToday: number;
  ordersThisMonth: number;
  revenueThisMonth: number;
  lastUpdated: Timestamp;
}

// 3. Sharding for scale
interface ShardedCounter {
  shards: {
    [shardId: string]: {
      count: number;
    };
  };
  
  // Helper functions
  increment: (amount: number) => Promise<void>;
  getValue: () => Promise<number>;
}
```

#### 4.2.3 Security Architecture

```typescript
// Security rules patterns
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isRestaurantStaff(restaurantId) {
      return isAuthenticated() && 
        request.auth.token.restaurantId == restaurantId &&
        request.auth.token.role in ['staff', 'manager', 'owner'];
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Restaurant rules
    match /restaurants/{restaurantId} {
      allow read: if true; // Public menu access
      allow write: if isRestaurantStaff(restaurantId);
      
      // Menu items subcollection
      match /menuItems/{itemId} {
        allow read: if true;
        allow write: if isRestaurantStaff(restaurantId);
      }
    }
    
    // Order rules
    match /orders/{orderId} {
      allow create: if true; // Anyone can create orders
      allow read: if isOwner(resource.data.customerId) || 
                     isRestaurantStaff(resource.data.restaurantId);
      allow update: if isRestaurantStaff(resource.data.restaurantId);
    }
  }
}
```

---

## 5. USER INTERFACE SPECIFICATIONS

### 5.1 Design System

I'll continue the PRD from where it left off at section 5.1 Design System:

## 5. USER INTERFACE SPECIFICATIONS (continued)

### 5.1 Design System

#### 5.1.1 Color Palette

```css
:root {
  /* Primary Colors */
  --primary-50: #fef3c7;
  --primary-100: #fde68a;
  --primary-200: #fcd34d;
  --primary-300: #fbbf24;
  --primary-400: #f59e0b;
  --primary-500: #ea580c; /* Main brand color */
  --primary-600: #dc2626;
  --primary-700: #b91c1c;
  --primary-800: #991b1b;
  --primary-900: #7f1d1d;
  
  /* Neutral Colors */
  --gray-50: #fafafa;
  --gray-100: #f4f4f5;
  --gray-200: #e4e4e7;
  --gray-300: #d4d4d8;
  --gray-400: #a1a1aa;
  --gray-500: #71717a;
  --gray-600: #52525b;
  --gray-700: #3f3f46;
  --gray-800: #27272a;
  --gray-900: #18181b;
  
  /* Semantic Colors */
  --success-500: #22c55e;
  --warning-500: #f59e0b;
  --error-500: #ef4444;
  --info-500: #3b82f6;
  
  /* Albanian Flag Colors */
  --albania-red: #e41e20;
  --albania-black: #000000;
}
```

#### 5.1.2 Typography System

```css
/* Font Stack */
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-display: 'Playfair Display', Georgia, serif;

/* Type Scale */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
--text-5xl: 3rem;      /* 48px */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;

/* Line Heights */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
```

#### 5.1.3 Component Library

```typescript
// Button Component Variants
interface ButtonStyles {
  variants: {
    primary: 'bg-primary-500 text-white hover:bg-primary-600';
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300';
    outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-50';
    ghost: 'text-primary-500 hover:bg-primary-50';
    danger: 'bg-error-500 text-white hover:bg-error-600';
  };
  sizes: {
    sm: 'px-3 py-1.5 text-sm';
    md: 'px-4 py-2 text-base';
    lg: 'px-6 py-3 text-lg';
    xl: 'px-8 py-4 text-xl';
  };
  states: {
    loading: 'opacity-75 cursor-wait';
    disabled: 'opacity-50 cursor-not-allowed';
  };
}

// Card Component Styles
interface CardStyles {
  base: 'bg-white rounded-lg';
  variants: {
    flat: 'shadow-sm';
    elevated: 'shadow-md hover:shadow-lg transition-shadow';
    outlined: 'border border-gray-200';
    glass: 'bg-white/80 backdrop-blur-md';
  };
  padding: {
    sm: 'p-3';
    md: 'p-4';
    lg: 'p-6';
    xl: 'p-8';
  };
}
```

#### 5.1.4 Spacing System

```css
/* Base unit: 8px */
--space-0: 0;
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-5: 1.25rem;  /* 20px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-10: 2.5rem;  /* 40px */
--space-12: 3rem;    /* 48px */
--space-16: 4rem;    /* 64px */
--space-20: 5rem;    /* 80px */
--space-24: 6rem;    /* 96px */
```

#### 5.1.5 Animation System

```typescript
interface AnimationConfig {
  durations: {
    instant: '0ms';
    fast: '150ms';
    normal: '300ms';
    slow: '500ms';
    verySlow: '1000ms';
  };
  easings: {
    linear: 'linear';
    in: 'cubic-bezier(0.4, 0, 1, 1)';
    out: 'cubic-bezier(0, 0, 0.2, 1)';
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)';
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)';
  };
  keyframes: {
    fadeIn: '@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }';
    slideUp: '@keyframes slideUp { from { transform: translateY(10px); opacity: 0; } }';
    pulse: '@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }';
  };
}
```

### 5.2 Responsive Design

#### 5.2.1 Breakpoint System

```css
/* Mobile First Approach */
--screen-sm: 640px;   /* Small tablets */
--screen-md: 768px;   /* Tablets */
--screen-lg: 1024px;  /* Desktop */
--screen-xl: 1280px;  /* Large desktop */
--screen-2xl: 1536px; /* Extra large */

/* Media Queries */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

#### 5.2.2 Layout Grid System

```css
/* Container */
.container {
  width: 100%;
  margin: 0 auto;
  padding: 0 1rem;
}

@media (min-width: 640px) {
  .container { max-width: 640px; }
}

@media (min-width: 768px) {
  .container { max-width: 768px; }
}

@media (min-width: 1024px) {
  .container { max-width: 1024px; }
}

@media (min-width: 1280px) {
  .container { max-width: 1280px; }
}

/* Grid System */
.grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(12, 1fr);
}

/* Responsive Columns */
.col-12 { grid-column: span 12; }
.col-6 { grid-column: span 6; }
.col-4 { grid-column: span 4; }
.col-3 { grid-column: span 3; }

@media (max-width: 768px) {
  .col-md-12 { grid-column: span 12; }
  .col-md-6 { grid-column: span 12; }
  .col-md-4 { grid-column: span 12; }
}
```

#### 5.2.3 Touch Optimization

```typescript
interface TouchTargets {
  minimum: {
    size: '44px'; // iOS Human Interface Guidelines
    spacing: '8px';
  };
  recommended: {
    size: '48px'; // Material Design Guidelines
    spacing: '12px';
  };
  gestures: {
    swipe: { threshold: 50 }; // pixels
    tap: { delay: 300 }; // milliseconds
    longPress: { duration: 500 }; // milliseconds
  };
}
```

### 5.3 Accessibility Specifications

#### 5.3.1 WCAG 2.1 AA Compliance

```typescript
interface AccessibilityRequirements {
  colorContrast: {
    normalText: 4.5; // :1 ratio
    largeText: 3; // :1 ratio
    ui: 3; // :1 ratio
  };
  focusIndicators: {
    outline: '2px solid currentColor';
    offset: '2px';
    borderRadius: 'inherit';
  };
  keyboard: {
    tabIndex: boolean;
    skipLinks: boolean;
    focusTrap: boolean;
  };
  screenReaders: {
    ariaLabels: boolean;
    ariaDescriptions: boolean;
    semanticHTML: boolean;
    altText: boolean;
  };
}
```

#### 5.3.2 Accessibility Implementation

```html
<!-- Skip Navigation -->
<a href="#main-content" class="skip-link">
  Skip to main content
</a>

<!-- Semantic HTML Structure -->
<header role="banner">
  <nav role="navigation" aria-label="Main navigation">
    <!-- Navigation items -->
  </nav>
</header>

<main id="main-content" role="main">
  <!-- Main content -->
</main>

<footer role="contentinfo">
  <!-- Footer content -->
</footer>
```

## 6. API SPECIFICATIONS

### 6.1 REST API Endpoints

#### 6.1.1 Authentication Endpoints

```typescript
// Authentication API
POST   /api/v1/auth/register
Body: {
  email: string;
  password: string;
  role: 'customer' | 'restaurant';
  restaurantId?: string; // For restaurant staff
}
Response: {
  token: string;
  refreshToken: string;
  user: User;
}

POST   /api/v1/auth/login
Body: {
  email: string;
  password: string;
}
Response: {
  token: string;
  refreshToken: string;
  user: User;
}

POST   /api/v1/auth/refresh
Body: {
  refreshToken: string;
}
Response: {
  token: string;
  refreshToken: string;
}

POST   /api/v1/auth/logout
Headers: {
  Authorization: Bearer ${token}
}
Response: {
  success: boolean;
}

POST   /api/v1/auth/forgot-password
Body: {
  email: string;
}
Response: {
  message: string;
}
```

#### 6.1.2 Restaurant Management Endpoints

```typescript
// Restaurant CRUD
GET    /api/v1/restaurants/:slug
Response: {
  restaurant: Restaurant;
  menu: MenuItem[];
  tables: Table[];
}

PUT    /api/v1/restaurants/:id
Headers: {
  Authorization: Bearer ${token}
}
Body: {
  name?: string;
  description?: string;
  address?: Address;
  hours?: OperatingHours;
  settings?: RestaurantSettings;
}
Response: {
  restaurant: Restaurant;
}

// Menu Management
GET    /api/v1/restaurants/:id/menu
Query: {
  category?: string;
  available?: boolean;
  search?: string;
}
Response: {
  items: MenuItem[];
  categories: Category[];
}

POST   /api/v1/restaurants/:id/menu
Headers: {
  Authorization: Bearer ${token}
}
Body: {
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  allergens?: string[];
  preparationTime?: number;
}
Response: {
  item: MenuItem;
}

PUT    /api/v1/restaurants/:id/menu/:itemId
PATCH  /api/v1/restaurants/:id/menu/:itemId/availability
DELETE /api/v1/restaurants/:id/menu/:itemId
```

#### 6.1.3 Order Management Endpoints

```typescript
// Order Operations
POST   /api/v1/orders
Body: {
  restaurantId: string;
  tableId: string;
  items: OrderItem[];
  specialInstructions?: string;
  customerInfo?: CustomerInfo;
}
Response: {
  order: Order;
  estimatedTime: number;
}

GET    /api/v1/orders/:orderNumber
Response: {
  order: Order;
  status: OrderStatus;
  timeline: OrderTimeline;
}

PUT    /api/v1/orders/:id/status
Headers: {
  Authorization: Bearer ${token}
}
Body: {
  status: OrderStatus;
  reason?: string;
}
Response: {
  order: Order;
}

GET    /api/v1/restaurants/:id/orders
Headers: {
  Authorization: Bearer ${token}
}
Query: {
  status?: OrderStatus;
  date?: string;
  limit?: number;
  offset?: number;
}
Response: {
  orders: Order[];
  total: number;
  hasMore: boolean;
}
```

### 6.2 Real-Time Events

#### 6.2.1 WebSocket Events

```typescript
// WebSocket Connection
const socket = io('wss://api.urdhero.al', {
  auth: {
    token: authToken
  }
});

// Customer Events
socket.on('order:statusUpdate', (data: {
  orderId: string;
  status: OrderStatus;
  estimatedTime?: number;
}) => {
  // Handle status update
});

socket.on('order:ready', (data: {
  orderId: string;
  orderNumber: string;
}) => {
  // Show notification
});

// Restaurant Events
socket.on('order:new', (data: {
  order: Order;
  priority: 'normal' | 'high' | 'urgent';
}) => {
  // Add to order queue
});

socket.on('restaurant:stats', (data: {
  activeOrders: number;
  todayRevenue: number;
  avgPrepTime: number;
}) => {
  // Update dashboard
});

// Error Handling
socket.on('error', (error: {
  code: string;
  message: string;
}) => {
  // Handle error
});
```

### 6.3 API Response Formats

#### 6.3.1 Standard Response Structure

```typescript
// Success Response
interface SuccessResponse<T> {
  success: true;
  data: T;
  meta?: {
    timestamp: string;
    version: string;
    requestId: string;
  };
}

// Error Response
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    field?: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    version: string;
    requestId: string;
  };
}

// Paginated Response
interface PaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  meta?: ResponseMeta;
}
```

#### 6.3.2 Error Codes

```typescript
enum APIErrorCode {
  // Authentication Errors (1xxx)
  INVALID_CREDENTIALS = 'AUTH_1001',
  TOKEN_EXPIRED = 'AUTH_1002',
  INSUFFICIENT_PERMISSIONS = 'AUTH_1003',
  ACCOUNT_LOCKED = 'AUTH_1004',
  
  // Validation Errors (2xxx)
  INVALID_INPUT = 'VAL_2001',
  MISSING_FIELD = 'VAL_2002',
  INVALID_FORMAT = 'VAL_2003',
  
  // Business Logic Errors (3xxx)
  RESTAURANT_NOT_FOUND = 'BIZ_3001',
  ITEM_UNAVAILABLE = 'BIZ_3002',
  ORDER_CANCELLED = 'BIZ_3003',
  INSUFFICIENT_STOCK = 'BIZ_3004',
  
  // Server Errors (5xxx)
  INTERNAL_ERROR = 'SRV_5001',
  DATABASE_ERROR = 'SRV_5002',
  SERVICE_UNAVAILABLE = 'SRV_5003'
}
```

## 7. DATABASE SCHEMA

### 7.1 Core Collections

#### 7.1.1 Restaurants Collection

```typescript
// restaurants/{restaurantId}
interface Restaurant {
  id: string;
  name: string;
  slug: string; // Unique URL identifier
  email: string;
  phone?: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  description?: string;
  cuisine: string[];
  priceRange: 1 | 2 | 3 | 4; // € to €€€€
  images: {
    logo?: string;
    cover?: string;
    gallery?: string[];
  };
  hours: {
    [day: string]: {
      open: string; // HH:MM
      close: string; // HH:MM
      breaks?: Array<{
        start: string;
        end: string;
      }>;
    };
  };
  settings: {
    orderSettings: {
      acceptingOrders: boolean;
      minOrderAmount?: number;
      estimatedPrepTime: number;
      maxAdvanceOrderDays: number;
    };
    paymentMethods: {
      cash: boolean;
      card: boolean;
      digitalWallet: boolean;
    };
    languages: string[];
    timezone: string;
  };
  subscription: {
    plan: 'free' | 'starter' | 'pro' | 'enterprise';
    validUntil: Timestamp;
    features: string[];
  };
  stats: {
    totalOrders: number;
    avgRating: number;
    totalReviews: number;
  };
  status: 'active' | 'inactive' | 'suspended';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### 7.1.2 Menu Items Subcollection

```typescript
// restaurants/{restaurantId}/menuItems/{itemId}
interface MenuItem {
  id: string;
  name: string;
  description: string;
  translations?: {
    [lang: string]: {
      name: string;
      description: string;
    };
  };
  price: {
    amount: number;
    currency: 'EUR' | 'ALL';
    displayPrice?: string; // Formatted
  };
  category: string;
  subcategory?: string;
  images: {
    primary: string;
    thumbnails?: {
      small: string;  // 150x150
      medium: string; // 300x300
      large: string;  // 600x600
    };
  };
  nutritionalInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    sodium?: number;
  };
  allergens: string[];
  dietaryTags: ('vegetarian' | 'vegan' | 'gluten-free' | 'dairy-free' | 'nut-free')[];
  ingredients?: string[];
  preparationTime: number; // minutes
  availability: {
    isAvailable: boolean;
    schedule?: {
      [day: string]: {
        start: string;
        end: string;
      };
    };
    stockCount?: number;
    maxPerDay?: number;
  };
  modifiers?: {
    sizes?: Array<{
      name: string;
      priceAdjustment: number;
      default?: boolean;
    }>;
    addons?: Array<{
      name: string;
      price: number;
      maxQuantity?: number;
    }>;
    removableIngredients?: string[];
  };
  popularity: {
    orderCount: number;
    favoriteCount: number;
    lastOrdered?: Timestamp;
  };
  displayOrder: number;
  tags?: string[];
  isSpecial?: boolean;
  specialPrice?: number;
  specialValidUntil?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### 7.1.3 Orders Collection

```typescript
// orders/{orderId}
interface Order {
  id: string;
  orderNumber: string; // Human-readable
  restaurantId: string;
  restaurant: { // Denormalized
    name: string;
    slug: string;
  };
  tableId: string;
  tableNumber: string;
  customerId?: string;
  customerInfo: {
    name?: string;
    email?: string;
    phone?: string;
    isGuest: boolean;
  };
  items: Array<{
    menuItemId: string;
    name: string;
    price: number;
    quantity: number;
    modifiers?: {
      size?: string;
      addons?: string[];
      removedIngredients?: string[];
    };
    specialInstructions?: string;
    subtotal: number;
  }>;
  pricing: {
    subtotal: number;
    tax: number;
    serviceCharge?: number;
    discount?: {
      type: 'percentage' | 'fixed';
      value: number;
      code?: string;
    };
    tip?: number;
    total: number;
    currency: 'EUR' | 'ALL';
  };
  status: OrderStatus;
  statusHistory: Array<{
    status: OrderStatus;
    timestamp: Timestamp;
    changedBy?: string;
    reason?: string;
  }>;
  payment: {
    method: 'cash' | 'card' | 'digital_wallet' | 'pending';
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
    transactionId?: string;
    paidAt?: Timestamp;
  };
  timestamps: {
    created: Timestamp;
    accepted?: Timestamp;
    preparing?: Timestamp;
    ready?: Timestamp;
    served?: Timestamp;
    completed?: Timestamp;
    cancelled?: Timestamp;
  };
  estimatedTime: {
    minutes: number;
    readyBy: Timestamp;
  };
  specialInstructions?: string;
  rating?: {
    food: number;
    service: number;
    overall: number;
    comment?: string;
    createdAt: Timestamp;
  };
  metadata: {
    source: 'qr' | 'app' | 'web' | 'pos';
    deviceInfo?: {
      platform: string;
      version: string;
      userAgent: string;
    };
    qrCodeId?: string;
  };
}
```

#### 7.1.4 Users Collection

```typescript
// users/{userId}
interface User {
  id: string;
  email: string;
  displayName?: string;
  phoneNumber?: string;
  photoURL?: string;
  role: UserRole;
  restaurantId?: string; // For staff
  permissions?: string[];
  preferences: {
    language: string;
    currency: 'EUR' | 'ALL';
    notifications: {
      orderUpdates: boolean;
      promotions: boolean;
      newsletter: boolean;
    };
    dietary?: string[];
    allergens?: string[];
  };
  loyalty?: {
    points: number;
    tier: 'bronze' | 'silver' | 'gold' | 'platinum';
    memberSince: Timestamp;
    lifetimeSpent: number;
    referralCode: string;
    referredBy?: string;
  };
  addresses?: Array<{
    id: string;
    label: string;
    address: Address;
    isDefault: boolean;
  }>;
  favoriteItems?: string[];
  favoriteRestaurants?: string[];
  orderHistory: {
    totalOrders: number;
    lastOrderDate?: Timestamp;
    frequentRestaurants: Array<{
      restaurantId: string;
      orderCount: number;
    }>;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastLoginAt?: Timestamp;
}
```

### 7.2 Data Relationships

#### 7.2.1 Relationship Diagram

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   Users     │       │ Restaurants │       │   Orders    │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id          │◄──────┤ ownerId     │       │ id          │
│ email       │       │ id          │◄──────┤ restaurantId│
│ role        │       │ slug        │       │ customerId  │◄─┐
└─────────────┘       └──────┬──────┘       └─────────────┘  │
                             │                                 │
                             │                                 │
                             ▼                                 │
                      ┌─────────────┐                         │
                      │  MenuItems  │                         │
                      ├─────────────┤                         │
                      │ id          │                         │
                      │ restaurantId│                         │
                      │ name        │                         │
                      └─────────────┘                         │
                                                              │
┌─────────────┐       ┌─────────────┐                        │
│   Tables    │       │  Analytics  │                        │
├─────────────┤       ├─────────────┤                        │
│ id          │       │ id          │                        │
│ restaurantId│       │ restaurantId│                        │
│ qrCode      │       │ date        │                        │
└─────────────┘       └─────────────┘                        │
                                                              │
                      ┌─────────────┐                        │
                      │  Customers  │────────────────────────┘
                      ├─────────────┤
                      │ userId      │
                      │ orders      │
                      └─────────────┘
```

### 7.3 Indexing Strategy

#### 7.3.1 Firestore Composite Indexes

```javascript
// firestore.indexes.json
{
  "indexes": [
    {
      "collectionGroup": "orders",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "restaurantId", "order": "ASCENDING" },
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "timestamps.created", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "orders",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "customerId", "order": "ASCENDING" },
        { "fieldPath": "timestamps.created", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "menuItems",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "category", "order": "ASCENDING" },
        { "fieldPath": "availability.isAvailable", "order": "ASCENDING" },
        { "fieldPath": "displayOrder", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "menuItems",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "tags", "order": "ASCENDING" },
        { "fieldPath": "popularity.orderCount", "order": "DESCENDING" }
      ]
    }
  ]
}
```

## 8. SECURITY SPECIFICATIONS

### 8.1 Authentication Security

#### 8.1.1 Password Requirements

```typescript
interface PasswordPolicy {
  minLength: 8;
  maxLength: 128;
  requireUppercase: true;
  requireLowercase: true;
  requireNumbers: true;
  requireSpecialChars: true;
  preventCommonPasswords: true;
  preventUserInfo: true; // No email, name in password
  previousPasswordsToCheck: 5;
  expirationDays: 90; // For staff accounts
}

// Password validation
function validatePassword(password: string, policy: PasswordPolicy): ValidationResult {
  const errors: string[] = [];
  
  if (password.length < policy.minLength) {
    errors.push(`Password must be at least ${policy.minLength} characters`);
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain number');
  }
  
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Password must contain special character');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}
```

#### 8.1.2 Multi-Factor Authentication

```typescript
interface MFAImplementation {
  methods: {
    totp: {
      enabled: boolean;
      issuer: 'Urdhëro';
      algorithm: 'SHA1';
      digits: 6;
      period: 30;
    };
    sms: {
      enabled: boolean;
      provider: 'twilio';
      template: string;
      cooldown: 60; // seconds
    };
    email: {
      enabled: boolean;
      template: string;
      cooldown: 60;
    };
  };
  
  backupCodes: {
    count: 10;
    length: 8;
    format: 'XXXX-XXXX';
  };
  
  enforcement: {
    roles: ['owner', 'manager', 'admin'];
    gracePeriod: 7; // days
  };
}
```

### 8.2 Data Protection

#### 8.2.1 Encryption Standards

```typescript
interface EncryptionConfig {
  atRest: {
    algorithm: 'AES-256-GCM';
    keyRotation: 'quarterly';
    keyDerivation: 'PBKDF2';
  };
  
  inTransit: {
    protocol: 'TLS 1.3';
    cipherSuites: [
      'TLS_AES_256_GCM_SHA384',
      'TLS_CHACHA20_POLY1305_SHA256',
      'TLS_AES_128_GCM_SHA256'
    ];
    certificatePinning: boolean;
  };
  
  fieldLevel: {
    pii: ['email', 'phone', 'address'];
    payment: ['cardNumber', 'cvv'];
    sensitive: ['password', 'pin'];
  };
}
```

#### 8.2.2 GDPR Compliance

```typescript
interface GDPRCompliance {
  dataSubjectRights: {
    access: boolean; // Right to access
    rectification: boolean; // Right to correct
    erasure: boolean; // Right to be forgotten
    portability: boolean; // Data export
    restriction: boolean; // Limit processing
    objection: boolean; // Opt-out
  };
  
  consent: {
    explicit: boolean;
    granular: boolean;
    withdrawable: boolean;
    documented: boolean;
  };
  
  dataRetention: {
    orders: 730; // days (2 years)
    analytics: 365; // days (1 year)
    logs: 90; // days
    backups: 30; // days
  };
  
  breach: {
    notificationTime: 72; // hours
    documentationRequired: boolean;
    affectedUserNotification: boolean;
  };
}
```

### 8.3 Input Validation

#### 8.3.1 Server-Side Validation

```typescript
// Validation schemas using Zod
import { z } from 'zod';

const emailSchema = z.string()
  .email('Invalid email format')
  .max(255, 'Email too long');

const phoneSchema = z.string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number');

const orderItemSchema = z.object({
  menuItemId: z.string().uuid(),
  quantity: z.number().int().min(1).max(99),
  modifiers: z.object({
    size: z.string().optional(),
    addons: z.array(z.string()).optional(),
    removedIngredients: z.array(z.string()).optional()
  }).optional(),
  specialInstructions: z.string().max(500).optional()
});

const createOrderSchema = z.object({
  restaurantId: z.string().uuid(),
  tableId: z.string(),
  items: z.array(orderItemSchema).min(1).max(50),
  customerInfo: z.object({
    name: z.string().min(2).max(100).optional(),
    email: emailSchema.optional(),
    phone: phoneSchema.optional()
  }).optional()
});
```

#### 8.3.2 XSS Prevention

```typescript
// Content Security Policy
const cspPolicy = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", 'https://www.google-analytics.com'],
  'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
  'img-src': ["'self'", 'data:', 'https:', 'blob:'],
  'font-src': ["'self'", 'https://fonts.gstatic.com'],
  'connect-src': ["'self'", 'wss://*.urdhero.al', 'https://api.stripe.com'],
  'frame-ancestors': ["'none'"],
  'form-action': ["'self'"],
  'base-uri': ["'self'"]
};

// HTML sanitization
import DOMPurify from 'isomorphic-dompurify';

function sanitizeHTML(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'br', 'p'],
    ALLOWED_ATTR: ['href', 'target', 'rel']
  });
}
```

## 9. PERFORMANCE SPECIFICATIONS

### 9.1 Response Time Requirements

#### 9.1.1 Performance Targets

| Operation | Target | Maximum | Measurement |
|-----------|--------|---------|-------------|
| Initial Page Load | < 2s | 3s | Time to Interactive |
| QR Code Scan | < 1s | 2s | Camera to Redirect |
| Menu Load | < 1s | 2s | API Response + Render |
| Add to Cart | < 200ms | 500ms | User Action to UI Update |
| Order Submission | < 2s | 4s | Submit to Confirmation |
| Status Update | < 500ms | 1s | WebSocket Event Delivery |
| Search Results | < 300ms | 500ms | Keystroke to Results |
| Image Load | < 1s | 2s | Optimized Images |

#### 9.1.2 API Performance

```typescript
interface APIPerformanceTargets {
  latency: {
    p50: 100,   // milliseconds
    p90: 250,   // milliseconds
    p95: 500,   // milliseconds
    p99: 1000   // milliseconds
  };
  throughput: {
    requestsPerSecond: 10000,
    concurrentConnections: 50000,
    websocketConnections: 100000
  };
  errorRates: {
    clientErrors: 5,    // percentage (4xx)
    serverErrors: 0.1,  // percentage (5xx)
    timeouts: 0.01      // percentage
  };
}
```

### 9.2 Scalability Targets

#### 9.2.1 System Capacity

```typescript
interface ScalabilityTargets {
  users: {
    monthlyActiveUsers: 1000000,
    dailyActiveUsers: 100000,
    concurrentUsers: 50000,
    peakHourMultiplier: 3
  };
  restaurants: {
    totalRestaurants: 10000,
    activeRestaurants: 5000,
    menuItemsPerRestaurant: 1000,
    tablesPerRestaurant: 100
  };
  orders: {
    ordersPerDay: 500000,
    peakOrdersPerMinute: 1000,
    averageItemsPerOrder: 5,
    historicalDataRetention: 730 // days
  };
  data: {
    databaseSize: '1TB',
    fileStorageSize: '10TB',
    dailyDataGrowth: '10GB',
    backupRetention: 30 // days
  };
}
```

#### 9.2.2 Auto-Scaling Configuration

```yaml
# Cloud Function Scaling
functions:
  orderProcessing:
    minInstances: 10
    maxInstances: 1000
    concurrentExecutions: 1000
    cpuMillicores: 1000
    memoryMb: 512
    timeoutSeconds: 60
    
  menuService:
    minInstances: 5
    maxInstances: 500
    concurrentExecutions: 500
    cpuMillicores: 500
    memoryMb: 256
    timeoutSeconds: 30

# Database Scaling
firestore:
  maxReadsPerSecond: 50000
  maxWritesPerSecond: 10000
  maxConcurrentConnections: 100000
```

### 9.3 Performance Monitoring

#### 9.3.1 Monitoring Metrics

```typescript
interface PerformanceMetrics {
  realUser: {
    // Core Web Vitals
    largestContentfulPaint: Metric;
    firstInputDelay: Metric;
    cumulativeLayoutShift: Metric;
    
    // Additional metrics
    timeToFirstByte: Metric;
    firstContentfulPaint: Metric;
    timeToInteractive: Metric;
    totalBlockingTime: Metric;
  };
  
  synthetic: {
    // Uptime monitoring
    availability: {
      target: 99.9, // percentage
      measurement: 'monthly'
    };
    
    // Load testing
    loadTest: {
      virtualUsers: 10000,
      duration: 3600, // seconds
      rampUp: 300 // seconds
    };
  };
  
  business: {
    conversionRate: number;
    cartAbandonmentRate: number;
    averageOrderTime: number;
    customerSatisfactionScore: number;
  };
}
```

## 10. INTEGRATION SPECIFICATIONS

### 10.1 Payment Gateway Integration

#### 10.1.1 Stripe Integration

```typescript
interface StripeIntegration {
  config: {
    apiVersion: '2023-10-16';
    webhookSecret: string;
    publishableKey: string;
    secretKey: string;
  };
  
  paymentMethods: {
    cards: {
      enabled: true;
      brands: ['visa', 'mastercard', 'amex'];
      threeDSecure: 'automatic';
    };
    digitalWallets: {
      applePay: true;
      googlePay: true;
      enabled: true;
    };
    bankTransfers: {
      enabled: false; // Phase 2
    };
  };
  
  webhooks: {
    events: [
      'payment_intent.succeeded',
      'payment_intent.failed',
      'payment_intent.canceled',
      'charge.refunded',
      'charge.dispute.created'
    ];
    endpoint: '/api/v1/webhooks/stripe';
    tolerance: 300; // seconds
  };
}

// Payment flow implementation
async function createPaymentIntent(order: Order): Promise<PaymentIntent> {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  
  return await stripe.paymentIntents.create({
    amount: Math.round(order.pricing.total * 100), // Convert to cents
    currency: order.pricing.currency.toLowerCase(),
    metadata: {
      orderId: order.id,
      orderNumber: order.orderNumber,
      restaurantId: order.restaurantId,
      tableNumber: order.tableNumber
    },
    description: `Order ${order.orderNumber} at ${order.restaurant.name}`,
    receipt_email: order.customerInfo.email,
    automatic_payment_methods: {
      enabled: true
    }
  });
}
```

### 10.2 Third-Party Service Integration

#### 10.2.1 SMS Service (Twilio)

```typescript
interface TwilioIntegration {
  config: {
    accountSid: string;
    authToken: string;
    phoneNumber: string;
    messagingServiceSid: string;
  };
  
  templates: {
    orderConfirmation: {
      body: 'Your order {{orderNumber}} has been confirmed! Track it here: {{trackingUrl}}',
      type: 'transactional'
    };
    orderReady: {
      body: 'Good news! Your order {{orderNumber}} is ready for pickup.',
      type: 'transactional'
    };
    promotions: {
      body: '{{restaurantName}} special offer: {{offerDetails}}. Show this SMS to redeem.',
      type: 'promotional',
      requiresOptIn: true
    };
  };
  
  rateLimits: {
    perPhoneNumber: {
      hourly: 10,
      daily: 50
    };
    total: {
      hourly: 1000,
      daily: 10000
    };
  };
}
```

#### 10.2.2 Email Service (SendGrid)

```typescript
interface SendGridIntegration {
  config: {
    apiKey: string;
    fromEmail: 'noreply@urdhero.al';
    fromName: 'Urdhëro';
    sandboxMode: false;
  };
  
  templates: {
    welcome: 'd-welcome-template-id';
    orderConfirmation: 'd-order-confirmation-id';
    receipt: 'd-receipt-template-id';
    passwordReset: 'd-password-reset-id';
    restaurantOnboarding: 'd-restaurant-onboarding-id';
  };
  
  dynamicData: {
    orderConfirmation: {
      customerName: string;
      orderNumber: string;
      restaurantName: string;
      items: OrderItem[];
      total: string;
      estimatedTime: string;
      trackingUrl: string;
    };
  };
}
```

### 10.3 Analytics Integration

#### 10.3.1 Google Analytics 4

```typescript
interface GA4Integration {
  measurementId: string;
  
  events: {
    // E-commerce events
    viewItem: {
      currency: string;
      value: number;
      items: GAItem[];
    };
    addToCart: {
      currency: string;
      value: number;
      items: GAItem[];
    };
    beginCheckout: {
      currency: string;
      value: number;
      items: GAItem[];
    };
    purchase: {
      transactionId: string;
      value: number;
      currency: string;
      items: GAItem[];
      restaurantName: string;
    };
    
    // Custom events
    qrCodeScanned: {
      restaurantId: string;
      tableNumber: string;
      source: string;
    };
    menuViewed: {
      restaurantId: string;
      viewDuration: number;
    };
    searchPerformed: {
      searchTerm: string;
      resultsCount: number;
    };
  };
  
  userProperties: {
    userType: 'guest' | 'registered';
    loyaltyTier?: string;
    preferredLanguage: string;
    totalOrders: number;
  };
}
```

## 11. QUALITY ASSURANCE REQUIREMENTS

### 11.1 Testing Strategy

#### 11.1.1 Test Coverage Requirements

```typescript
interface TestCoverage {
  unit: {
    target: 80, // percentage
    critical: 90, // for critical paths
    exclude: ['*.spec.ts', '*.test.ts', 'mock/*']
  };
  
  integration: {
    target: 70,
    apis: 100,
    database: 90,
    external: 80
  };
  
  e2e: {
    criticalPaths: [
      'customer-ordering-flow',
      'restaurant-order-management',
      'payment-processing',
      'user-authentication'
    ];
    browsers: ['Chrome', 'Safari', 'Firefox', 'Edge'];
    devices: ['iPhone 12', 'Samsung Galaxy S21', 'iPad', 'Desktop'];
  };
}
```

#### 11.1.2 Testing Tools

```javascript
// Frontend Testing Stack
{
  "unit": "Vitest + React Testing Library",
  "integration": "Vitest + MSW (Mock Service Worker)",
  "e2e": "Playwright",
  "performance": "Lighthouse CI",
  "accessibility": "axe-core + Pa11y",
  "visual": "Percy or Chromatic"
}

// Backend Testing Stack
{
  "unit": "Jest + Supertest",
  "integration": "Jest + Firebase Emulators",
  "load": "k6 or Artillery",
  "security": "OWASP ZAP + Snyk"
}
```

### 11.2 Quality Gates

#### 11.2.1 Pre-Deployment Checklist

```yaml
quality_gates:
  code_quality:
    - linting_errors: 0
    - typescript_errors: 0
    - console_statements: 0
    - todo_comments: 0
    
  testing:
    - unit_tests_passing: 100%
    - integration_tests_passing: 100%
    - e2e_tests_passing: 100%
    - code_coverage: ">= 80%"
    
  performance:
    - lighthouse_score: ">= 90"
    - bundle_size: "< 1MB"
    - first_load_time: "< 3s"
    - api_response_time: "< 500ms"
    
  security:
    - dependency_vulnerabilities: 0
    - security_headers: "A+"
    - ssl_rating: "A+"
    - penetration_test: "passed"
    
  documentation:
    - api_documentation: "complete"
    - deployment_guide: "updated"
    - runbook: "reviewed"
```

### 11.3 Performance Testing

#### 11.3.1 Load Testing Scenarios

```typescript
interface LoadTestScenarios {
  normal: {
    virtualUsers: 1000,
    duration: '30m',
    rampUp: '5m',
    scenario: 'mixed-user-behavior'
  };
  
  peak: {
    virtualUsers: 5000,
    duration: '1h',
    rampUp: '10m',
    scenario: 'lunch-rush'
  };
  
  stress: {
    virtualUsers: 10000,
    duration: '30m',
    rampUp: '15m',
    scenario: 'black-friday'
  };
  
  scenarios: {
    'mixed-user-behavior': {
      'browse-menu': 40,
      'place-order': 30,
      'track-order': 20,
      'idle': 10
    };
    'lunch-rush': {
      'place-order': 70,
      'track-order': 20,
      'browse-menu': 10
    };
  };
}
```

## 12. DEPLOYMENT AND DEVOPS

### 12.1 CI/CD Pipeline

#### 12.1.1 GitHub Actions Workflow

```yaml
name: Production Deployment

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '18'
  FIREBASE_PROJECT_PROD: 'urdhero-prod'
  FIREBASE_PROJECT_STAGING: 'urdhero-staging'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linting
        run: npm run lint
      
      - name: Type checking
        run: npm run type-check
      
      - name: Run unit tests
        run: npm run test:unit -- --coverage
      
      - name: Run integration tests
        run: npm run test:integration
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run build
        env:
          VITE_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
          VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.FIREBASE_AUTH_DOMAIN }}
          VITE_FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-artifacts
          path: dist/

  deploy-staging:
    needs: build
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build-artifacts
          path: dist/
      
      - name: Deploy to Firebase Staging
        uses: w9jds/firebase-action@master
        with:
          args: deploy --only hosting
        env:
          FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
          PROJECT_ID: ${{ env.FIREBASE_PROJECT_STAGING }}

  deploy-production:
    needs: build
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build-artifacts
          path: dist/
      
      - name: Deploy to Firebase Production
        uses: w9jds/firebase-action@master
        with:
          args: deploy --only hosting,functions,firestore:rules
        env:
          FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
          PROJECT_ID: ${{ env.FIREBASE_PROJECT_PROD }}
      
      - name: Create Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: v${{ github.run_number }}
          release_name: Release v${{ github.run_number }}
          draft: false
          prerelease: false
```

### 12.2 Infrastructure Requirements

#### 12.2.1 Firebase Configuration

```javascript
// firebase.json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(jpg|jpeg|gif|png|webp|svg)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      },
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      },
      {
        "source": "**",
        "headers": [
          {
            "key": "X-Frame-Options",
            "value": "SAMEORIGIN"
          },
          {
            "key": "X-Content-Type-Options",
            "value": "nosniff"
          },
          {
            "key": "X-XSS-Protection",
            "value": "1; mode=block"
          },
          {
            "key": "Referrer-Policy",
            "value": "strict-origin-when-cross-origin"
          }
        ]
      }
    ]
  },
  "functions": {
    "runtime": "nodejs18",
    "source": "functions",
    "predeploy": [
      "npm --prefix \"$RESOURCE_DIR\" run lint",
      "npm --prefix \"$RESOURCE_DIR\" run build"
    ]
  },
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "storage": {
    "rules": "storage.rules"
  },
  "emulators": {
    "auth": {
      "port": 9099
    },
    "functions": {
      "port": 5001
    },
    "firestore": {
      "port": 8080
    },
    "hosting": {
      "port": 5000
    },
    "storage": {
      "port": 9199
    },
    "ui": {
      "enabled": true
    }
  }
}
```

#### 12.2.2 Environment Configuration

```typescript
// Environment configurations
interface EnvironmentConfig {
  development: {
    firebase: {
      projectId: 'urdhero-dev';
      emulators: true;
    };
    features: {
      debugMode: true;
      mockPayments: true;
      analyticsEnabled: false;
    };
  };
  
  staging: {
    firebase: {
      projectId: 'urdhero-staging';
      emulators: false;
    };
    features: {
      debugMode: true;
      mockPayments: true;
      analyticsEnabled: true;
    };
  };
  
  production: {
    firebase: {
      projectId: 'urdhero-prod';
      emulators: false;
    };
    features: {
      debugMode: false;
      mockPayments: false;
      analyticsEnabled: true;
    };
  };
}
```

## 13. ANALYTICS AND MONITORING

### 13.1 Business Metrics

#### 13.1.1 Key Performance Indicators

```typescript
interface BusinessKPIs {
  acquisition: {
    newUsers: {
      daily: number;
      weekly: number;
      monthly: number;
      source: {
        organic: number;
        qrCode: number;
        referral: number;
        paid: number;
      };
    };
    restaurantSignups: {
      total: number;
      activated: number;
      churnRate: number;
    };
  };
  
  engagement: {
    dau: number; // Daily Active Users
    mau: number; // Monthly Active Users
    dauMauRatio: number;
    sessionDuration: number; // minutes
    ordersPerUser: number;
    repeatOrderRate: number;
  };
  
  revenue: {
    gmv: number; // Gross Merchandise Value
    averageOrderValue: number;
    revenuePerUser: number;
    platformCommission: number;
    subscriptionRevenue: number;
  };
  
  operational: {
    orderCompletionRate: number;
    averagePreparationTime: number;
    customerSatisfaction: number;
    supportTickets: number;
    platformUptime: number;
  };
}
```

#### 13.1.2 Analytics Dashboard

```typescript
interface AnalyticsDashboard {
  realTime: {
    activeUsers: number;
    activeOrders: number;
    ordersPerMinute: number;
    revenueToday: number;
  };
  
  trends: {
    userGrowth: TrendData;
    orderVolume: TrendData;
    revenue: TrendData;
    restaurantActivity: TrendData;
  };
  
  insights: {
    peakHours: string[];
    topRestaurants: Restaurant[];
    popularItems: MenuItem[];
    customerSegments: Segment[];
  };
  
  alerts: {
    type: 'success' | 'warning' | 'error';
    metric: string;
    message: string;
    timestamp: Date;
  }[];
}
```

### 13.2 Technical Monitoring

#### 13.2.1 Application Performance Monitoring

```typescript
interface APMConfiguration {
  sentry: {
    dsn: string;
    environment: 'development' | 'staging' | 'production';
    tracesSampleRate: 0.1; // 10% of transactions
    profilesSampleRate: 0.1; // 10% of transactions
    integrations: [
      'BrowserTracing',
      'Replay',
      'HttpContext'
    ];
    
    beforeSend: (event: Event) => {
      // Filter out sensitive data
      if (event.request?.cookies) {
        delete event.request.cookies;
      }
      return event;
    };
  };
  
  customMetrics: {
    orderProcessingTime: Histogram;
    qrScanSuccessRate: Counter;
    menuLoadTime: Histogram;
    apiLatency: Histogram;
    websocketConnections: Gauge;
  };
}
```

#### 13.2.2 Infrastructure Monitoring

```yaml
# Monitoring alerts configuration
alerts:
  - name: high-error-rate
    condition: error_rate > 1%
    duration: 5m
    severity: critical
    channels: [email, slack, pagerduty]
    
  - name: slow-response-time
    condition: p95_latency > 1000ms
    duration: 10m
    severity: warning
    channels: [slack]
    
  - name: low-disk-space
    condition: disk_usage > 80%
    duration: 5m
    severity: warning
    channels: [email, slack]
    
  - name: high-memory-usage
    condition: memory_usage > 90%
    duration: 5m
    severity: critical
    channels: [email, slack, pagerduty]
    
  - name: firebase-quota-warning
    condition: firestore_reads > daily_limit * 0.8
    duration: 1m
    severity: warning
    channels: [email, slack]
```

## 14. MAINTENANCE AND SUPPORT

### 14.1 Support Channels

#### 14.1.1 Customer Support Structure

```typescript
interface SupportStructure {
  channels: {
    inApp: {
      enabled: true;
      widget: 'Intercom';
      availability: '24/7';
      languages: ['sq', 'en', 'it'];
    };
    email: {
      address: 'support@urdhero.al';
      responseTime: '< 2 hours';
      autoResponder: true;
    };
    phone: {
      number: '+355 69 XXX XXXX';
      hours: '09:00 - 18:00 CET';
      languages: ['sq', 'en'];
    };
    social: {
      facebook: '@urdheroal';
      instagram: '@urdheroal';
      responseTime: '< 4 hours';
    };
  };
  
  ticketing: {
    system: 'Zendesk';
    priorities: {
      critical: { sla: '1 hour', definition: 'System down, payment issues' },
      high: { sla: '4 hours', definition: 'Feature broken, order issues' },
      medium: { sla: '24 hours', definition: 'Minor bugs, questions' },
      low: { sla: '72 hours', definition: 'Feature requests, feedback' }
    };
    escalation: {
      l1: 'Support Agent';
      l2: 'Senior Support';
      l3: 'Engineering Team';
    };
  };
}
```

### 14.2 Maintenance Procedures

#### 14.2.1 Scheduled Maintenance

```yaml
maintenance_schedule:
  regular:
    frequency: weekly
    day: Tuesday
    time: 03:00-05:00 CET
    tasks:
      - security_patches
      - dependency_updates
      - database_optimization
      - log_rotation
      
  major:
    frequency: monthly
    window: 6_hours
    tasks:
      - infrastructure_updates
      - database_migrations
      - performance_optimization
      - backup_verification
      
  emergency:
    notification: 30_minutes
    communication:
      - in_app_banner
      - email_blast
      - social_media
      - status_page
```

#### 14.2.2 Backup and Recovery

```typescript
interface BackupStrategy {
  firestore: {
    frequency: 'daily';
    retention: 30; // days
    location: 'europe-west1';
    encryption: 'AES-256';
    verification: 'weekly';
  };
  
  storage: {
    frequency: 'weekly';
    retention: 90; // days
    replication: ['europe-west1', 'europe-west4'];
  };
  
  recovery: {
    rto: 4; // hours - Recovery Time Objective
    rpo: 1; // hour - Recovery Point Objective
    drills: 'quarterly';
    documentation: 'updated monthly';
  };
}
```

## 15. RISK MANAGEMENT

### 15.1 Technical Risks

| Risk | Probability | Impact | Mitigation Strategy |
|------|-------------|---------|-------------------|
| Firebase Vendor Lock-in | Medium | High | Abstract Firebase services behind interfaces, maintain migration plan |
| Scalability Issues | Low | High | Load testing, auto-scaling, database sharding |
| Security Breach | Low | Critical | Regular audits, penetration testing, security training |
| Data Loss | Low | Critical | Multiple backups, disaster recovery plan |
| Performance Degradation | Medium | Medium | Performance monitoring, optimization sprints |
| Third-party Service Failure | Medium | Medium | Fallback mechanisms, multiple providers |

### 15.2 Business Risks

| Risk | Probability | Impact | Mitigation Strategy |
|------|-------------|---------|-------------------|
| Slow Market Adoption | Medium | High | Pilot programs, restaurant incentives, marketing |
| Competition | High | Medium | Unique features, fast iteration, customer focus |
| Regulatory Changes | Low | High | Legal counsel, compliance monitoring |
| Seasonal Fluctuations | High | Medium | Diverse customer base, off-season features |
| Restaurant Churn | Medium | High | Success programs, regular check-ins, training |

## 16. SUCCESS CRITERIA

### 16.1 Technical Success Metrics

```typescript
interface TechnicalSuccess {
  performance: {
    uptimeTarget: 99.9; // percentage
    responseTimeP95: 500; // milliseconds
    errorRate: 0.1; // percentage
    crashRate: 0.01; // percentage
  };
  
  quality: {
    codeQualityScore: 'A'; // SonarQube
    testCoverage: 80; // percentage
    bugEscapeRate: 5; // percentage
    deploymentSuccessRate: 95; // percentage
  };
  
  scalability: {
    maxConcurrentUsers: 50000;
    databaseQueriesPerSecond: 10000;
    storageGrowthRate: '< 10GB/day';
  };
}
```

### 16.2 Business Success Metrics

```typescript
interface BusinessSuccess {
  growth: {
    monthlyActiveUsers: {
      month6: 10000;
      month12: 50000;
      month24: 200000;
    };
    restaurantPartners: {
      month6: 50;
      month12: 150;
      month24: 500;
    };
  };
  
  revenue: {
    monthlyRecurringRevenue: {
      month6: 10000; // EUR
      month12: 50000;
      month24: 200000;
    };
    averageRevenuePerUser: 5; // EUR
    customerAcquisitionCost: 2; // EUR
  };
  
  market: {
    albanianMarketShare: {
      year1: 10; // percentage
      year2: 30;
      year3: 50;
    };
  };
}
```

## 17. IMPLEMENTATION ROADMAP

### 17.1 Phase 1: MVP Launch (Months 1-3)

```yaml
phase_1_mvp:
  duration: 3_months
  budget: €100,000
  team_size: 2_developers
  
  milestones:
    month_1:
      - project_setup
      - authentication_system
      - basic_restaurant_crud
      - qr_code_generator
      
    month_2:
      - customer_ordering_flow
      - real_time_order_tracking
      - restaurant_dashboard
      - menu_management
      
    month_3:
      - payment_integration
      - testing_and_qa
      - deployment_setup
      - soft_launch
      
  deliverables:
    - functional_ordering_system
    - 5_pilot_restaurants
    - 1000_test_orders
    - feedback_collection
```

### 17.2 Phase 2: Feature Enhancement (Months 4-6)

```yaml
phase_2_enhancement:
  duration: 3_months
  budget: €150,000
  team_size: 4_developers
  
  features:
    customer_experience:
      - pwa_implementation
      - multi_language_support
      - customer_accounts
      - loyalty_program_v1
      
    restaurant_tools:
      - analytics_dashboard
      - kitchen_display_system
      - staff_management
      - basic_inventory
      
    platform:
      - performance_optimization
      - advanced_security
      - monitoring_setup
      - api_documentation
```

### 17.3 Phase 3: Scale and Optimize (Months 7-12)

```yaml
phase_3_scale:
  duration: 6_months
  budget: €250,000
  team_size: 8_developers
  
  objectives:
    scale:
      - 150_restaurants
      - 50000_mau
      - regional_expansion
      
    advanced_features:
      - ai_menu_assistant
      - advanced_analytics
      - white_label_solution
      - api_marketplace
      
    optimization:
      - performance_tuning
      - cost_optimization
      - automation_tools
      - team_expansion
```

## 18. APPENDICES

### Appendix A: Technology Stack Summary

```yaml
frontend:
  framework: React 18.3
  language: TypeScript 5.5
  styling: Tailwind CSS 3.4
  state: React Context
  build: Vite 5.0
  testing: Vitest + Playwright

backend:
  platform: Firebase
  runtime: Node.js 18
  language: TypeScript
  database: Cloud Firestore
  functions: Cloud Functions
  hosting: Firebase Hosting

integrations:
  payments: Stripe
  sms: Twilio
  email: SendGrid
  analytics: Google Analytics 4
  monitoring: Sentry
  maps: Google Maps
```

### Appendix B: Security Checklist

- [ ] HTTPS enforcement
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF tokens
- [ ] Rate limiting
- [ ] DDoS protection
- [ ] Regular security audits
- [ ] Penetration testing
- [ ] Secure password policies
- [ ] MFA for admin accounts
- [ ] API authentication
- [ ] Data encryption at rest
- [ ] Data encryption in transit
- [ ] GDPR compliance
- [ ] PCI DSS compliance
- [ ] Regular backups
- [ ] Disaster recovery plan
- [ ] Incident response plan
- [ ] Security training for team

### Appendix C: Launch Checklist

#### Pre-Launch
- [ ] All critical features tested
- [ ] Performance benchmarks met
- [ ] Security audit completed
- [ ] Legal compliance verified
- [ ] Documentation complete
- [ ] Support team trained
- [ ] Marketing materials ready
- [ ] Launch partners confirmed

#### Launch Day
- [ ] Monitoring dashboards active
- [ ] Support channels staffed
- [ ] Emergency contacts available
- [ ] Rollback plan ready
- [ ] Communication plan activated

#### Post-Launch
- [ ] User feedback collection
- [ ] Performance monitoring
- [ ] Bug tracking and fixes
- [ ] Success metrics tracking
- [ ] Stakeholder reporting

---

## DOCUMENT APPROVAL

This Product Requirements Document has been reviewed and approved by:

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Product Manager | _____________ | _____________ | _____ |
| Engineering Lead | _____________ | _____________ | _____ |
| QA Lead | _____________ | _____________ | _____ |
| Security Officer | _____________ | _____________ | _____ |

**Document Version**: 1.0  
**Last Updated**: January 2025  
**Next Review**: March 2025  

---

**END OF DOCUMENT**

This document is confidential and proprietary to Urdhëro. Distribution is limited to authorized personnel only.