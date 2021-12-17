const cryptoJs = require("crypto-js");
const bcrypt = require("bcrypt");
const saltRound = 10;

async function encrypt(message) {
    const password = await bcrypt.hash(generateP(), saltRound);
    return {
        encryptedMessage: cryptoJs.AES.encrypt(message, password).toString(),
        password: password
    };
}

function decrypt(encryptedMessage, password) {
    const bytes = cryptoJs.AES.decrypt(encryptedMessage, password);
    return bytes.toString(cryptoJs.enc.Utf8);
}

//generateP has been copied from: https://www.geeksforgeeks.org/how-to-generate-a-random-password-using-javascript/
function generateP() {
    var pass = '';
    var str = '[ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
        'abcdefghijklmnopqrstuvwxyz0123456789@#$';

    for (let i = 1; i <= 50; i++) {
        var char = Math.floor(Math.random()
            * str.length + 1);

        pass += str.charAt(char)
    }

    return pass;
}

module.exports = {encrypt, decrypt};