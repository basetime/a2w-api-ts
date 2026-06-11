# Usage

## Creating a new client with oauth

```ts
import { Client, OAuthProvider } from '@basetime/a2w-api-ts';

const appId = 'a2w-inspector';
const oauth = new OAuthProvider('a2w-inspector');
const client = new Client(oauth);
```

## Setting a custom user agent

```ts
const client = new Client();
client.http.setUserAgent('my-custom-user-agent/1.0.0');
```

## Custom fetch

All HTTP concerns live on `client.http`, an instance of `HttpRequester` that can also be constructed standalone (for example, in tests). When the client is not pre-configured to use a specific API endpoint, you can use the `fetch` method to make requests to the API, and authentication will be handled automatically.

```ts
const t = await client.http.fetch('/templates/simple/l74mNQLcjWnN2AoRRKG0');
console.log(t);
```
