# Barcodes

## Rendering a barcode

The barcode endpoint lives at the site root (outside `/api/v1`). The PNG body is returned
as a string.

```ts
const png = await client.barcodes.render({
  type: 'qrcode',
  data: 'hello',
  width: 300,
  height: 300,
});
```
