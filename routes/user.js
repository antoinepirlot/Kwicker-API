var express = require('express');
var router = express.Router();
const { Users }  = require('../models/users');
const { authorizeAdmin, authorizeUser } = require('../utils/authorize');
const userModel = new Users();

// getAllActiveUsers()
router.get('/', authorizeUser, async function(req, res, next) {
  return res.json(await userModel.getAllActiveUsers());
});

// disconnect()
router.get("/disconnect", authorizeUser, function (req, res, next) {
  if (!req.session) return res.status(404).end();
  req.session = null;
  return res.status(200).end();
});

// getUserById()
router.get('/:idUser', authorizeUser, async function(req, res, next) {
  const user = await userModel.getUserById(req.params.idUser);
  if (!user) return res.status(404).end();
  return res.json(user);
});

// getUserByEmail()
router.get('/email/:email', authorizeUser, async function(req, res, next) {
  const user = await userModel.getUserByEmail(req.params.email);
  if (!user) return res.status(404).end();
  return res.json(user);
});

// updateUser()
router.put('/:idUser', authorizeUser, async function(req, res, next) {
  if (!req.body ||
    (req.body.forename && !req.body.forename.trim()) ||
    (req.body.lastname && !req.body.lastname.trim()) ||
    (req.body.email && !req.body.email.trim()) ||
    (req.body.username && !req.body.username.trim()) ||
    (req.body.username && !req.body.username.trim()) ||
    (req.body.biography && !req.body.biography.trim())
  ) 
    return res.status(400).end();

  if (req.params.idUser !== req.session.idUser && !req.user.isAdmin) return res.status(401).end();

  const updatedUser = userModel.updateUser(req.params.idUser, req.body);
  if (!updatedUser) return res.status(404).end();
  return res.json(updatedUser);
});

// Delete
router.delete("/:idUser", authorizeUser, async function(req, res, next) {
  return res.json(userModel.deleteUser(req.params.idUser));
});

// register()
router.post("/register", async function (req, res, next) {
  if (
    !req.body ||
    !req.body.forename || !req.body.forename.trim() ||
    !req.body.lastname || !req.body.lastname.trim() ||
    !req.body.email || !req.body.email.trim() ||
    // !req.body.username || !req.body.username.trim() ||
    !req.body.password || !req.body.password.trim()
  )
    return res.status(400).end();

  const authenticatedUser = await userModel.register(req.body);
  if (!authenticatedUser) return res.status(409).end();

  req.session.idUser = authenticatedUser.idUser;
  req.session.token = authenticatedUser.token;

  return res.json(authenticatedUser);
});

// login(email, password)
router.post("/login", async function (req, res, next) {
  if (
    !req.body ||
    !req.body.email || !req.body.email.trim() ||
    !req.body.password || !req.body.password.trim()
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