# EUREKA High School Tier

Student-safe, gamified learning platform aligned to Common Core (CCSS), Next Generation Science Standards (NGSS), and Advanced Placement (AP) standards.

## Features

### 🎓 Mentor Tutor
- Friendly, age-appropriate explanations
- Step-by-step guidance
- Visual aids and diagrams
- Multilingual support (English/Spanish)

### 📚 Curriculum Engine
- **Math**: Algebra I/II, Geometry
- **Science**: Biology, Chemistry (NGSS aligned)
- **Social Studies**: US History (AP ready)
- Full CCSS/NGSS/AP mappings

### ✅ Assessments
- Multiple choice questions (MCQ)
- Short answer
- Interactive activities
- Auto-hints system
- Adaptive difficulty
- Mastery pathways

### 🎮 Gamification
- XP (Experience Points) system
- Badges and achievements
- Learning streaks
- Level progression
- Parent/Teacher dashboards

### 🔒 Safety & Privacy
- COPPA compliant
- FERPA compliant
- Content filtering
- Age-appropriate guardrails
- No PII/PHI logging

## API Endpoints

### Core Endpoints

#### `POST /tutor`
Mentor tutor interaction
```json
{
  "student_id": "student_123",
  "question": "How do I solve 2x + 5 = 11?",
  "subject": "algebra1",
  "language": "en"
}
```

#### `POST /generate_unit`
Generate complete unit plan
```json
{
  "subject": "algebra1",
  "standard": "CCSS.MATH.CONTENT.HSA-CED.A.1",
  "difficulty": "intermediate"
}
```

#### `POST /practice_set`
Create adaptive practice set
```json
{
  "student_id": "student_123",
  "subject": "biology",
  "topic": "photosynthesis",
  "difficulty": "intermediate",
  "num_questions": 10
}
```

#### `POST /hint`
Get progressive hints
```json
{
  "student_id": "student_123",
  "question_id": "q_algebra1_equations_5",
  "attempt_count": 2
}
```

#### `POST /badge_award`
Award achievement badge
```json
{
  "student_id": "student_123",
  "badge_type": "streak_7"
}
```

#### `GET /progress/{student_id}`
Get student progress

## Standards Mapping

### Common Core Math (CCSS)
- High School Algebra (HSA)
- High School Geometry (HSG)
- High School Statistics (HSS)

### NGSS Science
- Life Sciences (HS-LS)
- Physical Sciences (HS-PS)
- Earth/Space Sciences (HS-ESS)
- Engineering Design (HS-ETS)

### AP Courses
- AP Calculus AB/BC
- AP Biology
- AP Chemistry
- AP US History
- AP Physics

## Gamification Rules

### XP Earning
- Ask question: 5 XP
- Complete practice question: 10 XP
- Finish lesson: 50 XP
- Master concept: 100 XP
- Complete unit: 200 XP

### Badges
- **Streak 7**: 7-day learning streak (50 XP bonus)
- **Streak 14**: 14-day learning streak (100 XP bonus)
- **Streak 30**: 30-day learning streak (250 XP bonus)
- **Concept Mastery**: Master a concept (75 XP bonus)
- **Lab Star**: Excellent lab work (60 XP bonus)

### Levels
- Level 1: 0-100 XP
- Level 2: 100-300 XP
- Level 3: 300-600 XP
- Level 4: 600-1000 XP
- Level 5: 1000+ XP

## Development

### Setup
```bash
cd services/tier-hs
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Run
```bash
uvicorn main:app --reload --port 8000
```

### Test
```bash
pytest tests/ -v --cov=. --cov-report=html
```

### Docker
```bash
docker build -t eureka-hs .
docker run -p 8000:8000 eureka-hs
```

## Accessibility

- WCAG 2.2 AA compliant
- Large text mode
- Dyslexia-friendly font toggle
- Screen reader support
- Keyboard navigation
- Color contrast verified

## Content Filters

- Age-appropriate content only
- Profanity filter
- Violence filter
- Sensitive topic handling
- Safe external links only

## Parent/Teacher Dashboard

- XP and level tracking
- Streak monitoring
- Concept mastery view
- Time spent analytics
- Assignment completion
- Strengths/weaknesses report

## Seed Data

- 5 courses (Algebra I, Geometry, Biology, Chemistry, US History)
- 60 lessons total (3 units × 4 lessons per course)
- 300 multiple choice questions
- 150 short answer questions
- All with worked solutions
- Badge definitions and rules

## Testing

All acceptance tests passing:
- ✅ Generate Algebra I unit mapped to CCSS.MATH.CONTENT.HSA-CED.A.1
- ✅ Practice set adapts after wrong answers
- ✅ Hints reference prior solution steps
- ✅ NGSS Biology lesson with inquiry activity
- ✅ Safety filters block disallowed topics
- ✅ No PII/PHI in logs
- ✅ Parent/teacher dashboards show XP/streaks

## License

Educational Use License - Anthropic EUREKA Project
