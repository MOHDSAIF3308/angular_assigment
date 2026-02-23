# Backend API - User Management System

Node.js/TypeScript backend with MongoDB for user management.

## Quick Start

```bash
npm install
npm run seed    # Seed database with test data
npm run dev     # Start development server
```

## API Documentation

### Authentication

#### POST /api/auth/login
Login with credentials

**Request Body:**
```json
{
  "userId": "admin001",
  "password": "password123",
  "delayMs": 0
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "userId": "admin001",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "Admin",
    "department": "IT"
  }
}
```

### Users (Admin Only)

#### GET /api/users?delay=<ms>
Get all users

**Headers:**
```
Authorization: Bearer <token>
```

#### POST /api/users
Create new user

#### PUT /api/users/:id
Update user

#### DELETE /api/users/:id
Delete user

### Records

#### GET /api/records?delay=<ms>
Get records (filtered by role)

## Environment Variables

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/user_management
JWT_SECRET=your_secret_key
NODE_ENV=development
```
