# AquaStack - Modern Full-Stack TypeScript Boilerplate

<div align="center">

![AquaStack Logo](./assets/aquastack-preview.png)

**A production-ready boilerplate for building full-stack applications with**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Expo](https://img.shields.io/badge/Expo-54-000020?style=for-the-badge&logo=expo)](https://expo.dev/)
[![Convex](https://img.shields.io/badge/Convex-1.27-5B5FDE?style=for-the-badge&logo=convex)](https://convex.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=for-the-badge)](CONTRIBUTING.md)
[![YouTube Channel](https://img.shields.io/badge/YouTube-red?style=for-the-badge&logo=youtube)](https://www.youtube.com/@0xAquaWolf)

</div>

## ✨ Features

- **🚀 Monorepo Architecture** - Turborepo + pnpm workspaces for scalable development
- **📱 Cross-Platform** - Next.js web app + Expo React Native mobile app
- **🔐 Authentication** - Better Auth integrated with Convex for secure auth
- **🗄️ Real-time Database** - Convex backend with type-safe API generation
- **🎨 Modern UI** - Tailwind CSS for web, NativeWind for mobile
- **🧩 Shared Packages** - Reusable UI components and business logic
- **📝 TypeScript** - End-to-end type safety across the entire stack
- **⚡ Fast Development** - Hot reload, optimized builds, and modern tooling

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌────────────────────┐
│   Web App       │    │   Mobile App    │    │   Shared Packages  │
│  (Next.js)      │    │   (Expo)        │    │  (@aqua/shared, ui) │
│                 │    │                 │    │                    │
│ - App Router    │◄──►│ - Expo Router   │◄──►│ - Convex Types     │
│ - Convex Client │    │ - Zustand Store │    │ - Auth Utilities   │
│ - Better Auth   │    │ - Better Auth   │    │ - UI Components    │
└─────────────────┘    └─────────────────┘    └────────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────────────────────┐
                    │   Backend (Convex + Better Auth) │
                    │   - Real-time Database           │
                    │   - Auth + Sessions              │
                    │   - Functions & Schedules        │
                    └─────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ 
- **pnpm** 9+
- **Expo CLI** (for mobile development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/0xAquaWolf/aquastack.git
   cd aquastack
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables** (see [Environment Setup](#environment-setup))

4. **Start development servers**
   ```bash
   # Start all services at once
   pnpm dev
   
   # Or start individually:
   pnpm --filter @aqua/convex dev    # Convex backend (port 3010)
   pnpm --filter @aqua/web dev       # Next.js web app (port 3000)  
   pnpm --filter @aqua/mobile dev    # Expo mobile app (port 8081)
   ```

5. **Open your browser**
   - **Web App**: http://localhost:3000
   - **Mobile Web**: http://localhost:8081
   - **Convex Dashboard**: Run `npx convex dashboard` in `apps/convex`

## 📁 Project Structure

```
aquastack/
├── apps/
│   ├── web/                 # Next.js web application
│   │   ├── src/
│   │   │   ├── app/         # App Router pages
│   │   │   └── lib/         # Utilities and auth client
│   │   └── package.json
│   ├── mobile/              # Expo React Native app
│   │   ├── app/             # Expo Router pages
│   │   ├── components/      # Mobile-specific components
│   │   └── package.json
│   └── convex/              # Convex backend
│       ├── convex/          # Schema, functions, auth
│       └── package.json
├── packages/
│   ├── ui/                  # Shared UI components
│   ├── shared/              # Shared types and utilities
│   └── config/              # Shared configuration
├── docs/                    # Documentation
├── package.json             # Root package.json
├── pnpm-workspace.yaml      # Workspace configuration
├── turbo.json              # Turborepo configuration
└── tsconfig.json           # TypeScript configuration
```

## 🔧 Environment Setup

### 1. Convex Backend

Create `apps/convex/.env.local`:
```env
CONVEX_DEPLOYMENT=your-deployment-name
CONVEX_SITE_URL=https://your-app.convex.site
```

### 2. Web App

Create `apps/web/.env.local`:
```env
# Convex
NEXT_PUBLIC_CONVEX_URL=https://your-app.convex.site
NEXT_PUBLIC_CONVEX_SITE_URL=https://your-app.convex.site

# Better Auth
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-secret-key-here

# OAuth Providers (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 3. Mobile App

Create `apps/mobile/.env.local`:
```env
# Convex
EXPO_PUBLIC_CONVEX_URL=https://your-app.convex.site
EXPO_PUBLIC_CONVEX_SITE_URL=https://your-app.convex.site

# Better Auth
EXPO_PUBLIC_BETTER_AUTH_URL=http://localhost:3000

# Deep Linking
EXPO_APP_SCHEME=aquastack
EXPO_PUBLIC_APP_SCHEME=aquastack
```

### Getting Environment Variables

1. **Convex Setup**:
   ```bash
   cd apps/convex
   npx convex dev
   ```
   This will create a new deployment and provide the `.env.local` values.

2. **Better Auth Secret**:
   ```bash
   # Generate a secure secret
   openssl rand -base64 32
   ```

3. **OAuth Setup** (Optional):
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

## 📦 Available Scripts

### Root Level Commands
```bash
pnpm dev          # Start all development servers
pnpm build        # Build all packages
pnpm lint         # Lint all packages
pnpm type-check   # Type check all packages
```

### Individual Package Commands
```bash
# Web App
pnpm --filter @aqua/web dev        # Start Next.js dev server
pnpm --filter @aqua/web build      # Build for production
pnpm --filter @aqua/web start      # Start production server

# Mobile App  
pnpm --filter @aqua/mobile dev     # Start Expo dev server
pnpm --filter @aqua/mobile ios     # Run iOS simulator
pnpm --filter @aqua/mobile android # Run Android emulator
pnpm --filter @aqua/mobile web     # Run Expo web version

# Convex Backend
pnpm --filter @aqua/convex dev      # Start Convex dev server
pnpm --filter @aqua/convex deploy   # Deploy to production
pnpm --filter @aqua/convex dashboard # Open Convex dashboard

# Shared Packages
pnpm --filter @aqua/ui dev          # Watch UI components
pnpm --filter @aqua/shared dev      # Watch shared utilities
```

## 🧩 Development Workflow

### 1. Making Changes

1. **Backend Changes** (Convex):
   ```bash
   cd apps/convex
   # Edit schema/functions in convex/
   npx convex dev  # Restarts with changes
   ```

2. **Web App Changes**:
   ```bash
   cd apps/web
   pnpm dev  # Hot reload enabled
   ```

3. **Mobile App Changes**:
   ```bash
   cd apps/mobile
   pnpm dev  # Hot reload in Expo Go
   ```

### 2. Type Safety

The boilerplate provides end-to-end type safety:

- **Convex** generates types for your database schema and functions
- **Shared packages** export common types used by both clients  
- **Import anywhere** with full IntelliSense support:
   ```typescript
   import { api } from '@aqua/convex'
   import type { User } from '@aqua/shared'
   ```

### 3. Authentication

Better Auth is pre-configured with:

- **Email/Password** authentication
- **OAuth providers** (Google, GitHub, etc.)
- **Session management** 
- **Protected routes**

#### Adding Auth Providers

1. **Configure in Convex** (`apps/convex/convex/auth.config.ts`):
   ```typescript
   export const auth = {
     providers: {
       google: {
         clientId: process.env.GOOGLE_CLIENT_ID!,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
       },
       // Add more providers...
     }
   }
   ```

2. **Add environment variables** (see [Environment Setup](#environment-setup))

3. **Use in components**:
   ```typescript
   import { authClient } from '@/lib/auth-client'
   
   // Sign in
   await authClient.signIn.social({ provider: 'google' })
   
   // Get session
   const { data: session } = authClient.useSession()
   ```

## 🚀 Deployment

### Convex Deployment
```bash
cd apps/convex
npx convex deploy
```

### Web App Deployment
```bash
cd apps/web
pnpm build
# Deploy .next to Vercel, Netlify, etc.
```

### Mobile App Deployment
```bash
cd apps/mobile
pnpm build  # Generate native code
# Use EAS Build for app stores:
eas build --platform android
eas build --platform ios
```

## 📚 Documentation

- [Architecture Overview](./docs/01-architecture-overview.md)
- [Convex Backend Guide](./docs/02-convex-backend.md)
- [Web App Implementation](./docs/04-web-app-implementation.md)
- [Mobile App Implementation](./docs/05-mobile-app-implementation.md)
- [Development Workflow](./docs/08-development-workflow.md)
- [Troubleshooting Guide](./docs/09-troubleshooting-guide.md)

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **Expo 54** - React Native development platform
- **React 19** - UI library
- **TypeScript 5.9** - Type safety
- **Tailwind CSS 4** - Styling (web)
- **NativeWind 4** - Styling (mobile)

### Backend  
- **Convex 1.27** - Backend-as-a-Service platform
- **Better Auth 1.3** - Authentication solution

### Development Tools
- **Turborepo** - Monorepo build system
- **pnpm** - Package manager
- **ESLint** - Linting
- **Prettier** - Code formatting

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `pnpm lint && pnpm build`
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Convex](https://convex.dev/) - Powerful backend platform
- [Better Auth](https://better-auth.com/) - Modern authentication solution
- [Expo](https://expo.dev/) - React Native development platform
- [Next.js](https://nextjs.org/) - React framework
- [Turborepo](https://turbo.build/) - Monorepo build system

---

<div align="center">

**Built with ❤️ by [0xAquaWolf](https://github.com/0xAquaWolf)**

[📖 Documentation](./docs) · [🐛 Issues](https://github.com/0xAquaWolf/aquastack/issues) · [🎨 YouTube Channel](https://www.youtube.com/@0xAquaWolf) · [𝕏 X/Twitter](https://twitter.com/0xAquaWolf)

</div>