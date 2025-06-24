# Urdhëro - Restaurant Ordering Platform

A modern, efficient platform for restaurant ordering using QR codes. Built with React, Firebase, and Tailwind CSS.

## Features

- 🍽️ Restaurant menu browsing and ordering
- 📱 Mobile-first design with PWA support
- 🔒 Secure authentication for customers and staff
- 🔄 Real-time order tracking and updates
- 📊 Analytics dashboard for restaurant owners
- 📱 QR code scanning and generation
- 💰 Multiple payment method support
- ⭐ Loyalty program for frequent customers

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Firebase (Auth, Firestore, Functions, Storage)
- **Bundler**: Vite
- **Hosting**: Firebase Hosting

## Project Structure

- `/src` - Main application code
  - `/components` - Reusable React components
  - `/hooks` - Custom React hooks
  - `/pages` - Application pages
  - `/types` - TypeScript type definitions
  - `/utils` - Utility functions
  - `/firebase` - Firebase configuration and hooks

- `/functions` - Firebase Cloud Functions
  - `/src` - Cloud Functions implementation

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env.local` file with your Firebase configuration:
   ```
   VITE_FIREBASE_API_KEY=your-firebase-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-bucket.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```
4. Start the development server:
   ```
   npm run dev
   ```

## Firebase Setup

1. Create a new Firebase project
2. Enable Authentication with Email/Password
3. Set up Firestore database with appropriate security rules
4. Configure Storage for QR codes and menu images
5. Deploy Cloud Functions for backend operations

## Deployment

```
npm run build
npm run deploy
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.