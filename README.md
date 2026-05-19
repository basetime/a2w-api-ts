# AddToWallet Typescript Client

Client library that communicates with the addtowallet API.

- [Installing](#installing)
- [Developing](#developing)
- [Building](#building)
- [Publishing](#publishing)
- [Runtime validation](#runtime-validation)
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
  - [Updating a campaign](#updating-a-campaign)
  - [Creating a simple campaign](#creating-a-simple-campaign)
  - [Cloning a campaign](#cloning-a-campaign)
  - [Deleting a campaign](#deleting-a-campaign)
  - [Getting scanner logs for a pass](#getting-scanner-logs-for-a-pass)
  - [Listing wallets for a campaign](#listing-wallets-for-a-campaign)
  - [Getting wallet push logs for a pass](#getting-wallet-push-logs-for-a-pass)
  - [Pushing template updates to wallets](#pushing-template-updates-to-wallets)
  - [Dismissing pending wallet pushes](#dismissing-pending-wallet-pushes)
  - [Listing workflows attached to a campaign](#listing-workflows-attached-to-a-campaign)
  - [Attaching a workflow to a campaign](#attaching-a-workflow-to-a-campaign)
  - [Updating a campaign workflow](#updating-a-campaign-workflow)
  - [Detaching a workflow from a campaign](#detaching-a-workflow-from-a-campaign)
  - [Running a workflow](#running-a-workflow)
  - [Getting a workflow job status](#getting-a-workflow-job-status)
  - [Listing and inspecting workflow jobs](#listing-and-inspecting-workflow-jobs)
  - [Managing webhooks](#managing-webhooks)
  - [Managing data stores](#managing-data-stores)
  - [Managing exporters](#managing-exporters)
  - [Cloning a template](#cloning-a-template)
  - [Exporting a template](#exporting-a-template)
  - [Importing a template](#importing-a-template)
  - [Deleting a template](#deleting-a-template)
  - [Rendering a barcode](#rendering-a-barcode)
  - [Signing a JWT with widgets](#signing-a-jwt-with-widgets)

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

## Runtime validation

Starting with v2.0.0, every type in `src/types/` is defined as a
[Zod](https://zod.dev/) schema with an inferred TypeScript type. Both the schema and the
type are re-exported from the package root:

```ts
import { CampaignSchema, type Campaign } from '@basetime/a2w-api-ts';
```

At request time, the SDK runs each response through `schema.safeParse(...)`:

- On **success** the parsed value is returned.
- On **failure** the issue list is logged via the requester's logger as
  `Response shape mismatch` and the **raw, unvalidated** payload is returned as `T`.

This is intentionally non-throwing: a backend response with an unexpected field never
crashes a caller, but the mismatch is surfaced loudly to whatever `Logger` was wired in
when constructing the `Client` (`console.error` if you passed `console`). Schemas are
defensive — `.passthrough()` is used everywhere — so most "new field on the server" cases
silently produce a valid parse.

If you need stricter validation (throw on shape mismatch), import the schema and call
`.parse(...)` yourself:

```ts
import { CampaignSchema } from '@basetime/a2w-api-ts';

const campaign = CampaignSchema.parse(await client.campaigns.getById('h8X2JxgrnEsu2U0dI8KN'));
```

Consumers that don't want the runtime validation overhead at all can simply type-import
(`import type { Campaign }`), and treat the SDK's response shapes as plain TypeScript
types — Zod is bundled into the SDK so there is no extra peer-dependency setup required.

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

### Updating a campaign

Mirrors the backend Joi schema permissively. `templates` accepts a list of template IDs
to associate with the campaign.

```ts
const updated = await client.campaigns.update('h8X2JxgrnEsu2U0dI8KN', {
  name: 'Renamed Campaign',
  templates: ['T01', 'T02'],
});
console.log(updated);
```

### Creating a simple campaign

Creates a campaign from an existing template plus placeholder values. Pass `'__new'` as
the ID to create a brand-new campaign, or an existing campaign ID to update one in place.

```ts
const created = await client.campaigns.createSimple('__new', {
  campaign: { name: 'My Coupon' },
  templateId: 'T01',
  placeholders: {
    logo: 'https://example.com/logo.png',
    backgroundColor: '#ae00ff',
  },
});
console.log(created);
```

### Cloning a campaign

Returns the ID of the newly created campaign.

```ts
const newCampaignId = await client.campaigns.clone('h8X2JxgrnEsu2U0dI8KN');
console.log(newCampaignId);
```

### Deleting a campaign

```ts
await client.campaigns.delete('h8X2JxgrnEsu2U0dI8KN');
```

### Getting scanner logs for a pass

Returns every scan recorded by a registered scanner against the pass.

```ts
const logs = await client.campaigns.passes.getScannerLogs(
  'h8X2JxgrnEsu2U0dI8KN',
  '7gXYr76u3Maaf9ugAdWk',
);
console.log(logs);
```

### Listing wallets for a campaign

Returns request logs grouped by bundle, plus the matching bundle entities. Supports
optional pagination.

```ts
const wallets = await client.campaigns.wallets.getAll('h8X2JxgrnEsu2U0dI8KN', {
  page: 1,
  perPage: 50,
});
console.log(wallets);
```

You can also fetch a single wallet enrollment:

```ts
const enrollment = await client.campaigns.wallets.getEnrollment(
  'h8X2JxgrnEsu2U0dI8KN',
  'enrollment-id',
);
console.log(enrollment);
```

### Getting wallet push logs for a pass

Returns the history of pushes sent to wallets that have the pass installed.

```ts
const pushes = await client.campaigns.wallets.getPushLogs(
  'h8X2JxgrnEsu2U0dI8KN',
  '7gXYr76u3Maaf9ugAdWk',
);
console.log(pushes);
```

### Pushing template updates to wallets

Pushes the latest template changes to every wallet that contains a pass tied to one of
the supplied templates. Returns the number of passes queued for update.

```ts
const count = await client.campaigns.wallets.pushTemplates(
  'h8X2JxgrnEsu2U0dI8KN',
  ['T01', 'T02'],
);
console.log(count);
```

### Dismissing pending wallet pushes

Clears the "pending changes" notice on a campaign without actually pushing.

```ts
await client.campaigns.wallets.dismissPushes('h8X2JxgrnEsu2U0dI8KN');
```

### Listing workflows attached to a campaign

```ts
const attached = await client.campaigns.workflows.getAll('h8X2JxgrnEsu2U0dI8KN');
console.log(attached);
```

### Attaching a workflow to a campaign

`runsWhen` controls when the workflow fires (`'enrolled'`, `'claimed'`, `'installed'`,
`'redeemed'`, `'updated'`, `'scanned'`, or `'scheduled'`). Pass a `schedule` when
`runsWhen` is `'scheduled'`.

```ts
const attached = await client.campaigns.workflows.attach('h8X2JxgrnEsu2U0dI8KN', {
  workflowId: 'WF01',
  runsWhen: 'redeemed',
});
console.log(attached);
```

### Updating a campaign workflow

```ts
await client.campaigns.workflows.update('h8X2JxgrnEsu2U0dI8KN', 'CWF01', {
  runsWhen: 'scheduled',
  schedule: { when: 'daily', weekday: '', monthday: '', time: '09:00' },
});
```

### Detaching a workflow from a campaign

Returns the remaining workflow attachments.

```ts
const remaining = await client.campaigns.workflows.detach(
  'h8X2JxgrnEsu2U0dI8KN',
  'CWF01',
);
console.log(remaining);
```

### Running a workflow

Creates a new workflow job and dispatches it to the runner. Returns the job in the
`pending` status; poll `client.workflows.jobs.getStatus(jobId)` to track progress.

```ts
const job = await client.workflows.run({
  workflowId: 'WF01',
  campaign: 'h8X2JxgrnEsu2U0dI8KN',
  pass: '7gXYr76u3Maaf9ugAdWk',
});
console.log(job.id);
```

### Getting a workflow job status

```ts
const status = await client.workflows.jobs.getStatus('JOB01');
console.log(status); // 'pending' | 'running' | 'success' | 'error'
```

### Listing and inspecting workflow jobs

```ts
const allJobs = await client.workflows.jobs.getAll('WF01');
const job = await client.workflows.jobs.getById('JOB01');
await client.workflows.jobs.update('JOB01', { status: 'success' });
await client.workflows.jobs.addLog('JOB01', { type: 'info', message: 'Completed' });
```

### Managing webhooks

```ts
const webhooks = await client.organizations.webhooks.getAll();

const created = await client.organizations.webhooks.create({
  displayName: 'Redemption Notifier',
  url: 'https://example.com/hooks/redemption',
  event: 'redeemed',
  password: 'shared-secret',
});

await client.organizations.webhooks.update(created.id, {
  ...created,
  displayName: 'Renamed',
});

await client.organizations.webhooks.delete(created.id);

const logs = await client.organizations.webhooks.getLogs();
console.log(logs);
```

### Managing data stores

```ts
const stores = await client.organizations.dataStores.getAll();

const created = await client.organizations.dataStores.create({
  name: 'Member tiers',
  source: 'key-value',
  keyValue: [
    { key: 'gold', value: '1000' },
    { key: 'silver', value: '500' },
  ],
});

const fetched = await client.organizations.dataStores.getById(created.id);

await client.organizations.dataStores.update(created.id, {
  ...created,
  name: 'Renamed',
});

await client.organizations.dataStores.delete(created.id);
```

### Managing exporters

```ts
const exporters = await client.organizations.exporters.getAll();

const created = await client.organizations.exporters.create({
  name: 'Nightly SFTP',
  what: 'enrollments',
  when: 'daily',
  time: '03:00',
  source: 'sftp',
  config: {
    hostname: 'sftp.example.com',
    username: 'a2w',
    password: 'secret',
    filename: 'enrollments.csv',
  },
});

const ex = created[0];
await client.organizations.exporters.run(ex.id);

const logs = await client.organizations.exporters.getLogs(ex.id);
console.log(logs);

await client.organizations.exporters.delete(ex.id);
```

### Cloning a template

```ts
const cloned = await client.templates.clone('TPL01');
console.log(cloned);
```

### Exporting a template

Returns the JSON bundle that can be re-imported into another organization.

```ts
const bundle = await client.templates.export('TPL01');
console.log(bundle);
```

### Importing a template

Pass a `Blob`/`File` or a `{ name, content }` shape and the SDK constructs the multipart
upload for you.

```ts
const imported = await client.templates.import({
  name: 'tpl.json',
  content: JSON.stringify(bundle),
});
console.log(imported);
```

### Deleting a template

```ts
await client.templates.delete('TPL01');
```

### Rendering a barcode

The barcode endpoint lives at the site root (outside `/api/v1`). The PNG body is returned
as a string.

```ts
const png = await client.barcodes.render({
  type: 'qrcode',
  data: 'hello',
  width: 300,
  height: 300,
});
```

### Signing a JWT with widgets

`signJwt` signs an arbitrary payload with an explicit secret. `signCampaignJwt` signs
using a campaign's stored `openEnrollmentJwtSecret`, which is what
`client.campaigns.enrollments.create` needs. Wiring it in:

```ts
const campaignId = 'h8X2JxgrnEsu2U0dI8KN';

client.campaigns.enrollments.jwtEncode = (data) =>
  client.widgets.signCampaignJwt(campaignId, data);

const enrollment = await client.campaigns.enrollments.create(
  campaignId,
  { backgroundColor: '#ae00ff' },
  { primaryKey: '1234567890', firstName: 'John', lastName: 'Doe' },
);
console.log(enrollment.pass, enrollment.errors);
```

Or sign an arbitrary payload directly:

```ts
const token = await client.widgets.signJwt({ sub: 'user-1' }, 'shared-secret');
```
