# Passes

## `getById(campaignId, passId): Promise<Pass>`

Returns the details for a pass.

```ts
const campaignId = 'h8X2JxgrnEsu2U0dI8KN';
const passId = '7gXYr76u3Maaf9ugAdWk';
const pass = await client.campaigns.passes.getById(campaignId, passId);
console.log(pass);
```

## `query(campaignId, queries?): Promise<Pass[]>`

Queries the passes for a campaign.

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

## `update(campaignId, passId, body): Promise<Pass>`

Updates the details of a pass. This method also updates the wallets that contain the pass. Only the following values can be updated:

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

## `mergeObjectStore(campaignId, passId, body): Promise<Pass>`

Merges a pass object store into the existing object store.

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

## `deleteObjectStoreKeys(campaignId, passId, objectStoreKeys): Promise<Pass>`

Deletes keys from a pass object store.

```ts
const campaignId = 'h8X2JxgrnEsu2U0dI8KN';
const passId = '7gXYr76u3Maaf9ugAdWk';

// Each value is optional.
const updatedPass = await client.campaigns.passes.deleteObjectStoreKeys(campaignId, passId, [
  'points',
]);
console.log(updatedPass);
```

## `appendLog(campaignId, passId, log): Promise<Pass>`

Appends a log to a pass.

```ts
const campaignId = 'h8X2JxgrnEsu2U0dI8KN';
const passId = '7gXYr76u3Maaf9ugAdWk';

const ok = await client.campaigns.passes.appendLog(campaignId, passId, 'This is a log message');
console.log(ok);
```

## `redeem(campaignId, passId): Promise<boolean>`

Sets the redeemed status of a pass to true. Returns `true` if the pass was redeemed, `false` if it was already redeemed.

```ts
const campaignId = 'h8X2JxgrnEsu2U0dI8KN';
const passId = '7gXYr76u3Maaf9ugAdWk';
const redeemed = await client.campaigns.passes.redeem(campaignId, passId);
console.log(redeemed);
```

## `getRedeemedStatus(campaignId, passId): Promise<boolean>`

Returns the redeemed status of a pass.

```ts
const campaignId = 'h8X2JxgrnEsu2U0dI8KN';
const passId = '7gXYr76u3Maaf9ugAdWk';
const redeemed = await client.campaigns.passes.getRedeemedStatus(campaignId, passId);
console.log(redeemed);
```

## `createBundle(campaignId, metaValues?, objectStore?, utm?): Promise<string>`

Creates a pass bundle and returns the URL to the claims page.

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

## `getScannerLogs(campaignId, passId): Promise<ScannerLog[]>`

Returns the scanner logs recorded against a pass. Each entry records one scan made by a registered scanner device.

```ts
const logs = await client.campaigns.passes.getScannerLogs(
  'h8X2JxgrnEsu2U0dI8KN',
  '7gXYr76u3Maaf9ugAdWk',
);
console.log(logs);
```
