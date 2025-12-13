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
// Wrap in async function for Vercel serverless compatibility
(async () => {
    try {
        await connectDB();
        await connectCloudinary();
    } catch (error) {
        console.error('Initialization error:', error);
    }
})();

// Allow multiple origins
const allowedOrigins = ['http://localhost:5173']

// Stripe webhook endpoint - must use raw body for signature verification
app.post('/stripe', express.raw({type:"application/json"}), stripeWebhooks)

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    credentials: true}));

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