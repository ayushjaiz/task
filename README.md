# Task Manager - Modern Task Management Application

A full-stack task management application built with Next.js 14, TypeScript, MongoDB, and shadcn/ui. Features include user authentication, CRUD operations, search & filtering, pagination, and responsive design.

## 🚀 Features

### Authentication

- **Secure Sign Up/Login** with email and password
- **JWT-based authentication** with HTTP-only cookies
- **Password hashing** using bcryptjs
- **Protected routes** and user session management

### Task Management

- **Complete CRUD operations** (Create, Read, Update, Delete)
- **Task properties**: title, description, status (pending/done), timestamps
- **User isolation** - users can only access their own tasks
- **Optimistic updates** for smooth user experience

### Search & Filtering

- **Real-time search** by title or description
- **Status filtering** (All, Pending, Done)
- **Combined search and filter** functionality
- **Pagination** for efficient data loading

### Modern UI/UX

- **Responsive design** that works on all devices
- **Clean and minimal** interface using shadcn/ui
- **Loading states** and error handling
- **Accessible components** with proper ARIA labels
- **Smooth animations** and transitions

## 🛠️ Tech Stack

### Frontend

- **Next.js 14** (App Router)
- **TypeScript** for type safety
- **React Query (TanStack Query)** for data fetching and caching
- **shadcn/ui** for beautiful, accessible components
- **Tailwind CSS** for styling
- **Lucide React** for icons

### Backend

- **Next.js API Routes** for serverless functions
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing

### Development Tools

- **ESLint** for code linting
- **TypeScript** for type checking
- **Git** for version control

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager
- **MongoDB** (local installation or MongoDB Atlas)
- **Git** for cloning the repository

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd task-manager-3
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory and add the following variables:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/task-manager
# For MongoDB Atlas, use: mongodb+srv://username:password@cluster.mongodb.net/task-manager

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NEXTAUTH_SECRET=your-nextauth-secret-key
NEXTAUTH_URL=http://localhost:3000
```

**Important**:

- Replace `your-super-secret-jwt-key-change-this-in-production` with a strong, random secret
- For production, use environment-specific URLs and secrets
- Keep your `.env.local` file secure and never commit it to version control

### 4. Database Setup

#### Option A: Local MongoDB

1. Install MongoDB on your local machine
2. Start the MongoDB service
3. The application will automatically create the database and collections

#### Option B: MongoDB Atlas (Recommended for production)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string and replace the `MONGODB_URI` in `.env.local`
4. Make sure to whitelist your IP address

### 5. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📁 Project Structure

```
src/
├── app/                    # Next.js 14 App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   └── tasks/         # Task management endpoints
│   ├── dashboard/         # Dashboard page
│   ├── login/            # Login page
│   ├── register/         # Registration page
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/            # Reusable React components
│   ├── ui/               # shadcn/ui components
│   ├── TaskCard.tsx      # Task display component
│   └── TaskForm.tsx      # Task creation/editing form
├── contexts/             # React Context providers
│   └── AuthContext.tsx   # Authentication context
├── hooks/                # Custom React hooks
│   └── useTasks.ts       # Task-related API hooks
├── lib/                  # Utility functions
│   ├── auth.ts           # Authentication utilities
│   ├── dbConnect.ts      # Database connection
│   ├── middleware.ts     # API middleware
│   └── utils.ts          # General utilities
├── models/               # MongoDB/Mongoose models
│   ├── Task.ts           # Task model
│   └── User.ts           # User model
└── providers/            # Application providers
    └── QueryProvider.tsx # React Query provider
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

## 🌐 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Tasks

- `GET /api/tasks` - Get tasks with pagination and filtering
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/[id]` - Get a specific task
- `PUT /api/tasks/[id]` - Update a task
- `DELETE /api/tasks/[id]` - Delete a task

### Query Parameters for GET /api/tasks

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search in title and description
- `status` - Filter by status (pending/done)

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy automatically on every push

### Environment Variables for Production

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/task-manager
JWT_SECRET=your-production-jwt-secret
NEXTAUTH_SECRET=your-production-nextauth-secret
NEXTAUTH_URL=https://your-domain.vercel.app
```

### MongoDB Atlas Setup for Production

1. Create a MongoDB Atlas account
2. Set up a cluster
3. Create a database user
4. Configure network access (IP whitelist)
5. Get the connection string and update `MONGODB_URI`

## 🔐 Security Features

- **Password Hashing**: All passwords are hashed using bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **HTTP-Only Cookies**: Tokens stored in secure, HTTP-only cookies
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Proper CORS configuration
- **User Isolation**: Users can only access their own data

## 🎨 UI Components

This project uses [shadcn/ui](https://ui.shadcn.com/) for consistent, accessible, and beautiful components:

- **Form Components**: Input, Label, Button, Select
- **Layout Components**: Card, Dialog, Badge
- **Feedback Components**: Loading states, Error boundaries
- **Icons**: Lucide React icon library

## 🧪 Development Tips

### Customizing the UI

- Modify `src/app/globals.css` for global styles
- Update `tailwind.config.ts` for custom theme configurations
- Add new shadcn/ui components using their CLI

### Adding New Features

- Create new API routes in `src/app/api/`
- Add React Query hooks in `src/hooks/`
- Build reusable components in `src/components/`

### Database Schema Changes

- Update Mongoose models in `src/models/`
- Ensure proper validation and indexing
- Test with both local and Atlas databases

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**

   - Check if MongoDB is running (local) or connection string is correct (Atlas)
   - Verify environment variables are loaded correctly

2. **Authentication Issues**

   - Ensure JWT_SECRET is set and consistent
   - Check cookie settings for your domain

3. **Build Errors**

   - Run `npm run type-check` to identify TypeScript issues
   - Ensure all dependencies are installed

4. **Performance Issues**
   - Check React Query cache configuration
   - Optimize database queries with proper indexing

### Getting Help

If you encounter issues:

1. Check the browser console for client-side errors
2. Check the server logs for API errors
3. Verify environment variables are correctly set
4. Ensure database connectivity

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📧 Contact

For questions or support, please open an issue in the GitHub repository.

---

**Happy Task Managing!** 🎉
