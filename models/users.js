"use strict";
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const { parse, serialize } = require("../utils/json");
const db = require("../db/db");
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
    creationDate: Date.now(),
    biography: "Oui"
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
    creationDate: Date.now(),
    biography: "Oui"
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

  async getAll() {
    const query = `SELECT * FROM kwicker.users`;
    try {
      const { rows } = await db.query(query);
      return rows;
    } catch (e) {
      console.log(e.stack);
    }
    return false;
  }

  async getOneByEmail(email) {
    const query = `SELECT * FROM kwicker.users u WHERE u.email = $1`;
    try {
      const { rows } = await db.query(query, [email]);
      return rows;
    } catch (e) {
      console.log(e.stack);
      return false;
    }
  }

  async getOne(id) {
    const query = `SELECT * FROM kwicker.users u WHERE u.id_user = $1`;
    try {
      const { rows } = await db.query(query, [id]);
      return rows;
    } catch (e) {
      console.log(e.stack);
      return false;
    }
  }

  async addOne(body) {
    // const items = parse(this.jsonDbPath, this.defaultItems);
    const hashedPassword = await bcrypt.hash(body.password, saltRounds);

    // if (items.findIndex(u => u.email == body.email || u.username == body.username) != -1) {
    //   return;
    // }

    // const newitem = {
    //   idUser: this.getNextId(),
    //   forename: body.forename,
    //   lastname: body.lastname,
    //   email: body.email,
    //   username: body.username,
    //   password: hashedPassword,
    //   isActive: true,
    //   isAdmin: false,
    //   creationDate: Date.now(),
    //   biography: body.biography
    // };
    // items.push(newitem);
    // serialize(this.jsonDbPath, items);

    const query = `INSERT INTO kwicker.users VALUES (DEFAULT, $1, $2, $3, NULL, $4, DEFAULT, DEFAULT)`;
    try {
      const { rows } = await db.query(query, [body.forename, body.lastname, body.email, hashedPassword]);
      return rows;
    } catch (e) {
      console.log(e.stack);
      return false;
    }

    // return newitem;
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
    const userFound = await this.getOneByEmail(email);
    if (!userFound) return;

    const match = await bcrypt.compare(password, userFound[0].password);
    if (!match) return;

    const authenticatedUser = {
      idUser: userFound[0].idUser,
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