const express = require("express");
const {Messages} = require("../models/messages");
const {authorizeUser} = require("../utils/authorize");

const router = express.Router();
const messagesModel = new Messages();

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

router.get("/:sender_id/:recipient_id", authorizeUser, async (req, res) => {
    console.log("GET/ messages");
    try {
        const messages = await messagesModel.getMessages(req.params.sender_id, req.params.recipient_id);
        if(!messages)
            return res.sendStatus(404).end();
        return res.json(messages);
    } catch (e) {
        res.sendStatus(502);
    }
});

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

router.post("/", authorizeUser, async (req, res) => {
    console.log("POST/ message");
    const body = req.body;
    try {
        const rowCount = await messagesModel.sendMessage(body.sender_id, body.recipient_id, body.message);
        if(rowCount === 0)
            return res.sendStatus(502).end();
        return res.sendStatus(200).end();
    } catch (e) {
        return res.sendStatus(502).end();
    }
});
module.exports = router;