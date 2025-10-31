.PHONY: help install dev test clean docker-up docker-down docker-logs seed docs lint format

help:  ## Show this help message
	@echo "EUREKA Medical School Service - Makefile Commands"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install:  ## Install dependencies
	pip install -r requirements.txt

dev:  ## Run development server
	python main.py

test:  ## Run tests
	pytest tests/ -v

test-cov:  ## Run tests with coverage
	pytest tests/ --cov=app --cov-report=html --cov-report=term

clean:  ## Clean up cache and temporary files
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	find . -type f -name "*.pyo" -delete
	find . -type d -name ".pytest_cache" -exec rm -rf {} +
	find . -type d -name "*.egg-info" -exec rm -rf {} +
	rm -rf htmlcov/ .coverage

docker-up:  ## Start Docker services
	docker-compose up -d

docker-down:  ## Stop Docker services
	docker-compose down

docker-down-v:  ## Stop Docker services and remove volumes
	docker-compose down -v

docker-logs:  ## View Docker logs
	docker-compose logs -f medical-school

docker-build:  ## Rebuild Docker images
	docker-compose build

docker-restart:  ## Restart Docker services
	docker-compose restart

seed:  ## Seed database with sample data
	python seed_data.py

db-init:  ## Initialize database (create tables)
	python -c "from app.database import engine, Base; import asyncio; asyncio.run(engine.begin().__aenter__().run_sync(Base.metadata.create_all()))"

docs:  ## Generate API documentation
	@echo "API documentation available at: http://localhost:8020/docs"
	@echo "Alternative docs at: http://localhost:8020/redoc"

lint:  ## Run linting
	black --check app/ tests/
	isort --check-only app/ tests/
	mypy app/

format:  ## Format code
	black app/ tests/
	isort app/ tests/

check:  ## Run all checks (lint + test)
	@echo "Running code formatting..."
	make format
	@echo "Running tests..."
	make test

health:  ## Check service health
	@curl -s http://localhost:8020/health | python -m json.tool

api-test:  ## Quick API test
	@echo "Testing health endpoint..."
	@curl -s http://localhost:8020/health
	@echo "\n\nTesting root endpoint..."
	@curl -s http://localhost:8020/
	@echo "\n"

shell:  ## Open Python shell with app context
	python -i -c "from app import *"

docker-shell:  ## Open shell in Docker container
	docker-compose exec medical-school /bin/bash

psql:  ## Connect to PostgreSQL database
	docker-compose exec postgres psql -U eureka -d eureka

redis-cli:  ## Connect to Redis
	docker-compose exec redis redis-cli

# Development workflow shortcuts
dev-setup: install docker-up db-init seed  ## Complete development setup
	@echo "✅ Development environment ready!"
	@echo "API running at: http://localhost:8020"
	@echo "API docs at: http://localhost:8020/docs"

dev-reset: docker-down-v docker-up db-init seed  ## Reset development environment
	@echo "✅ Development environment reset!"

# Production commands
prod-start:  ## Start in production mode
	gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8020

# Monitoring
stats:  ## Show service statistics
	@echo "Docker containers:"
	@docker-compose ps
	@echo "\nDatabase tables:"
	@docker-compose exec postgres psql -U eureka -d eureka -c "\dt"

# Backup
backup-db:  ## Backup database
	docker-compose exec postgres pg_dump -U eureka eureka > backup_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "✅ Database backed up"

restore-db:  ## Restore database from backup (usage: make restore-db FILE=backup.sql)
	@if [ -z "$(FILE)" ]; then echo "Usage: make restore-db FILE=backup.sql"; exit 1; fi
	docker-compose exec -T postgres psql -U eureka eureka < $(FILE)
	@echo "✅ Database restored"
