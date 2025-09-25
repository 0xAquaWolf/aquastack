# Task Completion Checklist

## After Making Code Changes

### Web App
1. **Type checking**: Ensure TypeScript compiles without errors
2. **Linting**: Run `pnpm lint` in `apps/web`
3. **Build verification**: Run `pnpm build` to ensure production build works
4. **Dev server**: Verify `pnpm dev` starts without errors

### Mobile App
1. **Linting and formatting**: Run `pnpm lint` in `apps/mobile`
2. **Type checking**: Ensure TypeScript compiles
3. **Platform testing**: Test on both iOS and Android if native changes made
4. **Expo prebuild**: Run `pnpm prebuild` if native dependencies changed

### Shared Packages
1. **Type checking**: Run `pnpm type-check` in affected packages
2. **Build**: Run `pnpm build` in packages that need compilation
3. **Dependency updates**: Ensure consuming apps work after shared package changes

### Monorepo Level
1. **Turbo build**: Run `turbo build` to ensure all packages build successfully
2. **Cross-app compatibility**: Verify changes work across both web and mobile apps
3. **Workspace dependencies**: Ensure internal package references are correct

## No Testing Framework
Currently no test suites are configured in the project. Manual testing is required for verification.
