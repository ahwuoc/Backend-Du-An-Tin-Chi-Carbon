#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Router information
const routers = [
  {
    name: 'auth',
    path: '/api/auth',
    description: 'User authentication and authorization endpoints',
    routes: [
      { method: 'POST', path: '/register', description: 'Register a new user' },
      { method: 'POST', path: '/login', description: 'Login user' },
      { method: 'POST', path: '/logout', description: 'Logout user' },
      { method: 'POST', path: '/forgot-password', description: 'Request password reset' },
      { method: 'POST', path: '/reset-password', description: 'Reset password with token' },
      { method: 'POST', path: '/change-password', description: 'Change user password' },
      { method: 'GET', path: '/users/me', description: 'Get current user information' },
      { method: 'GET', path: '/users', description: 'Get all users (Admin only)' },
      { method: 'PUT', path: '/users/update', description: 'Update user information' },
      { method: 'DELETE', path: '/:id', description: 'Delete user by ID (Admin only)' },
      { method: 'GET', path: '/user/infor-manger/:id', description: 'Get manager information by ID' }
    ]
  },
  {
    name: 'projects',
    path: '/api/projects',
    description: 'Project management endpoints',
    routes: [
      { method: 'POST', path: '/', description: 'Create a new project' },
      { method: 'PUT', path: '/:id', description: 'Update project' },
      { method: 'GET', path: '/', description: 'Get all projects' },
      { method: 'GET', path: '/:id', description: 'Get project by ID' },
      { method: 'GET', path: '/profile/:id', description: 'Get user profile project' },
      { method: 'PUT', path: '/activities/:id', description: 'Update project activities' },
      { method: 'PUT', path: '/documents/:id', description: 'Update project documents' },
      { method: 'PUT', path: '/documents/:projectId/:documentId/status', description: 'Update document status' }
    ]
  },
  {
    name: 'orders',
    path: '/api/orders',
    description: 'Order management endpoints',
    routes: [
      { method: 'POST', path: '/', description: 'Create a new order' },
      { method: 'GET', path: '/', description: 'Get all orders' },
      { method: 'GET', path: '/user/:userId', description: 'Get orders by user ID' },
      { method: 'GET', path: '/:id', description: 'Get order by ID' },
      { method: 'PUT', path: '/:id', description: 'Update order status' },
      { method: 'DELETE', path: '/:id', description: 'Delete order' }
    ]
  },
  {
    name: 'products',
    path: '/api/products',
    description: 'Product management endpoints',
    routes: [
      { method: 'POST', path: '/', description: 'Create a new product' },
      { method: 'GET', path: '/', description: 'Get all products' },
      { method: 'GET', path: '/:id', description: 'Get product by ID' },
      { method: 'PUT', path: '/timelines/:id', description: 'Update product timeline' },
      { method: 'PUT', path: '/reports/:id', description: 'Update product reports' },
      { method: 'PUT', path: '/features/:id', description: 'Update product features' },
      { method: 'PUT', path: '/benefits/:id', description: 'Update product benefits' },
      { method: 'PUT', path: '/certificates/:id', description: 'Update product certificates' },
      { method: 'PUT', path: '/:id', description: 'Update product' },
      { method: 'DELETE', path: '/:id', description: 'Delete product' }
    ]
  },
  {
    name: 'news',
    path: '/api/news',
    description: 'News management endpoints',
    routes: [
      { method: 'POST', path: '/', description: 'Create a new news article' },
      { method: 'GET', path: '/', description: 'Get all news articles' },
      { method: 'GET', path: '/:id', description: 'Get news article by ID' },
      { method: 'PUT', path: '/:id', description: 'Update news article' },
      { method: 'DELETE', path: '/:id', description: 'Delete news article' }
    ]
  },
  {
    name: 'donation',
    path: '/api/donation',
    description: 'Donation management endpoints',
    routes: [
      { method: 'POST', path: '/', description: 'Create a new donation' },
      { method: 'GET', path: '/', description: 'Get all donations' },
      { method: 'GET', path: '/infor', description: 'Get donation information' },
      { method: 'GET', path: '/orderCode/:id', description: 'Get donation and update status' },
      { method: 'PUT', path: '/:id', description: 'Update donation' },
      { method: 'DELETE', path: '/:id', description: 'Delete donation' }
    ]
  },
  {
    name: 'consultation',
    path: '/api/consultation',
    description: 'Consultation management endpoints',
    routes: [
      { method: 'POST', path: '/', description: 'Create a new consultation request' },
      { method: 'GET', path: '/', description: 'Get all consultation requests' },
      { method: 'DELETE', path: '/:id', description: 'Delete consultation request' }
    ]
  },
  {
    name: 'affiliates',
    path: '/api/affiliates',
    description: 'Affiliate management endpoints',
    routes: [
      { method: 'POST', path: '/', description: 'Create a new affiliate' },
      { method: 'GET', path: '/', description: 'Get all affiliates' },
      { method: 'GET', path: '/:id', description: 'Get affiliate by user ID' },
      { method: 'PATCH', path: '/:id', description: 'Update affiliate' },
      { method: 'DELETE', path: '/:id', description: 'Delete affiliate' }
    ]
  },
  {
    name: 'project-carbons',
    path: '/api/project-carbons',
    description: 'Project carbon management endpoints',
    routes: [
      { method: 'POST', path: '/', description: 'Create a new project carbon' },
      { method: 'GET', path: '/', description: 'Get all project carbons' },
      { method: 'GET', path: '/:id', description: 'Get project carbon by ID' },
      { method: 'PUT', path: '/:id', description: 'Update project carbon' },
      { method: 'DELETE', path: '/:id', description: 'Delete project carbon' }
    ]
  },
  {
    name: 'carbon-products',
    path: '/api/carbons',
    description: 'Carbon product management endpoints',
    routes: [
      { method: 'POST', path: '/', description: 'Create a new carbon product' },
      { method: 'GET', path: '/', description: 'Get all carbon products' },
      { method: 'GET', path: '/:id', description: 'Get carbon product by ID' },
      { method: 'PUT', path: '/:id', description: 'Update carbon product' },
      { method: 'DELETE', path: '/:id', description: 'Delete carbon product' }
    ]
  },
  {
    name: 'certificates',
    path: '/api/certificates',
    description: 'Certificate management endpoints',
    routes: [
      { method: 'POST', path: '/', description: 'Create a new certificate' },
      { method: 'GET', path: '/', description: 'Get all certificates' },
      { method: 'GET', path: '/:id', description: 'Get certificate by ID' },
      { method: 'PUT', path: '/:id', description: 'Update certificate' },
      { method: 'DELETE', path: '/:id', description: 'Delete certificate' }
    ]
  },
  {
    name: 'carbon-credits',
    path: '/api/carboncredits',
    description: 'Carbon credit management endpoints',
    routes: [
      { method: 'POST', path: '/', description: 'Create a new carbon credit' },
      { method: 'GET', path: '/', description: 'Get all carbon credits' },
      { method: 'GET', path: '/:id', description: 'Get carbon credit by ID' },
      { method: 'PUT', path: '/:id', description: 'Update carbon credit' },
      { method: 'DELETE', path: '/:id', description: 'Delete carbon credit' }
    ]
  },
  {
    name: 'affiliate-payment-methods',
    path: '/api/payment-method',
    description: 'Affiliate payment method management endpoints',
    routes: [
      { method: 'POST', path: '/', description: 'Create a new affiliate payment method' },
      { method: 'GET', path: '/', description: 'Get all affiliate payment methods' },
      { method: 'GET', path: '/:id', description: 'Get affiliate payment methods by ID' },
      { method: 'PUT', path: '/:id', description: 'Update affiliate payment method' },
      { method: 'DELETE', path: '/:id', description: 'Delete affiliate payment method' }
    ]
  },
  {
    name: 'affiliate-transactions',
    path: '/api/transactions',
    description: 'Affiliate transaction management endpoints',
    routes: [
      { method: 'POST', path: '/', description: 'Create a new affiliate transaction' },
      { method: 'GET', path: '/', description: 'Get all affiliate transactions' },
      { method: 'GET', path: '/:id', description: 'Get affiliate transaction by ID' },
      { method: 'PUT', path: '/:id', description: 'Update affiliate transaction' },
      { method: 'DELETE', path: '/:id', description: 'Delete affiliate transaction' }
    ]
  }
];

// Generate README documentation
function generateReadme() {
  let readme = `# Tin Chi Carbon API Documentation

## Overview
This is the backend API for the Tin Chi Carbon project. The API provides endpoints for managing carbon credits, projects, users, and various other features.

## Base URL
- Development: \`http://localhost:3001\`
- Production: \`https://your-production-domain.com\`

## Authentication
Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:
\`\`\`
Authorization: Bearer <your-jwt-token>
\`\`\`

## API Endpoints

`;

  routers.forEach(router => {
    readme += `### ${router.name.charAt(0).toUpperCase() + router.name.slice(1)} (${router.path})
${router.description}

`;
    
    router.routes.forEach(route => {
      const methodColor = {
        'GET': '🟢',
        'POST': '🔵', 
        'PUT': '🟡',
        'PATCH': '🟠',
        'DELETE': '🔴'
      }[route.method] || '⚪';
      
      readme += `${methodColor} **${route.method}** \`${router.path}${route.path}\` - ${route.description}\n`;
    });
    
    readme += '\n';
  });

  readme += `## Interactive Documentation
Visit \`/api-docs\` to access the interactive Swagger documentation.

## Error Responses
All endpoints return consistent error responses:
\`\`\`json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information (development only)"
}
\`\`\`

## Success Responses
Successful responses typically follow this format:
\`\`\`json
{
  "success": true,
  "message": "Success message",
  "data": { ... }
}
\`\`\`

## Rate Limiting
Some endpoints have rate limiting applied:
- Login: 100 requests per 15 minutes
- Forgot Password: 5 requests per hour

## File Upload
Some endpoints support file uploads using multipart/form-data:
- Project documents
- KML files for project mapping
- User avatars

## Development
\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
\`\`\`
`;

  return readme;
}

// Generate API documentation
function generateApiDocs() {
  let docs = `/**
 * @swagger
 * components:
 *   schemas:
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           default: false
 *         message:
 *           type: string
 *         error:
 *           type: string
 *     
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           default: true
 *         message:
 *           type: string
 *         data:
 *           type: object
 */

`;

  // Generate tags
  routers.forEach(router => {
    const tagName = router.name.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    
    docs += `/**
 * @swagger
 * tags:
 *   name: ${tagName}
 *   description: ${router.description}
 */
`;
  });

  // Generate routes
  routers.forEach(router => {
    const tagName = router.name.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    
    router.routes.forEach(route => {
      docs += `/**
 * @swagger
 * ${router.path}${route.path}:
 *   ${route.method.toLowerCase()}:
 *     summary: ${route.description}
 *     tags: [${tagName}]
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
`;
    });
  });

  return docs;
}

// Create docs directory if it doesn't exist
const docsDir = path.join(__dirname, '..', 'src', 'docs');
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true });
}

// Write README
fs.writeFileSync(
  path.join(__dirname, '..', 'API_DOCUMENTATION.md'),
  generateReadme()
);

// Write API docs
fs.writeFileSync(
  path.join(docsDir, 'api.docs.ts'),
  generateApiDocs()
);

console.log('✅ Documentation generated successfully!');
console.log('📄 README: API_DOCUMENTATION.md');
console.log('📄 Swagger: src/docs/api.docs.ts');
console.log('🌐 Interactive docs: http://localhost:3001/api-docs');
