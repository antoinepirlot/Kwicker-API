const db = require("../db/db");

class Follows {
    constructor() {
    }

    async addFollow(idFollowed, idFollower) {
        if (idFollower == idFollowed) return;
        const query = {
            name: 'insert-follow',
            text: 'INSERT INTO kwicker.follows VALUES ($1, $2)',
            values: [idFollowed, idFollower],
        };
        try {
            return await db.query(query) != null;
        } catch (e) {
            return false;
        }
    }

    async deleteFollow(idFollowed, idFollower) {
        const query = {
            name: 'remove-follow',
            text: 'DELETE FROM kwicker.follows WHERE id_user_followed = $1 AND id_user_follower = $2',
            values: [idFollowed, idFollower],
        };
        try {
            const deleted = await db.query(query);
            return deleted.rowCount === 1;
        } catch (e) {
            return false;
        }
    }

    async getFollowers(idUser) {
        const query = `SELECT id_user_follower
                        FROM kwicker.follows WHERE id_user_followed = $1`;
        try {
            const { rows } = await db.query(query, [idUser]);
            return rows;
        } catch (e) {
            console.log(e.stack);
            return false;
        }
    }

    async getFolloweds(idUser) {
        const query = `SELECT id_user_followed
                        FROM kwicker.follows WHERE id_user_follower = $1`;
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