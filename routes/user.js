var express = require('express');
var router = express.Router();
const { Users}  = require('../models/users');
const { authorizeAdmin, authorizeUser } = require('../utils/authorize');
const userModel = new Users();

// Disconnect
router.get("/disconnect", authorizeUser, function (req, res, next) {
  if (!req.session) return res.status(404).end();
  req.session = null;
  return res.status(200).end();
});

// getAll()
router.get('/', authorizeAdmin, function(req, res, next) {
  return res.json(userModel.getAll());
});

// getOne()
router.get('/:idUser', authorizeUser, function(req, res, next) {
  const user = userModel.getOne(req.params.idUser);

  if (!user) return res.status(404).end();

  return res.json(userModel.getOne(req.params.idUser));
});

// updateOne()
router.put('/:idUser', authorizeUser, function(req, res, next) {
  if (!req.body ||
    (req.body.forename && !req.body.forename.trim()) ||
    (req.body.lastname && !req.body.lastname.trim()) ||
    (req.body.email && !req.body.email.trim()) ||
    (req.body.username && !req.body.username.trim()) ||
    (req.body.password && !req.body.password.trim())
  ) 
    return res.status(400).end();

  if (req.params.idUser != req.session.idUser && !req.user.isAdmin) return res.status(401).end();

  const updatedUser = userModel.updateOne(req.params.idUser, req.body);
  if (!updatedUser) return res.status(404).end();
  return res.json(updatedUser);
});

// Register
router.post("/register", async function (req, res, next) {
  if (
    !req.body ||
    (req.body.forename && !req.body.forename.trim()) ||
    (req.body.lastname && !req.body.lastname.trim()) ||
    (req.body.email && !req.body.email.trim()) ||
    (req.body.username && !req.body.username.trim()) ||
    (req.body.password && !req.body.password.trim())
  )
    return res.status(400).end();

  const authenticatedUser = await userModel.register(
    req.body.forename,
    req.body.lastname,
    req.body.email,
    req.body.username,
    req.body.password
  );
  if (!authenticatedUser) return res.status(409).end();

  req.session.idUser = authenticatedUser.idUser;
  req.session.token = authenticatedUser.token;

  return res.json(authenticatedUser);
});

// Login
router.post("/login", async function (req, res, next) {
  if (
    !req.body ||
    (req.body.email && !req.body.email.trim()) ||
    (req.body.password && !req.body.password.trim())
  )
    return res.status(400).end();

  const authenticatedUser = await userModel.login(
    req.body.email,
    req.body.password
  );
  if (!authenticatedUser) return res.status(401).end();
  
  req.session.idUser = authenticatedUser.idUser;
  req.session.token = authenticatedUser.token;

  return res.json(authenticatedUser);
});


module.exports = router;