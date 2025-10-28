# 🚀 AI Tutor Service - Quick Fix Reference

## What Was Broken

1. **Missing Schema**: `ConversationWithMessages` not defined
2. **Old Syntax**: Pydantic v1 syntax (`.dict()`, `Config` class)
3. **Field Error**: `mastery_delta` handled incorrectly
4. **Null Crashes**: None values not handled in analytics

## What's Fixed

✅ All schemas defined with Pydantic v2 syntax  
✅ Proper conversation responses with/without messages  
✅ mastery_delta correctly applied to mastery_level  
✅ Safe None handling throughout  

---

## Installation (3 Steps)

### Step 1: Copy Fixed Files
```bash
# Copy these 3 files to your tutor-llm service:
schemas.py          → services/tutor-llm/app/schemas/__init__.py
crud.py             → services/tutor-llm/app/crud/__init__.py
api_endpoints.py    → services/tutor-llm/app/api/v1/__init__.py
```

### Step 2: Start Service
```bash
cd services/tutor-llm
python main.py
```

### Step 3: Verify
```bash
# Health check
curl http://localhost:8002/health

# View docs
open http://localhost:8002/docs
```

---

## Key Changes by File

### schemas.py (app/schemas/__init__.py)

**Added:**
- ✅ `ConversationWithMessages` schema
- ✅ `MessageResponse` schema  
- ✅ `SessionResponse` schema import

**Updated:**
- ✅ All models use `model_config = ConfigDict(from_attributes=True)`
- ✅ All lists use `Field(default_factory=list)`

**Example:**
```python
# OLD (v1):
class Config:
    from_attributes = True

# NEW (v2):
model_config = ConfigDict(from_attributes=True)
```

---

### api_endpoints.py (app/api/v1/__init__.py)

**Key Changes:**

1. **Import Added:**
```python
from app.schemas import (
    ...,
    ConversationWithMessages,  # NEW
    MessageResponse,            # NEW
    SessionResponse,            # NEW
    ...
)
```

2. **get_conversation() Fixed:**
```python
# Returns ConversationWithMessages when include_messages=True
# Returns ConversationResponse when include_messages=False

if include_messages:
    # Build dict with messages
    conversation_dict = {
        # ... fields ...
        "messages": [MessageResponse.model_validate(msg) for msg in messages]
    }
    return ConversationWithMessages(**conversation_dict)

return ConversationResponse.model_validate(conversation)
```

3. **All .dict() → .model_dump():**
```python
# OLD:
db_conversation = TutorConversation(**conversation.dict())

# NEW:
db_conversation = TutorConversation(**conversation.model_dump())
```

4. **Analytics Safe None Handling:**
```python
# OLD:
total_duration = sum(s.duration_seconds for s in sessions)

# NEW:
total_duration = sum(s.duration_seconds or 0 for s in sessions)

# OLD:
all_topics.extend(s.topics_covered)

# NEW:
if s.topics_covered:
    all_topics.extend(s.topics_covered)
```

---

### crud.py (app/crud/__init__.py)

**Key Fix: mastery_delta Handling**

```python
async def create_or_update_knowledge(...):
    # Extract mastery_delta from kwargs
    mastery_delta = kwargs.pop('mastery_delta', None)
    
    if not knowledge:
        # New record
        initial_mastery = mastery_delta if mastery_delta is not None else 0.0
        knowledge = StudentKnowledge(
            user_id=user_id,
            course_id=course_id,
            topic=topic,
            mastery_level=initial_mastery,  # Use mastery_level, not mastery_delta
            **kwargs
        )
    else:
        # Update existing
        if mastery_delta is not None:
            # Apply delta to mastery_level (cap at 0.0-1.0)
            knowledge.mastery_level = min(1.0, max(0.0, 
                knowledge.mastery_level + mastery_delta))
        
        # Auto-increment attempts
        knowledge.total_attempts += 1
        
        # Update timestamp
        knowledge.last_updated = datetime.utcnow()
        
        # Check mastery threshold
        if knowledge.mastery_level >= 0.85 and not knowledge.mastered_at:
            knowledge.mastered_at = datetime.utcnow()
```

**Why This Matters:**
- `mastery_delta` is not a field in `StudentKnowledge` model
- It's a **delta value** that gets applied to `mastery_level`
- Old code tried to set `mastery_delta` directly → ERROR
- New code extracts it, applies it to `mastery_level` → WORKS

---

## Testing

### Quick Test (Manual)
```bash
# 1. Health check
curl http://localhost:8002/health

# 2. Create conversation
curl -X POST http://localhost:8002/api/v1/tutor/conversations \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "course_id": "550e8400-e29b-41d4-a716-446655440001",
    "title": "Test Conversation"
  }'

# 3. Get conversation WITH messages (tests ConversationWithMessages fix)
curl "http://localhost:8002/api/v1/tutor/conversations/{id}?include_messages=true"
```

### Automated Test
```bash
# Run comprehensive test suite
python test_ai_tutor.py
```

---

## Pydantic V2 Quick Reference

### Common Changes

| Old (v1) | New (v2) |
|----------|----------|
| `.dict()` | `.model_dump()` |
| `.json()` | `.model_dump_json()` |
| `class Config:` | `model_config = ConfigDict(...)` |
| `orm_mode = True` | `from_attributes=True` |

### Example Migration
```python
# OLD (Pydantic v1):
class MyModel(BaseModel):
    name: str
    
    class Config:
        orm_mode = True

data = instance.dict()

# NEW (Pydantic v2):
class MyModel(BaseModel):
    name: str
    
    model_config = ConfigDict(from_attributes=True)

data = instance.model_dump()
```

---

## Common Errors & Solutions

### Error 1: "ConversationWithMessages not defined"
**Solution:** Update schemas.py with fixed version

### Error 2: "dict() deprecated"
**Solution:** Replace all `.dict()` with `.model_dump()`

### Error 3: "Unknown field: mastery_delta"
**Solution:** Update crud.py to extract and apply mastery_delta

### Error 4: "NoneType has no len()"
**Solution:** Add None checks before operations

---

## Verification Checklist

After applying fixes, verify:

- [ ] Service starts without errors
- [ ] `/health` returns 200 OK
- [ ] `/docs` loads successfully
- [ ] Can create conversation
- [ ] Can get conversation with `include_messages=true`
- [ ] Can update knowledge (mastery_level updates correctly)
- [ ] Analytics handles empty/None data
- [ ] No import errors in logs

---

## File Locations

```
services/tutor-llm/
└── app/
    ├── schemas/
    │   └── __init__.py      ← schemas.py goes here
    ├── crud/
    │   └── __init__.py      ← crud.py goes here
    └── api/v1/
        └── __init__.py      ← api_endpoints.py goes here
```

---

## Need Help?

### If service won't start:
```bash
# Check syntax
python -m py_compile app/schemas/__init__.py
python -m py_compile app/crud/__init__.py
python -m py_compile app/api/v1/__init__.py

# Check imports
python -c "from app.schemas import ConversationWithMessages"
```

### If tests fail:
1. Check service is running: `curl http://localhost:8002/health`
2. Check logs for errors
3. Verify all 3 files were updated
4. Try restarting service

---

## Success Indicators

When everything is working:

✅ No import errors in logs  
✅ Swagger UI shows all endpoints  
✅ Can get conversation with messages  
✅ Knowledge updates show valid mastery_level (0.0-1.0)  
✅ Analytics doesn't crash on empty data  
✅ All test_ai_tutor.py tests pass  

---

**Quick Summary:**
- 3 files need updating
- Main issues: missing schemas, old Pydantic syntax, mastery_delta handling
- All fixed in provided files
- Test with test_ai_tutor.py

🎉 **You're ready to go!**
