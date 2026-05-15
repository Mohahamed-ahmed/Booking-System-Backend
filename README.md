# 🧳 Booking System Backend API

A full-featured RESTful backend API for a travel booking platform built with **Node.js**, **Express.js**, and **MongoDB**.

It handles authentication, bookings, destinations, packages, image uploads, and role-based access control.

---

## 🚀 Features

- JWT Authentication (Access + Refresh Tokens)
- Secure Refresh Token Flow (HTTP-only cookies)
- Role-Based Authorization (Admin / User)
- Password Reset & Forgot Password
- User Profile Management
- Destination Management (CRUD)
- Travel Package Management (CRUD)
- Booking System (Create / Update / Delete)
- Cloudinary Image Uploads
- Protected Routes & Middleware
- MongoDB Relationships (Mongoose)
- RESTful API Architecture

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- MongoDB & Mongoose
- JSON Web Token (JWT)
- Bcrypt.js
- Cloudinary
- Multer
- Cookie Parser
- Nodemailer / Resend

---

## 📦 API Modules

### 🔐 Authentication
- Register
- Login
- Logout
- Refresh Token
- Forgot Password
- Reset Password

### 👤 User
- Get User
- My Profile

### 📍 Destinations
- Create Destination (Admin)
- Update Destination (Admin)
- Delete Destination (Admin)
- Get All Destinations
- Get Destination Details

### 📦 Packages
- Create Package (Admin)
- Update Package (Admin)
- Delete Package (Admin)
- Get All Packages
- Get Package Details
- Get Packages By Destination ID 

### 🧾 Bookings
- Create Booking
- Update Booking Status (Admin)
- Delete Booking
- Get User Bookings
- Get All Bookings (Admin)

### 🖼️ Image Uploads
- Upload & manage images using Cloudinary

---

## 🔐 Authentication Flow

- Access Token used for API requests
- Refresh Token stored in **HTTP-only cookies**
- Automatic token refresh mechanism
- Secure protected routes via middleware

---

## ☁️ Deployment

- Backend: Vercel
- Database: MongoDB Atlas

---

## 📄 API Documentation

- Swagger Documentation (if available)
- Postman Collection included

---

## 👨‍💻 Author

**Mohamed Ahmed**

---

## 📌 Notes

This project follows a modular structure with separation of concerns for scalability and maintainability.