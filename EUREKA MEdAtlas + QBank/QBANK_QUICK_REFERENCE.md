# Medical QBank - Quick Reference

## 📁 File Locations

```
medatlas/services/api-core/src/
├── qbank/
│   ├── qbank.module.ts              ✅ Module configuration
│   ├── qbank.service.ts             ✅ Core business logic (583 lines)
│   ├── qbank.controller.ts          ✅ 15 API endpoints (323 lines)
│   └── dto/
│       └── qbank.dto.ts             ✅ Validation DTOs (277 lines)
└── entities/
    ├── qbank-item.entity.ts         ✅ Question model (81 lines)
    ├── qbank-response.entity.ts     ✅ Answer tracking (38 lines)
    ├── assessment.entity.ts         ✅ Test model (67 lines)
    └── assessment-submission.entity.ts ✅ Test attempts (62 lines)
```

**Total: 8 files, ~1,700 lines of production code**

---

## 🚀 Quick Start

### 1. Add to App Module
```typescript
// src/app.module.ts
import { QBankModule } from './qbank/qbank.module';

@Module({
  imports: [
    // ... existing imports
    QBankModule,  // ← Add this
  ],
})
```

### 2. Restart Server
```bash
cd services/api-core
npm run dev
```

### 3. View API Docs
```
http://localhost:8000/docs
```
Look for "Medical QBank" tag

---

## 🎯 Key Endpoints

### Student Endpoints
```http
POST   /qbank/practice/start             # Start practice (20 questions)
POST   /qbank/practice/:id/answer        # Submit answer
POST   /qbank/practice/:id/submit        # Submit test
GET    /qbank/performance/by-topic       # See performance
GET    /qbank/performance/weak-areas     # Find weak topics
GET    /qbank/performance/statistics     # Overall stats
```

### Teacher Endpoints
```http
POST   /qbank/items                      # Create question
GET    /qbank/items                      # Browse questions
PUT    /qbank/items/:id                  # Update question
DELETE /qbank/items/:id                  # Delete question
```

---

## 💡 Usage Examples

### Start Practice (Student)
```bash
TOKEN="your-jwt-token"

curl -X POST http://localhost:8000/qbank/practice/start \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "mode": "tutor",
    "item_count": 20,
    "category": "Cardiology"
  }'
```

### Create Question (Teacher)
```bash
curl -X POST http://localhost:8000/qbank/items \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "org_id": "00000000-0000-0000-0000-000000000001",
    "item_type": "mcq",
    "stem": "45yo man with chest pain...",
    "options": [
      {"id": "a", "text": "LAD"},
      {"id": "b", "text": "LCx"},
      {"id": "c", "text": "RCA"},
      {"id": "d", "text": "LM"}
    ],
    "correct_answer": "c",
    "explanation": "ST elevation in II, III, aVF indicates inferior MI...",
    "category": "Cardiology",
    "subcategory": "Acute Coronary Syndrome",
    "tags": ["cardiology", "mi", "ecg"]
  }'
```

---

## 🎨 Frontend Components Needed

### 1. Practice Page
- **QuestionDisplay** - Show stem and options
- **AnswerSelector** - Radio buttons for MCQ
- **Timer** - Countdown for timed mode
- **Navigation** - Previous/Next/Flag buttons
- **ExplanationPanel** - Show after answer

### 2. Results Page
- **ScoreCard** - Show final score
- **QuestionReview** - Review all questions
- **ExplanationList** - Read all explanations

### 3. Analytics Dashboard
- **PerformanceChart** - Chart.js line chart
- **TopicBreakdown** - Bar chart by organ system
- **WeakAreasList** - List of weak topics
- **StatsSummary** - Cards with key metrics

---

## 🔍 Test with Demo Account

```bash
# Login as student
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ms1.student@stanford-demo.edu",
    "password": "Demo123!"
  }'

# Use the access_token for QBank requests
```

---

## 📊 Features Checklist

- [x] Create/edit/delete questions (RBAC protected)
- [x] Search and filter questions
- [x] Three practice modes (tutor/timed/test)
- [x] IRT difficulty parameters
- [x] Performance analytics by topic
- [x] Weak area identification
- [x] Study recommendations
- [x] Session management
- [x] Answer validation
- [x] Complete API documentation

---

## 🎓 Question Types Supported

1. **MCQ** - Single best answer
2. **Multiple Select** - Select all that apply
3. **True/False** - Binary choice
4. **Short Answer** - Text matching
5. **Essay** - Long-form (for manual/AI grading)

---

## 🏥 Medical Categories

- Cardiology
- Pulmonology
- Gastroenterology
- Neurology
- Endocrinology
- Hematology/Oncology
- Renal/Genitourinary
- Musculoskeletal
- Dermatology
- Psychiatry
- Infectious Disease
- Immunology

---

## ⚡ Quick Commands

```bash
# View all QBank endpoints
http://localhost:8000/docs#/Medical%20QBank

# Get categories
curl http://localhost:8000/qbank/categories \
  -H "Authorization: Bearer $TOKEN"

# Get your stats
curl http://localhost:8000/qbank/performance/statistics \
  -H "Authorization: Bearer $TOKEN"

# Get weak areas
curl http://localhost:8000/qbank/performance/weak-areas \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🎯 Next Steps

1. **Test all endpoints** - Use Swagger UI or curl
2. **Build frontend** - Create practice page
3. **Add more questions** - Seed more sample data
4. **Build Clinical Cases** - Next module (virtual patients)
5. **Build OSCE** - Clinical skills assessment

---

## ✅ Status

**QBank Engine: COMPLETE** ✅  
**Progress: 60% → 65%** 🎉  
**Ready for**: Frontend integration and testing

---

_For detailed documentation, see: QBANK_COMPLETE_DOCUMENTATION.md_
