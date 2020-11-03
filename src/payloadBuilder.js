const BigInteger = require('big-integer');

// taken from https://stackoverflow.com/questions/48521840/biginteger-to-a-uint8array-of-bytes
const zero = BigInteger(0);
const n256 = BigInteger(256);

function toLittleEndian(bigNumber) {
    let result = new Uint8Array(8);
    let i = 0;
    while (bigNumber.greater(zero)) {
        result[i] = bigNumber.mod(n256);
        bigNumber = bigNumber.divide(n256);
        i += 1;
    }
    return result;
}

function toBigEndian(bytes) {
    return toLittleEndian(bytes).reverse();
}

module.exports = {
    build: function(input) {
        const fullUrl = percentEncode(input.url).toUpperCase(); //not sure about the escaping yet.

        const fullUrlBuffer = Buffer.from(fullUrl, "utf8");
        const accessTokenBuffer = Buffer.from(input.accessToken, "utf8");

        const timeBuffer = toBigEndian(BigInteger(input.timestamp))

        const expectedProofBuffer = Buffer.concat([
            getLengthIn4Bytes(accessTokenBuffer),
            accessTokenBuffer,
            getLengthIn4Bytes(fullUrlBuffer),
            fullUrlBuffer,
            getLengthIn4Bytes(timeBuffer),
            timeBuffer
        ]);

        return expectedProofBuffer;
    }
};

function getLengthIn4Bytes(buff) {
    const lengthBuffer = Buffer.alloc(4);
    lengthBuffer.writeUIntBE(buff.length, 0, 4);
    return lengthBuffer;
}

function percentEncode(url) {
    return url;
}
