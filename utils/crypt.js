const cryptoJs = require("crypto-js");

function encrypt(message) {
    return cryptoJs.enc.Base64.stringify(cryptoJs.enc.Utf8.parse(message));
}

function decrypt(encryptedMessage) {
    return cryptoJs.enc.Base64.parse(encryptedMessage).toString(cryptoJs.enc.Utf8);
}

console.log(decrypt(encrypt("Bonjour les amis, je ne sais que faire")));

module.exports = {encrypt, decrypt};