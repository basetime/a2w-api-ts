# AddToWallet Typescript Client

**Full documentation:** [https://basetime.github.io/a2w-api-ts/](https://basetime.github.io/a2w-api-ts/)

**TypeScript client for the AddToWallet API**

`@basetime/a2w-api-ts` is a library for communicating with the AddToWallet platform from Node.js and TypeScript:

- **Full API coverage:** Campaigns, passes, templates, scanners, workflows, webhooks, and more.
- **Runtime validation:** Zod schemas for every response type with optional strict parsing.
- **Flexible auth:** API keys or OAuth providers wired through a shared `Client`.

## Documentation

| Topic | Link |
| --- | --- |
| Getting started | [Introduction](https://basetime.github.io/a2w-api-ts/) |
| Installation | [Installation](https://basetime.github.io/a2w-api-ts/installing) |
| Setup | [Setup](https://basetime.github.io/a2w-api-ts/setup) |
| API usage | [Usage](https://basetime.github.io/a2w-api-ts/usage/) |
| Response validation | [Runtime validation](https://basetime.github.io/a2w-api-ts/runtime-validation) |

Canonical docs live in [`docs/`](./docs/). Edit those pages directly, then run `pnpm docs:build:nav` to refresh the VitePress sidebar.

## Development

```bash
pnpm install
pnpm test
pnpm docs:serve    # VitePress dev server with nav watcher
pnpm docs:build    # production docs build
```

## License

MIT
