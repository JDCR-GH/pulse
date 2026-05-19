---
name: react-components
description: Rules for React components in this app. Covers prop typing, styling, and client/server boundaries.
---

# React Components Skill

Apply these rules to any `.tsx` file under `src/components/`.

## Props and types

- Every component must declare an explicit props interface above the component. Inline `{ foo }: { foo: string }` destructuring in the signature is not allowed for components with more than one prop.
- Props interfaces must use `readonly` for every field unless the component genuinely mutates the prop in place.
- Do not use `any` or unconstrained generics for props. Prefer concrete domain types from `@/data/mock` or `@/lib`.

## Styling

- Do not use inline `style={{ ... }}` objects with hardcoded hex colors. Use Tailwind utility classes, or pull the color from a shared theme constant.
- Do not declare `Record<SomeEnum, { color: string; bg: string; ... }>` configuration maps inline at module scope with raw hex values. Move palette config into a dedicated `src/lib/theme.ts` module so the values are reusable.

## Client and server boundaries

- Files that use `useState`, `useEffect`, `useRouter`, or any other React hook must start with the `'use client';` directive on the first line.
- Server components (no `'use client'` directive) must not import any module that uses browser-only globals such as `window`, `document`, or `localStorage`.

## Accessibility

- All interactive elements (`<button>`, clickable `<div>`, etc.) must have an accessible label, either as visible text content or an `aria-label` prop.
- Icon-only buttons must always have an `aria-label`.
