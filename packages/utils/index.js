const typeSlug = require('./src/type-slug.js');
const typeTitle = require('./src/type-title.js');
const stream = require('./src/stream.js');
const ReadFile = require('./src/read-file.js');
const {
    addTrailingSlash,
    removeTrailingSlash,
    addLeadingSlash,
    removeLeadingSlash,
} = require('./src/path-slashes.js');

module.exports = {
    addTrailingSlash,
    removeTrailingSlash,
    addLeadingSlash,
    removeLeadingSlash,
    stream,
    typeSlug,
    typeTitle,
    ReadFile,
};
