# Wallets

## `getAll(campaignId, pagination?): Promise<CampaignWalletsResponse>`

Returns the wallets for a campaign, grouped by bundle. Supports optional pagination.

```ts
const wallets = await client.campaigns.wallets.getAll('h8X2JxgrnEsu2U0dI8KN', {
  page: 1,
  perPage: 50,
});
console.log(wallets);
```

## `getEnrollment(campaignId, enrollmentId): Promise<CampaignWalletEnrollmentResponse>`

Returns the details of a single wallet enrollment.

```ts
const enrollment = await client.campaigns.wallets.getEnrollment(
  'h8X2JxgrnEsu2U0dI8KN',
  'enrollment-id',
);
console.log(enrollment);
```

## `getPushLogs(campaignId, passId): Promise<WalletUpdate[]>`

Returns the push log history for a specific pass.

```ts
const pushes = await client.campaigns.wallets.getPushLogs(
  'h8X2JxgrnEsu2U0dI8KN',
  '7gXYr76u3Maaf9ugAdWk',
);
console.log(pushes);
```

## `pushTemplates(campaignId, templateIds): Promise<number>`

Pushes template updates to every wallet that has the campaign's passes installed. Returns the number of passes that were queued for update.

```ts
const count = await client.campaigns.wallets.pushTemplates(
  'h8X2JxgrnEsu2U0dI8KN',
  ['T01', 'T02'],
);
console.log(count);
```

## `dismissPushes(campaignId): Promise<string>`

Dismisses the "pending pushes" notice for a campaign without actually pushing.

```ts
await client.campaigns.wallets.dismissPushes('h8X2JxgrnEsu2U0dI8KN');
```
