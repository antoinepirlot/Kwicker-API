const db = require("../db/db");
const escape = require("escape-html");

class Posts {

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
     * Request to the db to SELECT all posts
     * @returns {Array} rows -> list of all posts
     */
    async getAllPosts() {
        const query = `SELECT post_id,
                              user_id,
                              image,
                              message,
                              parent_post,
                              is_removed,
                              creation_date,
                              number_of_likes
                       FROM kwicker.posts
                       ORDER BY post_id`;
        try {
            const {rows} = await db.query(query);
            return rows;
        } catch (e) {
            console.log(e.stack);
            throw new Error("Error while getting all posts from the database.");
        }
    }

    /**
     * Return the user from the db
     * @param body
     * @returns {Promise<{image, parent_post, user_id, message}>}
     */
    async getUserPosts(user_id) {
        const query = `SELECT post_id,
                              user_id,
                              image,
                              message,
                              parent_post,
                              is_removed,
                              creation_date,
                              number_of_likes
                       FROM kwicker.posts
                       WHERE user_id = $1
                       ORDER BY creation_date`;
        try {
            const {rows} = await db.query(query, [user_id]);
            return rows;
        } catch (e) {
            console.log(e.stack);
            throw new Error("Error while getting user's posts from the database.");
        }
    }

    async getPostsByLikesNumber() {
        const query = `SELECT post_id,
                              user_id,
                              image,
                              message,
                              parent_post,
                              is_removed,
                              creation_date,
                              number_of_likes
                       FROM kwicker.posts
                       ORDER BY number_of_likes DESC`;
        try {
            const {rows} = await db.query(query);
            return rows;
        } catch (e) {
            console.log(e.stack);
            throw new Error("Error while getting all posts ordered by number of likes from the db.");
        }
    }

    /**
     * @param idUser display only from one user o (so ordered by date)
     * @returns a list of posts associate with user and likes ordered by likes
     */
    async getPostsWithLikesAndUser(idUser) {
        const args = [];

        let query = `
            SELECT u.user_id, u.username, p.post_id, p.message, p.image, p.creation_date, p.number_of_likes
            FROM kwicker.users u LEFT OUTER JOIN kwicker.posts p ON u.user_id = p.user_id
            WHERE p.is_removed = FALSE AND u.is_active = TRUE `;

        if (idUser != "null") {
            query += ` AND u.user_id = $1 `;
            args.push(idUser);
        }

        if (idUser != "null") {
            query += `ORDER BY p.creation_date DESC`
        } else {
            query += `ORDER BY p.number_of_likes DESC`
        }

        try {
            const { rows } = await db.query(query, args);
            return rows;
        } catch (e) {
            console.log(e.stack);
            return false;
        }
    }


    async getHomePosts(idUser) {

        let query = `
            SELECT u.user_id, u.username, p.post_id, p.message, p.image, p.creation_date, p.number_of_likes
            FROM kwicker.users u LEFT OUTER JOIN kwicker.posts p ON u.user_id = p.user_id
                                 LEFT OUTER JOIN kwicker.follows f on u.user_id = f.user_followed_id
            WHERE p.is_removed = FALSE AND u.is_active = TRUE
              AND f.user_followed_id = $1
            ORDER BY p.creation_date DESC`;

        try {
            const { rows } = await db.query(query, [idUser]);
            return rows;
        } catch (e) {
            console.log(e.stack);
            return false;
        }
    }

    /**
     * Select all posts liked by a user identified by its id
     * @param user_id
     * @returns {Promise<*>}
     */
    async getLikedPosts(user_id) {
        const query = {
            text: `SELECT p.post_id,
                          u.user_id,
                          u.username,
                          p.image,
                          p.message,
                          p.parent_post,
                          p.is_removed,
                          p.creation_date,
                          p.number_of_likes
                   FROM kwicker.posts p,
                        kwicker.users u
                   WHERE p.user_id = u.user_id
                     AND p.is_removed = FALSE
                     AND p.post_id IN (SELECT post_id
                                     FROM kwicker.likes
                                     WHERE user_id = $1)`,
            values: [user_id]
        };
        try {
            const {rows} = await db.query(query);
            return rows;
        } catch (e) {
            console.log(e.stack);
            throw new Error("Error while getting posts liked by the user from the dataase.");
        }
    }

    /*
    *
    *  ██████╗░░█████╗░░██████╗████████╗
    *  ██╔══██╗██╔══██╗██╔════╝╚══██╔══╝
    *  ██████╔╝██║░░██║╚█████╗░░░░██║░░░
    *  ██╔═══╝░██║░░██║░╚═══██╗░░░██║░░░
    *  ██║░░░░░╚█████╔╝██████╔╝░░░██║░░░
    *  ╚═╝░░░░░░╚════╝░╚═════╝░░░░╚═╝░░░
    *
    **/

    /**
     * Add a new post to the db
     * @param body
     * @returns {Promise<void>}
     */
    async createPost(body) {
        const query = `INSERT INTO kwicker.posts (user_id, image, message, parent_post)
                       VALUES ($1, $2, $3, $4)`;
        try {
            await db.query(query,
                [body.user_id,
                    body.image,
                    escape(body.message),
                    body.parent_post]);
        } catch (e) {
            console.log(e.stack);
            throw new Error("Error while creating post to database.");
        }
    }

    /*
    *
    *  ██╗░░░██╗██████╗░██████╗░░█████╗░████████╗███████╗
    *  ██║░░░██║██╔══██╗██╔══██╗██╔══██╗╚══██╔══╝██╔════╝
    *  ██║░░░██║██████╔╝██║░░██║███████║░░░██║░░░█████╗░░
    *  ██║░░░██║██╔═══╝░██║░░██║██╔══██║░░░██║░░░██╔══╝░░
    *  ╚██████╔╝██║░░░░░██████╔╝██║░░██║░░░██║░░░███████╗
    *  ░╚═════╝░╚═╝░░░░░╚═════╝░╚═╝░░╚═╝░░░╚═╝░░░╚══════╝
    *
    **/

    /**
     * Update the post identified by its id and add it body's attributes, image and message are required
     * @param post_id
     * @param body
     * @returns {Promise<null|number|*>}
     */
    async updatePost(post_id, body) {
        const query = "UPDATE kwicker.posts SET image = $1, message = $2 WHERE post_id = $3";
        try {
            const result = db.query(query,
                [escape(body.image),
                    escape(body.message),
                    escape(post_id)]);
            return result.rowCount;
        } catch (e) {
            console.log(e.stack);
            throw new Error("Error while updating post in the database.");
        }
    }

    async activatePost(post_id) {
        const query = {
            text: `UPDATE kwicker.posts
                   SET is_removed = FALSE
                   WHERE post_id = $1`,
            values: [post_id]
        };
        try{
            const result = await db.query(query);
            return result.rowCount;
        } catch (e) {
            console.log(e.stack);
            throw new Error("Error while activating a post from the database.");
        }
    }

    /*
    *
    *  ██████╗░███████╗██╗░░░░░███████╗████████╗███████╗
    *  ██╔══██╗██╔════╝██║░░░░░██╔════╝╚══██╔══╝██╔════╝
    *  ██║░░██║█████╗░░██║░░░░░█████╗░░░░░██║░░░█████╗░░
    *  ██║░░██║██╔══╝░░██║░░░░░██╔══╝░░░░░██║░░░██╔══╝░░
    *  ██████╔╝███████╗███████╗███████╗░░░██║░░░███████╗
    *  ╚═════╝░╚══════╝╚══════╝╚══════╝░░░╚═╝░░░╚══════╝
    *
    **/

    /**
     * Remove a post from the db
     * @param post_id
     * @returns {Promise<null|number|*>}
     */
    async removePost(post_id) {
        const query = `UPDATE kwicker.posts
                       SET is_removed = TRUE
                       WHERE post_id = $1`;
        try {
            const result = await db.query(query, [escape(post_id)]);
            return result.rowCount;
        } catch (e) {
            console.log(e.stack);
            throw new Error("Error while removing a post from the database.");
        }
    }
}

module.exports = {Posts};