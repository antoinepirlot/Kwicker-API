var express = require('express');
var router = express.Router();
const { Users }  = require('../models/users');
const { authorizeAdmin, authorizeUser } = require('../utils/authorize');
const userModel = new Users();


// getAllActiveUsers()
router.get('/', authorizeAdmin, async function(req, res, next) {
  return res.json(await userModel.getAllActiveUsers());
});

// disconnect()
router.get("/disconnect", authorizeUser, function (req, res, next) {
  req.session = null;
  return res.status(200).end();
});

// getProfileInformationsByEmail()
router.get('/profile/:email', authorizeUser, async function(req, res) {
  return res.json(await userModel.getProfileInformationsByEmail(req.params.email));
});

// updateUser()
router.put('/:idUser', authorizeUser, async function(req, res, next) {
  if (!req.body ||
    (req.body.forename && !req.body.forename.trim()) ||
    (req.body.lastname && !req.body.lastname.trim()) ||
    (req.body.image && !req.body.image.trim()) ||
    (req.body.biography && !req.body.biography.trim())
  ) 
    return res.status(400).end();

  if (!req.user.is_admin && req.params.idUser != req.session.id_user) return res.status(401).end();

  const updatedUser = userModel.updateUser(req.params.idUser, req.body);
  if (!updatedUser) return res.status(404).end();
  return res.json(updatedUser);
});

// delete()
router.delete("/:idUser", authorizeUser, async function(req, res, next) {
  if (!req.user.is_admin && req.params.idUser != req.session.idUser) return res.status(401).end();
  const deletedUser = userModel.deleteUser(req.params.idUser);
  if (!deletedUser) return res.status(404).end();
  if (!req.user.is_admin) req.session = null;
  return res.json(deletedUser);
});

// register()
router.post("/register", async function (req, res, next) {
  if (
    !req.body ||
    !req.body.forename || !req.body.forename.trim() ||
    !req.body.lastname || !req.body.lastname.trim() ||
    !req.body.email || !req.body.email.trim() ||
    !req.body.username || !req.body.username.trim() ||
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

  const authenticatedUser = await userModel.login(req.body);
  if (!authenticatedUser) return res.status(401).end();
  
  req.session.idUser = authenticatedUser.idUser;
  req.session.token = authenticatedUser.token;

  return res.json(authenticatedUser);
});

module.exports = router;