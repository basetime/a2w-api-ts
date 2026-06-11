# Changelog

## Unreleased

## 2.1.0 - 2026-06-11

- Refactor OAuthProvider to improve authentication handling. (`8e93260`)

## 2.0.1 - 2026-05-19

- **Breaking:** Move `baseUrl` off the module global onto `HttpRequester` instance state. `setBaseUrl` / `getBaseUrl` mutate per-instance fields, providers learn the base URL from `setAuth(...)`, and `src/constants.ts` now exports only `DEFAULT_BASE_URL`. `Client` accepts an `{ baseUrl }` option forwarded to `HttpRequester`.
- **Breaking:** Introduce a typed `ApiError` (status, statusText, body, url, cause) and have `HttpRequester.fetch` throw it directly on non-2xx responses instead of double-wrapping. Network errors propagate as-is.
- **Breaking:** Add `BaseAuthProvider` with in-flight dedup, 30s clock-skew margin, and `/auth/apiRefresh`-based refresh; `HttpRequester` retries once on 401 after `auth.refresh()`. `KeysProvider`, `OAuthProvider`, and `StoredProvider` are now thin subclasses.
- **Breaking:** Move workflow job operations to a dedicated `client.workflows.jobs` sub-endpoint — `getAll`, `getById`, `update`, `addLog`, `getStatus`. The five flat methods on `WorkflowsEndpoint` are removed.
- **Breaking:** Sub-endpoint constructors now accept their parent `Endpoint` (`new CampaignPassesEndpoint(this)`) and reuse its `do` / `qb`. Hand-instantiating a sub-endpoint with the bare requester no longer compiles.
- **Breaking:** Add a `siteRoot` option to `Endpoint`; refactor `BarcodesEndpoint` and `WidgetsEndpoint` to extend `Endpoint` and drop their hand-rolled site-base-URL helpers. `HttpRequester` now exposes `getSiteBaseUrl()`.
- Replace the manual `?api=true` concat with a `URL`/`URLSearchParams`-based builder that dedupes the marker and leaves absolute URLs alone (apart from injecting `api=true` once).
- **Breaking:** Remove `passkit-generator` from `dependencies`. `Template.apple` is now `Record<string, unknown>`; consumers needing strong typing can cast to `PassProps`.
- **Breaking:** `HttpRequester.auth` is now a read-only getter backed by a private `_auth` field. Use `setAuth(...)` to mutate.
- **Breaking:** Migrate every file in `src/types/` to Zod schemas with inferred TS types (`FooSchema` + `Foo`). Endpoint methods opt in to `safeParse`-and-log validation by passing the schema to `do.get/post/put/del`; mismatches log via `req.getLogger()` but never crash callers. `zod` is now a runtime dependency.

## 1.0.0 - 2026-05-16

- Add workflow execution (`client.workflows.run` + `getJobStatus`), campaign CRUD
  (`update` / `createSimple` / `clone` / `delete`), `campaigns.workflows` and
  `campaigns.wallets` sub-endpoints, `campaigns.passes.getScannerLogs`,
  `organizations.webhooks` / `dataStores` / `exporters` sub-endpoints, template lifecycle
  methods (`clone` / `export` / `import` / `delete`), and new top-level `client.barcodes`
  and `client.widgets` endpoints. Includes matching types, mocha tests, and README
  examples. `HttpRequester.fetch` now also accepts absolute URLs (so endpoints can target
  routes outside `/api/v1`) and skips its default JSON `Content-Type` for `FormData`
  bodies so multipart uploads work.
- Refactors CampaignsEndpoint to split per-resource methods into dedicated sub-endpoints, enhancing organization and clarity. Updates README to reflect new method usage and examples for fetching campaigns and passes. Adjusts test cases to align with the new endpoint structure, ensuring consistency across the codebase.. (`328bbf1`)
- Refactors endpoint classes to streamline request handling by consolidating method signatures and enhancing type safety. Updates CampaignsEndpoint, ClaimsEndpoint, ImagesEndpoint, OrganizationsEndpoint, and WorkflowsEndpoint to improve consistency and maintainability across the codebase.. (`951ce5a`)
- Refactors endpoint methods to remove generic type parameters from `do` method calls, enhancing code simplicity and readability across CampaignsEndpoint, ClaimsEndpoint, ImagesEndpoint, OrganizationsEndpoint, ScannersEndpoint, TemplatesEndpoint, and WorkflowsEndpoint.. (`59f1f5a`)
- Refactors endpoint classes to replace legacy URL handling with a new `do` method for request operations, improving code clarity and consistency.. (`50ce0c1`)
- Refactors endpoint classes to utilize a QueryBuilder for URL construction, enhancing readability and maintainability.. (`36a2f14`)
- Updates package.json to change the repository URL from HTTPS to SSH format for improved access and security.. (`d8f5d5c`)
- **Breaking:** Extract `HttpRequester` from `Client`. Move `fetch`, `setBaseUrl`,
  `setAuth`, and `setUserAgent` to `HttpRequester` and expose it as `client.http`.
  Migrate `client.fetch(...)` -> `client.http.fetch(...)` and the setters similarly.

## 0.4.10 - 2026-05-15

- Updates package.json to correct the homepage and bugs URL, and adds repository information. Modifies release workflow to create annotated tags for version releases.. (`40b3813`)

## 0.4.9 - 2026-05-15

- Enhances AGENTS.md with details on re-enabling tests in CI, updates package.json to include release scripts for versioning, and modifies test files to use getBaseUrl for improved consistency in API endpoint definitions.. (`0c054ab`)
- Updates package.json and pnpm-lock.yaml to include @types/node version 25.8.0, and modifies import path in TemplatesEndpoint for improved type management.. (`d139278`)
- Updates package.json to specify pnpm version and enhances README with a new section on publishing the package to npm.. (`b4523f6`)
- Migrate pnpm-lock.yaml to lockfileVersion 9.0. (`57777d4`)
