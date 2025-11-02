# Clinical Cases Module - Quick Reference

## 📁 File Locations

```
medatlas/services/api-core/src/
├── cases/
│   ├── cases.module.ts              ✅ Module configuration (18 lines)
│   ├── cases.service.ts             ✅ Business logic (1,086 lines)
│   ├── cases.controller.ts          ✅ 20+ API endpoints (488 lines)
│   └── dto/
│       └── cases.dto.ts             ✅ Validation DTOs (446 lines)
└── entities/
    ├── case.entity.ts               ✅ Case model (347 lines)
    └── case-session.entity.ts       ✅ Session tracking (228 lines)
```

**Total: 5 files, ~2,600 lines of production code**

---

## 🚀 Quick Start

### 1. Add to App Module
```typescript
// src/app.module.ts
import { CasesModule } from './cases/cases.module';

@Module({
  imports: [
    // ... existing imports
    CasesModule,  // ← Add this
  ],
})
```

### 2. View API Docs
```
http://localhost:8000/docs
```
Look for "Clinical Cases" tag

---

## 🎯 Key Endpoints

### Students
```http
GET    /cases                          # Browse cases
POST   /cases/sessions/start           # Start session
POST   /cases/sessions/:id/actions     # Take action
POST   /cases/sessions/:id/diagnosis   # Submit diagnosis
POST   /cases/sessions/:id/management  # Submit management
POST   /cases/sessions/:id/complete    # Get results
GET    /cases/performance/mine         # My performance
```

### Faculty
```http
POST   /cases                          # Create case
PUT    /cases/:id                      # Update case
GET    /cases/:id/analytics            # View analytics
```

---

## 💡 Usage Examples

### Start a Case
```bash
curl -X POST http://localhost:8000/cases/sessions/start \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"caseId": "case-uuid"}'
```

### Ask History Question
```bash
curl -X POST http://localhost:8000/cases/sessions/SESSION_ID/actions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "actionType": "history",
    "actionId": "hpi-1"
  }'
```

### Order Lab Test
```bash
curl -X POST http://localhost:8000/cases/sessions/SESSION_ID/actions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "actionType": "lab",
    "actionId": "troponin"
  }'
```

### Submit Diagnosis
```bash
curl -X POST http://localhost:8000/cases/sessions/SESSION_ID/diagnosis \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "primaryDiagnosis": "Acute MI",
    "differentialDiagnoses": ["Unstable Angina", "Pulmonary Embolism"],
    "confidence": 90
  }'
```

---

## 🎨 Frontend Components Needed

### 1. Case Browser
- List with filters (specialty, complexity)
- Search bar
- Case cards
- Start button

### 2. Case Session Interface
- **Patient Chart**: Demographics, vitals, chief complaint
- **History Panel**: Questions to reveal
- **Exam Panel**: Systems to examine
- **Studies Panel**: Labs/imaging to order
- **Diagnosis Form**: Primary + differential
- **Management Builder**: Treatment plan
- **Action Log**: Timeline of actions
- **Timer**: If time-limited

### 3. Results Page
- Score display (92.5/100)
- Breakdown chart (6 components)
- Clinical reasoning metrics
- Detailed feedback
- Teaching points

### 4. Performance Dashboard
- Cases attempted/completed
- Average score trends
- Performance by specialty
- Recent sessions

---

## 📊 Scoring System

### Six Components (100 points)
1. **History** (20%) - Critical questions asked
2. **Exam** (20%) - Critical exams performed
3. **Diagnostics** (15%) - Critical studies ordered
4. **Diagnosis** (25%) - Correct diagnosis
5. **Management** (15%) - Appropriate treatment
6. **Efficiency** (5%) - Minimize unnecessary actions

### Clinical Reasoning Metrics
1. Critical actions completed
2. Unnecessary actions count
3. Time to diagnosis
4. Diagnostic accuracy (%)
5. Management appropriateness (%)
6. Efficiency rating (%)

---

## 🔍 Demo Accounts

```bash
# Faculty account
EMAIL="faculty@stanford-demo.edu"
PASSWORD="Demo123!"

# Student account
EMAIL="ms1.student@stanford-demo.edu"
PASSWORD="Demo123!"
```

---

## ✅ Features Checklist

- [x] Virtual patient cases with full clinical data
- [x] Interactive history taking
- [x] Physical examination system
- [x] Diagnostic studies (labs, imaging)
- [x] Branching decision logic
- [x] Diagnosis submission with partial credit
- [x] Management plan evaluation
- [x] Comprehensive 6-component scoring
- [x] Clinical reasoning assessment (7 metrics)
- [x] Detailed feedback generation
- [x] Cost tracking (time + resources)
- [x] Multiple complexity levels
- [x] Specialty-specific cases
- [x] Learning objectives tracking
- [x] Session state management
- [x] Performance analytics
- [x] RBAC protection
- [x] Complete API documentation

---

## 🎯 Action Types

- `history` - Ask history question
- `exam` - Perform physical exam
- `lab` - Order laboratory test
- `imaging` - Order imaging study
- `procedure` - Order procedure

---

## 📈 Importance Levels

- `critical` - Must do for diagnosis
- `important` - Should do
- `helpful` - Can provide info
- `unnecessary` - Not needed

---

## ⚡ Quick Commands

```bash
# View all cases
curl http://localhost:8000/cases \
  -H "Authorization: Bearer $TOKEN"

# Filter by specialty
curl "http://localhost:8000/cases?specialty=cardiology" \
  -H "Authorization: Bearer $TOKEN"

# Get my sessions
curl http://localhost:8000/cases/sessions/my \
  -H "Authorization: Bearer $TOKEN"

# Get my performance
curl http://localhost:8000/cases/performance/mine \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🎓 Specialties Supported

- Internal Medicine
- Surgery
- Pediatrics
- Emergency Medicine
- OB/GYN
- Cardiology
- Pulmonology
- Gastroenterology
- Neurology
- Psychiatry
- Dermatology
- Endocrinology

---

## 🏥 Complexity Levels

- **Beginner**: Straightforward cases
- **Intermediate**: Standard difficulty
- **Advanced**: Complex presentations
- **Expert**: Rare or multi-system

---

## 📝 Typical Session Flow

1. Browse cases
2. Select case
3. Start session
4. Read presentation
5. Ask history questions
6. Perform physical exam
7. Order diagnostic studies
8. Review results
9. Submit diagnosis
10. Create management plan
11. Complete session
12. Review feedback

---

## ✨ Status

**Cases Module: COMPLETE** ✅  
**Progress: 70% → 75%** 🎉  
**Ready for**: Frontend integration

---

_For detailed documentation, see: CASES_COMPLETE_DOCUMENTATION.md_
