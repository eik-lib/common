// @ts-check

/**
 * @type {(type: string) => string}
 */
export default (type) => {
    if (type === 'package') return 'PACKAGE';
    if (type === 'npm') return 'NPM';
    return 'MAP';
};
