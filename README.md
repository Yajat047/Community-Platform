# Get Linked - Mini LinkedIn Community Platform

A full-stack social networking platform built with modern web technologies, featuring user authentication, post management, admin dashboard, and real-time interactions.

## Tech Stack

### Frontend
- **React 19.1.0** - Modern UI library with hooks and context
- **Vite 7.0.4** - Lightning-fast build tool and dev server
- **React Router DOM 7.7.1** - Client-side routing and navigation
- **Axios 1.11.0** - HTTP client for API communications
- **CSS3** - Custom styling with responsive design
- **ESLint** - Code linting and quality assurance

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js 4.18.2** - Web application framework
- **MongoDB** - NoSQL document database
- **Mongoose 8.0.0** - ODM for MongoDB and Node.js
- **JWT (jsonwebtoken 9.0.2)** - Token-based authentication
- **bcryptjs 2.4.3** - Password hashing and security
- **CORS 2.8.5** - Cross-Origin Resource Sharing
- **express-validator 7.0.1** - Input validation and sanitization
- **dotenv 16.3.1** - Environment variable management

### Development Tools
- **Nodemon 3.0.1** - Auto-restart server during development
- **Concurrently 8.2.2** - Run multiple npm scripts simultaneously
- **VS Code** - Development environment with extensions

## Features

### Authentication & Authorization
- User registration and login
- JWT-based authentication
- Protected routes and middleware
- Role-based access control (User/Admin)
- Secure password hashing with bcrypt

### User Management
- User profiles with personal information
- View other users' profiles
- User activity tracking
- Account creation date display

### Post Management
- Create, read, and delete posts
- Character limit validation (1-1000 characters)
- Author attribution and timestamps
- Chronological post ordering

### Interactive Features
- Like/Unlike posts functionality
- Real-time like count updates
- Optimistic UI updates
- Persistent like storage in database

### Admin Dashboard
- Platform statistics overview
- User management (promote/demote/delete)
- Post moderation and deletion
- Admin-only protected routes
- Comprehensive user and content analytics

### UI/UX Features
- Responsive design for all screen sizes
- Modern dark theme interface
- Intuitive navigation with React Router
- Modal popups with React Portals
- Loading states and error handling
- Smooth animations and transitions

### Technical Features
- RESTful API design
- Input validation and sanitization
- Error handling and logging
- Environment-based configuration
- CORS enabled for cross-origin requests
- Modular component architecture

## Project Structure

```
Community-Platform/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── Navbar.jsx   # Navigation component
│   │   │   ├── PostForm.jsx # Post creation form
│   │   │   ├── PostList.jsx # Posts display with likes
│   │   │   └── ProtectedRoute.jsx # Route protection
│   │   ├── context/         # React Context providers
│   │   │   └── AuthContext.jsx # Authentication state
│   │   ├── pages/           # Page components
│   │   │   ├── Home.jsx     # Main feed page
│   │   │   ├── Login.jsx    # User login
│   │   │   ├── Register.jsx # User registration
│   │   │   ├── Profile.jsx  # User profile
│   │   │   ├── UserProfile.jsx # Other users' profiles
│   │   │   └── AdminDashboard.jsx # Admin panel
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # App entry point
│   ├── public/              # Static assets
│   └── package.json         # Frontend dependencies
├── backend/                 # Node.js backend application
│   ├── middleware/          # Custom middleware
│   │   ├── auth.js         # JWT authentication
│   │   └── adminAuth.js    # Admin role verification
│   ├── models/             # Mongoose data models
│   │   ├── User.js         # User schema with roles
│   │   └── Post.js         # Post schema with likes
│   ├── routes/             # API route handlers
│   │   ├── auth.js         # Authentication routes
│   │   ├── users.js        # User management routes
│   │   ├── posts.js        # Post and like routes
│   │   └── admin.js        # Admin dashboard routes
│   ├── server.js           # Express server setup
│   └── package.json        # Backend dependencies
└── package.json            # Root package with scripts
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Community-Platform
   ```

2. **Install all dependencies:**
   ```bash
   npm run install-deps
   ```

3. **Configure environment variables:**
   ```bash
   cd backend
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/get-linked
   JWT_SECRET=your-secret-key
   PORT=5000
   ```

4. **Start MongoDB:**
   - **Local MongoDB:** Start your local MongoDB service
   - **MongoDB Atlas:** Ensure your cluster is running and update the connection string

5. **Start the application:**
   ```bash
   npm run dev
   ```

6. **Access the application:**
   - **Frontend:** https://get-linked-ebon.vercel.app/
   - **Backend API:** https://community-platform-x95s.onrender.com/api/

## Demo Logins

For testing purposes, you can use these pre-configured accounts:

### Admin Account
- **Email:** admin@email.com
- **Password:** 12345678
- **Permissions:** Full admin access to dashboard, user management, and all features

### Regular User Account
- **Email:** user@email.com
- **Password:** 12345678
- **Permissions:** Standard user access to create posts, like content, and view profiles

## API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user

### Posts
- `GET /posts` - Get all posts
- `POST /posts` - Create new post
- `GET /posts/user/:userId` - Get posts by user
- `POST /posts/:id/like` - Like/unlike post
- `GET /posts/:id/like-status` - Get like status

### Users
- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update user profile
- `GET /users/:id` - Get user by ID

### Admin
- `GET /admin/stats` - Platform statistics
- `GET /admin/users` - All users list
- `DELETE /admin/users/:id` - Delete user
- `PUT /admin/users/:id/promote` - Promote to admin
- `PUT /admin/users/:id/demote` - Demote to user
- `GET /admin/users/:id/posts` - Get user's posts
- `DELETE /admin/posts/:id` - Delete any post

## User Roles & Access

### Regular Users
- Create and manage their own posts
- Like/unlike any posts
- View their own and others' profiles
- Access home feed and user profiles

### Administrators
- All regular user permissions
- Access admin dashboard
- View platform statistics
- Manage all users (promote/demote/delete)
- Delete any posts
- View detailed user analytics

## Admin Setup

**Initial Admin Creation:**
1. Register a new user account normally
2. Manually update the database to change role to 'admin':
   ```javascript
   db.users.updateOne(
     { email: "admin@example.com" }, 
     { $set: { role: "admin" } }
   )
   ```
3. Or have an existing admin promote the user via the dashboard

## Key Features Implemented

- Full CRUD Operations for posts and users
- JWT Authentication with protected routes
- Role-based Authorization (User/Admin)
- Like System with persistent storage
- Admin Dashboard with comprehensive management
- Responsive Design for mobile and desktop
- Real-time Updates with optimistic UI
- Input Validation and error handling
- Modal Components with React Portals
- RESTful API design patterns

## Development Scripts

```bash
# Start both frontend and backend in development mode
npm run dev

# Start only frontend
npm run frontend

# Start only backend  
npm run backend

# Build frontend for production
npm run build

# Install all dependencies (root, frontend, backend)
npm run install-deps
```
