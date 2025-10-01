
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import path from 'path'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
dotenv.config()

// Routes import
import paymentRoutes from './routes/paymentRoutes.js'
import authRoutes from './routes/authRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import inventoryRoutes from './routes/inventoryRoutes.js'
import productRoutes from './routes/productRoutes.js'
import checkoutRoutes from './routes/checkoutRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import auctionRoutes from './routes/auctionRoutes.js'
import bidRoutes from './routes/bidRoutes.js'
import auctionNotificationRoutes from './routes/auctionNotificationRoutes.js'
import staffPermissionRoutes from './routes/staffPermissionRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'

// cron
import { auctionLifecycleCron } from './cron/auctionCron.js'
import { auctionFinalizeCron } from './cron/auctionFinalizeCron.js'

// models
import User from './models/User.js'

import http from 'http'
import { Server } from 'socket.io'


const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
    }
})


app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url, "Origin:", req.headers.origin);
  next();
});

// Middleware
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://kimms-furniture-and-merchandise-mai-seven.vercel.app/"
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}))

app.options("*", cors());


app.use(express.json())
app.use("/uploads", express.static(path.join(process.cwd(), "/uploads"))); // serve image



// Routes
app.use('/api/payment', paymentRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/inventory', inventoryRoutes)
app.use('/api/products', productRoutes)
app.use('/api/checkout', checkoutRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/auctions', auctionRoutes)
app.use('/api/bids', bidRoutes)
app.use('/api/auction-notification', auctionNotificationRoutes)
app.use('/api/staff-permissions', staffPermissionRoutes)
app.use('/api/categories', categoryRoutes)





// hash password match testing
const testPassword = async () => {
    const hashed = '$2b$10$nL7l300trZVegcJFiQOpQ.J9I5oocqll71.rWqyxawvlPj9a.wWdC'
    const match = await bcrypt.compare('test', hashed)
    console.log(match)
}




// password hash comparing function
// testPassword()

// One time admin account creation
const createAdmin = async () => {
    const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (!existingAdmin) {
        const admin = new User({
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASS,
            fullName: 'Kimms.Admin',
            role: 'admin',
            isVerified: true,
            isLocal: true,
        });

        await admin.save();
        console.log('✅ Admin account created');
    } else {
        console.log('⚠️ Admin already exists');
    }
};




// MongoDB + Server
const PORT = process.env.PORT || 5000
mongoose.connect(process.env.MONGO_URI) // removed: connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('✅ MongoDB connected')
        await createAdmin();
        server.listen(PORT, () => console.log(`Server running on ${PORT}`))

        // start auction lifescycle cron job
        auctionLifecycleCron();

        // start auction finalize cron, using io for real-time notificaiton
        auctionFinalizeCron(io)
    }
)
.catch(err => console.error(err))





// socket.io connection for debugging
io.on('connection', (socket) => {
    console.log('New client connected', socket.id)

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id)
    })
})
