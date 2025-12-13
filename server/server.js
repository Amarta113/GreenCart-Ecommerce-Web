import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/db.js';
import 'dotenv/config';
import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import connectCloudinary from './configs/cloudinary.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';
import { errorMiddleware } from './middlewares/error.js';
import { stripeWebhooks } from './controller/orderController.js';

const app = express();
const port = process.env.PORT || 4000;

// Initialize database and cloudinary connections
// For Vercel serverless: connections are lazy-loaded on first request
let dbConnected = false;
let cloudinaryConnected = false;

const initializeConnections = async () => {
    if (!dbConnected) {
        try {
            await connectDB();
            dbConnected = true;
        } catch (error) {
            console.error('Database connection error:', error);
            // Don't set dbConnected to true if connection failed
            // This allows retry on next request
            throw error; // Re-throw to prevent operations on unconnected DB
        }
    }
    if (!cloudinaryConnected) {
        try {
            await connectCloudinary();
            cloudinaryConnected = true;
        } catch (error) {
            console.error('Cloudinary connection error:', error);
            // Cloudinary is not critical for all operations, so we don't throw
        }
    }
};

// Allow multiple origins - include Vercel frontend URL
const allowedOrigins = [
    'http://localhost:5173',
    process.env.FRONTEND_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
    // Allow any Vercel preview/deployment URL
    /^https:\/\/.*\.vercel\.app$/
].filter(Boolean);

// Stripe webhook endpoint - must use raw body for signature verification
app.post('/stripe', express.raw({type:"application/json"}), stripeWebhooks)

// Middleware - initialize connections before handling requests
app.use(async (req, res, next) => {
    try {
        await initializeConnections();
        next();
    } catch (error) {
        // If database connection fails, return 500 error
        console.error('Connection initialization failed:', error);
        return res.status(500).json({
            success: false,
            message: 'Database connection failed. Please check server configuration.'
        });
    }
});

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, Postman, or same-origin)
        if (!origin) return callback(null, true);
        
        // Check if origin matches allowed origins (supports strings and regex)
        const isAllowed = allowedOrigins.some(allowed => {
            if (typeof allowed === 'string') {
                return origin === allowed;
            } else if (allowed instanceof RegExp) {
                return allowed.test(origin);
            }
            return false;
        });
        
        if (isAllowed) {
            callback(null, true);
        } else {
            // In development, allow all origins for easier testing
            if (process.env.NODE_ENV !== 'production') {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], 
    credentials: true
}));

app.get('/', (req, res) => res.send("API is working"))

app.use('/api/user', userRouter)
app.use('/api/seller', sellerRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/address', addressRouter)
app.use('/api/order', orderRouter)

app.use(errorMiddleware)

// For local development
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`server is running on http://localhost:${port}`)
    })
}

// Export for Vercel serverless functions
export default app;