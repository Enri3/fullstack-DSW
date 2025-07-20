const dotenv = require("dotenv");
const mysql= require("promise-mysql");


dotenv.config();

const connection = mysql.createConnection({
    host: process.env.HOST,
    database:process.env.DATABASE,
    user: process.env.USER,
    password: process.env.PASSWORD
}
)

const getConnection = async ()=> await connection;

module.exports = {
    getConnection
}

