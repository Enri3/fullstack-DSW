const pool = require('../database');
//decia ./mysql

const store = async(nombre, medida, precio, urlimg) => {
   const sql = `INSERT INTO productos (nombre, medida, precio, urlImg) VALUES (?, ?, ?, ?)`;
   try{
       const [result] = await pool.query(sql, [nombre, medida, precio, urlimg]);
       return result
   } catch (error){
   throw error;
   }
};

module.exports = {
    store   };
/*
const { getConnection } = require('../database');

const store = async (nombre, medida, precio, urlimg) => {
    const sql = `INSERT INTO productos (nombre, medida, precio, urlImg) VALUES (?, ?, ?, ?)`;
    try {
        const conn = await getConnection();
        const result = await conn.query(sql, [nombre, medida, precio, urlimg]);
        return result;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    store
};*/