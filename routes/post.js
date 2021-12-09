const express = require("express");
const db = require("../db/db");
const {Posts} = require("../models/posts");

const router = express.Router();
const postsModel = new Posts();

/**
 * GET all posts
 */
router.get("/", async (req, res) => {
    res.json(await postsModel.getAllPosts());
});

/**
 * GET all posts from a user identified by its id
 */
router.get("/:id_user", async (req, res) => {
    console.log("GET/ : Posts from a user");
    try {
        return res.json(await postsModel.getUserPosts(req.params.id_user));
    } catch (e){
        return res.sendStatus(502);
    }
});

/**
 * POST add a new post to the db
 */
router.post("/", async (req, res) => {
    const body = req.body;
    let query = "INSERT INTO kwicker.posts (id_user, image, message, parent_post) VALUES ($1, $2, $3, $4)";
    try{
        await db.query(query, [body.id_user, body.image, body.message, body.parent_post]);
    } catch (e){
        console.log(e.stack);
        return res.sendStatus(502);
    }
});

router.delete("/:id_post", async (req, res) => {
    console.log("hello");
    const query = `UPDATE kwicker.posts
                   SET is_removed = TRUE
                   WHERE id_post = $1`;
    try{
        await db.query(query, [req.params.id_post]);
        res.sendStatus(200);
    } catch (e){
        console.log(e.stack);
        res.sendStatus(502);
    }
});

module.exports = router;