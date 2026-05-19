---
name: external-integrations
description: Rules for modules in src/lib that wrap third-party services (Slack, Gong, Pylon, Grafana, Anthropic).
---

# External Integrations Skill

Apply these rules to any `.ts` file under `src/lib/` that wraps a third-party service.

## Error handling

- Never use `console.error` for failures. Use a structured logger (or, at minimum, throw an Error with a meaningful message and `cause` set to the original error).
- Catch blocks must not swallow errors silently. Either rethrow with `cause`, return a typed error result, or log structured context. Returning `null` on failure without logging is not acceptable.
- Do not narrow the caught `error` to `Error` in the catch parameter. Type it as `unknown` and use a runtime check before accessing fields.

## Timeouts and retries

- Every HTTP call to an external service must have an explicit timeout (via `AbortSignal.timeout` or the SDK's timeout option). Default Node.js socket timeouts are not acceptable.
- Reads that paginate must have a maximum page count to avoid runaway loops. Document the limit in a comment if it is not obvious.

## Secrets and logging

- Never log API tokens, bearer tokens, or values read from `process.env` that match `*_TOKEN`, `*_SECRET`, or `*_KEY`.
- Do not log full response bodies from third-party services. Log only the IDs and counts needed for debugging.

## Module-level state

- Do not instantiate SDK clients at module scope using `process.env` values that may be undefined. Wrap construction in a function that throws a clear error if the required env vars are missing.
