# Documentation Index

This is the main index for all SelfVision Quest Vite + React + Convex documentation.

## Quick Start

- [**Architecture Overview**](./01-architecture-overview.md) - High-level architecture and features
- [**Testing Guide**](./06-testing-guide.md) - Quick way to test the complete system
- [**Development Workflow**](./08-development-workflow.md) - Daily development commands and processes

## Core Documentation

### 1. System Architecture
- [**Architecture Overview**](./01-architecture-overview.md) - Architecture and key features
- [**Type Safety Deep Dive**](./07-type-safety-deep-dive.md) - Comprehensive type safety explanation

### 2. Implementation Details
- [**Convex Backend Implementation**](./02-convex-backend.md) - Convex backend setup and API endpoints
- [**Shared Types Package**](./03-shared-types-package.md) - Central type management
- [**Web App Implementation**](./04-web-app-implementation.md) - Vite + React web app details
- [**Mobile App Implementation**](./05-mobile-app-implementation.md) - Expo mobile app details

### 3. Development and Operations
- [**Testing Guide**](./06-testing-guide.md) - Comprehensive testing instructions
- [**Development Workflow**](./08-development-workflow.md) - Development processes and commands
- [**Troubleshooting Guide**](./09-troubleshooting-guide.md) - Common issues and solutions

### 4. Future Planning
- [**Future Enhancements**](./10-future-enhancements.md) - Roadmap for future improvements

## Quick Reference

### Architecture Diagram
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web App       │    │   Mobile App    │    │   Shared Types  │
│  (Vite + React) │    │   (Expo)        │    │   Package       │
│                 │    │                 │    │                 │
│ - TanStack Rtr  │◄──►│ - Zustand       │◄──►│ - Convex Types  │
│ - Convex Client│    │ - Convex Client │    │ - Shared Utils  │
│ - Type Safe     │    │ - Type Safe     │    │ - UI Components │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Backend       │
                    │   (Convex)      │
                    │                 │
                    │ - Real-time     │
                    │ - Type Safe     │
                    │ - Auto-scaling  │
                    │ - Auth Ready    │
                    └─────────────────┘
```

### Key Commands
```bash
# Install dependencies
pnpm install

# Start all services
pnpm dev

# Build all packages
pnpm build

# Test the system
# See Testing Guide
```

### Port Configuration
- **Convex Backend**: Real-time sync (managed by Convex)
- **Web App**: `http://localhost:5173` (Vite dev server)
- **Mobile App**: `http://localhost:8081` (Expo dev server)

### File Structure
```
docs/
├── 01-architecture-overview.md
├── 02-convex-backend.md
├── 03-shared-types-package.md
├── 04-web-app-implementation.md
├── 05-mobile-app-implementation.md
├── 06-testing-guide.md
├── 07-type-safety-deep-dive.md
├── 08-development-workflow.md
├── 09-troubleshooting-guide.md
└── 10-future-enhancements.md
```

## Getting Started

### New Developer Onboarding
1. Read the [Architecture Overview](./01-architecture-overview.md)
2. Follow the [Development Workflow](./08-development-workflow.md)
3. Test your setup using the [Testing Guide](./06-testing-guide.md)
4. Refer to [Troubleshooting](./09-troubleshooting-guide.md) if you encounter issues

### System Testing
1. Start the Convex backend: `cd apps/convex && pnpm dev`
2. Start the web app: `cd apps/web && pnpm dev`
3. Start the mobile app: `cd apps/mobile && pnpm dev`
4. Follow the [Testing Guide](./06-testing-guide.md) for comprehensive testing

### Type Safety Verification
1. Read the [Type Safety Deep Dive](./07-type-safety-deep-dive.md)
2. Run `pnpm build` to verify TypeScript compilation
3. Check IDE autocompletion for API methods
4. Test type propagation by modifying API schemas

## Common Tasks

### Adding New API Endpoints
1. Update `apps/api/src/index.ts`
2. Add new types to `packages/shared/`
3. Update frontend hooks/services
4. Test with the [Testing Guide](./06-testing-guide.md)

### Debugging Issues
1. Check the [Troubleshooting Guide](./09-troubleshooting-guide.md)
2. Verify API server is running on port 3333
3. Check browser/mobile app console for errors
4. Test API endpoints directly with curl

### Deployment Preparation
1. Review [Future Enhancements](./10-future-enhancements.md) for deployment ideas
2. Ensure all tests pass
3. Check environment variables
4. Verify production builds work correctly

## Contributing

### Adding Documentation
1. Create new markdown files in the `docs/` directory
2. Follow the existing naming convention: `##-topic-name.md`
3. Update this index (`README.md`) to include new documentation
4. Use clear headings and code examples

### Updating Documentation
1. Keep documentation in sync with code changes
2. Update examples when APIs change
3. Add troubleshooting steps for common issues
4. Review and improve existing documentation regularly

## Support

### Getting Help
1. Check the [Troubleshooting Guide](./09-troubleshooting-guide.md)
2. Review the [Development Workflow](./08-development-workflow.md)
3. Examine the specific implementation documentation
4. Check community resources for Elysia, React Query, and Expo

### Known Issues
- CORS issues when API server is not running
- Type errors when shared package is not built
- Mobile app cache issues requiring `expo r -c`
- Port conflicts requiring process cleanup

See the [Troubleshooting Guide](./09-troubleshooting-guide.md) for solutions to these and other common issues.

---

**Last Updated**: January 2024
**Version**: 1.0.0
**Maintainers**: SelfVision Quest Team
