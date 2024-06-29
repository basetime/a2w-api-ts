# AddToWallet Typescript Client

Client library that communicates with the addtowallet API.

```ts
import { Client } from '@basetime/a2w-api-ts';

const client = new Client('api_key', 'api_secret');
const passes = await client.campaigns.getPasses('123');
console.log(passes);
```
