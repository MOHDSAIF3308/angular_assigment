#!/bin/bash

echo "=========================================="
echo "User Management System - Setup Script"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null
then
    echo "⚠️  MongoDB is not running. Please start MongoDB first."
    echo "   Run: mongod"
    echo ""
fi

# Backend setup
echo "📦 Setting up Backend..."
cd backend
npm install
echo "✅ Backend dependencies installed"
echo ""

# Frontend setup
echo "📦 Setting up Frontend..."
cd ../frontend
npm install
echo "✅ Frontend dependencies installed"
echo ""

# Seed database
echo "🌱 Seeding database..."
cd ../backend
npm run seed
echo "✅ Database seeded with test data"
echo ""

echo "=========================================="
echo "✅ Setup Complete!"
echo "=========================================="
echo ""
echo "Test Credentials:"
echo "  Admin: admin001 / password123"
echo "  User:  user001 / password123"
echo ""
echo "To start the application:"
echo "  1. Backend:  cd backend && npm run dev"
echo "  2. Frontend: cd frontend && ng serve"
echo ""
echo "Access the app at: http://localhost:4200"
echo "=========================================="
