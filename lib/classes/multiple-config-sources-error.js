import CustomError from './custom-error.js';

export default class MultipleConfigSourcesError extends CustomError {
    constructor() {
        super(
            `Eik configuration was defined in both in package.json and eik.json. You must specify one or the other.`,
        );
    }
};
