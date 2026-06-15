![Logo](https://cdn.addtowallet.io/img/a2w-api-logo.png)

# AddToWallet TypeScript Client

`@basetime/a2w-api-ts` is a Node.js and TypeScript client for the [Addtowallet](https://addtowallet.io) platform. Construct a `Client`, authenticate with API keys or OAuth, and call typed helpers for campaigns, passes, templates, scanners, workflows, and more.

## Features

- **Full API coverage** — Campaigns, passes, enrollments, templates, organizations, scanners, workflows, images, barcodes, and widgets.
- **Typed endpoints** — Each API resource has a dedicated helper on `client` (for example, `client.campaigns.getAll()`).
- **Runtime validation** — Every response type has a matching Zod schema. The client validates responses with `safeParse` and logs shape mismatches without throwing; call `Schema.parse(...)` yourself when you need strict validation.
- **Flexible auth** — `KeysProvider` for API key/secret exchange, or `OAuthProvider` for OAuth flows. Tokens are cached and refreshed automatically.
- **Shared HTTP layer** — All endpoints share one `HttpRequester` (`client.http`) for base URL, auth, user agent, and ad-hoc `fetch` calls.

## Requirements

Node.js 18 or later.

## Quick start

Install the package:

```bash
pnpm add @basetime/a2w-api-ts
```

Create an API key and secret in your organization's AddToWallet dashboard, then wire up a client:

```ts
import { Client, KeysProvider } from '@basetime/a2w-api-ts';

const auth = new KeysProvider(process.env.A2W_API_KEY!, process.env.A2W_API_SECRET!);
const client = new Client(auth);

const campaigns = await client.campaigns.getAll();
console.log(campaigns);
```

See [Setup](./setup) for authentication details, custom base URLs, and OAuth.

## Documentation

| Topic                      | Description                                          |
| -------------------------- | ---------------------------------------------------- |
| [Installing](./installing) | Install with npm, yarn, or pnpm                      |
| [Setup](./setup)           | API credentials, auth providers, and client options  |
| [Usage](./usage/)          | `Client` methods and per-resource endpoint reference |

### API reference

| Resource           | Link                                                     |
| ------------------ | -------------------------------------------------------- |
| Campaigns          | [Usage → Campaigns](./usage/campaigns)                   |
| Passes             | [Usage → Passes](./usage/passes)                         |
| Enrollments        | [Usage → Enrollments](./usage/enrollments)               |
| Wallets            | [Usage → Wallets](./usage/wallets)                       |
| Campaign workflows | [Usage → Campaign workflows](./usage/campaign-workflows) |
| Templates          | [Usage → Templates](./usage/templates)                   |
| Organizations      | [Usage → Organizations](./usage/organizations)           |
| Images             | [Usage → Images](./usage/images)                         |
| Scanners           | [Usage → Scanners](./usage/scanners)                     |
| Workflows          | [Usage → Workflows](./usage/workflows)                   |
| Barcodes           | [Usage → Barcodes](./usage/barcodes)                     |
| Widgets            | [Usage → Widgets](./usage/widgets)                       |

## Source and issues

The package is published on npm as [`@basetime/a2w-api-ts`](https://www.npmjs.com/package/@basetime/a2w-api-ts). Source, releases, and issue tracking live on [GitHub](https://github.com/basetime/a2w-api-ts).
