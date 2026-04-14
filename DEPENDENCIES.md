# Project Dependencies & Setup Guide

This document lists all the necessary dependencies and environment configurations required to run the Cobalt application.

## 1. Frontend Dependencies
The frontend is built with **React** and **Vite**.

### NPM Packages
These are automatically installed when you run `npm install` inside the `frontend/` directory:
- **`react`**: Core library.
- **`react-dom`**: Web-specific React package.
- **`react-router`**: Routing and navigation.

### External Resources
- **Bootstrap Icons**: Loaded via CDN in `index.html`. No installation required, but an active internet connection is needed for icons to display.

---

## 2. Backend Dependencies
The backend is built with **Node.js**, **Express**, and **MongoDB**.

### NPM Packages
These are automatically installed when you run `npm install` inside the `backend/` directory:
- **`express`**: Web framework.
- **`mongoose`**: MongoDB object modeling.
- **`bcrypt`**: Password hashing.
- **`jsonwebtoken`**: Auth token generation.
- **`dotenv`**: Environment variable management.
- **`cors`**: Cross-Origin Resource Sharing.
- **`nodemailer`**: Email service integration.

---

## 3. Environment Variables (`.env`)
You **must** create a `.env` file in the `backend/` directory for the server to function. Use the following template:

```env
PORT=8080
MONGO_DB_CONNECTION_STRING=your_mongodb_connection_uri
MAIL_USER=your_gmail_address@gmail.com
MAIL_PASSWORD=your_gmail_app_password
URL_BACKEND=http://localhost:8080
JWT_SECRET_KEY=your_random_secret_string
```

---

## 4. System Requirements
- **Node.js**: (Version 18 or higher recommended).
- **MongoDB**: A running instance (Local or MongoDB Atlas).

## 5. Quick Start Instructions
1. **Initial Setup**:
   - Clone the repository.
2. **Backend**:
   - Navigate to `/backend`.
   - Run `npm install`.
   - Create your `.env` file.
   - Run `npm run dev`.
3. **Frontend**:
   - Navigate to `/frontend`.
   - Run `npm install`.
   - Run `npm run dev`.
