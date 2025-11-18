# EUREKA AI Tutor - Comprehensive STEM Expert System

An advanced AI-powered tutoring system with expert-level intelligence in **Mathematics, Science, Engineering, and Technology (STEM)**. Features include RAG (Retrieval Augmented Generation), code execution, equation solving, and adaptive learning.

## 🌟 Key Features

### 🎓 Multi-Subject Expertise
- **Mathematics**: Algebra, Calculus, Linear Algebra, Statistics, Differential Equations
- **Physics**: Mechanics, Electromagnetism, Thermodynamics, Quantum Mechanics
- **Chemistry**: General, Organic, Inorganic, Physical Chemistry
- **Biology**: Cell Biology, Genetics, Ecology, Systems Biology
- **Computer Science**: Algorithms, Data Structures, Machine Learning, AI
- **Engineering**: Mechanical, Electrical, Civil, Software Engineering

### 🤖 Advanced AI Capabilities

#### RAG System (Retrieval Augmented Generation)
- Vector similarity search with 1536-dimensional embeddings
- Context-aware responses using relevant knowledge base
- Automatic knowledge retrieval for accurate answers

#### Code Execution Sandbox
- **Supported Languages**: Python, JavaScript/Node.js
- Secure sandboxed execution environment
- Real-time code output and error handling
- 5-second timeout for safety
- Memory and resource limits

#### Mathematical Equation Solver
- Symbolic mathematics using SymPy
- Step-by-step solution explanations
- Support for algebraic, calculus, and linear algebra problems
- LaTeX equation rendering

#### Adaptive Learning
- Student knowledge modeling
- Difficulty level adaptation
- Progress tracking per topic
- Personalized recommendations

### 💬 Real-Time Chat
- WebSocket support for instant messaging
- Streaming responses from Claude AI
- Conversation history management
- Multi-turn contextual understanding

## 📋 Prerequisites

- **Node.js**: >= 18.0.0
- **Python**: >= 3.8 (for equation solving)
- **PostgreSQL**: >= 14 (with pgvector extension)
- **npm**: >= 9.0.0

### Python Dependencies
```bash
pip install sympy numpy scipy
```

## 🚀 Quick Start

### 1. Database Setup

```bash
# Run the AI Tutor migration
psql -d eureka -f ../../database/migrations/add-ai-tutor-comprehensive.sql
```

### 2. Install Dependencies

```bash
cd services/ai-tutor
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env
# Edit .env with your configuration
```

**Required Environment Variables:**
```bash
# AI API Keys (at least one required)
ANTHROPIC_API_KEY=sk-ant-api03-...    # Get from console.anthropic.com
OPENAI_API_KEY=sk-proj-...            # Get from platform.openai.com

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=eureka
DB_USER=postgres
DB_PASSWORD=your_password

# Server
PORT=3011
NODE_ENV=development
```

### 4. Seed Knowledge Base

```bash
npm run seed-knowledge
```

This will populate the knowledge base with:
- 20+ Mathematics concepts
- 15+ Physics principles
- 10+ Computer Science algorithms
- 5+ Chemistry fundamentals
- 5+ Engineering concepts

### 5. Start the Service

```bash
# Development mode with hot reload
npm run dev

# Production build
npm run build
npm start
```

Server will start on `http://localhost:3011`

## 📚 API Documentation

### Health Check

```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "service": "ai-tutor",
  "timestamp": "2024-01-15T10:00:00.000Z",
  "database": "connected",
  "ai_providers": {
    "anthropic": true,
    "openai": true
  }
}
```

### Session Management

#### Create Session

```http
POST /api/sessions
Authorization: Bearer <token>
Content-Type: application/json

{
  "subject_domain": "mathematics",
  "topic": "Calculus",
  "difficulty_level": "undergraduate",
  "session_type": "problem_solving"
}
```

**Subject Domains:**
- `mathematics`
- `physics`
- `chemistry`
- `biology`
- `computer_science`
- `electrical_engineering`
- `mechanical_engineering`
- `civil_engineering`
- `data_science`
- `artificial_intelligence`

**Difficulty Levels:**
- `elementary`
- `middle_school`
- `high_school`
- `undergraduate`
- `graduate`
- `expert`

#### Get User Sessions

```http
GET /api/sessions?subject_domain=mathematics&is_active=true
Authorization: Bearer <token>
```

#### End Session

```http
POST /api/sessions/:sessionId/end
Authorization: Bearer <token>
Content-Type: application/json

{
  "satisfaction_rating": 5,
  "feedback_text": "Very helpful!"
}
```

### Chat/Messaging

#### Send Message

```http
POST /api/sessions/:sessionId/message
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Explain the chain rule in calculus"
}
```

**Response includes:**
- AI-generated response
- RAG context used
- Tokens consumed
- Response time

#### Get Session Messages

```http
GET /api/sessions/:sessionId/messages
Authorization: Bearer <token>
```

### Code Execution

```http
POST /api/code/execute
Authorization: Bearer <token>
Content-Type: application/json

{
  "language": "python",
  "code": "def factorial(n):\n    return 1 if n <= 1 else n * factorial(n-1)\nprint(factorial(5))",
  "stdin": "",
  "session_id": "uuid"
}
```

**Supported Languages:**
- `python` / `python3`
- `javascript` / `js` / `node`

**Response:**
```json
{
  "success": true,
  "result": {
    "success": true,
    "stdout": "120\n",
    "stderr": "",
    "execution_time_ms": 45
  }
}
```

### Equation Solver

```http
POST /api/equations/solve
Authorization: Bearer <token>
Content-Type: application/json

{
  "equation": "x**2 - 5*x + 6",
  "variable": "x",
  "session_id": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "solution": {
    "steps": [...],
    "final_answer": "[2, 3]",
    "method_used": "symbolic"
  },
  "explanation": "To solve this quadratic equation..."
}
```

### Knowledge Search

```http
GET /api/knowledge/search?query=chain%20rule&subject_domain=mathematics&limit=5
Authorization: Bearer <token>
```

Returns relevant knowledge items from the database using vector similarity search.

### Student Knowledge State

```http
GET /api/knowledge/state?subject_domain=mathematics
Authorization: Bearer <token>
```

Returns the student's mastery levels, strengths, weaknesses, and recommendations.

## 🔌 WebSocket API

For real-time chat with streaming responses:

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3011');

// Join a session
socket.emit('join-session', sessionId);

// Send message
socket.emit('send-message', {
  sessionId: 'uuid',
  userId: 'uuid',
  content: 'Explain quantum entanglement'
});

// Listen for user messages
socket.on('user-message', (data) => {
  console.log('User:', data.content);
});

// Listen for AI response chunks (streaming)
socket.on('ai-response-start', () => {
  console.log('AI is thinking...');
});

socket.on('ai-response-chunk', (data) => {
  process.stdout.write(data.chunk); // Stream output
});

socket.on('ai-response-end', () => {
  console.log('\nResponse complete');
});

// Error handling
socket.on('error', (error) => {
  console.error('Error:', error.message);
});
```

## 🏗️ Architecture

### System Components

```
┌─────────────────────────────────────────────────┐
│              Frontend Chat UI                   │
│         (Next.js + Socket.IO Client)            │
└──────────────┬──────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────┐
│           AI Tutor API Service                  │
│  ┌───────────────────────────────────────────┐  │
│  │  Express.js + WebSocket Server            │  │
│  ├───────────────────────────────────────────┤  │
│  │  Session Management                       │  │
│  │  Message Handling                         │  │
│  │  RAG System                               │  │
│  │  Code Executor                            │  │
│  │  Equation Solver                          │  │
│  │  Student Modeler                          │  │
│  └───────────────────────────────────────────┘  │
└──────────────┬──────────────────────────────────┘
               │
               ├──────────┬──────────┬────────────┐
               ▼          ▼          ▼            ▼
       ┌─────────┐  ┌─────────┐  ┌──────┐  ┌─────────┐
       │PostgreSQL│  │ Claude  │  │OpenAI│  │ Python  │
       │+pgvector │  │   AI    │  │  API │  │ SymPy   │
       └─────────┘  └─────────┘  └──────┘  └─────────┘
```

### RAG Pipeline

```
User Query
    ↓
Generate Query Embedding (OpenAI)
    ↓
Vector Similarity Search (pgvector)
    ↓
Retrieve Top K Knowledge Items
    ↓
Build Enhanced Context
    ↓
Send to Claude with Context
    ↓
Generate Response
    ↓
Return to User
```

### Student Knowledge Model

The system tracks:
- **Mastery Score** (0-100) per topic
- **Success Rate** on problems
- **Learning Velocity** (rate of improvement)
- **Retention Score** (knowledge retention over time)
- **Prerequisite Gaps** (missing foundational knowledge)
- **Recommended Difficulty** level

## 🧪 Example Use Cases

### 1. Solve a Calculus Problem

**User:** "How do I find the derivative of f(x) = x^2 * sin(x)?"

**AI Tutor:**
1. Uses **RAG** to retrieve Product Rule and Chain Rule
2. Explains step-by-step solution
3. Shows mathematical notation in LaTeX
4. Provides final answer: f'(x) = 2x*sin(x) + x^2*cos(x)

### 2. Debug Programming Code

**User:** "My Python code has a recursion error. Can you help?"

**AI Tutor:**
1. Reviews code in **Code Executor**
2. Runs code safely in sandbox
3. Identifies stack overflow issue
4. Suggests iterative solution or memoization
5. Provides corrected code

### 3. Learn Physics Concept

**User:** "Explain Newton's Third Law with examples"

**AI Tutor:**
1. Retrieves knowledge from physics database
2. Explains: "For every action, there is an equal and opposite reaction"
3. Provides real-world examples (rocket propulsion, swimming)
4. Shows mathematical formulation
5. Suggests practice problems

### 4. Exam Preparation

**User:** "I have a Linear Algebra exam tomorrow. What should I focus on?"

**AI Tutor:**
1. Checks student's **knowledge state**
2. Identifies weak areas (eigenvalues, determinants)
3. Recommends focused study topics
4. Provides practice problems at appropriate difficulty
5. Tracks progress as student practices

## 🔒 Security

### Code Execution Safety
- ✅ Sandboxed environment (VM2 for JavaScript)
- ✅ 5-second execution timeout
- ✅ Memory limits (512MB)
- ✅ No file system access
- ✅ No network access
- ✅ Process isolation

### API Security
- ✅ JWT authentication required
- ✅ Rate limiting
- ✅ Input validation
- ✅ SQL injection prevention
- ✅ XSS protection (Helmet.js)

### Cost Controls
- ✅ Token limits per message
- ✅ Daily cost limits per user
- ✅ Session timeout (auto-close inactive sessions)

## 📊 Monitoring

### Metrics to Track

**Usage Metrics:**
- Active sessions per subject
- Messages per session
- Average response time
- RAG retrieval accuracy

**AI Metrics:**
- Tokens used per session
- Cost per user per day
- Model performance (response quality)
- Context relevance scores

**Student Metrics:**
- Knowledge mastery progression
- Topics studied
- Problems solved
- Learning velocity

### Logging

```javascript
// Session created
{
  "event": "session_created",
  "user_id": "uuid",
  "subject": "mathematics",
  "difficulty": "undergraduate"
}

// Message processed
{
  "event": "message_processed",
  "session_id": "uuid",
  "tokens_used": 1523,
  "response_time_ms": 2345,
  "rag_items_retrieved": 3
}

// Code executed
{
  "event": "code_executed",
  "language": "python",
  "success": true,
  "execution_time_ms": 42
}
```

## 🧠 Knowledge Base Management

### Add New Knowledge

```sql
INSERT INTO stem_knowledge_base (
  subject_domain, topic, subtopic, difficulty_level,
  title, content, content_type, equations, keywords, embedding
) VALUES (
  'mathematics',
  'Geometry',
  'Triangles',
  'high_school',
  'Pythagorean Theorem',
  'In a right triangle, a² + b² = c² where c is the hypotenuse',
  'theorem',
  ARRAY['a^2 + b^2 = c^2'],
  ARRAY['pythagorean', 'triangle', 'geometry'],
  '[0.123, 0.456, ...]'::vector
);
```

### Update Knowledge Quality

```sql
UPDATE stem_knowledge_base
SET quality_score = 0.98,
    is_verified = true,
    verified_by = 'expert-user-id'
WHERE id = 'knowledge-item-id';
```

## 🚀 Deployment

### Using Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install Python for equation solving
RUN apk add --no-cache python3 py3-pip
RUN pip3 install sympy numpy

COPY package*.json ./
RUN npm install --production

COPY . .
RUN npm run build

EXPOSE 3011

CMD ["npm", "start"]
```

### Using PM2

```bash
pm2 start dist/app.js --name ai-tutor \
  --instances 2 \
  --max-memory-restart 1G \
  --error-log logs/error.log \
  --out-log logs/out.log

pm2 save
pm2 startup
```

## 🐛 Troubleshooting

### Issue: RAG Not Finding Relevant Context

**Solution:**
1. Check if knowledge base is seeded: `SELECT COUNT(*) FROM stem_knowledge_base;`
2. Verify embeddings exist: `SELECT COUNT(*) FROM stem_knowledge_base WHERE embedding IS NOT NULL;`
3. Re-run seed script: `npm run seed-knowledge`

### Issue: Code Execution Timeout

**Solution:**
1. Increase timeout in `.env`: `MAX_EXECUTION_TIME_MS=10000`
2. Optimize code (reduce computational complexity)
3. Check for infinite loops

### Issue: Equation Solver Fails

**Solution:**
1. Verify Python and SymPy are installed: `python3 -c "import sympy; print(sympy.__version__)"`
2. Check equation syntax (use SymPy format)
3. Review error logs for Python exceptions

### Issue: High API Costs

**Solution:**
1. Enable cost limits in `.env`: `MAX_DAILY_COST_PER_USER=5.00`
2. Reduce `max_tokens` per request
3. Use Claude Haiku for simpler queries
4. Implement caching for common questions

## 📈 Performance Optimization

### Database Indexing

```sql
-- Ensure indexes exist
CREATE INDEX CONCURRENTLY idx_knowledge_embedding
  ON stem_knowledge_base USING ivfflat (embedding vector_cosine_ops);

CREATE INDEX CONCURRENTLY idx_messages_session
  ON ai_tutor_messages(session_id, created_at);

-- Analyze tables
ANALYZE stem_knowledge_base;
ANALYZE ai_tutor_sessions;
```

### Response Caching

```javascript
// Cache common queries (Redis recommended)
const cacheKey = `query:${subject}:${queryHash}`;
const cached = await redis.get(cacheKey);
if (cached) {
  return JSON.parse(cached);
}
```

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

Contributions welcome! Areas for improvement:
- Additional subject domains (Medicine, Law, Business)
- More programming languages for code execution
- Advanced equation solving (numerical methods, ODEs)
- Diagram generation
- Voice input/output
- Mobile app integration

## 📞 Support

- **Documentation**: /docs
- **Issues**: GitHub Issues
- **Email**: support@eureka.edu

---

**Built with ❤️ by the EUREKA Platform Team**

*Powered by Claude AI & OpenAI*
