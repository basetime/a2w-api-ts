# Organizations

## `getMine(): Promise<Organization>`

Fetches the details of the authenticated organization.

```ts
const organization = await client.organizations.getMine();
console.log(organization);
```

## `webhooks.getAll(): Promise<Webhook[]>`

Returns all webhooks for the authenticated organization.

```ts
const webhooks = await client.organizations.webhooks.getAll();
console.log(webhooks);
```

## `webhooks.create(body): Promise<Webhook>`

Creates a new webhook.

```ts
const created = await client.organizations.webhooks.create({
  displayName: 'Redemption Notifier',
  url: 'https://example.com/hooks/redemption',
  event: 'redeemed',
  password: 'shared-secret',
});
console.log(created);
```

## `webhooks.update(id, body): Promise<Webhook>`

Updates an existing webhook.

```ts
await client.organizations.webhooks.update('webhook-id', {
  displayName: 'Renamed',
  url: 'https://example.com/hooks/redemption',
  event: 'redeemed',
  password: 'shared-secret',
});
```

## `webhooks.delete(id): Promise<string>`

Deletes a webhook.

```ts
await client.organizations.webhooks.delete('webhook-id');
```

## `webhooks.getLogs(): Promise<WebhookLog[]>`

Returns the delivery logs for all webhooks owned by the authenticated organization.

```ts
const logs = await client.organizations.webhooks.getLogs();
console.log(logs);
```

## `dataStores.getAll(): Promise<DataStore[]>`

Returns all data stores for the authenticated organization.

```ts
const stores = await client.organizations.dataStores.getAll();
console.log(stores);
```

## `dataStores.create(body): Promise<DataStore>`

Creates a new data store.

```ts
const created = await client.organizations.dataStores.create({
  name: 'Member tiers',
  source: 'key-value',
  keyValue: [
    { key: 'gold', value: '1000' },
    { key: 'silver', value: '500' },
  ],
});
console.log(created);
```

## `dataStores.getById(id): Promise<DataStore>`

Returns a single data store by ID.

```ts
const fetched = await client.organizations.dataStores.getById('data-store-id');
console.log(fetched);
```

## `dataStores.update(id, body): Promise<DataStore>`

Updates an existing data store.

```ts
await client.organizations.dataStores.update('data-store-id', {
  name: 'Renamed',
  source: 'key-value',
  keyValue: [{ key: 'gold', value: '1000' }],
});
```

## `dataStores.delete(id): Promise<DataStore[]>`

Deletes a data store. Returns the remaining data stores for the organization.

```ts
await client.organizations.dataStores.delete('data-store-id');
```

## `exporters.getAll(): Promise<Exporter[]>`

Returns all exporters for the authenticated organization.

```ts
const exporters = await client.organizations.exporters.getAll();
console.log(exporters);
```

## `exporters.create(body): Promise<Exporter[]>`

Creates a new exporter. Returns the full list of exporters after creation.

```ts
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
console.log(created);
```

## `exporters.run(id): Promise<string>`

Runs an exporter on demand.

```ts
await client.organizations.exporters.run('exporter-id');
```

## `exporters.getLogs(id): Promise<ExporterLog[]>`

Returns the execution logs for an exporter.

```ts
const logs = await client.organizations.exporters.getLogs('exporter-id');
console.log(logs);
```

## `exporters.delete(id): Promise<string>`

Deletes an exporter.

```ts
await client.organizations.exporters.delete('exporter-id');
```
