# Images

## Get image by ID

```ts
const image = await client.images.getById('bWVkrfizHBXyETJEIMk9');
console.log(image);
```

## Get images by IDs

```ts
const images = await client.images.getByIds(['bWVkrfizHBXyETJEIMk9', 'pb6flbrYzrrz4rRSPA7l']);
console.log(images);
```
