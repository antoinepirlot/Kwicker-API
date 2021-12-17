const cryptoJs = require("crypto-js");
const messagePassword = process.env.messagesPassword;

function encrypt(message) {
    return cryptoJs.enc.Base64.stringify(cryptoJs.enc.Utf8.parse(message));
}

function decrypt(rows) {
    rows.forEach((row) => {
        const bytes = cryptoJs.enc.Base64.parse(row["message"]).toString(cryptoJs.enc.Utf8);
        row["message"]
    });
    return ;
}

module.exports = {encrypt, decrypt};