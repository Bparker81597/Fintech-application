# 💰 SmartFinance Dashboard

A modern, TypeScript-based fintech dashboard with Firebase backend integration for tracking transactions, managing budgets, and visualizing financial data.

![Dashboard Preview](./screenshots/dashboard.png)

## 🚀 Features

- **🔐 Authentication** - Secure email/password sign-in with Firebase Auth
- **📊 Real-time Transaction Tracking** - Add, view, and search income/expense transactions
- **💾 Firestore Database** - User-specific data storage with secure isolation
- **📈 Visual Analytics** - Spending overview charts with monthly trends
- **💳 Budget Management** - Track spending against category limits
- **🔍 Search & Filter** - Quick transaction search by merchant or category
- **🎨 Modern UI** - Clean design built with shadcn-ui components
- **📱 Responsive** - Works on desktop, tablet, and mobile

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **shadcn-ui** - Modern component library
- **Recharts** - Data visualization
- **Lucide React** - Beautiful icons
- **Firebase** - Authentication & Firestore database

## 🏃 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Set up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Authentication** → Email/Password
4. Create a **Firestore Database**
5. Copy your config values

### 3. Configure environment variables

```bash
cp .env.example .env
```

Fill in your Firebase credentials in `.env`:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Set up Firestore Security Rules

In Firebase Console → Firestore Database → Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/transactions/{transactionId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 5. Run development server
```bash
npm run dev
```

### 6. Build for production
```bash
npm run build
```

## 📁 Project Structure

```
src/
  components/
    auth/           # Authentication UI (AuthCard)
    dashboard/      # Dashboard components
    transactions/   # Transaction list
    budgets/        # Budget progress
    insights/       # Insight cards
    ui/             # shadcn-ui base components
  hooks/
    useAuth.ts      # Authentication state hook
    useTransactions.ts  # Transaction data hook
  lib/
    firebase.ts     # Firebase initialization
  services/
    authService.ts  # Auth operations
    transactionService.ts  # Firestore CRUD operations
  types/
    auth.ts         # Auth type definitions
    finance.ts      # Financial data types
  utils/
    currency.ts     # Currency formatting
    storage.ts      # LocalStorage helpers
  pages/
    DashboardPage.tsx
  App.tsx
```

## 🔥 Firestore Data Structure

```
users/
  {userId}/
    transactions/
      {transactionId}/
        merchant: string
        amount: number
        category: string
        date: string (YYYY-MM-DD)
```

## 🏗️ Architecture

- **Firebase Auth** - User authentication and session management
- **Service Layer** - `authService` and `transactionService` handle all backend operations
- **Custom Hooks** - `useAuth` and `useTransactions` manage state and business logic
- **Type Safety** - Full TypeScript coverage for all data models
- **Component Separation** - UI rendering separated from data logic

## 📄 License

MIT

## 🌐 Live Demo

https://bparker81597.github.io/smart-finance-dashboard/

---

Built with ❤️ using React, TypeScript, shadcn-ui, and Firebase
