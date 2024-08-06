import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import * as validate from './validate.js';
import assert from './assert.js';
import ValidationError from './validation-error.js';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const schema = JSON.parse(
    readFileSync(join(__dirname, './eikjson.schema.json'), 'utf8'),
);

export default { schema, validate, assert, ValidationError };
