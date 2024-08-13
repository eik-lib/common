/**
 * Maps between a type config value and its title. Essentially uppercases the input.
 * @param {string} type
 * @param {"PACKAGE" | "NPM" | "MAP"} type
 */
export default (type) => {
    if (type === 'package') return 'PACKAGE';
    if (type === 'npm') return 'NPM';
    return 'MAP';
};
