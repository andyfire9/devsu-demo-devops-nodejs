import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User Management API',
      version: '1.0.0',
      description: 'A comprehensive user management REST API with CRUD operations and soft-delete functionality',
      contact: {
        name: 'DevOps Team',
        email: 'devops@example.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:8000',
        description: 'Development server',
      },
      {
        url: 'https://api.example.com',
        description: 'Production server',
      },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          required: ['dni', 'name'],
          properties: {
            id: {
              type: 'integer',
              description: 'User ID',
              example: 1,
              readOnly: true,
            },
            dni: {
              type: 'string',
              description: 'Document National Identity',
              example: '12345678',
              uniqueItems: true,
            },
            name: {
              type: 'string',
              description: 'User full name',
              example: 'John Doe',
            },
            active: {
              type: 'boolean',
              description: 'User active status',
              example: true,
              default: true,
            },
          },
        },
        UserInput: {
          type: 'object',
          required: ['dni', 'name'],
          properties: {
            dni: {
              type: 'string',
              description: 'Document National Identity',
              example: '12345678',
            },
            name: {
              type: 'string',
              description: 'User full name',
              example: 'John Doe',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
              example: 'User not found',
            },
          },
        },
        ValidationError: {
          type: 'object',
          properties: {
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string',
                    example: 'dni',
                  },
                  message: {
                    type: 'string',
                    example: 'DNI is required',
                  },
                },
              },
            },
          },
        },
        Message: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Success message',
              example: 'User deactivated',
            },
            user: {
              $ref: '#/components/schemas/User',
            },
          },
        },
      },
      responses: {
        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                error: 'User not found: 123',
              },
            },
          },
        },
        BadRequest: {
          description: 'Invalid request',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                error: 'User already exists: 12345678',
              },
            },
          },
        },
        ValidationError: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ValidationError',
              },
            },
          },
        },
        InternalError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                error: 'Internal Server Error',
              },
            },
          },
        },
      },
    },
  },
  apis: ['./users/router.js', './swagger/annotations.js'], // api routes
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;

//gotta love swagger and its auto snippets