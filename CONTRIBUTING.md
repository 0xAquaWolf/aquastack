# Contributing to AquaStack

Thank you for your interest in contributing to AquaStack! This guide will help you get started.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm 9+
- Expo CLI (for mobile development)
- Git

### Setup

1. **Fork the repository**
   ```bash
   # Fork the repo on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/aquastack.git
   cd aquastack
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Set up environment variables**
   ```bash
   # Copy example environment files
   cp apps/convex/.env.example apps/convex/.env.local
   cp apps/web/.env.example apps/web/.env.local
   cp apps/mobile/.env.example apps/mobile/.env.local
   
   # Fill in your values (see README.md for details)
   ```

## 🛠️ Development

### Running the Project

```bash
# Start all services
pnpm dev

# Or start individually:
pnpm --filter @aqua/convex dev    # Convex backend
pnpm --filter @aqua/web dev       # Next.js web app  
pnpm --filter @aqua/mobile dev    # Expo mobile app
```

### Project Structure

```
aquastack/
├── apps/
│   ├── web/                 # Next.js web application
│   ├── mobile/              # Expo React Native app
│   └── convex/              # Convex backend
├── packages/
│   ├── ui/                  # Shared UI components
│   ├── shared/              # Shared types and utilities
│   └── config/              # Shared configuration
└── docs/                    # Documentation
```

### Code Style

This project uses:

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Type safety

Run linting and formatting:
```bash
pnpm lint
pnpm format
```

## 📝 Types of Contributions

### 🐛 Bug Reports

1. Check existing [issues](https://github.com/0xAquaWolf/aquastack/issues)
2. Create a new issue with:
   - Clear description of the bug
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details

### ✨ Feature Requests

1. Check existing issues and discussions
2. Create a new issue with:
   - Feature description
   - Use case and motivation
   - Possible implementation approach

### 💻 Code Contributions

#### Before You Start

- Discuss the change in an issue first
- Ensure it aligns with the project's goals
- Keep changes focused and minimal

#### Making Changes

1. **Backend Changes** (Convex):
   - Edit files in `apps/convex/convex/`
   - Test with `npx convex dev`
   - Update types if needed

2. **Web App Changes**:
   - Edit files in `apps/web/src/`
   - Test with `pnpm --filter @aqua/web dev`

3. **Mobile App Changes**:
   - Edit files in `apps/mobile/`
   - Test with `pnpm --filter @aqua/mobile dev`

4. **Shared Packages**:
   - UI components: `packages/ui/`
   - Types/utilities: `packages/shared/`

#### Testing Your Changes

```bash
# Run linting
pnpm lint

# Run type checking  
pnpm type-check

# Build all packages
pnpm build

# Test individual packages
pnpm --filter @aqua/web test
pnpm --filter @aqua/mobile test
```

#### Submitting Changes

1. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

2. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create a Pull Request**:
   - Use clear title and description
   - Reference related issues
   - Include screenshots if applicable
   - Ensure CI passes

## 📖 Documentation

### Updating Documentation

- **README.md**: Project overview, setup, and usage
- **docs/**: Detailed guides and API documentation
- **Code comments**: Complex logic explanations

### Documentation Style

- Use clear, concise language
- Include code examples
- Add screenshots where helpful
- Keep documentation up-to-date with code changes

## 🎯 Areas for Contribution

### High Priority

- **Bug fixes**: Stability and reliability improvements
- **Documentation**: Better guides and examples
- **Testing**: Unit and integration tests

### Feature Ideas

- **Additional auth providers**: Discord, Twitter, etc.
- **UI components**: More shared components
- **Mobile features**: Camera, notifications, etc.
- **Performance optimizations**: Bundle size, runtime performance
- **Developer tools**: Better debugging, CLI tools

### Infrastructure

- **CI/CD**: GitHub Actions improvements
- **Deployment**: Docker, Vercel, etc.
- **Monitoring**: Error tracking, analytics

## 🤝 Code Review Process

### Reviewing PRs

1. **Automated checks**: Ensure CI passes
2. **Code review**: Check for:
   - Code quality and style
   - Type safety
   - Performance implications
   - Breaking changes
   - Documentation updates

### Getting Your PR Merged

1. **Address feedback**: Make requested changes
2. **Keep discussions focused**: Be constructive
3. **Be patient**: Reviewers may need time

## 🏷️ Commit Message Convention

We use [Conventional Commits](https://conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix  
- `docs`: Documentation
- `style`: Code style (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Build process, dependency updates

**Examples**:
```bash
feat(auth): add Google OAuth provider
fix(web): resolve mobile responsive layout issue
docs(readme): update installation instructions
```

## 🚀 Release Process

Releases are automated through semantic versioning:

1. **Version bump**: Based on commit messages
2. **Changelog**: Auto-generated
3. **Tags**: Created automatically
4. **Releases**: Published to GitHub

## 💬 Community

### Getting Help

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and ideas
- **Documentation**: Check existing docs first

### Code of Conduct

Be respectful, inclusive, and constructive. We're here to build great software together.

## 📄 License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).

---

**Thank you for contributing to AquaStack! 🎉**