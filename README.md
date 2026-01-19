# NexaMart – Full Stack E-Commerce Application 

# Project Link -- evalueweb.netlify.app

NexaMart is a **complete full-stack e-commerce web application** built using **React (Frontend)** and **Node.js + Express + MongoDB (Backend)**.
This project is designed to cover **real-world e-commerce features**, including **product management, category hierarchy, variants, stock handling, authentication, and admin control**.

---

##  Project Overview

NexaMart is not a basic demo project. It is a **production-level e-commerce system** where:

* Users can browse products by **Category → Subcategory**
* Products support **multiple variants** like **Color, Size, Tags**
* Admin can manage **products, stock, orders, users**
* Secure authentication using **JWT**
* Clean separation of **Frontend & Backend**

---

##  Key Features

### Authentication & Authorization

* User Signup & Login
* JWT-based authentication
* Role-based access (**Admin / User**)
* Protected routes (Admin panel security)

---

### Product Management

* Add / Update / Delete products
* Product variants:

  *  Colors
  * Sizes
  *  Tags
* Product images upload
* Product status & visibility control

---

### Category System

* Main Categories
* Sub-Categories (linked to parent category)
* Easy filtering using category structure

---

### Stock & Inventory Management

* Stock quantity tracking
* Variant-level stock control
* Prevents out-of-stock orders
* Admin stock update support

---

### Cart & Order Flow

* Add to cart
* Update quantity
* Place orders
* Order status management (Admin)
* User order history

---

###  User Profile

* User profile management
* Multiple addresses support
* Profile image upload
* View order history

---

### Admin Dashboard

* Admin-only routes
* Manage:

  * Categories
  * Sub-Categories
  * Brands
  * Colors
  * Sizes
  * Tags
  * Products
  * Orders
  * Users
* Stock & order status control

---

## Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* Axios
* Context API
* React Router DOM

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Multer (Image Uploads)

---

## Project Structure

```
NexaMart/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   └── index.js
│
├── frontEnd/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── utils/
│   │   └── App.jsx
│   └── public/
│
├── package.json
└── README.md
```

---

## Installation & Setup

###  Clone Repository

```bash
git clone https://github.com/alamaftab9426/NexaMart.git
```

---

###  Backend Setup

```bash
cd backend
npm install
npm run dev
```

Create `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret_key
```

---

### Frontend Setup

cd frontEnd
npm install
npm run dev
```

---

## Security Practices

* JWT token validation
* Protected admin routes
* Environment variables for secrets
* Secure image upload handling

---

## Future Enhancements

* Online payment gateway integration
* Product reviews & ratings
* Wishlist improvements
* Order invoice generation
* Deployment (Vercel + Render)

---

##  Author

**Aftab Alam**
Full Stack Developer
GitHub: [alamaftab9426](https://github.com/alamaftab9426)

---

##  If you like this project

Give it a on GitHub — it motivates me to build more advanced projects 

