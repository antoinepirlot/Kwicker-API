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
     * @param sender_id
     * @param recipient_id
     * @returns {Promise<*>}
     */
    async getMessages(sender_id, recipient_id) {
        const query = {
            text: `SELECT message_id,
                          sender_id,
                          recipient_id,
                          message
                   FROM kwicker.messages
                   WHERE (sender_id = $1 AND recipient_id = $2)
                      OR (sender_id = $2 AND recipient_id = $1)
                   ORDER BY message_id`,
            values: [escape(sender_id), escape(recipient_id)]
        };

        try {
            const {rows} = await db.query(query);
            //decrypt(rows);
            return rows;
        } catch (e) {
            console.log(e.stack);
            throw new Error("Error while getting all messages from a conversation from the database.");
        }
    }

    /**
     * Insert a message between 2 users into the database
     * @param sender_id
     * @param recipient_id
     * @param message
     * @returns {Promise<null|number|*>}
     */
    async sendMessage(sender_id, recipient_id, message) {
        const query = {
            text: `INSERT INTO kwicker.messages (sender_id, recipient_id, message)
                   VALUES ($1, $2, $3)`,
            values: [escape(sender_id), escape(recipient_id), escape(message)]
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