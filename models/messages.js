const db = require("../db/db");
const {decrypt, encrypt} = require("../utils/crypt");

class Messages {

    /*
    *
    * ░██████╗░███████╗████████╗
    * ██╔════╝░██╔════╝╚══██╔══╝
    * ██║░░██╗░█████╗░░░░░██║░░░
    * ██║░░╚██╗██╔══╝░░░░░██║░░░
    * ╚██████╔╝███████╗░░░██║░░░
    * ░╚═════╝░╚══════╝░░░╚═╝░░░
    *
    **/

    /**
     * Get all messages for a conversation
     * @param id_sender
     * @param id_recipient
     * @returns {Promise<*>}
     */
    async getMessages(id_sender, id_recipient) {
        const query = {
            text: `SELECT id_message,
                          id_sender,
                          id_recipient,
                          message
                   FROM kwicker.messages
                   WHERE id_sender = $1
                     AND id_recipient = $2`,
            values: [id_sender, id_recipient]
        };

        try {
            const {rows} = await db.query(query);
            for(let i = 0; i < rows.length; i++) {
                //Cannot be done on an one line
                const decryptedMessage = rows[i];
                rows[i] = decryptedMessage;
            }
            console.log(rows);
            return rows;
        } catch (e) {
            console.log(e.stack);
            throw new Error("Error while getting all messages from a conversation from the database.");
        }
    }

    /**
     * Insert a message between 2 users into the database
     * @param id_sender
     * @param id_recipient
     * @param message
     * @returns {Promise<null|number|*>}
     */
    async sendMessage(id_sender, id_recipient, message) {
        const query = {
            text: `INSERT INTO kwicker.messages (id_sender, id_recipient, message)
                   VALUES ($1, $2, $3)`,
            values: [id_sender, id_recipient, encrypt(escape(message))]
        };

        try {
            const result = await db.query(query);
            return result.rowCount;
        } catch (e) {
            console.log(e.stack);
            throw new Error("Error while insert a message into the database.");
        }
    }
}

module.exports = {Messages};