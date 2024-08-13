// @ts-check

/**
 * @type {(type: string) => string}
 */
export default (type) => {
    if (type === 'package') return 'pkg';
    if (type === 'image') return 'img';
    return type;
};
