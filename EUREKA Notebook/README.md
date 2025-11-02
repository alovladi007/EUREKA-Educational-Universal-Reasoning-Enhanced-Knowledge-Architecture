# Commercial Platform - Full Stack Application

A comprehensive commercial platform with dashboard, task management, payment processing, file uploads, real-time updates, and advanced search functionality.

## 🚀 Features

- **User Authentication** - Secure JWT-based authentication with registration and login
- **Dashboard** - Real-time analytics and project/task statistics
- **Project Management** - Create, edit, and manage projects with full CRUD operations
- **Task Management** - Assign tasks, track progress, add comments, and set priorities
- **File Uploads** - Upload files to projects and tasks with secure storage
- **Payment Processing** - Stripe integration for secure payment handling
- **Real-time Updates** - WebSocket-powered live updates for tasks and notifications
- **Advanced Search** - Full-text search across projects, tasks, and files
- **Notifications** - Real-time notification system for important events

## 🏗️ Tech Stack

### Backend
- **Node.js** + **Express.js** - Server framework
- **PostgreSQL** - Database
- **Socket.IO** - Real-time WebSocket communication
- **Stripe** - Payment processing
- **JWT** - Authentication
- **Multer** - File upload handling
- **Bcrypt** - Password hashing

### Frontend
- **Next.js** - React framework
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Socket.IO Client** - Real-time updates
- **React Hot Toast** - Notifications
- **Recharts** - Data visualization
- **React Icons** - Icon library

## 📋 Prerequisites

- Node.js 16+ and npm
- PostgreSQL 12+
- Stripe account (for payment processing)

## 🛠️ Installation & Setup

### 1. Database Setup

```bash
# Install PostgreSQL if not already installed
# Create a new database
createdb commercial_platform

# Or using psql
psql -U postgres
CREATE DATABASE commercial_platform;
\q
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your configuration:
# - Database credentials
# - JWT secret
# - Stripe keys
# - Other environment variables

# Run database migrations
npm run migrate

# Start the server
npm run dev
```

The backend server will start on http://localhost:5000

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env.local file
cp .env.local.example .env.local

# Update .env.local with:
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your_stripe_public_key

# Start the development server
npm run dev
```

The frontend will start on http://localhost:3000

## 🔐 Environment Variables

### Backend (.env)

```env
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=commercial_platform
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d

# Stripe
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads

# CORS
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
- `PUT /api/auth/me` - Update profile
- `PUT /api/auth/change-password` - Change password

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `GET /api/projects/:id/stats` - Get project statistics

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `POST /api/tasks/:id/comments` - Add comment to task

### Files
- `POST /api/files/upload/task/:taskId` - Upload file to task
- `POST /api/files/upload/project/:projectId` - Upload file to project
- `GET /api/files/:id` - Get file info
- `GET /api/files/:id/download` - Download file
- `DELETE /api/files/:id` - Delete file

### Payments
- `POST /api/payments/create-payment-intent` - Create payment
- `GET /api/payments/history` - Get payment history
- `GET /api/payments/:id` - Get payment details
- `GET /api/payments/stats/overview` - Get payment statistics

### Search
- `GET /api/search?q=query` - Global search
- `POST /api/search/advanced` - Advanced search with filters
- `GET /api/search/suggestions?q=query` - Search suggestions

### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## 🔌 WebSocket Events

### Client → Server
- `join:project` - Join a project room
- `leave:project` - Leave a project room
- `task:update` - Broadcast task update
- `comment:new` - Broadcast new comment
- `typing:start` - Start typing indicator
- `typing:stop` - Stop typing indicator

### Server → Client
- `task:updated` - Task was updated
- `comment:added` - Comment was added
- `notification:received` - New notification
- `user:typing` - User is typing
- `user:stopped-typing` - User stopped typing
- `user:joined` - User joined project
- `user:left` - User left project

## 🎯 Usage Examples

### Creating a New User

```javascript
// POST /api/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "first_name": "John",
  "last_name": "Doe"
}
```

### Creating a Project

```javascript
// POST /api/projects
{
  "name": "New Website",
  "description": "Building a new company website",
  "status": "active",
  "budget": 50000,
  "start_date": "2024-01-01",
  "end_date": "2024-06-30"
}
```

### Creating a Task

```javascript
// POST /api/tasks
{
  "title": "Design Homepage",
  "description": "Create mockups for homepage",
  "status": "todo",
  "priority": "high",
  "project_id": 1,
  "assigned_to": 2,
  "due_date": "2024-02-15T10:00:00Z"
}
```

## 📁 Project Structure

```
commercial-platform/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── middleware/
│   │   └── auth.js
│   ├── migrations/
│   │   └── migrate.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── projects.js
│   │   ├── tasks.js
│   │   ├── files.js
│   │   ├── payments.js
│   │   ├── search.js
│   │   └── notifications.js
│   ├── websocket.js
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── components/
    │   └── Layout.js
    ├── contexts/
    │   └── AuthContext.js
    ├── pages/
    │   ├── index.js
    │   ├── login.js
    │   ├── register.js
    │   └── dashboard.js
    ├── styles/
    │   └── globals.css
    ├── utils/
    │   ├── api.js
    │   └── socket.js
    └── package.json
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
# Start server in development mode
npm run dev

# Test health endpoint
curl http://localhost:5000/health
```

### Frontend Testing
```bash
cd frontend
npm run dev
# Visit http://localhost:3000
```

## 🚀 Deployment

### Backend Deployment

1. Set environment variables on your hosting platform
2. Run migrations: `npm run migrate`
3. Build and start: `npm start`

### Frontend Deployment

```bash
npm run build
npm start
```

Or deploy to Vercel:
```bash
vercel deploy
```

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- CORS protection
- Rate limiting
- Helmet security headers
- Input validation
- SQL injection protection
- XSS protection

## 📝 License

MIT

## 👥 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For issues or questions, please create an issue in the repository.

---

Built with ❤️ using Next.js, Node.js, and PostgreSQL
