# EUREKA Test Prep Platform - Makefile

.PHONY: help install dev prod test clean docker-up docker-down docker-build

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Install all dependencies
	cd backend && pip install -r requirements.txt
	cd frontend && npm install

dev-backend: ## Run backend in development mode
	cd backend && uvicorn app.main:app --reload --port 8000

dev-frontend: ## Run frontend in development mode
	cd frontend && npm start

dev: ## Run both frontend and backend in development mode
	make -j 2 dev-backend dev-frontend

test-backend: ## Run backend tests
	cd backend && pytest tests/ -v --cov=app

test-frontend: ## Run frontend tests
	cd frontend && npm test

test: ## Run all tests
	make test-backend
	make test-frontend

lint-backend: ## Lint backend code
	cd backend && black . && flake8 app/

lint-frontend: ## Lint frontend code
	cd frontend && npm run lint

lint: ## Lint all code
	make lint-backend
	make lint-frontend

migrate: ## Run database migrations
	cd backend && alembic upgrade head

seed: ## Seed the database with sample data
	cd backend && python seed_database.py

docker-build: ## Build Docker containers
	cd docker && docker-compose build

docker-up: ## Start Docker containers
	cd docker && docker-compose up -d

docker-down: ## Stop Docker containers
	cd docker && docker-compose down

docker-logs: ## View Docker logs
	cd docker && docker-compose logs -f

docker-reset: ## Reset Docker environment
	make docker-down
	docker volume prune -f
	make docker-build
	make docker-up
	sleep 5
	docker exec eureka-backend python seed_database.py

clean: ## Clean up temporary files
	find . -type f -name '*.pyc' -delete
	find . -type d -name '__pycache__' -delete
	find . -type d -name '.pytest_cache' -delete
	find . -type f -name '.coverage' -delete
	rm -rf backend/htmlcov
	rm -rf frontend/build
	rm -rf frontend/node_modules
	rm -rf backend/venv

setup: ## Complete setup for new developers
	make install
	cp .env.example .env
	make migrate
	make seed
	@echo "Setup complete! Edit .env file with your configuration then run 'make dev'"

prod-build: ## Build for production
	cd frontend && npm run build
	cd backend && pip install -r requirements.txt --no-dev

deploy: ## Deploy to production (customize as needed)
	@echo "Deploying to production..."
	make prod-build
	# Add your deployment commands here
