# EUREKA Project - Quick Reference Guide

## Three-Folder Structure Overview

### Location Map
```
EUREKA-Educational-Universal-Reasoning-Enhanced-Knowledge-Architecture/
├── eureka/                                          ← MAIN PROJECT (Active)
│   ├── services/ (16 services)
│   ├── apps/ (6 apps)
│   ├── docker-compose.yml
│   └── Makefile
│
├── New EURIKA/                                      ← DISTRIBUTION PACKAGE
│   ├── eureka-complete.zip
│   ├── eureka-platform.tar.gz
│   └── docker-compose.yml (simplified)
│
├── alovladi007-EUREKA-.../                          ← ALTERNATE BRANCH
│   └── eureka/ (516 MB duplicate)
│       ├── services/ (11 services)
│       └── apps/ (6 apps)
│
├── modules/                                         ← TEMPLATE/STUBS ONLY
│   ├── medical-school/
│   ├── law-school/
│   ├── mba/
│   └── engineering/
│
└── FOLDER_ANALYSIS_REPORT.md                        ← THIS ANALYSIS
```

---

## Quick Facts

### Folder 1: New EURIKA/
- **Size:** 144 KB
- **Type:** Distribution package (archives)
- **Status:** Legacy/reference only
- **Action:** Archive or delete
- **Use Case:** Historical reference, not active development

### Folder 2: alovladi007-EUREKA-.../
- **Size:** 516 MB
- **Type:** Full monorepo (complete duplicate)
- **Status:** Needs investigation - possible stale branch
- **Action:** Compare with /eureka/ and merge or archive
- **Use Case:** Backup of development work (8+ session summaries)

### Folder 3: modules/
- **Size:** 32 KB
- **Type:** Empty scaffolding/templates
- **Status:** Abandoned architecture planning
- **Action:** Delete immediately
- **Use Case:** None - no implementation

### Folder 4: eureka/ (MAIN)
- **Size:** ~80 MB (+ node_modules)
- **Type:** Active monorepo
- **Status:** Primary development location
- **Action:** Keep and consolidate into here
- **Use Case:** Current development - only place with git history

---

## Decision Matrix

| Question | Answer | Action |
|----------|--------|--------|
| Which folder should I develop in? | `/eureka/` (main) | Make all changes here |
| Should I use New EURIKA archives? | No - outdated | Delete or archive |
| What about alovladi007 folder? | Needs review | See alovladi007 comparison |
| Should I develop in modules/? | No - empty stubs | Delete |
| Where are professional tiers? | `/eureka/services/pro-*` | Implement there |
| Where are tiers (HS, UG, Grad)? | `/eureka/services/tier-*` | Extend there |
| Where is the frontend? | `/eureka/apps/web/` | Build there |
| Where is the API? | `/eureka/services/api-core/` | Integrate there |

---

## Service Locations

### In Main /eureka/services/
- **Core Services:** api-core, tutor-llm, assess, adaptive, analytics, content
- **Academic Tiers:** tier-hs, tier-ug, tier-grad
- **Professional Tiers:** pro-med, pro-law, pro-mba, pro-eng
- **Integration:** ingestion (LTI/SCORM/xAPI)
- **Medical Module:** medical-school (expanded version)

### In Main /eureka/apps/
- **Primary:** web (Next.js full-stack)
- **Tier-specific:** web-hs, web-ug, web-grad (stubs)
- **Admin:** admin dashboard
- **Mobile:** React Native (Expo)

---

## Git Repository Status

### Current Branch
- **Name:** main
- **Status:** Active development
- **Location:** `/eureka/`
- **Files:** Modified (login page, dashboard, pages, docker-compose)

### Untracked Folders
- `alovladi007-EUREKA-...` folder (should be branch?)
- `New EURIKA/` folder (should be separate repo or CI/CD?)
- `modules/` folder (orphaned template)

**Action:** Run `git status` in /eureka/ to clarify branch situation

---

## Immediate To-Do List

### Critical (Do Now)
- [ ] Delete `/modules/` directory (32 KB waste, no value)
- [ ] Archive `/New EURIKA/` (outdated distribution package)
- [ ] Investigate `/alovladi007-EUREKA-.../` (516 MB duplicate)

### Important (This Week)
- [ ] Compare api-core implementations
- [ ] Verify tier services are identical
- [ ] Check professional tier status (complete vs stub)

### High Priority (Before Pushing)
- [ ] Consolidate to single development path
- [ ] Ensure /eureka/ has latest code
- [ ] Clean up extra folders

---

## File Size Comparison

```
Directory               Size        Files     Type
────────────────────────────────────────────────────
/eureka/               ~80 MB      1000s      Source
  - services/          ~40 MB       500s      Python/APIs
  - apps/              ~30 MB       400s      Next.js
  - node_modules/     ~400 MB      5000s      Dependencies
  
alovladi007-EUREKA/   516 MB      1000s      Duplicate
  - Mostly: node_modules (400 MB)
  - Code duplication
  
New EURIKA/           144 KB         8       Archives
  - eureka-complete.zip (54 KB)
  - eureka-platform.tar.gz (37 KB)
  - Documentation files
  
modules/               32 KB         8       Scaffolding
  - Empty directories
  - README files only
────────────────────────────────────────────────────
TOTAL                ~700 MB
```

**Cleanup Potential:** ~550 MB (alovladi007) + 144 KB (New EURIKA) + 32 KB (modules) = ~550 MB

---

## Architecture Decision Guide

### For Professional Tiers (Medical, Law, MBA, Engineering)

**Current State:**
- Stubs exist in `/eureka/services/pro-med/`, `pro-law/`, `pro-mba/`, `pro-eng/`
- Empty scaffolding exists in `/modules/medical-school/`, etc.

**Decision Required:**
1. **Option A: Develop in /eureka/services/**
   - Consistent with tier-hs, tier-ug, tier-grad structure
   - Keep everything in one services/ directory
   - Flatten the hierarchy

2. **Option B: Migrate to /modules/**
   - Separate professional from academic tiers
   - Cleaner organizational structure
   - Requires refactoring (not done yet)
   - Currently no code in modules/ anyway

**Recommendation:** Option A (follow current pattern)
- Implement pro-med, pro-law, pro-mba, pro-eng in /eureka/services/
- Delete /modules/ directory
- Keep consistent structure

---

## Commands for Common Tasks

### Investigate Repository
```bash
cd /Users/vladimirantoine/EUREKA\ Updated/EUREKA-Educational-Universal-Reasoning-Enhanced-Knowledge-Architecture/eureka/
git status          # See current state
git branch -a       # See all branches
git log --oneline   # See commit history
ls -la ../           # See sibling folders
```

### Cleanup Extra Folders
```bash
# Backup first!
tar -czf ~/eureka_backup.tar.gz alovladi007-EUREKA-*/
tar -czf ~/modules_backup.tar.gz modules/

# Then remove
rm -rf alovladi007-EUREKA-*/
rm -rf modules/
rm -rf New\ EURIKA/    # Or keep if needed for distribution
```

### Consolidate Services
```bash
cd eureka/services/
ls -la pro-*/      # Check professional tier status
ls -la tier-*/     # Check academic tier status
# Compare with alovladi007 implementation if needed
```

---

## Key Insights

1. **Three folders = three different purposes**
   - /eureka/ = Active development (USE THIS)
   - alovladi007-/ = Backup/alternate version (REVIEW)
   - New EURIKA/ = Distribution package (ARCHIVE)
   - modules/ = Failed architecture (DELETE)

2. **All four folders currently active in git repo**
   - Creates confusion about source of truth
   - Increases repository size (~700 MB total)
   - Multiple copies of same code

3. **Professional tiers incomplete**
   - Currently just stubs in pro-med, pro-law, pro-mba, pro-eng
   - modules/ directory also incomplete
   - Need decision on where to implement

4. **Frontend is almost complete**
   - /eureka/apps/web/ has full Next.js 14 implementation
   - Dashboard pages functional
   - Authentication flow in place

5. **Backend services partially complete**
   - api-core has structure, not all endpoints
   - tier services (hs, ug, grad) implemented
   - Professional tiers need work

---

## Document Locations

| Document | Location | Purpose |
|----------|----------|---------|
| This File | QUICK_REFERENCE.md | Fast lookup guide |
| Detailed Analysis | FOLDER_ANALYSIS_REPORT.md | Complete breakdown |
| Project Status | /eureka/SYSTEM_STATUS.md | Current system state |
| Session Notes | /eureka/SESSION_*_SUMMARY.md | Development history |
| Architecture | /eureka/docs/PROJECT_SUMMARY.md | System design |
| Setup Guide | /eureka/GETTING_STARTED.md | How to run locally |

---

## Next Steps

### Immediate (Today)
1. Read FOLDER_ANALYSIS_REPORT.md (full details)
2. Decide: Keep, merge, or delete alovladi007-EUREKA-*/ folder
3. Delete /modules/ folder (no value)

### Short Term (This Week)
1. Consolidate code to /eureka/ only
2. Ensure all services in /eureka/services/ are current
3. Verify professional tiers strategy

### Before Production
1. Remove all duplicate directories
2. Ensure single source of truth in /eureka/
3. Implement complete professional tiers
4. Set up automated distribution (CI/CD) instead of manual archives

---

**Last Updated:** November 1, 2025
**Analysis Tool:** File Explorer + Git Analysis
**Recommendation:** Consolidate to single /eureka/ directory
