# AI Integration Setup Guide

## Quick Start - Get Your Platform AI-Powered in 5 Minutes!

The EUREKA platform uses AI for:
- **AI Tutor** - Intelligent tutoring with Claude/GPT
- **Auto-Grading** - Automated essay and short answer grading
- **RAG (Retrieval-Augmented Generation)** - Context-aware responses using course materials
- **Content Generation** - Curriculum and question generation

---

## Step 1: Get API Keys

### Option A: Anthropic Claude (Recommended)

1. Go to https://console.anthropic.com/
2. Sign up or log in
3. Navigate to "API Keys"
4. Click "Create Key"
5. Copy your key (starts with `sk-ant-...`)

**Cost**: Pay-as-you-go, ~$3 per 1M input tokens for Claude 3.5 Sonnet

### Option B: OpenAI (Alternative/Fallback)

1. Go to https://platform.openai.com/
2. Sign up or log in
3. Navigate to "API Keys"
4. Click "Create new secret key"
5. Copy your key (starts with `sk-...`)

**Cost**: Pay-as-you-go, ~$2.50 per 1M input tokens for GPT-4 Turbo

### Option C: Both (Best Setup)

Use both! The platform will use Claude as primary and fall back to OpenAI if Claude fails.

---

## Step 2: Add Keys to Environment

### For Docker Setup (Recommended):

1. Copy the .env template:
   ```bash
   cd /home/user/EUREKA-Educational-Universal-Reasoning-Enhanced-Knowledge-Architecture
   cp .env.template .env
   ```

2. Edit `.env` file and add your keys:
   ```bash
   # AI/ML API KEYS
   ANTHROPIC_API_KEY=sk-ant-your-actual-key-here
   OPENAI_API_KEY=sk-your-actual-key-here

   # AI Configuration
   ANTHROPIC_MODEL=claude-sonnet-4-20250514
   OPENAI_MODEL=gpt-4-turbo-preview
   RAG_ENABLED=true
   AI_FALLBACK_ENABLED=true
   ```

3. **IMPORTANT**: Never commit `.env` to git! It's already in `.gitignore`.

### For Local Development:

Export environment variables:
```bash
export ANTHROPIC_API_KEY="sk-ant-your-actual-key-here"
export OPENAI_API_KEY="sk-your-actual-key-here"
export ANTHROPIC_MODEL="claude-sonnet-4-20250514"
export OPENAI_MODEL="gpt-4-turbo-preview"
export RAG_ENABLED="true"
```

---

## Step 3: Verify AI Integration

### Test AI Tutor Service:

```bash
# Start services
cd eureka
docker-compose up -d

# Wait 30 seconds for services to start

# Test AI tutor (should return AI-generated response)
curl -X POST http://localhost:8001/api/v1/tutor/ask \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is photosynthesis?",
    "user_id": "test-user",
    "course_id": "test-course"
  }'
```

**Expected Response**: JSON with AI-generated explanation of photosynthesis.

### Test Auto-Grading:

```bash
curl -X POST http://localhost:8002/api/v1/grading/auto \
  -H "Content-Type: application/json" \
  -d '{
    "question_type": "short_answer",
    "question_text": "What is the powerhouse of the cell?",
    "student_answer": "Mitochondria",
    "correct_answer": "Mitochondria"
  }'
```

**Expected Response**: JSON with grading result and feedback.

---

## Step 4: Monitor Usage and Costs

### Anthropic Console:
- View usage: https://console.anthropic.com/settings/usage
- Set spending limits to avoid surprises
- Recommended limit for testing: $10/month

### OpenAI Console:
- View usage: https://platform.openai.com/usage
- Set spending limits in Settings
- Recommended limit for testing: $10/month

### Typical Costs for Testing:
- 100 AI tutor questions: ~$0.50
- 100 essay gradings: ~$2.00
- RAG indexing (1000 documents): ~$1.00

**Total for 1 month of active development**: $10-20

---

## Troubleshooting

### "API key not found" Error:

1. Check `.env` file exists:
   ```bash
   ls -la .env
   ```

2. Verify keys are set:
   ```bash
   cat .env | grep API_KEY
   ```

3. Restart services:
   ```bash
   docker-compose restart
   ```

### "Invalid API key" Error:

1. Verify key format:
   - Anthropic: starts with `sk-ant-`
   - OpenAI: starts with `sk-`

2. Check key hasn't expired in console

3. Regenerate key if needed

### "Rate limit exceeded" Error:

1. You've hit API rate limits
2. Wait a few minutes
3. Upgrade to higher tier plan if needed

### Services Won't Start:

1. Check logs:
   ```bash
   docker-compose logs tutor-llm
   docker-compose logs assess
   ```

2. Ensure database is running:
   ```bash
   docker-compose ps db
   ```

3. Restart infrastructure:
   ```bash
   docker-compose down
   docker-compose up -d
   ```

---

## Advanced Configuration

### Use Different Models:

In `.env`, change:
```bash
# Use Claude Opus for higher quality (more expensive)
ANTHROPIC_MODEL=claude-opus-4-20250514

# Use GPT-4o for OpenAI (faster, cheaper)
OPENAI_MODEL=gpt-4o

# Use GPT-3.5 for very cheap testing
OPENAI_MODEL=gpt-3.5-turbo
```

### Disable RAG (Use Simple AI):

```bash
RAG_ENABLED=false
```

This makes responses faster but less contextual.

### Disable Fallback:

```bash
AI_FALLBACK_ENABLED=false
```

Platform will fail if primary AI provider is down.

### Set Token Limits:

```bash
ANTHROPIC_MAX_TOKENS=4000
OPENAI_MAX_TOKENS=4000
```

Lower = cheaper, faster but shorter responses.

---

## Cost Optimization Tips

1. **Start with one provider** - Just use Anthropic OR OpenAI, not both
2. **Use cheaper models for testing** - GPT-3.5-turbo is 10x cheaper than GPT-4
3. **Set spending limits** - Both platforms let you set hard limits
4. **Cache responses** - The platform caches similar questions
5. **Disable RAG for simple testing** - RAG requires more tokens

### Free Tier Options:

- **Anthropic**: $5 free credits for new users
- **OpenAI**: $5 free credits for first 3 months (if available)
- **Together AI**: Free tier available (not yet integrated)

---

## Production Deployment

### Security Best Practices:

1. **Never commit API keys to git**
   ```bash
   # Verify .env is in .gitignore
   cat .gitignore | grep .env
   ```

2. **Use environment variables in production**
   - Docker: Use secrets
   - Kubernetes: Use sealed secrets
   - AWS: Use Secrets Manager
   - Azure: Use Key Vault

3. **Rotate keys regularly** - Every 90 days minimum

4. **Monitor for unusual usage** - Set up alerts in provider console

### High-Volume Setup:

For production with many users:

1. **Get enterprise pricing** from both providers
2. **Implement request queuing** to avoid rate limits
3. **Use caching aggressively** - Redis for repeated questions
4. **Consider fine-tuning** your own models for lower cost

---

## Support

**API Issues**:
- Anthropic: https://support.anthropic.com/
- OpenAI: https://help.openai.com/

**Platform Issues**:
- GitHub: https://github.com/alovladi007/EUREKA-Educational-Universal-Reasoning-Enhanced-Knowledge-Architecture/issues

---

## Quick Reference

| Feature | Service | Port | Requires API Key |
|---------|---------|------|------------------|
| AI Tutor | tutor-llm | 8001 | Anthropic OR OpenAI |
| Auto-Grading | assess | 8002 | Anthropic (for essays) |
| RAG Search | tutor-llm | 8001 | OpenAI (for embeddings) |
| Content Gen | content | 8004 | Anthropic OR OpenAI |

**Minimum to get started**: Just Anthropic API key

**Recommended**: Both Anthropic (for generation) + OpenAI (for embeddings)

---

**Ready to go!** Once you add your API keys and restart services, your platform will have full AI capabilities! 🚀
