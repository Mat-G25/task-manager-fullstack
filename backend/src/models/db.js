// backend/src/models/db.js
const mysql = require('mysql2/promise')
require('dotenv').config()

const pool = mysql.createPool({
  host: process.env.DB_HOST || process.env.MYSQLHOST,
  port: process.env.DB_PORT || process.env.MYSQLPORT || 3306,
  user: process.env.DB_USER || process.env.MYSQLUSER,
  password: process.env.DB_PASS || process.env.MYSQLPASSWORD,
  database: process.env.DB_NAME || process.env.MYSQLDATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

console.log('✅ Pool de conexão MySQL criado com sucesso!')
console.log(`📍 Host: ${process.env.DB_HOST || process.env.MYSQLHOST}`)
console.log(`📍 Porta: ${process.env.DB_PORT || process.env.MYSQLPORT || 3306}`)
console.log(`📍 Banco: ${process.env.DB_NAME || process.env.MYSQLDATABASE}`)

module.exports = pool
