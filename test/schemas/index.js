const { test } = require('tap');
const { assets } = require('../../lib/schemas/index');

test('validate basic asset manifest', t => {
    const result = assets({
        organisation: 'my-org',
        name: 'my-app-name',
        major: '1',
        server: 'http://localhost:4001',
        js: {
            input: './assets/scripts.js',
            options: { async: true, defer: true },
        },
        css: {
            input: './assets/styles.css',
            options: {},
        },
    });
    t.equal(result.error, false);
    t.end();
});

test('validate asset manifest - all props invalid', t => {
    const result = assets({
        organisation: '',
        name: '',
        server: '',
    });

    t.equal(result.error[0].dataPath, '.name');
    t.equal(result.error[0].message, 'should NOT be shorter than 2 characters');
    t.end();
});

test('validate asset manifest - all props invalid except name', t => {
    const result = assets({
        organisation: '',
        name: 'my-app',
        server: '',
    });

    t.equal(result.error[0].dataPath, '.organisation');
    t.equal(result.error[0].message, 'should NOT be shorter than 2 characters');
    t.end();
});

test('validate asset manifest - invalid server - empty string', t => {
    const result = assets({
        organisation: 'my-org',
        name: 'my-app',
        server: '',
    });

    t.equal(result.error[0].dataPath, '.server');
    t.equal(result.error[0].message, 'should NOT be shorter than 7 characters');
    t.end();
});

test('validate asset manifest - invalid server - invalid string format', t => {
    const result = assets({
        organisation: 'my-org',
        name: 'my-app',
        server: 'asdasdasdasd',
    });

    t.equal(result.error[0].dataPath, '.server');
    t.equal(
        result.error[0].message,
        'should match pattern "^https?://[a-zA-Z0-9-_./]+(:[0-9]+)?"',
    );
    t.end();
});

test('minimum viable', t => {
    const result = assets({
        organisation: 'my-org',
        name: 'my-app',
        server: 'http://localhost:4001',
    });

    t.equal(result.error, false);
    t.same(result.value, {
        organisation: 'my-org',
        name: 'my-app',
        server: 'http://localhost:4001',
        js: { input: '', options: {} },
        css: { input: '', options: {} },
    });
    t.end();
});

test('js and css fields', t => {
    const result = assets({
        organisation: 'my-org',
        name: 'my-app',
        major: '1',
        server: 'http://localhost:4001',
        js: {
            input: './assets/scripts.js',
            options: {
                async: true,
                defer: true,
            },
        },
        css: {
            input: './assets/styles.css',
            options: {
                crossorigin: 'etc etc',
            },
        },
    });

    t.equal(result.error, false);
    t.same(result.value, {
        organisation: 'my-org',
        name: 'my-app',
        major: '1',
        server: 'http://localhost:4001',
        js: {
            input: './assets/scripts.js',
            options: {
                async: true,
                defer: true,
            },
        },
        css: {
            input: './assets/styles.css',
            options: {
                crossorigin: 'etc etc',
            },
        },
    });
    t.end();
});

test('import-map field invalid type', t => {
    const result = assets({
        organisation: 'my-org',
        name: 'my-app',
        server: 'http://localhost:4001',
        'import-map': 'invalid',
    });

    t.equal(
        result.error[0].message,
        'should be array',
        'invalid import map type errors',
    );
    t.end();
});

test('import-map field invalid array entry', t => {
    const result = assets({
        organisation: 'my-org',
        name: 'my-app',
        server: 'http://localhost:4001',
        'import-map': ['invalid'],
    });

    t.equal(
        result.error[0].message,
        'should match pattern "^https?://[a-zA-Z0-9-_./]+(:[0-9]+)?"',
        'invalid import map array entry errors',
    );
    t.end();
});

test('import-map field valid', t => {
    const result = assets({
        organisation: 'my-org',
        name: 'my-app',
        server: 'http://localhost:4001',
        'import-map': ['http://localhost:4001/finn/map/buzz/v1'],
    });

    t.equal(result.error, false, 'no errors in result');
    t.same(
        result.value,
        {
            organisation: 'my-org',
            name: 'my-app',
            server: 'http://localhost:4001',
            js: {
                input: '',
                options: {},
            },
            css: {
                input: '',
                options: {},
            },
            'import-map': ['http://localhost:4001/finn/map/buzz/v1'],
        },
        'result.value matches output',
    );
    t.end();
});

test('import-map field valid empty array', t => {
    const result = assets({
        organisation: 'my-org',
        name: 'my-app',
        server: 'http://localhost:4001',
        'import-map': [],
    });

    t.equal(result.error, false, 'result does not return error');
    t.same(
        result.value,
        {
            organisation: 'my-org',
            name: 'my-app',
            server: 'http://localhost:4001',
            js: {
                input: '',
                options: {},
            },
            css: {
                input: '',
                options: {},
            },
            'import-map': [],
        },
        'result.value matches expected object',
    );
    t.end();
});
