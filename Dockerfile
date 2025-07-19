# Build multi-etapa para imagen más pequeña
FROM node:18.15.0-alpine AS builder

# Directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Etapa de producción
FROM node:18.15.0-alpine

# Instalar dumb-init para manejar señales
RUN apk add --no-cache dumb-init

# Crear usuario sin privilegios
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Directorio de trabajo
WORKDIR /app

# Copiar dependencias instaladas
COPY --from=builder /app/node_modules ./node_modules
COPY --chown=nodejs:nodejs . .

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=8000

# Exponer puerto
EXPOSE 8000

# Usar usuario sin privilegios
USER nodejs

# Comprobación de salud
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node healthcheck.js || exit 1

# Usar dumb-init para manejar señales
ENTRYPOINT ["dumb-init", "--"]

# Iniciar la aplicación
CMD ["node", "index.js"]