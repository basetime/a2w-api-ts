# Organizations

## Fetching the authenticated organization

```ts
const organization = await client.organizations.getMine();
console.log(organization);
```

## Managing webhooks

```ts
const webhooks = await client.organizations.webhooks.getAll();

const created = await client.organizations.webhooks.create({
  displayName: 'Redemption Notifier',
  url: 'https://example.com/hooks/redemption',
  event: 'redeemed',
  password: 'shared-secret',
});

await client.organizations.webhooks.update(created.id, {
  ...created,
  displayName: 'Renamed',
});

await client.organizations.webhooks.delete(created.id);

const logs = await client.organizations.webhooks.getLogs();
console.log(logs);
```

## Managing data stores

```ts
const stores = await client.organizations.dataStores.getAll();

const created = await client.organizations.dataStores.create({
  name: 'Member tiers',
  source: 'key-value',
  keyValue: [
    { key: 'gold', value: '1000' },
    { key: 'silver', value: '500' },
  ],
});

const fetched = await client.organizations.dataStores.getById(created.id);

await client.organizations.dataStores.update(created.id, {
  ...created,
  name: 'Renamed',
});

await client.organizations.dataStores.delete(created.id);
```

## Managing exporters

```ts
const exporters = await client.organizations.exporters.getAll();

const created = await client.organizations.exporters.create({
  name: 'Nightly SFTP',
  what: 'enrollments',
  when: 'daily',
  time: '03:00',
  source: 'sftp',
  config: {
    hostname: 'sftp.example.com',
    username: 'a2w',
    password: 'secret',
    filename: 'enrollments.csv',
  },
});

const ex = created[0];
await client.organizations.exporters.run(ex.id);

const logs = await client.organizations.exporters.getLogs(ex.id);
console.log(logs);

await client.organizations.exporters.delete(ex.id);
```
