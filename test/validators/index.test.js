import { test } from "node:test";
import assert from "node:assert/strict";
import * as validators from "../../lib/validators/index.js";

const RE_ORIGIN_NOT_VALID = /Parameter "origin" is not valid/;
const RE_ORG_NOT_VALID = /Parameter "org" is not valid/;
const RE_NAME_NOT_VALID = /Parameter "name" is not valid/;
const RE_VERSION_NOT_VALID = /Parameter "version" is not valid/;
const RE_ALIAS_NOT_VALID = /Parameter "alias" is not valid/;
const RE_TYPE_NOT_VALID = /Parameter "type" is not valid/;
const RE_SEMVER_TYPE_NOT_VALID = /Parameter "semverType" is not valid/;

//
// .origin()
//

test(".origin() - valid values - should return value", () => {
	assert.strictEqual(
		validators.origin("http://origin.com"),
		"http://origin.com",
	);
	assert.strictEqual(
		validators.origin("http://origin.com/one/two"),
		"http://origin.com/one/two",
	);
	assert.strictEqual(validators.origin("http://s"), "http://s");
	assert.strictEqual(validators.origin("https://s"), "https://s");
	assert.strictEqual(
		validators.origin("http://localhost:4001"),
		"http://localhost:4001",
	);
	assert.strictEqual(
		validators.origin("http://127.0.0.1:4001"),
		"http://127.0.0.1:4001",
	);
});

test(".origin() - invalid values - should throw", () => {
	assert.throws(() => {
		validators.origin("!name");
	}, RE_ORIGIN_NOT_VALID);
});

test(".origin() - upper case valid value - should convert to lower case value", () => {
	assert.strictEqual(
		validators.origin("http://some-origin"),
		"http://some-origin",
	);
	assert.strictEqual(
		validators.origin("http://SOME_origin"),
		"http://some_origin",
	);
});

//
// .org()
//

test(".org() - valid values - should return value", () => {
	assert.strictEqual(validators.org("someorg"), "someorg");
	assert.strictEqual(validators.org("some-org"), "some-org");
	assert.strictEqual(validators.org("some_org"), "some_org");
	assert.strictEqual(validators.org("123"), "123");
});

test(".org() - invalid values - should throw", () => {
	assert.throws(() => {
		validators.org("!name");
	}, RE_ORG_NOT_VALID);
});

test(".org() - upper case valid value - should convert to lower case value", () => {
	assert.strictEqual(validators.org("SOMEorg"), "someorg");
	assert.strictEqual(validators.org("some-ORG"), "some-org");
	assert.strictEqual(validators.org("SOME_ORG"), "some_org");
	assert.strictEqual(validators.org("123"), "123");
});

//
// .name()
//

test(".name() - valid values - should return value", () => {
	assert.strictEqual(validators.name("some-package"), "some-package");
	assert.strictEqual(validators.name("example.com"), "example.com");
	assert.strictEqual(validators.name("under_score"), "under_score");
	assert.strictEqual(validators.name("123numeric"), "123numeric");
	assert.strictEqual(validators.name("@npm/thingy"), "@npm/thingy");
	assert.strictEqual(validators.name("@jane/foo.js"), "@jane/foo.js");
});

test(".name() - invalid values - should throw", () => {
	assert.throws(() => {
		validators.name(" leading-space:and:weirdchars");
	}, RE_NAME_NOT_VALID);
});

//
// .version()
//

test(".version() - valid values - should return value", () => {
	assert.strictEqual(validators.version("2.3.4"), "2.3.4");
	assert.strictEqual(validators.version("1.2.4-beta.0"), "1.2.4-beta.0");
});

test(".version() - invalid values - should throw", () => {
	assert.throws(() => {
		validators.version(" 1.and:weirdchars~5");
	}, RE_VERSION_NOT_VALID);
});

test(".version() - caret range - should throw", () => {
	assert.throws(() => {
		validators.version("^1.2.4");
	}, RE_VERSION_NOT_VALID);
});

test(".version() - tilde range - should throw", () => {
	assert.throws(() => {
		validators.version("~1.2.4");
	}, RE_VERSION_NOT_VALID);
});

test(".version() - X-range - should throw", () => {
	assert.throws(() => {
		validators.version("1.x");
	}, RE_VERSION_NOT_VALID);
});

test(".version() - * - should throw", () => {
	assert.throws(() => {
		validators.version("*");
	}, RE_VERSION_NOT_VALID);
});

test(".version() - latest - should throw", () => {
	assert.throws(() => {
		validators.version("latest");
	}, RE_VERSION_NOT_VALID);
});

//
// .alias()
//

test(".alias() - valid values - should return value", () => {
	assert.strictEqual(validators.alias("8"), "8");
	assert.strictEqual(validators.alias("10"), "10");
	assert.strictEqual(
		validators.alias("10893475983749384"),
		"10893475983749384",
	);
});

test(".name() - invalid value - semver patch - should throw", () => {
	assert.throws(() => {
		validators.alias("1.2.4");
	}, RE_ALIAS_NOT_VALID);
});

test(".name() - invalid value - semver minor - should throw", () => {
	assert.throws(() => {
		validators.alias("1.2");
	}, RE_ALIAS_NOT_VALID);
});

test(".name() - invalid value - semver latest - should throw", () => {
	assert.throws(() => {
		validators.alias("latest");
	}, RE_ALIAS_NOT_VALID);
});

//
// .type()
//

test(".type() - valid values - should return value", () => {
	assert.strictEqual(validators.type("pkg"), "pkg");
	assert.strictEqual(validators.type("map"), "map");
	assert.strictEqual(validators.type("npm"), "npm");
});

test(".type() - invalid value - should throw", () => {
	assert.throws(() => {
		validators.type("foo");
	}, RE_TYPE_NOT_VALID);
});

test(".type() - invalid value - upper case - should throw", () => {
	assert.throws(() => {
		validators.type("PKG");
	}, RE_TYPE_NOT_VALID);
});

//
// .extra()
//

test(".extra() - valid values - should return value", () => {
	assert.strictEqual(
		validators.extra("/foo/bar/index.js"),
		"/foo/bar/index.js",
	);
	assert.strictEqual(
		validators.extra("/foo/a9-8_3/index.js"),
		"/foo/a9-8_3/index.js",
	);
	assert.strictEqual(validators.extra("/foo/bar"), "/foo/bar");
	assert.strictEqual(validators.extra("index.js"), "index.js");
});

//
// .semverType()
//

test(".semverType() - valid values - should return value", () => {
	assert.strictEqual(validators.semverType("major"), "major");
	assert.strictEqual(validators.semverType("minor"), "minor");
	assert.strictEqual(validators.semverType("patch"), "patch");
});

test(".semverType() - invalid value - should throw", () => {
	assert.throws(() => {
		validators.semverType("foo");
	}, RE_SEMVER_TYPE_NOT_VALID);
});

test(".semverType() - invalid value - upper case - should throw", () => {
	assert.throws(() => {
		validators.semverType("MAJOR");
	}, RE_SEMVER_TYPE_NOT_VALID);
});
