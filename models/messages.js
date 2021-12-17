const db = require("../db/db");

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
            return rows;
        } catch (e) {
            console.log(e.stack);
            throw new Error("Error while getting all messages from a conversation from the database.");
        }
    }
}

module.exports = {Messages};