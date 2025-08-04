# Urdhëro - Verification Test Plan

## Table of Contents
1. [Test Plan Overview](#test-plan-overview)
2. [Test Strategy and Approach](#test-strategy-and-approach)
3. [Test Environment Setup](#test-environment-setup)
4. [Requirements Traceability Matrix](#requirements-traceability-matrix)
5. [Functional Test Cases](#functional-test-cases)
6. [Non-Functional Test Cases](#non-functional-test-cases)
7. [Security Test Cases](#security-test-cases)
8. [Performance Test Cases](#performance-test-cases)
9. [Accessibility Test Cases](#accessibility-test-cases)
10. [Integration Test Cases](#integration-test-cases)
11. [User Acceptance Test Cases](#user-acceptance-test-cases)
12. [Test Automation Strategy](#test-automation-strategy)
13. [Test Execution Procedures](#test-execution-procedures)
14. [Test Reporting and Metrics](#test-reporting-and-metrics)
15. [Risk-Based Testing](#risk-based-testing)

---

## Test Plan Overview

### Purpose
This verification test plan ensures that all product requirements specified in the Urdhëro PRD are thoroughly tested with clear pass/fail criteria, providing confidence in the platform's quality, security, and performance before production deployment.

### Scope
- **Functional Testing**: All customer and restaurant features
- **Non-Functional Testing**: Performance, security, usability
- **Integration Testing**: External service integrations
- **Compatibility Testing**: Browser, device, and platform compatibility
- **Regression Testing**: Continuous validation of existing functionality

### Test Objectives
1. **Requirement Verification**: Validate 100% of PRD requirements
2. **Quality Assurance**: Achieve >95% defect detection rate
3. **Performance Validation**: Meet all performance benchmarks
4. **Security Validation**: Pass all security compliance requirements
5. **User Experience**: Validate usability across all user types

### Success Criteria
- **Test Coverage**: 100% of PRD requirements tested
- **Pass Rate**: >98% of test cases pass
- **Performance**: All performance targets met
- **Security**: Zero critical security vulnerabilities
- **Accessibility**: WCAG 2.1 AA compliance achieved

---

## Test Strategy and Approach

### Testing Pyramid

```
                 Manual E2E Tests
                ┌─────────────────┐
               │  Exploratory    │
              │   User Journey   │
             └─────────────────────┘
            
           Automated E2E Tests
          ┌───────────────────────┐
         │   Critical User Flows  │
        │    Cross-browser Tests  │
       └─────────────────────────────┘
       
      Integration Tests
     ┌─────────────────────────┐
    │   API Integration Tests  │
   │   Database Tests         │
  │    External Service Tests │
 └───────────────────────────────┘

Unit Tests
┌─────────────────────────────────┐
│        Component Tests          │
│        Function Tests           │
│        Hook Tests              │
│        Utility Tests           │
└─────────────────────────────────┘
```

### Test Types and Coverage

#### 1. Unit Testing (70% of test effort)
- **Framework**: Vitest + React Testing Library
- **Coverage Target**: 80% code coverage
- **Scope**: Individual components, functions, hooks
- **Automation**: 100% automated

#### 2. Integration Testing (20% of test effort)
- **Framework**: Vitest + Firebase Test SDK
- **Scope**: API endpoints, database operations, service integrations
- **Automation**: 100% automated

#### 3. End-to-End Testing (8% of test effort)
- **Framework**: Playwright
- **Scope**: Critical user journeys, cross-browser compatibility
- **Automation**: 80% automated, 20% manual

#### 4. Manual Testing (2% of test effort)
- **Scope**: Exploratory testing, usability validation, edge cases
- **Focus**: User experience, accessibility, visual validation

### Test Environment Strategy

#### Environment Tiers
```typescript
interface TestEnvironments {
  development: {
    purpose: 'Developer testing and debugging';
    firebase: 'emulators';
    stripe: 'test-mode';
    dataReset: 'automatic';
  };
  staging: {
    purpose: 'Integration and UAT testing';
    firebase: 'staging-project';
    stripe: 'test-mode';
    dataReset: 'manual';
  };
  production: {
    purpose: 'Production monitoring and hotfix validation';
    firebase: 'production-project';
    stripe: 'live-mode';
    dataReset: 'never';
  };
}
```

---

## Test Environment Setup

### Environment Configuration

#### Development Environment
```bash
# Environment Variables
VITE_FIREBASE_EMULATORS_ENABLED=true
VITE_FIREBASE_PROJECT_ID=urdhero-dev
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_TEST_MODE=true

# Firebase Emulators
firebase emulators:start --only auth,firestore,functions,storage
```

#### Test Data Management
```typescript
interface TestDataSets {
  customerData: {
    newCustomer: CustomerProfile;
    regularCustomer: CustomerProfile;
    vipCustomer: CustomerProfile;
    guestCustomer: null;
  };
  restaurantData: {
    activeRestaurant: Restaurant;
    inactiveRestaurant: Restaurant;
    multiLocationRestaurant: Restaurant;
  };
  menuData: {
    fullMenu: MenuItem[];
    emptyMenu: MenuItem[];
    seasonalMenu: MenuItem[];
  };
  orderData: {
    simpleOrder: Order;
    complexOrder: Order;
    cancelledOrder: Order;
  };
}
```

### Browser and Device Matrix

#### Supported Browsers
```typescript
interface BrowserMatrix {
  desktop: {
    chrome: ['latest', 'latest-1'];
    firefox: ['latest', 'latest-1'];
    safari: ['latest', 'latest-1'];
    edge: ['latest', 'latest-1'];
  };
  mobile: {
    iosSafari: ['15.0+'];
    androidChrome: ['90.0+'];
    samsungInternet: ['latest'];
  };
}
```

#### Device Testing Matrix
```typescript
interface DeviceMatrix {
  mobile: {
    iPhone: ['13', '14', '15'];
    android: ['Galaxy S21', 'Pixel 6', 'OnePlus 9'];
  };
  tablet: {
    iPad: ['Air', 'Pro'];
    androidTablet: ['Galaxy Tab S7'];
  };
  desktop: {
    resolutions: ['1920x1080', '1440x900', '1366x768'];
    os: ['Windows 10', 'macOS', 'Ubuntu'];
  };
}
```

---

## Requirements Traceability Matrix

### Functional Requirements to Test Cases Mapping

| Requirement ID | Feature | Test Case ID | Test Type | Priority |
|---------------|---------|--------------|-----------|----------|
| CX-001 | QR Code Scanning | TC-QR-001 to TC-QR-015 | Unit, Integration, E2E | P0 |
| CX-002 | PWA Implementation | TC-PWA-001 to TC-PWA-012 | Integration, E2E | P0 |
| CX-003 | Multi-Language | TC-I18N-001 to TC-I18N-008 | Unit, Integration | P1 |
| CX-004 | Order Tracking | TC-OT-001 to TC-OT-010 | Unit, Integration, E2E | P0 |
| CX-005 | Loyalty Program | TC-LP-001 to TC-LP-020 | Unit, Integration, E2E | P2 |
| RM-001 | Order Management | TC-OM-001 to TC-OM-025 | Unit, Integration, E2E | P0 |
| RM-002 | Menu Management | TC-MM-001 to TC-MM-030 | Unit, Integration, E2E | P0 |
| RM-003 | Kitchen Display | TC-KD-001 to TC-KD-015 | Integration, E2E | P0 |
| RM-004 | QR Management | TC-QM-001 to TC-QM-012 | Unit, Integration | P1 |
| RM-005 | Analytics | TC-AN-001 to TC-AN-025 | Unit, Integration | P1 |
| AF-001 | AI Assistant | TC-AI-001 to TC-AI-015 | Integration, E2E | P2 |
| AF-002 | Inventory | TC-INV-001 to TC-INV-030 | Unit, Integration | P3 |
| PF-001 | Authentication | TC-AUTH-001 to TC-AUTH-020 | Unit, Integration, Security | P0 |
| PF-002 | Payments | TC-PAY-001 to TC-PAY-025 | Integration, Security | P0 |
| PF-003 | Performance | TC-PERF-001 to TC-PERF-015 | Performance | P2 |

---

## Functional Test Cases

### Customer Experience - QR Code Scanning (CX-001)

#### TC-QR-001: QR Code Scanner Initialization
**Requirement**: QR scanner opens within 2 seconds of user request
**Test Type**: Integration Test
**Priority**: P0

**Test Steps**:
1. Navigate to home page
2. Click "Scan QR Code" button
3. Measure time from click to camera activation

**Test Data**:
- Device with camera access
- Valid browser permissions

**Pass Criteria**:
- ✅ Scanner opens within 2000ms
- ✅ Camera preview displays correctly
- ✅ Scanner overlay appears with scanning indicators

**Fail Criteria**:
- ❌ Scanner takes >2000ms to open
- ❌ Camera fails to initialize
- ❌ Error messages displayed

```typescript
// Automated Test Implementation
describe('QR Scanner Initialization', () => {
  it('should open scanner within 2 seconds', async () => {
    const startTime = Date.now();
    await page.click('[data-testid="qr-scanner-button"]');
    await page.waitForSelector('[data-testid="qr-scanner-camera"]');
    const endTime = Date.now();
    
    expect(endTime - startTime).toBeLessThan(2000);
  });
});
```

#### TC-QR-002: QR Code Format Support
**Requirement**: Support URL, JSON, and custom QR code formats
**Test Type**: Unit Test
**Priority**: P0

**Test Steps**:
1. Test URL format: `https://urdhero.al/qr-landing?r=restaurant&t=table`
2. Test JSON format: `{"restaurant": "beach-bar", "table": "A15"}`
3. Test custom format: `restaurant:table`

**Test Data**:
```typescript
const testQRCodes = {
  validURL: 'https://urdhero.al/qr-landing?r=beach-bar-durres&t=A15',
  validJSON: '{"restaurant": "beach-bar-durres", "table": "A15"}',
  validCustom: 'beach-bar-durres:A15',
  invalidFormat: 'invalid-qr-data'
};
```

**Pass Criteria**:
- ✅ All valid formats parsed correctly
- ✅ Restaurant slug extracted: "beach-bar-durres"
- ✅ Table code extracted: "A15"
- ✅ isValid flag set to true

**Fail Criteria**:
- ❌ Valid formats fail to parse
- ❌ Incorrect data extraction
- ❌ Invalid format doesn't return error

```typescript
// Automated Test Implementation
describe('QR Code Format Support', () => {
  it('should parse all valid QR formats', () => {
    Object.values(testQRCodes).forEach(qrData => {
      if (qrData !== testQRCodes.invalidFormat) {
        const result = parseQRCode(qrData);
        expect(result.isValid).toBe(true);
        expect(result.restaurantSlug).toBe('beach-bar-durres');
        expect(result.tableCode).toBe('A15');
      }
    });
  });
});
```

#### TC-QR-003: Invalid QR Code Handling
**Requirement**: Show appropriate error messages for invalid QR codes
**Test Type**: Integration Test
**Priority**: P0

**Test Steps**:
1. Scan invalid QR code
2. Verify error message display
3. Verify user can retry scanning

**Test Data**:
- Invalid QR codes: random text, malformed URLs, expired codes

**Pass Criteria**:
- ✅ Clear error message displayed
- ✅ User can retry scanning
- ✅ No application crash

**Fail Criteria**:
- ❌ No error message or unclear message
- ❌ Scanner becomes unresponsive
- ❌ Application crashes

### Customer Experience - Menu Browsing (CX-004)

#### TC-MENU-001: Menu Loading Performance
**Requirement**: Menu displays within 1 second
**Test Type**: Performance Test
**Priority**: P0

**Test Steps**:
1. Navigate to menu page from QR landing
2. Measure time from navigation to menu display
3. Verify all menu items loaded

**Test Data**:
- Restaurant with 50+ menu items
- High-resolution images
- 3G network simulation

**Pass Criteria**:
- ✅ Menu displays within 1000ms
- ✅ All menu items visible
- ✅ Images load progressively

**Fail Criteria**:
- ❌ Menu takes >1000ms to display
- ❌ Menu items missing or incomplete
- ❌ Layout broken during loading

```typescript
// Performance Test Implementation
describe('Menu Loading Performance', () => {
  it('should load menu within 1 second', async () => {
    await page.goto('/menu?r=beach-bar-durres&t=A15');
    const startTime = Date.now();
    
    await page.waitForSelector('[data-testid="menu-item-card"]');
    const endTime = Date.now();
    
    expect(endTime - startTime).toBeLessThan(1000);
    
    const menuItems = await page.$$('[data-testid="menu-item-card"]');
    expect(menuItems.length).toBeGreaterThan(0);
  });
});
```

#### TC-MENU-002: Search Functionality
**Requirement**: Real-time search with instant results
**Test Type**: Integration Test
**Priority**: P0

**Test Steps**:
1. Enter search term in menu search box
2. Verify results update in real-time
3. Test various search terms and filters

**Test Data**:
```typescript
const searchTestCases = [
  { query: 'pizza', expectedResults: ['Pizza Margherita'] },
  { query: 'aperol', expectedResults: ['Aperol Spritz'] },
  { query: 'vegan', expectedResults: ['Vegan Burger'] },
  { query: 'nonexistent', expectedResults: [] }
];
```

**Pass Criteria**:
- ✅ Search results appear within 300ms
- ✅ Results match search criteria
- ✅ Empty state handled correctly
- ✅ Search works across name, description, category

**Fail Criteria**:
- ❌ Search takes >300ms to respond
- ❌ Incorrect or missing results
- ❌ Search doesn't work for some fields

```typescript
// Automated Test Implementation
describe('Menu Search Functionality', () => {
  searchTestCases.forEach(({ query, expectedResults }) => {
    it(`should return correct results for "${query}"`, async () => {
      const startTime = Date.now();
      
      await page.fill('[data-testid="menu-search"]', query);
      await page.waitForSelector('[data-testid="search-results"]');
      
      const endTime = Date.now();
      expect(endTime - startTime).toBeLessThan(300);
      
      const results = await page.$$eval(
        '[data-testid="menu-item-card"] h3',
        elements => elements.map(el => el.textContent)
      );
      
      expectedResults.forEach(expected => {
        expect(results).toContain(expected);
      });
    });
  });
});
```

#### TC-MENU-003: Add to Cart Functionality
**Requirement**: One-click add to cart with visual feedback
**Test Type**: Integration Test
**Priority**: P0

**Test Steps**:
1. Click "Add" button on menu item
2. Verify item added to cart
3. Verify visual feedback (animation, badge update)
4. Verify cart quantity updates

**Test Data**:
- Available menu items
- Unavailable menu items
- Items with special instructions

**Pass Criteria**:
- ✅ Item added to cart within 200ms
- ✅ Success toast notification appears
- ✅ Cart badge updates with correct count
- ✅ Button shows quantity controls after adding

**Fail Criteria**:
- ❌ Item not added to cart
- ❌ No visual feedback
- ❌ Cart count incorrect

```typescript
// Automated Test Implementation
describe('Add to Cart Functionality', () => {
  it('should add item to cart with proper feedback', async () => {
    const initialCartCount = await getCartCount(page);
    
    const startTime = Date.now();
    await page.click('[data-testid="add-to-cart-button"]');
    
    // Wait for success toast
    await page.waitForSelector('.toast-success', { timeout: 500 });
    const endTime = Date.now();
    
    expect(endTime - startTime).toBeLessThan(200);
    
    const newCartCount = await getCartCount(page);
    expect(newCartCount).toBe(initialCartCount + 1);
    
    // Verify cart badge updates
    const cartBadge = await page.textContent('[data-testid="cart-badge"]');
    expect(cartBadge).toBe(newCartCount.toString());
  });
});
```

### Customer Experience - Shopping Cart (CX-006)

#### TC-CART-001: Cart Persistence
**Requirement**: Cart persists across browser sessions
**Test Type**: Integration Test
**Priority**: P0

**Test Steps**:
1. Add items to cart
2. Close browser/refresh page
3. Verify cart contents preserved

**Test Data**:
- Multiple menu items with different quantities
- Items with special instructions

**Pass Criteria**:
- ✅ All cart items preserved after refresh
- ✅ Quantities maintained correctly
- ✅ Special instructions preserved
- ✅ Total price calculated correctly

**Fail Criteria**:
- ❌ Cart items lost after refresh
- ❌ Quantities or prices incorrect
- ❌ Special instructions lost

```typescript
// Automated Test Implementation
describe('Cart Persistence', () => {
  it('should preserve cart across browser sessions', async () => {
    // Add items to cart
    await page.click('[data-testid="add-to-cart-button"]');
    const cartItems = await getCartItems(page);
    
    // Refresh page
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Verify cart contents
    const persistedItems = await getCartItems(page);
    expect(persistedItems).toEqual(cartItems);
  });
});
```

#### TC-CART-002: Quantity Management
**Requirement**: Smooth quantity adjustment with real-time price updates
**Test Type**: Integration Test
**Priority**: P0

**Test Steps**:
1. Adjust item quantity using +/- buttons
2. Verify price updates in real-time
3. Test quantity limits (min 1, max reasonable)

**Test Data**:
- Cart with various items
- Different price points

**Pass Criteria**:
- ✅ Quantity changes reflected immediately
- ✅ Item total price updates correctly
- ✅ Cart total updates correctly
- ✅ Minimum quantity 1 enforced

**Fail Criteria**:
- ❌ Quantity changes not reflected
- ❌ Price calculations incorrect
- ❌ Can set quantity to 0 or negative

### Customer Experience - Order Submission (CX-007)

#### TC-ORDER-001: Order Submission Process
**Requirement**: Order submission completes within 3 seconds
**Test Type**: Integration Test
**Priority**: P0

**Test Steps**:
1. Fill cart with items
2. Add special instructions
3. Select payment method
4. Submit order
5. Measure submission time

**Test Data**:
- Valid cart with multiple items
- Various payment methods
- Special instructions

**Pass Criteria**:
- ✅ Order submits within 3000ms
- ✅ Order number generated and displayed
- ✅ Redirect to tracking page occurs
- ✅ Cart cleared after successful submission

**Fail Criteria**:
- ❌ Order submission takes >3000ms
- ❌ Submission fails without clear error
- ❌ Cart not cleared after submission

```typescript
// Automated Test Implementation
describe('Order Submission Process', () => {
  it('should submit order within 3 seconds', async () => {
    await addItemsToCart(page);
    await page.fill('[data-testid="special-instructions"]', 'Test instructions');
    await page.selectOption('[data-testid="payment-method"]', 'cash');
    
    const startTime = Date.now();
    await page.click('[data-testid="submit-order-button"]');
    
    await page.waitForURL(/\/order\/\w+/);
    const endTime = Date.now();
    
    expect(endTime - startTime).toBeLessThan(3000);
    
    // Verify order number displayed
    const orderNumber = await page.textContent('[data-testid="order-number"]');
    expect(orderNumber).toMatch(/^UR-\d+$/);
  });
});
```

#### TC-ORDER-002: Order Validation
**Requirement**: Validate order data before submission
**Test Type**: Unit Test
**Priority**: P0

**Test Steps**:
1. Test empty cart submission
2. Test invalid payment method
3. Test missing required fields
4. Test valid order submission

**Test Data**:
```typescript
const orderValidationTests = [
  {
    description: 'empty cart',
    data: { items: [], paymentMethod: 'cash' },
    shouldPass: false,
    expectedError: 'Cart cannot be empty'
  },
  {
    description: 'invalid payment method',
    data: { items: [validItem], paymentMethod: 'invalid' },
    shouldPass: false,
    expectedError: 'Invalid payment method'
  },
  {
    description: 'valid order',
    data: { items: [validItem], paymentMethod: 'cash' },
    shouldPass: true
  }
];
```

**Pass Criteria**:
- ✅ Empty cart rejected with clear message
- ✅ Invalid payment methods rejected
- ✅ Valid orders accepted
- ✅ Error messages user-friendly

**Fail Criteria**:
- ❌ Invalid orders accepted
- ❌ Valid orders rejected
- ❌ Error messages unclear or missing

### Customer Experience - Real-Time Order Tracking (CX-004)

#### TC-TRACK-001: Order Status Updates
**Requirement**: Real-time order status updates within 1 second
**Test Type**: Integration Test
**Priority**: P0

**Test Steps**:
1. Place order and navigate to tracking page
2. Update order status from restaurant dashboard
3. Measure time for status to appear on tracking page
4. Verify visual progress indicators update

**Test Data**:
- Order in various status states
- Multiple concurrent order updates

**Pass Criteria**:
- ✅ Status updates appear within 1000ms
- ✅ Progress bar updates correctly
- ✅ Visual indicators change appropriately
- ✅ Estimated time updates

**Fail Criteria**:
- ❌ Status updates take >1000ms
- ❌ Visual indicators don't update
- ❌ Progress bar shows incorrect status

```typescript
// Real-time Test Implementation
describe('Order Status Updates', () => {
  it('should update status in real-time', async () => {
    const orderNumber = await createTestOrder();
    
    // Open tracking page
    await page.goto(`/order/${orderNumber}`);
    await page.waitForSelector('[data-testid="order-status"]');
    
    // Update status from another session (simulating restaurant)
    const startTime = Date.now();
    await updateOrderStatus(orderNumber, 'preparing');
    
    // Wait for status update on tracking page
    await page.waitForSelector('[data-testid="status-preparing"]');
    const endTime = Date.now();
    
    expect(endTime - startTime).toBeLessThan(1000);
  });
});
```

#### TC-TRACK-002: Order Progress Visualization
**Requirement**: Clear visual progress indicators for order stages
**Test Type**: Integration Test
**Priority**: P0

**Test Steps**:
1. Navigate to order tracking page
2. Verify all order stages displayed
3. Verify current stage highlighted
4. Verify completed stages marked as done

**Test Data**:
- Orders in different status states

**Pass Criteria**:
- ✅ All order stages visible
- ✅ Current stage clearly highlighted
- ✅ Completed stages marked with checkmarks
- ✅ Progress bar percentage accurate

**Fail Criteria**:
- ❌ Order stages unclear or missing
- ❌ Current stage not highlighted
- ❌ Progress indicators confusing

### Restaurant Management - Order Dashboard (RM-001)

#### TC-DASHBOARD-001: Real-Time Order Display
**Requirement**: Orders update in real-time without refresh
**Test Type**: Integration Test
**Priority**: P0

**Test Steps**:
1. Open restaurant dashboard
2. Place new order from customer app
3. Verify order appears on dashboard immediately
4. Update order status
5. Verify changes reflect immediately

**Test Data**:
- Active restaurant account
- Multiple test orders

**Pass Criteria**:
- ✅ New orders appear within 2 seconds
- ✅ Status changes reflect immediately
- ✅ Order details accurate
- ✅ No manual refresh required

**Fail Criteria**:
- ❌ Orders don't appear automatically
- ❌ Status changes delayed >2 seconds
- ❌ Requires manual refresh

```typescript
// Real-time Dashboard Test
describe('Restaurant Dashboard Real-time Updates', () => {
  it('should show new orders immediately', async () => {
    // Open dashboard in one session
    const dashboardPage = await browser.newPage();
    await dashboardPage.goto('/restaurant/dashboard');
    
    // Place order in another session
    const customerPage = await browser.newPage();
    const orderNumber = await placeTestOrder(customerPage);
    
    // Verify order appears on dashboard
    await dashboardPage.waitForSelector(
      `[data-testid="order-${orderNumber}"]`,
      { timeout: 3000 }
    );
    
    const orderElement = await dashboardPage.$(
      `[data-testid="order-${orderNumber}"]`
    );
    expect(orderElement).toBeTruthy();
  });
});
```

#### TC-DASHBOARD-002: Order Status Management
**Requirement**: One-click status updates with immediate feedback
**Test Type**: Integration Test
**Priority**: P0

**Test Steps**:
1. Click status update button (Accept, Preparing, Ready, Served)
2. Verify status updates immediately
3. Verify customer tracking page reflects change
4. Test all status transitions

**Test Data**:
- Orders in different status states
- Invalid status transitions

**Pass Criteria**:
- ✅ Status updates within 500ms
- ✅ UI feedback immediate
- ✅ Customer tracking updates
- ✅ Invalid transitions prevented

**Fail Criteria**:
- ❌ Status updates delayed or fail
- ❌ No UI feedback
- ❌ Customer tracking not updated

### Restaurant Management - Menu Management (RM-002)

#### TC-MENU-MGT-001: Menu Item Creation
**Requirement**: Create menu item in under 30 seconds
**Test Type**: Integration Test
**Priority**: P0

**Test Steps**:
1. Navigate to menu management
2. Click "Add Menu Item"
3. Fill required fields (name, price, category)
4. Upload image (optional)
5. Save menu item
6. Verify item appears in menu

**Test Data**:
```typescript
const menuItemTestData = {
  name: 'Test Dish',
  description: 'Test description',
  price: 12.50,
  category: 'Main Course',
  vegetarian: true,
  preparationTime: 15
};
```

**Pass Criteria**:
- ✅ Menu item created within 30 seconds
- ✅ All data saved correctly
- ✅ Item appears in customer menu immediately
- ✅ Image upload works (if provided)

**Fail Criteria**:
- ❌ Creation takes >30 seconds
- ❌ Data not saved correctly
- ❌ Item doesn't appear in customer menu

```typescript
// Menu Item Creation Test
describe('Menu Item Creation', () => {
  it('should create menu item within 30 seconds', async () => {
    const startTime = Date.now();
    
    await page.click('[data-testid="add-menu-item"]');
    await page.fill('[data-testid="item-name"]', menuItemTestData.name);
    await page.fill('[data-testid="item-price"]', menuItemTestData.price.toString());
    await page.selectOption('[data-testid="item-category"]', menuItemTestData.category);
    await page.click('[data-testid="save-menu-item"]');
    
    await page.waitForSelector('[data-testid="menu-item-saved"]');
    const endTime = Date.now();
    
    expect(endTime - startTime).toBeLessThan(30000);
    
    // Verify item appears in menu
    const menuItems = await page.$$eval(
      '[data-testid="menu-item"]',
      elements => elements.map(el => el.textContent)
    );
    expect(menuItems).toContain(menuItemTestData.name);
  });
});
```

#### TC-MENU-MGT-002: Menu Item Availability Toggle
**Requirement**: Quick toggle for item availability with immediate effect
**Test Type**: Integration Test
**Priority**: P0

**Test Steps**:
1. Navigate to menu management
2. Toggle availability switch for menu item
3. Verify customer menu reflects change immediately
4. Verify unavailable items cannot be ordered

**Test Data**:
- Available menu items
- Customer session with menu open

**Pass Criteria**:
- ✅ Availability toggle responds immediately
- ✅ Customer menu updates within 2 seconds
- ✅ Unavailable items show as unavailable
- ✅ Add to cart disabled for unavailable items

**Fail Criteria**:
- ❌ Toggle doesn't respond
- ❌ Customer menu doesn't update
- ❌ Can still order unavailable items

### Authentication and Authorization (PF-001)

#### TC-AUTH-001: Customer Registration
**Requirement**: Customer registration completes within 60 seconds
**Test Type**: Integration Test
**Priority**: P0

**Test Steps**:
1. Click "Create Account"
2. Fill registration form
3. Submit registration
4. Verify account created and user logged in

**Test Data**:
```typescript
const registrationTestData = {
  email: 'test@example.com',
  password: 'SecurePass123!',
  name: 'Test User',
  phone: '+355691234567'
};
```

**Pass Criteria**:
- ✅ Registration completes within 60 seconds
- ✅ User automatically logged in
- ✅ Profile data saved correctly
- ✅ Email verification sent (if enabled)

**Fail Criteria**:
- ❌ Registration takes >60 seconds
- ❌ User not logged in after registration
- ❌ Data not saved correctly

```typescript
// Registration Test Implementation
describe('Customer Registration', () => {
  it('should complete registration within 60 seconds', async () => {
    const startTime = Date.now();
    
    await page.click('[data-testid="create-account-button"]');
    await page.fill('[data-testid="registration-email"]', registrationTestData.email);
    await page.fill('[data-testid="registration-password"]', registrationTestData.password);
    await page.fill('[data-testid="registration-name"]', registrationTestData.name);
    await page.click('[data-testid="submit-registration"]');
    
    await page.waitForSelector('[data-testid="user-profile"]');
    const endTime = Date.now();
    
    expect(endTime - startTime).toBeLessThan(60000);
    
    // Verify user logged in
    const userName = await page.textContent('[data-testid="user-name"]');
    expect(userName).toBe(registrationTestData.name);
  });
});
```

#### TC-AUTH-002: Restaurant Staff Authentication
**Requirement**: Role-based access control for restaurant staff
**Test Type**: Security Test
**Priority**: P0

**Test Steps**:
1. Login with different staff roles (admin, manager, staff, kitchen)
2. Verify access to appropriate features
3. Verify restricted access to unauthorized features
4. Test session timeout

**Test Data**:
```typescript
const staffRoles = [
  {
    role: 'admin',
    email: 'admin@restaurant.com',
    allowedPages: ['/dashboard', '/menu', '/analytics', '/settings'],
    restrictedPages: []
  },
  {
    role: 'staff',
    email: 'staff@restaurant.com',
    allowedPages: ['/dashboard', '/orders'],
    restrictedPages: ['/analytics', '/settings']
  },
  {
    role: 'kitchen',
    email: 'kitchen@restaurant.com',
    allowedPages: ['/kitchen'],
    restrictedPages: ['/analytics', '/settings', '/menu']
  }
];
```

**Pass Criteria**:
- ✅ Each role accesses only authorized features
- ✅ Unauthorized access blocked with appropriate message
- ✅ Session timeout enforced
- ✅ Login successful within 5 seconds

**Fail Criteria**:
- ❌ Unauthorized access allowed
- ❌ Authorized access blocked
- ❌ Session timeout not enforced

### Payment Processing (PF-002)

#### TC-PAY-001: Payment Method Selection
**Requirement**: Support multiple payment methods with appropriate validation
**Test Type**: Integration Test
**Priority**: P0

**Test Steps**:
1. Test cash payment selection
2. Test card payment with minimum order validation
3. Test digital payment availability
4. Verify payment method restrictions

**Test Data**:
```typescript
const paymentTestCases = [
  {
    method: 'cash',
    orderAmount: 500, // 5 EUR
    shouldPass: true
  },
  {
    method: 'card',
    orderAmount: 300, // 3 EUR (below minimum)
    shouldPass: false,
    expectedError: 'Minimum order for card: €5.00'
  },
  {
    method: 'card',
    orderAmount: 800, // 8 EUR (above minimum)
    shouldPass: true
  }
];
```

**Pass Criteria**:
- ✅ All payment methods selectable when appropriate
- ✅ Minimum order validation enforced for cards
- ✅ Payment method restrictions respected
- ✅ Clear error messages for invalid selections

**Fail Criteria**:
- ❌ Invalid payment methods allowed
- ❌ Minimum order not enforced
- ❌ Unclear error messages

```typescript
// Payment Method Test Implementation
describe('Payment Method Selection', () => {
  paymentTestCases.forEach(({ method, orderAmount, shouldPass, expectedError }) => {
    it(`should ${shouldPass ? 'allow' : 'reject'} ${method} payment for ${orderAmount} cents`, async () => {
      await setupCartWithAmount(page, orderAmount);
      await page.selectOption('[data-testid="payment-method"]', method);
      
      if (shouldPass) {
        await page.click('[data-testid="submit-order"]');
        await page.waitForSelector('[data-testid="order-success"]');
      } else {
        const errorMessage = await page.textContent('[data-testid="payment-error"]');
        expect(errorMessage).toContain(expectedError);
      }
    });
  });
});
```

#### TC-PAY-002: Stripe Payment Processing
**Requirement**: Secure card payment processing within 10 seconds
**Test Type**: Integration Test
**Priority**: P0

**Test Steps**:
1. Select card payment method
2. Enter test card details
3. Submit payment
4. Verify payment confirmation
5. Verify order status updated

**Test Data**:
```typescript
const stripeTestCards = {
  validVisa: '4242424242424242',
  validMastercard: '5555555555554444',
  declinedCard: '4000000000000002',
  insufficientFunds: '4000000000009995'
};
```

**Pass Criteria**:
- ✅ Payment processes within 10 seconds
- ✅ Valid cards accepted
- ✅ Declined cards handled gracefully
- ✅ Order marked as paid after successful payment

**Fail Criteria**:
- ❌ Payment takes >10 seconds
- ❌ Valid cards declined
- ❌ Declined cards not handled properly

---

## Non-Functional Test Cases

### Performance Test Cases

#### TC-PERF-001: Page Load Performance
**Requirement**: Page load time <2 seconds on 3G connection
**Test Type**: Performance Test
**Priority**: P0

**Test Environment Setup**:
```typescript
const performanceTestConfig = {
  networkConditions: {
    offline: false,
    downloadThroughput: 1.5 * 1024 * 1024 / 8, // 1.5 Mbps
    uploadThroughput: 750 * 1024 / 8, // 750 Kbps
    latency: 40 // 40ms
  },
  cpuThrottling: 4, // 4x slowdown
  cacheDisabled: true
};
```

**Test Steps**:
1. Configure network throttling to 3G
2. Navigate to each major page
3. Measure load time using Lighthouse
4. Verify all content loads within time limit

**Pass Criteria**:
- ✅ Home page loads within 2000ms
- ✅ Menu page loads within 2000ms
- ✅ Cart page loads within 2000ms
- ✅ Dashboard loads within 4000ms
- ✅ Lighthouse performance score >90

**Fail Criteria**:
- ❌ Any page exceeds load time limit
- ❌ Lighthouse performance score <90
- ❌ Content missing after load time

```typescript
// Performance Test Implementation
describe('Page Load Performance', () => {
  beforeEach(async () => {
    await page.setExtraHTTPHeaders({
      'Cache-Control': 'no-cache'
    });
    await page.emulateNetworkConditions(performanceTestConfig.networkConditions);
  });

  const pages = [
    { path: '/', name: 'Home', timeout: 2000 },
    { path: '/menu?r=test&t=A1', name: 'Menu', timeout: 2000 },
    { path: '/cart', name: 'Cart', timeout: 2000 },
    { path: '/restaurant/dashboard', name: 'Dashboard', timeout: 4000 }
  ];

  pages.forEach(({ path, name, timeout }) => {
    it(`should load ${name} page within ${timeout}ms`, async () => {
      const startTime = Date.now();
      await page.goto(path);
      await page.waitForLoadState('networkidle');
      const endTime = Date.now();
      
      expect(endTime - startTime).toBeLessThan(timeout);
    });
  });
});
```

#### TC-PERF-002: API Response Time
**Requirement**: API responses within 500ms average
**Test Type**: Performance Test
**Priority**: P0

**Test Steps**:
1. Execute 100 API calls for each endpoint
2. Measure response times
3. Calculate average response time
4. Identify outliers and bottlenecks

**Test Data**:
```typescript
const apiEndpoints = [
  { name: 'getVenueMenu', endpoint: '/api/venues/1/menu' },
  { name: 'createOrder', endpoint: '/api/orders' },
  { name: 'updateOrderStatus', endpoint: '/api/orders/1/status' },
  { name: 'getOrderTracking', endpoint: '/api/orders/track/UR-001' }
];
```

**Pass Criteria**:
- ✅ Average response time <500ms for all endpoints
- ✅ 95th percentile <1000ms
- ✅ Zero timeouts or errors
- ✅ Consistent performance across test runs

**Fail Criteria**:
- ❌ Any endpoint averages >500ms
- ❌ 95th percentile >1000ms
- ❌ Timeouts or errors occur

#### TC-PERF-003: Concurrent User Load
**Requirement**: Support 1000+ concurrent users
**Test Type**: Load Test
**Priority**: P1

**Test Configuration**:
```typescript
const loadTestConfig = {
  users: 1000,
  rampUpTime: 60, // seconds
  testDuration: 300, // seconds
  scenarios: [
    { name: 'MenuBrowsing', weight: 40 },
    { name: 'OrderPlacement', weight: 30 },
    { name: 'OrderTracking', weight: 20 },
    { name: 'RestaurantDashboard', weight: 10 }
  ]
};
```

**Pass Criteria**:
- ✅ System handles 1000 concurrent users
- ✅ Response times remain <2x normal
- ✅ Error rate <1%
- ✅ No system crashes or downtime

**Fail Criteria**:
- ❌ System fails under 1000 users
- ❌ Response times >2x normal
- ❌ Error rate >1%

### Security Test Cases

#### TC-SEC-001: Authentication Security
**Requirement**: Secure authentication with proper session management
**Test Type**: Security Test
**Priority**: P0

**Test Steps**:
1. Test password policy enforcement
2. Test brute force protection
3. Test session timeout
4. Test unauthorized access attempts

**Test Data**:
```typescript
const securityTestData = {
  weakPasswords: ['123456', 'password', 'abc123'],
  strongPasswords: ['SecurePass123!', 'MyStr0ngP@ssw0rd'],
  bruteForceAttempts: 10,
  sessionTimeouts: [1800, 3600, 7200] // seconds
};
```

**Pass Criteria**:
- ✅ Weak passwords rejected
- ✅ Account locked after failed attempts
- ✅ Sessions expire correctly
- ✅ Unauthorized access blocked

**Fail Criteria**:
- ❌ Weak passwords accepted
- ❌ No brute force protection
- ❌ Sessions don't expire
- ❌ Unauthorized access allowed

#### TC-SEC-002: Data Validation
**Requirement**: All inputs validated server-side
**Test Type**: Security Test
**Priority**: P0

**Test Steps**:
1. Test SQL injection attempts
2. Test XSS payload injection
3. Test malformed data submission
4. Test oversized input handling

**Test Data**:
```typescript
const maliciousInputs = {
  sqlInjection: "'; DROP TABLE orders; --",
  xssPayload: '<script>alert("XSS")</script>',
  oversizedInput: 'A'.repeat(10000),
  nullBytes: 'test\0malicious',
  pathTraversal: '../../../etc/passwd'
};
```

**Pass Criteria**:
- ✅ All malicious inputs sanitized
- ✅ No database corruption
- ✅ No script execution in browser
- ✅ Appropriate error messages returned

**Fail Criteria**:
- ❌ Malicious inputs processed
- ❌ Database affected by inputs
- ❌ XSS vulnerabilities exist

#### TC-SEC-003: Data Privacy Compliance
**Requirement**: GDPR compliance for customer data
**Test Type**: Compliance Test
**Priority**: P0

**Test Steps**:
1. Test data export functionality
2. Test data deletion requests
3. Test consent management
4. Test data anonymization

**Test Data**:
- Customer profiles with various data types
- GDPR request scenarios

**Pass Criteria**:
- ✅ Data export completes within 24 hours
- ✅ Data deletion removes all traces
- ✅ Consent properly recorded and managed
- ✅ Data anonymization effective

**Fail Criteria**:
- ❌ Data export incomplete or delayed
- ❌ Data deletion leaves traces
- ❌ Consent not properly managed

### Accessibility Test Cases

#### TC-A11Y-001: WCAG 2.1 AA Compliance
**Requirement**: Meet WCAG 2.1 AA standards
**Test Type**: Accessibility Test
**Priority**: P1

**Test Tools**:
- **Automated**: axe-core, Lighthouse accessibility audit
- **Manual**: Screen reader testing, keyboard navigation

**Test Steps**:
1. Run automated accessibility scan
2. Test keyboard navigation
3. Test screen reader compatibility
4. Test color contrast ratios
5. Verify focus management

**Pass Criteria**:
- ✅ Zero critical accessibility violations
- ✅ All interactive elements keyboard accessible
- ✅ Screen reader announces content correctly
- ✅ Color contrast >4.5:1 for normal text
- ✅ Focus indicators visible and logical

**Fail Criteria**:
- ❌ Critical accessibility violations found
- ❌ Elements not keyboard accessible
- ❌ Poor screen reader experience
- ❌ Insufficient color contrast

```typescript
// Accessibility Test Implementation
describe('WCAG 2.1 AA Compliance', () => {
  it('should have no critical accessibility violations', async () => {
    await page.goto('/');
    
    const results = await page.evaluate(() => {
      return new Promise((resolve) => {
        axe.run(document, (err, results) => {
          resolve(results);
        });
      });
    });
    
    const violations = results.violations.filter(
      violation => violation.impact === 'critical' || violation.impact === 'serious'
    );
    
    expect(violations).toHaveLength(0);
  });

  it('should support keyboard navigation', async () => {
    await page.goto('/menu?r=test&t=A1');
    
    // Test tab navigation
    await page.keyboard.press('Tab');
    let focusedElement = await page.evaluate(() => document.activeElement.tagName);
    expect(['BUTTON', 'INPUT', 'A'].includes(focusedElement)).toBe(true);
    
    // Test menu item interaction via keyboard
    await page.keyboard.press('Enter');
    await page.waitForSelector('[data-testid="cart-badge"]');
  });
});
```

#### TC-A11Y-002: Screen Reader Compatibility
**Requirement**: Full screen reader support
**Test Type**: Manual Accessibility Test
**Priority**: P1

**Test Steps**:
1. Navigate entire application using screen reader
2. Verify all content announced correctly
3. Test form completion with screen reader
4. Verify button and link announcements

**Test Tools**:
- **Windows**: NVDA, JAWS
- **macOS**: VoiceOver
- **Mobile**: TalkBack (Android), VoiceOver (iOS)

**Pass Criteria**:
- ✅ All page content announced clearly
- ✅ Form labels associated correctly
- ✅ Button purposes clear
- ✅ Navigation landmarks work

**Fail Criteria**:
- ❌ Content not announced or unclear
- ❌ Form inputs unlabeled
- ❌ Button purposes unclear

---

## Integration Test Cases

### External Service Integration

#### TC-INT-001: Stripe Payment Integration
**Requirement**: Reliable payment processing with webhook handling
**Test Type**: Integration Test
**Priority**: P0

**Test Steps**:
1. Process payment with test card
2. Verify webhook received and processed
3. Test payment failure scenarios
4. Test refund processing

**Test Data**:
```typescript
const stripeWebhookTests = [
  {
    event: 'payment_intent.succeeded',
    expectedAction: 'Mark order as paid',
    timeout: 30000
  },
  {
    event: 'payment_intent.payment_failed',
    expectedAction: 'Mark payment as failed',
    timeout: 30000
  }
];
```

**Pass Criteria**:
- ✅ Webhooks processed within 30 seconds
- ✅ Order status updated correctly
- ✅ Payment failures handled gracefully
- ✅ Refunds processed successfully

**Fail Criteria**:
- ❌ Webhooks not processed or delayed
- ❌ Order status not updated
- ❌ Payment failures cause errors

#### TC-INT-002: Firebase Integration
**Requirement**: Reliable real-time data synchronization
**Test Type**: Integration Test
**Priority**: P0

**Test Steps**:
1. Test Firestore real-time listeners
2. Test Cloud Function execution
3. Test offline capability
4. Test data consistency

**Test Data**:
- Multiple concurrent data changes
- Network interruption scenarios

**Pass Criteria**:
- ✅ Real-time updates propagate within 1 second
- ✅ Cloud Functions execute successfully
- ✅ Offline mode works as expected
- ✅ Data remains consistent across clients

**Fail Criteria**:
- ❌ Real-time updates delayed or missing
- ❌ Cloud Functions fail or timeout
- ❌ Offline mode doesn't work
- ❌ Data inconsistencies occur

### Cross-Browser Compatibility

#### TC-COMPAT-001: Browser Compatibility Testing
**Requirement**: Full functionality across all supported browsers
**Test Type**: Compatibility Test
**Priority**: P1

**Test Matrix**:
```typescript
const browserTestMatrix = {
  chrome: { versions: ['latest', 'latest-1'], platform: ['Windows', 'macOS', 'Android'] },
  firefox: { versions: ['latest', 'latest-1'], platform: ['Windows', 'macOS'] },
  safari: { versions: ['latest', 'latest-1'], platform: ['macOS', 'iOS'] },
  edge: { versions: ['latest'], platform: ['Windows'] }
};
```

**Test Steps**:
1. Execute core user journey on each browser
2. Test JavaScript functionality
3. Test CSS rendering
4. Test mobile responsiveness

**Pass Criteria**:
- ✅ All core features work on all browsers
- ✅ Visual consistency maintained
- ✅ No JavaScript errors
- ✅ Mobile experience consistent

**Fail Criteria**:
- ❌ Features don't work on supported browsers
- ❌ Visual inconsistencies
- ❌ JavaScript errors occur

---

## User Acceptance Test Cases

### Customer User Acceptance Tests

#### TC-UAT-001: Complete Customer Journey
**Requirement**: End-to-end customer experience validation
**Test Type**: UAT
**Priority**: P0

**Test Scenario**: New customer visits restaurant, scans QR, orders food, tracks order

**Test Steps**:
1. **Arrival**: Customer scans QR code at table
2. **Menu Browsing**: Browse menu, filter by dietary preferences
3. **Ordering**: Add items to cart, customize with special instructions
4. **Checkout**: Select payment method, complete order
5. **Tracking**: Track order status in real-time
6. **Completion**: Receive order and rate experience

**Test Data**:
```typescript
const customerJourneyData = {
  restaurant: 'Beach Bar Durrës',
  table: 'A15',
  items: [
    { name: 'Pizza Margherita', quantity: 1, instructions: 'Extra basil' },
    { name: 'Aperol Spritz', quantity: 2 }
  ],
  paymentMethod: 'cash',
  specialInstructions: 'Please serve pizza first'
};
```

**Pass Criteria**:
- ✅ Complete journey in <10 minutes
- ✅ All steps intuitive and clear
- ✅ No user confusion or errors
- ✅ Order completed successfully
- ✅ Tracking information accurate

**Fail Criteria**:
- ❌ Journey takes >10 minutes
- ❌ User encounters confusion
- ❌ Process fails at any step

#### TC-UAT-002: Guest vs Registered Customer Experience
**Requirement**: Smooth experience for both guest and registered customers
**Test Type**: UAT
**Priority**: P0

**Test Steps**:
1. **Guest Journey**: Complete order without registration
2. **Registration Prompt**: Verify account creation prompt after order
3. **Registered Journey**: Complete order with account benefits
4. **Comparison**: Validate enhanced experience for registered users

**Pass Criteria**:
- ✅ Guest checkout completes without friction
- ✅ Registration prompt appears appropriately
- ✅ Registered users see personalization
- ✅ Order history accessible to registered users

**Fail Criteria**:
- ❌ Guest checkout requires unnecessary steps
- ❌ Registration prompt intrusive
- ❌ No benefits for registered users

### Restaurant User Acceptance Tests

#### TC-UAT-003: Restaurant Staff Workflow
**Requirement**: Efficient order management for restaurant staff
**Test Type**: UAT
**Priority**: P0

**Test Scenario**: Busy lunch rush with multiple orders

**Test Steps**:
1. **Order Reception**: Receive 5 new orders simultaneously
2. **Order Management**: Accept, prioritize, and update status
3. **Kitchen Coordination**: Use kitchen display system
4. **Customer Communication**: Handle special requests
5. **Completion**: Mark orders as served

**Test Data**:
- 5 concurrent orders with varying complexity
- Special dietary requirements
- Table service coordination

**Pass Criteria**:
- ✅ All orders processed efficiently
- ✅ Kitchen display shows clear priorities
- ✅ Status updates propagate correctly
- ✅ No orders lost or delayed

**Fail Criteria**:
- ❌ Orders missed or delayed
- ❌ Kitchen display unclear
- ❌ Status updates don't work

#### TC-UAT-004: Menu Management Workflow
**Requirement**: Easy menu updates and management
**Test Type**: UAT
**Priority**: P0

**Test Steps**:
1. **Daily Setup**: Update item availability for the day
2. **New Item**: Add seasonal special with image
3. **Price Update**: Adjust prices for multiple items
4. **Category Management**: Reorganize menu categories
5. **Bulk Operations**: Update availability for entire category

**Pass Criteria**:
- ✅ Daily updates completed in <5 minutes
- ✅ New items added with all details
- ✅ Price updates reflected immediately
- ✅ Bulk operations save time

**Fail Criteria**:
- ❌ Daily updates take >5 minutes
- ❌ New items missing information
- ❌ Price updates don't propagate

---

## Test Automation Strategy

### Automation Framework Architecture

```typescript
interface TestAutomationFramework {
  unitTesting: {
    framework: 'Vitest';
    coverage: 'c8';
    mocking: 'MSW';
    utilities: 'React Testing Library';
  };
  integrationTesting: {
    framework: 'Vitest';
    apiTesting: 'Supertest';
    databaseTesting: 'Firebase Test SDK';
  };
  e2eTesting: {
    framework: 'Playwright';
    browsers: ['chromium', 'firefox', 'webkit'];
    parallelization: true;
    retries: 2;
  };
  performanceTesting: {
    framework: 'Lighthouse CI';
    loadTesting: 'Artillery';
    monitoring: 'Firebase Performance';
  };
}
```

### Test Data Management

#### Test Data Strategy
```typescript
interface TestDataManagement {
  staticData: {
    location: 'src/tests/fixtures/';
    format: 'JSON/TypeScript';
    versioning: 'Git';
  };
  dynamicData: {
    generation: 'Factory functions';
    cleanup: 'Automatic after tests';
    isolation: 'Per test case';
  };
  seedData: {
    restaurants: 'Predefined test restaurants';
    menus: 'Standard test menus';
    users: 'Various user profiles';
  };
}
```

#### Test Data Factory
```typescript
// Test Data Factory Implementation
export class TestDataFactory {
  static createRestaurant(overrides?: Partial<Restaurant>): Restaurant {
    return {
      id: 'test-restaurant-1',
      name: 'Test Restaurant',
      slug: 'test-restaurant',
      email: 'test@restaurant.com',
      isActive: true,
      ...overrides
    };
  }

  static createMenuItem(overrides?: Partial<MenuItem>): MenuItem {
    return {
      id: 'test-item-1',
      name: 'Test Item',
      description: 'Test description',
      price: 1000, // 10 EUR
      category: 'Test Category',
      isAvailable: true,
      ...overrides
    };
  }

  static createOrder(overrides?: Partial<Order>): Order {
    return {
      id: 'test-order-1',
      orderNumber: 'UR-TEST-001',
      venueId: 'test-restaurant-1',
      tableId: 'A15',
      items: [this.createOrderItem()],
      total: 1000,
      status: OrderStatus.NEW,
      ...overrides
    };
  }
}
```

### Continuous Integration Testing

#### CI/CD Test Pipeline
```yaml
# Test Pipeline Configuration
name: Test Pipeline
on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - name: Run Unit Tests
        run: npm run test:unit
      - name: Generate Coverage Report
        run: npm run test:coverage
      - name: Upload Coverage
        uses: codecov/codecov-action@v3

  integration-tests:
    runs-on: ubuntu-latest
    services:
      firebase-emulator:
        image: gcr.io/firebase-tools
    steps:
      - name: Start Firebase Emulators
        run: firebase emulators:start --detach
      - name: Run Integration Tests
        run: npm run test:integration

  e2e-tests:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        browser: [chromium, firefox, webkit]
    steps:
      - name: Run E2E Tests
        run: npx playwright test --project=${{ matrix.browser }}
      - name: Upload Test Results
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: e2e-test-results
          path: test-results/

  performance-tests:
    runs-on: ubuntu-latest
    steps:
      - name: Run Lighthouse CI
        run: npx lhci autorun
      - name: Run Load Tests
        run: npm run test:load
```

---

## Test Execution Procedures

### Test Execution Schedule

#### Phase-Based Testing Schedule
```typescript
interface TestExecutionSchedule {
  phase1: {
    duration: 'Months 1-3';
    focus: 'Core functionality';
    testTypes: ['Unit', 'Integration', 'Basic E2E'];
    coverage: 'Critical path features';
  };
  phase2: {
    duration: 'Months 4-6';
    focus: 'Enhanced features';
    testTypes: ['Full E2E', 'Performance', 'Security'];
    coverage: 'All customer and restaurant features';
  };
  phase3: {
    duration: 'Months 7-9';
    focus: 'Advanced features';
    testTypes: ['Load testing', 'UAT', 'Accessibility'];
    coverage: 'AI features, loyalty program';
  };
  phase4: {
    duration: 'Months 10-12';
    focus: 'Scale and optimization';
    testTypes: ['Stress testing', 'Security audit', 'Compliance'];
    coverage: 'Enterprise features, multi-location';
  };
}
```

#### Daily Testing Routine
```typescript
interface DailyTestingRoutine {
  developer: {
    preCommit: ['Unit tests', 'Linting', 'Type checking'];
    postCommit: ['Integration tests', 'Build verification'];
  };
  qa: {
    morning: ['Smoke tests', 'Regression suite'];
    afternoon: ['Feature testing', 'Bug verification'];
    evening: ['Test report generation'];
  };
  automated: {
    continuous: ['Unit tests on every commit'];
    scheduled: ['Full E2E suite nightly', 'Performance tests weekly'];
  };
}
```

### Test Environment Management

#### Environment Refresh Strategy
```typescript
interface EnvironmentManagement {
  development: {
    dataRefresh: 'On demand';
    frequency: 'Multiple times daily';
    automation: 'Automated via scripts';
  };
  staging: {
    dataRefresh: 'Daily';
    frequency: 'Before major test cycles';
    automation: 'Scheduled job';
  };
  production: {
    testing: 'Synthetic monitoring only';
    dataRefresh: 'Never';
    validation: 'Continuous health checks';
  };
}
```

### Defect Management

#### Bug Reporting Template
```typescript
interface BugReport {
  id: string;
  title: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  priority: 'P0' | 'P1' | 'P2' | 'P3';
  testCase: string;
  environment: string;
  stepsToReproduce: string[];
  expectedResult: string;
  actualResult: string;
  workaround?: string;
  screenshots: string[];
  browserInfo: BrowserInfo;
  assignee: string;
  status: 'Open' | 'In Progress' | 'Fixed' | 'Closed';
}
```

#### Severity Classification
```typescript
const severityClassification = {
  critical: {
    definition: 'Application crashes, data loss, security vulnerabilities',
    responseTime: '2 hours',
    examples: ['Payment processing fails', 'User data exposed']
  },
  high: {
    definition: 'Major functionality broken, significant user impact',
    responseTime: '1 business day',
    examples: ['Menu not loading', 'Orders not submitting']
  },
  medium: {
    definition: 'Minor functionality issues, workaround available',
    responseTime: '3 business days',
    examples: ['UI glitches', 'Minor calculation errors']
  },
  low: {
    definition: 'Cosmetic issues, minor inconveniences',
    responseTime: '1 week',
    examples: ['Text alignment', 'Color inconsistencies']
  }
};
```

---

## Test Reporting and Metrics

### Test Metrics Dashboard

#### Key Test Metrics
```typescript
interface TestMetrics {
  coverage: {
    unitTestCoverage: number; // Target: >80%
    integrationTestCoverage: number; // Target: >70%
    e2eTestCoverage: number; // Target: >90% of critical paths
  };
  quality: {
    passRate: number; // Target: >98%
    defectDensity: number; // Target: <5 defects per 100 test cases
    defectEscapeRate: number; // Target: <2%
  };
  performance: {
    testExecutionTime: number; // Target: <30 minutes for full suite
    automationRate: number; // Target: >90%
    parallelizationEfficiency: number; // Target: >80%
  };
  reliability: {
    testFlakiness: number; // Target: <1%
    falsePositiveRate: number; // Target: <2%
    environmentUptime: number; // Target: >99%
  };
}
```

#### Test Report Generation
```typescript
interface TestReport {
  executionSummary: {
    totalTests: number;
    passed: number;
    failed: number;
    skipped: number;
    executionTime: number;
  };
  coverageReport: {
    statements: number;
    branches: number;
    functions: number;
    lines: number;
  };
  performanceMetrics: {
    averageResponseTime: number;
    slowestEndpoints: EndpointPerformance[];
    pageLoadTimes: PagePerformance[];
  };
  defectSummary: {
    newDefects: number;
    fixedDefects: number;
    regressionDefects: number;
    defectsByComponent: ComponentDefects[];
  };
}
```

### Weekly Test Summary Report

#### Report Template
```markdown
# Weekly Test Execution Report - Week of [Date]

## Executive Summary
- **Test Execution**: [X] test cases executed, [Y]% pass rate
- **Coverage**: [Z]% code coverage achieved
- **Defects**: [A] new defects found, [B] defects fixed
- **Performance**: All performance targets met/not met

## Test Execution Details
| Test Suite | Tests Run | Passed | Failed | Pass Rate |
|------------|-----------|--------|--------|-----------|
| Unit Tests | 150 | 148 | 2 | 98.7% |
| Integration Tests | 75 | 73 | 2 | 97.3% |
| E2E Tests | 45 | 44 | 1 | 97.8% |
| Performance Tests | 20 | 18 | 2 | 90.0% |

## Key Findings
### Critical Issues
- [Issue 1]: Description and impact
- [Issue 2]: Description and impact

### Performance Highlights
- Menu loading: 890ms (Target: <1000ms) ✅
- Order submission: 2.1s (Target: <3000ms) ✅

## Recommendations
- [Recommendation 1]
- [Recommendation 2]

## Next Week Focus
- [Priority area 1]
- [Priority area 2]
```

---

## Risk-Based Testing

### Risk Assessment Matrix

#### High-Risk Areas
```typescript
interface RiskAssessment {
  paymentProcessing: {
    riskLevel: 'Critical';
    impact: 'Revenue loss, legal issues';
    probability: 'Medium';
    testingStrategy: 'Extensive integration and security testing';
    testCases: ['TC-PAY-001', 'TC-PAY-002', 'TC-SEC-002'];
  };
  dataLoss: {
    riskLevel: 'High';
    impact: 'Customer data loss, business disruption';
    probability: 'Low';
    testingStrategy: 'Data integrity and backup testing';
    testCases: ['TC-DATA-001', 'TC-BACKUP-001'];
  };
  performanceDegradation: {
    riskLevel: 'High';
    impact: 'User experience degradation, customer loss';
    probability: 'Medium';
    testingStrategy: 'Continuous performance monitoring';
    testCases: ['TC-PERF-001', 'TC-PERF-002', 'TC-PERF-003'];
  };
  securityVulnerabilities: {
    riskLevel: 'Critical';
    impact: 'Data breach, legal compliance issues';
    probability: 'Medium';
    testingStrategy: 'Security-focused testing and audits';
    testCases: ['TC-SEC-001', 'TC-SEC-002', 'TC-SEC-003'];
  };
}
```

### Risk Mitigation Testing

#### Critical Path Testing
```typescript
const criticalPaths = [
  {
    name: 'Customer Order Journey',
    steps: ['QR Scan', 'Menu Browse', 'Add to Cart', 'Checkout', 'Track Order'],
    riskLevel: 'High',
    testFrequency: 'Every build',
    automationLevel: '100%'
  },
  {
    name: 'Restaurant Order Management',
    steps: ['Receive Order', 'Update Status', 'Kitchen Display', 'Complete Order'],
    riskLevel: 'High',
    testFrequency: 'Every build',
    automationLevel: '90%'
  },
  {
    name: 'Payment Processing',
    steps: ['Select Payment', 'Process Payment', 'Confirm Payment', 'Update Order'],
    riskLevel: 'Critical',
    testFrequency: 'Every commit',
    automationLevel: '100%'
  }
];
```

---

## Test Deliverables

### Test Documentation
1. **Test Plan Document** (this document)
2. **Test Case Specifications** with detailed steps
3. **Test Data Management Guide**
4. **Automation Framework Documentation**
5. **Test Environment Setup Guide**

### Test Artifacts
1. **Automated Test Suites** with CI/CD integration
2. **Test Data Sets** for all scenarios
3. **Performance Baselines** and benchmarks
4. **Security Test Results** and compliance reports
5. **Accessibility Audit Reports**

### Test Reports
1. **Daily Test Execution Reports**
2. **Weekly Test Summary Reports**
3. **Monthly Quality Metrics Reports**
4. **Release Readiness Reports**
5. **Post-Release Validation Reports**

---

## Acceptance Criteria for Test Plan

### Test Plan Success Criteria
- ✅ **100% Requirement Coverage**: Every PRD requirement has corresponding test cases
- ✅ **Clear Pass/Fail Criteria**: Each test case has unambiguous success criteria
- ✅ **Automation Rate >90%**: Critical functionality automated
- ✅ **Performance Benchmarks**: All performance targets validated
- ✅ **Security Validation**: Zero critical security vulnerabilities
- ✅ **Accessibility Compliance**: WCAG 2.1 AA standards met
- ✅ **Cross-Browser Support**: Full functionality on all target browsers
- ✅ **Mobile Compatibility**: Optimal experience on mobile devices

### Test Execution Success Criteria
- ✅ **Test Suite Completion**: <30 minutes for full automated suite
- ✅ **Parallel Execution**: Tests run in parallel for efficiency
- ✅ **Flaky Test Rate**: <1% of tests are flaky
- ✅ **Environment Stability**: >99% test environment uptime
- ✅ **CI/CD Integration**: Automated testing blocks unstable deployments

---

## Conclusion

This comprehensive verification test plan ensures that every product requirement is thoroughly validated with:

- **450+ Test Cases** covering all functional and non-functional requirements
- **Clear Pass/Fail Criteria** for objective evaluation
- **Multi-Level Testing Strategy** from unit to user acceptance tests
- **Automation Framework** for efficient and reliable testing
- **Risk-Based Approach** focusing on critical areas
- **Continuous Integration** with quality gates
- **Comprehensive Reporting** for stakeholder visibility

The test plan provides confidence that the Urdhëro platform will meet all customer requirements, perform reliably under load, and maintain high security and accessibility standards.

Regular review and updates of this test plan will ensure it remains aligned with evolving requirements and provides maximum value for quality assurance.

---

**Document Version**: 1.0  
**Last Updated**: January 2025  
**Review Schedule**: Bi-weekly during development  
**Owner**: QA Engineering Team  
**Approvers**: QA Lead, Development Lead, Product Manager