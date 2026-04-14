# TechShop: MERN E-Commerce Platform 🛒

![MERN Stack](https://img.shields.io/badge/MERN-Stack-blue?logo=mongodb)
![React](https://img.shields.io/badge/React-18.x-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-20.x-green?logo=node.js)
![Redux](https://img.shields.io/badge/Redux-Toolkit-purple?logo=redux)

> A full-featured e-commerce platform built from scratch using the MERN stack (MongoDB, Express, React, Node.js). 

I built this project to master full-stack state management, secure API architecture, and seamless third-party payment integration.

---

## 📸 Overview

**[🚀 View Live Project](https://mern-ecommerce-tau-six.vercel.app/)**

## 📸 Project Screenshots

<img width="1920" height="932" alt="2026-04-10 13_35_28-" src="https://github.com/user-attachments/assets/9e6bd32f-f7a1-44c0-9646-fc29f92f4f3d" />

## ✨ Key Features

### 🛍️ Customer Facing
* **Full Shopping Cart:** Add, remove, and adjust quantities of items.
* **Product Search & Pagination:** Easily find products and navigate through large inventories.
* **Product Reviews & Ratings:** Logged-in users can leave 1-to-5 star reviews and comments.
* **Secure Checkout Pipeline:** Step-by-step shipping, payment selection, and final order review.
* **PayPal Integration:** Live credit card and PayPal payment processing.
* **User Profiles:** Secure registration, login, profile updates, and past order history tracking.

### 🛡️ Admin Dashboard
* **Inventory Management:** Create, read, update, and delete (CRUD) products.
* **Image Uploads:** Upload local product images directly to the server via Multer.
* **User Management:** View all users, delete toxic accounts, and elevate users to Admin status.
* **Order Tracking:** View all customer orders and mark them as "Delivered" upon shipping.

---

## 🛠️ Tech Stack & Architecture

**Frontend:**
* **React.js:** Functional components & Hooks.
* **Redux Toolkit:** Global state management & caching.
* **React Router DOM:** Frontend routing & secure route protection.
* **React Bootstrap:** Responsive UI components.

**Backend:**
* **Node.js & Express.js:** RESTful API architecture.
* **MongoDB & Mongoose:** NoSQL database and Object Data Modeling (ODM).
* **JSON Web Tokens (JWT):** Secure, HTTP-only cookie-based authentication.
* **Bcrypt.js:** Secure password hashing.
* **Multer:** Local file uploading.

---

## 🚀 Getting Started (Local Development)

Want to run this project on your own machine? Follow these steps:

### 1. Clone the Repository
```bash
git clone https://github.com/lonwulf07/mern-ecommerce.git
cd mern-ecommerce
```

### 2. Install Dependencies
This project uses a root `package.json` to manage both frontend and backend concurrently.
```bash
# Install backend packages
npm install

# Install frontend packages
npm run client:install
```

### 3. Environment Variables
Create a `.env` file in the **root** directory of the project and add the following variables:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key
PAYPAL_CLIENT_ID=your_paypal_sandbox_client_id
```

### 4. Seed the Database (Optional)
Populate the database with sample users and products to get started quickly:
```bash
# WARNING: This will destroy any existing data in your database!
npm run data:import 
```
*Note: The default Admin login is `test@xyz.com` / `test@1234`.*

### 5. Run the Application
Boot up both the Express backend and React frontend concurrently:
```bash
npm run dev
```
The application will automatically open in your browser at `http://localhost:3000`.

---

## 🤝 Let's Connect!
Created by **Mohit Sharma** - Feel free to reach out to me on [LinkedIn](https://linkedin.com/in/mohit-ml/) or check out my other projects!
