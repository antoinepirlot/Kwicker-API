const db = require("../db/db");
const escape = require("escape-html");

class Likes{
    /**
     * Select all likes from the database
     * @returns {Promise<*>}
     */
    async getAllLikes(){
        const query = {
            name: "fetch-likes",
            text: `SELECT id_user,
                          id_post
                   FROM kwicker.likes`
        }
        try{
            const {rows} = await db.query(query);
            return rows;
        } catch (e){
            console.log(e.stack);
            throw new Error("Error while getting all likes from the database.");
        }
    }
}

module.exports = {Likes};