# Templates

## `getAll(): Promise<Template[]>`

Returns all templates for the authenticated organization.

```ts
const templates = await client.templates.getAll();
console.log(templates);
```

## `getById(id): Promise<TemplateThumbnail>`

Returns a template by ID.

```ts
const template = await client.templates.getById('id');
console.log(template);
```

## `getByTag(tag): Promise<TemplateThumbnail[]>`

Returns all templates for a specific tag.

```ts
const templates = await client.templates.getByTag('tag');
console.log(templates);
```

## `clone(id): Promise<Template>`

Clones a template and returns the new template.

```ts
const cloned = await client.templates.clone('TPL01');
console.log(cloned);
```

## `export(id): Promise<Record<string, unknown>>`

Exports a template as a JSON bundle suitable for re-importing into another organization.

```ts
const bundle = await client.templates.export('TPL01');
console.log(bundle);
```

## `import(file): Promise<Template>`

Imports a template from a JSON bundle previously produced by `export`. Pass a `Blob`/`File` or a `{ name, content }` shape and the SDK constructs the multipart upload for you.

```ts
const imported = await client.templates.import({
  name: 'tpl.json',
  content: JSON.stringify(bundle),
});
console.log(imported);
```

## `delete(id): Promise<string>`

Deletes a template.

```ts
await client.templates.delete('TPL01');
```
