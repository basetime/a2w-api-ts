# Usage

## `Client(auth?, logger?, options?): Client`

Constructs a client with an OAuth provider. The auth provider is optional for public endpoints; wire one via `client.http.setAuth(...)` before calling authenticated routes.

```ts
import { Client, OAuthProvider } from '@basetime/a2w-api-ts';

const appId = 'a2w-inspector';
const oauth = new OAuthProvider('a2w-inspector');
const client = new Client(oauth);
```

## `setUserAgent(userAgent: string): void`

Sets a custom User-Agent header on all requests made through the client.

```ts
const client = new Client();
client.http.setUserAgent('my-custom-user-agent/1.0.0');
```

## `fetch(url, options?, authenticate?): Promise<T>`

Issues an authenticated HTTP request through the shared requester. Use this for ad-hoc calls to endpoints that do not yet have a dedicated helper.

All HTTP concerns live on `client.http`, an instance of `HttpRequester` that can also be constructed standalone (for example, in tests). When the client is not pre-configured to use a specific API endpoint, you can use the `fetch` method to make requests to the API, and authentication will be handled automatically.

```ts
const t = await client.http.fetch('/templates/simple/l74mNQLcjWnN2AoRRKG0');
console.log(t);
```
