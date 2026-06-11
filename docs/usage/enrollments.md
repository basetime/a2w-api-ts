# Enrollments

## Creating an enrollment

Creates an enrollment for a campaign, and returns the bundle ID and any errors.

```ts
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
