# Campaign Workflows

## `getAll(campaignId): Promise<CampaignWorkflow[]>`

Returns the workflows attached to a campaign.

```ts
const attached = await client.campaigns.workflows.getAll('h8X2JxgrnEsu2U0dI8KN');
console.log(attached);
```

## `attach(campaignId, body): Promise<CampaignWorkflow>`

Attaches a workflow to a campaign. `runsWhen` controls when the workflow fires (`'enrolled'`, `'claimed'`, `'installed'`, `'redeemed'`, `'updated'`, `'scanned'`, or `'scheduled'`). Pass a `schedule` when `runsWhen` is `'scheduled'`.

```ts
const attached = await client.campaigns.workflows.attach('h8X2JxgrnEsu2U0dI8KN', {
  workflowId: 'WF01',
  runsWhen: 'redeemed',
});
console.log(attached);
```

## `update(campaignId, workflowId, body): Promise<string>`

Updates an existing workflow attachment on a campaign.

```ts
await client.campaigns.workflows.update('h8X2JxgrnEsu2U0dI8KN', 'CWF01', {
  runsWhen: 'scheduled',
  schedule: { when: 'daily', weekday: '', monthday: '', time: '09:00' },
});
```

## `detach(campaignId, workflowId): Promise<CampaignWorkflow[]>`

Detaches a workflow from a campaign. Returns the remaining workflow attachments for the campaign.

```ts
const remaining = await client.campaigns.workflows.detach(
  'h8X2JxgrnEsu2U0dI8KN',
  'CWF01',
);
console.log(remaining);
```
