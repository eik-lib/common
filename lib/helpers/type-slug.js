// @ts-check

/**
 * @type {(type: string) => string}
 */
export default (type) => {
    if (type === 'package') return 'pkg';
    return type;
};
