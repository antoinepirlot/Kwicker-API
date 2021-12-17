const cryptoJs = require("crypto-js");

function encrypt(message) {
    return cryptoJs.enc.Base64.stringify(cryptoJs.enc.Utf8.parse(message));
}

function decrypt(encryptedMessage) {
    return cryptoJs.enc.Base64.parse(encryptedMessage).toString(cryptoJs.enc.Utf8);
}

module.exports = {encrypt, decrypt};