# AGENTS.md

## Changelog

`CHANGELOG.md` is maintained automatically:

- A `post-commit` git hook (`.githooks/post-commit`, activated by the `prepare` npm script)
  prepends `- <subject>. (\`<sha>\`)` to the `## Unreleased` section after each commit and amends
  that change into the same commit.
- The hook stays out of the way if `CHANGELOG.md` is already part of the commit. To write a
  richer entry yourself, edit `## Unreleased` and stage `CHANGELOG.md` as part of the commit.
- Don't add version numbers or dates manually. The `Release` workflow
  (`.github/workflows/release.yml`) bumps the `version` field in `package.json` and renames
  `## Unreleased` to `## <new version> - <YYYY-MM-DD>` when a maintainer triggers a release.
- Don't run `pnpm version` locally; use the GitHub Actions `Release` workflow instead so the
  changelog and tags stay in sync.

## Tests

The test runner is currently disabled in CI (see [`.github/workflows/release.yml`](.github/workflows/release.yml)).
Test files live in `__tests__` subdirectories next to the code they cover (e.g.
[`src/http/__tests__/HttpRequester.ts`](src/http/__tests__/HttpRequester.ts)) and are picked up
via the `src/**/__tests__/**/*.ts` glob in [`.mocharc.json`](.mocharc.json). They compile
cleanly but mocha cannot load them because the project mixes ESM source
(`tsconfig.json` `"module": "esnext"`) with a root `package.json` that has no
`"type": "module"`, so ts-node's ESM loader (`.mocharc.json` -> `loader=ts-node/esm`) treats
`src/*.ts` as CJS and the test imports fail (currently with `ERR_REQUIRE_CYCLE_MODULE` on
recent Node, previously with `Named export 'Client' not found`).

To restore tests, options are:

- Add `"type": "module"` to the root `package.json` and rename the CJS bundle output to
  `dist/index.cjs` (and update the `exports` map). This is the "correct" fix but affects
  consumers; verify with a tarball install before publishing.
- Or, switch tests to a compile-first flow: a `tsconfig.test.json` that emits to
  `dist-tests/`, then run mocha against the compiled `.js` files. Keeps the package's module
  type as-is.

Until then, run `pnpm test` locally on a Node version where the loader happens to work, and
manually verify changes to public API.
