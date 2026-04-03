// src/pages/TasksPage.jsx
import { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../hooks/useAuth'
import { Clock, Play, CheckCircle, AlertTriangle, Plus } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import { PieChart as RechartsPie, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'


const STATUS_LABEL = {
  pending: 'Pendente',
  in_progress: 'Em andamento',
  done: 'Concluída',
}

const COLORS = ['#f59e0b', '#3b82f6', '#10b981']

const isOverdue = (dueDate, status) => {
  if (!dueDate || status === 'done') return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(dueDate)
  return due < today
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export default function TasksPage() {
  const { user, logout, isDarkMode, toggleTheme } = useAuth()
  const navigate = useNavigate()

  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [newTask, setNewTask] = useState({ title: '', description: '', due_date: '' })
  const [creating, setCreating] = useState(false)
  const [editId, setEditId] = useState(null)
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    status: 'pending',
    due_date: '',
  })
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const totalTasks = tasks.length
  const pendingTasks = tasks.filter((t) => t.status === 'pending').length
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress').length
  const doneTasks = tasks.filter((t) => t.status === 'done').length

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesStatus = filter === 'all' || task.status === filter
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesStatus && matchesSearch
    })
  }, [tasks, filter, searchTerm])

  const chartData = [
    { name: 'Pendentes', value: pendingTasks, color: COLORS[0] },
    { name: 'Em Andamento', value: inProgressTasks, color: COLORS[1] },
    { name: 'Concluídas', value: doneTasks, color: COLORS[2] },
  ]

  const fetchTasks = useCallback(async () => {
    try {
      const { data } = await api.get('/tasks')
      setTasks(data)
    } catch (error) {
      console.error(error)
      if (error.response?.status === 401) {
        logout()
        navigate('/login')
      }
    } finally {
      setLoading(false)
    }
  }, [logout, navigate])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  async function handleCreate(e) {
    e.preventDefault()
    if (!newTask.title.trim()) return

    setCreating(true)
    try {
      const { data } = await api.post('/tasks', newTask)
      setTasks((prev) => [data, ...prev])
      setNewTask({ title: '', description: '', due_date: '' })
      toast.success('Tarefa criada com sucesso! ✅')
    } catch {
      toast.error('Erro ao criar tarefa')
    } finally {
      setCreating(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Deseja realmente deletar esta tarefa?')) return

    try {
      await api.delete(`/tasks/${id}`)
      setTasks((prev) => prev.filter((t) => t.id !== id))
      toast.success('Tarefa deletada com sucesso!')
    } catch {
      toast.error('Erro ao deletar tarefa')
    }
  }

  function startEdit(task) {
    setEditId(task.id)
    setEditForm({
      title: task.title,
      description: task.description || '',
      status: task.status,
      due_date: task.due_date || '',
    })
  }

  async function handleUpdate(id) {
    try {
      await api.put(`/tasks/${id}`, editForm)
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...editForm } : t)))
      setEditId(null)
      toast.success('Tarefa atualizada com sucesso!')
    } catch {
      toast.error('Erro ao atualizar tarefa')
    }
  }

  return (
    <div className="tasks-wrapper">
      <Toaster position="top-right" />

      <div className="tasks-header">
        <h1>Olá, {user?.name?.split(' ')[0] || 'Usuário'} 👋</h1>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={toggleTheme}
            className="theme-toggle"
            title={isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
          >
            {isDarkMode ? '☽' : '☀'}
          </button>

          <button className="logout-btn" onClick={handleLogout}>
            Sair
          </button>
        </div>
      </div>

      {/* Estatísticas + Gráfico */}
      <div className="stats-and-chart">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon total">
              <Clock size={18} />
            </div>
            <div>
              <p>Total</p>
              <h3>{totalTasks}</h3>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon pending">
              <AlertTriangle size={18} />
            </div>
            <div>
              <p>Pendentes</p>
              <h3>{pendingTasks}</h3>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon progress">
              <Play size={18} />
            </div>
            <div>
              <p>Em Andamento</p>
              <h3>{inProgressTasks}</h3>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon done">
              <CheckCircle size={18} />
            </div>
            <div>
              <p>Concluídas</p>
              <h3>{doneTasks}</h3>
            </div>
          </div>
        </div>

        <div className="chart-card">
          <h3>Progresso Geral</h3>
          <ResponsiveContainer width="100%" height={220}>
            <RechartsPie data={chartData}>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={92}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPie>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filtro e Busca */}
      <div className="filter-bar">
        <div className="status-filters">
          {['all', 'pending', 'in_progress', 'done'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={filter === status ? 'active' : ''}
            >
              {status === 'all' ? 'Todas' : STATUS_LABEL[status]}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Buscar por título..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Nova Tarefa */}
      <div className="new-task-card">
        <h2>
          <Plus size={20} /> Nova Tarefa
        </h2>
        <form onSubmit={handleCreate}>
          <div className="task-form-row">
            <div className="form-group">
              <label>Título</label>
              <input
                type="text"
                placeholder="Ex: Finalizar relatório mensal"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Descrição</label>
              <input
                type="text"
                placeholder="Detalhes da tarefa..."
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Prazo</label>
              <input
                type="date"
                value={newTask.due_date}
                onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
              />
            </div>
            <button className="btn btn-primary" type="submit" disabled={creating}>
              {creating ? 'Adicionando...' : 'Adicionar'}
            </button>
          </div>
        </form>
      </div>

      {/* Lista de Tarefas */}
      {loading ? (
        <div className="task-list">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="empty-state">
          <p>Nenhuma tarefa encontrada.</p>
        </div>
      ) : (
        <div className="task-list">
          {filteredTasks.map((task) => {
            const overdue = isOverdue(task.due_date, task.status)
            return (
              <div className={`task-card ${overdue ? 'overdue' : ''}`} key={task.id}>
                {editId === task.id ? (
                  <div className="edit-form">
                    <div className="edit-form-row">
                      <div className="form-group">
                        <label>Título</label>
                        <input
                          value={editForm.title}
                          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label>Descrição</label>
                        <input
                          value={editForm.description}
                          onChange={(e) =>
                            setEditForm({ ...editForm, description: e.target.value })
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label>Status</label>
                        <select
                          value={editForm.status}
                          onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                        >
                          <option value="pending">Pendente</option>
                          <option value="in_progress">Em andamento</option>
                          <option value="done">Concluída</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Prazo</label>
                        <input
                          type="date"
                          value={editForm.due_date}
                          onChange={(e) => setEditForm({ ...editForm, due_date: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="edit-buttons">
                      <button className="btn btn-primary" onClick={() => handleUpdate(task.id)}>
                        Salvar
                      </button>
                      <button className="btn btn-secondary" onClick={() => setEditId(null)}>
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="task-info">
                      <h3>{task.title}</h3>
                      {task.description && <p>{task.description}</p>}
                      <div className="task-meta">
                        <span className={`status-badge status-${task.status}`}>
                          {STATUS_LABEL[task.status]}
                        </span>
                        {task.due_date && (
                          <span className={`due-date ${overdue ? 'overdue-text' : ''}`}>
                            📅 {formatDate(task.due_date)} {overdue && '⚠️ Atrasada'}
                          </span>
                        )}
                      </div>
                      {task.created_at && (
                        <p className="created-date">Criada em {formatDate(task.created_at)}</p>
                      )}
                    </div>
                    <div className="task-actions">
                      <button className="btn btn-secondary" onClick={() => startEdit(task)}>
                        Editar
                      </button>
                      <button className="btn btn-danger" onClick={() => handleDelete(task.id)}>
                        Deletar
                      </button>
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

const SkeletonCard = () => (
  <div className="task-card skeleton">
    <div className="task-info">
      <div className="skeleton-line" style={{ width: '70%' }}></div>
      <div className="skeleton-line" style={{ width: '85%', marginTop: '12px' }}></div>
    </div>
  </div>
)
