import { test } from 'tap';
import EikConfig from '../../../lib/classes/eik-config.js';

const validEikConfig = {
    name: 'pizza',
    server: 'http://server',
    files: { '/': 'pizza' },
    version: '0.0.0',
};

test('EikConfig: .version: accessing the property', (t) => {
    const config = new EikConfig(validEikConfig);
    t.equal(config.version, '0.0.0', 'should return the given value');
    t.end();
});

test('EikConfig: .version: setting the property value', (t) => {
    const config = new EikConfig(validEikConfig);
    config.version = '1.0.1';
    t.equal(config.version, '1.0.1', 'should return the given value');
    t.end();
});
