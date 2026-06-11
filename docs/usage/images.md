# Images

## `getById(id): Promise<Image | null>`

Returns the image with the given ID.

```ts
const image = await client.images.getById('bWVkrfizHBXyETJEIMk9');
console.log(image);
```

## `getByIds(ids): Promise<Image[]>`

Returns the images with the given IDs.

```ts
const images = await client.images.getByIds(['bWVkrfizHBXyETJEIMk9', 'pb6flbrYzrrz4rRSPA7l']);
console.log(images);
```
