import express from 'express'
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import { productRouter } from './route/product.route.js'
import { authRouter } from './route/auth.route.js'
import { categoryRouter } from './route/category.route.js'
import { cartRouter } from './route/cart.route.js'

import { fileURLToPath } from 'url'
import { join, dirname } from 'path'


const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config();
const app = express();

const PORT = process.env.PORT

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}))

app.use(express.json());
app.use(cookieParser());

app.use('/api/product', productRouter)
app.use('/api/auth', authRouter)
app.use('/api/category', categoryRouter)
app.use('/api/cart', cartRouter)

app.use(express.static(join(__dirname, 'dist')))

app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(join(__dirname, 'dist', 'index.html'))
})

const start = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI_LOCAL);

        app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
    } catch (error) {
        console.log(`Сервер не запущен`, error.message);
    }
}

start()
