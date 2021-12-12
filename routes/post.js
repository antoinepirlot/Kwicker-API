const express = require("express");
const db = require("../db/db");
const {Posts} = require("../models/posts");

const router = express.Router();
const postsModel = new Posts();

/**
 * GET all posts
 */
router.get("/", async (req, res) => {
    try{
        const posts = await postsModel.getAllPosts();
        return res.json(posts);
    } catch (e){
        return res.sendStatus(502);
    }
});

/**
 * GET all posts from a user identified by its id
 */
router.get("/:id_user", async (req, res) => {
    console.log("GET/ : Posts from a user");
    try {
        const posts = await postsModel.getUserPosts(req.params.id_user);
        if(posts.length === 0)
            return res.sendStatus(404);
        return res.json(posts);
    } catch (e){
        return res.sendStatus(502);
    }
});

/**
 * POST add a new post to the db
 */
router.post("/", async (req, res) => {
    console.log("POST/");
    if(!req.body)
        return res.sendStatus(400);
    try{
        await postsModel.createPost(req.body);
        return res.sendStatus(201);
    } catch (e){
        return res.sendStatus(502);
    }
});

/**
 * PUT update a post identified by its id
 */
router.put("/:id_post", async (req, res) => {
    console.log("PUT/ Update a post");
    if(!req.body || !req.body.message)
        return res.sendStatus(400);
    try{
        const rowCount = await postsModel.updatePost(req.params.id_post, req.body);
        if(rowCount === 0)
            return res.sendStatus(404);
        return res.sendStatus(200);
    } catch (e){
        return res.sendStatus(502);
    }
});

/**
 * DELETE a post identified by its id
 */
router.delete("/:id_post", async (req, res) => {
    console.log("DELETE");
    try{
        const rowCount = await postsModel.removePost(req.params.id_post);
        if(rowCount === 0)
            return res.sendStatus(404);
        return res.sendStatus(200);
    } catch (e){
        res.sendStatus(502);
    }
});

module.exports = router;