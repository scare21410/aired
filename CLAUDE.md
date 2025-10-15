# AGENTS.md

## Setup commands
- Install deps: `pnpm install`
- Start dev server: `pnpm dev`
- Run tests: `pnpm test`

## Code style
- TypeScript strict mode
- Single quotes
- Use functional programming patterns where possible (map, filter, reduce)
- Use classical function declarations when creating functions
- For file names, use kebab case
- Do not include comments in the generated code. Code should be self-explanatory.

## Domain objects
- We use DDD and Clean Architecture
- Use branded types for domain object parameter types, using zod for creating branded types
- Use aggregate, entity and value directories for domain objects

## Testing
- Use file.spec.ts for unit tests
- Use file.itest.ts for integration tests
- Use vitest as a testing framework