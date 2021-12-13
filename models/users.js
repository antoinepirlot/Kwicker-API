"use strict";
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const db = require("../db/db");
const jwtSecret = require("../config/jwt_secret");
const LIFETIME_JWT = 24 * 60 * 60 * 1000;
const saltRounds = 10;

class Users {
  constructor() {
  }

  async getAllActiveUsers() {
    const query = `SELECT id_user, forename, lastname, email, username, image, password, is_active, is_admin, biography, date_creation 
                    FROM kwicker.users WHERE is_active = TRUE`;
    try {
      const { rows } = await db.query(query);
      return rows;
    } catch (e) {
      console.log(e.stack);
      return false;
    }
  }

  async getUserByEmail(email) {
    const query = `SELECT id_user, forename, lastname, email, username, image, password, is_active, is_admin, biography, date_creation 
                    FROM kwicker.users u WHERE u.email = $1`;
    try {
      const { rows } = await db.query(query, [email]);
      return rows[0];
    } catch (e) {
      console.log(e.stack);
      return false;
    }
  }

  async getUserById(id) {
    const query = `SELECT id_user, forename, lastname, email, username, image, password, is_active, is_admin, biography, date_creation 
                    FROM kwicker.users u WHERE u.id_user = $1`;
    try {
      const { rows } = await db.query(query, [id]);
      return rows[0];
    } catch (e) {
      console.log(e.stack);
      return false;
    }
  }

  async getIdByEmail(email) {
    const query = `SELECT id_user FROM kwicker.users WHERE email = $1`;
    try {
      const { rows } = await db.query(query, [email]);
      if (!rows || rows.length === 0) return;
      return rows[0].id_user;
    } catch (e) {
      console.log(e.stack);
      return false;
    }
  }

  async getProfileInformationsByEmail(email) {
    const query = `SELECT id_user, forename, lastname, email, username, is_active, is_admin, biography, date_creation 
                   FROM kwicker.users WHERE email = $1`;
    try {
      const { rows } = await db.query(query, [email]);

      if (!rows || rows.length === 0) return;
      return rows[0];
    } catch (e) {
      console.log(e.stack);
      return false;
    }
  }

  async addUser(body) {
    const hashedPassword = await bcrypt.hash(body.password, saltRounds);
    const query = {
      name: 'insert-user',
      text: 'INSERT INTO kwicker.users VALUES (DEFAULT, $1, $2, $3, $4, NULL, $5, DEFAULT, DEFAULT, NULL, DEFAULT)',
      values: [body.forename, body.lastname, body.email, body.username, hashedPassword],
    };
    try {
      return await db.query(query) != null;
    } catch (e) {
      return false;
    }
  }

  async deleteUser(id) {
    const query = `UPDATE kwicker.users SET is_active = FALSE WHERE id_user = $1`;
    try {
      const { rows } = await db.query(query, [id]);
      return rows[0];
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
    const isInserted = await this.addUser(
        {
          forename: body.forename,
          lastname: body.lastname,
          email: body.email,
          username: body.username,
          password: body.password
        }
    );
    if (!isInserted) return;
    const idUser = await this.getIdByEmail(body.email);
    const authenticatedUser = {
      idUser: idUser,
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