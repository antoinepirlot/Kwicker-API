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

module.exports = router;