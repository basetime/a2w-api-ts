# AddToWallet Typescript Client

Client library that communicates with the addtowallet API.

```ts
import { Client, KeysProvider } from '@basetime/a2w-api-ts';

const auth = new KeysProvider('api_key', 'api_secret');
const client = new Client(auth);

// Override the base URL.
client.setBaseUrl('https://dev-app.addtowallet.io/api/v1');

// Get all templates by tag.
const templates = await client.templates.getByTag('tag');
console.log(templates);

// Create a pass bundle
const campaignId = 'h8X2JxgrnEsu2U0dI8KN';

// See the meta value docs for more info.
// @see https://avagate.atlassian.net/wiki/spaces/Addto/pages/102891521/Campaigns#Meta-values
const meta = {
  bundle: '9YpI7B8G0dnvRBC1R1a2,9YpI7B8G0dnvRBC1R1a2',
};

// Form values to assign to the pass bundle. Typically, a primary key is set.
const form = {
  primaryKey: '1234567890',
};
const url = await client.campaigns.createBundle(campaignId, meta, form);

// Receive a link to the claims page.
console.log(url);
```

## Installing

```bash
npm i @basetime/a2w-api-ts
# or
yarn add @basetime/a2w-api-ts
# or
pnpm add @basetime/a2w-api-ts
```

## Deveoping

Run the `watch` command while writing code.

```bash
pnpm watch
```

## Building

Run the `build` command to build the code.

```bash
pnpm build
```
