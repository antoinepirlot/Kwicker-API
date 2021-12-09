const db = require("../db/db");

class Posts {
    /**
     * Request to the db to SELECT all posts
     * @returns {Array} rows -> list of all posts
     */
    async getAllPosts() {
        const query = `SELECT id_post, id_user, image, message, parent_post, is_removed
                       FROM kwicker.posts`;
        try {
            const {rows} = await db.query(query);
            return rows;
        } catch (e) {
            console.log(e.stack);
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
                              is_removed
                       FROM kwicker.posts
                       WHERE id_user = $1`;
        try {
            const {rows} = await db.query(query, [id_user]);
            return rows;
        } catch (e) {
            console.log(e.stack);
        }
    }

    async createPost(body){
        const query = `INSERT INTO kwicker.posts (id_user, image, message, parent_post) VALUES ($1, $2, $3, $4)`;
        try{
            await db.query(query, [body.id_user, body.image, body.message, body.parent_post]);
        } catch (e){
            console.log(e.stack);
        }
    }

    /**
     * Update the post identified by its id and add it body's attributes, image and message are required
     * @param id_post
     * @param body
     * @returns {Promise<null|number|*>}
     */
    async updatePost(id_post, body){
        const query = "UPDATE kwicker.posts SET image = $1, message = $2";
        try{
            const result = db.query(query, [body.image, body.message]);
            return result.rowCount;
        } catch (e){
            console.log(e.stack);
        }
    }

    async removePost(id_post){
        const query = `UPDATE kwicker.posts
                   SET is_removed = TRUE
                   WHERE id_post = $1`;
        try{
            const result = await db.query(query, [id_post]);
            return result.rowCount;
        } catch (e){
            console.log(e.stack);
        }
    }
}

module.exports = {Posts};