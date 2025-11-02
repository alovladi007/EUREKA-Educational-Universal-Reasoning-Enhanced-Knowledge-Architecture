# Commercial Platform - Full Stack Application

A comprehensive commercial platform with dashboard, task management, payment processing, file uploads, real-time updates, and advanced search functionality.

## 🚀 Features

- **User Authentication** - Secure JWT-based authentication
- **Dashboard** - Real-time analytics and statistics
- **Project Management** - Create, edit, and manage projects
- **Task Management** - Assign tasks, track progress, add comments
- **File Uploads** - Upload files to projects and tasks
- **Payment Processing** - Stripe integration
- **Real-time Updates** - WebSocket-powered live updates
- **Advanced Search** - Full-text search across projects, tasks, and files
- **Notifications** - Real-time notification system

## 🏗️ Tech Stack

### Backend
- Node.js + Express.js
- PostgreSQL
- Socket.IO
- Stripe
- JWT
- Multer

### Frontend
- Next.js
- React 18
- Tailwind CSS
- Axios
- Socket.IO Client
- React Hot Toast

## 📋 Prerequisites

- Node.js 16+
- PostgreSQL 12+
- Stripe account (for payments)

## 🛠️ Installation & Setup

### 1. Database Setup

```bash
# Create database
createdb commercial_platform
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your configuration

# Run migrations
npm run migrate

# Start server
npm run dev
```

The backend will start on http://localhost:5000

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local
cp .env.local.example .env.local

# Update .env.local

# Start development server
npm run dev
```

The frontend will start on http://localhost:3000

## 🔐 Environment Variables

### Backend (.env)

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=commercial_platform
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_secret_key
JWT_EXPIRE=7d

STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret

MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads

FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_your_key
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Files
- `POST /api/files/upload/task/:taskId` - Upload file
- `GET /api/files/:id/download` - Download file
- `DELETE /api/files/:id` - Delete file

### Payments
- `POST /api/payments/create-payment-intent` - Create payment
- `GET /api/payments/history` - Get payment history

### Search
- `GET /api/search?q=query` - Search across all content

### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:id/read` - Mark as read

## 🎯 Quick Start

1. Clone the repository
2. Set up PostgreSQL database
3. Run setup scripts or manual installation
4. Update environment variables
5. Run migrations
6. Start both servers
7. Visit http://localhost:3000

## 📁 Project Structure

```
commercial-platform/
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── migrations/
│   ├── routes/
│   ├── websocket.js
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── components/
    ├── contexts/
    ├── pages/
    ├── styles/
    ├── utils/
    └── package.json
```

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- CORS protection
- Rate limiting
- Helmet security headers
- Input validation

## 📝 License

MIT

## 👥 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

Built with ❤️ using Next.js, Node.js, and PostgreSQL
