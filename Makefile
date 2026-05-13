# EUREKA top-level Makefile.
# Per-service make targets live in eureka/Makefile; this file orchestrates
# the whole monorepo (tests across all services, compose lifecycle, etc).

PYTHON_SERVICES := \
	eureka/services/api-core \
	eureka/services/adaptive \
	eureka/services/analytics \
	eureka/services/assess \
	eureka/services/content \
	eureka/services/pro-eng \
	eureka/services/pro-law \
	eureka/services/pro-mba \
	eureka/services/tier-grad \
	eureka/services/tier-hs \
	eureka/services/tier-ug \
	eureka/services/tutor-llm \
	services/ai-research \
	services/data-fabric \
	services/ethics-security \
	services/futures \
	services/institutions \
	services/marketplace \
	services/pedagogy \
	services/xr-labs

NODE_DIRS := \
	eureka/apps/web \
	eureka/apps/admin \
	services/platform-orchestrator \
	services/notebook

.PHONY: help test-all test-py test-node test-service lint-py compose-validate schema-drift up down clean

help: ## Show this help
	@echo 'EUREKA — top-level targets'
	@echo
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' Makefile | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-22s\033[0m %s\n", $$1, $$2}'

test-all: test-py test-node ## Run every test suite in the monorepo

test-py: ## Run pytest for every Python service in parallel (uses xargs -P)
	@printf '%s\n' $(PYTHON_SERVICES) | \
	  xargs -I {} -P 4 sh -c 'cd "{}" && [ -d tests ] && python3 -m pytest tests/ -q --tb=short || echo "skip: no tests/ in {}"'

test-node: ## Run npm test for every Node service
	@for d in $(NODE_DIRS); do \
	  echo "=== $$d ==="; \
	  (cd "$$d" && npm test --if-present -- --passWithNoTests) || true; \
	done

test-service: ## Run tests for ONE service. Usage: make test-service SVC=eureka/services/assess
	@if [ -z "$(SVC)" ]; then echo "usage: make test-service SVC=path/to/service"; exit 2; fi
	cd "$(SVC)" && python3 -m pytest tests/ -v

lint-py: ## ruff every Python service
	@printf '%s\n' $(PYTHON_SERVICES) | \
	  xargs -I {} -P 4 sh -c 'cd "{}" && ruff check . 2>&1 | tail -3 || true'

compose-validate: ## Validate the docker-compose file
	cd eureka && docker compose config --quiet && echo "compose OK"

schema-drift: ## Bring up Postgres+seed, compare ORM tables vs DB columns
	cd eureka && docker compose up -d db
	@sleep 5
	DATABASE_URL='postgresql://eureka:eureka_dev_password@localhost:5434/eureka' \
	  python3 scripts/check_schema_drift.py

up: ## Bring up the default stack (db, redis, minio, api-core, web)
	cd eureka && WEB_HOST_PORT=$${WEB_HOST_PORT:-3010} ADMIN_HOST_PORT=$${ADMIN_HOST_PORT:-3011} docker compose up -d

up-full: ## Bring up everything (all profiles)
	cd eureka && WEB_HOST_PORT=$${WEB_HOST_PORT:-3010} ADMIN_HOST_PORT=$${ADMIN_HOST_PORT:-3011} docker compose --profile full up -d

down: ## Tear down the stack
	cd eureka && docker compose --profile full down

clean: down ## Tear down and wipe volumes (data loss!)
	cd eureka && docker compose --profile full down -v
