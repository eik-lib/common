import semver from 'semver';
import npmPkg from 'validate-npm-package-name';

const urlIsh = /^https?:\/\/[a-zA-Z0-9-_./]+(:[0-9]+)?/;
// @ts-ignore
export const origin = (value) => {
    if (urlIsh.test(value)) {
        return value.toLowerCase();
    }
    throw new Error('Parameter "origin" is not valid');
};

// @ts-ignore
export const org = (value) => {
    if (/^[a-zA-Z0-9_-]+$/.test(value)) {
        return value.toLowerCase();
    }
    throw new Error(`Parameter "org" is not valid - Value: ${value}`);
};

// @ts-ignore
export const name = (value) => {
    const result = npmPkg(value);
    if (result.validForNewPackages || result.validForOldPackages) {
        return value.toLowerCase();
    }
    throw new Error(`Parameter "name" is not valid - Value: ${value}`);
};

// @ts-ignore
export const version = (value) => {
    const result = semver.valid(value);
    if (result) {
        return result;
    }
    throw new Error(`Parameter "version" is not valid - Value: ${value}`);
};

// @ts-ignore
export const alias = (value) => {
    if (/^[0-9]+$/.test(value)) {
        return value;
    }
    throw new Error(`Parameter "alias" is not valid - Value: ${value}`);
};

// @ts-ignore
export const type = (value) => {
    if (value === 'pkg' || value === 'map' || value === 'npm') {
        return value;
    }
    throw new Error(`Parameter "type" is not valid - Value: ${value}`);
};

const pathTraversalPattern = /\.\./;
// @ts-ignore
export const extra = (value) => {
    console.log(value, !pathTraversalPattern.test(value));
    if (!pathTraversalPattern.test(value)) {
        return value;
    }
    throw new Error(`Parameter "extra" is not valid - Value: ${value}`);
};

// @ts-ignore
export const semverType = (value) => {
    if (value === 'major' || value === 'minor' || value === 'patch') {
        return value;
    }
    throw new Error(`Parameter "semverType" is not valid - Value: ${value}`);
};
