const tap = require('tap');
const { Readable } = require('stream');
const { stream } = require('../index.js');

tap.test('handle streams', (t) => {
    const s = new Readable();
    t.equal(stream.isStream(s), true);
    t.equal(stream.isReadableStream(s), true);

    const fakeStream = { pipe: 'not-a-function' };
    t.equal(stream.isStream(fakeStream), false);
    t.equal(stream.isReadableStream(fakeStream), false);
    t.end();
});
