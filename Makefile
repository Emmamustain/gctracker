OS := $(shell uname 2>/dev/null || echo Windows_NT)
HR=━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ARGS = $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))

setup: init hosts-config generate-certs
	@echo $(HR)
	@echo 🧱 Building TypeScript projects: shared/types and shared/drizzle...
	pnpm tsc -b packages/shared/types packages/shared/drizzle
	@echo ✅ TypeScript build completed!
	@echo 🎉 Setup complete! Run 'make help' for commands.
	@echo $(HR)

init:
ifeq ($(OS),Windows_NT)
	@powershell -ExecutionPolicy Bypass -Command "[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; .\scripts\set-encoding.ps1"
endif
	@echo $(HR)
	@echo 🚀 Setting up Next-Nest Monorepo Project...
	@echo $(HR)
	@echo 📦 Installing dependencies...
	pnpm install
	@echo ✅ Dependencies installed successfully!
	@echo 📁 Project structure:
	@echo   apps/frontend  - Next.js Frontend
	@echo   apps/backend   - Nest.js Backend
	@echo   packages/      - Shared packages
	@echo 🐳 Start Docker:
	@echo   make up  - Launch development containers
	@echo   make prod - Launch production containers

hosts-config:
	@echo $(HR)
	@echo 🔄 Updating hosts file...
ifeq ($(OS),Windows_NT)
	@powershell -ExecutionPolicy Bypass -NoProfile -Command "& {$$OutputEncoding = [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; .\scripts\update-hosts.ps1}"
else
	-@if [ $$(id -u) -ne 0 ]; then \
		echo "⚠️ Warning: Not running as root - hosts file will not be updated"; \
		echo "💡 To enable local domain access, manually add these entries to your hosts file:"; \
		echo "   127.0.0.1 zennstack.localhost"; \
		echo "   127.0.0.1 api.zennstack.localhost"; \
		echo "   127.0.0.1 traefik.zennstack.localhost"; \
	else \
		for domain in zennstack.localhost api.zennstack.localhost traefik.zennstack.localhost; do \
		    if ! grep -q "127.0.0.1 $$domain" /etc/hosts; then \
		        echo "127.0.0.1 $$domain" >> /etc/hosts; \
		    fi; \
		done; \
		echo "✅ Hosts file updated successfully!"; \
	fi
endif

generate-certs:
	@echo $(HR)
	@echo 🔐 Generating SSL certificates...
ifeq ($(OS),Windows_NT)
	@powershell -ExecutionPolicy Bypass -NoProfile -Command "& {$$OutputEncoding = [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; .\scripts\generate-certs.ps1}"
else
	@bash ./scripts/generate-certs.sh
endif

# Development commands
up:
ifeq ($(OS),Windows_NT)
	@powershell -ExecutionPolicy Bypass -Command "[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; .\scripts\set-encoding.ps1"
endif
	@echo $(HR)
	@echo 🚀 Starting development Docker containers...
	docker-compose -f docker-compose.dev.yml up --build

upd:
ifeq ($(OS),Windows_NT)
	@powershell -ExecutionPolicy Bypass -Command "[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; .\scripts\set-encoding.ps1"
endif
	@echo $(HR)
	@echo 🚀 Starting development Docker containers in background...
	docker-compose -f docker-compose.dev.yml up -d --build

down:
ifeq ($(OS),Windows_NT)
	@powershell -ExecutionPolicy Bypass -Command "[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; .\scripts\set-encoding.ps1"
endif
	@echo $(HR)
	@echo 🛑 Stopping development Docker containers...
	docker-compose -f docker-compose.dev.yml down

restart:
ifeq ($(OS),Windows_NT)
	@powershell -ExecutionPolicy Bypass -Command "[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; .\scripts\set-encoding.ps1"
endif
	@echo $(HR)
	@echo 🔄 Restarting development Docker containers...
	docker-compose -f docker-compose.dev.yml down
	docker-compose -f docker-compose.dev.yml up --build

# Production commands
prod:
ifeq ($(OS),Windows_NT)
	@powershell -ExecutionPolicy Bypass -Command "[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; .\scripts\set-encoding.ps1"
endif
	@echo $(HR)
	@echo 🚀 Starting production Docker containers...
	docker-compose -f docker-compose.prod.yml up --build

prod-up:
ifeq ($(OS),Windows_NT)
	@powershell -ExecutionPolicy Bypass -Command "[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; .\scripts\set-encoding.ps1"
endif
	@echo $(HR)
	@echo 🚀 Starting production Docker containers in background...
	docker-compose -f docker-compose.prod.yml up -d --build

prod-down:
ifeq ($(OS),Windows_NT)
	@powershell -ExecutionPolicy Bypass -Command "[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; .\scripts\set-encoding.ps1"
endif
	@echo $(HR)
	@echo 🛑 Stopping production Docker containers...
	docker-compose -f docker-compose.prod.yml down

prod-build:
ifeq ($(OS),Windows_NT)
	@powershell -ExecutionPolicy Bypass -Command "[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; .\scripts\set-encoding.ps1"
endif
	@echo $(HR)
	@echo 🏗️ Building production Docker images...
	docker-compose -f docker-compose.prod.yml build

dev:
	@echo $(HR)
	@echo 🛠️  Starting development environment...
	pnpm dev

build:
	@echo $(HR)
	@echo 🏗️  Building all packages and applications...
	pnpm build

clean:
	@echo $(HR)
	@echo 🧹 Cleaning up...
	rm -rf node_modules
	rm -rf apps/*/node_modules
	rm -rf packages/*/node_modules
	rm -rf apps/*/dist
	rm -rf packages/*/dist

# --- Help ---
help:
ifeq ($(OS),Windows_NT)
	@powershell -ExecutionPolicy Bypass -Command "[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; .\scripts\set-encoding.ps1"
endif
	@echo $(HR)
	@echo 🛠️  Dotfiles Market Commands
	@echo $(HR)
	@echo "--- Setup ---"
	@echo "make setup          - Run this first to install dependencies and generate certs"
	@echo ""
	@echo "--- Development Docker ---"
	@echo "make up             - Start development services in the foreground (with build)"
	@echo "make upd            - Start development services in the background (detached)"
	@echo "make down           - Stop development services"
	@echo "make restart        - Rebuild and restart development services"
	@echo ""
	@echo "--- Production Docker ---"
	@echo "make prod           - Start production services in the foreground (with build)"
	@echo "make prod-up        - Start production services in the background (detached)"
	@echo "make prod-down      - Stop production services"
	@echo "make prod-build     - Build production Docker images only"
	@echo ""
	@echo "--- Package Management (run while containers are up) ---"
	@echo "make add-frontend-dep <name> - Add a dependency to the frontend"
	@echo "make add-frontend-dev <name> - Add a dev dependency to the frontend"
	@echo "make add-backend-dep <name>  - Add a dependency to the backend"
	@echo "make add-backend-dev <name>  - Add a dev dependency to the backend"
	@echo ""
	@echo "--- Database ---"
	@echo "make db-generate    - Generate a new SQL migration from schema changes"
	@echo "make db-migrate     - Apply pending migrations to the database"
	@echo "make db-seed        - Seed the database with initial data"
	@echo "make db-studio      - Open Drizzle Studio"
	@echo $(HR)

nest:
	@echo $(HR)
	@echo 🛠️  Running Nest command in the backend folder...
	@cd apps/backend && nest $*

backend:
	@echo $(HR)
	@echo "🛠️  Running command in the backend folder..."
	@cd apps/backend && $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))

frontend:
	@echo $(HR)
	@echo "🛠️  Running command in the frontend folder..."
	@cd apps/frontend && $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))

# --- Package Management ---
add-frontend-dep:
	@if [ -z "$(ARGS)" ]; then \
		echo "❌ Error: Missing package name. Usage: make add-frontend-dep <package-name>"; \
		exit 1; \
	fi
	@echo "📦 Installing dependency '$(ARGS)' in frontend container..."
	docker-compose -f docker-compose.dev.yml exec frontend pnpm add $(ARGS)
	@echo "✅ Done."

add-frontend-dev:
	@if [ -z "$(ARGS)" ]; then \
		echo "❌ Error: Missing package name. Usage: make add-frontend-dev <package-name>"; \
		exit 1; \
	fi
	@echo "📦 Installing dev dependency '$(ARGS)' in frontend container..."
	docker-compose -f docker-compose.dev.yml exec frontend pnpm add -D $(ARGS)
	@echo "✅ Done."

add-backend-dep:
	@if [ -z "$(ARGS)" ]; then \
		echo "❌ Error: Missing package name. Usage: make add-backend-dep <package-name>"; \
		exit 1; \
	fi
	@echo "📦 Installing dependency '$(ARGS)' in backend container..."
	docker-compose -f docker-compose.dev.yml exec backend pnpm add $(ARGS)
	@echo "✅ Done."

add-backend-dev:
	@if [ -z "$(ARGS)" ]; then \
		echo "❌ Error: Missing package name. Usage: make add-backend-dev <package-name>"; \
		exit 1; \
	fi
	@echo "📦 Installing dev dependency '$(ARGS)' in backend container..."
	docker-compose -f docker-compose.dev.yml exec backend pnpm add -D $(ARGS)
	@echo "✅ Done."

# --- Shadcn Commands ---
shadcn-add:
	@if [ -z "$(ARGS)" ]; then \
		echo "❌ Error: Missing package name. Usage: make shadcn <package-name>"; \
		exit 1; \
	fi
	@echo "📦 Installing dependency '$(ARGS)' in frontend container..."
	@cd apps/frontend && pnpm dlx shadcn@latest add $(ARGS)
	@echo "✅ Shadcn UI component files generated in container."
	@echo "🔄 Running pnpm install inside frontend container to sync dependencies..."
	docker-compose -f docker-compose.dev.yml exec -u $(shell id -u):$(shell id -g) frontend pnpm install
	@echo "✅ Frontend container dependencies synced."
	@echo "📦 Running pnpm install on host to update monorepo dependencies..."
	pnpm install
	@echo "✅ Done."

# --- Database Commands ---
db-migrate:
	@echo $(HR)
	@echo 🔄 Running database migrations...
	@cd packages/shared/drizzle && pnpm drizzle-kit push

db-seed:
	@echo $(HR)
	@echo 🔄 Seeding the database...
	@cd packages/shared/drizzle && pnpx ts-node ./seed.ts

db-studio:
	@echo $(HR)
	@echo 🛠️  Opening Drizzle Studio...
	@cd packages/shared/drizzle && pnpm drizzle-kit studio

db-generate:
	@echo $(HR)
	@echo 🛠️  Generating the SQL migration based on the current schema...
	@cd packages/shared/drizzle && pnpm drizzle-kit generate
	@:

.PHONY: setup init hosts-config generate-certs up upd down restart prod prod-up prod-down prod-build dev build clean help add-frontend-dep add-frontend-dev add-backend-dep add-backend-dev db-migrate db-seed db-studio db-generate
.DEFAULT: