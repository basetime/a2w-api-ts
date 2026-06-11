# Campaign Workflows

## Listing workflows attached to a campaign

```ts
const attached = await client.campaigns.workflows.getAll('h8X2JxgrnEsu2U0dI8KN');
console.log(attached);
```

## Attaching a workflow to a campaign

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

## Updating a campaign workflow

```ts
await client.campaigns.workflows.update('h8X2JxgrnEsu2U0dI8KN', 'CWF01', {
  runsWhen: 'scheduled',
  schedule: { when: 'daily', weekday: '', monthday: '', time: '09:00' },
});
```

## Detaching a workflow from a campaign

Returns the remaining workflow attachments.

```ts
const remaining = await client.campaigns.workflows.detach(
  'h8X2JxgrnEsu2U0dI8KN',
  'CWF01',
);
console.log(remaining);
```
