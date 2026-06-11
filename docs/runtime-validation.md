# Runtime validation

Starting with v2.0.0, every type in `src/types/` is defined as a
[Zod](https://zod.dev/) schema with an inferred TypeScript type. Both the schema and the
type are re-exported from the package root:

```ts
import { CampaignSchema, type Campaign } from '@basetime/a2w-api-ts';
```

At request time, the SDK runs each response through `schema.safeParse(...)`:

- On **success** the parsed value is returned.
- On **failure** the issue list is logged via the requester's logger as
  `Response shape mismatch` and the **raw, unvalidated** payload is returned as `T`.

This is intentionally non-throwing: a backend response with an unexpected field never
crashes a caller, but the mismatch is surfaced loudly to whatever `Logger` was wired in
when constructing the `Client` (`console.error` if you passed `console`). Schemas are
defensive — `.passthrough()` is used everywhere — so most "new field on the server" cases
silently produce a valid parse.

If you need stricter validation (throw on shape mismatch), import the schema and call
`.parse(...)` yourself:

```ts
import { CampaignSchema } from '@basetime/a2w-api-ts';

const campaign = CampaignSchema.parse(await client.campaigns.getById('h8X2JxgrnEsu2U0dI8KN'));
```

Consumers that don't want the runtime validation overhead at all can simply type-import
(`import type { Campaign }`), and treat the SDK's response shapes as plain TypeScript
types — Zod is bundled into the SDK so there is no extra peer-dependency setup required.
