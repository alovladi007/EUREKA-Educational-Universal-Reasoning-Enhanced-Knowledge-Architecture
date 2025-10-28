# Contributing to EUREKA

First off, thank you for considering contributing to EUREKA! It's people like you that make EUREKA a great platform for learners worldwide.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Pull Request Process](#pull-request-process)
- [Testing Requirements](#testing-requirements)
- [Documentation](#documentation)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

**Before Submitting:**
- Check the [issue tracker](https://github.com/eureka/eureka/issues) for existing reports
- Check if the issue is fixed in the latest version
- Collect information about the bug

**Bug Report Template:**
```markdown
**Describe the bug**
A clear description of the bug

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '....'
3. See error

**Expected behavior**
What you expected to happen

**Screenshots**
If applicable, add screenshots

**Environment:**
 - OS: [e.g. Ubuntu 22.04]
 - Browser: [e.g. Chrome 121]
 - Version: [e.g. 1.2.0]

**Additional context**
Any other relevant information
```

### Suggesting Enhancements

**Enhancement Template:**
```markdown
**Is your feature request related to a problem?**
A clear description of the problem

**Describe the solution you'd like**
A clear description of what you want to happen

**Describe alternatives you've considered**
Any alternative solutions or features

**Additional context**
Any other context about the feature

**Which tier does this apply to?**
- [ ] All tiers
- [ ] High School
- [ ] Undergraduate
- [ ] Graduate
- [ ] Medical
- [ ] Law
- [ ] MBA
- [ ] Engineering
```

### Contributing Code

We welcome code contributions! Here's how:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes**
4. **Write/update tests**
5. **Update documentation**
6. **Commit with descriptive messages**
7. **Push to your fork**
8. **Open a Pull Request**

## Development Setup

### Prerequisites

- **Docker** & **docker-compose** (20.10+)
- **Node.js** (20+)
- **Python** (3.11+)
- **Git** (2.30+)

### Quick Start

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/eureka.git
cd eureka

# Copy environment template
cp .env.example .env
# Edit .env and add your API keys

# Install dependencies
make install

# Start development environment
make dev

# Run tests
make test
```

### Development Workflow

```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Make changes...

# Run linting
make lint

# Run tests
make test

# Run E2E tests
make e2e

# Commit changes
git add .
git commit -m "feat: add amazing feature"

# Push to your fork
git push origin feature/your-feature-name
```

## Coding Standards

### Python (Backend Services)

**Style Guide**: PEP 8 with some modifications

```python
# Use type hints
def calculate_mastery(attempts: list[float], threshold: float = 0.8) -> float:
    """Calculate mastery level based on attempt history.
    
    Args:
        attempts: List of attempt scores (0.0 to 1.0)
        threshold: Mastery threshold (default 0.8)
        
    Returns:
        Mastery level as a float
    """
    if not attempts:
        return 0.0
    return sum(attempts) / len(attempts)

# Use descriptive variable names
student_mastery_level = calculate_mastery(recent_attempts)

# Document complex logic
# Apply Bayesian update for knowledge tracing
posterior = (prior * likelihood) / evidence
```

**Linting & Formatting:**
```bash
# Lint with Ruff
ruff check services/

# Format with Ruff
ruff format services/

# Type checking with mypy
mypy services/
```

**Testing:**
```python
# Use pytest with fixtures
import pytest
from services.adaptive.mastery import calculate_mastery

@pytest.fixture
def sample_attempts():
    return [0.7, 0.8, 0.9, 0.85]

def test_calculate_mastery(sample_attempts):
    result = calculate_mastery(sample_attempts)
    assert 0.8 <= result <= 0.9
    assert isinstance(result, float)

def test_calculate_mastery_empty_list():
    result = calculate_mastery([])
    assert result == 0.0
```

### TypeScript/JavaScript (Frontend)

**Style Guide**: Airbnb + Prettier

```typescript
// Use TypeScript for all new code
interface StudentProgress {
  studentId: string;
  courseId: string;
  masteryLevel: number;
  lastActivity: Date;
}

// Prefer functional components with hooks
export function StudentDashboard({ studentId }: { studentId: string }) {
  const [progress, setProgress] = useState<StudentProgress | null>(null);
  
  useEffect(() => {
    fetchProgress(studentId).then(setProgress);
  }, [studentId]);
  
  if (!progress) return <LoadingSpinner />;
  
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">Progress</h2>
      <MasteryChart data={progress} />
    </div>
  );
}

// Use meaningful names
const isStudentEligible = checkEligibility(student);
```

**Linting & Formatting:**
```bash
cd apps/web

# Lint
npm run lint

# Format
npm run format

# Type check
npm run type-check
```

### SQL & Database

```sql
-- Use meaningful table and column names
CREATE TABLE student_mastery_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES users(id),
  course_id UUID NOT NULL REFERENCES courses(id),
  skill_id VARCHAR(100) NOT NULL,
  mastery_level DECIMAL(3,2) NOT NULL CHECK (mastery_level BETWEEN 0 AND 1),
  measured_at TIMESTAMP NOT NULL DEFAULT NOW(),
  org_id UUID NOT NULL REFERENCES orgs(id),  -- Multi-tenancy
  
  -- Indexes for common queries
  INDEX idx_student_course (student_id, course_id),
  INDEX idx_org_student (org_id, student_id)
);

-- Always include org_id for multi-tenancy
SELECT * FROM student_mastery_history 
WHERE org_id = :org_id 
  AND student_id = :student_id;
```

### Git Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, missing semi-colons, etc)
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `test`: Adding/updating tests
- `chore`: Maintenance tasks
- `ci`: CI/CD changes

**Examples:**
```bash
feat(tutor-llm): add multi-turn conversation memory

fix(assess): correct rubric scoring for partial credit

docs(api-core): update authentication flow diagram

perf(adaptive): optimize knowledge graph queries

test(tier-hs): add E2E tests for gamification flow
```

## Pull Request Process

### Before Submitting

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Tests written and passing
- [ ] Documentation updated
- [ ] No merge conflicts with main
- [ ] Branch is up to date with main

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix (non-breaking change fixing an issue)
- [ ] New feature (non-breaking change adding functionality)
- [ ] Breaking change (fix or feature causing existing functionality to break)
- [ ] Documentation update

## Tier(s) Affected
- [ ] Core services
- [ ] High School
- [ ] Undergraduate
- [ ] Graduate
- [ ] Medical
- [ ] Law
- [ ] MBA
- [ ] Engineering

## Testing
Describe testing performed:
- Unit tests: [describe]
- Integration tests: [describe]
- E2E tests: [describe]

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally
- [ ] Any dependent changes have been merged and published

## Related Issues
Closes #(issue_number)
```

### Review Process

1. **Automated Checks** (must pass):
   - Linting
   - Type checking
   - Unit tests (>80% coverage)
   - Integration tests
   - Security scans

2. **Code Review** (required):
   - At least 1 approval from a maintainer
   - All comments addressed
   - No unresolved conversations

3. **Testing** (required):
   - Manual testing by reviewer for UI changes
   - E2E tests passing

4. **Merge**:
   - Squash and merge (for feature branches)
   - Rebase and merge (for small fixes)

## Testing Requirements

### Unit Tests

**Minimum Coverage**: 80% per service

```bash
# Run tests with coverage
make test-coverage

# View HTML report
open htmlcov/index.html
```

### Integration Tests

Test interactions between services:

```python
def test_tutor_llm_with_rag(client, sample_course):
    """Test tutor can retrieve and cite course content."""
    response = client.post("/chat", json={
        "message": "Explain Newton's Third Law",
        "course_id": sample_course.id
    })
    
    assert response.status_code == 200
    data = response.json()
    assert "citations" in data
    assert len(data["citations"]) > 0
```

### E2E Tests

Use Playwright for user journey tests:

```typescript
test('student can complete adaptive quiz', async ({ page }) => {
  // Login
  await page.goto('/login');
  await page.fill('[name="email"]', 'student@test.com');
  await page.fill('[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  
  // Navigate to course
  await page.click('text=Algebra I');
  
  // Start quiz
  await page.click('text=Practice Quiz');
  
  // Answer questions
  for (let i = 0; i < 5; i++) {
    await page.click('[data-testid="answer-0"]');
    await page.click('text=Submit');
  }
  
  // Check results
  await expect(page.locator('text=Quiz Complete')).toBeVisible();
});
```

## Documentation

### Code Documentation

**Python:**
```python
def adaptive_question_selector(
    student_id: str,
    skill_id: str,
    mastery_threshold: float = 0.8
) -> dict:
    """Select next question using Thompson Sampling bandit.
    
    This function implements a multi-armed bandit approach to select
    the most informative question for the student based on their
    current mastery level and question difficulty distributions.
    
    Args:
        student_id: UUID of the student
        skill_id: Identifier for the skill being assessed
        mastery_threshold: Target mastery level (0.0 to 1.0)
        
    Returns:
        dict: Selected question with metadata:
            - question_id: UUID of selected question
            - difficulty: Estimated difficulty (0.0 to 1.0)
            - info_gain: Expected information gain
            
    Raises:
        ValueError: If student_id or skill_id not found
        
    Example:
        >>> question = adaptive_question_selector(
        ...     student_id="550e8400-e29b-41d4-a716-446655440000",
        ...     skill_id="algebra.equations.linear"
        ... )
        >>> print(question["difficulty"])
        0.65
    """
    # Implementation...
```

**TypeScript:**
```typescript
/**
 * Fetch student progress with caching
 * 
 * @param studentId - UUID of the student
 * @param courseId - UUID of the course
 * @param options - Optional fetch configuration
 * @returns Promise resolving to student progress data
 * 
 * @throws {AuthError} If user is not authenticated
 * @throws {NotFoundError} If student or course not found
 * 
 * @example
 * ```ts
 * const progress = await fetchStudentProgress(
 *   '550e8400-e29b-41d4-a716-446655440000',
 *   '7c9e6679-7425-40de-944b-e07fc1f90ae7'
 * );
 * ```
 */
export async function fetchStudentProgress(
  studentId: string,
  courseId: string,
  options?: RequestInit
): Promise<StudentProgress> {
  // Implementation...
}
```

### API Documentation

Use OpenAPI 3.0 for all REST APIs:

```yaml
paths:
  /api/v1/students/{studentId}/progress:
    get:
      summary: Get student progress
      description: Returns detailed progress information for a student
      parameters:
        - name: studentId
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/StudentProgress'
```

### Architecture Documentation

Update `docs/ARCHITECTURE.md` for significant changes:

- System diagrams (use Mermaid)
- Data flow descriptions
- Service interactions
- Key design decisions

## Security Considerations

### Security Checklist for PRs

- [ ] No secrets or API keys committed
- [ ] Input validation implemented
- [ ] Output sanitization implemented
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (CSP headers, sanitized output)
- [ ] CSRF tokens for state-changing operations
- [ ] Authentication required for sensitive endpoints
- [ ] Authorization checks for all resources
- [ ] Rate limiting for public endpoints
- [ ] Audit logging for sensitive operations
- [ ] FERPA/HIPAA/COPPA compliance (if applicable)

### Reporting Security Issues

**DO NOT** open public issues for security vulnerabilities. Instead, email security@eureka.edu with:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

See [SECURITY.md](SECURITY.md) for full details.

## Community

### Communication Channels

- **GitHub Discussions**: General questions and ideas
- **GitHub Issues**: Bug reports and feature requests
- **Slack** (for contributors): [Join here](#)
- **Monthly Community Call**: First Friday of each month

### Recognition

Contributors are recognized in:
- `CONTRIBUTORS.md` file
- Release notes
- Annual contributor spotlight

## License

By contributing to EUREKA, you agree that your contributions will be licensed under the project's license (to be determined - likely Apache 2.0 or AGPL).

---

Thank you for contributing to EUREKA! 🚀

Questions? Reach out to the maintainers at maintainers@eureka.edu
