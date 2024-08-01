import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import formats from 'ajv-formats';
import semver from 'semver';
import npmPkg from 'validate-npm-package-name';
import Ajv from 'ajv';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const eikJSONSchema = JSON.parse(
    readFileSync(join(__dirname, './eikjson.schema.json'), 'utf8'),
);

// @ts-ignore
const createValidator = (schema, ajvOptions) => {
    const ajv = new Ajv(ajvOptions);
    // @ts-ignore
    formats(ajv); // Needed to support "uri"
    const validate = ajv.compile({
        $schema: 'http://json-schema.org/schema#',
        ...schema,
    });

    // @ts-ignore
    return (data) => {
        const cloned = JSON.parse(JSON.stringify(data));
        const valid = validate(cloned);
        return { value: cloned, error: !valid && validate.errors };
    };
};

const eikJSON = createValidator(eikJSONSchema, {
    removeAdditional: true,
    useDefaults: true,
});
// @ts-ignore
const createNameValidator = (jsonSchemaValidator) => (value) => {
    const result = jsonSchemaValidator(value);
    if (!result.error) {
        const pkvalid = npmPkg(value);
        const errors = [];
        if (!pkvalid.validForNewPackages) {
            errors.push({
                keyword: 'validForNewPackages',
                dataPath: '.name',
                schemaPath: '',
                params: [],
                message: 'should be valid package name',
            });
        }
        if (errors.length) {
            result.error = errors;
        }
    }
    return result;
};
// @ts-ignore
const createVersionValidator = (jsonSchemaValidator) => (value) => {
    const result = jsonSchemaValidator(value);
    if (!result.error) {
        const version = semver.valid(value);
        const errors = [];
        if (!version) {
            errors.push({
                keyword: 'invalidSemverRange',
                dataPath: '.version',
                schemaPath: '',
                params: [],
                message: 'should be valid semver range for version',
            });
        }
        if (errors.length) {
            result.error = errors;
        }
    }
    return result;
};

const name = createNameValidator(
    createValidator(eikJSONSchema.properties.name),
);
const version = createVersionValidator(
    createValidator(eikJSONSchema.properties.version),
);
const type = createValidator(eikJSONSchema.properties.type);
const server = createValidator(eikJSONSchema.properties.server);
const files = createValidator(eikJSONSchema.properties.files);
const importMap = createValidator(eikJSONSchema.properties['import-map']);
const out = createValidator(eikJSONSchema.properties.out);

export { eikJSON, name, version, type, server, files, importMap, out };
