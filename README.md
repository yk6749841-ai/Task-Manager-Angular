
---

# Tasks-Board
![תמונת פתיחת המערכת](./public/images/image2.png)

## 📋 Project Description

**Tasks-Board** is an advanced task management application built with **Angular**.  
The application provides a comprehensive solution for managing tasks, projects, and teams, with a focus on intuitive user experience, high security, and responsive design.

The application is designed to enhance collaboration among team members, streamline workflows, and provide advanced tools for smart and efficient task management.  
With support for comment management, advanced routing, and modular services, **Tasks-Board** is suitable for teams of all sizes.

---

## 🎯 Key Features

- ✅ **Task Management** - Create, edit, delete, and mark tasks as completed.
- 🔐 **Advanced Security** - Use of Interceptors for token management and user authentication.
- 🛣️ **Smart Routing** - Route Guards to protect sensitive routes.
- 💬 **Comment System** - Manage discussions on each task.
- 📱 **Responsive Design** - Fully adapted for all screen sizes (Desktop, Tablet, Mobile).
- 🎨 **Modularity** - Reusable components and services.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── app.config.ts          # Application configuration
│   ├── app.routes.ts          # Route definitions
│   ├── app.ts                 # Root component
│   └── app.html               # Root template
│
├── components/                # Sub-components
│   ├── comments/              # Comments component
│   ├── header/                # Header component
│   ├── home-page/             # Home page component
│   ├── login/                 # Login component
│   ├── projects/              # Projects component
│   ├── register/              # Registration component
│   ├── tasks/                 # Tasks component
│   └── teams/                 # Teams component
│
├── guards/                    # Route Guards
│   └── auth-guard.ts          # User authentication guard
│
├── interceptors/              # HTTP Interceptors
│   └── auth-interceptor.ts    # Token management interceptor
│
├── models/                    # Models
│   ├── comments.ts            # Comments model
│   ├── projects.ts            # Projects model
│   ├── tasks.ts               # Tasks model
│   ├── teams.ts               # Teams model
│   └── user.ts                # User model
│
├── services/                  # Services
│   ├── auth.ts                # Authentication service
│   ├── comments-service.ts    # Comments service
│   ├── projects.ts            # Projects service
│   ├── tasks-service.ts       # Tasks service
│   └── teams.ts               # Teams service
│
└── styles.css                 # Global styles
```

---

## 🔌 API Endpoints

The application communicates with the backend using a secure RESTful API. Below are the updated endpoints:

### Health Check
- **GET** `/api/health` - Server health check. Returns `{ status: "ok" }`.

### Authentication
- **POST** `/api/auth/register` - Register a new user. Returns a token and user details.
- **POST** `/api/auth/login` - Login with email/password. Returns a token and user details.

### Teams
- **GET** `/api/teams` (Protected) - Returns the list of teams the user is a member of, including member count.
- **POST** `/api/teams` (Protected) - Create a new team and add the creator as the owner.
- **POST** `/api/teams/:teamId/members` (Protected) - Add a user to a team.

### Projects
- **GET** `/api/projects` (Protected) - Returns the list of projects for teams the user is a member of.
- **POST** `/api/projects` (Protected) - Create a new project for a team the user is a member of.

### Tasks
- **GET** `/api/tasks` (Protected) - Returns the user's tasks (based on team membership). Supports `projectId` filter.
- **POST** `/api/tasks` (Protected) - Create a task in a project for a team the user is a member of.
- **PATCH** `/api/tasks/:id` (Protected) - Update allowed fields in a task if the user is a member of the project's team.
- **DELETE** `/api/tasks/:id` (Protected) - Delete a task if the user is a member of the project's team.

### Comments
- **GET** `/api/comments?taskId=` (Protected) - Returns comments for a task only if the user is a member of the project's team.
- **POST** `/api/comments` (Protected) - Create a new comment for a task only if the user is a member of the project's team.

---

## 🛠️ Technologies

- **Framework:** Angular
- **Language:** TypeScript
- **HTTP:** Angular Common HTTP with Interceptors
- **Routing:** Angular Router
- **Styling:** Modular CSS

---

## 🚀 Installation and Execution

### Prerequisites
- Node.js
- npm

### Installation Steps

```bash
# Install dependencies
npm install

# Start the development server
ng serve
```

The development server will be available at `http://localhost:4200`.

---

## 📜 License

```
© 2026 All rights reserved to Yehudit Kraus
Email: yk6749841@gmail.com
```

--- 
