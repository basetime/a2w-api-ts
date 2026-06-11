# Widgets

## `signCampaignJwt(campaignId, payload): Promise<string>`

Signs a campaign-scoped payload as a JWT. The backend signs with the campaign's `openEnrollmentJwtSecret`, so no client-side secret is required.

## `enrollments.create(campaignId, metaValues?, formValues?): Promise<EnrollmentResponse>`

Creates an enrollment for a campaign. Wire `jwtEncode` to `signCampaignJwt` before calling `create`:

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

## `signJwt(payload, secret): Promise<string>`

Signs an arbitrary payload as a JWT using a caller-supplied secret.

```ts
const token = await client.widgets.signJwt({ sub: 'user-1' }, 'shared-secret');
```
