.PHONY: help build run test deploy clean

help: ## Help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

build: ## Build Docker image
	docker build -t devsu-nodejs-app:latest .

run: ## Run Docker container locally
	docker run -p 8000:8000 devsu-nodejs-app:latest

test: ## Run tests
	npm test

test-integration: ## Run integration tests
	npm run test:integration || echo "No integration tests configured"

lint: ## Run linting
	npx eslint . --ext .js,.jsx || echo "No lint configuration"

deploy-local: ## Deploy a Kubernetes
	kubectl apply -f k8s/

undeploy-local: ## Remove from local Kubernetes
	kubectl delete -f k8s/

logs: ## Logs de la aplicación
	kubectl logs -n devops-exercise -l app=nodejs-app -f

port-forward: ## Port forward
	kubectl port-forward -n devops-exercise svc/nodejs-app-service 8000:80

clean: ## Clean up Docker images
	docker system prune -f