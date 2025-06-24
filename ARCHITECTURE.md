# Urdhëro Architecture

This document outlines the architecture and design decisions for the Urdhëro restaurant ordering platform.

## System Overview

Urdhëro is a full-stack web application built with:

- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Firebase (Auth, Firestore, Functions, Storage)
- **Hosting**: Firebase Hosting

The application follows a serverless architecture pattern, utilizing Firebase services for backend functionality.

## Key Components

### 1. Frontend Architecture

The frontend is organized into the following key areas:

#### Components
- **UI Components**: Reusable, atomic components (buttons, cards, etc.)
- **Layout Components**: Header, navigation, etc.
- **Feature Components**: Complex components specific to features (menu item cards, order tracking, etc.)

#### Pages
- **Customer Pages**: Home, QR landing, menu, cart, order tracking
- **Restaurant Pages**: Login, dashboard, kitchen display, QR management

#### Hooks
- **Data Hooks**: Custom hooks for data fetching and management
- **Feature Hooks**: Encapsulate complex feature logic
- **Auth Hooks**: Handle authentication and user state

#### Context
- **Cart Context**: Manage shopping cart state
- **Auth Context**: Handle user authentication state
- **Translation Context**: Manage multi-language support

### 2. Firebase Backend

#### Authentication
- **Email/Password**: For customers and restaurant staff
- **Custom Claims**: Role-based access control for restaurant staff

#### Firestore Database
- **Collections**:
  - `venues`: Restaurant information
  - `users`: User profiles
  - `orders`: Order details
  - `paymentIntents`: Payment processing information
  - **Subcollections**:
    - `venues/{venueId}/menuItems`: Menu items for a venue
    - `venues/{venueId}/tables`: Tables for a venue
    - `venues/{venueId}/analytics`: Analytics data for a venue

#### Cloud Functions
- **Order Management**:
  - `createOrder`: Create new order
  - `updateOrderStatus`: Update order status
  - `getOrderByNumber`: Get order details
- **Venue Management**:
  - `registerVenue`: Register new venue
- **Menu Management**:
  - `createMenuItem`: Create new menu item
  - `updateMenuItemAvailability`: Update menu item availability
- **Table Management**:
  - `createTable`: Create new table
  - `generateTableQR`: Generate QR code for a table
- **Analytics**:
  - `getVenueAnalytics`: Get analytics data for a venue
- **Payments**:
  - `createPaymentIntent`: Create Stripe payment intent
  - `stripeWebhook`: Handle Stripe webhooks

### 3. Data Flow

1. **QR Code Scanning**:
   - Customer scans QR code
   - Frontend validates QR code and fetches restaurant and table information
   - Frontend displays menu for the restaurant

2. **Ordering**:
   - Customer adds items to cart
   - Customer submits order
   - `createOrder` function processes the order
   - Customer is redirected to order tracking page

3. **Order Processing**:
   - Restaurant receives new order notification
   - Staff updates order status
   - `updateOrderStatus` function processes the status change
   - Customer sees real-time updates on the order tracking page

4. **Analytics**:
   - Order data is processed to generate analytics
   - Restaurant staff views analytics on the dashboard

## Security Model

1. **Authentication**:
   - Customers can browse menus and place orders without authentication
   - Registered customers can save preferences and order history
   - Restaurant staff must authenticate to access dashboard

2. **Authorization**:
   - Firebase Auth Custom Claims define roles:
     - `admin`: Full access to venue management
     - `manager`: Access to dashboard and menu management
     - `staff`: Access to order processing

3. **Firestore Security Rules**:
   - Public read access for menus and restaurant information
   - Order creation is public but validated on the server
   - Order updates require staff authentication
   - Venue management requires admin authentication

## Deployment Architecture

- **Firebase Hosting**: Static assets
- **Firebase Functions**: API and backend processing
- **Firebase Storage**: QR codes and images
- **Firebase Firestore**: Database
- **Firebase Auth**: Authentication
- **Stripe**: Payment processing

## Performance Considerations

1. **Optimizations**:
   - Code splitting
   - Image optimization
   - Lazy loading
   - PWA features for offline support

2. **Monitoring**:
   - Firebase Performance Monitoring
   - Custom performance dashboard

## Scalability Considerations

- Firestore scales automatically
- Cloud Functions scale to zero when not in use
- Cloud Functions can be distributed globally

## Future Architecture Considerations

1. **Real-time Communication**:
   - WebSockets or Firebase RTDB for real-time staff-to-kitchen communication
   
2. **Internationalization**:
   - Enhanced translation system for more languages

3. **Advanced Analytics**:
   - Machine learning for menu recommendations
   - Predictive analytics for inventory management