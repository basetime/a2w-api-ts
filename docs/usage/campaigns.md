# Campaigns

## `getAll(): Promise<Campaign[]>`

Returns all campaigns for the authenticated organization.

```ts
const campaigns = await client.campaigns.getAll();
console.log(campaigns);
```

## `update(id, body): Promise<Campaign>`

Updates a campaign. Mirrors the backend Joi schema permissively. `templates` accepts a list of template IDs to associate with the campaign.

```ts
const updated = await client.campaigns.update('h8X2JxgrnEsu2U0dI8KN', {
  name: 'Renamed Campaign',
  templates: ['T01', 'T02'],
});
console.log(updated);
```

## `createSimple(id, body): Promise<Campaign>`

Creates or updates a "simple" campaign from a template and placeholder values. Pass `'__new'` as the ID to create a brand-new campaign, or an existing campaign ID to update one in place.

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

## `clone(id): Promise<string>`

Clones a campaign and returns the ID of the new campaign.

```ts
const newCampaignId = await client.campaigns.clone('h8X2JxgrnEsu2U0dI8KN');
console.log(newCampaignId);
```

## `delete(id): Promise<string>`

Deletes a campaign.

```ts
await client.campaigns.delete('h8X2JxgrnEsu2U0dI8KN');
```
