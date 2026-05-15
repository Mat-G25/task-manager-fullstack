// backend/src/models/db.js
const mysql = require('mysql2/promise')
require('dotenv').config()

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 4000,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

console.log(' Pool de conexão MySQL criado!')
console.log(` Host: ${process.env.DB_HOST}`)
console.log(` Banco: ${process.env.DB_NAME}`)

module.exports = pool
