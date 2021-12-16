const {Pool} = require("pg");
require("dotenv").config();

dbConfig = {
    host: process.env.host,
    port: process.env.port,
    database: process.env.database,
    user: process.env.user,
    password: process.env.password,
    ssl: {rejectUnauthorized: false}
};

const pool = new Pool(dbConfig);

module.exports = {
    query: (text, params) => pool.query(text, params)
}