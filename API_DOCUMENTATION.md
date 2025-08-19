# Tin Chi Carbon API Documentation

## Overview
This is the backend API for the Tin Chi Carbon project. The API provides endpoints for managing carbon credits, projects, users, and various other features.

## Base URL
- Development: `http://localhost:3001`
- Production: `https://your-production-domain.com`

## Authentication
Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## API Endpoints

### Auth (/api/auth)
User authentication and authorization endpoints

🔵 **POST** `/api/auth/register` - Register a new user
🔵 **POST** `/api/auth/login` - Login user
🔵 **POST** `/api/auth/logout` - Logout user
🔵 **POST** `/api/auth/forgot-password` - Request password reset
🔵 **POST** `/api/auth/reset-password` - Reset password with token
🔵 **POST** `/api/auth/change-password` - Change user password
🟢 **GET** `/api/auth/users/me` - Get current user information
🟢 **GET** `/api/auth/users` - Get all users (Admin only)
🟡 **PUT** `/api/auth/users/update` - Update user information
🔴 **DELETE** `/api/auth/:id` - Delete user by ID (Admin only)
🟢 **GET** `/api/auth/user/infor-manger/:id` - Get manager information by ID

### Projects (/api/projects)
Project management endpoints

🔵 **POST** `/api/projects/` - Create a new project
🟡 **PUT** `/api/projects/:id` - Update project
🟢 **GET** `/api/projects/` - Get all projects
🟢 **GET** `/api/projects/:id` - Get project by ID
🟢 **GET** `/api/projects/profile/:id` - Get user profile project
🟡 **PUT** `/api/projects/activities/:id` - Update project activities
🟡 **PUT** `/api/projects/documents/:id` - Update project documents
🟡 **PUT** `/api/projects/documents/:projectId/:documentId/status` - Update document status

### Orders (/api/orders)
Order management endpoints

🔵 **POST** `/api/orders/` - Create a new order
🟢 **GET** `/api/orders/` - Get all orders
🟢 **GET** `/api/orders/user/:userId` - Get orders by user ID
🟢 **GET** `/api/orders/:id` - Get order by ID
🟡 **PUT** `/api/orders/:id` - Update order status
🔴 **DELETE** `/api/orders/:id` - Delete order

### Products (/api/products)
Product management endpoints

🔵 **POST** `/api/products/` - Create a new product
🟢 **GET** `/api/products/` - Get all products
🟢 **GET** `/api/products/:id` - Get product by ID
🟡 **PUT** `/api/products/timelines/:id` - Update product timeline
🟡 **PUT** `/api/products/reports/:id` - Update product reports
🟡 **PUT** `/api/products/features/:id` - Update product features
🟡 **PUT** `/api/products/benefits/:id` - Update product benefits
🟡 **PUT** `/api/products/certificates/:id` - Update product certificates
🟡 **PUT** `/api/products/:id` - Update product
🔴 **DELETE** `/api/products/:id` - Delete product

### News (/api/news)
News management endpoints

🔵 **POST** `/api/news/` - Create a new news article
🟢 **GET** `/api/news/` - Get all news articles
🟢 **GET** `/api/news/:id` - Get news article by ID
🟡 **PUT** `/api/news/:id` - Update news article
🔴 **DELETE** `/api/news/:id` - Delete news article

### Donation (/api/donation)
Donation management endpoints

🔵 **POST** `/api/donation/` - Create a new donation
🟢 **GET** `/api/donation/` - Get all donations
🟢 **GET** `/api/donation/infor` - Get donation information
🟢 **GET** `/api/donation/orderCode/:id` - Get donation and update status
🟡 **PUT** `/api/donation/:id` - Update donation
🔴 **DELETE** `/api/donation/:id` - Delete donation

### Consultation (/api/consultation)
Consultation management endpoints

🔵 **POST** `/api/consultation/` - Create a new consultation request
🟢 **GET** `/api/consultation/` - Get all consultation requests
🔴 **DELETE** `/api/consultation/:id` - Delete consultation request

### Affiliates (/api/affiliates)
Affiliate management endpoints

🔵 **POST** `/api/affiliates/` - Create a new affiliate
🟢 **GET** `/api/affiliates/` - Get all affiliates
🟢 **GET** `/api/affiliates/:id` - Get affiliate by user ID
🟠 **PATCH** `/api/affiliates/:id` - Update affiliate
🔴 **DELETE** `/api/affiliates/:id` - Delete affiliate

### Project-carbons (/api/project-carbons)
Project carbon management endpoints

🔵 **POST** `/api/project-carbons/` - Create a new project carbon
🟢 **GET** `/api/project-carbons/` - Get all project carbons
🟢 **GET** `/api/project-carbons/:id` - Get project carbon by ID
🟡 **PUT** `/api/project-carbons/:id` - Update project carbon
🔴 **DELETE** `/api/project-carbons/:id` - Delete project carbon

### Carbon-products (/api/carbons)
Carbon product management endpoints

🔵 **POST** `/api/carbons/` - Create a new carbon product
🟢 **GET** `/api/carbons/` - Get all carbon products
🟢 **GET** `/api/carbons/:id` - Get carbon product by ID
🟡 **PUT** `/api/carbons/:id` - Update carbon product
🔴 **DELETE** `/api/carbons/:id` - Delete carbon product

### Certificates (/api/certificates)
Certificate management endpoints

🔵 **POST** `/api/certificates/` - Create a new certificate
🟢 **GET** `/api/certificates/` - Get all certificates
🟢 **GET** `/api/certificates/:id` - Get certificate by ID
🟡 **PUT** `/api/certificates/:id` - Update certificate
🔴 **DELETE** `/api/certificates/:id` - Delete certificate

### Carbon-credits (/api/carboncredits)
Carbon credit management endpoints

🔵 **POST** `/api/carboncredits/` - Create a new carbon credit
🟢 **GET** `/api/carboncredits/` - Get all carbon credits
🟢 **GET** `/api/carboncredits/:id` - Get carbon credit by ID
🟡 **PUT** `/api/carboncredits/:id` - Update carbon credit
🔴 **DELETE** `/api/carboncredits/:id` - Delete carbon credit

### Affiliate-payment-methods (/api/payment-method)
Affiliate payment method management endpoints

🔵 **POST** `/api/payment-method/` - Create a new affiliate payment method
🟢 **GET** `/api/payment-method/` - Get all affiliate payment methods
🟢 **GET** `/api/payment-method/:id` - Get affiliate payment methods by ID
🟡 **PUT** `/api/payment-method/:id` - Update affiliate payment method
🔴 **DELETE** `/api/payment-method/:id` - Delete affiliate payment method

### Affiliate-transactions (/api/transactions)
Affiliate transaction management endpoints

🔵 **POST** `/api/transactions/` - Create a new affiliate transaction
🟢 **GET** `/api/transactions/` - Get all affiliate transactions
🟢 **GET** `/api/transactions/:id` - Get affiliate transaction by ID
🟡 **PUT** `/api/transactions/:id` - Update affiliate transaction
🔴 **DELETE** `/api/transactions/:id` - Delete affiliate transaction

## Interactive Documentation
Visit `/api-docs` to access the interactive Swagger documentation.

## Error Responses
All endpoints return consistent error responses:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information (development only)"
}
```

## Success Responses
Successful responses typically follow this format:
```json
{
  "success": true,
  "message": "Success message",
  "data": { ... }
}
```

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
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```
