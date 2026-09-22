# 🛒 React E-Commerce Store with Firebase

## Overview

A React and TypeScript e-commerce application using **Firebase Authentication** and **Cloud Firestore**.

Users can register, log in, browse and manage products, add items to a shopping cart, place orders, and view their order history and individual order details.

The project originally used the FakeStore API but has been migrated to **Cloud Firestore** for product management.

## 🚀 Features

* Firebase email/password authentication
* User registration, login, and logout
* User profile CRUD operations
* Firestore product CRUD operations
* Product category filtering
* Redux Toolkit shopping cart
* Cart persistence with `sessionStorage`
* Firebase checkout and order creation
* User-specific order history
* Individual order details
* Responsive Bootstrap interface

## 🔥 Firestore Collections

```text
users
products
orders
```

* `users` — Stores user profile information
* `products` — Stores product information
* `orders` — Stores completed user orders

## 🧠 Technologies

* React
* TypeScript
* Vite
* Firebase Authentication
* Cloud Firestore
* Redux Toolkit
* React Query
* React Router
* Bootstrap 5

## ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/SamiirDeveloper/implementing-firebase-into-react-e-commerce-app.git
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

## 🔥 Firebase Setup

To use your own Firebase project:

1. Create a Firebase project.
2. Register a Firebase Web App.
3. Enable Email/Password Authentication.
4. Create a Cloud Firestore database.
5. Add your Firebase configuration to `src/firebase.ts`.

## 📌 Key Learning Outcomes

This project demonstrates:

* Firebase integration with React
* Firebase Authentication
* Firestore CRUD operations
* User and product management
* Redux Toolkit state management
* Creating and storing orders
* User-specific order history
* React Router navigation
* TypeScript with React

## 👨‍💻 Author

**Samir Mohamud**
