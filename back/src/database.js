const dotenv = require("dotenv");
const mysql = require("promise-mysql");

dotenv.config();

let connection;

const getConnection = async () => {
  if (!connection) {
    connection = await mysql.createConnection({
      host: process.env.HOST,
      database: process.env.DATABASE,
      user: process.env.USER,
      password: process.env.PASSWORD,
    });
  }
  return connection;
};

module.exports = { getConnection };