# 🌱 Tin Chi Carbon Backend API

> **Backend API cho hệ thống quản lý tín chỉ carbon và dự án bảo vệ môi trường**

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8+-blue.svg)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-5.1+-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.14+-green.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

## 📋 Mục lục

- [Giới thiệu](#-giới-thiệu)
- [Tính năng chính](#-tính-năng-chính)
- [Cài đặt](#-cài-đặt)
- [Cấu hình](#-cấu-hình)
- [API Endpoints](#-api-endpoints)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [Validation System](#-validation-system)
- [Deployment](#-deployment)
- [Đóng góp](#-đóng-góp)
- [License](#-license)

## 🌟 Giới thiệu

**Tin Chi Carbon Backend** là một hệ thống API toàn diện được xây dựng để quản lý các dự án tín chỉ carbon, hỗ trợ các hoạt động bảo vệ môi trường và phát triển bền vững. Hệ thống được thiết kế với kiến trúc microservices, sử dụng TypeScript và Express.js.

### 🎯 Mục tiêu
- Quản lý dự án carbon credit một cách hiệu quả
- Hỗ trợ đa dạng loại dự án (rừng, lúa gạo, biochar)
- Tích hợp thanh toán và quản lý affiliate
- Cung cấp API mạnh mẽ cho frontend applications

## 🚀 Tính năng chính

### 🔐 Authentication & Authorization
- **JWT-based authentication** với refresh tokens
- **Role-based access control** (User, Admin, Editor)
- **Email verification** và password reset
- **Rate limiting** để bảo vệ API

### 🌲 Carbon Credit Management
- **Quản lý dự án carbon** với nhiều loại:
  - 🌳 Dự án rừng (Forest projects)
  - 🌾 Dự án lúa gạo (Rice projects)  
  - 🔥 Dự án biochar (Biochar projects)
- **Theo dõi trạng thái dự án** từ khảo sát đến giao dịch
- **Quản lý tài liệu và KML files**
- **Báo cáo và chứng chỉ**

### 💰 Payment & Affiliate System
- **Tích hợp PayOS** cho thanh toán
- **Hệ thống affiliate** với commission tracking
- **Quản lý giao dịch** và payout
- **Multiple payment methods**

### 📊 Project Management
- **Dashboard analytics** cho dự án
- **Timeline tracking** và milestones
- **Document management** với upload support
- **Team collaboration** features

### 🌱 Donation & Tree Planting
- **Hệ thống đóng góp trồng cây**
- **Tracking số lượng cây đã trồng**
- **Transparent reporting** cho donors

## 🛠 Cài đặt

### Yêu cầu hệ thống
- Node.js 18+ 
- MongoDB 8.14+
- npm hoặc yarn

### Bước 1: Clone repository
```bash
git clone https://github.com/your-org/tin-chi-carbon-backend.git
cd tin-chi-carbon-backend
```

### Bước 2: Cài đặt dependencies
```bash
npm install
```

### Bước 3: Cấu hình môi trường
Tạo file `.env` trong thư mục gốc:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/tin-chi-carbon

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Email Configuration (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Payment Configuration (PayOS)
PAYOS_CLIENT_ID=your-payos-client-id
PAYOS_API_KEY=your-payos-api-key
PAYOS_CHECKSUM_KEY=your-payos-checksum-key

# Frontend URL
FRONT_END_URL=http://localhost:3000

# File Upload (Optional)
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
```

### Bước 4: Chạy ứng dụng

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm run build
npm start
```

## ⚙️ Cấu hình

### Database Setup
Hệ thống sử dụng MongoDB với các collections chính:
- `users` - Quản lý người dùng
- `projects` - Dự án carbon
- `project-carbons` - Chi tiết dự án carbon
- `orders` - Đơn hàng và thanh toán
- `affiliates` - Hệ thống affiliate
- `donations` - Đóng góp trồng cây

### Environment Variables
| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | 3000 |
| `MONGO_URI` | MongoDB connection string | Yes | - |
| `JWT_SECRET` | JWT signing secret | Yes | - |
| `EMAIL_HOST` | SMTP host | Yes | - |
| `PAYOS_CLIENT_ID` | PayOS client ID | Yes | - |

## 📡 API Endpoints

### 🔐 Authentication
```
POST   /api/auth/register          # Đăng ký tài khoản
POST   /api/auth/login             # Đăng nhập
POST   /api/auth/forgot-password   # Quên mật khẩu
POST   /api/auth/reset-password    # Đặt lại mật khẩu
POST   /api/auth/change-password   # Thay đổi mật khẩu
POST   /api/auth/logout            # Đăng xuất
GET    /api/auth/verify-email      # Xác thực email
```

### 🌲 Carbon Projects
```
GET    /api/projects               # Lấy danh sách dự án
POST   /api/projects               # Tạo dự án mới
GET    /api/projects/:id           # Chi tiết dự án
PUT    /api/projects/:id           # Cập nhật dự án
DELETE /api/projects/:id           # Xóa dự án

GET    /api/project-carbons        # Dự án carbon
POST   /api/project-carbons        # Tạo dự án carbon
PUT    /api/project-carbons/:id    # Cập nhật dự án carbon
```

### 💰 Orders & Payments
```
GET    /api/orders                 # Danh sách đơn hàng
POST   /api/orders                 # Tạo đơn hàng
GET    /api/orders/:id             # Chi tiết đơn hàng
PUT    /api/orders/:id             # Cập nhật đơn hàng
```

### 🌱 Donations
```
GET    /api/donation               # Thông tin đóng góp
POST   /api/donation               # Tạo đóng góp mới
GET    /api/donation/info          # Thống kê đóng góp
```

### 👥 Affiliate System
```
GET    /api/affiliates             # Danh sách affiliate
POST   /api/affiliates             # Tạo affiliate
GET    /api/transactions           # Giao dịch affiliate
GET    /api/payment-method         # Phương thức thanh toán
```

### 📰 News & Content
```
GET    /api/news                   # Tin tức
POST   /api/news                   # Tạo tin tức
GET    /api/news/:id               # Chi tiết tin tức
```

## 📁 Cấu trúc dự án

```
src/
├── config/                 # Cấu hình database, middleware
│   └── db.ts              # MongoDB connection
├── controllers/           # Business logic controllers
│   ├── auth.controller.ts
│   ├── project.controller.ts
│   ├── order.controller.ts
│   └── ...
├── fsm/                   # Finite State Machine
│   └── base-fsm.ts        # Validation system
├── middleware/            # Express middleware
│   └── authMiddleware.ts  # Authentication middleware
├── models/                # MongoDB schemas
│   ├── users.model.ts
│   ├── project.model.ts
│   └── ...
├── routes/                # API routes
│   ├── auth.router.ts
│   ├── project.router.ts
│   └── ...
├── services/              # Business services
│   ├── auth.service.ts
│   ├── order.service.ts
│   └── ...
├── types/                 # TypeScript type definitions
│   ├── user.ts
│   ├── project.ts
│   └── ...
├── utils/                 # Utility functions
│   ├── email/
│   ├── payment/
│   └── validation.ts
├── validate/              # Form validation rules
│   ├── login.form.ts
│   ├── register.form.ts
│   └── ...
└── index.ts              # Application entry point
```

## ✅ Validation System

Hệ thống sử dụng **Finite State Machine (FSM)** cho validation với các tính năng:

### 🔧 Validation Features
- **Type-safe validation** với TypeScript
- **Async validation** support
- **Cross-field validation**
- **Custom validation rules**
- **Error handling** robust

### 📝 Example Usage
```typescript
import { validateFlow } from '../fsm/base-fsm';
import { DonationForm } from '../validate/donation.form';

// Validate form data
const errors = await validateFlow(req.body, DonationForm, {
  stopOnFirstError: true,
  timeout: 5000
});

if (errors.length > 0) {
  return res.status(400).json({ errors });
}
```

### 🛠 Validation Helpers
```typescript
import { ValidationHelpers } from '../fsm/base-fsm';

// Required field
condition: ValidationHelpers.required('name')

// Email validation
condition: ValidationHelpers.email('email')

// Number range
condition: ValidationHelpers.numberRange('quantity', 1, 1000)

// Cross-field validation
condition: ValidationHelpers.crossField('password', 'confirmPassword', (p1, p2) => p1 === p2)
```

## 🚀 Deployment

### Production Setup
1. **Environment Configuration**
   ```bash
   NODE_ENV=production
   PORT=3000
   MONGO_URI=mongodb://your-production-db
   ```

2. **Build Application**
   ```bash
   npm run build
   ```

3. **Start Production Server**
   ```bash
   npm start
   ```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables for Production
```env
NODE_ENV=production
MONGO_URI=mongodb://your-production-mongodb
JWT_SECRET=your-production-jwt-secret
PAYOS_CLIENT_ID=your-production-payos-id
PAYOS_API_KEY=your-production-payos-key
```

## 🤝 Đóng góp

### Development Workflow
1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Standards
- Sử dụng TypeScript strict mode
- Follow ESLint rules
- Write unit tests cho new features
- Update documentation khi cần

### Commit Convention
```
feat: add new feature
fix: bug fix
docs: documentation changes
style: code style changes
refactor: code refactoring
test: add tests
chore: build process changes
```

## 📄 License

Dự án này được phân phối dưới giấy phép **ISC**. Xem file `LICENSE` để biết thêm chi tiết.

## 📞 Liên hệ

- **Email**: contact@tinchicarbon.com
- **Website**: https://tinchicarbon.com
- **Documentation**: https://docs.tinchicarbon.com

---

<div align="center">
  <p>Made with ❤️ for a greener future</p>
  <p>🌱 Tin Chi Carbon - Empowering Carbon Credit Management</p>
</div>
