"use strict";
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const { parse, serialize } = require("../utils/json");
const jwtSecret = "motdepasse";
const LIFETIME_JWT = 24 * 60 * 60 * 1000;
const saltRounds = 10;
const jsonDbPath = __dirname + "/../data/users.json";
const defaultItems = [
  {
    idUser: 1,
    forename: "François",
    lastname: "Bardijn",
    email: "francois.bardijn@student.vinci.be",
    username: "fb",
    password: "$2b$10$RqcgWQT/Irt9MQC8UfHmjuGCrQkQNeNcU6UtZURdSB/fyt6bMWARa", // "admin",
    isActive: true,
    isAdmin: true,
    creationDate: Date.now()
  },
  {
    idUser: 2,
    forename: "Guillaume",
    lastname: "Feron",
    username: "gf",
    email: "guillaume.feron@student.vinci.be",
    password: "$2b$10$o9QC86bWZINZ8bPzYHOBSOagWB5647r7ygm4Pg2xgvT6qE0qSYaCC", // "user",
    isActive: true,
    isAdmin: false,
    creationDate: Date.now()
  }
  /*
  {
    idUser: 3,
    forename: "Alex",
    lastname: "Ottoy",
    email: "alex.ottoy@student.vinci.be",
    password: "$2y$10$9dO3uO/2uSdMjpWMrCcCz.VzypZIYiKcxLSv8Xcm8HMXs5837wHpO", // "inactive",
    isActive: false,
    isAdmin: false
  }
  */
];

class Users {
  constructor(dbPath = jsonDbPath, items = defaultItems) {
    this.jsonDbPath = dbPath;
    this.defaultItems = items;
  }

  getNextId() {
    const items = parse(this.jsonDbPath, this.defaultItems);
    let nextId;
    if (items.length === 0) nextId = 1;
    else nextId = items[items.length - 1].idUser + 1;
    return nextId;
  }

  getAll() {
    return parse(this.jsonDbPath, this.defaultItems);
  }

  getOneByEmail(email) {
    const items = parse(this.jsonDbPath, this.defaultItems);
    const foundIndex = items.findIndex((item) => item.email == email);
    if (foundIndex < 0) return;
    return items[foundIndex];
  }

  getOne(id) {
    const items = parse(this.jsonDbPath, this.defaultItems);
    const foundIndex = items.findIndex((item) => item.idUser == id);
    if (foundIndex < 0) return;
    return items[foundIndex];
  }

  async addOne(body) {
    const items = parse(this.jsonDbPath, this.defaultItems);
    const hashedPassword = await bcrypt.hash(body.password, saltRounds);

    if (items.findIndex(u => u.email == body.email || u.username == body.username) != -1) return;

    const newitem = {
      idUser: this.getNextId(),
      forename: body.forename,
      lastname: body.lastname,
      email: body.email,
      username: body.username,
      password: hashedPassword,
      isActive: true,
      isAdmin: false,
      creationDate: Date.now()
    };
    items.push(newitem);
    serialize(this.jsonDbPath, items);
    return newitem;
  }

  deleteOne(id) {
    const items = parse(this.jsonDbPath, this.defaultItems);
    const foundIndex = items.findIndex((item) => item.idUser == id);
    if (foundIndex < 0) return;
    const itemRemoved = items.splice(foundIndex, 1);
    serialize(this.jsonDbPath, items);
    return itemRemoved[0];
  }

  updateOne(id, body) {
    const items = parse(this.jsonDbPath, this.defaultItems);
    const foundIndex = items.findIndex((item) => item.idUser == id);
    if (foundIndex < 0) return;
    const updateditem = { ...items[foundIndex], ...body };
    items[foundIndex] = updateditem;
    serialize(this.jsonDbPath, items);
    return updateditem;
  }

  async login(email, password) {
    const userFound = this.getOneByEmail(email);
    if (!userFound) return;

    const match = await bcrypt.compare(password, userFound.password);
    if (!match) return;

    const authenticatedUser = {
      idUser: userFound.idUser,
      token: "None",
    };

    const token = jwt.sign(
      { idUser: authenticatedUser.idUser },
      jwtSecret,
      { expiresIn: LIFETIME_JWT }
    );

    authenticatedUser.token = token;
    return authenticatedUser;
  }

  async register(forename, lastname, email, username, password) {
    const userFound = this.getOneByEmail(email);
    if (userFound) return;

    const newUser = await this.addOne({ forename: forename, lastname: lastname, email: email, username: username, password: password });

    if (!newUser) return;

    const authenticatedUser = {
      idUser: newUser.idUser,
      token: "None",
    };

    const token = jwt.sign(
      { idUser: authenticatedUser.idUser },
      jwtSecret,
      { expiresIn: LIFETIME_JWT }
    );

    authenticatedUser.token = token;
    return authenticatedUser;
  }
}

module.exports = { Users };