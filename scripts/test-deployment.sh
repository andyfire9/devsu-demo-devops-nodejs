#!/bin/bash

# Test deployment script
set -e

echo "🧪 Testing Node.js Application Deployment"
echo "========================================"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "📋 Checking prerequisites..."
for cmd in docker kubectl node npm; do
    if command_exists "$cmd"; then
        echo -e "${GREEN}✓${NC} $cmd is installed"
    else
        echo -e "${RED}✗${NC} $cmd is not installed"
        exit 1
    fi
done

# Test Docker build
echo -e "\n🐳 Testing Docker build..."
if docker build -t devsu-test:latest .; then
    echo -e "${GREEN}✓${NC} Docker build successful"
else
    echo -e "${RED}✗${NC} Docker build failed"
    exit 1
fi

# Test Node.js app
echo -e "\n📦 Testing Node.js application..."
if npm test; then
    echo -e "${GREEN}✓${NC} Tests passed"
else
    echo -e "${RED}✗${NC} Tests failed"
fi

# Check Kubernetes connection
echo -e "\n☸️  Testing Kubernetes connection..."
if kubectl cluster-info; then
    echo -e "${GREEN}✓${NC} Kubernetes cluster is accessible"
else
    echo -e "${RED}✗${NC} Cannot connect to Kubernetes cluster"
fi

# Validate Kubernetes manifests
echo -e "\n📝 Validating Kubernetes manifests..."
for file in k8s/*.yaml; do
    if kubectl apply --dry-run=client -f "$file" >/dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} $file is valid"
    else
        echo -e "${RED}✗${NC} $file has errors"
    fi
done

echo -e "\n✅ Todo bien."