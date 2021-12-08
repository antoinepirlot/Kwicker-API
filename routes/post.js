const express = require("express");
const db = require("../db/db");

const router = express.Router();

/**
 * GET all posts
 */
router.get("/", async (req, res) => {
    console.log("GET/ : Posts");
    try {
        const {rows} = await db.query("SELECT * FROM kwicker.posts");
        res.send(rows);
    } catch (e){
        console.log(e.stack);
    }
});

router.get("/:email", async (req, res) => {
    console.log("GET/ : Posts from a user");
    try{
        const query = "SELECT p.id_post, p.id_user, p.image, p.message, p.parent_post, p.is_removed FROM kwicker.posts p, kwicker.users u WHERE p.id_user = u.id_user AND email = $1";
        const {rows} = await db.query(query, [req.params.email]);
        res.send(rows);
    } catch (e){
        console.log(e.stack);
    }
});

module.exports = router;