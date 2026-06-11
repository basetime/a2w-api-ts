# Templates

## Fetching all templates

Fetches the templates for the authenticated organization.

```ts
const templates = await client.templates.getAll();
console.log(templates);
```

## Fetching a template by ID

```ts
const template = await client.templates.getById('id');
console.log(template);
```

## Fetching templates by tag

```ts
const templates = await client.templates.getByTag('tag');
console.log(templates);
```

## Cloning a template

```ts
const cloned = await client.templates.clone('TPL01');
console.log(cloned);
```

## Exporting a template

Returns the JSON bundle that can be re-imported into another organization.

```ts
const bundle = await client.templates.export('TPL01');
console.log(bundle);
```

## Importing a template

Pass a `Blob`/`File` or a `{ name, content }` shape and the SDK constructs the multipart
upload for you.

```ts
const imported = await client.templates.import({
  name: 'tpl.json',
  content: JSON.stringify(bundle),
});
console.log(imported);
```

## Deleting a template

```ts
await client.templates.delete('TPL01');
```
