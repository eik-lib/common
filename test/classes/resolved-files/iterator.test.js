import { test } from 'tap';
import ResolvedFiles from '../../../lib/classes/resolved-files.js';

test('ResolvedFiles: iterator for ./my/file.js', (t) => {
    // @ts-ignore
    const subject = new ResolvedFiles(['./my/file.js', './my/file.css'], {
        basePath: '/base/path',
        definition: ['dest', 'src'],
    });

    const files = Array.from(subject);
    t.equal(
        files[0].relative,
        './my/file.js',
        'should result in a valid absolute path',
    );
    t.end();
});
