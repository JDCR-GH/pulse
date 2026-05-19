---
name: nextjs-api-routes
description: Rules for Next.js App Router route handlers. Covers input validation, response shape, and error handling.
---

# Next.js API Routes Skill

Apply these rules to any `route.ts` file under `src/app/api/`.

## Response shape

- Always return a `NextResponse.json(...)` response. Do not return a bare `Response` or a string.
- Every successful response must include a `status` field set to `'ok'` and a `timestamp` ISO string.
- Error responses must include an `error` field with a human-readable message and the appropriate HTTP status code passed as the second argument to `NextResponse.json`.

## Input validation

- Any handler that reads query params or a JSON body must validate the shape before use. Do not pass `request.json()` results directly into business logic.
- Reject unknown query params with a 400 response instead of silently ignoring them.

## Error handling

- Wrap all external calls (database, third-party APIs, file system) in `try/catch` and return a 502 with a stable error code in the body.
- Do not log entire request bodies or response bodies. Log only IDs, status codes, and timing.
- Do not log values that may contain PII such as email addresses, customer names, or Slack messages. Replace with hashes or omit entirely.

## Performance

- Route handlers must not fan out more than 3 concurrent external requests without explicit batching. Prefer `Promise.all` over sequential awaits when calls are independent.
