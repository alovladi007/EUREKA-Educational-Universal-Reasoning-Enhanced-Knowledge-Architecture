.PHONY: help install dev build test clean docker-up docker-down e2e-demo

help:
	@echo "EUREKA Monorepo Commands"
	@echo "========================"
	@echo "make install      - Install all dependencies"
	@echo "make dev          - Start all services in dev mode"
	@echo "make build        - Build all services"
	@echo "make test         - Run all tests"
	@echo "make docker-up    - Start Docker services"
	@echo "make docker-down  - Stop Docker services"
	@echo "make e2e-demo     - Run end-to-end demo"
	@echo "make clean        - Clean all build artifacts"

install:
	npm install
	cd services/tier-hs && npm install
	cd services/tier-ug && npm install
	cd services/tier-grad && npm install
	cd apps/web-hs && npm install
	cd apps/web-ug && npm install
	cd apps/web-grad && npm install
	cd apps/admin && npm install

dev:
	docker-compose up postgres redis -d
	npm run dev

build:
	npm run build

test:
	npm test

test-coverage:
	npm test -- --coverage

docker-up:
	docker-compose up -d
	@echo "Services starting..."
	@echo "High School:   http://localhost:3001 (API: http://localhost:8001)"
	@echo "Undergraduate: http://localhost:3002 (API: http://localhost:8002)"
	@echo "Graduate:      http://localhost:3003 (API: http://localhost:8003)"
	@echo "Admin:         http://localhost:3000"

docker-down:
	docker-compose down

docker-clean:
	docker-compose down -v
	docker system prune -f

e2e-demo:
	@echo "Running E2E Demo: HS → UG → Grad"
	@echo "================================"
	@echo "1. High School: Algebra I unit generation"
	curl -X POST http://localhost:8001/generate_unit \
		-H "Content-Type: application/json" \
		-d '{"subject":"algebra1","standard":"CCSS.MATH.CONTENT.HSA-CED.A.1"}'
	@echo "\n2. Undergraduate: Physics lab template"
	curl -X POST http://localhost:8002/lab_template \
		-H "Content-Type: application/json" \
		-d '{"course":"physics1","topic":"kinematics"}'
	@echo "\n3. Graduate: Literature review"
	curl -X POST http://localhost:8003/lit_review \
		-H "Content-Type: application/json" \
		-d '{"domain":"CS","papers":["sample1.pdf","sample2.pdf"]}'
	@echo "\nDemo complete!"

clean:
	rm -rf node_modules
	rm -rf services/*/node_modules
	rm -rf apps/*/node_modules
	rm -rf services/*/.pytest_cache
	rm -rf services/*/dist
	rm -rf apps/*/.next
	rm -rf apps/*/dist
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete

lint:
	npm run lint

format:
	npx prettier --write .

init-db:
	docker-compose up postgres -d
	sleep 3
	docker-compose exec postgres psql -U eureka -d eureka -f /docker-entrypoint-initdb.d/init.sql
