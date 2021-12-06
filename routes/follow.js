var express = require('express');
var router = express.Router();
const { Follows }  = require('../models/follows');
const { authorizeAdmin, authorizeUser } = require('../utils/authorize');
const followsModel = new Follows();

router.get("/followers/:idUser", authorizeUser, function (req, res, next) {
    return res.json(followsModel.getFollowers(req.params.idUser));
});

router.get("/followeds/:idUser", authorizeUser, function (req, res, next) {
    return res.json(followsModel.getFolloweds(req.params.idUser));
});

router.post("/:idUser", authorizeUser, function (req, res, next) {
    const follow = followsModel.addOne(req.user.idUser, req.params.idUser);
    if (!follow) return res.status(409).end();
    return res.json(follow);
});

module.exports = router;