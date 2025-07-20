import sequelize from './shared/database/database.js'
import { usersRouter } from "./users/router.js"
import express from 'express'
<<<<<<< HEAD
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec from './swagger/config.js'
=======
import cors from 'cors' 
>>>>>>> 292c882108427fb10cabda6133b35d08bcfb1bb6

const app = express()
const PORT = 8000

<<<<<<< HEAD
// Middleware
app.use(cors())
=======
app.use(cors());

sequelize.sync({ force: true }).then(() => console.log('db is ready'))

>>>>>>> 292c882108427fb10cabda6133b35d08bcfb1bb6
app.use(express.json())

// Documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'User Management API Documentation',
    swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        docExpansion: 'none',
        filter: true,
        showExtensions: true,
        showCommonExtensions: true,
        displayOperationId: false
    }
}))

// Servir Swagger JSON
app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
})

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'User Management API',
        version: '1.0.0',
        documentation: `http://localhost:${PORT}/api-docs`,
        endpoints: {
            users: '/api/users',
            health: '/health'
        }
    })
})

// Endpoint de salud
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    })
})

// DB connection
sequelize.sync({ force: true }).then(() => console.log('db is ready'))

// Rutas de la API
app.use('/api/users', usersRouter)

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ error: 'Something went wrong!' })
})

// Middleware para 404
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' })
})

let server

if (process.env.NODE_ENV !== 'test') {
    server = app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
        console.log(`API Documentation available at http://localhost:${PORT}/api-docs`)
    })
} else {
    server = require('http').createServer(app)
}

export { app, server }