# Setup

After installing the package, wire up a `Client` with an API key and secret from your AddToWallet organization settings.

#### API credentials

Create an API key and secret in your organization's settings in the AddToWallet dashboard. Keep the secret private — treat it like a password.

Store both values in environment variables rather than hardcoding them in source:

```ts
import { Client, KeysProvider } from '@basetime/a2w-api-ts';

const auth = new KeysProvider(process.env.A2W_API_KEY!, process.env.A2W_API_SECRET!);
const client = new Client(auth);
```

Once constructed, the client is ready for authenticated API calls (for example, `client.campaigns.getAll()`).

#### How authentication works

`KeysProvider` exchanges your key and secret for an access token by posting to `/auth/apiGrant`. The shared auth layer caches the token, deduplicates concurrent grant requests, and refreshes it automatically before it expires.

#### Custom base URL

By default the client targets `https://app.addtowallet.io/api/v1`. To point at a different environment, pass `baseUrl` in the client options:

```ts
const client = new Client(auth, undefined, {
  baseUrl: 'https://staging.example.com/api/v1',
});
```
