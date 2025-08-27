import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// Import your application components
import authRouter from '../src/routes/auth.router';
import { UserModel } from '../src/models/users.model';

// Test configuration
const TEST_DB_URI = process.env.TEST_DB_URI || 'mongodb://localhost:27017/test_carbon_credits';
const JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key';

// Create test app
const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use('/auth', authRouter);

// Test user data
const testUser = {
  email: 'test@example.com',
  password: 'password123',
  name: 'Test User',
  role: 'user'
};

const adminUser = {
  email: 'admin@example.com',
  password: 'admin123',
  name: 'Admin User',
  role: 'admin'
};

describe('Login API Tests', () => {
  let testUserId: string;
  let adminUserId: string;

  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(TEST_DB_URI);
    
    // Clear test database
    await UserModel.deleteMany({});
    
    // Create test users
    const hashedPassword = await bcrypt.hash(testUser.password, 10);
    const hashedAdminPassword = await bcrypt.hash(adminUser.password, 10);
    
    const createdTestUser = await UserModel.create({
      ...testUser,
      password: hashedPassword
    });
    
    const createdAdminUser = await UserModel.create({
      ...adminUser,
      password: hashedAdminPassword
    });
    
    testUserId = createdTestUser._id.toString();
    adminUserId = createdAdminUser._id.toString();
  });

  afterAll(async () => {
    // Clean up test database
    await UserModel.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear any test data between tests if needed
  });

  describe('POST /auth/login', () => {
    describe('Successful Login Scenarios', () => {
      it('should login successfully with valid credentials', async () => {
        const response = await request(app)
          .post('/auth/login')
          .send({
            email: testUser.email,
            password: testUser.password
          })
          .expect(200);

        expect(response.body).toMatchObject({
          success: true,
          message: 'Đăng nhập thành công',
          user: {
            id: testUserId,
            email: testUser.email,
            name: testUser.name,
            role: testUser.role
          }
        });

        expect(response.body.token).toBeDefined();
        expect(response.headers['set-cookie']).toBeDefined();
        
        // Verify JWT token
        const decoded = jwt.verify(response.body.token, JWT_SECRET) as any;
        expect(decoded.id).toBe(testUserId);
        expect(decoded.email).toBe(testUser.email);
        expect(decoded.role).toBe(testUser.role);
      });

      it('should login successfully with admin credentials', async () => {
        const response = await request(app)
          .post('/auth/login')
          .send({
            email: adminUser.email,
            password: adminUser.password
          })
          .expect(200);

        expect(response.body).toMatchObject({
          success: true,
          message: 'Đăng nhập thành công',
          user: {
            id: adminUserId,
            email: adminUser.email,
            name: adminUser.name,
            role: adminUser.role
          }
        });

        expect(response.body.token).toBeDefined();
      });

      it('should set httpOnly cookie with token', async () => {
        const response = await request(app)
          .post('/auth/login')
          .send({
            email: testUser.email,
            password: testUser.password
          })
          .expect(200);

        const cookies = response.headers['set-cookie'];
        expect(cookies).toBeDefined();
        
        const tokenCookie = Array.isArray(cookies) ? cookies.find(cookie => cookie.includes('token=')) : cookies;
        expect(tokenCookie).toBeDefined();
        expect(tokenCookie).toContain('HttpOnly');
        expect(tokenCookie).toContain('Max-Age=');
      });
    });

    describe('Validation Error Scenarios', () => {
      it('should return 400 when email is missing', async () => {
        const response = await request(app)
          .post('/auth/login')
          .send({
            password: testUser.password
          })
          .expect(400);

        expect(response.body).toMatchObject({
          success: false,
          message: 'Đăng nhập thất bại - Dữ liệu không hợp lệ'
        });

        expect(response.body.errors).toBeDefined();
        expect(response.body.receivedData).toMatchObject({
          email: 'missing',
          password: 'provided'
        });
      });

      it('should return 400 when password is missing', async () => {
        const response = await request(app)
          .post('/auth/login')
          .send({
            email: testUser.email
          })
          .expect(400);

        expect(response.body).toMatchObject({
          success: false,
          message: 'Đăng nhập thất bại - Dữ liệu không hợp lệ'
        });

        expect(response.body.receivedData).toMatchObject({
          email: 'provided',
          password: 'missing'
        });
      });

      it('should return 400 when email format is invalid', async () => {
        const response = await request(app)
          .post('/auth/login')
          .send({
            email: 'invalid-email',
            password: testUser.password
          })
          .expect(400);

        expect(response.body).toMatchObject({
          success: false,
          message: 'Đăng nhập thất bại - Dữ liệu không hợp lệ'
        });
      });

      it('should return 400 when password is too short', async () => {
        const response = await request(app)
          .post('/auth/login')
          .send({
            email: testUser.email,
            password: '123'
          })
          .expect(400);

        expect(response.body).toMatchObject({
          success: false,
          message: 'Đăng nhập thất bại - Dữ liệu không hợp lệ'
        });
      });

      it('should return 400 when both email and password are missing', async () => {
        const response = await request(app)
          .post('/auth/login')
          .send({})
          .expect(400);

        expect(response.body).toMatchObject({
          success: false,
          message: 'Đăng nhập thất bại - Dữ liệu không hợp lệ'
        });

        expect(response.body.receivedData).toMatchObject({
          email: 'missing',
          password: 'missing'
        });
      });
    });

    describe('Authentication Error Scenarios', () => {
      it('should return 401 when user does not exist', async () => {
        const response = await request(app)
          .post('/auth/login')
          .send({
            email: 'nonexistent@example.com',
            password: testUser.password
          })
          .expect(401);

        expect(response.body).toMatchObject({
          success: false,
          message: 'Email hoặc mật khẩu không đúng',
          errorType: 'INVALID_CREDENTIALS'
        });
      });

      it('should return 401 when password is incorrect', async () => {
        const response = await request(app)
          .post('/auth/login')
          .send({
            email: testUser.email,
            password: 'wrongpassword'
          })
          .expect(401);

        expect(response.body).toMatchObject({
          success: false,
          message: 'Email hoặc mật khẩu không đúng',
          errorType: 'INVALID_CREDENTIALS'
        });
      });

      it('should return 401 when user has no password (invalid account)', async () => {
        // Create a user without password
        const userWithoutPassword = await UserModel.create({
          email: 'nopassword@example.com',
          name: 'No Password User',
          role: 'user'
        });

        const response = await request(app)
          .post('/auth/login')
          .send({
            email: 'nopassword@example.com',
            password: 'anypassword'
          })
          .expect(401);

        expect(response.body).toMatchObject({
          success: false,
          message: 'Tài khoản không hợp lệ - thiếu mật khẩu',
          errorType: 'INVALID_ACCOUNT'
        });

        // Clean up
        await UserModel.findByIdAndDelete(userWithoutPassword._id);
      });
    });

    describe('Edge Cases', () => {
      it('should handle case insensitive email comparison', async () => {
        const response = await request(app)
          .post('/auth/login')
          .send({
            email: testUser.email.toUpperCase(),
            password: testUser.password
          })
          .expect(200);

        expect(response.body.success).toBe(true);
      });

      it('should handle whitespace in email', async () => {
        const response = await request(app)
          .post('/auth/login')
          .send({
            email: ` ${testUser.email} `,
            password: testUser.password
          })
          .expect(200);

        expect(response.body.success).toBe(true);
      });

      it('should handle special characters in password', async () => {
        // Create user with special characters in password
        const specialPassword = 'p@ssw0rd!@#$%^&*()';
        const hashedSpecialPassword = await bcrypt.hash(specialPassword, 10);
        
        const specialUser = await UserModel.create({
          email: 'special@example.com',
          password: hashedSpecialPassword,
          name: 'Special User',
          role: 'user'
        });

        const response = await request(app)
          .post('/auth/login')
          .send({
            email: 'special@example.com',
            password: specialPassword
          })
          .expect(200);

        expect(response.body.success).toBe(true);

        // Clean up
        await UserModel.findByIdAndDelete(specialUser._id);
      });

      it('should handle very long email addresses', async () => {
        const longEmail = 'a'.repeat(50) + '@example.com';
        const hashedPassword = await bcrypt.hash('password123', 10);
        
        const longEmailUser = await UserModel.create({
          email: longEmail,
          password: hashedPassword,
          name: 'Long Email User',
          role: 'user'
        });

        const response = await request(app)
          .post('/auth/login')
          .send({
            email: longEmail,
            password: 'password123'
          })
          .expect(200);

        expect(response.body.success).toBe(true);

        // Clean up
        await UserModel.findByIdAndDelete(longEmailUser._id);
      });
    });

    describe('Rate Limiting', () => {
      it('should enforce rate limiting after multiple requests', async () => {
        const requests = Array(101).fill(null).map(() => 
          request(app)
            .post('/auth/login')
            .send({
              email: 'rate@example.com',
              password: 'wrongpassword'
            })
        );

        const responses = await Promise.all(requests);
        
        // The 101st request should be rate limited
        const lastResponse = responses[responses.length - 1];
        expect(lastResponse.status).toBe(429);
        expect(lastResponse.body.message).toContain('Quá nhiều lần thử đăng nhập');
      });
    });

    describe('Security Tests', () => {
      it('should not expose password in response', async () => {
        const response = await request(app)
          .post('/auth/login')
          .send({
            email: testUser.email,
            password: testUser.password
          })
          .expect(200);

        expect(response.body.user).not.toHaveProperty('password');
        expect(JSON.stringify(response.body)).not.toContain(testUser.password);
      });

      it('should not expose password hash in response', async () => {
        const response = await request(app)
          .post('/auth/login')
          .send({
            email: testUser.email,
            password: testUser.password
          })
          .expect(200);

        // Should not contain bcrypt hash pattern
        const responseString = JSON.stringify(response.body);
        expect(responseString).not.toMatch(/\$2[aby]\$\d{1,2}\$[./A-Za-z0-9]{53}/);
      });

      it('should set secure cookie properties', async () => {
        const response = await request(app)
          .post('/auth/login')
          .send({
            email: testUser.email,
            password: testUser.password
          })
          .expect(200);

        const cookies = response.headers['set-cookie'];
        const tokenCookie = Array.isArray(cookies) ? cookies.find(cookie => cookie.includes('token=')) : cookies;
        
        expect(tokenCookie).toContain('HttpOnly');
        expect(tokenCookie).toContain('Max-Age=');
      });
    });
  });

  describe('POST /auth/logout', () => {
    it('should logout successfully and clear cookie', async () => {
      // First login to get a token
      const loginResponse = await request(app)
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        })
        .expect(200);

      const token = loginResponse.body.token;

      // Then logout
      const logoutResponse = await request(app)
        .post('/auth/logout')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(logoutResponse.body).toMatchObject({
        success: true,
        message: 'Đăng xuất thành công'
      });

      // Check if cookie is cleared
      const cookies = logoutResponse.headers['set-cookie'];
      if (cookies) {
        const tokenCookie = Array.isArray(cookies) ? cookies.find(cookie => cookie.includes('token=')) : cookies;
        expect(tokenCookie).toContain('Max-Age=0');
      }
    });

    it('should return 401 when no token provided for logout', async () => {
      const response = await request(app)
        .post('/auth/logout')
        .expect(401);

      expect(response.body).toMatchObject({
        success: false,
        message: 'Token không được cung cấp'
      });
    });
  });

  describe('GET /auth/users/me', () => {
    it('should return user profile with valid token', async () => {
      // First login to get a token
      const loginResponse = await request(app)
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        })
        .expect(200);

      const token = loginResponse.body.token;

      // Get user profile
      const profileResponse = await request(app)
        .get('/auth/users/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(profileResponse.body).toMatchObject({
        success: true,
        user: {
          id: testUserId,
          email: testUser.email,
          role: testUser.role
        }
      });
    });

    it('should return 401 with invalid token', async () => {
      const response = await request(app)
        .get('/auth/users/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body).toMatchObject({
        success: false,
        message: 'Token không hợp lệ'
      });
    });

    it('should return 401 when no token provided', async () => {
      const response = await request(app)
        .get('/auth/users/me')
        .expect(401);

      expect(response.body).toMatchObject({
        success: false,
        message: 'Token không được cung cấp'
      });
    });
  });
});
