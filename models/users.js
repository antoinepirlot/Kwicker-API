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

  async getAllUsers() {
    const query = `SELECT user_id, forename, lastname, email, username, image, password, is_active, is_admin, biography, creation_date 
                    FROM kwicker.users
                    ORDER BY user_id`;
    try {
      const { rows } = await db.query(query);
      return rows;
    } catch (e) {
      console.log(e.stack);
      return false;
    }
  }

  async getAllUsersSimilarTo(search) {
    const query = `SELECT user_id, forename, lastname, email, username, image, is_active, is_admin, biography, creation_date 
                    FROM kwicker.users
                    WHERE (lower(forename) LIKE $1 OR lower(lastname) LIKE $1 OR lower(username) LIKE $1)
                    AND is_active = TRUE`
    try {
      const { rows } = await db.query(query, [search + '%']);
      return rows;
    } catch (e) {
      return false;
    }
  }

  async getUserById(id) {
    const query = `SELECT user_id, forename, lastname, email, username, image, password, is_active, is_admin, biography, creation_date 
                    FROM kwicker.users u WHERE u.user_id = $1`;
    try {
      const { rows } = await db.query(query, [id]);
      return rows[0];
    } catch (e) {
      console.log(e.stack);
      return false;
    }
  }

  async getUserByUsername(username) {
    const query = `SELECT user_id, forename, lastname, email, username, password, is_active, is_admin, biography, creation_date 
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
    const query = `SELECT user_id, forename, lastname, email, username, is_active, is_admin, biography, creation_date 
                   FROM kwicker.users WHERE user_id = $1`;
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
    const query = `UPDATE kwicker.users SET is_active = FALSE WHERE user_id = $1`;
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
      const result = await db.query(query);
      return result.rowCount;
    } catch (e) {
      return false;
    }
  }

  async login(body) {
    const userFound = await this.getUserByUsername(body.username);
    if (!userFound) return 0;

    const match = await bcrypt.compare(body.password, userFound.password);
    if (!match) return 1;

    const authenticatedUser = {
      user_id: userFound.user_id,
      is_admin: userFound.is_admin,
      token: "None",
    };

    const token = jwt.sign(
        { idUser: authenticatedUser.user_id },
        process.env.jwtSecret,
        { expiresIn: LIFETIME_JWT }
    );

    authenticatedUser.token = token;
    return authenticatedUser;
  }

  async register(body) {
    const rowCount = await this.addUser(body);
    if (rowCount === 0) return;
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
    const query = `UPDATE kwicker.users SET forename = $1 WHERE user_id = $2`;
    try {
      return await db.query(query, [forename, id]) != null;
    } catch (e) {
      console.log(e.stack);
      return false;
    }
  }

  async updateUserLastname(id, lastname) {
    const query = `UPDATE kwicker.users SET lastname = $1 WHERE user_id = $2`;
    try {
      return await db.query(query, [lastname, id]) != null;
    } catch (e) {
      console.log(e.stack);
      return false;
    }
  }

  async updateUserBiography(id, biography) {
    const query = `UPDATE kwicker.users SET biography = $1 WHERE user_id = $2`;
    try {
      let biographyUser = biography;
      if (!biographyUser.trim()) biographyUser = null;
      return await db.query(query, [biographyUser, id]) != null;
    } catch (e) {
      console.log(e.stack);
      return false;
    }
  }


  async updateUserImage(id, image) {
    const query = `UPDATE kwicker.users SET image = $1 WHERE user_id = $2`;
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
   * @param user_id
   * @returns {Promise<void>}
   */
  async activateUser(user_id) {
    const query = {
      text: `UPDATE kwicker.users
             SET is_active = TRUE
             WHERE user_id = $1`,
      values: [escape(user_id)]
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
   * @param user_id
   * @returns {Promise<null|number|*>}
   */
  async setAdmin(user_id) {
    const query = {
      text: `UPDATE kwicker.users
             SET is_admin = TRUE
             WHERE user_id =  $1`,
      values: [user_id]
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
   * @param user_id
   * @returns {Promise<null|number|*>}
   */
  async setNotAdmin(user_id) {
    const query = {
      text: `UPDATE kwicker.users
             SET is_admin = FALSE
             WHERE user_id = $1`,
      values: [user_id]
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