.PHONY: help dev seed test e2e clean install lint format docker-build docker-up docker-down

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

install: ## Install all dependencies
	@echo "Installing dependencies..."
	cd apps/web && npm install
	cd apps/mobile && npm install
	cd apps/admin && npm install
	cd libs/ui && npm install
	@echo "Installing Python dependencies..."
	cd services/api-core && pip install -r requirements.txt
	cd services/tutor-llm && pip install -r requirements.txt
	cd services/assess && pip install -r requirements.txt
	cd services/adaptive && pip install -r requirements.txt
	@echo "✅ Dependencies installed"

dev: ## Start all services in development mode
	@echo "Starting EUREKA development environment..."
	docker-compose up -d
	@echo "✅ Services running at:"
	@echo "   Web:      http://localhost:3000"
	@echo "   API:      http://localhost:8000"
	@echo "   Admin:    http://localhost:3001"
	@echo "   Postgres: localhost:5432"
	@echo "   Redis:    localhost:6379"

docker-build: ## Build all Docker images
	docker-compose build

docker-up: ## Start Docker services
	docker-compose up -d

docker-down: ## Stop Docker services
	docker-compose down

docker-clean: ## Remove all containers, volumes, and images
	docker-compose down -v --rmi all

seed: ## Seed database with sample data
	@echo "Seeding database..."
	python scripts/seed_data.py
	@echo "✅ Database seeded with:"
	@echo "   - 3 organizations"
	@echo "   - 50 users (students, teachers, admins)"
	@echo "   - 20 courses across all tiers"
	@echo "   - 500+ assessments"

test: ## Run all tests
	@echo "Running backend tests..."
	cd services/api-core && pytest
	cd services/tutor-llm && pytest
	cd services/assess && pytest
	cd services/adaptive && pytest
	@echo "Running frontend tests..."
	cd apps/web && npm test
	@echo "✅ All tests passed"

test-unit: ## Run unit tests only
	@echo "Running unit tests..."
	pytest services/*/tests/unit/

test-integration: ## Run integration tests
	@echo "Running integration tests..."
	pytest services/*/tests/integration/

test-coverage: ## Run tests with coverage report
	@echo "Running tests with coverage..."
	pytest --cov=services --cov-report=html --cov-report=term
	@echo "Coverage report: htmlcov/index.html"

e2e: ## Run end-to-end tests
	@echo "Starting E2E tests..."
	cd apps/web && npx playwright test
	@echo "✅ E2E tests completed"

lint: ## Lint all code
	@echo "Linting Python..."
	ruff check services/
	@echo "Linting TypeScript..."
	cd apps/web && npm run lint
	cd apps/admin && npm run lint

format: ## Format all code
	@echo "Formatting Python..."
	ruff format services/
	@echo "Formatting TypeScript..."
	cd apps/web && npm run format
	cd apps/admin && npm run format

check-types: ## Type check TypeScript
	cd apps/web && npm run type-check
	cd apps/admin && npm run type-check

check-schemas: ## Validate OpenAPI schemas
	@echo "Validating API schemas..."
	python scripts/validate_schemas.py

clean: ## Clean build artifacts
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	find . -type d -name "node_modules" -exec rm -rf {} +
	find . -type d -name ".next" -exec rm -rf {} +
	find . -type d -name "dist" -exec rm -rf {} +

db-migrate: ## Run database migrations
	cd services/api-core && alembic upgrade head

db-rollback: ## Rollback last migration
	cd services/api-core && alembic downgrade -1

db-reset: ## Reset database (DESTRUCTIVE)
	@echo "⚠️  This will destroy all data. Continue? [y/N]" && read ans && [ $${ans:-N} = y ]
	docker-compose down -v
	docker-compose up -d db
	sleep 5
	make db-migrate
	make seed

logs: ## Tail logs from all services
	docker-compose logs -f

logs-api: ## Tail API logs
	docker-compose logs -f api-core

logs-tutor: ## Tail tutor-llm logs
	docker-compose logs -f tutor-llm

status: ## Show service status
	docker-compose ps

shell-api: ## Open shell in api-core container
	docker-compose exec api-core bash

shell-db: ## Open PostgreSQL shell
	docker-compose exec db psql -U eureka

benchmark: ## Run performance benchmarks
	@echo "Running benchmarks..."
	python scripts/benchmark.py

security-scan: ## Run security scans
	@echo "Running security scans..."
	bandit -r services/
	npm audit --audit-level=moderate

docs: ## Generate documentation
	@echo "Generating documentation..."
	cd docs && mkdocs build

docs-serve: ## Serve documentation locally
	cd docs && mkdocs serve

proto-gen: ## Generate protobuf code (if used)
	@echo "Generating protobuf code..."
	# Add protoc commands here

update-deps: ## Update all dependencies
	@echo "Updating dependencies..."
	cd apps/web && npm update
	cd apps/admin && npm update
	pip install -U -r services/api-core/requirements.txt

ci: lint test check-types check-schemas ## Run CI pipeline locally

# Parallel branch helpers
branch-core: ## Create branch for core services
	git checkout -b core/services

branch-hs: ## Create branch for high school tier
	git checkout -b tier/hs

branch-ug: ## Create branch for undergraduate tier
	git checkout -b tier/ug

branch-grad: ## Create branch for graduate tier
	git checkout -b tier/grad

branch-med: ## Create branch for medical tier
	git checkout -b pro/medical

branch-law: ## Create branch for law tier
	git checkout -b pro/law

branch-mba: ## Create branch for MBA tier
	git checkout -b pro/mba

branch-eng: ## Create branch for engineering tier
	git checkout -b pro/eng

all-branches: ## Create all feature branches
	@echo "Creating all feature branches..."
	git checkout -b core/services && git checkout main
	git checkout -b tier/hs && git checkout main
	git checkout -b tier/ug && git checkout main
	git checkout -b tier/grad && git checkout main
	git checkout -b pro/medical && git checkout main
	git checkout -b pro/law && git checkout main
	git checkout -b pro/mba && git checkout main
	git checkout -b pro/eng && git checkout main
	@echo "✅ All branches created"
	@git branch

.DEFAULT_GOAL := help
