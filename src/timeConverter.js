const BigInteger = require('big-integer');

const milisecondEpochDiff = BigInteger('62135596800000');

module.exports = function(timeString) {
    var time = BigInteger(timeString);
    var approximateTimestamp = time
        .divide(10000)
        .subtract(milisecondEpochDiff)
        .valueOf();
    return approximateTimestamp;
};
