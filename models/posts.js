const db = require("../db/db");
const escape = require("escape-html");

class Posts {
    /**
     * Request to the db to SELECT all posts
     * @returns {Array} rows -> list of all posts
     */
    async getAllPosts() {
        const query = `SELECT id_post, id_user, image, message, parent_post, is_removed, number_of_likes
                       FROM kwicker.posts
                       ORDER BY date_creation`;
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
     * @returns {Promise<{image, parent_post, id_user, message}>}
     */
    async getUserPosts(id_user) {
        const query = `SELECT id_post,
                              id_user,
                              image,
                              message,
                              parent_post,
                              is_removed,
                              number_of_likes
                       FROM kwicker.posts
                       WHERE id_user = $1
                       ORDER BY date_creation`;
        try {
            const {rows} = await db.query(query, [id_user]);
            return rows;
        } catch (e) {
            console.log(e.stack);
            throw new Error("Error while getting user's posts from the database.");
        }
    }

    /**
     * Add a new post to the db
     * @param body
     * @returns {Promise<void>}
     */
    async createPost(body){
        const query = `INSERT INTO kwicker.posts (id_user, image, message, parent_post) VALUES ($1, $2, $3, $4)`;
        try{
            await db.query(query,
                [escape(body.id_user),
                    escape(body.image),
                    escape(body.message),
                    escape(body.parent_post)]);
        } catch (e){
            console.log(e.stack);
            throw new Error("Error while creating post to database.");
        }
    }

    /**
     * Update the post identified by its id and add it body's attributes, image and message are required
     * @param id_post
     * @param body
     * @returns {Promise<null|number|*>}
     */
    async updatePost(id_post, body){
        const query = "UPDATE kwicker.posts SET image = $1, message = $2 WHERE id_post = $3";
        try{
            const result = db.query(query,
                [escape(body.image),
                    escape(body.message),
                    escape(id_post)]);
            return result.rowCount;
        } catch (e){
            console.log(e.stack);
            throw new Error("Error while updating post in the database.");
        }
    }

    /**
     * Remove a post from the db
     * @param id_post
     * @returns {Promise<null|number|*>}
     */
    async removePost(id_post){
        const query = `UPDATE kwicker.posts
                   SET is_removed = TRUE
                   WHERE id_post = $1`;
        try{
            const result = await db.query(query, [escape(id_post)]);
            return result.rowCount;
        } catch (e){
            console.log(e.stack);
            throw new Error("Error while removing a post from the database.");
        }
    }
}

module.exports = {Posts};