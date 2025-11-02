# EUREKA Pedagogical Intelligence Layer

**Advanced learner cognitive modeling with DKT, IRT, metacognition coaching, and adaptive persona.**

## Overview

The Pedagogical Intelligence Layer provides sophisticated cognitive modeling and adaptive learning support for the EUREKA platform. It combines multiple machine learning approaches to track learner knowledge states, predict performance, and provide personalized guidance.

## Features

### 🧠 Cognitive Modeling
- **Deep Knowledge Tracing (DKT)**: GRU-based sequential model tracking concept mastery over time
- **Item Response Theory (IRT)**: 1PL/2PL/3PL models for ability estimation and item calibration
- **Forgetting Curve**: Ebbinghaus-based memory modeling with spaced repetition scheduling

### 🔒 Safety & Ethics
- **Compliance Sanitization**: PII/PHI detection and redaction
- **Ethics Checking**: Bias detection, sentiment analysis, pedagogical language validation
- **Audit Logging**: All guardrail triggers logged for review

### 📊 Capabilities
- Real-time mastery probability estimation (DKT AUC target: ≥0.72)
- Learner ability estimation with cold-start handling
- Spaced repetition scheduling with urgency scoring
- Personalized learning recommendations

## Architecture

```
services/pedagogy/
├── app/
│   ├── api/v1/          # FastAPI endpoints
│   │   └── cognitive.py  # /cog/state, /cog/update, /predict
│   ├── core/            # Configuration & guardrails
│   │   ├── config.py    # Settings
│   │   ├── compliance.py # PII/profanity filtering
│   │   └── ethics.py    # Bias/sentiment checking
│   ├── models/          # ML models
│   │   ├── dkt.py       # Deep Knowledge Tracing (GRU)
│   │   ├── irt.py       # Item Response Theory (1PL/2PL/3PL)
│   │   └── forgetting.py # Forgetting curve + spaced repetition
│   └── services/        # Business logic layer
├── tests/               # Unit & integration tests
├── main.py             # FastAPI application
├── requirements.txt    # Python dependencies
└── Dockerfile          # Container definition
```

## API Endpoints

### Cognitive Modeling

#### `GET /api/v1/cog/state`
Get current cognitive state for a learner.

**Parameters:**
- `learner_id` (str): Unique learner identifier
- `include_predictions` (bool): Include next-item predictions
- `num_concepts` (int): Number of concepts in curriculum

**Response:**
```json
{
  "learner_id": "learner_123",
  "mastery_state": {"0": 0.85, "1": 0.62, "2": 0.91},
  "ability_estimate": 1.24,
  "next_item_predictions": {"0": 0.88, "1": 0.65},
  "spaced_repetition": [...],
  "last_updated": "2025-11-02T10:30:00Z",
  "total_practices": 45
}
```

#### `POST /api/v1/cog/update`
Update cognitive state based on practice sequence.

**Request:**
```json
{
  "learner_id": "learner_123",
  "practice_sequence": [
    {"concept_id": 0, "is_correct": true, "difficulty_rating": 3},
    {"concept_id": 1, "is_correct": false, "difficulty_rating": 5}
  ],
  "num_concepts": 50
}
```

**Response:**
```json
{
  "learner_id": "learner_123",
  "updated": true,
  "new_mastery": {"0": 0.87, "1": 0.58},
  "new_ability": 1.18,
  "recommendations": [
    "Focus on concepts: 1, 3, 5 (mastery < 60%)",
    "Excellent progress on concept 0!"
  ]
}
```

#### `GET /api/v1/cog/predict`
Predict probability of correctness for next item.

**Parameters:**
- `learner_id` (str)
- `concept_id` (int)
- `num_concepts` (int)

**Response:**
```json
{
  "learner_id": "learner_123",
  "concept_id": 0,
  "probability": 0.85,
  "method": "DKT",
  "confidence": "high"
}
```

## ML Models

### Deep Knowledge Tracing (DKT)

**Architecture:**
- Input: Sequence of (concept_id, correctness) pairs
- Encoder: Linear embedding → GRU (2 layers, 128 hidden) → Dropout
- Output: Sigmoid activation for mastery probability per concept

**Performance Target:**
- AUC ≥ 0.72 on next-item prediction

**Features:**
- Handles variable-length sequences
- Captures inter-concept dependencies
- Supports cold-start with neutral priors

### Item Response Theory (IRT)

**Supported Models:**
- **1PL (Rasch)**: P(θ) = σ(θ - b)
- **2PL**: P(θ) = σ(a(θ - b))
- **3PL**: P(θ) = c + (1-c)σ(a(θ - b))

Where:
- θ = learner ability
- a = item discrimination
- b = item difficulty
- c = guessing parameter
- σ = logistic sigmoid

**Estimation:**
- MLE or MAP (with N(0,1) prior)
- BFGS optimization
- Cold-start prior: θ = 0.0 (average ability)

### Forgetting Curve

**Model:**
- R(t) = e^(-t/S)
- R(t) = retention probability at time t
- S = memory strength (updated after each review)
- t = days since last review

**Spaced Repetition:**
- Next review scheduled when R(t) = min_retention (default 0.7)
- Strength increases with successful reviews
- Difficulty rating modulates strength boost

## Configuration

Key settings in `app/core/config.py`:

```python
# DKT
DKT_HIDDEN_DIM = 128
DKT_NUM_LAYERS = 2
DKT_MIN_AUC = 0.72

# IRT
IRT_MODEL_TYPE = "2PL"  # or "1PL", "3PL"
IRT_COLD_START_PRIOR = 0.0

# Forgetting Curve
FORGETTING_INITIAL_STRENGTH = 1.0
FORGETTING_DECAY_RATE = 0.5
FORGETTING_MIN_INTERVAL_DAYS = 1
```

## Running the Service

### Local Development

```bash
# Install dependencies
pip install -r requirements.txt

# Run service
python main.py
# or
uvicorn main:app --host 0.0.0.0 --port 8040 --reload
```

### Docker

```bash
# Build
docker build -t eureka-pedagogy .

# Run
docker run -p 8040:8040 eureka-pedagogy
```

### With Docker Compose

Add to `docker-compose.yml`:

```yaml
pedagogy:
  build:
    context: ./services/pedagogy
  container_name: eureka-pedagogy
  environment:
    DATABASE_URL: postgresql+asyncpg://eureka:password@db:5432/eureka
    REDIS_URL: redis://redis:6379/9
  ports:
    - "8040:8040"
  depends_on:
    - db
    - redis
```

## Testing

```bash
# Run all tests
pytest

# With coverage
pytest --cov=app --cov-report=html

# Specific test file
pytest tests/test_dkt.py -v
```

## Compliance & Safety

All user inputs and AI outputs pass through guardrails:

### Compliance Sanitizer
- Detects and redacts PII (email, phone, SSN, credit cards)
- Filters profanity
- Removes credentials/API keys

### Ethics Checker
- Detects bias and stereotyping keywords
- Sentiment analysis (flags overly negative content)
- Checks for prescriptive/manipulative language
- Validates growth-oriented pedagogical framing

**Usage:**
```python
from app.core.compliance import compliance
from app.core.ethics import ethics

# Sanitize input
result = compliance.sanitize(user_input)
safe_text = result['sanitized_text']

# Check ethics
ethics_result = ethics.check(ai_output, context='recommendation')
if not ethics_result['is_ethical']:
    # Log concerns and request regeneration
    pass
```

## Performance

### Expected Metrics
- DKT next-item prediction AUC: ≥0.72
- IRT ability estimation converges in <10 items
- API response time: <200ms (cognitive state)
- API response time: <500ms (update with DKT inference)

### Optimization Tips
- Cache DKT models per curriculum size
- Batch process multiple learners
- Use Redis for session state
- Pre-compute IRT item parameters

## Roadmap

### Phase 1 (Current)
- ✅ DKT model implementation
- ✅ IRT model (1PL/2PL/3PL)
- ✅ Forgetting curve + spaced repetition
- ✅ Cognitive API endpoints
- ✅ Compliance & ethics guardrails

### Phase 2 (Next)
- ⏳ Metacognition coach with prompts
- ⏳ Adaptive persona/tone system
- ⏳ UI widgets (Progress Radar, Metacog Coach, Learning Diary)
- ⏳ Comprehensive test suite (≥80% coverage)
- ⏳ Database persistence (PostgreSQL)

### Phase 3 (Future)
- Multi-agent integration
- Federated learning stubs
- Advanced visualizations
- A/B testing framework

## References

### Deep Knowledge Tracing
- Piech et al. (2015). "Deep Knowledge Tracing." NeurIPS.
- https://arxiv.org/abs/1506.05908

### Item Response Theory
- Lord, F. M. (1980). "Applications of Item Response Theory to Practical Testing Problems."
- Embretson, S. E., & Reise, S. P. (2000). "Item Response Theory for Psychologists."

### Forgetting Curve
- Ebbinghaus, H. (1885). "Memory: A Contribution to Experimental Psychology."
- Wozniak, P., & Gorzelanczyk, E. J. (1994). "Optimization of repetition spacing in the practice of learning."

## Support

For issues or questions:
- GitHub Issues: https://github.com/alovladi007/EUREKA/issues
- Documentation: `/docs` endpoint when service is running
- API Docs: http://localhost:8040/docs

## License

Part of the EUREKA platform. See main repository for license information.
