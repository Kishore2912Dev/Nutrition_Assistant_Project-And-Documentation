# 🥗 Nutrition Assistant

A full-stack web application that helps users maintain a healthy lifestyle by tracking meals, monitoring nutritional progress, and managing personalized diet plans. 
The platform supports multiple user roles, including **Users**, **Dietitians**, and **Administrators**, each with dedicated dashboards and functionalities.

---

## 📖 Table of Contents

- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Installation Guide](#-installation-guide)
- [Environment Variables](#-environment-variables)
- [Running the Application](#-running-the-application)
- [API Endpoints](#-api-endpoints)
- [Screenshots](#-screenshots)
- [Future Enhancements](#-future-enhancements)
- [Contributing](#-contributing)
- [Author](#-author)
- [License](#-license)

---

# 📌 Project Overview

The **Nutrition Assistant** is a MERN-based web application designed to simplify nutrition management by allowing users to:

- Track daily meals
- Monitor nutritional progress
- Access personalized diet plans
- Manage user profiles
- View analytical reports

The application also provides separate dashboards for **Dietitians** and **Administrators** to efficiently manage clients, meal plans, and users.

---

# ✨ Key Features

## 👤 User Module

- User Registration
- Secure Login using JWT Authentication
- Personalized Dashboard
- Meal Logging
- Diet Plan Management
- Progress Tracking
- Reports & Analytics
- Profile Management

---

## 🩺 Dietitian Module

- Dietitian Dashboard
- Manage Clients
- Create Diet Plans
- Update Meal Plans
- Monitor Client Progress

---

## 👨‍💼 Admin Module

- Admin Dashboard
- Manage Users
- Manage Diet Plans
- Monitor System Data

---

# 🏗️ System Architecture

```
                React + Vite
                     │
                     │ Axios
                     ▼
          Express.js REST API
                     │
             JWT Authentication
                     │
                     ▼
             MongoDB Database
```

---

# 💻 Technology Stack

## Frontend

- React.js
- Vite
- React Router DOM
- Axios
- Bootstrap
- CSS3
- React Icons
- Recharts

---

## Backend

- Node.js
- Express.js

---

## Database

- MongoDB
- Mongoose

---

## Authentication

- JSON Web Tokens (JWT)

---

## Development Tools

- Git
- GitHub
- Visual Studio Code
- Postman

---

# 📂 Project Structure

```
Nutrition_Assistant_Project
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── server.js
│   └── package.json
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── assets
│   │   ├── components
│   │   ├── context
│   │   ├── pages
│   │   │   ├── Admin
│   │   │   ├── Authentication
│   │   │   ├── Dashboard
│   │   │   ├── Dietitian
│   │   │   ├── Landing
│   │   │   ├── Meals
│   │   │   ├── Plans
│   │   │   ├── Profile
│   │   │   ├── Progress
│   │   │   └── Reports
│   │   ├── services
│   │   └── styles
│   │
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

# ⚙️ Installation Guide

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/Kishore2912Dev/Nutrition_Assistant_Project.git
```

Navigate into the project directory.

```bash
cd Nutrition_Assistant_Project
```

---

## 2️⃣ Install Backend Dependencies

```bash
cd backend
npm install
```

---

## 3️⃣ Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

# 🔑 Environment Variables

Create a `.env` file inside the **backend** directory.

Example:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret
```

> ⚠️ Never commit your `.env` file to GitHub.

---

# ▶️ Running the Application

## Start Backend

```bash
cd backend

npm run dev
```

or

```bash
npm start
```

Backend runs at

```
http://localhost:5000
```

---

## Start Frontend

```bash
cd frontend

npm run dev
```

Frontend runs at

```
http://localhost:5173
```

---

# 🔗 API Endpoints

## Authentication

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/auth/register` | Register User |
| POST | `/api/auth/login` | Login |

---

## Users

| Method | Endpoint |
|---------|----------|
| GET | `/api/users` |
| GET | `/api/users/:id` |
| PUT | `/api/users/:id` |

---

## Meals

| Method | Endpoint |
|---------|----------|
| GET | `/api/meals` |
| POST | `/api/meals` |
| PUT | `/api/meals/:id` |
| DELETE | `/api/meals/:id` |

---

## Diet Plans

| Method | Endpoint |
|---------|----------|
| GET | `/api/plans` |
| POST | `/api/plans` |
| PUT | `/api/plans/:id` |
| DELETE | `/api/plans/:id` |

---

## Progress

| Method | Endpoint |
|---------|----------|
| GET | `/api/progress` |
| POST | `/api/progress` |

---

# 📊 Features by Role

| Feature | User | Dietitian | Admin |
|----------|------|-----------|-------|
| Register/Login | ✅ | ✅ | ✅ |
| Dashboard | ✅ | ✅ | ✅ |
| Manage Meals | ✅ | ❌ | ❌ |
| Diet Plans | ✅ | ✅ | ✅ |
| Progress Tracking | ✅ | ✅ | ❌ |
| Manage Clients | ❌ | ✅ | ❌ |
| Manage Users | ❌ | ❌ | ✅ |

---

# 📸 Screenshots

Add screenshots of your application here.

Example:

```
screenshots/
│
├── landing-page.png
├── login-page.png
├── dashboard.png
├── meal-logger.png
├── admin-dashboard.png
└── dietitian-dashboard.png
```

---

# 🚀 Future Enhancements

- AI-generated Meal Recommendations
- Food Image Recognition
- Nutrition Prediction
- Appointment Booking
- Email Notifications
- Mobile Responsive Design
- Dark Mode
- Cloud Deployment
- PDF Report Generation

---

# 🤝 Contributing

Contributions are welcome!

1. Fork this repository

2. Create a feature branch

```bash
git checkout -b feature-name
```

3. Commit changes

```bash
git commit -m "Added new feature"
```

4. Push your branch

```bash
git push origin feature-name
```

5. Open a Pull Request

---

# 👨‍💻 Author

**Surya Rama Kishore Vanapalli**

📧 Email: vanapallisuryaramakishore@gmail.com

GitHub:

https://github.com/Kishore2912Dev

Repository:

https://github.com/Kishore2912Dev/Nutrition_Assistant_Project-And-Documentation

---

# 📄 License

This project is licensed under the **MIT License**.

Feel free to use, modify, and distribute this project for educational and personal purposes.
