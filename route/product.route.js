import { Router } from 'express'
import { Product } from '../model/product.model.js';
import { isAuth } from '../middleware/isAuth.js';
import { isAdmin } from '../middleware/isAdmin.js';

export const productRouter = Router();

// Получить все товары
productRouter.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({ products })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Получить товар по id
productRouter.get('/:id', async (req,res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Товар не найден" })
        }
        res.status(200).json({ product })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Создать товар
productRouter.post('/', isAuth, isAdmin, async (req, res) => {
    try {
        const productData = {
            ...req.body,
            inStock: req.body.quantity > 0
        }
        const product = await Product.create(productData);
        res.status(201).json({ product })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// Изменить товар
productRouter.patch('/:id', isAuth, isAdmin, async (req,res) => {
    try {
        if (req.body.quantity !== undefined) {
            req.body.inStock = req.body.quantity > 0
        }
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true },
        );
        if (!product) {
            return res.status(404).json({ message: "Товар не найден" })
        }
        res.status(200).json({ product })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// Удалить товар
productRouter.delete('/:id', isAuth, isAdmin, async (req,res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id)
        if (!product) {
            return res.status(404).json({ message: 'Товар не найден' });
        }
        res.status(200).json({ message: 'Товар удален' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})