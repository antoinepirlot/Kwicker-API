const cryptoJs = require("crypto-js");
const messagePassword = process.env.messagesPassword;

function encrypt(message) {
    return cryptoJs.AES.encrypt(message, messagePassword);
}

function decrypt(rows) {
    rows.forEach((row) => {
        row["message"] = cryptoJs.AES.decrypt(row["message"], messagePassword).toString(cryptoJs.enc.Utf8);
    });
}

module.exports = {encrypt, decrypt};