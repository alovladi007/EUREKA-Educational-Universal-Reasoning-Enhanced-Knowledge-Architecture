#!/bin/bash

echo "Creating all backend files..."

# Backend package.json
cat > backend/package.json << 'EOF'
{
  "name": "commercial-platform-backend",
  "version": "1.0.0",
  "description": "Backend for commercial platform",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "migrate": "node migrations/migrate.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.11.3",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "multer": "^1.4.5-lts.1",
    "socket.io": "^4.6.2",
    "stripe": "^13.10.0",
    "express-validator": "^7.0.1",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5",
    "compression": "^1.7.4",
    "morgan": "^1.10.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
EOF

# Backend .env.example
cat > backend/.env.example << 'EOF'
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=commercial_platform
DB_USER=postgres
DB_PASSWORD=your_postgres_password

JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d

STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads

FRONTEND_URL=http://localhost:3000
EOF

# Frontend package.json
cat > frontend/package.json << 'EOF'
{
  "name": "commercial-platform-frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.0.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.6.2",
    "socket.io-client": "^4.6.2",
    "@stripe/stripe-js": "^2.2.2",
    "@stripe/react-stripe-js": "^2.4.0",
    "react-hot-toast": "^2.4.1",
    "react-icons": "^4.12.0",
    "date-fns": "^3.0.6",
    "recharts": "^2.10.3",
    "react-dropzone": "^14.2.3",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32"
  },
  "devDependencies": {
    "eslint": "^8.56.0",
    "eslint-config-next": "14.0.4"
  }
}
EOF

# Frontend .env.local.example
cat > frontend/.env.local.example << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_your_stripe_publishable_key
EOF

echo "✅ Created package.json and .env files"
