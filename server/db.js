const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    password: "xxxxxxx",
    host: "localhost",
    port: 5434,
    database: "perntodo"
});

module.exports = pool;
