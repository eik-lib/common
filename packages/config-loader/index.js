const ReadFile = require('./src/classes/read-file.js');
const EikConfig = require('./src/eik-config.js');
const getDefaults = require('./src/get-defaults.js');
const configStore = require('./src/config-store.js');
const localAssets = require('./src/local-assets');

module.exports = {
    ReadFile,
    EikConfig,
    getDefaults,
    configStore,
    localAssets,
};
