# Professional Modules Workflow - Quick Reference

## 🚀 Quick Start

### Trigger the Workflow

```bash
# Using GitHub CLI
gh workflow run professional-modules-orchestration.yml

# View status
gh run watch

# List recent runs
gh run list --workflow=professional-modules-orchestration.yml
```

### Or Via GitHub Web Interface

1. Go to **Actions** tab
2. Click **"Professional Modules - Parallel Build & PR Orchestration"**
3. Click **"Run workflow"** button
4. Select options and click **"Run workflow"**

## 📊 Module Overview

| Module | Label | Color | Branch Prefix |
|--------|-------|-------|---------------|
| 🏥 Medical School | `tier:medical` | 🔴 Red | `feature/medical-school-*` |
| ⚖️ Law School | `tier:law` | 🔵 Blue | `feature/law-school-*` |
| 💼 MBA Program | `tier:mba` | 🟢 Green | `feature/mba-*` |
| 🔧 Engineering | `tier:engineering` | 🟠 Orange | `feature/engineering-*` |

## 📁 Generated Structure

```
modules/
├── medical-school/
│   ├── database/
│   │   └── schema.sql          # PostgreSQL schema
│   ├── api/
│   │   └── endpoints.py        # FastAPI endpoints
│   ├── frontend/
│   │   └── MedicalSchoolDashboard.tsx
│   ├── docs/
│   │   └── README.md
│   ├── tests/
│   │   └── test_api.py
│   └── BUILD_INFO.txt
├── law-school/
│   └── ... (same structure)
├── mba/
│   └── ... (same structure)
└── engineering/
    └── ... (same structure)
```

## 🏷️ PR Labels

Each PR automatically gets:
- `tier:[module]` - Module identifier
- `enhancement` - Feature addition
- `automated` - Auto-generated
- `priority:high` - High priority
- `size:large` - Large change

## ⚡ Workflow Commands

### View Workflow Runs
```bash
# List all runs
gh run list --workflow=professional-modules-orchestration.yml

# Watch latest run
gh run watch

# View specific run
gh run view <run-id>

# View logs
gh run view <run-id> --log

# Download artifacts
gh run download <run-id>
```

### Manage PRs
```bash
# List PRs by label
gh pr list --label "tier:medical"
gh pr list --label "tier:law"
gh pr list --label "tier:mba"
gh pr list --label "tier:engineering"

# View PR
gh pr view <number>

# Checkout PR locally
gh pr checkout <number>

# Merge PR
gh pr merge <number> --squash
```

### Cancel Running Workflow
```bash
gh run cancel <run-id>
```

## 🧪 Local Testing

```bash
# Test all modules locally
.github/workflows/test-local.sh

# Test specific module
.github/workflows/test-local.sh --module medical-school

# Skip tests
.github/workflows/test-local.sh --no-tests

# Custom base branch
.github/workflows/test-local.sh --base-branch develop
```

## 📋 Review Checklist

After PRs are created:

### Database Schema Review
- [ ] Table structures are correct
- [ ] Indexes are appropriate
- [ ] Foreign keys are properly set
- [ ] Triggers are working
- [ ] No naming conflicts

### API Endpoints Review
- [ ] Endpoints follow RESTful conventions
- [ ] Request/response models are defined
- [ ] Error handling is implemented
- [ ] Authentication is required where needed
- [ ] Rate limiting is considered

### Frontend Components Review
- [ ] Components follow design system
- [ ] TypeScript types are correct
- [ ] Responsive design implemented
- [ ] Accessibility standards met
- [ ] Error states handled

### Documentation Review
- [ ] README is comprehensive
- [ ] API docs are accurate
- [ ] Setup instructions work
- [ ] Examples are provided
- [ ] Links are working

### Testing Review
- [ ] Unit tests cover key functionality
- [ ] Integration tests exist
- [ ] Test data is appropriate
- [ ] Tests are passing
- [ ] Coverage is adequate

## 🔧 Troubleshooting

### Workflow Failed to Start
```bash
# Check workflow syntax
yamllint .github/workflows/professional-modules-orchestration.yml

# Validate workflow
gh workflow view professional-modules-orchestration.yml
```

### Build Failed
```bash
# View failure logs
gh run view <run-id> --log-failed

# Re-run failed jobs
gh run rerun <run-id> --failed
```

### PR Creation Failed
```bash
# Check if branch exists
git branch -r | grep feature/

# Delete remote branch
git push origin --delete feature/[module]-[version]

# Re-run workflow
gh workflow run professional-modules-orchestration.yml
```

### Merge Conflicts
```bash
# Checkout PR branch
gh pr checkout <number>

# Rebase on main
git fetch origin main
git rebase origin/main

# Resolve conflicts
# ... fix conflicts ...
git add .
git rebase --continue

# Force push
git push --force-with-lease
```

## 📈 Monitoring

### Check Workflow Status
```bash
# Summary of recent runs
gh run list --workflow=professional-modules-orchestration.yml --limit 10

# Detailed view
gh run view <run-id>
```

### Watch Progress Live
```bash
gh run watch
```

### View Build Summary
- Go to Actions tab
- Click on the workflow run
- Scroll to "Summary" section
- View build matrix results

## 🎯 Best Practices

1. **Always review before merging**
   - Check generated code quality
   - Verify database schemas
   - Test API endpoints

2. **Merge incrementally**
   - Merge one module at a time
   - Test each module before next

3. **Keep documentation updated**
   - Update README when features change
   - Document breaking changes
   - Keep API docs in sync

4. **Test locally first**
   - Use local test script
   - Validate changes before pushing
   - Run tests before committing

5. **Use meaningful commits**
   - Follow conventional commits
   - Reference issue numbers
   - Provide context

## 🔗 Useful Links

- [Workflow File](.github/workflows/professional-modules-orchestration.yml)
- [Documentation](README.md)
- [Local Test Script](test-local.sh)
- [Pull Requests](../../pulls)
- [Actions](../../actions)

## 📞 Support

For help:
1. Check this quick reference
2. Review full documentation
3. Check workflow logs
4. Open an issue with `ci/cd` label

---

**Last Updated**: 2024-10-29  
**Version**: 1.0.0
