# Passes

## Fetching a pass

```ts
const campaignId = 'h8X2JxgrnEsu2U0dI8KN';
const passId = '7gXYr76u3Maaf9ugAdWk';
const pass = await client.campaigns.passes.getById(campaignId, passId);
console.log(pass);
```

## Querying for Passes

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

## Updating a pass

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

## Patching Pass Object Store

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

## Deleting Object Store Values

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

## Updating pass logs

Appends a new log to a pass.

```ts
const campaignId = 'h8X2JxgrnEsu2U0dI8KN';
const passId = '7gXYr76u3Maaf9ugAdWk';

const ok = await client.campaigns.passes.appendLog(campaignId, passId, 'This is a log message');
console.log(ok);
```

## Redeem a pass

```ts
const campaignId = 'h8X2JxgrnEsu2U0dI8KN';
const passId = '7gXYr76u3Maaf9ugAdWk';
const redeemed = await client.campaigns.passes.redeem(campaignId, passId);
console.log(redeemed);
```

## Get the redeemed status of a pass

```ts
const campaignId = 'h8X2JxgrnEsu2U0dI8KN';
const passId = '7gXYr76u3Maaf9ugAdWk';
const redeemed = await client.campaigns.passes.getRedeemedStatus(campaignId, passId);
console.log(redeemed);
```

## Creating a pass bundle

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

## Getting scanner logs for a pass

Returns every scan recorded by a registered scanner against the pass.

```ts
const logs = await client.campaigns.passes.getScannerLogs(
  'h8X2JxgrnEsu2U0dI8KN',
  '7gXYr76u3Maaf9ugAdWk',
);
console.log(logs);
```
