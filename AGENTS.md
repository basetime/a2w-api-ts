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
