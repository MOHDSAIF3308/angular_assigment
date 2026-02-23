import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User';
import Record from './models/Record';
import Task from './models/Task';

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/user_management');
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Record.deleteMany({});
    await Task.deleteMany({});
    console.log('Cleared existing data');

    const hashedPassword = await bcrypt.hash('password123', 10);

    const users = await User.insertMany([
      {
        userId: 'admin001',
        password: hashedPassword,
        role: 'Admin',
        name: 'Admin User',
        email: 'admin@example.com',
        department: 'IT'
      },
      {
        userId: 'user001',
        password: hashedPassword,
        role: 'General User',
        name: 'John Doe',
        email: 'john@example.com',
        department: 'Sales'
      },
      {
        userId: 'user002',
        password: hashedPassword,
        role: 'General User',
        name: 'Jane Smith',
        email: 'jane@example.com',
        department: 'Marketing'
      }
    ]);

    await Record.insertMany([
      {
        userId: 'user001',
        title: 'Q1 Sales Report',
        description: 'Quarterly sales analysis and projections',
        status: 'Completed',
        priority: 'High',
        accessLevel: 'restricted'
      },
      {
        userId: 'user001',
        title: 'Client Meeting Notes',
        description: 'Notes from ABC Corp meeting',
        status: 'In Progress',
        priority: 'Medium',
        accessLevel: 'public'
      },
      {
        userId: 'user002',
        title: 'Marketing Campaign Plan',
        description: 'Social media campaign strategy',
        status: 'Pending',
        priority: 'High',
        accessLevel: 'restricted'
      },
      {
        userId: 'user002',
        title: 'Brand Guidelines',
        description: 'Updated brand identity guidelines',
        status: 'Completed',
        priority: 'Low',
        accessLevel: 'public'
      },
      {
        userId: 'admin001',
        title: 'System Maintenance',
        description: 'Scheduled server maintenance',
        status: 'Scheduled',
        priority: 'Critical',
        accessLevel: 'public'
      }
    ]);

    await Task.insertMany([
      {
        taskId: 'TASK001',
        title: 'Complete Project Proposal',
        description: 'Finalize and submit the Q2 project proposal',
        assignedTo: 'user001',
        assignedBy: 'admin001',
        status: 'In Progress',
        priority: 'High',
        dueDate: new Date('2026-03-15'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        taskId: 'TASK002',
        title: 'Update Client Documentation',
        description: 'Revise and update documentation for client deliverables',
        assignedTo: 'user002',
        assignedBy: 'admin001',
        status: 'Not Started',
        priority: 'Medium',
        dueDate: new Date('2026-03-20'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        taskId: 'TASK003',
        title: 'Code Review - Authentication Module',
        description: 'Review and approve authentication module implementation',
        assignedTo: 'user001',
        assignedBy: 'admin001',
        status: 'Completed',
        priority: 'Critical',
        dueDate: new Date('2026-02-28'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        taskId: 'TASK004',
        title: 'Marketing Campaign Analysis',
        description: 'Analyze campaign metrics and prepare report',
        assignedTo: 'user002',
        assignedBy: 'admin001',
        status: 'In Progress',
        priority: 'Medium',
        dueDate: new Date('2026-03-10'),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    console.log('Database seeded successfully!');
    console.log('\nTest Credentials:');
    console.log('Admin - userId: admin001, password: password123');
    console.log('User1 - userId: user001, password: password123');
    console.log('User2 - userId: user002, password: password123');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();
