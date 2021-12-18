const db = require("../db/db");
const escape = require("escape-html");

class Likes {
    /**
     * Select all likes from the database
     * @returns {Promise<*>}
     */
    async getAllLikes() {
        const query = {
            name: "fetch-likes",
            text: `SELECT user_id,
                          post_id
                   FROM kwicker.likes`
        };
        try {
            const {rows} = await db.query(query);
            return rows;
        } catch (e) {
            console.log(e.stack);
            throw new Error("Error while getting all likes from the database.");
        }
    }

    async getUserLikes(user_id) {
        const query = {
            name: "fetch-user-likes",
            text: `SELECT user_id,
                          post_id
                   FROM kwicker.likes
                   WHERE user_id = $1`,
            values: [escape(user_id)]
        };
        try {
            const {rows} = await db.query(query);
            return rows;
        } catch (e) {
            console.log(e.stack);
            throw new Error("Error while getting user's likes.");
        }
    }

    async getPostLikes(post_id) {
        const query = {
            text: `SELECT user_id,
                          post_id
                   FROM kwicker.likes
                   WHERE post_id = $1`,
            values: [escape(post_id)]
        };
        try{
            const {rows} = await db.query(query);
            return rows;
        } catch (e){
            console.log(e.stackTrace);
            throw new Error("Error while getting all post likes.");
        }
    }

    /**
     * Add a new like to the db
     * @param body
     * @returns {Promise<void>}
     */
    async addLike(body) {
        const query = {
            text: "INSERT INTO kwicker.likes VALUES ($1, $2)",
            values: [escape(body.user_id), escape(body.post_id)]
        };
        try {
            await db.query(query)
        } catch (e) {
            console.log(e.stack);
            throw new Error("Error while add a new like in the db.");
        }
    }
    async existLike(body) {
        const query = {
            text: "SELECT user_id, post_id FROM kwicker.likes WHERE user_id = $1 AND post_id = $2",
            values: [body.user_id, body.post_id]
        };
        try {
            const rows = await db.query(query);
            return rows.rowCount
        } catch (e) {
            console.log(e.stack);
            throw new Error("Error while add a new like in the db.");
        }
    }

    async toggleLike(body) {
        let query = "INSERT INTO kwicker.likes VALUES ($1, $2)";
        let returnValue = true;

        if (await this.existLike(body)) {
            query = "DELETE FROM kwicker.likes WHERE user_id = $1 AND post_id = $2";
            returnValue = false;
        }

        try {
            await db.query(query, [body.user_id, body.post_id]);
            return returnValue;
        } catch (e) {
            console.log(e.stack);
            throw new Error("Error while add a new like in the db.");
        }

    }

    async removeLike(body) {
        const query = {
            text: `DELETE
                   FROM kwicker.likes
                   WHERE user_id = $1
                     AND post_id = $2`,
            values: [escape(body.user_id), escape(body.post_id)]
        };
        try {
            const result = db.query(query);
            return result.rowCount;
        } catch (e) {
            console.log(e.stack);
            throw new Error("Error while deleting like from the db.");
        }
    }
}

module.exports = {Likes};