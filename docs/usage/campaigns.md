# Campaigns

## Fetching all campaigns

Fetches the campaigns for the authenticated organization.

```ts
const campaigns = await client.campaigns.getAll();
console.log(campaigns);
```

## Updating a campaign

Mirrors the backend Joi schema permissively. `templates` accepts a list of template IDs
to associate with the campaign.

```ts
const updated = await client.campaigns.update('h8X2JxgrnEsu2U0dI8KN', {
  name: 'Renamed Campaign',
  templates: ['T01', 'T02'],
});
console.log(updated);
```

## Creating a simple campaign

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

## Cloning a campaign

Returns the ID of the newly created campaign.

```ts
const newCampaignId = await client.campaigns.clone('h8X2JxgrnEsu2U0dI8KN');
console.log(newCampaignId);
```

## Deleting a campaign

```ts
await client.campaigns.delete('h8X2JxgrnEsu2U0dI8KN');
```
