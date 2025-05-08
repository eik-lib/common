# @eik/common

This package contains common utilities and schemas used in other Eik modules.

## Schema

The [schema for `eik.json`](https://eik.dev/docs/reference/eik-json#json-schema)
can be found here in this repo. Here is how you can use it in your `eik.json`.

```json
{
	"$schema": "https://raw.githubusercontent.com/eik-lib/common/main/lib/schemas/eikjson.schema.json",
	"name": "my-app",
	"version": "1.0.0",
	"server": "https://eik.store.com",
	"files": "./public",
	"import-map": ["https://eik.store.com/map/store/v1"]
}
```

`@eik/common` has a JavaScript API to [check against the schema](#schemas).

## API

### helpers

`helpers` has utility functions used by several other Eik modules.

```js
import { helpers } from "@eik/common";

let config = helpers.getDefaults();
```

These are the available functions on `helpers`.

| Name                  | Description                                                                                                                                                                                      |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `getDefaults`         | Reads configuration from `eik.json` or `package.json`. Includes defaults for missing optional settings.                                                                                          |
| `localAssets`         | Sets up asset routes for local development. Mounted paths match those on Eik server and values are read from projects eik.json file.                                                             |
| `typeSlug`            | Maps between Eik configuration values for the package type and its URL/file system value.                                                                                                        |
| `typeTitle`           | Maps between a type config value and its title. Essentially uppercases the input.                                                                                                                |
| `addTrailingSlash`    |                                                                                                                                                                                                  |
| `removeTrailingSlash` |                                                                                                                                                                                                  |
| `addLeadingSlash`     |                                                                                                                                                                                                  |
| `removeLeadingSlash`  |                                                                                                                                                                                                  |
| `resolveFiles`        | Uses an Eik JSON "files" definition to resolve files on disk into a data structure. Returns a list of [ResolvedFile](https://github.com/eik-lib/common/blob/main/lib/classes/resolved-files.js). |
| `configStore`         | Collection of helper methods for reading and writing Eik configuration files.                                                                                                                    |
| `fetchImportMaps`     | Helper to get import maps (array of URLs) with some common error handling.                                                                                                                       |

#### localAssets

Sets up asset routes for local development. Mounted paths match those on Eik server and values are read from projects eik.json file.

Given this server and `eik.json`, the following routes would be added to your app.

```js
import { helpers } from "@eik/common";
import express from "express";

let app = express();

await helpers.localAssets(app);
```

```json
{
	"name": "my-app",
	"version": "1.0.0",
	"server": "https://eik.store.com",
	"files": {
		"esm.js": "./assets/esm.js",
		"esm.css": "./assets/esm.css",
		"/": "./assets/**/*.map"
	}
}
```

```
/pkg/my-app/1.0.0/esm.js
/pkg/my-app/1.0.0/esm.css
/pkg/my-app/1.0.0/esm.js.map
/pkg/my-app/1.0.0/esm.css.map
```

### schemas

`schemas` has functions to check values against the [`eik.json` schema](#schema).
You can check a value against the schema for `eik.json` as a whole, or for individual
values in the schema.

```js
import { schemas } from "@eik/common";

let { error, value } = schemas.validate.eikJSON(eikConfig);
if (error) {
	// fallback
}
```

If you prefer, you can use the `assert` API which throws on error.

```js
import { schemas } from "@eik/common";

try {
	schemas.assert.eikJSON(eikConfig);
} catch {
	// fallback
}
```

These are the available functions on `schemas.validate` and `schemas.assert`.

| Name        | Description                                                             |
| ----------- | ----------------------------------------------------------------------- |
| `eikJSON`   | Checks that the given value includes required fields that are valid     |
| `name`      | Checks [name](https://eik.dev/docs/reference/eik-json#name)             |
| `version`   | Checks [version](https://eik.dev/docs/reference/eik-json#version)       |
| `type`      | Checks [type](https://eik.dev/docs/reference/eik-json#type)             |
| `server`    | Checks [server](https://eik.dev/docs/reference/eik-json#server)         |
| `files`     | Checks [files](https://eik.dev/docs/reference/eik-json#files)           |
| `importMap` | Checks [import-map](https://eik.dev/docs/reference/eik-json#import-map) |
| `out`       | Checks [out](https://eik.dev/docs/reference/eik-json#out)               |

### stream

`stream` has functions to check that a value is a Stream.

```js
import { stream } from "@eik/common";

if (stream.isStream(maybeStream)) {
	// yup, it's a Stream
}

if (stream.isReadableStream(maybeReadableStream)) {
	// yup, it's a ReadableStream
}
```

### validators

`validators` functions return the provided string normalized to lowercase, or throw an Error if the value does not pass the validation rules.
Where possible, prefer using the [`schemas` API](#schemas).

```js
import { validators } from "@eik/common";

let alias = validators.alias("1");
```

These are the available functions on `validators`.

| Name         | Description                                                      |
| ------------ | ---------------------------------------------------------------- |
| `alias`      | Checks that a value is a valid alias value (ex 1)                |
| `name`       | Checks that a value is a valid package name                      |
| `org`        | Checks that a value is a valid organisation name.                |
| `origin`     | Check that a value looks like an HTTP origin.                    |
| `version`    | Checks that a value is a valid semver version                    |
| `semverType` | Checks that a value is a valid semver type (major, minor, patch) |
| `type`       | Checks that the value is a valid Eik type (pkg, npm, map)        |
