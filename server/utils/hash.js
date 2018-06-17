const crypto = require('crypto');

module.exports = function hashPassword(input) {
    let hash = crypto.createHash('md5').update(input).digest('hex');
    return hash;
}