
const jwt = require("jsonwebtoken");
const jwtSecret = require("../config/jwt_secret");

const { Users } = require("../models/users");
const userModel = new Users();

const authorizeAdmin = async (req, res, next) => {
  let token = req.session.token;
  if (!token) return res.status(401).end();
  try {
    const decoded = jwt.verify(token, jwtSecret);
    const userFound = await userModel.getUserById(decoded.idUser);
    if (!userFound) return res.status(403).end();
    if (!userFound.is_admin) return res.status(403).end();
    req.user = userFound;
    next();
  } catch (err) {
    console.error("authorize: ", err);
    return res.status(403).end();
  }
};

const authorizeUser = async (req, res, next) => {
  let token = req.session.token;
  if (!token) return res.status(401).end();
  try {
    const decoded = jwt.verify(token, jwtSecret);
    const userFound = await userModel.getUserById(decoded.idUser);
    if (!userFound) return res.status(403).end();
    req.user = userFound;
    next();
  } catch (err) {
    console.error("authorize: ", err);
    return res.status(403).end();
  }
};

module.exports = { authorizeAdmin, authorizeUser }; 