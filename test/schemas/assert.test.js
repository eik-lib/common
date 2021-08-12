const { test } = require('tap');
const { assert } = require('../../lib/schemas/index');

test('assert basic eik JSON file', (t) => {
    t.notThrow(() => {
        assert.eikJSON({
            name: 'my-app-name',
            version: '1.0.0',
            server: 'http://localhost:4001',
            files: {
                'index.js': './assets/scripts.js',
                'index.css': './assets/styles.css',
            },
        });
    });
    t.end();
});

test('assert eik JSON file - mutation does not occur', (t) => {
    const data = {
        name: 'my-app-name',
        version: '1.0.0',
        server: 'http://localhost:4001',
        files: {
            'index.js': './assets/scripts.js',
            'index.css': './assets/styles.css',
        },
    };

    assert.eikJSON(data);

    t.same(data, {
        name: 'my-app-name',
        version: '1.0.0',
        server: 'http://localhost:4001',
        files: {
            'index.js': './assets/scripts.js',
            'index.css': './assets/styles.css',
        },
    });
    t.end();
});

test('assert asset manifest - all props invalid', (t) => {
    t.throws(() => {
        assert.eikJSON({
            name: '',
        });
    });
    t.end();
});

test('assert name: empty string', (t) => {
    t.throws(() => {
        assert.name('');
    });
    t.end();
});

test('assert name: valid', (t) => {
    t.notThrow(() => {
        assert.name('@finn-no/my-app');
    });
    t.end();
});

test('assert name: invalid by assert-npm-package-name module', (t) => {
    t.throws(() => {
        assert.name('@finn-no/my-app~');
    });
    t.end();
});

test('assert version: empty string', (t) => {
    t.throws(() => {
        assert.version('');
    });
    t.end();
});

test('assert version: valid', (t) => {
    t.notThrow(() => {
        assert.version('1.0.0');
    });
    t.end();
});

test('assert type: invalid', (t) => {
    t.plan(1);
    try {
        assert.type('foo');
    } catch (err) {
        t.equal(
            err.message,
            'Parameter "type" is not valid: must be equal to one of the allowed values ("package", npm", map")',
        );
    }
    t.end();
});

test('assert type: valid - package', (t) => {
    t.notThrow(() => {
        assert.type('package');
    });
    t.end();
});

test('assert type: valid - npm', (t) => {
    t.notThrow(() => {
        assert.type('npm');
    });
    t.end();
});

test('assert type: valid - map', (t) => {
    t.notThrow(() => {
        assert.type('map');
    });
    t.end();
});

test('assert version: invalid by node-semver module', (t) => {
    t.throws(() => {
        assert.version('1.0');
    });
    t.end();
});

test('assert server: valid', (t) => {
    t.notThrow(() => {
        assert.server('http://localhost:4000');
    });
    t.end();
});

test('assert server: invalid', (t) => {
    t.throws(() => {
        assert.server('localhost');
    });
    t.end();
});

test('assert files: valid', (t) => {
    t.notThrow(() => {
        assert.files({ 'index.js': '/path/to/file.js' });
    });
    t.end();
});

test('assert files: invalid', (t) => {
    t.throws(() => {
        assert.files({ asd: 1 });
    });
    t.end();
});

test('assert files: invalid', (t) => {
    t.throws(() => {
        assert.files({});
    });
    t.end();
});

test('assert importMap: valid string', (t) => {
    t.notThrow(() => {
        assert.importMap('http://myimportmap/file.json');
    });
    t.end();
});

test('assert importMap: valid array', (t) => {
    t.notThrow(() => {
        assert.importMap([
            'http://myimportmap/file1.json',
            'http://myimportmap/file2.json',
        ]);
    });
    t.end();
});

test('assert importMap: invalid string', (t) => {
    t.throws(() => {
        assert.importMap('');
    });
    t.end();
});

test('assert importMap: invalid array', (t) => {
    t.throws(() => {
        assert.importMap(['']);
    });
    t.end();
});

test('assert out: valid', (t) => {
    t.notThrow(() => {
        assert.out('./.eik');
    });
    t.end();
});

test('assert out: invalid', (t) => {
    t.throws(() => {
        assert.out('');
    });
    t.end();
});
