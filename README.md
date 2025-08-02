# Community Platform

## Stack Used

- **Frontend**: React 18 + Vite
- **Backend**: Node.js + Express
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT tokens
- **HTTP Client**: Axios
- **Routing**: React Router

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm run install-deps
   ```

2. **Configure environment:**
   - Copy `backend/.env.example` to `backend/.env`
   - Update MongoDB connection string if needed

3. **Start MongoDB** (locally or use MongoDB Atlas)

4. **Start the application:**
   ```bash
   npm run dev
   ```

5. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

## Admin/Demo User Logins

No pre-configured admin users. Register a new account to start using the platform.

**Note**: All new registrations default to 'user' role. To create an admin user, you can:
1. Register a user normally
2. Manually update the database to change their role to 'admin'
3. Or have another admin promote them via the admin dashboard

**Admin Features**:
- View platform statistics
- Manage all users (delete users, promote/demote roles)  
- Delete any posts
- Access admin dashboard at `/admin`
