require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true)
      if (origin.endsWith('.vercel.app') || origin.startsWith('http://localhost')) {
        return callback(null, true)
      }
      callback(new Error('Not allowed by CORS'))
    },
    credentials: true,
  }),
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/auth', require('./routes/auth'))
app.use('/api/tasks', require('./routes/tasks'))

app.get('/', (req, res) => {
  res.json({
    status: 'API online ✅',
    message: 'Task Manager Backend está funcionando!',
  })
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`)
})
