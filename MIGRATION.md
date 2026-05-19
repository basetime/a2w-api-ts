# Migration Guide

## v1.x to v2.0.0

### Workflow job methods moved to `client.workflows.jobs`

The five flat job methods on `WorkflowsEndpoint` (`getJobs`, `getJob`, `updateJob`,
`addJobLog`, `getJobStatus`) have moved to a dedicated `WorkflowJobsEndpoint` exposed as
`client.workflows.jobs`. Wire URLs, verbs, and bodies are byte-for-byte identical.

| v1.x                                         | v2.0.0                                         |
| -------------------------------------------- | ---------------------------------------------- |
| `client.workflows.getJobs(workflowId)`       | `client.workflows.jobs.getAll(workflowId)`     |
| `client.workflows.getJob(jobId)`             | `client.workflows.jobs.getById(jobId)`         |
| `client.workflows.updateJob(jobId, body)`    | `client.workflows.jobs.update(jobId, body)`    |
| `client.workflows.addJobLog(jobId, message)` | `client.workflows.jobs.addLog(jobId, message)` |
| `client.workflows.getJobStatus(jobId)`       | `client.workflows.jobs.getStatus(jobId)`       |

`client.workflows.run(...)` and the workflow-level CRUD (`getAll`, `getById`, `create`,
`update`, `delete`, `getSnippets`) stay on the parent endpoint. The new
`WorkflowJobsEndpoint` is re-exported from the package root.

### Types are Zod-generated

Every type in `src/types/` is now defined as a Zod schema with an inferred TypeScript
type:

```ts
export const FooSchema = z
  .object({
    /* ... */
  })
  .passthrough();
export type Foo = z.infer<typeof FooSchema>;
```

Both the schema and the type are re-exported from the package root. Type-only consumers
need no changes — `import type { Campaign } from '@basetime/a2w-api-ts'` still works.

At request time, the SDK runs every response through `schema.safeParse(...)`. On a
**success** the parsed value is returned; on a **failure** the issue list is logged via
the requester's logger (`req.getLogger().error('Response shape mismatch', { issues, url })`)
and the **raw, unvalidated** payload is returned as `T`. This is a non-throwing mode by
design — see [Runtime validation in the README](README.md#runtime-validation) — so a
backend response with an unexpected field never crashes a caller, but it does produce a
log entry that consumers wiring `console` as their logger will see.

A few specific Zod-related notes:

- All object schemas use `.passthrough()`. Unknown server-added fields are preserved on
  the parsed value.
- `Date` fields use `z.coerce.date()`, so ISO strings parse correctly.
- Fields previously typed as `any` (e.g. `Campaign.importConfig`, `Job.Task.config`,
  `CampaignWalletsResponse.bundled` / `bundles`) are now `unknown`.
- Unions like `JobStatus`, `JobMode`, `MetaValue`, and `BarcodeType` are `z.enum`s.

If you want strict validation (throw on shape mismatch), call `Schema.parse(value)`
yourself — the schemas are exported for exactly this case.

## v0.4.x to v1.0.0

v1.0.0 reshuffles the SDK's internals: the HTTP transport is extracted out of
`Client` into a new `HttpRequester` (exposed as `client.http`), the `Endpoint`
base class has been redesigned around a path-bound verb wrapper, and one
endpoint file has been renamed. The public per-endpoint method surface
(`client.campaigns.*`, `client.templates.*`, `client.scanners.*`, etc.) is
**unchanged**, so most callers only need to touch `Client`-level setup.

## At-a-glance checklist

- You call `client.fetch(...)`, `client.setBaseUrl(...)`, `client.setAuth(...)`,
  or `client.setUserAgent(...)`. → See
  [Client HTTP methods moved to `client.http`](#client-http-methods-moved-to-clienthttp).
- You read `client.auth`. → See
  [Client HTTP methods moved to `client.http`](#client-http-methods-moved-to-clienthttp).
- You import `Requester` from a deep path or pass a hand-rolled `Requester`
  (for example, a test mock). → See
  [`Requester` interface expanded and moved](#requester-interface-expanded-and-moved).
- You subclass `Endpoint` to add a custom endpoint. → See
  [`Endpoint` base class refactor (subclassers only)](#endpoint-base-class-refactor-subclassers-only).
- You import from `@basetime/a2w-api-ts/dist/endpoint/Scanners`. → See
  [`Scanners` file rename](#scanners-file-rename).
- You call any per-campaign helper on `client.campaigns` (passes, claims,
  jobs, stats, enrollments) or set `client.campaigns.jwtEncode`. → See
  [`CampaignsEndpoint` split into sub-endpoints](#campaignsendpoint-split-into-sub-endpoints).
- You only use the bundled endpoint methods on `client.templates`,
  `client.organizations`, `client.scanners`, `client.workflows`,
  `client.images`, `client.claims`, or the campaign-level
  `client.campaigns.getAll()` / `getById()`. → You can skip the rest of this
  document; see [What did not change](#what-did-not-change).

## Breaking changes

### `Client` HTTP methods moved to `client.http`

`Client` is now a thin composition root that owns an `HttpRequester` instance
(see [src/Client.ts](src/Client.ts) and
[src/http/HttpRequester.ts](src/http/HttpRequester.ts)) and constructs each
bundled endpoint against it. All HTTP-level configuration and the low-level
`fetch` helper now live on `client.http`.

```ts
// v0.4.x
client.setBaseUrl('https://staging.example.com');
client.setAuth(new KeysProvider(id, secret));
client.setUserAgent('my-app/1.0.0');
client.fetch('/templates/simple/abc');
const provider = client.auth;
```

```ts
// v1.0.0
client.http.setBaseUrl('https://staging.example.com');
client.http.setAuth(new KeysProvider(id, secret));
client.http.setUserAgent('my-app/1.0.0');
client.http.fetch('/templates/simple/abc');
const provider = client.http.auth;
```

### `CampaignsEndpoint` split into sub-endpoints

`CampaignsEndpoint` no longer exposes per-resource methods directly. Pass,
claim, job, stat, and enrollment helpers have moved onto five dedicated
sub-endpoint classes exposed as `public readonly` props, mirroring the way
`Client` composes its top-level endpoints (see
[src/endpoint/CampaignsEndpoint.ts](src/endpoint/CampaignsEndpoint.ts)).

Only top-level campaign operations stay on the parent:

- `client.campaigns.getAll()` (unchanged)
- `client.campaigns.getById(id)` (unchanged)

Every other method moves; wire URLs, verbs, and bodies are **byte-for-byte
identical**. Quick reference:

| v0.4.x / earlier v1.0.0                                          | v1.0.0                                                                  |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `client.campaigns.getPasses(campaignId)`                         | `client.campaigns.passes.getAll(campaignId)`                            |
| `client.campaigns.getPass(campaignId, passId, scanner?)`         | `client.campaigns.passes.getById(campaignId, passId, scanner?)`         |
| `client.campaigns.queryPasses(campaignId, queries?)`             | `client.campaigns.passes.query(campaignId, queries?)`                   |
| `client.campaigns.updatePass(campaignId, passId, body)`          | `client.campaigns.passes.update(campaignId, passId, body)`              |
| `client.campaigns.mergeObjectStore(campaignId, passId, body)`    | `client.campaigns.passes.mergeObjectStore(campaignId, passId, body)`    |
| `client.campaigns.deleteObjectStoreKeys(campaignId, passId, …)`  | `client.campaigns.passes.deleteObjectStoreKeys(campaignId, passId, …)`  |
| `client.campaigns.updatePasses(campaignId, passes)`              | `client.campaigns.passes.updateMany(campaignId, passes)`                |
| `client.campaigns.appendLog(campaignId, passId, log)`            | `client.campaigns.passes.appendLog(campaignId, passId, log)`            |
| `client.campaigns.createBundle(campaignId, meta?, store?, utm?)` | `client.campaigns.passes.createBundle(campaignId, meta?, store?, utm?)` |
| `client.campaigns.getPassesByJob(campaignId, jobId)`             | `client.campaigns.passes.getByJob(campaignId, jobId)`                   |
| `client.campaigns.redeemPass(campaignId, passId)`                | `client.campaigns.passes.redeem(campaignId, passId)`                    |
| `client.campaigns.getRedeemedStatus(campaignId, passId)`         | `client.campaigns.passes.getRedeemedStatus(campaignId, passId)`         |
| `client.campaigns.getClaims(campaignId)`                         | `client.campaigns.claims.getAll(campaignId)`                            |
| `client.campaigns.getJobs(campaignId)`                           | `client.campaigns.jobs.getAll(campaignId)`                              |
| `client.campaigns.getStats(campaignId)`                          | `client.campaigns.stats.get(campaignId)`                                |
| `client.campaigns.getEnrollments(campaignId)`                    | `client.campaigns.enrollments.getAll(campaignId)`                       |
| `client.campaigns.createEnrollment(campaignId, meta?, form?)`    | `client.campaigns.enrollments.create(campaignId, meta?, form?)`         |
| `client.campaigns.jwtEncode = fn`                                | `client.campaigns.enrollments.jwtEncode = fn`                           |

The `jwtEncode` hook moved with `createEnrollment` because that's the only
method that uses it. The error message thrown when it's missing also moved
and now mentions `CampaignEnrollmentsEndpoint.create()` instead of
`CampaignsEndpoint.createEnrollment()`.

Example:

```ts
// v0.4.x / earlier v1.0.0
client.campaigns.jwtEncode = encode;
const passes = await client.campaigns.getPasses(campaignId);
const pass = await client.campaigns.getPass(campaignId, passId);
const enrollment = await client.campaigns.createEnrollment(campaignId);
```

```ts
// v1.0.0
client.campaigns.enrollments.jwtEncode = encode;
const passes = await client.campaigns.passes.getAll(campaignId);
const pass = await client.campaigns.passes.getById(campaignId, passId);
const enrollment = await client.campaigns.enrollments.create(campaignId);
```

The new sub-endpoint classes are also re-exported from the package root for
type-only consumers: `CampaignPassesEndpoint`, `CampaignClaimsEndpoint`,
`CampaignJobsEndpoint`, `CampaignStatsEndpoint`, `CampaignEnrollmentsEndpoint`.
