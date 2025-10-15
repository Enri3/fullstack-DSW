import dotenv from "dotenv";
import mysql from "promise-mysql";

dotenv.config();

let connection: mysql.Connection | null = null;

export const getConnection = async (): Promise<mysql.Connection> => {
  if (!connection) {
    connection = await mysql.createConnection({
      host: process.env.HOST || "localhost",
      database: process.env.DATABASE || "",
      user: process.env.USER || "",
      password: process.env.PASSWORD || "",
    });
  }
  return connection;
};