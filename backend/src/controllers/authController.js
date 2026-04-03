// src/controllers/authController.js
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../models/db')

exports.register = async (req, res) => {
  const { name, email, password } = req.body

  try {
    // Verifica se email já existe
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email])
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email já cadastrado' })
    }

    const hash = await bcrypt.hash(password, 10)

    await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [
      name,
      email,
      hash,
    ])

    res.status(201).json({ message: 'Usuário criado com sucesso' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Erro no servidor', error: err.message })
  }
}

exports.login = async (req, res) => {
  const { email, password } = req.body

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email])
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Credenciais inválidas' })
    }

    const user = rows[0]
    const match = await bcrypt.compare(password, user.password)

    if (!match) {
      return res.status(401).json({ message: 'Credenciais inválidas' })
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Erro no servidor', error: err.message })
  }
}
