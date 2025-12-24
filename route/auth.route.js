import { Router } from 'express'
import { User } from '../model/user.model.js';
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const authRouter = Router();

// Регистрация
authRouter.post('/register', async (req,res) => {
    try {
        const { login, password } = req.body
        if (!login || !password) {
            return res.status(400).json({ message: 'Логин и пароль обязательны' });
        }
        const existingUser = await User.findOne({ login })
        if (existingUser) {
            return res.status(400).json({ message: 'Пользователь уже существует' })
        }
        const hashedPassword = await bcryptjs.hash(password, 10)
        const user = await User.create({ login, password: hashedPassword })
        const token = await jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        res.cookie('token', token, { httpOnly: true })
        const { password: _, ...userData } = user.toObject();
        res.status(201).json({ userData, message: 'Пользователь создан' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

// Вход

authRouter.post('/login', async (req,res) => {
    try {
        const { login, password } = req.body;
        if (!login || !password) {
            return res.status(400).json({ message: 'Логин и пароль обязательны' });
        }
        const user = await User.findOne({ login })
        if (!user) {
            return res.status(400).json({ message: "Неверный логин или пароль" })
        }
        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Неверный логин или пароль" })
        }
        const token = await jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        res.cookie('token', token, { httpOnly: true })
        const { password: _, ...userData } = user.toObject();
        res.status(200).json({ userData, message: 'Успешный вход' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Выход
authRouter.post('/logout', async (req, res) => {
    try {
        res.clearCookie('token', { httpOnly: true });
        res.status(200).json({ message: "Успешный выход" });
    } catch (error) {
        res.status(500).json({ message: "Выход не осуществлен" })
    }
})

// Проверка подлинности пользователя

authRouter.get('/me', async (req,res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'Авторизация не пройдена'})
        }
        const payload = await jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(payload.userId)
        if (!user) {
            return res.status(400).json({ message: 'Пользователь не найден' })
        }

        const { password: _, ...userData } = user.toObject();

        res.status(200).json({ user: userData, message: 'Пользователь успешно прошёл авторизацию' })
    } catch (error) {
        res.status(401).json({ message: 'Не авторизован' })
    }
})