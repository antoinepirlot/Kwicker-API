const express = require("express");
const db = require("../db/db");
const {Likes} = require("../models/likes");

const router = express.Router();
const likesModel = new Likes();

router.get("/", async (req, res) => {
    try{
        const likes = await likesModel.getAllLikes();
        return res.json(likes);
    } catch (e){
        res.sendStatus(502);
    }
});

/**
 * GET all user's likes
 */
router.get("/user/:id_user", async (req, res) => {
    try{
        const likes = await likesModel.getUserLikes(req.params.id_user);
        if(likes.length === 0)
            return res.sendStatus(404);
        return res.json(likes);
    } catch (e){
        return res.sendStatus(502);
    }
});

router.get("/post/:id_post", async (req, res) => {
    try{
        const likes = await likesModel.getPostLikes(req.params.id_post);
        return res.json(likes);
    } catch (e){
        return res.sendStatus(502).end();
    }
});

/**
 * POST add a new Like to the db associated to the user
 */
router.post("/", async(req, res) => {
    console.log("POST/");
    if(!req.body)
        return res.sendStatus(400);
    try{
        await likesModel.addLike(req.body);
        return res.sendStatus(201);
    } catch (e){
        return res.sendStatus(502);
    }
});

router.delete("/", async (req, res) => {
    console.log("PUT/");
    if(!req.body)
        return res.sendStatus(400);
    try{
        const rowCount = await likesModel.removeLike(req.body);
        if(rowCount === 0)
            return res.sendStatus(404);
        return res.sendStatus(200);
    } catch (e){
        return res.sendStatus(502);
    }
});

module.exports = router;