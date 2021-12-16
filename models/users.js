"use strict";
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const db = require("../db/db");
const LIFETIME_JWT = 24 * 60 * 60 * 1000;
const saltRounds = 10;

class Users {
  constructor() {
  }


/*
*
*  ░██████╗░███████╗████████╗
*  ██╔════╝░██╔════╝╚══██╔══╝
*  ██║░░██╗░█████╗░░░░░██║░░░
*  ██║░░╚██╗██╔══╝░░░░░██║░░░
*  ╚██████╔╝███████╗░░░██║░░░
*  ░╚═════╝░╚══════╝░░░╚═╝░░░
*
**/

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

  async getAllUsers() {
    const query = `SELECT id_user, forename, lastname, email, username, image, password, is_active, is_admin, biography, date_creation 
                    FROM kwicker.users`;
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

  async getUserByUsername(username) {
    const query = `SELECT id_user, forename, lastname, email, username, password, is_active, is_admin, biography, date_creation 
                   FROM kwicker.users WHERE username = $1`;
    try {
      const { rows } = await db.query(query, [username]);
      if (!rows || rows.length === 0) return;
      return rows[0];
    } catch (e) {
      console.log(e.stack);
      return false;
    }
  }

  async getProfileInformationsById(id) {
    const query = `SELECT id_user, forename, lastname, email, username, is_active, is_admin, biography, date_creation 
                   FROM kwicker.users WHERE id_user = $1`;
    try {
      const { rows } = await db.query(query, [id]);

      if (!rows || rows.length === 0) return;
      return rows[0];
    } catch (e) {
      console.log(e.stack);
      return false;
    }
  }


/*
*
*  ██████╗░███████╗██╗░░░░░███████╗████████╗███████╗
*  ██╔══██╗██╔════╝██║░░░░░██╔════╝╚══██╔══╝██╔════╝
*  ██║░░██║█████╗░░██║░░░░░█████╗░░░░░██║░░░█████╗░░
*  ██║░░██║██╔══╝░░██║░░░░░██╔══╝░░░░░██║░░░██╔══╝░░
*  ██████╔╝███████╗███████╗███████╗░░░██║░░░███████╗
*  ╚═════╝░╚══════╝╚══════╝╚══════╝░░░╚═╝░░░╚══════╝
*
**/

  async deleteUser(id) {
    const query = `UPDATE kwicker.users SET is_active = FALSE WHERE id_user = $1`;
    try {
      const { rows } = await db.query(query, [id]);
      return rows[0];
    } catch (e) {
      return false;
    }
  }


/*
*
*  ██████╗░░█████╗░░██████╗████████╗
*  ██╔══██╗██╔══██╗██╔════╝╚══██╔══╝
*  ██████╔╝██║░░██║╚█████╗░░░░██║░░░
*  ██╔═══╝░██║░░██║░╚═══██╗░░░██║░░░
*  ██║░░░░░╚█████╔╝██████╔╝░░░██║░░░
*  ╚═╝░░░░░░╚════╝░╚═════╝░░░░╚═╝░░░
*
**/

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

  async login(body) {
    const userFound = await this.getUserByUsername(body.username);
    if (!userFound) return;

    const match = await bcrypt.compare(body.password, userFound.password);
    if (!match) return;

    const authenticatedUser = {
      id_user: userFound.id_user,
      is_admin: userFound.is_admin,
      token: "None",
    };

    const token = jwt.sign(
        { idUser: authenticatedUser.id_user },
        process.env.jwtSecret,
        { expiresIn: LIFETIME_JWT }
    );

    authenticatedUser.token = token;
    return authenticatedUser;
  }

  async register(body) {
    const isInserted = await this.addUser(body);
    if (!isInserted) return;
    return await this.login(body);
  }


/*
*
*  ██╗░░░██╗██████╗░██████╗░░█████╗░████████╗███████╗
*  ██║░░░██║██╔══██╗██╔══██╗██╔══██╗╚══██╔══╝██╔════╝
*  ██║░░░██║██████╔╝██║░░██║███████║░░░██║░░░█████╗░░
*  ██║░░░██║██╔═══╝░██║░░██║██╔══██║░░░██║░░░██╔══╝░░
*  ╚██████╔╝██║░░░░░██████╔╝██║░░██║░░░██║░░░███████╗
*  ░╚═════╝░╚═╝░░░░░╚═════╝░╚═╝░░╚═╝░░░╚═╝░░░╚══════╝
*
**/

  async updateUserForename(id, forename) {
    const query = `UPDATE kwicker.users SET forename = $1 WHERE id_user = $2`;
    try {
      return await db.query(query, [forename, id]) != null;
    } catch (e) {
      console.log(e.stack);
      return false;
    }
  }

  async updateUserLastname(id, lastname) {
    const query = `UPDATE kwicker.users SET lastname = $1 WHERE id_user = $2`;
    try {
      return await db.query(query, [lastname, id]) != null;
    } catch (e) {
      console.log(e.stack);
      return false;
    }
  }

  async updateUserBiography(id, biography) {
    const query = `UPDATE kwicker.users SET biography = $1 WHERE id_user = $2`;
    try {
      return await db.query(query, [biography, id]) != null;
    } catch (e) {
      console.log(e.stack);
      return false;
    }
  }

  async updateUserImage(id, image) {
    const query = `UPDATE kwicker.users SET image = $1 WHERE id_user = $2`;
    try {
      const { rows } = await db.query(query, [image, id]);
      return rows;
    } catch (e) {
      console.log(e.stack);
      return false;
    }
  }

  /**
   * Activate the user an return 1 if it worked, otherwise 0
   * @param id_user
   * @returns {Promise<void>}
   */
  async activateUser(id_user) {
    const query = {
      text: `UPDATE kwicker.users
             SET is_active = TRUE
             WHERE id_user = $1`,
      values: [escape(id_user)]
    };
    try{
      const result = await db.query(query);
      return result.rowCount;
    } catch (e) {
      console.log(e.stack);
      throw new Error("Error while changing is_active to TRUE");
    }
  }

  /**
   * Set a user to admin
   * @param id_user
   * @returns {Promise<null|number|*>}
   */
  async setAdmin(id_user) {
    const query = {
      text: `UPDATE kwicker.users
             SET is_admin = TRUE
             WHERE id_user =  $1`,
      values: [id_user]
    };
    try {
      const result = await db.query(query);
      return result.rowCount;
    } catch (e) {
      console.log(e.stack);
      throw new Error("Error while changing is_admin to TRUE.");
    }
  }

  /**
   * Set a user from admin to non admin
   * @param id_user
   * @returns {Promise<null|number|*>}
   */
  async setNotAdmin(id_user) {
    const query = {
      text: `UPDATE kwicker.users
             SET is_admin = FALSE
             WHERE id_user = $1`,
      values: [id_user]
  };
    try {
      const result = await db.query(query);
      return result.rowCount;
    } catch (e) {
      console.log(e.stack);
      throw new Error("Error while changing is_admin to FALSE.");
    }
  }
}

module.exports = { Users };