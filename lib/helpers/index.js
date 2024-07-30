import localAssets from './local-assets.js';
import getDefaults from './get-defaults.js';
import configStore from './config-store.js';
import typeSlug from './type-slug.js';
import typeTitle from './type-title.js';
import resolveFiles from './resolve-files.js';
import {
    addTrailingSlash,
    removeTrailingSlash,
    addLeadingSlash,
    removeLeadingSlash,
} from './path-slashes.js';

export default {
    localAssets,
    getDefaults,
    configStore,
    typeSlug,
    typeTitle,
    addTrailingSlash,
    removeTrailingSlash,
    addLeadingSlash,
    removeLeadingSlash,
    resolveFiles,
};
