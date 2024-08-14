# AddToWallet Typescript Client

Client library that communicates with the addtowallet API.

- [Installing](#installing)
- [Developing](#developing)
- [Building](#building)
- [Examples](#examples)
  - [Creating a new client with keys](#creating-a-new-client-with-keys)
  - [Creating a new client with oauth](#creating-a-new-client-with-oauth)
  - [Fetching a template by ID](#fetching-a-template-by-id)
  - [Fetching templates by tag](#fetching-templates-by-tag)
  - [Fetching a pass](#fetching-a-pass)
  - [Creating a pass bundle](#creating-a-pass-bundle)
  - [Fetching the authenticated organization](#fetching-the-authenticated-organization)

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

## Examples

### Creating a new client with keys

```ts
import { Client, KeysProvider } from '@basetime/a2w-api-ts';

const auth = new KeysProvider('api_key', 'api_secret');
const client = new Client(auth);
```

### Creating a new client with oauth

```ts
import { Client, OAuthProvider } from '@basetime/a2w-api-ts';

const appId = 'a2w-inspector';
const oauth = new OAuthProvider('a2w-inspector');
const client = new Client(oauth);
```

### Fetching a template by ID

```ts
const template = await client.templates.getById('id');
console.log(template);
```

### Fetching templates by tag

```ts
const templates = await client.templates.getByTag('tag');
console.log(templates);
```

### Fetching a pass

```ts
const campaignId = 'h8X2JxgrnEsu2U0dI8KN';
const passId = '7gXYr76u3Maaf9ugAdWk';
const pass = await client.campaigns.getPass(campaignId, passId);
console.log(pass);
```

### Creating a pass bundle

```ts
const campaignId = 'h8X2JxgrnEsu2U0dI8KN';

// See the meta value docs for more info.
// @see https://avagate.atlassian.net/wiki/spaces/Addto/pages/102891521/Campaigns#Meta-values
const meta = {
  bundle: '9YpI7B8G0dnvRBC1R1a2,9YpI7B8G0dnvRBC1R1a2',
  banner: 'https://example.com/banner.png',
  backgroundColor: '#ae00ff',
};

// Form values to assign to the pass bundle. Typically, a primary key is set.
const form = {
  primaryKey: '1234567890',
};

const url = await client.campaigns.createBundle(campaignId, meta, form);
console.log(url);
```

### Fetching the authenticated organization

```ts
const organization = await client.organizations.getMine();
console.log(organization);
```
