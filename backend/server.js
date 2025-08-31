
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import paymentRoutes from './routes/payement.js'

const app = express()

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())

// Routes
app.use('/api', paymentRoutes)

// MongoDB + Server
const PORT = process.env.PORT || 5000
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connected')
        app.listen(PORT, () => console.log(`Server running on ${PORT}`))
    })
    .catch(err => console.error(err))
