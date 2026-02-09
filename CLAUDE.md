# CLAUDE.md — AI Assistant Guide for BGNEXT_01

## Project Overview

**BGNEXT_01** is a web application project ("BGNEXTサイト"). The repository is in its initial setup phase.

- **Repository**: inaba-crypto/BGNEXT_01
- **Primary language**: Japanese (UI/content), English (code/comments)
- **Status**: Greenfield — no framework or dependencies initialized yet

## Repository Structure

```
BGNEXT_01/
├── CLAUDE.md          # This file — AI assistant guide
└── README.md          # Project description
```

> **Note**: This file should be updated as the project evolves. When adding new directories, frameworks, or conventions, reflect those changes here.

## Development Setup

No tooling has been configured yet. When initializing the project, follow these conventions:

### Recommended Stack (based on project name and context)

- **Framework**: Next.js (App Router)
- **Language**: TypeScript (strict mode)
- **Package manager**: npm
- **Styling**: Tailwind CSS
- **Linting**: ESLint with Next.js config
- **Formatting**: Prettier

### Getting Started (once initialized)

```bash
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Production build
npm run lint         # Run linter
```

## Git Workflow

### Branch Naming

- Feature branches use the pattern: `claude/<description>-<id>`
- The default branch is `main`

### Commit Messages

- Write clear, concise commit messages in English
- Use imperative mood ("Add feature" not "Added feature")
- Keep the subject line under 72 characters

### Push Rules

- Always push with: `git push -u origin <branch-name>`
- Never force-push to `main`
- Branch names must start with `claude/` and include the session ID suffix

## Coding Conventions

### General

- Use TypeScript with strict mode enabled
- Prefer named exports over default exports
- Use `const` by default; use `let` only when reassignment is needed
- Keep functions small and focused on a single responsibility

### File & Directory Naming

- Components: PascalCase (`UserProfile.tsx`)
- Utilities/helpers: camelCase (`formatDate.ts`)
- Directories: kebab-case (`user-settings/`)
- Constants: UPPER_SNAKE_CASE for module-level constants

### React / Next.js

- Use functional components with hooks
- Prefer Server Components by default; add `"use client"` only when needed
- Colocate related files (component, styles, tests) in the same directory
- Use the Next.js App Router (`app/` directory) over Pages Router

### Styling

- Use Tailwind CSS utility classes
- Extract repeated patterns into component-level abstractions, not global CSS
- Keep responsive design mobile-first

### Error Handling

- Validate inputs at system boundaries (API routes, form submissions)
- Use Next.js error boundaries (`error.tsx`) for page-level error handling
- Log errors with sufficient context for debugging

## Testing

No testing framework has been configured yet. When added:

- Place test files adjacent to source files (`Component.test.tsx`)
- Use descriptive test names that explain the expected behavior
- Test user-facing behavior, not implementation details

## Environment Variables

- Store secrets in `.env.local` (never committed)
- Document required variables in `.env.example`
- Access via `process.env.NEXT_PUBLIC_*` for client-side, `process.env.*` for server-side

## Key Decisions Log

| Date       | Decision                              | Rationale                     |
|------------|---------------------------------------|-------------------------------|
| 2026-02-09 | Repository initialized                | Project kickoff               |
| 2026-02-09 | CLAUDE.md created                     | AI assistant guidance          |

## Important Notes for AI Assistants

1. **Read before editing** — Always read existing files before proposing changes
2. **Minimal changes** — Only modify what is directly requested; avoid over-engineering
3. **No guessing** — If requirements are unclear, ask rather than assume
4. **Keep this file updated** — When you add frameworks, directories, or conventions, update this CLAUDE.md accordingly
5. **Japanese content** — The application serves Japanese-speaking users; UI text should be in Japanese unless specified otherwise
6. **Security first** — Never commit secrets, credentials, or `.env` files; validate all user inputs
