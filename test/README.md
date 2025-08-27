# Login Tests

This directory contains comprehensive tests for the authentication system, specifically focusing on login functionality.

## Prerequisites

Before running the tests, make sure you have:

1. **MongoDB** running locally or a test database accessible
2. **Node.js** and **npm** installed
3. All dependencies installed: `npm install`

## Environment Setup

Create a `.env.test` file in the root directory with the following variables:

```env
NODE_ENV=test
JWT_SECRET=test-secret-key-for-jwt-signing
JWT_EXPIRES_IN=7d
TEST_DB_URI=mongodb://localhost:27017/test_carbon_credits
FRONTEND_URL=http://localhost:3000
RATE_LIMIT_DISABLED=true
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run tests with coverage
```bash
npm run test:coverage
```

### Run specific test file
```bash
npm test -- login.test.ts
```

## Test Coverage

The login tests cover the following scenarios:

### Successful Login Scenarios
- ✅ Login with valid user credentials
- ✅ Login with admin credentials
- ✅ Proper JWT token generation
- ✅ HttpOnly cookie setting

### Validation Error Scenarios
- ✅ Missing email
- ✅ Missing password
- ✅ Invalid email format
- ✅ Password too short
- ✅ Both email and password missing

### Authentication Error Scenarios
- ✅ Non-existent user
- ✅ Incorrect password
- ✅ User without password (invalid account)

### Edge Cases
- ✅ Case insensitive email comparison
- ✅ Whitespace handling in email
- ✅ Special characters in password
- ✅ Very long email addresses

### Security Tests
- ✅ Password not exposed in response
- ✅ Password hash not exposed in response
- ✅ Secure cookie properties

### Rate Limiting
- ✅ Rate limiting enforcement

### Additional Endpoints
- ✅ Logout functionality
- ✅ User profile retrieval
- ✅ Token validation

## Test Structure

```
test/
├── setup.ts              # Test environment setup
├── login.test.ts         # Main login tests
└── README.md            # This file
```

## Database

Tests use a separate test database to avoid affecting production data. The test database is automatically cleaned up after each test run.

## Notes

- Tests are designed to be isolated and can run independently
- Each test cleans up after itself to avoid data pollution
- Rate limiting is disabled for tests to allow multiple rapid requests
- Console logs are suppressed during tests for cleaner output
