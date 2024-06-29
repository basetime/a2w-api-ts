# AddToWallet Typescript Client

Client library that communicates with the addtowallet API.

```ts
import { Client } from '@basetime/a2w-api-ts';

const client = new Client('api_key', 'api_secret');
const passes = await client.campaigns.getPasses('123');
console.log(passes);
```

## Installing

```bash
npm i @basetime/a2w-api-ts
# or
yarn add @basetime/a2w-api-ts
# or
pnpm add @basetime/a2w-api-ts
```

## Deveoping

Run the `watch` command while writing code.

```bash
pnpm watch
```

## Building

Run the `build` command to build the code.

```bash
pnpm build
```
