# GreenCart - Ecommerce Fullstack Website

A modern, full-featured ecommerce platform built with React and Node.js, featuring user authentication, product management, shopping cart, order processing, and Stripe payment integration.

## Features

### Customer Features
- 🔐 User authentication and authorization
- 🛍️ Browse products by categories
- 🔍 Product search and filtering
- 🛒 Shopping cart management
- 📦 Order management and tracking
- 📍 Multiple address management
- 💳 Secure payment processing with Stripe
- 📱 Responsive design

### Seller Features
- 🏪 Seller dashboard
- 📝 Product management (add, edit, delete)
- 📊 Order management
- 🖼️ Image upload with Cloudinary integration

##  Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications

### Backend
- **Node.js** - Runtime environment
- **Express 5** - Web framework
- **MongoDB** - Database (via Mongoose)
- **JWT** - Authentication tokens
- **Bcryptjs** - Password hashing
- **Multer** - File upload handling
- **Cloudinary** - Image storage and management
- **Stripe** - Payment processing
- **Cookie Parser** - Cookie handling

## 📁 Project Structure

```
GreenCart/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context providers
│   │   └── assets/        # Images and static assets
│   ├── public/            # Public assets
│   └── package.json
│
├── server/                # Backend Node.js application
│   ├── configs/          # Configuration files (DB, Cloudinary, Multer)
│   ├── controller/       # Route controllers
│   ├── middlewares/      # Express middlewares (auth, error handling)
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   └── server.js         # Entry point
│
└── package.json          # Root package.json
```




## API Endpoints

### User Routes (`/api/user`)
- `POST /register` - User registration
- `POST /login` - User login
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile

### Seller Routes (`/api/seller`)
- `POST /register` - Seller registration
- `POST /login` - Seller login
- `GET /profile` - Get seller profile

### Product Routes (`/api/product`)
- `GET /` - Get all products
- `GET /:id` - Get product by ID
- `POST /` - Create product (seller only)
- `PUT /:id` - Update product (seller only)
- `DELETE /:id` - Delete product (seller only)

### Cart Routes (`/api/cart`)
- `GET /` - Get user's cart
- `POST /` - Add item to cart
- `PUT /:id` - Update cart item
- `DELETE /:id` - Remove item from cart

### Address Routes (`/api/address`)
- `GET /` - Get user addresses
- `POST /` - Add address
- `PUT /:id` - Update address
- `DELETE /:id` - Delete address

### Order Routes (`/api/order`)
- `GET / ` - Get user orders
- `POST /` - Create order
- `POST /stripe` - Stripe webhook endpoint



## 📝 Development

- Frontend uses Vite for fast HMR (Hot Module Replacement)
- Backend uses nodemon for automatic server restarts during development
- ESLint is configured for code quality

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS configuration
- Environment variable protection
- Secure cookie handling


---

Built with ❤️ using React and Node.js
