#!/bin/bash

# Test Runner Script for Login Tests

echo "🚀 Starting Login Tests..."

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  Warning: MongoDB doesn't seem to be running."
    echo "   Make sure MongoDB is started before running tests."
    echo "   You can start it with: sudo systemctl start mongod"
    echo ""
fi

# Set test environment variables
export NODE_ENV=test
export JWT_SECRET=test-secret-key-for-jwt-signing
export JWT_EXPIRES_IN=7d
export TEST_DB_URI=mongodb://localhost:27017/test_carbon_credits
export FRONTEND_URL=http://localhost:3000
export RATE_LIMIT_DISABLED=true

# Run the tests
echo "📋 Running login tests..."
npm test -- test/login.test.ts

# Check exit code
if [ $? -eq 0 ]; then
    echo "✅ All tests passed!"
else
    echo "❌ Some tests failed!"
    exit 1
fi
