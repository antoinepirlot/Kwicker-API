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

router.get("/:id_sender/:id_recipient", authorizeUser, async (req, res) => {
    console.log("GET/ messages");
    try {
        const messages = await messagesModel.getMessages(req.params.id_sender, req.params.id_recipient);
        if(!messages)
            return res.sendStatus(404).end();
        return res.json(messages);
    } catch (e) {
        res.sendStatus(502);
    }
});

module.exports = router;