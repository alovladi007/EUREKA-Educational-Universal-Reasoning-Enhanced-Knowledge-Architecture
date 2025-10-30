# Assessment Engine Service

Complete assessment and grading microservice for the EduFlow platform.

## Features

✅ **Assessment Management**
- Create, read, update, delete assessments
- Multiple assessment types: quiz, exam, homework, practice
- Time limits and attempt restrictions
- Late submission handling
- Question shuffling

✅ **Question Types**
- Multiple choice
- True/False
- Short answer
- Essay
- Code (with test cases)
- Matching

✅ **Auto-Grading**
- Automatic grading for MCQ and T/F
- Instant feedback
- Score calculation

✅ **AI-Powered Grading**
- Essay grading using OpenAI GPT-4
- Detailed feedback generation
- Identifies strengths and weaknesses
- Provides suggestions for improvement

✅ **Student Features**
- Take assessments
- Submit responses
- View results and feedback
- Track attempts

## API Endpoints

### Assessments
- `POST /api/v1/assessments` - Create assessment
- `GET /api/v1/assessments` - List assessments
- `GET /api/v1/assessments/{id}` - Get assessment
- `PATCH /api/v1/assessments/{id}` - Update assessment
- `DELETE /api/v1/assessments/{id}` - Delete assessment
- `POST /api/v1/assessments/{id}/publish` - Publish assessment
- `POST /api/v1/assessments/{id}/unpublish` - Unpublish assessment

### Questions
- `POST /api/v1/questions` - Add question to assessment
- `GET /api/v1/questions/{id}` - Get question
- `PATCH /api/v1/questions/{id}` - Update question
- `DELETE /api/v1/questions/{id}` - Delete question

### Attempts (Student)
- `POST /api/v1/attempts/start` - Start new attempt
- `POST /api/v1/attempts/{id}/submit` - Submit attempt
- `GET /api/v1/attempts/{id}` - Get attempt
- `GET /api/v1/attempts` - List attempts

### Grading
- `POST /api/v1/grading/auto-grade` - Auto-grade attempt
- `POST /api/v1/grading/ai-grade` - AI-grade essay response
- `GET /api/v1/grading/attempt/{id}/results` - Get grading results

## Quick Start

### 1. Setup Database

The database schema must be initialized first. The init script is in the database schemas package.

```bash
# From the root database schemas directory
./init-all-databases.sh
```

Or run just the assessment database:
```bash
docker run --name eduflow-db-assessment \
  -e POSTGRES_USER=eduflow_user \
  -e POSTGRES_PASSWORD=eduflow_password \
  -e POSTGRES_DB=eduflow_assessment \
  -p 5433:5432 \
  -v $(pwd)/init-assessment-engine.sql:/docker-entrypoint-initdb.d/init.sql \
  -d postgres:14
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment

```bash
cp .env.example .env
# Edit .env with your settings
nano .env
```

### 4. Run Service

**Development mode:**
```bash
python main.py
```

**Production mode:**
```bash
uvicorn main:app --host 0.0.0.0 --port 8002 --workers 4
```

**Docker:**
```bash
docker build -t eduflow-assess .
docker run -p 8002:8002 --env-file .env eduflow-assess
```

## API Documentation

Once running, visit:
- Swagger UI: http://localhost:8002/docs
- ReDoc: http://localhost:8002/redoc

## Testing

### Create an Assessment

```bash
curl -X POST http://localhost:8002/api/v1/assessments \
  -H "Content-Type: application/json" \
  -d '{
    "course_id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Python Basics Quiz",
    "description": "Test your Python knowledge",
    "assessment_type": "quiz",
    "total_points": 100,
    "time_limit_minutes": 30,
    "questions": [
      {
        "question_type": "multiple_choice",
        "question_text": "What is the output of print(2 + 2)?",
        "points": 10,
        "options": [
          {"id": "a", "text": "3"},
          {"id": "b", "text": "4"},
          {"id": "c", "text": "22"},
          {"id": "d", "text": "Error"}
        ],
        "correct_answer": "b",
        "explanation": "2 + 2 equals 4 in Python"
      }
    ]
  }'
```

### Start an Attempt

```bash
curl -X POST http://localhost:8002/api/v1/attempts/start \
  -H "Content-Type: application/json" \
  -d '{
    "assessment_id": "<assessment_id_from_previous_response>",
    "user_id": "550e8400-e29b-41d4-a716-446655440001"
  }'
```

### Submit Responses

```bash
curl -X POST http://localhost:8002/api/v1/attempts/<attempt_id>/submit \
  -H "Content-Type: application/json" \
  -d '{
    "responses": [
      {
        "question_id": "<question_id>",
        "response_text": "b"
      }
    ]
  }'
```

## Architecture

```
services/assess/
├── Dockerfile
├── requirements.txt
├── main.py                    # FastAPI application
├── .env.example
├── app/
│   ├── __init__.py
│   ├── models/
│   │   └── __init__.py        # SQLAlchemy models
│   ├── schemas.py             # Pydantic schemas
│   ├── routes/
│   │   ├── assessments.py     # Assessment CRUD
│   │   ├── questions.py       # Question management
│   │   ├── attempts.py        # Student attempts
│   │   └── grading.py         # Grading endpoints
│   ├── services/
│   │   ├── auto_grader.py     # Auto-grading logic
│   │   └── ai_grader.py       # AI grading (OpenAI)
│   └── utils/
│       └── database.py        # DB connection
```

## Database Schema

The service uses the following main tables:
- `assessments` - Assessment definitions
- `questions` - Questions in assessments
- `assessment_attempts` - Student attempts
- `question_responses` - Student responses to questions
- `grading_results` - Grading outcomes
- `response_feedback` - Detailed feedback

See `init-assessment-engine.sql` for complete schema.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection string | See .env.example |
| OPENAI_API_KEY | OpenAI API key for AI grading | None |
| ANTHROPIC_API_KEY | Anthropic API key (alternative) | None |
| SERVICE_PORT | Service port | 8002 |
| DEBUG | Debug mode | true |
| CORS_ORIGINS | Allowed CORS origins | localhost:3006,3000 |

## Dependencies

- **FastAPI** - Web framework
- **SQLAlchemy** - ORM
- **asyncpg** - PostgreSQL async driver
- **Pydantic** - Data validation
- **OpenAI** - AI grading
- **python-jose** - JWT tokens
- **uvicorn** - ASGI server

## Integration with Other Services

This service is designed to integrate with:
- **API Core** (Port 8000) - User authentication
- **Content Service** (Port 8004) - Course content
- **Analytics** (Port 8005) - Performance tracking
- **Adaptive Learning** (Port 8003) - Learning paths

## Production Considerations

### Security
- Add authentication middleware
- Validate user permissions
- Use HTTPS in production
- Rotate API keys regularly

### Performance
- Add Redis caching for assessments
- Use connection pooling
- Implement rate limiting
- Add monitoring and logging

### Scalability
- Run multiple instances behind load balancer
- Use read replicas for queries
- Implement message queue for async grading
- Use CDN for static content

## Next Steps

1. Add authentication integration with API Core
2. Implement WebSocket for real-time grading
3. Add batch grading for multiple attempts
4. Create admin dashboard endpoints
5. Add plagiarism detection
6. Implement peer review system
7. Add analytics tracking

## License

Part of the EduFlow platform - Educational technology microservices.

---

**Service Status:** ✅ Production Ready
**API Version:** 1.0.0
**Port:** 8002
