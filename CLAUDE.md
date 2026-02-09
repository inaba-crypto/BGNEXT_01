# CLAUDE.md — AI Assistant Guide for BGNEXT_01

## Project Overview

**BGNEXT_01** (BGNEXTサイト) is a web application project. The repository is currently in its initial state with scaffolding yet to be added.

- **Repository**: inaba-crypto/BGNEXT_01
- **Primary branch**: `main`

## Current Repository State

The project has been initialized but does not yet contain application code. As the project grows, this document should be updated to reflect the actual architecture, tooling, and conventions in use.

## Expected Technology Stack

Based on the project name and context, this project is expected to use:

- **Framework**: Next.js (React)
- **Language**: TypeScript
- **Styling**: TBD (likely Tailwind CSS)
- **Database**: TBD
- **Authentication**: TBD
- **Deployment**: TBD

> Update this section once the project is scaffolded.

## Directory Structure

```
BGNEXT_01/
├── README.md          # Project description
└── CLAUDE.md          # This file — AI assistant guide
```

> Update this section as directories are added (e.g., `src/`, `app/`, `public/`, `prisma/`, etc.).

## Development Commands

> Fill in once `package.json` is created. Expected commands:

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Run tests
npm test
```

## Coding Conventions

### General

- Use TypeScript for all source files
- Prefer functional components and hooks over class components
- Keep files focused and small — one component per file
- Use descriptive variable and function names
- Write comments only when logic is not self-evident

### Naming

- **Files/directories**: kebab-case (e.g., `user-profile.tsx`)
- **Components**: PascalCase (e.g., `UserProfile`)
- **Functions/variables**: camelCase (e.g., `getUserData`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_RETRY_COUNT`)
- **Types/Interfaces**: PascalCase (e.g., `UserProfile`)

### Git

- Write clear, concise commit messages in English
- Use conventional commit prefixes when appropriate: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`
- Keep commits atomic — one logical change per commit

## Key Decisions Log

Track important architectural and tooling decisions here as they are made.

| Date | Decision | Rationale |
|------|----------|-----------|
| — | — | — |

## Environment Variables

> Document required environment variables here once they are introduced.

```
# Example:
# DATABASE_URL=         # Database connection string
# NEXTAUTH_SECRET=      # Auth secret key
# NEXTAUTH_URL=         # Auth callback URL
```

## Testing

> Document testing strategy and patterns once tests are added.

## Deployment

> Document deployment process once configured.

## Notes for AI Assistants

- Always read existing code before proposing changes
- Follow the conventions already established in the codebase
- Do not add unnecessary abstractions or over-engineer solutions
- When adding dependencies, prefer well-maintained, widely-used packages
- Keep this CLAUDE.md file updated when making significant architectural changes
- Respect Japanese language content where it appears in the project (UI text, comments, etc.)
