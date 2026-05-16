# Migration Guide

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
client.http.fetch('/templates/simple/abc');
client.http.setBaseUrl('https://staging.example.com');
client.http.setAuth(new KeysProvider(id, secret));
client.http.setUserAgent('my-app/1.0.0');
const provider = client.http.auth;
```

`Client` no longer `implements Requester`. If you previously typed a variable
as `Requester` and pointed it at a `Client`, point it at `client.http`
instead:

```ts
// v0.4.x
const req: Requester = client;
```

```ts
// v1.0.0
const req: Requester = client.http;
```

### `Requester` interface expanded and moved

The `Requester` interface has moved from `src/types/Requester` to
[src/http/Requester.ts](src/http/Requester.ts) and grown to describe the full
HTTP layer rather than just `fetch`.

- **Module path.** The package-root re-export
  `import { Requester } from '@basetime/a2w-api-ts'` keeps working because
  [src/index.ts](src/index.ts) now re-exports from the new location. **Deep
  imports break**:

  ```ts
  // v0.4.x — no longer resolves
  import { Requester } from '@basetime/a2w-api-ts/dist/types/Requester';
  ```

  ```ts
  // v1.0.0 — prefer the package root
  import { Requester } from '@basetime/a2w-api-ts';
  // or, if you must deep-import:
  import { Requester } from '@basetime/a2w-api-ts/dist/http/Requester';
  ```

- **Surface.** The interface grew from a single `fetch` method to
  `setBaseUrl`, `setAuth`, `setUserAgent`, `fetch`, `doGet`, `doPost`,
  `doPut`, and `doDelete`. Anyone passing a hand-rolled `Requester` (typically
  a test mock) must implement the full surface. The easiest path is to
  subclass or spy `HttpRequester` rather than implement the interface from
  scratch:

  ```ts
  // v1.0.0
  import { HttpRequester } from '@basetime/a2w-api-ts';

  class FakeRequester extends HttpRequester {
    public override fetch = async <T>(): Promise<T> => ({}) as T;
  }
  ```

### `Endpoint` base class refactor (subclassers only)

This section only affects callers that **subclass `Endpoint`** to add custom
endpoints. The bundled endpoints retain their original public method
signatures, so consumers of `client.campaigns`, `client.templates`, etc., can
skip ahead.

The base class now owns the endpoint path and exposes two pre-bound helpers
(see [src/endpoint/Endpoint.ts](src/endpoint/Endpoint.ts) and
[src/endpoint/EndpointDo.ts](src/endpoint/EndpointDo.ts)):

- `this.do` — an `EndpointDo` verb wrapper (`get` / `post` / `put` / `del` /
  `fetch`) that prepends the endpoint path automatically.
- `this.qb` — a `QueryBuilder` for templated URLs with `{name}` placeholders
  and ordered query params.

Changes for subclassers:

- **Constructor.** `super(req)` becomes `super(req, '/your-prefix')`. The
  path prefix is now owned by the base class instead of a module-level
  constant.
- **Relative paths.** Paths passed to the verb helpers are now relative to
  the prefix — no more `${endpoint}/foo` concatenations.
- **Verb methods.** `this.doGet` / `this.doPost` / `this.doPut` /
  `this.doDelete` are gone; use `this.do.get` / `this.do.post` /
  `this.do.put` / `this.do.del` / `this.do.fetch`. Note `delete` → `del` to
  avoid the JS reserved word.

Before and after of a small subclass (mirrors the old `ImagesEndpoint`):

```ts
// v0.4.x
import { Image } from '../types/Image';
import Endpoint from './Endpoint';

const endpoint = '/images';

export default class ImagesEndpoint extends Endpoint {
  public getById = async (id: string): Promise<Image | null> => {
    return await this.doGet<Image | null>(`${endpoint}/${id}`);
  };

  public getByIds = async (ids: string[]): Promise<Image[]> => {
    return await this.doGet<Image[]>(`${endpoint}/ids?ids=${ids.join(',')}`);
  };
}
```

```ts
// v1.0.0
import { Requester } from '../http/Requester';
import { Image } from '../types/Image';
import Endpoint from './Endpoint';

export default class ImagesEndpoint extends Endpoint {
  constructor(req: Requester) {
    super(req, '/images');
  }

  public getById = async (id: string): Promise<Image | null> => {
    return await this.do.get(`/${id}`);
  };

  public getByIds = async (ids: string[]): Promise<Image[]> => {
    const url = this.qb.create('/ids').addQuery('ids', ids.join(','));
    return await this.do.get(url);
  };
}
```

For templated URLs with multiple placeholders and query params, prefer
`this.qb` over manual string interpolation (taken from
[src/endpoint/CampaignsEndpoint.ts](src/endpoint/CampaignsEndpoint.ts)):

```ts
const url = this.qb.create('/{campaign}/passes/details/{pass}')
  .addParam('campaign', campaignId)
  .addParam('pass', passId)
  .addQuery('scanner', JSON.stringify(scanner));
return await this.do.get(url);
```

### `Scanners` file rename

`src/endpoint/Scanners.ts` has been renamed to
[src/endpoint/ScannersEndpoint.ts](src/endpoint/ScannersEndpoint.ts). This
only affects deep imports; the class itself is unchanged:

```ts
// v0.4.x — no longer resolves
import ScannersEndpoint from '@basetime/a2w-api-ts/dist/endpoint/Scanners';
```

```ts
// v1.0.0 — prefer the package root
import { ScannersEndpoint } from '@basetime/a2w-api-ts';
```

`ScannersEndpoint` is now re-exported from the package root in
[src/index.ts](src/index.ts) alongside the new `HttpRequester` export, so the
root import is preferred over any deep path.

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

| v0.4.x / earlier v1.0.0                                          | v1.0.0                                                                       |
| ---------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `client.campaigns.getPasses(campaignId)`                         | `client.campaigns.passes.getAll(campaignId)`                                 |
| `client.campaigns.getPass(campaignId, passId, scanner?)`         | `client.campaigns.passes.getById(campaignId, passId, scanner?)`              |
| `client.campaigns.queryPasses(campaignId, queries?)`             | `client.campaigns.passes.query(campaignId, queries?)`                        |
| `client.campaigns.updatePass(campaignId, passId, body)`          | `client.campaigns.passes.update(campaignId, passId, body)`                   |
| `client.campaigns.mergeObjectStore(campaignId, passId, body)`    | `client.campaigns.passes.mergeObjectStore(campaignId, passId, body)`         |
| `client.campaigns.deleteObjectStoreKeys(campaignId, passId, …)`  | `client.campaigns.passes.deleteObjectStoreKeys(campaignId, passId, …)`       |
| `client.campaigns.updatePasses(campaignId, passes)`              | `client.campaigns.passes.updateMany(campaignId, passes)`                     |
| `client.campaigns.appendLog(campaignId, passId, log)`            | `client.campaigns.passes.appendLog(campaignId, passId, log)`                 |
| `client.campaigns.createBundle(campaignId, meta?, store?, utm?)` | `client.campaigns.passes.createBundle(campaignId, meta?, store?, utm?)`      |
| `client.campaigns.getPassesByJob(campaignId, jobId)`             | `client.campaigns.passes.getByJob(campaignId, jobId)`                        |
| `client.campaigns.redeemPass(campaignId, passId)`                | `client.campaigns.passes.redeem(campaignId, passId)`                         |
| `client.campaigns.getRedeemedStatus(campaignId, passId)`         | `client.campaigns.passes.getRedeemedStatus(campaignId, passId)`              |
| `client.campaigns.getClaims(campaignId)`                         | `client.campaigns.claims.getAll(campaignId)`                                 |
| `client.campaigns.getJobs(campaignId)`                           | `client.campaigns.jobs.getAll(campaignId)`                                   |
| `client.campaigns.getStats(campaignId)`                          | `client.campaigns.stats.get(campaignId)`                                     |
| `client.campaigns.getEnrollments(campaignId)`                    | `client.campaigns.enrollments.getAll(campaignId)`                            |
| `client.campaigns.createEnrollment(campaignId, meta?, form?)`    | `client.campaigns.enrollments.create(campaignId, meta?, form?)`              |
| `client.campaigns.jwtEncode = fn`                                | `client.campaigns.enrollments.jwtEncode = fn`                                |

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

## Non-breaking additions

- `HttpRequester` and `ScannersEndpoint` are now exported from the package
  root.
- `client.http` is publicly readable, so callers can issue ad-hoc requests
  against endpoints that don't yet have a dedicated helper without dropping
  down to `fetch`.
- `QueryBuilder` / `UrlBuilder` are available internally for hand-built URLs
  with placeholders and ordered query params; they are not yet exported from
  the package root in this release.

## What did not change

- Auth providers (`KeysProvider`, `OAuthProvider`, `StoredProvider`) are
  untouched — construction, method names, and behavior are identical.
- Every bundled endpoint method outside `client.campaigns` keeps the same
  name, parameter list, and return type: `client.templates.getById(id)`,
  `client.organizations.getMine()`, `client.scanners.getAll()`,
  `client.workflows.getAll()`, `client.images.getById(id)`,
  `client.claims.getPkpass(campaignId, passId)`, etc., all continue to work
  as before. On `client.campaigns`, only `getAll()` and `getById(id)` are
  unchanged; everything else moved per
  [`CampaignsEndpoint` split into sub-endpoints](#campaignsendpoint-split-into-sub-endpoints).
- The base URL handling and the `?api=true` query suffix appended to every
  request are unchanged.
- The default `User-Agent` format (`a2w-api-ts/<version> (Node.js
<version>)`) is unchanged; `client.http.setUserAgent(...)` continues to
  override it.
