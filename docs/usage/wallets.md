# Wallets

## Listing wallets for a campaign

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

## Getting wallet push logs for a pass

Returns the history of pushes sent to wallets that have the pass installed.

```ts
const pushes = await client.campaigns.wallets.getPushLogs(
  'h8X2JxgrnEsu2U0dI8KN',
  '7gXYr76u3Maaf9ugAdWk',
);
console.log(pushes);
```

## Pushing template updates to wallets

Pushes the latest template changes to every wallet that contains a pass tied to one of
the supplied templates. Returns the number of passes queued for update.

```ts
const count = await client.campaigns.wallets.pushTemplates(
  'h8X2JxgrnEsu2U0dI8KN',
  ['T01', 'T02'],
);
console.log(count);
```

## Dismissing pending wallet pushes

Clears the "pending changes" notice on a campaign without actually pushing.

```ts
await client.campaigns.wallets.dismissPushes('h8X2JxgrnEsu2U0dI8KN');
```
