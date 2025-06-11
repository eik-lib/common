import formats from "ajv-formats";
import validSemver from "semver/functions/valid.js";
import npmPkg from "validate-npm-package-name";
import Ajv from "ajv";
import eikJSONSchema from "./schema.js";

/**
 * @typedef {import('ajv').ErrorObject & { dataPath?: string }} ErrorObject
 */

/**
 * @template [T=unknown]
 * @callback SchemaValidator
 * @param {T} data
 * @returns {{ value: T; error: false | import('ajv').ErrorObject[]}}
 */

/**
 * Create a validator for the schema using {@link Ajv}
 * @template [T=unknown]
 * @param {unknown} schema
 * @param {import('ajv').Options} [ajvOptions]
 * @returns {SchemaValidator<T>}
 */
const createValidator = (schema, ajvOptions) => {
	// @ts-ignore
	const ajv = new Ajv(ajvOptions);
	// @ts-ignore
	formats(ajv); // Needed to support "uri"
	const validate = ajv.compile(schema);

	return (data) => {
		const cloned = JSON.parse(JSON.stringify(data));
		const valid = validate(cloned);
		return { value: cloned, error: !valid && validate.errors };
	};
};

/**
 * Checks that the given value includes required fields that are valid
 * @type {SchemaValidator<import('../../eikjson.js').EikjsonSchema>}
 */
const eikJSON = createValidator(eikJSONSchema, {
	removeAdditional: true,
	useDefaults: true,
});

/**
 * @param {SchemaValidator<string>} jsonSchemaValidator
 * @returns {SchemaValidator<string>}
 */
const createNameValidator = (jsonSchemaValidator) => (value) => {
	const result = jsonSchemaValidator(value);
	if (!result.error) {
		const pkvalid = npmPkg(value);
		/** @type {ErrorObject[]} */
		const errors = [];
		if (!pkvalid.validForNewPackages) {
			errors.push({
				keyword: "validForNewPackages",
				instancePath: ".name",
				dataPath: ".name", // this was here before, but maybe replaced by instancePath?
				schemaPath: "",
				params: [],
				message: "should be valid package name",
			});
		}
		if (errors.length) {
			result.error = errors;
		}
	}
	return result;
};

/**
 * @param {SchemaValidator<string>} jsonSchemaValidator
 * @returns {SchemaValidator<string>}
 */
const createVersionValidator = (jsonSchemaValidator) => (value) => {
	const result = jsonSchemaValidator(value);
	if (!result.error) {
		const version = validSemver(value);
		/** @type {ErrorObject[]} */
		const errors = [];
		if (!version) {
			errors.push({
				keyword: "invalidSemverRange",
				instancePath: ".version",
				dataPath: ".version",
				schemaPath: "",
				params: [],
				message: "should be valid semver range for version",
			});
		}
		if (errors.length) {
			result.error = errors;
		}
	}
	return result;
};

/**
 * Checks [name](https://eik.dev/docs/reference/eik-json#name)
 * @type {SchemaValidator<string>}
 */
const name = createNameValidator(
	createValidator(eikJSONSchema.properties.name),
);

/**
 * Checks [version](https://eik.dev/docs/reference/eik-json#version)
 * @type {SchemaValidator<string>}
 */
const version = createVersionValidator(
	createValidator(eikJSONSchema.properties.version),
);

/**
 * Checks [type](https://eik.dev/docs/reference/eik-json#type)
 * @type {SchemaValidator<string>}
 */
const type = createValidator(eikJSONSchema.properties.type);

/**
 * Checks [server](https://eik.dev/docs/reference/eik-json#server)
 * @type {SchemaValidator<string>}
 */
const server = createValidator(eikJSONSchema.properties.server);

/**
 * Checks [files](https://eik.dev/docs/reference/eik-json#files)
 * @type {SchemaValidator<string | Record<string, string>>}
 */
const files = createValidator(eikJSONSchema.properties.files);

/**
 * Checks [import-map](https://eik.dev/docs/reference/eik-json#import-map)
 * @type {SchemaValidator<string | string[]>}
 */
const importMap = createValidator(eikJSONSchema.properties["import-map"]);

/**
 * Checks [out](https://eik.dev/docs/reference/eik-json#out)
 * @type {SchemaValidator<string>}
 */
const out = createValidator(eikJSONSchema.properties.out);

export { eikJSON, name, version, type, server, files, importMap, out };
