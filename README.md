# Issue Tracking Application

A full-stack Issue Tracking system built with **React + TypeScript** frontend and **Express.js** backend, following MVC architecture.

## 🛠️ Tech Stack

### Frontend

- **React 19** with TypeScript
- **Vite** - Build tool
- **Material UI (MUI) v6** - UI components
- **Redux + Redux-Saga** - State management
- **React Router v7** - Routing
- **Recharts** - Data visualization
- **Axios** - HTTP client
- **SCSS** - Styling

### Backend

- **Express.js** - Node.js framework
- **MySQL** with **Sequelize ORM**
- **JWT** - Authentication
- **Multer** - File upload handling
- **express-validator** - Request validation

## 🏗️ Project Structure

```
issue-tracking-application/
├── client/                       # React Frontend
│   ├── src/
│   │   ├── assets/              # Themes, styles
│   │   ├── components/          # Reusable components
│   │   │   ├── dashboard/       # Dashboard widgets
│   │   │   ├── issues/          # Issue components
│   │   │   ├── profile/         # Profile components
│   │   │   ├── report/          # Report components
│   │   │   └── shared/          # Shared UI components
│   │   ├── pages/               # Page components
│   │   │   ├── Dashboard/
│   │   │   ├── Issues/
│   │   │   ├── MyIssues/
│   │   │   ├── IssueReport/
│   │   │   ├── Profile/
│   │   │   ├── Users/
│   │   │   ├── Login/
│   │   │   └── Register/
│   │   ├── redux/               # Redux store
│   │   │   ├── actions/
│   │   │   ├── reducers/
│   │   │   ├── sagas/
│   │   │   └── store/
│   │   ├── routes/              # App routing
│   │   ├── services/            # API services
│   │   ├── templates/           # Layout templates
│   │   └── utilities/           # Constants, helpers, models
│   ├── package.json
│   └── vite.config.ts
│
├── server/                       # Express Backend
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js      # MySQL connection pool
│   │   │   └── db/              # Sequelize config & models
│   │   ├── middleware/
│   │   │   ├── auth.js          # JWT authentication
│   │   │   ├── validation.js    # Request validation
│   │   │   ├── upload.js        # File upload config
│   │   │   └── errorHandler.js  # Error handling
│   │   ├── modules/
│   │   │   ├── auth/            # Authentication module
│   │   │   ├── issues/          # Issues module
│   │   │   └── users/           # Users module
│   │   ├── routes/
│   │   │   └── index.js         # Route aggregator
│   │   ├── shared/
│   │   │   ├── constants/
│   │   │   └── utils/           # Response & export helpers
│   │   └── server.js            # Main entry point
│   ├── db/
│   │   └── schema.sql           # Database schema
│   ├── uploads/                 # File uploads directory
│   └── package.json
│
└── README.md
```

## ✨ Features

### User Features

- **Authentication** - Register, Login, JWT-based session
- **Dashboard** - Issue statistics with charts (Bar & Pie)
- **My Issues** - Create, view, and manage personal issues
- **Profile** - Update profile info and change password

### Admin Features

- **All Issues** - View and manage all issues in the system
- **User Management** - Enable/disable users, permanent delete
- **Issue Reports** - Filter and export reports (CSV/JSON)
- **Issue Assignment** - Assign issues to users

### Issue Management

- **CRUD Operations** - Create, Read, Update, Delete issues
- **Status Level** - Open, In Progress, Resolved, Closed
- **Priority Levels** - Low, Medium, High, Critical
- **File Attachments** - Upload files to issues
- **Filtering & Pagination** - Search and filter issues

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MySQL 8+
- npm or yarn

### Instralation

cd your-project-directory
git clone https://github.com/DhananjayaYapa/Issue-Tracking-Application-React-Express-Vite-TS-Vercel.git

### Backend Setup

1. **Navigate to server directory:**

   ```bash
   cd server
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment:**

   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

   ```env
   PORT=5000
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=your_user
   DB_PASS=your_password
   DB_NAME=issue_tracker_db
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   ```

4. **Set up database:**

   ```bash
   # Create database in MySQL
   mysql -u root -p
   CREATE DATABASE issue_tracker_db;

   # Run schema
   mysql -u root -p issue_tracker_db < db/schema.sql
   ```

5. **Seed admin user:**

   ```bash
   npm run seed:admin
   ```

6. **Start development server:**

   ```bash
   npm run dev
   ```

   Server runs at `http://localhost:5000`

### Frontend Setup

1. **Navigate to client directory:**

   ```bash
   cd client
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start development server:**

   ```bash
   npm run dev
   ```

   App runs at `http://localhost:5173`

## 📚 API Endpoints

### Base URL

```
http://localhost:5000/api
```

### Authentication

| Method | Endpoint                | Description              |
| ------ | ----------------------- | ------------------------ |
| POST   | `/auth/register`        | Register new user        |
| POST   | `/auth/login`           | User login               |
| GET    | `/auth/profile`         | Get current user profile |
| PUT    | `/auth/profile`         | Update profile           |
| PUT    | `/auth/change-password` | Change password          |

### Issues

| Method | Endpoint                  | Description               |
| ------ | ------------------------- | ------------------------- |
| GET    | `/issues`                 | Get all issues (Admin)    |
| GET    | `/issues/my-issues`       | Get current user's issues |
| GET    | `/issues/:id`             | Get issue by ID           |
| POST   | `/issues`                 | Create new issue          |
| PUT    | `/issues/:id`             | Update issue              |
| PATCH  | `/issues/:id/status`      | Update issue status       |
| DELETE | `/issues/:id`             | Delete issue              |
| GET    | `/issues/stats/counts`    | Get status counts (Admin) |
| GET    | `/issues/my-stats/counts` | Get user's status counts  |
| GET    | `/issues/export/csv`      | Export issues as CSV      |
| GET    | `/issues/export/json`     | Export issues as JSON     |
| GET    | `/issues/metadata`        | Get issue metadata        |

### Users (Admin)

| Method | Endpoint               | Description             |
| ------ | ---------------------- | ----------------------- |
| GET    | `/users`               | Get all users           |
| DELETE | `/users/:id`           | Disable user            |
| PUT    | `/users/:id/enable`    | Enable user             |
| DELETE | `/users/:id/permanent` | Permanently delete user |

### Health Check

| Method | Endpoint  | Description       |
| ------ | --------- | ----------------- |
| GET    | `/health` | API health status |

## 🔐 User Roles

| Role      | Permissions                                       |
| --------- | ------------------------------------------------- |
| **Admin** | Full access - manage all issues, users, reports   |
| **User**  | Manage own issues, view dashboard, update profile |

## 📝 Scripts

### Backend

```bash
npm run dev      # Start with nodemon
npm run start    # Production start
npm run seed:admin  # Seed admin user
```

### Frontend

```bash
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
npm run lint:fix # Fix ESLint errors
npm run format   # Format with Prettier
```
