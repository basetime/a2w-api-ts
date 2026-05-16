# Changelog

## Unreleased

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

