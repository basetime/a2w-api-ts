# Widgets

## Signing a JWT with widgets

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
