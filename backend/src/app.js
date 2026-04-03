// src/app.js
require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()

// Middlewares - ESSA ORDEM É IMPORTANTE
app.use(cors())
app.use(express.json()) // ← Isso deve vir antes das rotas
app.use(express.urlencoded({ extended: true }))

// Rotas
app.use('/api/auth', require('./routes/auth'))
app.use('/api/tasks', require('./routes/tasks'))

// Rota de teste
app.get('/', (req, res) => {
  res.json({
    status: 'API online ✅',
    message: 'Task Manager Backend está funcionando!',
  })
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`)
  console.log(`📍 Teste: http://localhost:${PORT}`)
})
