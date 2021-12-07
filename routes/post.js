const express = require("express");
const db = require("../db/db");

const router = express.Router();

/**
 * GET all posts
 */
router.get("/", async (req, res) => {
    console.log("GET/ : Posts");
    try {
        const {rows} = await db.query("SELECT * FROM kwicker.get_all_posts");
        res.send(rows);
    } catch (e){
        console.log(e.stack);
    }
})

module.exports = router;