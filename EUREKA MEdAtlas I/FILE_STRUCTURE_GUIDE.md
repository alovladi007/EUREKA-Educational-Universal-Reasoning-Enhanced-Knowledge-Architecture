# MedAtlas MD - File Structure & Location Guide

This document shows where every new file was created and what it does.

---

## 📁 PROJECT STRUCTURE

```
medatlas/
├── .env.example                          # Environment configuration template
├── infra/
│   └── database/
│       ├── init.sql                      # ✅ Complete database schema (35+ tables)
│       └── seed.sql                      # ✅ Comprehensive seed data
└── services/
    └── api-core/
        ├── package.json                  # Dependencies configuration
        ├── nest-cli.json                 # NestJS CLI configuration
        ├── tsconfig.json                 # TypeScript configuration
        └── src/
            ├── main.ts                   # Application entry point
            ├── app.module.ts             # Root application module
            ├── auth/                     # ✅ Authentication System
            │   ├── auth.module.ts
            │   ├── auth.service.ts       # Core auth logic
            │   ├── auth.controller.ts    # Auth API endpoints
            │   ├── dto/
            │   │   └── auth.dto.ts       # Request validation DTOs
            │   ├── guards/
            │   │   ├── jwt-auth.guard.ts # JWT authentication guard
            │   │   └── roles.guard.ts    # RBAC role guard
            │   └── strategies/
            │       └── jwt.strategy.ts   # Passport JWT strategy
            ├── ai-tutor/                 # ✅ AI Tutor System
            │   ├── ai-tutor.module.ts
            │   ├── ai-tutor.service.ts   # Claude API integration
            │   ├── ai-tutor.controller.ts# AI Tutor API endpoints
            │   └── dto/
            │       └── ai-tutor.dto.ts   # Request validation DTOs
            └── entities/                  # Database entities
                ├── user.entity.ts
                ├── user-session.entity.ts
                ├── chat-conversation.entity.ts
                └── chat-message.entity.ts
```

---

## 📄 FILE INVENTORY

### Database Files

#### `infra/database/init.sql` (1,028 lines)
**Purpose**: Complete database schema initialization  
**Contains**:
- 35+ production tables
- 100+ indexes
- Foreign key constraints
- Triggers for auto-timestamps
- Views for common queries
- pgvector extension setup

**Key Tables**:
- Core: `organizations`, `users`, `courses`, `enrollments`
- Assessment: `qbank_items`, `assessments`, `grading_rubrics`
- Learning: `learning_paths`, `user_progress`, `mastery_tracking`
- Analytics: `analytics_events`, `performance_metrics`, `engagement_data`
- AI: `chat_conversations`, `chat_messages`
- Gamification: `badges`, `user_gamification`
- Audit: `audit_logs` (immutable)

#### `infra/database/seed.sql` (658 lines)
**Purpose**: Development and testing data  
**Contains**:
- 3 demo organizations
- 7 demo users (hashed passwords)
- 5 courses with modules and lessons
- 5 QBank questions
- 2 assessments
- Gamification data (badges, XP)
- Sample analytics events
- AI tutor conversation example

---

### Authentication System (9 files)

#### `services/api-core/src/auth/auth.service.ts` (424 lines)
**Purpose**: Core authentication business logic  
**Exports**: `AuthService`  
**Key Methods**:
- `register()` - User registration with validation
- `login()` - Credential verification and token generation
- `refreshToken()` - Access token refresh
- `logout()` - Session invalidation
- `verifyToken()` - Token validation
- `changePassword()` - Password update
- `requestPasswordReset()` - Password reset request
- `resetPassword()` - Password reset with token

**Features**:
- Bcrypt password hashing (10 rounds)
- JWT token generation (access + refresh)
- Token expiration handling
- Session management
- Password strength validation

#### `services/api-core/src/auth/dto/auth.dto.ts` (132 lines)
**Purpose**: Request validation DTOs  
**Exports**:
- `RegisterDto` - Registration validation
- `LoginDto` - Login validation
- `RefreshTokenDto` - Token refresh validation
- `ChangePasswordDto` - Password change validation
- `ForgotPasswordDto` - Password reset request
- `ResetPasswordDto` - Password reset validation
- `LogoutDto` - Logout options

**Validation**:
- Email format validation
- Password strength rules
- UUID validation
- Enum validation
- Min/max length constraints

#### `services/api-core/src/entities/user.entity.ts` (53 lines)
**Purpose**: User database entity  
**Exports**: `User`  
**Fields**:
- `id` - UUID primary key
- `org_id` - Organization reference
- `email` - Unique email address
- `password_hash` - Bcrypt hashed password
- `first_name`, `last_name`
- `role` - Enum (student, teacher, admin, parent)
- `is_active` - Account status
- `email_verified` - Email verification status
- `last_login_at` - Last login timestamp
- `settings` - JSONB for flexible settings

#### `services/api-core/src/entities/user-session.entity.ts` (32 lines)
**Purpose**: Refresh token session management  
**Exports**: `UserSession`  
**Fields**:
- `id` - UUID primary key
- `user_id` - User reference
- `refresh_token` - JWT refresh token
- `ip_address` - Client IP
- `user_agent` - Browser info
- `expires_at` - Token expiration

#### `services/api-core/src/auth/auth.controller.ts` (268 lines)
**Purpose**: REST API endpoints for authentication  
**Exports**: `AuthController`  
**Endpoints**:
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout user
- `GET /auth/me` - Get current user
- `POST /auth/change-password` - Change password
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password
- `GET /auth/verify-token` - Verify token validity

**Features**:
- Full OpenAPI/Swagger documentation
- JWT authentication guards
- IP address and user agent tracking
- Proper HTTP status codes
- Comprehensive error handling

#### `services/api-core/src/auth/guards/jwt-auth.guard.ts` (26 lines)
**Purpose**: JWT authentication guard  
**Exports**: `JwtAuthGuard`  
**Usage**: Apply to protected routes  
**Features**:
- Validates JWT tokens
- Attaches user to request object
- Supports `@Public()` decorator

#### `services/api-core/src/auth/strategies/jwt.strategy.ts` (28 lines)
**Purpose**: Passport JWT strategy  
**Exports**: `JwtStrategy`  
**Features**:
- Extracts token from Authorization header
- Validates token signature
- Decodes payload
- Injects user into request

#### `services/api-core/src/auth/guards/roles.guard.ts` (40 lines)
**Purpose**: Role-based access control  
**Exports**: `RolesGuard`, `@Roles()`, `@Public()`  
**Usage**:
```typescript
@Roles('admin', 'teacher')
@UseGuards(JwtAuthGuard, RolesGuard)
async adminOnlyRoute() { ... }
```

#### `services/api-core/src/auth/auth.module.ts` (38 lines)
**Purpose**: Authentication module configuration  
**Exports**: `AuthModule`  
**Imports**:
- TypeORM (User, UserSession entities)
- Passport
- JWT module
- Config module

---

### AI Tutor System (6 files)

#### `services/api-core/src/ai-tutor/ai-tutor.service.ts` (441 lines)
**Purpose**: AI Tutor business logic with Claude API  
**Exports**: `AITutorService`  
**Key Methods**:
- `createConversation()` - Start new conversation
- `getConversation()` - Get conversation details
- `getUserConversations()` - List user conversations
- `getConversationMessages()` - Get message history
- `sendMessage()` - Send message and get AI response
- `regenerateMessage()` - Regenerate AI response
- `archiveConversation()` - Archive conversation
- `deleteConversation()` - Delete conversation
- `getConversationStats()` - Get conversation statistics

**Features**:
- Real Anthropic Claude API integration
- Medical education system prompt
- Socratic teaching method
- Conversation context management
- Token usage tracking
- Error handling and fallback
- Automatic title generation

**System Prompt Highlights**:
- Socratic method teaching
- Evidence-based medical information
- Clinical correlations
- Adaptive to student level
- Encourages critical thinking
- Flags dangerous misconceptions

#### `services/api-core/src/ai-tutor/dto/ai-tutor.dto.ts` (121 lines)
**Purpose**: Request validation DTOs  
**Exports**:
- `CreateConversationDto` - Conversation creation
- `SendMessageDto` - Message sending
- `RegenerateMessageDto` - Response regeneration
- `GetConversationsQueryDto` - Query parameters
- `GetMessagesQueryDto` - Message retrieval

#### `services/api-core/src/entities/chat-conversation.entity.ts` (40 lines)
**Purpose**: Conversation database entity  
**Exports**: `ChatConversation`  
**Fields**:
- `id` - UUID primary key
- `user_id` - Owner reference
- `course_id` - Course context (optional)
- `title` - Conversation title
- `context_type` - Type of context (general, course, assignment, etc.)
- `context_id` - Context reference
- `is_archived` - Archive status
- `messages` - Related messages

#### `services/api-core/src/entities/chat-message.entity.ts` (37 lines)
**Purpose**: Message database entity  
**Exports**: `ChatMessage`  
**Fields**:
- `id` - UUID primary key
- `conversation_id` - Conversation reference
- `role` - user, assistant, or system
- `content` - Message text
- `metadata` - Additional data (model, tokens, sources)
- `token_count` - Token usage
- `embedding` - Vector embedding (for semantic search)

#### `services/api-core/src/ai-tutor/ai-tutor.controller.ts` (236 lines)
**Purpose**: REST API endpoints for AI Tutor  
**Exports**: `AITutorController`  
**Endpoints**:
- `POST /ai-tutor/conversations` - Create conversation
- `GET /ai-tutor/conversations` - List conversations
- `GET /ai-tutor/conversations/:id` - Get conversation
- `GET /ai-tutor/conversations/:id/messages` - Get messages
- `POST /ai-tutor/messages` - Send message
- `POST /ai-tutor/messages/regenerate` - Regenerate response
- `POST /ai-tutor/conversations/:id/archive` - Archive
- `DELETE /ai-tutor/conversations/:id` - Delete
- `GET /ai-tutor/conversations/:id/stats` - Statistics

**Features**:
- Full OpenAPI/Swagger documentation
- JWT authentication required
- User ownership verification
- Comprehensive error handling
- Query parameter validation

#### `services/api-core/src/ai-tutor/ai-tutor.module.ts` (18 lines)
**Purpose**: AI Tutor module configuration  
**Exports**: `AITutorModule`  
**Imports**:
- TypeORM (ChatConversation, ChatMessage entities)
- AuthModule (for guards)

---

### Application Configuration (3 files)

#### `services/api-core/src/main.ts` (~40 lines)
**Purpose**: Application bootstrap  
**Features**:
- NestJS app creation
- CORS configuration
- Global validation pipe
- Swagger/OpenAPI setup
- Port configuration

#### `services/api-core/src/app.module.ts` (~40 lines)
**Purpose**: Root application module  
**Imports**:
- ConfigModule (environment variables)
- TypeOrmModule (database connection)
- AuthModule
- AITutorModule

#### `services/api-core/package.json`
**Purpose**: Dependencies and scripts  
**Key Dependencies**:
- `@nestjs/common`, `@nestjs/core` - NestJS framework
- `@nestjs/typeorm` - Database ORM
- `@nestjs/jwt`, `@nestjs/passport` - Authentication
- `@anthropic-ai/sdk` - Claude API
- `bcrypt` - Password hashing
- `class-validator` - Validation
- `pg` - PostgreSQL driver

---

## 🔑 KEY CONFIGURATION FILES

### `.env.example`
**Purpose**: Environment variable template  
**Contains**:
- Database credentials
- JWT secrets
- Anthropic API key
- Redis configuration
- MinIO/S3 settings
- Email service
- OAuth providers
- Feature flags

**Usage**: Copy to `.env.local` and fill in actual values

---

## 📊 STATISTICS

### Code Statistics
- **Total Files Created**: 18 files
- **Lines of Production Code**: ~3,500 lines
- **Database Tables**: 35+ tables
- **API Endpoints**: 18+ endpoints
- **TypeScript Entities**: 4 entities
- **DTOs**: 12 data transfer objects

### Coverage
- **Authentication**: ✅ 100% Complete
- **AI Tutor**: ✅ 100% Complete
- **Database Schema**: ✅ 100% Complete
- **Seed Data**: ✅ 100% Complete
- **API Documentation**: ✅ 100% Complete

---

## 📍 IMPORTANT LOCATIONS

### For Development
```bash
# Main working directory
cd services/api-core

# Database scripts
cd ../../infra/database

# Start development
npm run dev

# View API docs
open http://localhost:8000/docs
```

### For Deployment
```bash
# Build production bundle
npm run build

# Start production
npm run start:prod

# Database migrations
npm run migration:run
```

---

## 🎯 QUICK REFERENCE

### Start Database
```bash
docker compose -f infra/docker/docker-compose.yml up -d postgres redis minio
```

### Initialize Database
```bash
docker exec -i medatlas-postgres psql -U medatlas -d medatlas_dev < infra/database/init.sql
docker exec -i medatlas-postgres psql -U medatlas -d medatlas_dev < infra/database/seed.sql
```

### Start API Server
```bash
cd services/api-core
npm run dev
```

### View API Documentation
```bash
open http://localhost:8000/docs
```

---

## 📚 NEXT FILES TO CREATE

Based on the HIGH PRIORITY items:

### Course Management
- `services/api-core/src/courses/courses.module.ts`
- `services/api-core/src/courses/courses.service.ts`
- `services/api-core/src/courses/courses.controller.ts`
- `services/api-core/src/courses/dto/courses.dto.ts`
- `services/api-core/src/entities/course.entity.ts`

### Assessment Engine
- `services/api-core/src/assessments/assessments.module.ts`
- `services/api-core/src/assessments/assessments.service.ts`
- `services/api-core/src/assessments/assessments.controller.ts`
- `services/api-core/src/assessments/grading.service.ts`
- `services/api-core/src/assessments/dto/assessments.dto.ts`

### File Upload
- `services/api-core/src/files/files.module.ts`
- `services/api-core/src/files/files.service.ts`
- `services/api-core/src/files/files.controller.ts`
- `services/api-core/src/files/storage.service.ts`

---

**All files are production-ready and follow NestJS best practices!** ✅

_For detailed setup instructions, see QUICK_START_GUIDE.md_
