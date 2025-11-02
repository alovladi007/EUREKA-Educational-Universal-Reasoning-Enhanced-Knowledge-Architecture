.PHONY: help install dev build test clean docker-up docker-down docker-logs db-migrate db-seed db-reset

# Colors for terminal output
GREEN  := $(shell tput -Txterm setaf 2)
YELLOW := $(shell tput -Txterm setaf 3)
WHITE  := $(shell tput -Txterm setaf 7)
CYAN   := $(shell tput -Txterm setaf 6)
RESET  := $(shell tput -Txterm sgr0)

## Show help
help:
	@echo ''
	@echo 'Usage:'
	@echo '  ${YELLOW}make${RESET} ${GREEN}<target>${RESET}'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} { \
		if (/^[a-zA-Z_-]+:.*?##.*$$/) {printf "  ${YELLOW}%-20s${GREEN}%s${RESET}\n", $$1, $$2} \
		else if (/^## .*$$/) {printf "  ${CYAN}%s${RESET}\n", substr($$1,4)} \
		}' $(MAKEFILE_LIST)

## Development Commands

install: ## Install all dependencies
	@echo "${GREEN}Installing dependencies...${RESET}"
	pnpm install
	@echo "${GREEN}✓ Dependencies installed${RESET}"

dev: ## Start development servers
	@echo "${GREEN}Starting development servers...${RESET}"
	pnpm dev

build: ## Build all packages and apps
	@echo "${GREEN}Building all packages and apps...${RESET}"
	pnpm build
	@echo "${GREEN}✓ Build complete${RESET}"

test: ## Run all tests
	@echo "${GREEN}Running tests...${RESET}"
	pnpm test

test-coverage: ## Run tests with coverage
	@echo "${GREEN}Running tests with coverage...${RESET}"
	pnpm test:coverage

test-e2e: ## Run E2E tests
	@echo "${GREEN}Running E2E tests...${RESET}"
	pnpm test:e2e

lint: ## Lint all code
	@echo "${GREEN}Linting code...${RESET}"
	pnpm lint

lint-fix: ## Fix linting issues
	@echo "${GREEN}Fixing linting issues...${RESET}"
	pnpm lint:fix

format: ## Format code with Prettier
	@echo "${GREEN}Formatting code...${RESET}"
	pnpm format

typecheck: ## Type check all TypeScript
	@echo "${GREEN}Type checking...${RESET}"
	pnpm typecheck

clean: ## Clean build artifacts and dependencies
	@echo "${YELLOW}Cleaning build artifacts...${RESET}"
	pnpm clean
	rm -rf node_modules
	find . -name 'node_modules' -type d -prune -exec rm -rf '{}' +
	find . -name 'dist' -type d -prune -exec rm -rf '{}' +
	find . -name '.next' -type d -prune -exec rm -rf '{}' +
	@echo "${GREEN}✓ Clean complete${RESET}"

## Docker Commands

docker-up: ## Start all Docker services
	@echo "${GREEN}Starting Docker services...${RESET}"
	docker compose -f infra/docker/docker-compose.yml up -d
	@echo "${GREEN}✓ Services started${RESET}"
	@echo "${CYAN}Web: http://localhost:3000${RESET}"
	@echo "${CYAN}API: http://localhost:8000${RESET}"
	@echo "${CYAN}Admin: http://localhost:3001${RESET}"

docker-down: ## Stop all Docker services
	@echo "${YELLOW}Stopping Docker services...${RESET}"
	docker compose -f infra/docker/docker-compose.yml down
	@echo "${GREEN}✓ Services stopped${RESET}"

docker-down-v: ## Stop Docker services and remove volumes
	@echo "${YELLOW}Stopping Docker services and removing volumes...${RESET}"
	docker compose -f infra/docker/docker-compose.yml down -v
	@echo "${GREEN}✓ Services stopped and volumes removed${RESET}"

docker-logs: ## View Docker logs
	docker compose -f infra/docker/docker-compose.yml logs -f

docker-ps: ## List running Docker containers
	docker compose -f infra/docker/docker-compose.yml ps

docker-build: ## Build Docker images
	@echo "${GREEN}Building Docker images...${RESET}"
	docker compose -f infra/docker/docker-compose.yml build
	@echo "${GREEN}✓ Build complete${RESET}"

docker-restart: ## Restart Docker services
	@echo "${YELLOW}Restarting Docker services...${RESET}"
	$(MAKE) docker-down
	$(MAKE) docker-up

## Database Commands

db-migrate: ## Run database migrations
	@echo "${GREEN}Running database migrations...${RESET}"
	cd services/qbank && alembic upgrade head
	cd services/content && alembic upgrade head
	cd services/cases && alembic upgrade head
	cd services/osce && alembic upgrade head
	cd services/anatomy3d && alembic upgrade head
	cd services/grading && alembic upgrade head
	cd services/audit && alembic upgrade head
	@echo "${GREEN}✓ Migrations complete${RESET}"

db-seed: ## Seed database with test data
	@echo "${GREEN}Seeding database...${RESET}"
	pnpm db:seed
	@echo "${GREEN}✓ Database seeded${RESET}"

db-reset: ## Reset and reseed database
	@echo "${YELLOW}Resetting database...${RESET}"
	$(MAKE) docker-down-v
	$(MAKE) docker-up
	@echo "${YELLOW}Waiting for database to be ready...${RESET}"
	@sleep 10
	$(MAKE) db-migrate
	$(MAKE) db-seed
	@echo "${GREEN}✓ Database reset complete${RESET}"

db-shell: ## Open PostgreSQL shell
	docker exec -it medatlas-postgres psql -U medatlas -d medatlas

## Code Generation

codegen: ## Generate OpenAPI clients
	@echo "${GREEN}Generating OpenAPI clients...${RESET}"
	pnpm codegen
	@echo "${GREEN}✓ Code generation complete${RESET}"

## Health Checks

health: ## Check health of all services
	@echo "${GREEN}Checking service health...${RESET}"
	@curl -sf http://localhost:8000/health && echo "✓ API Gateway" || echo "✗ API Gateway"
	@curl -sf http://localhost:8001/health && echo "✓ QBank" || echo "✗ QBank"
	@curl -sf http://localhost:8002/health && echo "✓ Content" || echo "✗ Content"
	@curl -sf http://localhost:8003/health && echo "✓ Cases" || echo "✗ Cases"
	@curl -sf http://localhost:8004/health && echo "✓ OSCE" || echo "✗ OSCE"
	@curl -sf http://localhost:8005/health && echo "✓ Anatomy3D" || echo "✗ Anatomy3D"
	@curl -sf http://localhost:8006/health && echo "✓ Grading" || echo "✗ Grading"
	@curl -sf http://localhost:8007/health && echo "✓ Audit" || echo "✗ Audit"
	@curl -sf http://localhost:8008/health && echo "✓ ML Hub" || echo "✗ ML Hub"

## Setup

setup: install docker-up db-migrate db-seed ## Complete first-time setup
	@echo "${GREEN}✓ Setup complete!${RESET}"
	@echo ""
	@echo "${CYAN}Next steps:${RESET}"
	@echo "  1. Open http://localhost:3000"
	@echo "  2. Check API docs at http://localhost:8000/docs"
	@echo "  3. Run ${GREEN}make help${RESET} to see all available commands"

## Deployment

deploy-staging: ## Deploy to staging environment
	@echo "${GREEN}Deploying to staging...${RESET}"
	kubectl apply -f infra/k8s/staging/
	@echo "${GREEN}✓ Deployment complete${RESET}"

deploy-production: ## Deploy to production environment
	@echo "${YELLOW}Deploying to production...${RESET}"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		kubectl apply -f infra/k8s/production/; \
		echo "${GREEN}✓ Deployment complete${RESET}"; \
	else \
		echo "${YELLOW}Deployment cancelled${RESET}"; \
	fi
