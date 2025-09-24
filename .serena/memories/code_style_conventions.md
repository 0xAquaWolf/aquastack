# Code Style and Conventions

## Language Standards
- **TypeScript**: Strict mode enabled, latest ES features
- **React**: Version 19 with modern patterns (functional components, hooks)
- **File Extensions**: `.tsx` for React components, `.ts` for utilities

## Project Structure Conventions
- **Workspace packages**: Named with `@svq/` prefix (`@svq/web`, `@svq/mobile`, `@svq/ui`, `@svq/shared`)
- **Shared dependencies**: Use `workspace:*` protocol for internal packages
- **App routing**: 
  - Next.js App Router (file-based routing in `src/app/`)
  - Expo Router v5 (file-based routing in `app/` with `(tabs)` groups)

## Styling Approach
- **Web**: Tailwind CSS v4 with PostCSS
- **Mobile**: NativeWind (Tailwind for React Native)
- **Global styles**: CSS files (`globals.css`, `global.css`)

## Development Patterns
- **Mobile state management**: Zustand for client state
- **Authentication**: Centralized in `@svq/shared` package using better-auth
- **Component sharing**: UI components in `@svq/ui` package
- **Code quality**: ESLint + Prettier (mobile), ESLint only (web)

## Naming Conventions
- **Components**: PascalCase React components
- **Files**: kebab-case for most files, PascalCase for React components  
- **Packages**: Scoped with `@svq/` namespace