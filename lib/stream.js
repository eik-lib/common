// @ts-ignore
export const isStream = (stream) =>
    stream !== null &&
    typeof stream === 'object' &&
    typeof stream.pipe === 'function';

// @ts-ignore
export const isReadableStream = (stream) =>
    isStream(stream) &&
    stream.readable !== false &&
    typeof stream._read === 'function' &&
    typeof stream._readableState === 'object';
