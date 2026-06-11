# Enrollments

## `create(campaignId, metaValues?, formValues?): Promise<EnrollmentResponse>`

Creates an enrollment for a campaign, and returns the bundle ID and any errors. This method requires `jwtEncode` to be set before calling.

```ts
const campaignId = 'h8X2JxgrnEsu2U0dI8KN';

// Meta values to assign to the pass bundle.
const meta = {
  banner: 'https://example.com/banner.png',
  backgroundColor: '#ae00ff',
};

// Form values to assign to the pass bundle. Typically, a primary key is set.
const form = {
  primaryKey: '1234567890',
  firstName: 'John',
  lastName: 'Doe',
};

// Returns the bundle ID and any errors.
const enrollment = await client.campaigns.enrollments.create(campaignId, meta, form);
console.log(enrollment.pass, enrollment.errors);
```
