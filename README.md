# Task Manager

Sistema full-stack de gerenciamento de tarefas com autenticação JWT, desenvolvido para demonstrar boas práticas de desenvolvimento web.

<img width="1904" height="958" alt="image" src="https://github.com/user-attachments/assets/bc05cc4a-87cf-4ea1-ba01-815dfe07c9c4" />



---

## Funcionalidades

- Cadastro e login seguros com JWT e bcrypt
- CRUD completo de tarefas com propriedade por usuário
- Busca em tempo real por título
- Filtros por status (Todas, Pendente, Em andamento, Concluída)
- Dashboard com estatísticas e gráfico de progresso
- Suporte a prazo com destaque visual para tarefas atrasadas
- Interface responsiva com suporte a modo escuro

---

## Tecnologias

**Backend**
- Node.js + Express
- MySQL
- JWT + bcryptjs
- Middleware de autenticação

**Frontend**
- React + Vite
- Axios
- React Router DOM
- Recharts (gráfico)
- React Hot Toast

**Deploy**
- Railway (API + Banco de Dados)
- Vercel (Frontend)

---

## Como executar localmente

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/task-manager.git
cd task-manager
```

### 2. Backend

```bash
cd backend
cp .env.example .env   # configure suas variáveis de ambiente
npm install
npm run dev
```

### 3. Banco de Dados

Execute o script SQL localizado em `backend/database.sql` no seu MySQL.

### 4. Frontend

```bash
cd frontend
npm install
npm run dev
```

Acesse: [http://localhost:5173](http://localhost:5173)

---

## Principais Endpoints

| Método | Rota | Autenticação | Descrição |
|--------|------|:---:|-----------|
| `POST` | `/api/auth/register` | Não | Cadastro de usuário |
| `POST` | `/api/auth/login` | Não | Login + retorno do token |
| `GET` | `/api/tasks` | Sim | Listar tarefas do usuário |
| `POST` | `/api/tasks` | Sim | Criar nova tarefa |
| `PUT` | `/api/tasks/:id` | Sim | Atualizar tarefa |
| `DELETE` | `/api/tasks/:id` | Sim | Deletar tarefa |

---

## Screenshots

### Login
<img width="1920" height="910" alt="image" src="https://github.com/user-attachments/assets/ae37a656-103e-4c20-897a-58141b2c3a96" />


### Lista de Tarefas
<img width="1906" height="656" alt="image" src="https://github.com/user-attachments/assets/f8a78851-57e9-4258-ad4e-17ff10898cd1" />


---

## Autor

**Matheus Guimarães da Silva**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/matheus-guimarães2005)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Mat-G25)
