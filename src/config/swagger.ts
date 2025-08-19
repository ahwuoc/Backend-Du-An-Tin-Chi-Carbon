import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Tin Chi Carbon API',
      version: '1.0.0',
      description: 'API documentation for Tin Chi Carbon Backend',
      contact: {
        name: 'API Support',
        email: 'support@tinchicarbon.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server'
      },
      {
        url: 'https://your-production-domain.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: [
    './src/routes/*.router.ts',
    './src/controllers/*.controller.ts',
    './src/models/*.model.ts',
    './src/docs/*.docs.ts'
  ]
};

export const specs = swaggerJsdoc(options);
