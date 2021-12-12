"use strict";
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const db = require("../db/db");
const jwtSecret = "motdepasse";
const LIFETIME_JWT = 24 * 60 * 60 * 1000;
const saltRounds = 10;

class Users {
  constructor() {
  }

  async getAllActiveUsers() {
    const query = `SELECT id_user, forename, lastname, email, image, password, is_active, is_admin FROM kwicker.users WHERE is_active = TRUE`;
    try {
      const { rows } = await db.query(query);
      return rows;
    } catch (e) {
      console.log(e.stack);
      return false;
    }
  }

  async getUserByEmail(email) {
    const query = `SELECT * FROM kwicker.users u WHERE u.email = $1`;
    try {
      const { rows } = await db.query(query, [email]);
      return rows[0];
    } catch (e) {
      console.log(e.stack);
      return false;
    }
  }

  async getUserById(id) {
    const query = `SELECT * FROM kwicker.users u WHERE u.id_user = $1`;
    try {
      const { rows } = await db.query(query, [id]);
      return rows[0];
    } catch (e) {
      console.log(e.stack);
      return false;
    }
  }

  async addUser(body) {
    const hashedPassword = await bcrypt.hash(body.password, saltRounds);
    const query = `INSERT INTO kwicker.users VALUES (DEFAULT, $1, $2, $3, NULL, $4, DEFAULT, DEFAULT)`;
    try {
      await db.query(query, [body.forename, body.lastname, body.email, hashedPassword])
      console.log(rows)
      return true;
    } catch (e) {
      console.log(e.stack);
      return false;
    }
  }

  async deleteUser(id) {
    const query = `UPDATE kwicker.users SET is_active = FALSE WHERE id_user = $1`;
    try {
      const { rows } = await db.query(query, [id]);
      return rows;
    } catch (e) {
      console.log(e.stack);
      return false;
    }
  }

  async updateUser(id, body) {
    const query = `UPDATE kwicker.users SET is_active = FALSE WHERE id_user = $1`;
    try {
      const { rows } = await db.query(query, [id]);
      return rows;
    } catch (e) {
      console.log(e.stack);
      return false;
    }
  }

  async login(body) {
    const userFound = await this.getUserByEmail(body.email);
    if (!userFound) return;

    const match = await bcrypt.compare(body.password, userFound.password);
    if (!match) return;

    const authenticatedUser = {
      idUser: userFound.id_user,
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

  async register(body) {
    let newUser = await this.addUser(
        {
          forename: body.forename,
          lastname: body.lastname,
          email: body.email,
          //username: body.username,
          password: body.password
        }
    );
    if (!newUser) return;
    const authenticatedUser = {
      idUser: newUser.id_user,
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