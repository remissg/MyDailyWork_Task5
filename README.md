# 📊 Project Management System (PMS)

A full-stack project management application built with the MERN stack, featuring real-time updates, task management, and team collaboration tools.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-green.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-4.4+-brightgreen.svg)

## ✨ Features

### Core Functionality
- 🔐 **User Authentication** - Secure registration and login with JWT tokens
- 📋 **Project Management** - Create, edit, and delete projects with detailed tracking
- ✅ **Task Management** - Organize tasks with drag-and-drop functionality
- 📊 **Dashboard Analytics** - Visualize project progress and team performance
- 🔔 **Real-time Notifications** - Stay updated with WebSocket-powered notifications
- 👥 **Team Collaboration** - Invite and manage team members
- 🎯 **Role-based Access** - Admin and user role management
- ⚙️ **User Settings** - Customize profile and preferences
- 🌓 **Theme Support** - Built with ThemeContext for dark/light mode

### Technical Features
- **Real-time Updates** - Socket.io integration for live collaboration
- **Responsive Design** - Mobile-friendly UI with Tailwind CSS
- **Drag & Drop** - Modern task organization with @hello-pangea/dnd
- **Charts & Analytics** - Data visualization with Recharts
- **Smooth Animations** - Enhanced UX with Framer Motion
- **Toast Notifications** - User-friendly alerts with react-hot-toast

## 🚀 Tech Stack

### Frontend
- **React** 19.2.0 - Modern UI library
- **Vite** - Lightning-fast build tool
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API requests
- **Socket.io Client** - Real-time bidirectional communication
- **Framer Motion** - Animation library
- **Recharts** - Charting library
- **Lucide React** - Beautiful icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Socket.io** - Real-time engine
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Nodemailer** - Email service
- **Multer** - File upload handling

## 📁 Project Structure

```
PMS/
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── assets/           # Static assets
│   │   ├── components/       # Reusable React components
│   │   ├── context/          # React context providers
│   │   │   └── ThemeContext.jsx
│   │   ├── pages/            # Page components
│   │   │   ├── Auth/         # Login & Register
│   │   │   ├── Admin/        # Admin dashboard
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── ProjectDetails.jsx
│   │   │   ├── Tasks.jsx
│   │   │   ├── Settings.jsx
│   │   │   └── Landing.jsx
│   │   ├── services/         # API service layer
│   │   │   └── authService.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vercel.json           # Vercel deployment config
│   └── package.json
│
├── server/                    # Backend Node.js application
│   ├── middleware/           # Express middleware
│   ├── models/               # Mongoose models
│   │   ├── User.js
│   │   ├── Project.js
│   │   ├── Task.js
│   │   └── Notification.js
│   ├── routes/               # API routes
│   │   ├── auth.js
│   │   ├── projects.js
│   │   ├── tasks.js
│   │   ├── admin.js
│   │   └── notifications.js
│   ├── services/             # Business logic
│   │   └── email.js
│   ├── uploads/              # File uploads directory
│   ├── index.js              # Server entry point
│   ├── socket.js             # Socket.io configuration
│   └── package.json
│
├── .gitignore
├── LICENSE
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

### 1. Clone the Repository
```bash
git clone <repository-url>
cd PMS
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Configure your `.env` file:
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/pms_db

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d

# Client
CLIENT_URL=http://localhost:5173

# Email (Optional - for notifications)
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

### 3. Frontend Setup

```bash
# Navigate to client directory
cd ../client

# Install dependencies
npm install

# Create .env file (optional)
cp .env.example .env
```

Configure your client `.env` file (if needed):
```env
VITE_API_URL=http://localhost:5000
```

### 4. Run the Application

**Option 1: Run both servers separately**

Terminal 1 (Backend):
```bash
cd server
npm run dev
```

Terminal 2 (Frontend):
```bash
cd client
npm run dev
```

**Option 2: Run from project root**
```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend (in new terminal)
cd client && npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## 📖 API Documentation

### Authentication Endpoints
```
POST   /api/auth/register     - Register new user
POST   /api/auth/login        - Login user
GET    /api/auth/me           - Get current user
POST   /api/auth/forgot       - Request password reset
POST   /api/auth/reset        - Reset password
```

### Project Endpoints
```
GET    /api/projects          - Get all projects
POST   /api/projects          - Create new project
GET    /api/projects/:id      - Get project by ID
PUT    /api/projects/:id      - Update project
DELETE /api/projects/:id      - Delete project
```

### Task Endpoints
```
GET    /api/tasks             - Get all tasks
POST   /api/tasks             - Create new task
GET    /api/tasks/:id         - Get task by ID
PUT    /api/tasks/:id         - Update task
DELETE /api/tasks/:id         - Delete task
```

### Admin Endpoints
```
GET    /api/admin/users       - Get all users
PUT    /api/admin/users/:id   - Update user role
DELETE /api/admin/users/:id   - Delete user
GET    /api/admin/stats       - Get system statistics
```

### Notification Endpoints
```
GET    /api/notifications     - Get user notifications
PUT    /api/notifications/:id - Mark notification as read
DELETE /api/notifications/:id - Delete notification
```

## 🎨 Features in Detail

### Dashboard
- Overview of all projects and tasks
- Progress tracking with visual charts
- Recent activity feed
- Quick actions for common tasks

### Project Management
- Create projects with detailed descriptions
- Set deadlines and priorities
- Track project progress
- Assign team members
- View project analytics

### Task Management
- Create and assign tasks
- Drag-and-drop task organization
- Set task status (Todo, In Progress, Done)
- Add task descriptions and attachments
- Filter and search tasks

### Real-time Collaboration
- Live updates when team members make changes
- Instant notifications for task assignments
- Real-time chat (if implemented)
- Activity tracking

### Admin Panel
- User management
- System-wide statistics
- Role assignment
- Activity monitoring

## 🔐 Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Protected routes and API endpoints
- CORS configuration
- Input validation and sanitization

## 🚀 Deployment

### Deploy to Vercel (Frontend)

The project includes a `vercel.json` configuration file for easy deployment.

```bash
cd client
vercel deploy
```

### Deploy Backend

You can deploy the backend to:
- **Heroku**
- **Railway**
- **Render**
- **DigitalOcean**
- **AWS**

Make sure to:
1. Set all environment variables
2. Configure MongoDB connection (use MongoDB Atlas for cloud)
3. Update CORS settings with your frontend URL

### Environment Variables for Production

Update these in your deployment platform:
- `MONGO_URI` - Your MongoDB connection string
- `JWT_SECRET` - Strong secret key
- `CLIENT_URL` - Your deployed frontend URL
- Email credentials (if using email features)

## 🧪 Testing

```bash
# Run backend tests
cd server
npm test

# Run frontend tests
cd client
npm test
```

## 📝 Scripts

### Backend (server/package.json)
```bash
npm start       # Start production server
npm run dev     # Start development server with nodemon
npm test        # Run tests
```

### Frontend (client/package.json)
```bash
npm run dev     # Start development server
npm run build   # Build for production
npm run preview # Preview production build
npm run lint    # Run ESLint
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Joydip Maiti**

## 🙏 Acknowledgments

- React team for the amazing library
- MongoDB team for the robust database
- All open-source contributors

## 📞 Support

If you have any questions or need help, please:
- Open an issue in the repository
- Contact the maintainer

## 🔮 Future Enhancements

- [ ] File attachment support for tasks
- [ ] Advanced search and filtering
- [ ] Export projects/tasks to PDF
- [ ] Integration with third-party tools (Slack, Jira)
- [ ] Mobile app (React Native)
- [ ] Time tracking functionality
- [ ] Calendar view for deadlines
- [ ] Team chat feature
- [ ] Activity timeline
- [ ] Custom project templates

---

Made with ❤️ by Joydip Maiti
