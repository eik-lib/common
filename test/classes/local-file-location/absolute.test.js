import { test } from 'tap';
import LocalFileLocation from '../../../lib/classes/local-file-location.js';

test('LocalFileLocation: .absolute for ./my/file.json', (t) => {
    const subject = new LocalFileLocation('./my/file.json', '/base/path');
    t.equal(
        subject.absolute,
        '/base/path/my/file.json',
        'should result in a valid absolute path',
    );
    t.end();
});

test('LocalFileLocation: .absolute for my/file.json', (t) => {
    const subject = new LocalFileLocation('my/file.json', '/base/path');
    t.equal(
        subject.absolute,
        '/base/path/my/file.json',
        'should result in a valid absolute path',
    );
    t.end();
});

test('LocalFileLocation: .absolute for my/file.json: base path has trailing slash', (t) => {
    const subject = new LocalFileLocation('my/file.json', '/base/path/');
    t.equal(
        subject.absolute,
        '/base/path/my/file.json',
        'should result in a valid absolute path',
    );
    t.end();
});
