const db = require("../db/db");

class Follows {
    constructor() {
    }

    async existFollow(body) {
        const query = {
            text: "SELECT user_followed_id, user_follower_id FROM kwicker.follows " +
                    "WHERE user_followed_id = $1 AND user_follower_id = $2",
            values: [body.user_followed_id, body.user_follower_id]
        };
        try {
            const rows = await db.query(query);
            return rows.rowCount
        } catch (e) {
            console.log(e.stack);
            throw new Error("Error while add a new like in the db.");
        }
    }

    async toggleFollow(body) {

        if (body.user_followed_id == body.user_follower_id) return;

        let query = "INSERT INTO kwicker.follows VALUES ($1, $2)";
        let returnValue = true;

        if (await this.existFollow(body)) {
            query = "DELETE FROM kwicker.follows WHERE user_followed_id = $1 AND user_follower_id = $2";
            returnValue = false;
        }

        try {
            await db.query(query, [body.user_followed_id, body.user_follower_id]);
            return returnValue;
        } catch (e) {
            console.log(e.stack);
            throw new Error("Error while add a new like in the db.");
        }
    }

    async getFollowers(idUser) {
        const query = `SELECT user_follower_id FROM kwicker.follows WHERE user_followed_id = $1`;
        try {
            const { rows } = await db.query(query, [idUser]);
            return rows;
        } catch (e) {
            console.log(e.stack);
            return false;
        }
    }

    async getFolloweds(idUser) {
        const query = `SELECT user_followed_id FROM kwicker.follows WHERE user_follower_id = $1`;
        try {
            const { rows } = await db.query(query, [idUser]);
            return rows;
        } catch (e) {
            console.log(e.stack);
            return false;
        }
    }
}

module.exports = { Follows };