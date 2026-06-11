# Scanners

## Fetching all scanner apps

```ts
const apps = await client.scanners.getAll();
console.log(apps);
```

## Fetching a scanner app by ID

```ts
const app = await client.scanners.getById('XVK0xIy2vQinDJWUbKnO');
console.log(app);
```

## Creating a scanner app

`createApp` and `updateApp` accept one of two scanner app input shapes. Standard scanner
apps can set the usual scanner fields, but cannot set `jsonConfig` or `jsonConfigUrl`.
JSON-configured scanner apps must set `isJsonConfigured: true` and can only set
`jsonConfig` and/or `jsonConfigUrl`.

```ts
const app = await client.scanners.createApp({
  name: 'My Scanner',
  description: 'My Scanner',
  tags: ['tag1', 'tag2'],
  webviewScanUrl: 'https://example.com/scan',
  webviewStandbyUrl: 'https://example.com/standby',
  webviewPassword: 'password',
  passCode: '1234',
  brandColor: '#ae00ff',
  brandLogoUrl: 'https://example.com/logo.png',
  isKioskMode: true,
});
console.log(app);
```

For a JSON-configured scanner app:

```ts
const app = await client.scanners.createApp({
  isJsonConfigured: true,
  jsonConfigUrl: 'https://example.com/scanner-config.json',
});
console.log(app);
```

## Updating a scanner app

```ts
await client.scanners.updateApp('XVK0xIy2vQinDJWUbKnO', {
  name: 'My Scanner',
  description: 'My Scanner',
  tags: ['tag1', 'tag2'],
  webviewScanUrl: 'https://example.com/scan',
  webviewStandbyUrl: 'https://example.com/standby',
  webviewPassword: 'password',
  passCode: '1234',
  brandColor: '#ae00ff',
  brandLogoUrl: 'https://example.com/logo.png',
  isKioskMode: true,
});
```

For a JSON-configured scanner app update:

```ts
await client.scanners.updateApp('XVK0xIy2vQinDJWUbKnO', {
  isJsonConfigured: true,
  jsonConfig: '{"theme":"dark"}',
});
```

## Deleting a scanner app

```ts
await client.scanners.deleteApp('XVK0xIy2vQinDJWUbKnO');
```
