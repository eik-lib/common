import { test } from 'tap';
import EikConfig from '../../../lib/classes/eik-config.js';

const validEikConfig = {
    name: 'pizza',
    server: 'http://server',
    files: { '/': 'pizza' },
    version: '0.0.0',
    type: 'npm',
};

test('EikConfig: .type: no value given', (t) => {
    const config = new EikConfig(null);
    t.equal(config.type, 'package', 'should default to "package"');
    t.end();
});

test('EikConfig: .type: value given', (t) => {
    // @ts-ignore
    const config = new EikConfig(validEikConfig);
    t.equal(config.type, 'npm', 'should overwrite default value');
    t.end();
});
