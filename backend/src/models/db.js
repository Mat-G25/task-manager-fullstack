// backend/src/models/db.js
const mysql = require('mysql2/promise')
require('dotenv').config()

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

console.log('✅ Pool de conexão MySQL criado com sucesso!')
console.log(`📍 Conectado em: ${process.env.DB_HOST}:${process.env.DB_PORT || 3306}`)

module.exports = pool
