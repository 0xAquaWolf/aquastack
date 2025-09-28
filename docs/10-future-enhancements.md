# Future Enhancements

This roadmap captures forward-looking ideas for evolving the Convex + Better Auth stack in the SelfVision Quest monorepo. Items are grouped so you can mix near-term wins with longer-term architecture work.

## Feature Enhancements

### Rich Task Model
- Add categories, tags, and priority levels to the `tasks` table (Convex schema) with indexes for filtering
- Track due dates and progress metrics; expose helper mutations for updating status transitions
- Provide user-specific dashboards summarising completed vs. pending tasks

### Collaboration
- Introduce shared boards by linking tasks to a workspace/team table
- Add real-time presence indicators using Convex `query` subscriptions
- Implement comments or activity feeds stored in a related Convex table

### Better Auth Extensions
- Support OAuth providers (Google, GitHub) via Better Auth’s provider plugins
- Implement email verification and password reset flows using Convex actions + Better Auth `email` helpers
- Enforce role-based access (admin, member, guest) stored alongside user docs

## Architecture Improvements

### Convex Function Organisation
- Split Convex functions into directory modules (`tasks/`, `users/`, `analytics/`) for clarity
- Create service wrappers in `packages/shared` that compose multiple Convex calls for the clients

### Scheduled Jobs & Automation
- Use `convex/scheduler.ts` to run nightly clean-up jobs (e.g., archive completed tasks)
- Generate periodic summaries and email them via Better Auth + external email provider

### File & Asset Handling
- Leverage Convex file storage for attachments; expose signed URLs to web/mobile clients
- Process images/documents with background actions or external services when needed

## Performance Optimisations

### Indexing & Query Optimisation
- Audit Convex queries; add indexes (`.index(`) for frequent filters (status, due date, workspace)
- Implement pagination helpers using `ctx.db.query(...).paginate` for large lists
- Convert derived data to materialised views (e.g., daily metrics tables updated by scheduled mutations)

### Client Efficiency
- Memoise expensive selectors in Zustand stores
- Split React components to leverage Next.js Server Components where practical
- Prefetch commonly used Convex queries during navigation transitions

## Developer Experience

### Tooling
- Add `pnpm --filter @svq/convex type-check` script for faster schema validation during CI
- Provide code mods or scripts to scaffold new Convex functions with typed stubs
- Integrate Convex DevTools overlay in the web app for easier subscription debugging

### Documentation & Guides
- Expand docs on adding new Convex tables and updating shared exports
- Document auth flows and environment variable requirements for new contributors

## Testing Infrastructure

### Automated Tests
- Add Vitest unit tests for shared utilities (`packages/shared`)
- Create Playwright smoke tests hitting the Next.js app against a seeded Convex project
- Script Convex fixture loading (JSONL seeds) for repeatable test data

### Type Safety Gates
- Extend CI to run `pnpm build`, `pnpm lint`, and optional `pnpm type-check` on every PR
- Use Husky or lint-staged hooks to prevent commits when Convex types are stale

## Deployment Enhancements

### Environment Promotion
- Adopt environment groups in Convex (dev/staging/prod) with separate auth secrets
- Automate `npx convex deploy` via CI/CD pipeline triggered on tagged releases
- Store environment metadata (URLs, keys) in a secure secrets manager consumed by both clients

### Observability
- Forward Convex logs to a central service (e.g., Logtail, Datadog)
- Add Sentry (web/mobile) for client error visibility
- Track feature usage via simple analytics events stored in Convex or a third-party service

## Security & Compliance

- Enforce MFA on Better Auth accounts when providers support it
- Implement Convex middleware that checks roles before executing mutations
- Log critical actions (deletions, permission changes) to an audit trail table for later review

---

Prioritise enhancements that keep schema changes small and leverage Convex’s strengths (real-time data, scheduler, file storage). Each improvement should include updates to shared types so both clients stay in lockstep.
