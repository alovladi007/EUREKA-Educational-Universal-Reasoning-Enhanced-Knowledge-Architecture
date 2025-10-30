# Professional Modules Orchestration Workflow

## Overview

This GitHub Actions workflow automates the creation of all 4 professional education modules in parallel, creating separate feature branches and Pull Requests for each module.

## What It Does

The workflow performs the following actions for **each** of the 4 professional modules:

### 1. **Medical School Module** 🏥
- Label: `tier:medical`
- Color: Red (`#e74c3c`)
- Features: USMLE Question Bank, Clinical Case Simulations, 3D Anatomy Models

### 2. **Law School Module** ⚖️
- Label: `tier:law`
- Color: Blue (`#3498db`)
- Features: Case Law Database, Legal Writing Feedback, Moot Court Simulations

### 3. **MBA Program Module** 💼
- Label: `tier:mba`
- Color: Green (`#2ecc71`)
- Features: Financial Modeling Tools, Business Case Library, Team Collaboration

### 4. **Engineering Module** 🔧
- Label: `tier:engineering`
- Color: Orange (`#f39c12`)
- Features: Circuit Simulators, CAD Integration, FE/PE Practice Exams

## What Gets Generated

For each module, the workflow creates:

### 📊 Database Schema (`database/schema.sql`)
- Tier-specific user profiles
- Course tables
- Assessments and submissions
- Learning paths
- Progress tracking
- Analytics events
- Indexes and triggers

### 🔌 API Endpoints (`api/endpoints.py`)
- User profile management
- Assessment CRUD operations
- Submission and grading
- Learning path generation
- Progress tracking
- Analytics tracking

### 🎨 Frontend Components (`frontend/[Module]Dashboard.tsx`)
- React dashboard component
- Feature cards
- Progress tracking UI
- Activity feed
- TypeScript with full types

### 📝 Documentation (`docs/README.md`)
- Module overview
- Feature list
- API documentation
- Setup instructions
- Testing guide

### 🧪 Tests (`tests/test_api.py`)
- API endpoint tests
- Integration test scaffolding
- Pytest configuration

## How to Use

### Option 1: Manual Trigger (Recommended)

1. Go to Actions tab in GitHub
2. Select "Professional Modules - Parallel Build & PR Orchestration"
3. Click "Run workflow"
4. Configure options:
   - **Base branch**: Branch to create PRs against (default: `main`)
   - **Run tests**: Whether to run tests before creating PRs (default: `true`)
5. Click "Run workflow"

### Option 2: Automatic Trigger

The workflow automatically runs when:
- Code is pushed to `develop` branch
- Changes are made to:
  - `services/**`
  - `frontend/**`
  - The workflow file itself

### Option 3: Using GitHub CLI

```bash
# Trigger the workflow manually
gh workflow run professional-modules-orchestration.yml

# With custom parameters
gh workflow run professional-modules-orchestration.yml \
  -f base_branch=develop \
  -f run_tests=false

# Check workflow status
gh run list --workflow=professional-modules-orchestration.yml

# View a specific run
gh run view <run-id>
```

## Workflow Steps

### 1. Pre-flight Checks ✈️
- Validates project structure
- Generates version number
- Checks for merge conflicts
- Creates timestamp

### 2. Parallel Module Builds 🚀
Runs simultaneously for all 4 modules:
- Creates feature branch (`feature/[module-slug]-[version]`)
- Generates all module files
- Commits changes
- Pushes to remote
- Creates Pull Request with labels

### 3. Build Summary 📊
- Aggregates build status
- Generates summary report
- Updates GitHub Actions summary

### 4. Notifications 📬
- Reports success/failure
- Provides links to PRs

## Pull Request Structure

Each PR includes:

### Title
```
feat(module-slug): Add [Module Name] Module
```

### Labels
- `tier:[module]` - Module-specific label
- `enhancement` - Feature addition
- `automated` - Auto-generated
- `priority:high` - High priority
- `size:large` - Large change

### Body
- Module description
- Feature list
- Files changed
- Version information
- Checklist for review

## Branch Naming Convention

```
feature/[module-slug]-[version]
```

Examples:
- `feature/medical-school-v20241029-abc123`
- `feature/law-school-v20241029-abc123`
- `feature/mba-v20241029-abc123`
- `feature/engineering-v20241029-abc123`

## Version Naming

Format: `v[YYYYMMDD]-[git-short-sha]`

Example: `v20241029-a3f7b9c`

## Configuration

### Environment Variables

The workflow uses the following environment variables:

- `NODE_VERSION`: Node.js version (default: `18`)
- `PYTHON_VERSION`: Python version (default: `3.11`)
- `BASE_BRANCH`: Base branch for PRs (default: `main`)

### Secrets Required

- `GITHUB_TOKEN`: Automatically provided by GitHub Actions

## Monitoring the Workflow

### View Progress

1. Go to Actions tab
2. Click on the running workflow
3. View real-time logs for each module

### Check Summary

After completion, view the build summary:
- Go to the workflow run
- Click "Summary"
- See build status for all modules

### Review Pull Requests

1. Navigate to Pull Requests tab
2. Filter by labels:
   - `tier:medical`
   - `tier:law`
   - `tier:mba`
   - `tier:engineering`

## Troubleshooting

### Workflow Failed

**Check logs:**
```bash
gh run view <run-id> --log-failed
```

**Common issues:**
- Merge conflicts with base branch
- Missing dependencies
- Test failures (if enabled)

### PR Creation Failed

**Possible causes:**
- Branch already exists
- Insufficient permissions
- Network issues

**Solution:**
1. Delete existing branch
2. Re-run workflow

### Module Build Failed

**Isolate the issue:**
1. Check which module failed in the matrix
2. Review logs for that specific module
3. Fix the issue
4. Re-run the workflow

## Customization

### Modify Module Configuration

Edit the matrix in the workflow file:

```yaml
matrix:
  module:
    - name: 'Your Module'
      slug: 'your-module'
      label: 'tier:your-module'
      color: 'hexcolor'
      description: 'Description'
      services:
        - 'service1'
        - 'service2'
      features:
        - 'Feature 1'
        - 'Feature 2'
```

### Add New Modules

Add to the matrix in `.github/workflows/professional-modules-orchestration.yml`:

```yaml
- name: 'New Module'
  slug: 'new-module'
  label: 'tier:new-module'
  color: '9b59b6'  # Purple
  description: 'New module description'
  services:
    - 'api-core'
  features:
    - 'Feature A'
    - 'Feature B'
```

### Disable Tests

Run workflow with:
```bash
gh workflow run professional-modules-orchestration.yml -f run_tests=false
```

## Performance

- **Parallel Execution**: All 4 modules build simultaneously
- **Average Time**: ~5-8 minutes per module
- **Total Time**: ~8-10 minutes (thanks to parallelization)

## Best Practices

1. **Review before merge**: Always review generated code before merging
2. **Test locally**: Pull branches and test locally before merging
3. **Incremental merging**: Merge modules one at a time
4. **Update docs**: Keep module documentation up to date
5. **Monitor performance**: Watch workflow execution times

## Next Steps After PR Creation

1. ✅ Review the generated code
2. ✅ Test the database schema locally
3. ✅ Implement API endpoint logic (replace TODOs)
4. ✅ Connect frontend to API
5. ✅ Write comprehensive tests
6. ✅ Update documentation
7. ✅ Request code review
8. ✅ Merge to base branch

## Support

For issues with the workflow:
1. Check workflow logs
2. Review this documentation
3. Open an issue with label `ci/cd`
4. Tag the DevOps team

## Future Enhancements

Planned improvements:
- [ ] Slack notifications
- [ ] Email notifications
- [ ] Performance metrics tracking
- [ ] Automated code review
- [ ] Automated testing
- [ ] Deployment preview links
- [ ] Integration with project management tools

---

**Last Updated**: 2024-10-29  
**Maintained By**: DevOps Team  
**Status**: ✅ Production Ready
