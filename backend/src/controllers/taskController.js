const db = require('../models/db')

exports.getAll = async (req, res) => {
  try {
    const [tasks] = await db.query(
      'SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC',
      [req.userId],
    )
    res.json(tasks)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Erro ao buscar tarefas' })
  }
}

exports.create = async (req, res) => {
  const { title, description, due_date } = req.body

  if (!title) {
    return res.status(400).json({ message: 'Título é obrigatório' })
  }

  try {
    const [result] = await db.query(
      'INSERT INTO tasks (title, description, status, user_id, due_date) VALUES (?, ?, ?, ?, ?)',
      [title, description || '', 'pending', req.userId, due_date || null],
    )

    res.status(201).json({
      id: result.insertId,
      title,
      description: description || '',
      status: 'pending',
      due_date,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Erro ao criar tarefa' })
  }
}

exports.update = async (req, res) => {
  const { title, description, status, due_date } = req.body

  try {
    const [result] = await db.query(
      `UPDATE tasks 
       SET title = COALESCE(?, title),
           description = COALESCE(?, description),
           status = COALESCE(?, status),
           due_date = COALESCE(?, due_date)
       WHERE id = ? AND user_id = ?`,
      [title, description, status, due_date, req.params.id, req.userId],
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Tarefa não encontrada' })
    }

    res.json({ message: 'Tarefa atualizada com sucesso' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Erro ao atualizar tarefa' })
  }
}

exports.remove = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM tasks WHERE id = ? AND user_id = ?', [
      req.params.id,
      req.userId,
    ])

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Tarefa não encontrada' })
    }

    res.json({ message: 'Tarefa deletada com sucesso' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Erro ao deletar tarefa' })
  }
}
