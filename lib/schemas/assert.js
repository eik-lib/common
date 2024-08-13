import {
    eikJSON,
    name,
    version,
    type,
    server,
    files,
    importMap,
    out,
} from './validate.js';
import ValidationError from './validation-error.js';

/**
 * @template T
 * @callback SchemaAssert
 * @param {T} value
 * @returns {void}
 * @throws {ValidationError} if validation fails
 */

/**
 * @template T
 * @param {import('./validate.js').SchemaValidator<T>} validate
 * @param {string} message
 * @returns {SchemaAssert<T>}
 */
const assert = (validate, message) => (value) => {
    const valid = validate(value);
    if (valid.error) {
        const errorMessage = valid.error
            // @ts-ignore
            .map((err) => {
                let msg = err.message;
                if (err.params && err.params.allowedValues) {
                    msg += ` ("${err.params.allowedValues.join('", ')}")`;
                }
                return msg;
            })
            .join(',');
        // @ts-expect-error Maybe some toString magic happens here?
        throw new ValidationError(`${message}: ${errorMessage}`, valid.error);
    }
};

export default {
    /** Asserts the given [eik.json](https://eik.dev/docs/reference/eik-json) includes required fields that are valid */
    eikJSON: assert(eikJSON, 'Invalid eik.json schema'),
    /** Asserts the given [name](https://eik.dev/docs/reference/eik-json#name) value is valid*/
    name: assert(name, 'Parameter "name" is not valid'),
    /** Asserts the given [type](https://eik.dev/docs/reference/eik-json#type) value is valid*/
    type: assert(type, 'Parameter "type" is not valid'),
    /** Asserts the given [version](https://eik.dev/docs/reference/eik-json#version) value is valid*/
    version: assert(version, 'Parameter "version" is not valid'),
    /** Asserts the given [server](https://eik.dev/docs/reference/eik-json#server) value is valid*/
    server: assert(server, 'Parameter "server" is not valid'),
    /** Asserts the given [files](https://eik.dev/docs/reference/eik-json#files) value is valid  */
    files: assert(files, 'Parameter "files" is not valid'),
    /** Asserts the given [import-map](https://eik.dev/docs/reference/eik-json#import-map) value is valid  */
    importMap: assert(importMap, 'Parameter "import-map" is not valid'),
    /** Asserts the given [out](https://eik.dev/docs/reference/eik-json#out) value is valid  */
    out: assert(out, 'Parameter "out" is not valid'),
};
