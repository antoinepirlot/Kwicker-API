const cryptoJs = require("crypto-js");
const messagePassword = process.env.messagesPassword;

function encrypt(message) {
    return cryptoJs.AES.encrypt(message, messagePassword).toString();
}

function decrypt(encryptedMessage) {
        const bytes = cryptoJs.AES.decrypt(encryptedMessage, messagePassword);
        return bytes.toString(cryptoJs.enc.Utf8);
}

module.exports = {encrypt, decrypt};