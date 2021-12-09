//From pg domcumentation
const {Pool} = require("pg");
const dbConfig = require("../config/db_config");

const pool = new Pool(dbConfig);

module.exports = {
    query: (text, params) => pool.query(text, params)
}