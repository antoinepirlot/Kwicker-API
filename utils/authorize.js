const jwt = require("jsonwebtoken");
const jwtSecret = "motdepasse";

const { Users } = require("../models/users");
const userModel = new Users();

const authorizeAdmin = (req, res, next) => {
  let token = req.session.token;
  if (!token) return res.status(401).end();
  try {
    const decoded = jwt.verify(token, jwtSecret);
    const userFound = userModel.getOne(decoded.idUser);
    if (!userFound) return res.status(403).end();
    if (!userFound.isAdmin) return res.status(403).end();
    req.user = userFound;
    next();
  } catch (err) {
    console.error("authorize: ", err);
    return res.status(403).end();
  }
};

const authorizeUser = (req, res, next) => {
  let token = req.session.token;
  if (!token) return res.status(401).end();
  try {
    const decoded = jwt.verify(token, jwtSecret);
    const userFound = userModel.getOne(decoded.idUser);
    if (!userFound) return res.status(403).end();
    req.user = userFound;
    next();
  } catch (err) {
    console.error("authorize: ", err);
    return res.status(403).end();
  }
};

module.exports = { authorizeAdmin, authorizeUser }; 