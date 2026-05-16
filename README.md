# AddToWallet Typescript Client

Client library that communicates with the addtowallet API.

- [Installing](#installing)
- [Developing](#developing)
- [Building](#building)
- [Publishing](#publishing)
- [Examples](#examples)
  - [Creating a new client with keys](#creating-a-new-client-with-keys)
  - [Creating a new client with oauth](#creating-a-new-client-with-oauth)
  - [Setting a custom user agent](#setting-a-custom-user-agent)
  - [Custom fetch](#custom-fetch)
  - [Fetching all campaigns](#fetching-all-campaigns)
  - [Fetching a pass](#fetching-a-pass)
  - [Querying for Passes](#querying-for-passes)
  - [Updating a pass](#updating-a-pass)
  - [Patching Pass Object Store](#patching-pass-object-store)
  - [Deleting Object Store Values](#deleting-object-store-values)
  - [Updating pass logs](#updating-pass-logs)
  - [Redeem a pass](#redeem-a-pass)
  - [Get the redeemed status of a pass](#get-the-redeemed-status-of-a-pass)
  - [Creating a pass bundle](#creating-a-pass-bundle)
  - [Creating an enrollment](#creating-an-enrollment)
  - [Fetching all templates](#fetching-all-templates)
  - [Fetching a template by ID](#fetching-a-template-by-id)
  - [Fetching templates by tag](#fetching-templates-by-tag)
  - [Fetching the authenticated organization](#fetching-the-authenticated-organization)
  - [Get image by ID](#get-image-by-id)
  - [Get images by IDs](#get-images-by-ids)
  - [Fetching all scanner apps](#fetching-all-scanner-apps)
  - [Fetching a scanner app by ID](#fetching-a-scanner-app-by-id)
  - [Creating a scanner app](#creating-a-scanner-app)
  - [Updating a scanner app](#updating-a-scanner-app)
  - [Deleting a scanner app](#deleting-a-scanner-app)

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

## Publishing

Commit the code and push to the `main` branch. Then run the `Release` workflow to publish the package to npm.

```bash
git commit -m "chore(release): release v0.4.9"
git push origin main
```

Then run the `Release` workflow to publish the package to npm.

```bash
gh workflow run Release
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

### Setting a custom user agent

```ts
const client = new Client();
client.http.setUserAgent('my-custom-user-agent/1.0.0');
```

### Custom fetch

All HTTP concerns live on `client.http`, an instance of `HttpRequester` that can also be constructed standalone (for example, in tests). When the client is not pre-configured to use a specific API endpoint, you can use the `fetch` method to make requests to the API, and authentication will be handled automatically.

```ts
const t = await client.http.fetch('/templates/simple/l74mNQLcjWnN2AoRRKG0');
console.log(t);
```

### Fetching all campaigns

Fetches the campaigns for the authenticated organization.

```ts
const campaigns = await client.campaigns.getAll();
console.log(campaigns);
```

### Fetching a pass

```ts
const campaignId = 'h8X2JxgrnEsu2U0dI8KN';
const passId = '7gXYr76u3Maaf9ugAdWk';
const pass = await client.campaigns.passes.getById(campaignId, passId);
console.log(pass);
```

### Querying for Passes

Fetching all of the passes in the campaign.

```ts
const campaignId = 'h8X2JxgrnEsu2U0dI8KN';
const passes = await client.campaigns.passes.query(campaignId);
console.log(passes);
```

Fetching passes where the primaryKey = '123455'.

```ts
const campaignId = 'h8X2JxgrnEsu2U0dI8KN';
const passes = await client.campaigns.passes.query(campaignId, {
  primaryKey: '123455',
});
console.log(passes);
```

Fetching passes where the object store value 'amount' = '30'.

```ts
const campaignId = 'h8X2JxgrnEsu2U0dI8KN';
const passes = await client.campaigns.passes.query(campaignId, {
  'objectStore.amount': '30',
});
console.log(passes);
```

### Updating a pass

Updates the object store. This will also have a2w send the updated pass
to the wallets that contain it. Only the following values can be updated:

- `templateId`
- `templateVersion`
- `objectStore`
- `passTypeIdentifier`

```ts
const campaignId = 'h8X2JxgrnEsu2U0dI8KN';
const passId = '7gXYr76u3Maaf9ugAdWk';

// Each value is optional.
const updatedPass = await client.campaigns.passes.update(campaignId, passId, {
  templateId: '123123123',
  templateVersion: 2,
  objectStore: {
    points: '42',
  },
});
console.log(updatedPass);
```

### Patching Pass Object Store

Merges the given object store values with the existing object store values.

```ts
const campaignId = 'h8X2JxgrnEsu2U0dI8KN';
const passId = '7gXYr76u3Maaf9ugAdWk';

// Each value is optional.
const updatedPass = await client.campaigns.passes.mergeObjectStore(campaignId, passId, {
  objectStore: {
    points: '42',
  },
});
console.log(updatedPass);
```

### Deleting Object Store Values

Deletes values from an object store by specifying the keys.

```ts
const campaignId = 'h8X2JxgrnEsu2U0dI8KN';
const passId = '7gXYr76u3Maaf9ugAdWk';

// Each value is optional.
const updatedPass = await client.campaigns.passes.deleteObjectStoreKeys(campaignId, passId, [
  'points',
]);
console.log(updatedPass);
```

### Updating pass logs

Appends a new log to a pass.

```ts
const campaignId = 'h8X2JxgrnEsu2U0dI8KN';
const passId = '7gXYr76u3Maaf9ugAdWk';

const ok = await client.campaigns.passes.appendLog(campaignId, passId, 'This is a log message');
console.log(ok);
```

### Redeem a pass

```ts
const campaignId = 'h8X2JxgrnEsu2U0dI8KN';
const passId = '7gXYr76u3Maaf9ugAdWk';
const redeemed = await client.campaigns.passes.redeem(campaignId, passId);
console.log(redeemed);
```

### Get the redeemed status of a pass

```ts
const campaignId = 'h8X2JxgrnEsu2U0dI8KN';
const passId = '7gXYr76u3Maaf9ugAdWk';
const redeemed = await client.campaigns.passes.getRedeemedStatus(campaignId, passId);
console.log(redeemed);
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

const url = await client.campaigns.passes.createBundle(campaignId, meta, form);
console.log(url);
```

### Creating an enrollment

Creates an enrollment for a campaign, and returns the bundle ID and any errors.

```ts
// Meta values to assign to the pass bundle.
const meta = {
  banner: 'https://example.com/banner.png',
  backgroundColor: '#ae00ff',
};

// Form values to assign to the pass bundle. Typically, a primary key is set.
const form = {
  primaryKey: '1234567890',
  firstName: 'John',
  lastName: 'Doe',
};

// Returns the bundle ID and any errors.
const enrollment = await client.campaigns.enrollments.create(campaignId, meta, form);
console.log(enrollment.pass, enrollment.errors);
```

### Fetching all templates

Fetches the templates for the authenticated organization.

```ts
const templates = await client.templates.getAll();
console.log(templates);
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

### Fetching the authenticated organization

```ts
const organization = await client.organizations.getMine();
console.log(organization);
```

### Get image by ID

```ts
const image = await client.images.getById('bWVkrfizHBXyETJEIMk9');
console.log(image);
```

### Get images by IDs

```ts
const images = await client.images.getByIds(['bWVkrfizHBXyETJEIMk9', 'pb6flbrYzrrz4rRSPA7l']);
console.log(images);
```

### Fetching all scanner apps

```ts
const apps = await client.scanners.getAll();
console.log(apps);
```

### Fetching a scanner app by ID

```ts
const app = await client.scanners.getById('XVK0xIy2vQinDJWUbKnO');
console.log(app);
```

### Creating a scanner app

`createApp` and `updateApp` accept one of two scanner app input shapes. Standard scanner
apps can set the usual scanner fields, but cannot set `jsonConfig` or `jsonConfigUrl`.
JSON-configured scanner apps must set `isJsonConfigured: true` and can only set
`jsonConfig` and/or `jsonConfigUrl`.

```ts
const app = await client.scanners.createApp({
  name: 'My Scanner',
  description: 'My Scanner',
  tags: ['tag1', 'tag2'],
  webviewScanUrl: 'https://example.com/scan',
  webviewStandbyUrl: 'https://example.com/standby',
  webviewPassword: 'password',
  passCode: '1234',
  brandColor: '#ae00ff',
  brandLogoUrl: 'https://example.com/logo.png',
  isKioskMode: true,
});
console.log(app);
```

For a JSON-configured scanner app:

```ts
const app = await client.scanners.createApp({
  isJsonConfigured: true,
  jsonConfigUrl: 'https://example.com/scanner-config.json',
});
console.log(app);
```

### Updating a scanner app

```ts
await client.scanners.updateApp('XVK0xIy2vQinDJWUbKnO', {
  name: 'My Scanner',
  description: 'My Scanner',
  tags: ['tag1', 'tag2'],
  webviewScanUrl: 'https://example.com/scan',
  webviewStandbyUrl: 'https://example.com/standby',
  webviewPassword: 'password',
  passCode: '1234',
  brandColor: '#ae00ff',
  brandLogoUrl: 'https://example.com/logo.png',
  isKioskMode: true,
});
```

For a JSON-configured scanner app update:

```ts
await client.scanners.updateApp('XVK0xIy2vQinDJWUbKnO', {
  isJsonConfigured: true,
  jsonConfig: '{"theme":"dark"}',
});
```

### Deleting a scanner app

```ts
await client.scanners.deleteApp('XVK0xIy2vQinDJWUbKnO');
```
