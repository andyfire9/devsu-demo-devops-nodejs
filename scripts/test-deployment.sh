#!/bin/bash

# Script de prueba de despliegue
set -e

echo "🧪 Probando el despliegue de la aplicación Node.js"
echo "========================================"

# Colores para la salida
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' 

# Función para verificar si un comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Verificar prerequisitos
echo "📋 Verificando prerequisitos..."
for cmd in docker kubectl node npm; do
    if command_exists "$cmd"; then
        echo -e "${GREEN}✓${NC} $cmd está instalado"
    else
        echo -e "${RED}✗${NC} $cmd no está instalado"
        exit 1
    fi
done

# Probar build de Docker
echo -e "\n🐳 Probando build de Docker..."
if docker build -t devsu-test:latest .; then
    echo -e "${GREEN}✓${NC} Build de Docker exitoso"
else
    echo -e "${RED}✗${NC} Falló el build de Docker"
    exit 1
fi

# Probar aplicación Node.js
echo -e "\n📦 Probando aplicación Node.js..."
if npm test; then
    echo -e "${GREEN}✓${NC} Pruebas exitosas"
else
    echo -e "${RED}✗${NC} Fallaron las pruebas"
fi

# Verificar conexión a Kubernetes
echo -e "\n☸️  Probando conexión a Kubernetes..."
if kubectl cluster-info; then
    echo -e "${GREEN}✓${NC} El clúster de Kubernetes es accesible"
else
    echo -e "${RED}✗${NC} No se puede conectar al clúster de Kubernetes"
fi

# Validar manifiestos de Kubernetes
echo -e "\n📝 Validando manifiestos de Kubernetes..."
for file in k8s/*.yaml; do
    if kubectl apply --dry-run=client -f "$file" >/dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} $file es válido"
    else
        echo -e "${RED}✗${NC} $file tiene errores"
    fi
done

echo -e "\n Despliegue de prueba completado"