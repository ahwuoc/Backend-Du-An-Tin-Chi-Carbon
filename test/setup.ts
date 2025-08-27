import dotenv from 'dotenv';

// Load environment variables for testing
dotenv.config({ path: '.env.test' });

// Set default test enviroment variables if not provied
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key-for-jwt-signing';
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
process.env.TEST_DB_URI = process.env.TEST_DB_URI || 'mongodb://localhost:27017/test_carbon_credits';
process.env.FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Global test timeout
jest.setTimeout(30000);

// Suppress console logs during tests unless there's an error
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

beforeAll(() => {
  console.log = jest.fn();
  console.error = originalConsoleError; // Keep error logging
});

afterAll(() => {
  console.log = originalConsoleLog;
});
