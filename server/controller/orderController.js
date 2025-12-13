import Order from "../models/Orders.js"
import Product from "../models/Product.js"
import stripe from 'stripe'
import User from '../models/User.js'

// Place order cod: /api/order/cod
export const placeOrderCOD = async(req, res) => {
    try{
        const userId = req.userId
        const {items, address} = req.body
        if(!address || items.length == 0){
            return res.json({success: false, message: "Invalid data"})
        }
        // calculate amount using items
        let amount = await items.reduce(async(acc, item) => {
            const product = await Product.findById(item.product)
            return (await acc) + product.offerPrice * item.quantity
        }, 0)

        // Add tax charge (2%)
        amount += Math.floor(amount * 0.02)

        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "COD",
        })
        // stripe gateway initialize
        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)
        // Create line items
        const line_items = productData.map((item) => {
            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: Math.floor(item.price + item.price * 0.02)* 100
                },
                quantity: item.quantity,
            }
        })

        // create session
        const session = await stripeInstance.checkout.sessions.create({
            line_items,
            mode: 'payment',
            success_url: `${origin}/loader?next=my-orders`,
            cancel_url: `${origin}/cart`,
            metadata: {
                orderId: order._id.toString(),
                userId,
            }
        })
        return res.json({success: true, url: session.url })
    } catch(error){
        return res.json({success: false, message: error.message})
    }
}



// Place Order stripe /api/order/stripe
export const placeOrderStripe = async(req, res) => {
    try{
        const userId = req.userId
        const {items, address, origin} = req.body

        if(!address || items.length == 0){
            return res.json({success: false, message: "Invalid data"})
        }

        // Get origin from request body, headers, or use fallback
        const frontendOrigin = origin || req.headers.origin || req.headers.referer?.split('/').slice(0, 3).join('/') || process.env.FRONTEND_URL || 'http://localhost:5173'

        let productData = []
        // calculate amount using items
        let amount = await items.reduce(async(acc, item) => {
            const product = await Product.findById(item.product)
            productData.push({
                name: product.name,
                price: product.offerPrice,
                quantity: item.quantity
            })
            return (await acc) + product.offerPrice * item.quantity
        }, 0)

        // Add tax charge (2%)
        amount += Math.floor(amount * 0.02)

        const order = await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "Online",
        })

        // Initialize Stripe
        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)
        
        // Create line items for Stripe checkout
        const line_items = productData.map((item) => {
            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: Math.floor(item.price + item.price * 0.02) * 100
                },
                quantity: item.quantity,
            }
        })

        // Create Stripe checkout session
        const session = await stripeInstance.checkout.sessions.create({
            line_items,
            mode: 'payment',
            success_url: `${frontendOrigin}/loader?next=my-orders`,
            cancel_url: `${frontendOrigin}/cart`,
            metadata: {
                orderId: order._id.toString(),
                userId,
            }
        })

        return res.json({success: true, url: session.url})
    } catch(error){
        return res.json({success: false, message: error.message})
    }
}

// Stripe webhooks to verify payments action: /stripe
export const stripeWebhooks = async(request, response) => {
    // Stripe gateway initilize
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)
    const sig = request.headers['stripe-signature'];
    let event;
    try{
        event = stripeInstance.webhooks.constructEvent(
            request.body,
            sig,
            process.env.STIPE_WEBHOOK_SECRET
        )
    } catch(error) {
        response.status(400).send(`Webhook Error: ${error.message}`)
    }

    // Handle the event 
    switch(event.type) {
        case "payment_intent.succeeded":{
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            // getting session metadata
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent : paymentIntentId
            })

            const { orderId, userId} = session.data[0].metadata;
            // Mark payment as Paid
            await Order.findByIdAndUpdate(orderId, {isPaid: true})
            // Clear user cart
            await User.findByIdAndUpdate(userId, {cartItems: {}})
            break;
        }
        case 'payment_intent.payment_failed' : {
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            // getting session metadata
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent : paymentIntentId
            })

            const { orderId } = session.data[0].metadata;
            await Order.findByIdAndDelete(orderId)
            break
        }

        default:
            console.error(`Unhandled event type ${event.type}`)
            break;
    }
    response.json({received: true})
}

// Get orders by user ID: /api/order/user
export const getUserOrders = async(req, res) => {
    try{
        const userId = req.userId
        const orders = await Order.find({
            userId,
            $or: [{paymentType: "COD"}, {isPaid: true}]
        }).populate("items.product address").sort({createdAt: -1})
        res.json({success: true, orders})
    } catch(error) {
        res.json({success: false, message: error.message})
    }
}

// Get all orders for seller/admin: /api/order/seller
export const getAllOrders = async(req, res) => {
    try{
        const orders = await Order.find({
            $or: [{paymentType: "COD"}, {isPaid: true}]
        }).populate("items.product address").sort({createdAt: -1})
        res.json({success: true, orders})
    } catch(error) {
        res.json({success: false, message: error.message})
    }
}

