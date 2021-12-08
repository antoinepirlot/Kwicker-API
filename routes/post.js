const express = require("express");
const db = require("../db/db");

const router = express.Router();

/**
 * GET all posts
 */
router.get("/", async (req, res) => {
    console.log("GET/ : Posts");
    const query = `SELECT *
                   FROM kwicker.posts`;
    try {
        const {rows} = await db.query(query);
        res.send(rows);
    } catch (e){
        console.log(e.stack);
    }
});

router.get("/:email", async (req, res) => {
    console.log("GET/ : Posts from a user");
    const query = `SELECT p.id_post,
                          p.id_user,
                          p.image,
                          p.message,
                          p.parent_post,
                          p.is_removed
                   FROM kwicker.posts p,
                        kwicker.users u
                   WHERE p.id_user = u.id_user
                     AND u.email = $1`;
    try{
        const {rows} = await db.query(query, [req.params.email]);
        res.send(rows);
    } catch (e){
        console.log(e.stack);
    }
});

module.exports = router;