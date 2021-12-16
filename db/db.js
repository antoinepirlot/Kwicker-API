const db = require("../config/db_config");
const {Pool} = require("pg");

dbConfig = {
    host: db.host,
    port: db.port,
    database: db.database,
    user: db.user,
    password: db.password,
    ssl: {rejectUnauthorized: false}
};

const pool = new Pool(dbConfig);

module.exports = {
    query: (text, params) => pool.query(text, params)
}