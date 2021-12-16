const db = require("../db/db");
const escape = require("escape-html");

class Messages {

    /**
     * return the discussion where the client is the sender
     * @param id_sender
     * @param id_recipient
     * @returns {Promise<*>}
     */
    async getDiscussion(id_sender, id_recipient){
        const query = `SELECT message, id_sender, id_recipient
                        FROM kwicker.messages
                        WHERE id_sender=$1 AND id_recipient=$2;`

        try {
            const {rows} = await db.query(query, [id_sender, id_recipient]);
            return rows;
        }catch (err){
            console.error(err.stack);
            throw new Error("Error while getting discussion between 2 users");
        }

    }

    /**
     * return the discussions where the client is the sender or the recipient
     * this query permit to list all discussion where the client interacted with
     * @param id_sender
     * @returns {Promise<void>}
     */
    async getAllDiscussion(id_sender){
        const query = `SELECT message, id_sender, id_recipient
                        FROM kwicker.messages
                        WHERE id_sender=$1 OR id_recipient=$1;`

        try{
            const {rows} = await db.query(query, [id_sender]);
            return rows;
        }catch (err){
            console.error(err.stack);
            throw new Error("Error while getting all user's discussions");
        }
    }

    /**
     * Send message from a user to another
     * @param id_sender
     * @param id_recipient
     * @param message
     * @returns {Promise<void>}
     */
    async addMessages(id_sender, id_recipient, message){
        const query = `INSERT INTO kwicker.messages (id_sender, id_recipient, message)
                        VALUES ($1, $2, $3);`;
        try{
            await db.query(query, [id_sender, id_recipient, escape(message)]);
        }catch (err){
            console.error(err.stack);
            throw new Error("Error while creating new discussion between 2 users");
        }
    }
    
}