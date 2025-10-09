# TASK MANAGEMENT API

#### This project focuses on Modern Task Management System with AI-powered subtask generation, comprehensive CRUD operations, and user authentication using Next.js and MongoDB.

## Table of Contents

- [Project Features](#project-features)
- [Tech Stack](#tech-stack)
- [Libraries Used](#libraries-used)
- [Setup and Installation](#setup-and-installation)
- [Environment Variables](#environment-variables)
- [API Endpoints and Sample Requests](#api-endpoints-and-sample-requests)
- [Development Choices](#development-choices)
- [Architecture](#architecture)
- [Acknowledgements](#acknowledgements)

---

## Project Features

- **Task Management**: Complete CRUD operations with title, description, status tracking, and timestamps
- **AI-Powered Subtasks**: Automatically generate actionable subtasks using Google Gemini 2.0 Flash with structured output
- **User Authentication**: Secure JWT-based authentication with HTTP-only cookies and password hashing
- **Advanced Search & Filtering**: Real-time search by title/description with status filtering and pagination
- **Responsive UI**: Modern, accessible interface built with shadcn/ui and Tailwind CSS

---

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, React Query (TanStack Query)
- **Backend**: Next.js API Routes, MongoDB with Mongoose ODM
- **Authentication**: JWT with bcryptjs password hashing
- **AI Integration**: Google Gemini 2.0 Flash with Structured Output
- **UI Framework**: shadcn/ui, Tailwind CSS, Lucide React Icons

---

## Libraries Used

- **Next.js**: Full-stack React framework with App Router
- **@tanstack/react-query**: Data fetching, caching, and state management
- **mongoose**: MongoDB object modeling for Node.js
- **@google/generative-ai**: Google Gemini API client for AI-powered subtask generation
- **jsonwebtoken**: JWT token generation and verification
- **bcryptjs**: Password hashing and validation
- **shadcn/ui**: Beautiful, accessible React components
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Beautiful & consistent icon toolkit

---

## Setup and Installation

### Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB (local or Atlas)
- Google Gemini API Key

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/task-manager
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/task-manager

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NEXTAUTH_SECRET=your-nextauth-secret-key
NEXTAUTH_URL=http://localhost:3000

# AI Integration
GEMINI_API_KEY=your_gemini_api_key_here
```
### Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/ayushjaiz/task
   cd task
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Database Setup**:
   - **Local MongoDB**: Install and start MongoDB service locally
   - **MongoDB Atlas**: Create cluster and get connection string

4. **Run the Application**:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

- Application starts running at `http://localhost:3000`

---

## API Endpoints and Sample Requests

### POST /api/auth/register
Register a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "674a1b2c3d4e5f6789012345",
    "email": "user@example.com"
  }
}
```

### POST /api/auth/login
Authenticate user and get access token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "674a1b2c3d4e5f6789012345",
    "email": "user@example.com"
  }
}
```

### POST /api/tasks
Create a new task with AI-generated subtasks.

**Request:**
```json
{
  "title": "Build a Website",
  "description": "Create a responsive portfolio website using React and Tailwind CSS"
}
```

**Response:**
```json
{
  "message": "Task created successfully",
  "task": {
    "_id": "674a1b2c3d4e5f6789012346",
    "title": "Build a Website",
    "description": "Create a responsive portfolio website using React and Tailwind CSS",
    "status": "pending",
    "subtasks": [
      {
        "subtask_id": "674a1b2c3d4e5f6789012347",
        "description": "Plan and outline the website structure",
        "isCompleted": false
      },
      {
        "subtask_id": "674a1b2c3d4e5f6789012348",
        "description": "Set up React project with Tailwind CSS",
        "isCompleted": false
      }
    ],
    "createdAt": "2025-01-09T10:30:00Z"
  }
}
```

### GET /api/tasks
Retrieve tasks with filtering and pagination.

**Query Parameters:**
- `page=1` - Page number
- `limit=10` - Items per page
- `search=website` - Search in title/description
- `status=pending` - Filter by status

**Response:**
```json
{
  "tasks": [
    {
      "_id": "674a1b2c3d4e5f6789012346",
      "title": "Build a Website",
      "status": "pending",
      "createdAt": "2025-01-09T10:30:00Z"
    }
  ],
  "pagination": {
    "current": 1,
    "total": 5,
    "count": 42,
    "limit": 10
  }
}
```

### PUT /api/tasks/[id]
Update an existing task.

**Request:**
```json
{
  "title": "Build a Portfolio Website",
  "description": "Updated description",
  "status": "done"
}
```

### GET /api/tasks/[id]/subtasks
Get subtasks for a specific task.

**Response:**
```json
{
  "subtasks": [
    {
      "subtask_id": "674a1b2c3d4e5f6789012347",
      "description": "Plan and outline the website structure",
      "isCompleted": true
    }
  ]
}
```

---

## Development Choices

### Why Next.js 14 with App Router?

- Server-side rendering and static generation capabilities
- Built-in API routes for full-stack development
- Excellent TypeScript support and developer experience
- Optimized performance with automatic code splitting

### Why Google Gemini with Structured Output?

- Latest AI technology with reliable structured responses
- Built-in validation and type safety for subtask generation
- Consistent JSON output format for seamless integration
- Cost-effective compared to other AI services

### Why MongoDB with Mongoose?

- Flexible schema design for task and subtask management
- Excellent Node.js ecosystem integration
- Built-in validation and middleware support
- Scalable for future feature additions


---

## Architecture

### AI Integration

The application uses Google Gemini 2.0 Flash with structured output to automatically generate actionable subtasks:

1. **Subtask Generation**: When creating a task, AI analyzes the title and description
2. **Structured Output**: Gemini returns formatted JSON array of subtask strings

### Authentication Flow

- JWT tokens stored in HTTP-only cookies for security
- Password hashing using bcryptjs with salt rounds
- Protected API routes with middleware validation
- User isolation ensuring data privacy

### Database Schema

```typescript
// Task Model
{
  title: String (max 100 chars),
  description: String (max 500 chars),
  status: 'pending' | 'done' (default: 'pending'),
  userId: ObjectId (ref: User),
  subtasks: [SubtaskSchema],
  createdAt: Date,
  updatedAt: Date
}

// Subtask Schema
{
  subtask_id: String (unique),
  description: String (max 200 chars),
  isCompleted: Boolean (default: false)
}
```

### Project Structure

```
src/
├── app/                    # Next.js 14 App Router
│   ├── api/               # API routes (auth, tasks, subtasks)
│   ├── dashboard/         # Protected dashboard page
│   ├── login/            # Authentication pages
│   └── register/         
├── components/            # Reusable React components
│   ├── ui/               # shadcn/ui components
│   ├── TaskCard.tsx      # Task display component
│   ├── TaskForm.tsx      # Task CRUD operations
│   └── SubtaskList.tsx   # Subtask management
├── hooks/                # Custom React Query hooks
│   ├── useTasks.ts       # Task-related operations
│   └── useSubtasks.ts    # Subtask operations
├── services/             # External service integrations
│   └── geminiService.ts  # AI subtask generation
├── models/               # MongoDB/Mongoose schemas
│   ├── Task.ts           # Task and Subtask models
│   └── User.ts           # User authentication model
└── lib/                  # Utility functions and middleware
    ├── auth.ts           # JWT utilities
    ├── dbConnect.ts      # MongoDB connection
    └── middleware.ts     # API middleware
```

---

## Acknowledgements

This project was completed with the assistance of various online resources and documentation:

- Google Gemini API Documentation for structured output implementation
- MongoDB and Mongoose Documentation
- shadcn/ui Documentation

### What was the challenging part of the assignment?

- **AI Integration**: Implementing reliable AI subtask generation with structured output and fallback systems
