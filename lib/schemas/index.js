// @ts-check

// @ts-ignore
import schema from './eikjson.schema.json' assert { type: 'json' };
import * as validate from './validate.js';
import assert from './assert.js';
import ValidationError from './validation-error.js';

export default { schema, validate, assert, ValidationError };
