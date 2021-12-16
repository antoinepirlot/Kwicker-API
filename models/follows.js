const db = require("../db/db");

class Follows {
    constructor() {
    }

    async existFollow(body) {
        const query = {
            text: "SELECT id_user_followed, id_user_follower FROM kwicker.follows " +
                    "WHERE id_user_followed = $1 AND id_user_follower = $2",
            values: [body.id_user_followed, body.id_user_follower]
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

        if (body.id_user_followed == body.id_user_follower) return;

        let query = "INSERT INTO kwicker.follows VALUES ($1, $2)";
        let returnValue = true;

        if (await this.existFollow(body)) {
            query = "DELETE FROM kwicker.follows WHERE id_user_followed = $1 AND id_user_follower = $2";
            returnValue = false;
        }

        try {
            await db.query(query, [body.id_user_followed, body.id_user_follower]);
            return returnValue;
        } catch (e) {
            console.log(e.stack);
            throw new Error("Error while add a new like in the db.");
        }
    }

    async getFollowers(idUser) {
        const query = `SELECT id_user_follower FROM kwicker.follows WHERE id_user_followed = $1`;
        try {
            const { rows } = await db.query(query, [idUser]);
            return rows;
        } catch (e) {
            console.log(e.stack);
            return false;
        }
    }

    async getFolloweds(idUser) {
        const query = `SELECT id_user_followed FROM kwicker.follows WHERE id_user_follower = $1`;
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