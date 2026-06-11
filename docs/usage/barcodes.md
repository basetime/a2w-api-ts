# Barcodes

## `render(input): Promise<string>`

Renders a barcode and returns the PNG body as a string. The barcode endpoint lives at the site root (outside `/api/v1`).

```ts
const png = await client.barcodes.render({
  type: 'qrcode',
  data: 'hello',
  width: 300,
  height: 300,
});
```
