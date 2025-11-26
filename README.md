# SE347 Agency Management System - Backend API

Backend API cho hệ thống quản lý đại lý được xây dựng bằng Node.js, Express và MongoDB.

## 🚀 Công nghệ sử dụng

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM cho MongoDB
- **JWT** - Authentication
- **bcryptjs** - Hash password
- **express-validator** - Validation
- **cors** - CORS middleware
- **dotenv** - Environment variables
- **morgan** - HTTP request logger

## 📁 Cấu trúc dự án

```
backend/
├── src/
│   ├── config/              # Cấu hình database, env
│   ├── models/              # Mongoose models
│   ├── controllers/         # Business logic
│   ├── routes/              # API routes
│   ├── middleware/          # Middleware (auth, role, error)
│   ├── utils/               # Utilities (response, validator)
│   └── app.js               # Express app setup
├── .env                     # Environment variables
├── .gitignore
├── package.json
├── server.js                # Entry point
└── README.md
```

## 🔧 Cài đặt

### 1. Clone repository

```bash
git clone <repository-url>
cd backend
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Cấu hình môi trường

Tạo file `.env` trong thư mục backend:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/se347_agency_management

# JWT Configuration
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRE=7d

# CORS Configuration
CLIENT_URL=http://localhost:5173
```

### 4. Cài đặt và chạy MongoDB

**Windows:**
- Tải MongoDB từ https://www.mongodb.com/try/download/community
- Cài đặt và chạy MongoDB service
- Hoặc chạy: `mongod --dbpath=C:\data\db`

**Mac:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

### 5. Khởi động server

```bash
# Development mode (với nodemon)
npm run dev

# Production mode
npm start
```

Server sẽ chạy tại: `http://localhost:3000`

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Đăng ký tài khoản mới | Public |
| POST | `/api/auth/login` | Đăng nhập | Public |
| POST | `/api/auth/logout` | Đăng xuất | Private |
| GET | `/api/auth/profile` | Lấy thông tin user | Private |

### Users (Admin only)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/users` | Lấy danh sách users | Admin |
| GET | `/api/users/:id` | Lấy thông tin user | Admin |
| POST | `/api/users` | Tạo user mới | Admin |
| PUT | `/api/users/:id` | Cập nhật user | Admin |
| DELETE | `/api/users/:id` | Xóa user | Admin |

### Agencies

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/agencies` | Lấy danh sách đại lý | Private |
| GET | `/api/agencies/:id` | Lấy thông tin đại lý | Private |
| POST | `/api/agencies` | Tạo đại lý mới | Staff/Admin |
| PUT | `/api/agencies/:id` | Cập nhật đại lý | Staff/Admin |
| DELETE | `/api/agencies/:id` | Xóa đại lý | Staff/Admin |

### Products

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/products` | Lấy danh sách sản phẩm | Private |
| GET | `/api/products/:id` | Lấy thông tin sản phẩm | Private |
| POST | `/api/products` | Tạo sản phẩm mới | Staff/Admin |
| PUT | `/api/products/:id` | Cập nhật sản phẩm | Staff/Admin |
| DELETE | `/api/products/:id` | Xóa sản phẩm | Staff/Admin |

### Imports (Phiếu nhập)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/imports` | Lấy danh sách phiếu nhập | Staff/Admin |
| GET | `/api/imports/:id` | Lấy thông tin phiếu nhập | Staff/Admin |
| POST | `/api/imports` | Tạo phiếu nhập mới | Staff/Admin |
| PUT | `/api/imports/:id` | Cập nhật phiếu nhập | Staff/Admin |
| DELETE | `/api/imports/:id` | Xóa phiếu nhập | Staff/Admin |

### Exports (Phiếu xuất)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/exports` | Lấy danh sách phiếu xuất | Private |
| GET | `/api/exports/:id` | Lấy thông tin phiếu xuất | Private |
| POST | `/api/exports` | Tạo phiếu xuất mới | Staff/Admin |
| PUT | `/api/exports/:id` | Cập nhật phiếu xuất | Staff/Admin |
| DELETE | `/api/exports/:id` | Xóa phiếu xuất | Staff/Admin |

### Payments (Phiếu thu)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/payments` | Lấy danh sách phiếu thu | Private |
| GET | `/api/payments/:id` | Lấy thông tin phiếu thu | Private |
| POST | `/api/payments` | Tạo phiếu thu mới | Staff/Admin |
| PUT | `/api/payments/:id` | Cập nhật phiếu thu | Staff/Admin |
| DELETE | `/api/payments/:id` | Xóa phiếu thu | Staff/Admin |

### Distributions (Yêu cầu phân phối)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/distributions` | Lấy danh sách yêu cầu | Private |
| GET | `/api/distributions/:id` | Lấy thông tin yêu cầu | Private |
| POST | `/api/distributions` | Tạo yêu cầu mới | Agency/Staff/Admin |
| PUT | `/api/distributions/:id` | Cập nhật yêu cầu | Staff/Admin |
| DELETE | `/api/distributions/:id` | Xóa yêu cầu | Admin |

### Reports (Báo cáo)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/reports` | Lấy danh sách báo cáo | Private |
| GET | `/api/reports/:id` | Lấy thông tin báo cáo | Private |
| POST | `/api/reports` | Tạo báo cáo mới | Staff/Admin |
| DELETE | `/api/reports/:id` | Xóa báo cáo | Admin |

### Regulations (Quy định)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/regulations` | Lấy danh sách quy định | Private |
| GET | `/api/regulations/:id` | Lấy thông tin quy định | Private |
| PUT | `/api/regulations/:id` | Cập nhật quy định | Admin |

## 🔐 Authentication

API sử dụng JWT (JSON Web Tokens) để xác thực.

### Cách sử dụng:

1. Đăng ký/Đăng nhập để nhận token
2. Gửi token trong header của mỗi request:

```
Authorization: Bearer <your-token-here>
```

### Ví dụ với Axios:

```javascript
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm token vào mỗi request
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
```

## 👥 Phân quyền (Roles)

Hệ thống có 3 loại user:

| Role | Mô tả | Quyền |
|------|-------|-------|
| **admin** | Quản trị viên | Toàn quyền trên hệ thống |
| **staff** | Nhân viên | Quản lý đại lý, sản phẩm, phiếu nhập/xuất/thu |
| **agency** | Đại lý | Xem thông tin của đại lý mình, tạo yêu cầu phân phối |

## 📝 Query Parameters

Hầu hết các GET endpoints hỗ trợ:

- `page` - Số trang (mặc định: 1)
- `limit` - Số items mỗi trang (mặc định: 10)
- `search` - Tìm kiếm
- `status` - Lọc theo trạng thái
- `sort` - Sắp xếp

**Ví dụ:**
```
GET /api/agencies?page=1&limit=20&status=active&search=nghia
```

## 🔄 Response Format

### Success Response:

```json
{
  "success": true,
  "message": "Thành công",
  "data": { ... }
}
```

### Error Response:

```json
{
  "success": false,
  "message": "Mô tả lỗi",
  "error": "Chi tiết lỗi (chỉ trong development)"
}
```

### Paginated Response:

```json
{
  "success": true,
  "count": 10,
  "total": 100,
  "page": 1,
  "pages": 10,
  "data": [ ... ]
}
```

## 🧪 Testing API

### Sử dụng Postman hoặc Thunder Client:

1. Import collection từ file `postman_collection.json` (nếu có)
2. Hoặc tạo requests thủ công theo endpoints trên

### Ví dụ test với curl:

```bash
# Đăng ký
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@example.com",
    "password": "123456",
    "role": "admin"
  }'

# Đăng nhập
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "123456"
  }'

# Lấy danh sách agencies (cần token)
curl -X GET http://localhost:3000/api/agencies \
  -H "Authorization: Bearer <your-token>"
```

## 🐛 Error Handling

API có xử lý lỗi toàn cục cho:

- Validation errors (400)
- Authentication errors (401)
- Authorization errors (403)
- Not found errors (404)
- Server errors (500)

## 📊 Database Models

### User
- username, email, password (hashed)
- role: admin | staff | agency
- agencyId (nếu role là agency)
- status: active | inactive

### Agency
- code, name, address, phone, email
- status: active | inactive
- debt (công nợ)
- district, type

### Product
- code, name, unit, price
- stock (tồn kho)
- status: active | inactive

### Import/Export
- importCode/exportCode
- products[] (productId, quantity, price)
- totalAmount
- status: pending | completed | cancelled

### Payment
- code, agencyId, amount
- paymentDate
- status: paid | pending | cancelled

## 🚀 Deployment

### Chuẩn bị cho production:

1. Đổi `NODE_ENV=production` trong `.env`
2. Sử dụng MongoDB Atlas cho database
3. Deploy lên Heroku, Railway, hoặc VPS
4. Cấu hình CORS cho frontend domain

### Ví dụ deploy lên Railway:

```bash
# Cài Railway CLI
npm i -g @railway/cli

# Login
railway login

# Deploy
railway up
```

## 🤝 Đóng góp

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Tạo Pull Request

## 📧 Liên hệ

- Team: **SE347-Team9**
- Repository: https://github.com/SE347-Team9

## 📄 License

ISC License
